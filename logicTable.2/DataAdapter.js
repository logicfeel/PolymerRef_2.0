// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Connection() {

}
(function() {   // prototype 상속
    Connection.prototype.open = function() {};
    Connection.prototype.close = function() {};    
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// @종속성 :  DOM, Connection
function ContainerConnection(pSelecter) {

    var _element = null;

    _element = document.querySelector(pSelecter);

}
(function() {   // prototype 상속
    ContainerConnection.prototype =  Object.create(Connection.prototype);
    ContainerConnection.prototype.constructor = ContainerConnection;
    ContainerConnection.prototype.parent = Connection.prototype;
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// @종속성 : JQuery, Connection
// REVIEW: 이후에 종속성 제거 검토
function AjaxConnection(pUrl, pData, pCallback) {

}
(function() {   // prototype 상속
    AjaxConnection.prototype =  Object.create(Connection.prototype);
    AjaxConnection.prototype.constructor = AjaxConnection;
    AjaxConnection.prototype.parent = Connection.prototype;
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Command() {

    // 테이터 구조를 가지며면 될듯...
}
(function() {   // prototype 상속
    this.dataAdapter = null;
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// @종속성 : Command
function ContainerCommand() {

}
(function() {   // prototype 상속
    ContainerCommand.prototype =  Object.create(Command.prototype);
    ContainerCommand.prototype.constructor = ContainerCommand;
    ContainerCommand.prototype.parent = Command.prototype;
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// @종속성 : Command
function AjaxCommand() {

}
(function() {   // prototype 상속
    AjaxCommand.prototype =  Object.create(Command.prototype);
    AjaxCommand.prototype.constructor = AjaxCommand;
    AjaxCommand.prototype.parent = Command.prototype;
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// 추상 클래스 역활
function DataAdapter() {

}
(function() {   // prototype 상속

    DataAdapter.prototype.insertCommand  = null;
    DataAdapter.prototype.updateCommand  = null;
    DataAdapter.prototype.deleteCommand  = null;
    DataAdapter.prototype.selectCommand  = null;

    // DS.tables.changes => A.D 반영
    DataAdapter.prototype.fill = function(pDataSet, pTableName) {

        var cTables = null;
        
        if (pTableName) {
            cTables = pDataSet.tables[pTableName].getChanges();
            cTables = [cTables];    // 이중배열 처리    
        } else {
            cTables = pDataSet.getChanges();
        }

        for (var i = 0; i < cTables.length; i++) {
            for (var ii = 0; ii < cTables[i].changes.length; ii++) {
                switch (cTables[i].changes[ii].cmd) {
                    case "I":
                        this.insertCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                        break;
                    case "D":
                        this.updateCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                        break;
                    case "U":
                        this.deleteCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                        break;
                    case "S":
                        this.selectCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                        break;
                    default:
                        throw new Error('cmd 에러 발생 cmd:' + cTables[i].cmd);
                }
            }
        }
    };

    // A.D  => D.S 전체 채움
    DataAdapter.prototype.update = function(pDataSet, pTableName) {};

}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// @종속성 : HTML DOM, DataAdapter
// 컨테이너 삽입 방식
// 템플릿 방법 
// - [추천] <scirpt> 태그 방식     
// - [추천] handlebrs 라이브러리 사용 방식  {{url}}
// - [검토] <template> 방식 : 호환성 문제
//      장점 : querySelector 를 통한 접근이 쉬움
//      단점 : 브라우저 호환성 문제 특히 IE
// - %s 문자열 교체 방식 
// - 주석 
//      장점 : 단순한 구조 임
//      단점 : 복잡한 구조 사용에 코드가 지져분해짐
// - 서버 가져오기
function ContainerAdapter() {

    this.putElement     = null;                     // 붙일 위치
    this.element        = null;                     // TemplateElement : 컨테이너 
    this.template       = new TemplateElement(this);
    this.tables         = new LArray();

    // tables 에 이전 레코드 찾기
    // pOnwerTableObject : 기준(소유) 테이블 객체
    ContainerAdapter.prototype._beforeRecord = function(pOnwerTableObject) {
        
        var idx = -1;
        var selector = null;
        var selectorLoop = null;
        var before = [];
        idx = this.tables.indexOf(pOnwerTableObject);
        selector = pOnwerTableObject.mainSlotSelector;

        // 이전 등록된 테이블 과 비교 함
        for (var i = 0; i < this.tables.length; i++) {

            selectorLoop = this.tables[i].mainSlotSelector;

            if (common.querySelecotrOuter(this.template._element, selector) ===
                common.querySelecotrOuter(this.template._element, selectorLoop)) {
                    before.push(this.tables[i]);
                }
        }
        return before;
    };

    // 컨테이너 객체 초기화
    ContainerAdapter.prototype._countRecord = function(pArray) {
        
        var count = 0;

        for (var i = 0; i < pArray.length; i++) {
            count = count + pArray[i].recoredCount;
        }
        return count;
    }

    // 컨테이너 객체 초기화
    ContainerAdapter.prototype.clear = function() {
        this.putElement     = null;     // 붙일 위치
        this.element        = null;
        this.template       = new TemplateElement(this);
        this.tables         = new LArray();
    };

    ContainerAdapter.prototype.insertTable = function(pTableName, pSelector) {
        
        
        var _refElem = null;
        var tableObject = {};

        // this.template.element 선택슬롯을 잘라냄
        common.cutElement(this.template._element, pSelector, true);

        // TODO: 필수 값 처리,  selector 는 없을때 로직
        // TODO: _refElem null 예외처리
        _refElem = common.querySelecotrOuter(this.template._element, pSelector);

        tableObject.mainSlot = _refElem;
        tableObject.mainSlotSelector = pSelector;
        tableObject.recordElement = new TemplateElement(this);
        tableObject.columnElement = new TemplateElement(this);
        tableObject.beforeRecord = this._beforeRecord(tableObject);
        tableObject.recoredCount = 0;
        

        this.tables.pushAttr(tableObject, pTableName);
    };
    
    ContainerAdapter.prototype.deleteTable = function(pTableName) {
        this.tables.popAttr(npTableName);
    };

    // // 컨테이너 추가[사이 추가 포함]
    // ContainerAdapter.prototype.appendContainer = function(pTableName, pDataRow, pIdx) {

    //     var container = this.createContainer(pDataRow);        
        
    //     if (this.recordElement !== null && this.recordElement instanceof HTMLElement) {
            
    //         if (pIdx && typeof pIdx === "number") {
    //             this.container.insertBefore(container, this.container.childNodes[pIdx]);
    //         } else {
    //             this.container.appendChild(container);
    //         }
    //     }
    // };

    // pSlot 선택요소 : 없을시 [0] 번 선택됨
    ContainerAdapter.prototype.appendContainer = function(pTableName, pSlot) {
    };

    ContainerAdapter.prototype.createContainer = function(pTableName) {
    };

    ContainerAdapter.prototype.createRecord = function(pTableName) {
    };

    ContainerAdapter.prototype.appendRecord = function(pTableName) {
    };

    ContainerAdapter.prototype.replaceRecord = function(pTableName) {
    };

    ContainerAdapter.prototype.removeRecord = function(pTableName) {
    };

    ContainerAdapter.prototype.createColumn = function(pTableName) {
    };

    // pMainSlotName : 선택값
    ContainerAdapter.prototype.insertCommand = function(pTableName, pDataRow, pIdx) {
        
        var slotIdx = -1;

        // TODO: 기본검사 상위에 둬야 함
        if (!this.template) {
            throw new Error('template 객체 없음 에러! pTableName:');
        }

        // 슬롯이 없을경우 기본 슬롯 생성
        // if (this.template.slot) {
        //     this.template.defaultSetSlot();
        // }

        // TODO: 검사 해야 함
        if (!this.tables[pTableName]) {
            throw new Error('pTableName 또는  container 객체 없음 에러! pTableName:' + pTableName);            
        }

        // ***********
        // 메인 컨테이너 : table
        var mainElement         = null;
        var mainSlotSelector    = null;
        var mainSlot            = null;

        var record              = null;
        var recordSlotSelector  = null;
        var recordSlot          = null;
        var record_clone        = null;
        var recordSlot_clone    = null;
        
        var column              = null;
        var columnSlotSelector  = null;
        var columnSlot          = null;
        var column_clone        = null;
        var columnSlot_clone    = null;
        
        var TextElem            = null;

        
        var isEquelRowCantiner  = false;    // 로우와 컨테이너 같은 유무
        var equalRow            = null;
        var equalContainer      = null;

        mainElement         = this.template._element;
        mainSlotSelector    = this.tables[pTableName].mainSlotSelector;            
        mainSlot            = this.tables[pTableName].mainSlot;

        record              = this.tables[pTableName].recordElement._element;
        recordSlotSelector  = this.tables[pTableName].recordElement.slotSelector;
        recordSlot          = this.tables[pTableName].recordElement.slot;

        column              = this.tables[pTableName].columnElement._element;            
        columnSlotSelector  = this.tables[pTableName].columnElement.slotSelector;
        columnSlot          = this.tables[pTableName].columnElement.slot;

        // !! 위치 중요 최 상위에 와야함
        // 이후에 mainElement 값이 변형되기 때문
        // 1. 메인슬롯  == 레코드슬롯  셀렉터로 가져옴 비교
        equalContainer  = common.querySelecotrOuter(this.template._original, mainSlotSelector);
        equalRow        = common.querySelecotrOuter(this.template._original, recordSlotSelector);
        if (equalContainer.isEqualNode(equalRow)) {
            isEquelRowCantiner  = true;
        }
        // REVIEW: 강제 테스트 모드
        // REVIEW: 이후에 설정으로 노출 하면 좋을듯..
        // isEquelRowCantiner = false;

        // ***************************
        // 테이블에 대한 메인 컨테이너 설정
        // 최초 로딩과 이후 분리 조건
        if (this.element) {
            mainElement = this.element;
            mainSlot    = common.querySelecotrOuter(this.element, mainSlotSelector);
        }

        // ***************************
        // 레코드 복제 생성 및 참조 재등록
        //  - 레코드가 없는 경우 
        //  - 컨테이너와 레코드가 같은 경우
        // if (mainElement.outerHTML === record.outerHTML) {
        //     record_clone      = mainElement;
        //     recordSlot_clone  = mainSlot;
        //     console.log('같음');
        // } else {
            record_clone      = record.cloneNode(true);
            recordSlot_clone  = common.querySelecotrOuter(record_clone, recordSlotSelector);
        // }

        var bindInsertRecord = _insertRecord.bind(this);

        // ***************************
        // 컬럼 설정
        for (var i = 0; i < pDataRow.length; i++) {

            // TODO: 컬럼에 slot 에 추가해야함
            // TODO: 컬럼의 데이터타입에 따른 분기 필요
            TextElem = document.createTextNode(pDataRow[i]);

            column_clone = column.cloneNode(true);   // REVIEW: 내부에 태그 있는 경우? 
            column_clone.appendChild(TextElem);
// 디버깅
// if (pDataRow[i] == "10번내용 - 중간수정" || pDataRow[i] == "20번내용 - 중간수정" || pDataRow[i] == "30번내용 - 중간수정" ) {
//     console.log('TextElem');
// }
            if (!isEquelRowCantiner) {
                recordSlot_clone.appendChild(column_clone);
            } else {
                bindInsertRecord(column_clone, i);
            }
        }

        if (!isEquelRowCantiner) {
            bindInsertRecord(record_clone);
        }
            // 내부 함수
        function _insertRecord(pRecord, pColumnCnt) {
            
            var beforeRecordCount   = 0;
            var elementIdx          = 0;

            pColumnCnt = pColumnCnt || 0;
            // **************************
            // 레코드 위치 관리
            // 병합 관점 레코드 카운터 가져오기
            beforeRecordCount = this._countRecord(this.tables[pTableName].beforeRecord);

            // pIdx 가 없거나 정수 타입이 아니면 기본값 0 설정
            if (!pIdx || typeof pIdx !== "number") {
                pIdx = 0;
            }

            if (isEquelRowCantiner) {
                elementIdx = pIdx ? (pIdx * pDataRow.length) - 1 : 0;    // REVIEW: 길이를 다른곳에 가져오는것 검토
            }
// 디버깅
if (pIdx == 0 ) {
    console.log('pIdx == 0');
}
            // REVIEW : 방식에 따라서 fill 위치와 연관 있음 => 당연한 결과
            // (pIdx)인덱스 값 + (beforeRecordCount)이전레코드 수 + 컬럼=>레코드 변환 누적카운터
            mainSlot.insertBefore(pRecord, mainSlot.childNodes[pIdx + elementIdx + beforeRecordCount + pColumnCnt]);
            
            // 레코드 카운터 추가
            // 삭제 변경시 관리 해야 함
            // REVIEW: 오타 수정해야함 => recoredCount
            this.tables[pTableName].recoredCount++;  
        }

        if (!this.element) {
            this.element = mainElement;
            this.putElement.appendChild(this.element);
        }
        /**
         * TODO: 레코드 미지정 경우에 활용 가능함 , 입력값에 따른 검사 필요
         */

        // TODO: importTemplate() 메인에서는 입력값이 1개입 레코드와, 컬럼 통일성 체크
    };

    ContainerAdapter.prototype.deleteCommand = function(pTableName, pIdx) {
    };

    ContainerAdapter.prototype.updateCommand = function(pTableName, pDataRow, pIdx) {
    };

    ContainerAdapter.prototype.selectCommand = function(pTableName) {
    };

    // 요소 생성
    ContainerAdapter.prototype.createElement = function(pValue) {
        
        var elem    = null;
        var clone   = null;
        
        if (this.element === null) {
            elem = document.createTextNode(pValue);
        } else {
            clone = this.element.cloneNode(false); // REVIEW: deep 통일 또는 노출 필요!
            clone.innerHTML = pValue;
            // clone.innerText = pValue;    // 내부에 또다른 추가
            elem = clone;
        }
        return elem;
    };

    // 컬럼 생성
    ContainerAdapter.prototype.createColumnElements = function(pDataRow) {

        var colums = [];
        var elem    = null;
        var clone   = null;

        if (this.container !== null && this.container instanceof HTMLElement) {
            
            for (var i = 0; i < pDataRow.length; i++) {
                elem = this.createElement(pDataRow[i]);
                clone = this.columnElement.cloneNode(false); // REVIEW: deep 통일 또는 노출 필요!
                clone.appendChild(elem);
                colums.push(clone);
            }
        }
        return colums;
    };


    // **********************************
    ContainerAdapter.prototype.createContainer = function(pTableName, pDataRow, pIdx) {
        
        var clone = null;
        var columns = this.createColumnElements(pTableName, pDataRow);

        clone = this.recordElement.cloneNode(false);    // REVIEW: 나중에 확인 필요
        
        // TODO: 배열검사
        for (var i = 0;  i < columns.length; i++) {
            clone.appendChild(columns[i]);
        }
        return clone;
    };
    
    // 컨테이너 추가[사이 추가 포함]
    ContainerAdapter.prototype.appendContainer = function(pTableName, pDataRow, pIdx) {

        var container = this.createContainer(pDataRow);        
        
        if (this.recordElement !== null && this.recordElement instanceof HTMLElement) {
            
            if (pIdx && typeof pIdx === "number") {
                this.container.insertBefore(container, this.container.childNodes[pIdx]);
            } else {
                this.container.appendChild(container);
            }
        }
    };

    ContainerAdapter.prototype.replaceContainer = function(pTableName, pDataRow, pIdx) {};
    ContainerAdapter.prototype.removeContainer = function(pTableName, pDataRow, pIdx) {};

    // this.insertCommand  = ContainerAdapter.prototype.appendContainer;
    this.updateCommand  = ContainerAdapter.prototype.replaceContainer;
    this.deleteCommand  = ContainerAdapter.prototype.replaceContainer;
}
(function() {   // prototype 상속
    ContainerAdapter.prototype =  Object.create(DataAdapter.prototype);
    ContainerAdapter.prototype.constructor = ContainerAdapter;
    ContainerAdapter.prototype.parent = DataAdapter.prototype;    
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// pObjct : Element, selector => X 없음
// 종속성 : DOM Element
// TODO: Selector 필수 값 처리
// function Table(pSelector, pRecordElement, pColumnElement) {
    
//     // this.containerElement   = pContainerElement || new TemplateElement();
//     var _refElem = null;
    
//     _refElem = common.querySelecotrOuter(this.element, pSelector);
    
//     this.mainSlot           = _refElem;
//     this.recordElement      = pRecordElement ||  new TemplateElement();
//     this.columnElement      = pColumnElement ||  new TemplateElement();

//     // TODO:  refElem 없을시 오류 처리
// }
// (function() {   // prototype 상속
    
// }());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// pObjct : Element, selector => X 없음
// 종속성 : DOM Element
function TemplateElement(pParentObject) {

    this._parent            = pParentObject;
    this._original          = null;
    this._elemTemp          = null;
    this._element           = null;
    this.slot               = null;
    this.slotSelector       = null;
    // this.deep       = pIsDeep || true;       // REVIEW : 불필요 

    // 객체 생성 빌더
    // if (typeof pObject === "string") {
    //     _elemTemp = document.querySelector(pObject);
    // }
    // if (pObject instanceof Element) {
    //     _original = pObject.cloneNode(this.deep);
    //     this.element = _original.cloneNode(this.deep);
    // } else {
    //     throw new Error('pObject 오류 : pObject=' + pObject);
    //     return null;
    // }


    // span 태그 기본으로 추가됨 (body 역활)
    function _importCommit(pObject) {

        var elem =  document.createElement('span');

        elem.innerHTML = pObject.nodeValue;
        
        // return elem.firstChild;  // span 제거 할 경우
        elem = elem.querySelector("*");
        // return elem.querySelector("*");

        return elem;
    }

    function _importScript(pObject) {
        return null;
    }

    function _importTemplate(pObject) {
        return null;
    }

    function _importElement(pObject) {
        
        return pObject.cloneNode(true);
    }

    function _importText(pObject) {
        return null;
    }
    
    // 초기화
    TemplateElement.prototype.clear = function() {
        
        this._original          = null;     
        this._elemTemp          = null;
        this.element            = null;
        this.slot               = null;
        this.slotSelector       = null;
        // this.deep               = pIsDeep || true;      // REVIEW : 불필요 
    };

    TemplateElement.prototype.importTemplate = function(pObject, pSelector) {
        
        var elem        = null;

        // 슬롯 초기화
        this.clear();

        // 주석        
        if (pObject.nodeType === 8) {                       
            
            elem = _importCommit(pObject);

        // 스크립트
        } else if (pObject instanceof HTMLScriptElement) {      

            elem = _importScript(pObject);

        // 템플릿
        // TODO: 태그 이름으로 해야함,  IE 호환성 이슈
        } else if (pObject.content) {
        
            elem = _importTemplate(pObject);

        // HTML 요소
        } else if (pObject instanceof HTMLElement) {

            elem = _importElement(pObject);

        // 텍스트    
        } else if (typeof pObject === "string") {

            elem = _importText(pObject);

        } else {
            throw new Error('pObject 타입 오류 : pObject=' + pOriginal);
            return null;
        }
        
        // 리턴 및 this 설정
        this._element    = elem;
        this._original  = elem.cloneNode(true); // 복제본 삽입
        
        // 셀렉터 있는 경우 main 이외
        if (pSelector) {
            
            common.cutElement(this._element, pSelector, true);
            
            var _refElem = null;

            _refElem = common.querySelecotrOuter(this._element, pSelector);

            this.slot = _refElem;
            this.slotSelector = pSelector;            
        }
        
        return elem;
    }
    
    // 최상위를 슬롯 배치
    TemplateElement.prototype.defaultSetSlot = function() {
        
        var firstNodeSelector = "";

        if (this._original) {

            firstNodeSelector = String(this._original.nodeName);
            firstNodeSelector = firstNodeSelector.toLowerCase();
            this._setSlot(firstNodeSelector);

            return true;

        } else {
            // 에외 처리
        }
        return false;
    }
    
    // 슬롯이 추가되고 자식은 삭제됨
    TemplateElement.prototype._setSlot = function(pSelector) {
        
        var refElem = null;
        
        // 레퍼방식으로 querySelector        
        refElem = common.querySelecotrOuter(this._element, pSelector);
        this.slot = refElem;
        this.slotSelector = pSelector

        // 자식 노드 삭제
        var maxLength = refElem.childNodes.length;
        for (var i = maxLength - 1; i >= 0; i--) {  // NodeList 임
            refElem.removeChild(refElem.childNodes[i]);
        }
    };
    
    // 슬롯이 삭제되고 원본에서 자식이 복구됨
    // TODO: 삭제 대기
    TemplateElement.prototype.deleteSlot = function(pSlotName) {
        
        var selector = this.slot[pSlotName].S_Selector;
        var refElem = this._element.querySelector(selector);
        var orgElem = this._original.querySelector(selector);

        // 슬롯 삭제
        for (var i = 0; i < refElem.length; i++) {  // NodeList 임
            refElem.removeChild(refElem.childNodes[i]);
        }
        
        // 슬롯 삭제
        this.slot.popAttr(pSlotName);

        // 기존 복구
        for (var i = 0; i < orgElem.length; i++) {  // NodeList 임
            this._element.appendChild(orgElem.childNodes[i]);
        }

    };
    
    // css class 등록
    TemplateElement.prototype.insertCSS = function(pDataSet, pClassName) {};
    
    // css class 제거
    TemplateElement.prototype.deleteCSS = function(pDataSet, pClassName) {};

}
(function() {   // prototype 상속
    
}());


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// @종속성 : DataAdapter, Ajax 관련
function AjaxAdapter() {

}
(function() {   // prototype 상속
    AjaxAdapter.prototype =  Object.create(DataAdapter.prototype);
    AjaxAdapter.prototype.constructor = AjaxAdapter;
    AjaxAdapter.prototype.parent = DataAdapter.prototype;    
}());






