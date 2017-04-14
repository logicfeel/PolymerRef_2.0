
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

/**
 * 발신 자료 타입 : 
 * 발신 자료 :
 * 수신 자료 타입 : 
 * 수신 자료 :
 */

var __org       = "key=2&value=34";
var __send_Get  = "key=2&value=34";
var __send_Post = "key=2&value=34";


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// 추상 클래스 역활
function DataAdapter() {
    
    this.isDebug        = false;
    this._event         = new Observer(this, this);
    this._tableMapping  = [];
    this.eventList      = ["fill", "update"];
    this.onFilled       = null;       // 완료후 호출 (pDataSet, pTableName)
    this.onUpdated      = null;        // 완료후 호출 (pDataSet, pTableName)

}
(function() {   // prototype 상속

    DataAdapter.prototype.insertCommand  = null;
    DataAdapter.prototype.updateCommand  = null;
    DataAdapter.prototype.deleteCommand  = null;
    DataAdapter.prototype.selectCommand  = null;

    // 테이블 매핑
    DataAdapter.prototype._setTableMapping = function(pAdapterTableName, pDataTableName) {
        
        var tableMapping = {
            adapter: pAdapterTableName,
            datatable: pDataTableName
        };

        // adapter 테이블 기준으로 매핑 (기존에 있는경우)
        for (var i = 0; i < this._tableMapping.length; i++) {
            if (this._tableMapping[i].adapter === pAdapterTableName) {
                this._tableMapping[i].pDataTableName;
                return;
            }
        }
        this._tableMapping.push(tableMapping);
    };
    
    DataAdapter.prototype.getAdapterName = function(pDataTableName) {

        for (var i = 0; i < this._tableMapping.length; i++) {
            if (this._tableMapping[i].datatable === pDataTableName) {
                return this._tableMapping[i].adapter;
            }
        }
        return pDataTableName;
    };

    // DS.tables.changes => A.D 반영
    DataAdapter.prototype.fill = function(pDataSet, pTableName, pAdapterName) {

        var tableName = null;
        var aTable  = "";

        if (pAdapterName) {
            this._setTableMapping(pAdapterName, pTableName);
        }
        
        // 분기: 지정 talble => DS 채움
        if (pTableName) {
            aTable = this.getAdapterName(pTableName);
            this.selectCommand(aTable, pDataSet.tables[pTableName]);
        
        // 분기: 전체 table => DS 채움
        } else {
            for (var i = 0; i < this.tables.length; i++) {
                
                tableName = this.tables.attributeOfIndex(i);
                
                this.selectCommand(tableName, pDataSet.tables[pTableName]);
            }
        }

        if (typeof this.onFilled === "function" ) {
            this.onFilled.call(this, pDataSet, pTableName);
        }
        this._event.publish("fill");
    };

    // A.D  => D.S 전체 채움
    DataAdapter.prototype.update = function(pDataSet, pTableName, pAdapterName) {

        var cTables = null;
        var aTable  = "";

        if (pAdapterName) {
            this._setTableMapping(pAdapterName, pTableName);
        }

        // DS 지정 테이블 update
        if (pTableName) {
            cTables = pDataSet.tables[pTableName].getChanges();
            cTables = [cTables];    // 이중배열 처리    
        
        // DS 전체 update
        } else {
            cTables = pDataSet.getChanges();
        }

        for (var i = 0; i < cTables.length; i++) {
            for (var ii = 0; ii < cTables[i].changes.length; ii++) {
                
                aTable = this.getAdapterName(cTables[i].table);
                
                switch (cTables[i].changes[ii].cmd) {
                    case "I":       // update() commanad
                        this.insertCommand(aTable, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                        // this.insertCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                        break;
                    case "D":       // update() commanad
                        this.updateCommand(aTable, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                        // this.updateCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                        break;
                    case "U":       // update() commanad
                        this.deleteCommand(aTable, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                        //  this.deleteCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                        break;
                    // case "S":       // fill() commanad
                    //      this.selectCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                    //     break;
                    default:
                        throw new Error('cmd 에러 발생 cmd:' + cTables[i].cmd);
                }
            }
        }

        if (typeof this.onUpdated === "function" ) {
            this.onUpdated.call(this, pDataSet, pTableName);
        }
        this._event.publish("update");
    };

    // 이벤트 등록
    DataAdapter.prototype.onEvent = function(pType, pFn) {
        if (this.eventList.indexOf(pType) > -1) {
            this._event.subscribe(pFn, pType);
        } else {
            throw new Error('pType 에러 발생 pType:' + pType);
        }
    }

    // 이벤트 해제
    DataAdapter.prototype.offEvent = function(pType, pFn) {
        if (this.eventList.indexOf(pType) > -1) {
            this._event.unsubscribe(pFn, pType);
        } else {
            throw new Error('pType 에러 발생 pType:' + pType);
        }
    }

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
    DataAdapter.call(this);
    
    this.isDebug        = false;
    this.putElement     = null;                     // 붙일 위치
    this.element        = null;                     // TemplateElement : 컨테이너 
    this.template       = new TemplateElement(this);
    this.tables         = new LArray();

    this.eventList.push("inserted", "deleted", "updated", "selected")
}
(function() {   // prototype 상속
    ContainerAdapter.prototype =  Object.create(DataAdapter.prototype);
    ContainerAdapter.prototype.constructor = ContainerAdapter;
    ContainerAdapter.prototype.parent = DataAdapter.prototype;    

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
            count = count + pArray[i].recordCount;
        }
        return count;
    }

    ContainerAdapter.prototype._getTableInfo = function(pTableName) {

        var mainElement         = null; 
        var mainSlot            = null;
        var mainSlotSelector    = this.tables[pTableName].mainSlotSelector;
        var hasRecord           = this.tables[pTableName].recordElement._element ? true : false;
        var hasElement          = this.element ? true : false;
        var hasRecordSubSlot    = this.tables[pTableName].recordElement.subSlot ? true : false;
        var hasColumnSubSlot    = this.tables[pTableName].columnElement.subSlot ? true : false;

        if (hasElement) {
            mainElement         = this.element;
            mainSlot            = common.querySelecotrOuter(this.element, mainSlotSelector);
        } else {
            mainElement         = this.template._element.cloneNode(true);
            mainSlot            = common.querySelecotrOuter(mainElement, mainSlotSelector);
        }

        return {
            mainElement: mainElement,
            mainSlot: mainSlot,
            mainSlotSelector: mainSlotSelector,
            hasRecord: hasRecord,
            hasElement: hasElement,
            hasRecordSubSlot: hasRecordSubSlot,
            hasColumnSubSlot: hasColumnSubSlot
        };
    }

    // 레코드가 유무와 상관없이 호출함
    ContainerAdapter.prototype._equelRowCantiner = function(pTableName) {

        var container           = null;
        var row                 = null;
        var mainSlotSelector    = null;
        var recordSlotSelector  = null;

        if (!this.tables[pTableName].recordElement._element) return true;

        mainSlotSelector    = this.tables[pTableName].mainSlotSelector;            
        recordSlotSelector  = this.tables[pTableName].recordElement.slotSelector;

        container  = common.querySelecotrOuter(this.template._original, mainSlotSelector);
        row        = common.querySelecotrOuter(this.template._original, recordSlotSelector);
        
        if (container.isEqualNode(row)) {
            return true;
        } else{
            return false;
        }
    }

    // 콜백 호출
    ContainerAdapter.prototype._callbackManager = function(pCallback, pRowValue, pColumnIdx, pDataRow, pColumClone) {
        
        var columnChild         = null;
        
        if (pCallback && typeof pCallback === "function") {
            columnChild = pCallback.call(this, pRowValue, pColumnIdx, pDataRow, pColumClone);
        } else {
            columnChild = document.createTextNode(pRowValue);
        }
        return columnChild;
    };

    ContainerAdapter.prototype._attachManager = function(pTableName, pRecord, pIdx, pRecordCount, pDataRow) {

        var info                = this._getTableInfo(pTableName);
        var beforeRecordCount   = 0;
        var elementIdx          = 0;
        var index               = 0;

        pRecordCount = pRecordCount || 0;

        // 병합 관점 레코드 카운터 가져오기 (레코드 위치 관리)
        beforeRecordCount = this._countRecord(this.tables[pTableName].beforeRecord);

        // pIdx 가 없거나 정수 타입이 아니면 기본값 0 설정
        if (!pIdx || typeof pIdx !== "number") {
            pIdx = 0;
        }

        if (!info.hasRecord) {
            elementIdx = pIdx ? (pIdx * pDataRow.length) : 0;
        }
        
        // (pIdx)인덱스 값 + (beforeRecordCount)이전레코드 수 + 컬럼=>레코드 변환 누적카운터
        index = elementIdx + beforeRecordCount + pRecordCount + pIdx;

        // REVIEW : 방식에 따라서 fill 위치와 연관 있음 => 당연한 결과
        info.mainSlot.insertBefore(pRecord, info.mainSlot.childNodes[index]);
        
        // 레코드 카운터 추가 (!삭제 변경시 관리 해야 함)
        this.tables[pTableName].recordCount++;  

        if (!info.hasElement) {
            this.element = info.mainElement;
            this.putElement.appendChild(this.element);
        }
    };

    ContainerAdapter.prototype._createContainer = function(pTableName, pDataRow, pIdx) {

        var info                = this._getTableInfo(pTableName);
        var equelRowCantiner    = this._equelRowCantiner(pTableName);
        var record              = null;

        // [O, -, -, -] : 레코드 = 메인컨테이너 같음 유무  (공통: 로우블럭X)
        if (equelRowCantiner) {
            
            // [O, O, -, -] : 레코드 유무
            if (info.hasRecord) {
                
                // 로우 블럭 제거 로직
                record = this._recordManager(pTableName, pDataRow);
                this._attachManager(pTableName, record, pIdx);

            // [O, X, -, -] :    
            } else {

                // [O, X, X, O]  레코드 서브 무조건 없음
                if (info.hasColumnSubSlot) {
                    record = this._createColumnSubSlot(pTableName, pDataRow);
                    this._attachManager(pTableName, record, pIdx, i);
                
                // [O, X, X, X]  레코드 서브 무조건 없음    
                } else {
                    for (var i = 0; i < pDataRow.length; i++) {
                        record = this._createColumn(pTableName, pDataRow[i], pDataRow);
                        this._attachManager(pTableName, record, pIdx, i, pDataRow);
                    }
                }
            }

        // [X, -, -, -]
        } else {

            // [X, O, -, -] : 레코드 유무  (레코드 무조건 있음)
            if (info.hasRecord) {
                record = this._recordManager(pTableName, pDataRow);
                this._attachManager(pTableName, record, pIdx);
            }            
        }
    }

    ContainerAdapter.prototype._replaceContainer = function(pTableName, pDataRow, pIdx) {
        
        // TODO: 삭제 후 생성 (테스트 필요)
        this._removeContainer(pTableName, pDataRow, pIdx);
        this._createContainer(pTableName, pDataRow, pIdx);
    };

    ContainerAdapter.prototype._removeContainer = function(pTableName, pDataRow, pIdx) {
        // TODO: 삭제 로직
    };

    ContainerAdapter.prototype._selectContainer = function(pTableName, pDataRow, pIdx) {
        // TODO: 조회 로직
    };

    ContainerAdapter.prototype._recordManager = function(pTableName, pDataRow) {

        var info            = this._getTableInfo(pTableName);
        var createRow       = this._createRecord(pTableName);

        // 분기 : 레코드 생성 | 레코드슬롯 생성
        if (info.hasRecordSubSlot) {
            this._createRecordSubSlot(createRow.recordSlot, pTableName, pDataRow);
        } else {
            this._columnManager(createRow.recordSlot, pTableName, pDataRow);
        }
        return createRow.record;
    };

    ContainerAdapter.prototype._createRecord = function(pTableName) {
        
        var info                = this._getTableInfo(pTableName);
        var equelRowCantiner    = this._equelRowCantiner(pTableName);
        var record              = null;
        var recordSlotSelector  = null;
        var slotSelector        = null;
        
        // 레코드는 복제해서 생성
        if (equelRowCantiner) {
            record              = this.template._element.cloneNode(true);
            recordSlotSelector  = this.tables[pTableName].mainSlotSelector
            recordSlot          = common.querySelecotrOuter(record, recordSlotSelector);
        } else {
            record              = this.tables[pTableName].recordElement._element.cloneNode(true);
            recordSlotSelector  = this.tables[pTableName].recordElement.slotSelector;
            recordSlot          = common.querySelecotrOuter(record, recordSlotSelector);
        }

        return {
            record: record,
            recordSlotSelector: recordSlotSelector,
            recordSlot: recordSlot
        };
    };

    ContainerAdapter.prototype._createRecordSubSlot = function(pSlot, pTableName, pDataRow) {

        // 컬럼 메니저 호출
        // TODO: 레코드 for
        var column = this._columnManager(pSlot, pTableName, pDataRow);

    };

    // 레코드가 유무와 상관없이 호출함
    ContainerAdapter.prototype._columnManager = function(pSlot, pTableName, pDataRow) {
        
        var hasColumnSubSlot    = this.tables[pTableName].columnElement.subSlot;
        var column              = null;
        var equelRowCantiner    = this._equelRowCantiner(pTableName);


        // 분기 : 컬럼 생성 | 컬럼서브슬롯 생성
        if (hasColumnSubSlot) {
            column = this._createColumnSubSlot(pTableName, pDataRow);
            pSlot.appendChild(column);
        
        } else {
            for (var i = 0; i < pDataRow.length; i++) {
                column = this._createColumn(pTableName, pDataRow[i], pDataRow);
                pSlot.appendChild(column);
            }
        }
    };

    ContainerAdapter.prototype._createColumn = function(pTableName, pRowValue, pDataRow) {
        
        var column              = this.tables[pTableName].columnElement._element;
        var columnSlotSelector  = this.tables[pTableName].columnElement.slotSelector;;
        var columnCallback      = this.tables[pTableName].columnElement._callback;
        var columnIdx           = pDataRow.indexOf(pRowValue);
        var columnClone         = column.cloneNode(true);
        var columnChild         = null;
        var columnCloneSlot     = null;

        columnChild     = this._callbackManager(columnCallback, pRowValue, columnIdx, pDataRow, columnClone);
        columnCloneSlot = common.querySelecotrOuter(columnClone, columnSlotSelector);

        columnCloneSlot.appendChild(columnChild);

        return columnClone;
    };

    ContainerAdapter.prototype._createColumnSubSlot = function(pTableName, pDataRow) {
        
        var column              = this.tables[pTableName].columnElement._element;
        var columnSubSlot       = this.tables[pTableName].columnElement.subSlot;
        var columnClone         = column.cloneNode(true);
        var columnChild         = null;
        var columnCloneSlot     = null;
        var columnCallback      = null;
        var columnName          = "";
        var columnIdx           = -1;
        var rowValue            = "";

        for (var i = 0; i < columnSubSlot.length; i++) {

            // REVIEW: 확인필요
            columnCloneSlot      = common.querySelecotrOuter(columnClone, columnSubSlot[i].selector); 
            // columnCloneSlot     = columnClone.querySelector(columnSubSlot[i].selector);
            columnName    = columnSubSlot[i].name;
            columnIdx     =  columnName ? pDataRow.indexOf(pDataRow[columnName]) : -1;
            columnIdx     = (columnIdx <= 0 && columnSubSlot[i].idx) ? columnSubSlot[i].idx : columnIdx;

            if (columnIdx >= 0) {
                rowValue        = pDataRow[columnIdx];
                columnCallback  = columnSubSlot[i].callback;
                columnChild     = this._callbackManager(columnCallback, rowValue, columnIdx, pDataRow, columnClone);
            } else {
                console.log('서브 슬록 없음' + i);
            }
            columnCloneSlot.appendChild(columnChild);
        }
        return columnClone;
    };

    /**
     * ******************************************
     * Public 메소드
     * ******************************************
     */

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
        tableObject.recordCount = 0;
        

        this.tables.pushAttr(tableObject, pTableName);
    };
    
    ContainerAdapter.prototype.deleteTable = function(pTableName) {
        this.tables.popAttr(pTableName);
    };

    // 컨테이너 객체 초기화
    ContainerAdapter.prototype.importTemplate = function(pObject) {
        this.template.importTemplate(pObject, null);
    };

    ContainerAdapter.prototype.insertCommand = function(pTableName, pDataRow, pIdx) {
        this._createContainer(pTableName, pDataRow, pIdx);
        
        this._event.publish("inserted");
        
        // TODO: 조견별 결과 필요
        return true;
    };

    ContainerAdapter.prototype.deleteCommand = function(pTableName, pIdx) {
        this._removeContainer(pTableName, pDataRow, pIdx);
        
        this._event.publish("deleted");

        // TODO: 조견별 결과 필요
        return true;
    };

    ContainerAdapter.prototype.updateCommand = function(pTableName, pDataRow, pIdx) {
        this.replaceContainer(pTableName, pDataRow, pIdx);
        
        this._event.publish("updated");

        // TODO: 조견별 결과 필요
        return true;
    };

    ContainerAdapter.prototype.selectCommand = function(pTableName, pDataTable) {
        
        // TODO: 입력값을 뭐로 할지 선택
        this._selectContainer(pTableName, pDataRow, pIdx);
        
        this._event.publish("selected");
        
        // TODO: 조견별 결과 필요
        return true;
    };

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
function TemplateElement(pOnwerContainerAdapter) {

    this.isDebug            = false;
    this._onwer             = pOnwerContainerAdapter;
    this._original          = null;
    this._element           = null;
    this._callback          = null;
    this.slot               = null;
    this.slotSelector       = null;
    this.subSlot            = null;

    this._event             = new Observer(this, this._onwer);    
    this.eventList      = ["succeed", "failed", "closed"];

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


    // 초기화
    TemplateElement.prototype.clear = function() {
        
        this._original          = null;
        this._callback          = null;
        this.element            = null;
        this.slot               = null;
        this.slotSelector       = null;
        this.subSlot            = null;
    };

    // 컬럼의 경우 셀렉터를 배열 형태로 넘겨서 매칭함
    /*
        - 1: 컬럼명으로 셀렉터 지정 (우선순위 높음)
        - 2: 인덱스로 셀렉터 지정
        - 3: 중복해서 적용한 경우
        - 4: 기본값으 경우
    */
    var SubSlot = [
        {
            name: "p1_name",                                    // 우선 순위 idx 보다 높음
            idx: -1,                                            // name 또는 idx 중 선택해야함            

            selector: "li #a1",
            callback: function(pValue, pSlotElem, pRow) {}      // 선택값
        }
    ];


    // SubSlot 가 선택되면 정적모드로 되서 레코드별로 노드를 복제 생성하지 않음
    // callback() : 컬럼모드만 사용 가능
    // callback(pValue, pIndex, pRow, pSlotElem) : 컬럼값, 컬럼idx, row레코드, 슬롯요소
    TemplateElement.prototype.importTemplate = function(pObject, pSelector, pCallback, pSubSlot) {
        
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
        // !! 서브셀렉터느 안됨.
        if (pSelector && !pSubSlot) {
            
            common.cutElement(this._element, pSelector, true);
            
            var _refElem = null;

            _refElem = common.querySelecotrOuter(this._element, pSelector);

            this.slot = _refElem;
            this.slotSelector = pSelector;            
        }

        // TODO: callback 온 경우 컬럼인 경우인지 확인 검사        
        if (typeof pCallback === "function") {
            this._callback = pCallback;
        }

        if (pSubSlot) {
            if (pSubSlot instanceof Array && pSubSlot[0].selector) {
                this.subSlot = pSubSlot;
            } else {
                throw new Error('subSlot 형식 오류 :');                
            }
        }
        
        if (elem) {
            this._event.publish("succeed");
        } else {
            this._event.publish("failed");
        }
        this._event.publish("closed");

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

    // 이벤트 등록
    RequestInfo.prototype.onEvent = function(pType, pFn) {
        if (this.eventList.indexOf(pType) > -1) {
            this._event.subscribe(pFn, pType);
        } else {
            throw new Error('pType 에러 발생 pType:' + pType);
        }
    }

    // 이벤트 해제
    RequestInfo.prototype.offEvent = function(pType, pFn) {
        if (this.eventList.indexOf(pType) > -1) {
            this._event.unsubscribe(pFn, pType);
        } else {
            throw new Error('pType 에러 발생 pType:' + pType);
        }
    }

}
(function() {   // prototype 상속
    
}());


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// @종속성 : DataAdapter, Ajax 관련, RequestInfo
function AjaxAdapter() {
    DataAdapter.call(this);
    
    this.isDebug        = false;
    this.xhr            = null;         // XMLHttpRequest
    this.tables         = new LArray();     // 테이블별 명령
    this.statusqueue    = [];      // send 결과
    this.isTransSend    = false;        // command 별 일괄 처리 여부
    this.isForced       = false;        // 일괄처리시 강제 완료 여부
    this._createHttpRequestObject();    // 객체 초기화 설정

    this.eventList.push("inserted", "deleted", "updated", "selected")
}
(function() {   // prototype 상속
    AjaxAdapter.prototype =  Object.create(DataAdapter.prototype);
    AjaxAdapter.prototype.constructor = AjaxAdapter;
    AjaxAdapter.prototype.parent = DataAdapter.prototype;    

    // ajax 객체 생성 (브라우저별)
    AjaxAdapter.prototype._createHttpRequestObject = function() {

        var i, xhr, activeXids = [
            'MSXML2.XMLHTTP.3.0',
            'MSXML2.XMLHTTP',
            'Microsoft.XMLHTTP'
        ];

        if (typeof XMLHttpRequest === "function") { // native XHR
            this.xhr =  new XMLHttpRequest();        
        } else { // IE before 7
            for (i = 0; i < activeXids.length; i += 1) {
                try {
                    this.xhr = new ActiveXObject(activeXids[i]);
                    break;
                } catch (e) {}
            }
        }
    };
    
    // [일괄처리] 동일 command 여부 검사
    AjaxAdapter.prototype._checkTransCommand = function() {
        return true;
    };

    // 명령 공통 처리
    AjaxAdapter.prototype._command = function(pCommand, pTableName, pDataRow, pIdx) {

        // 분기 : 일괄 처리
        if (this.isTransSend) {
            
        // 분기 : 단일 처리
        } else {

            // 명령 종류 검사 (동일타입)
            if (this._checkTransCommand()) {

                switch (pCommand) {
                    case "INSERT":   // update() commanad
                        this.tables[pTableName].insert.addCollection({idx: pIdx});
                        this.tables[pTableName].insert.setRowCollection(pDataRow);
                        this.tables[pTableName].insert.send();
                        break;
                    case "DELETE":   // update() commanad
                        this.tables[pTableName].delete.addCollection({idx: pIdx});
                        this.tables[pTableName].delete.setRowCollection(pDataRow);
                        this.tables[pTableName].delete.send();
                        break;
                    case "UPDATE":   // update() commanad
                        this.tables[pTableName].update.addCollection({idx: pIdx});
                        this.tables[pTableName].update.setRowCollection(pDataRow);
                        this.tables[pTableName].update.send();
                    //     break;
                    // case "SELECT":   // fill() commanad
                    //     this.tables[pTableName].select.addCollection({idx: pIdx});
                    //     this.tables[pTableName].select.setRowCollection(pDataRow);
                    //     this.tables[pTableName].select.send();
                    //     break;
                    default:
                        throw new Error('cmd 에러 발생 cmd:' + cTables[i].cmd);
                }                

            } else {
                throw new Error('command 동일 타입 오류 : ');
                return null;                
            }
        }
    };
    
    // 테이블 등록
    AjaxAdapter.prototype.insertTable = function(pTableName) {
        
        var tableObject = {};
        
        tableObject.insert = new RequestInfo(this, "INSERT");
        tableObject.delete = new RequestInfo(this, "DELETE");
        tableObject.update = new RequestInfo(this, "UPDATE");
        tableObject.select = new RequestInfo(this, "SELECT");
        
        this.tables.pushAttr(tableObject, pTableName);
    };
    
    // 테이블 삭제
    AjaxAdapter.prototype.deleteTable = function(pTableName) {
        this.tables.popAttr(pTableName);
    };
    
    // ****************
    // 추상 메소드 구현
    AjaxAdapter.prototype.insertCommand = function(pTableName, pDataRow, pIdx) {

        this.tables[pTableName].insert.onEvent("closed", function() {
            this._event.publish("inserted");
        });

        return this._command("INSERT", pTableName, pDataRow, pIdx);

        // this._event.publish("inserted");
    };
    
    AjaxAdapter.prototype.deleteCommand = function(pTableName, pDataRow, pIdx) {
        
        this.tables[pTableName].delete.onEvent("closed", function() {
            this._event.publish("deleted");
        });        
    };
    
    AjaxAdapter.prototype.updateCommand = function(pTableName, pDataRow, pIdx) {
        
        this.tables[pTableName].update.onEvent("closed", function() {
            this._event.publish("updated");
        });
    };
    
    AjaxAdapter.prototype.selectCommand = function(pTableName, pDataTable) {
        
        this.tables[pTableName].select._dataTable = pDataTable;

        // 놀리적으로 삭제가 맞을듯
        // TODO: 검토는 필요
        // this.tables[pTableName].select.addCollection({idx: pIdx});   
        // this.tables[pTableName].select.setRowCollection(pDataRow);        
        this.tables[pTableName].select.onEvent("closed", function() {
            this._event.publish("selected");
        });
        this.tables[pTableName].select.send();
    };

}());


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// @종속성 : Ajax 관련, JQuery 
// TODO : JQuery 종송성 끊어야 함
function RequestInfo(pOnwerAjaxAdapter, pCommandName) {
    
    this.isDebug            = false;
    this._onwer             = pOnwerAjaxAdapter;
    this._bodyCollection    = new LArray();
    this._headCollection    = new LArray();
    this._dataTable         = null;
    this._method            = "GET";
    this.command            = pCommandName;   
    this.fnRowMap           = null;     // fn(value, name, rows) return Value
    this.fnRowFilter        = null;     // fn(value, name, rows) return Boolean
    this.fnCallback         = null;     // fn(pEvent, pCount, pRows, pXhr)
    this.url                = null;
    this.header             = [];
    this.async              = true;     // true:비동기화,  false:동기화
    this.resultCount       = false;    // TODO: 비동기시 상태 갱신 시 옵서버 패턴 검토

    this._event         = new Observer(this, this._onwer);
    this.eventList      = ["succeed", "failed", "closed"];
    this.onSucceed          = null;     // TODO: send 성공 콜백
    this.onFailed           = null;     // TODO: send 실패 콜백

}
(function() {   // prototype 상속


    // row 변형 콜백 후 리턴
    RequestInfo.prototype._rowsMap = function() {};
    
    // row 필터 콜백 후 리턴
    RequestInfo.prototype._rowsFilter = function() {};
    
    // 콜백
    RequestInfo.prototype._callback = function() {};

    // xhr에 해더 설정
    RequestInfo.prototype._loadHeader = function(pXhr) {
        for (var i = 0; i < this.header.length; i++) {
            pXhr.setRequestHeader(this.header[i].name, this.header[i].value);
        }
    };
    
    RequestInfo.prototype._sendConfig = function() {

        var xhr             = this._onwer.xhr;
        var text            = "";
        var _this           = this;
        var arrLine         = null;

        xhr.onreadystatechange = function(pEvent) {

            var json    = {};
            var xml     = null;
            var result  = null;
            var rows    = null;
            var row     = null;
            var count   = 0;
            var dr      = null;

            if (this.readyState === 4 && this.status === 200) {
                
                
                // XML => JSON 변환
                if (this.responseXML) {
                    xml = this.responseXML;
                    json = $.xml2json(xml);

                    // json.result =  json.result || {};
                
                // 텍스트 => JSON 변환
                } else {
                    
                    // TODO: 공백줄제거 기능 추가 
                    arrLine = this.responseText.split("\n");
                    
                    json = {};
                    json.rows = [];

                    // TODO: 줄 밑에 공백 제거 필요함
                    for (var i = 0; i < arrLine.length; i++) {
                        row = _this.stringToJson(arrLine[i]);
                        if (row) json.rows.push(row);
                    }
                    json.count = json.rows.length;
                }

                // 분기 : 콜백으로 처리 
                if (typeof _this.fnCallback === "function") {
                    _this.resultCount = _this.fnCallback.call(_this, pEvent, json, rows, _this._dataTable);  // pEvent, count, rows
                
                // 분기 : 내부 정해진 규칙으로 처리
                } else {
                    _this.resultCount = Number(json.count) ? json.count : 0;

                    // SELECT 모드일 경우
                    if (_this.command === "SELECT") {
                        for (var i = 0; i < json.rows.length; i++) {
                            dr = _this._dataTable.newRow();
                            for (var key in json.rows[i]) {
                                if ( json.rows[i].hasOwnProperty(key)){
                                    dr[key] = json.rows[i][key];
                                }
                            }
                            _this._dataTable.rows.add(dr);
                        }
                    }
                }

                count   = json.count || 0;
                rows    = json.rows || [];                

                // 동기화 이슈로 콜백으로 우회 처리
                // TODO: 개선안 또는 구조 검토 필요
                // 분기 : 성공시 콜백
                if (count > 0 && typeof _this.onSucceed === "function") {

                    // TODO: 전달 항목 정의 필요
                    _this.onSucceed.call(_this, json);   
                }
                
                // 실패시 처리 이벤트 매핑
                _this._event.subscribe("failed", function() {
                    if ( typeof _this.onFailed === "function") {
                        _this.onFailed.call(_this, json);
                    }
                });

                if (count > 0) {
                    _this._event.publish("succeed");
                } else {
                    _this._event.publish("failed");
                }

                _this._event.publish("closed");
            }
        };
    };

    // GET 방식으로 전송
    RequestInfo.prototype._send_GET = function(pCollection) {
        
        var xhr             = this._onwer.xhr;
        var url             = "";
        
        // send 공통 구성
        this._sendConfig();
        
        // 캐쉬방지  TODO:  이후에 상위로 빼던지 해야 함
        this.url = this.url + "?t=" + Math.floor((Math.random() * 10000) + 1);


        if (this.url.indexOf("?") > 0) {
            url = this.url + "&" + pCollection;
        } else {
            url = this.url + "?" + pCollection;
        }
        url = encodeURI(url);                       // url = escape(url);
        
        xhr.open("GET", url, this.async);
        this._loadHeader(xhr);
        xhr.send();

        if  (url.length > 2083) {
            console.log(url);
            console.log('GET URL 길이 2083 초과 length:'+url.length);                    
        }
    };

    // POST 방식으로 전송
    RequestInfo.prototype._send_POST = function(pCollection) {
        
        var xhr             = this._onwer.xhr;
        var url             = "";

        // send 공통 구성
        this._sendConfig();
        
        // 캐쉬방지  TODO:  이후에 상위로 빼던지 해야 함
        url = this.url + "?t=" + Math.floor((Math.random() * 10000) + 1);
        url = this.url;


        // if (pHeadCollection.indexOf("?") > 0) {
        //     url = this.url + "&" + pHeadCollection;
        // } else {
        //     url = this.url + "?" + pHeadCollection;
        // }
        url = encodeURI(url);                       // url = escape(url);
        
        xhr.open("POST", url, this.async);
        this._loadHeader(xhr);
        xhr.send(pCollection);
        // xhr.send();
    };

    // JSONP 방식으로 전송
    RequestInfo.prototype._send_JSONP = function(pCollection) {

        var script = document.createElement("script");
        var url             = "";
        var _event          = this._event;
        
        // 캐쉬방지  TODO:  이후에 상위로 빼던지 해야 함
        this.url = this.url + "?t=" + Math.floor((Math.random() * 10000) + 1);

        if (this.url.indexOf("?") > 0) {
            url = this.url + "&" + pCollection;
        } else {
            url = this.url + "?" + pCollection;
        }
        url = encodeURI(url);                       // url = escape(url);
        
        script.type = "text/javascript";
        script.src =url;
        document.head.appendChild(script);
        
        
        script.onload = function(e) {
            _event.publish("succeed");
            _event.publish("closed");
        }
        script.onerror = function(e) {
            _event.publish("failed");
            _event.publish("closed");
        }

        if  (url.length > 2083) {
            console.log(url);
            console.log('GET URL 길이 2083 초과 length:'+url.length);
        }
    };

    // 전송
    RequestInfo.prototype.send = function() {
        
        // var xhr             = this._onwer.xhr;
        // var url             = "";

        var headCollection  = this.LArrayToQueryString(this._headCollection);
        var bodyCollection  = this.LArrayToQueryString(this._bodyCollection);
        var collection      = headCollection ? headCollection + "&" + bodyCollection : bodyCollection;

        if (collection.endsWith("&")) {
            collection = collection.substring(0, collection.length - 1);
        }

        // 결과 초기화
        this.resultCount = 0;

        // TODO: 동기화 및 여러개 실행시 관련 검토 필요
        if (!this.url) {
            throw new Error('url 에러 발생 url:' + this.url);
            return null;
        }

        switch (this._method) {
            
            case "GET":
                this._send_GET(collection);
                break;

            case "POST":
                
                this._send_POST(collection);
                // this._send_POST(headCollection, bodyCollection);
                break;

            case "JSONP":
                this._send_JSONP(collection);
                break;

            case "PUT":
                
                break;

            case "DELETE":
                
                break;

            default:
                throw new Error('method 에러 발생 method:' + this._method, this.async);
        }
    };

    // row 컬렉션 설정
    // 
    RequestInfo.prototype.setRowCollection = function(pRow) {

        var key         = null;
        var value       = null;
        var isInclude   = true;

        if (pRow instanceof LArray) {
            for (var i = 0; i < pRow.length ; i++ ) {
                key     = pRow.attributeOfIndex(i);
                value   = pRow[i];
                
                // 전송 row 필터 콜백
                if (typeof this.fnRowFilter === "function" ) {
                    isInclude = this.fnRowFilter.call(this, value, key, pRow);
                }
                
                // 전송 row 변형 코랩ㄱ
                if (typeof this.fnRowMap === "function" ) {
                    value = this.fnRowMap.call(this, value, key, pRow);
                }

                if (isInclude) {
                    this._bodyCollection.pushAttr(value, key);
                }
                
            }
        }
    };
    
    //
    RequestInfo.prototype.setJSONPCallback = function(pCallbackName, pCallback) {
        
        if (pCallbackName && typeof pCallback === "function") {
            // TODO: window 변경 필요  global...
            window[pCallbackName] = pCallback;
        }
    };


    // 헤더 설정
    RequestInfo.prototype.setHeader = function(pHeaderName, pHeaderValue) {
        
        var header = {
            name: pHeaderName,
            value: pHeaderValue
        };

        this.header.push(header);
    };


    
    // 전송방식 설정
    // pMethodName : GET, POST, PUT, DELETE, JSONP
    // 기본값 : GET
    RequestInfo.prototype.setMethod = function(pMethodName) {

        var methodList = ["GET", "POST", "JSONP", "PUT", "DELETE"];

        if (methodList.indexOf(pMethodName) > -1) {
            this._method = pMethodName;
        } else {
            throw new Error('method 에러 발생 method:' + pMethodName);
            return null;
        }
    };
    
    
    RequestInfo.prototype.initCollection = function() {
        this._headCollection = new LArray();
    };


    // 전송 컬렉션 얻기
    // TODO: 필요성 확인
    RequestInfo.prototype.getCollection = function() {
        
        var headCollection = this.LArrayToQueryString(this._headCollection);
        var bodyCollection = this.LArrayToQueryString(this._bodyCollection);
        var collection      = headCollection ? headCollection + "&" + bodyCollection : bodyCollection;
        return collection;
    };
    
    // 전송 추가 컬렉션 (_rowsMap, _rowsFilter 비 적용됨)
    // pCollection : 객체 타입
    RequestInfo.prototype.addCollection = function(pCollection) {
        
        if (!(pCollection instanceof Object)) {
            throw new Error('pCollection 객체 타입 아님 오류 발생 pCollection:' + pCollection);
            return null;            
        }

        for (var key in pCollection) {
            if ( pCollection.hasOwnProperty(key)){
                this._headCollection.pushAttr(pCollection[key], key);
            }
        }
    };

    // 문자열을 => JSON 변환
    // TODO: 전역 메소드 검토
    RequestInfo.prototype.stringToJson = function(pStr, pSeparator, pRowSeparator) {
        
        var list        = null;
        var listSub     = null;
        var json        = null;
        
        pRowSeparator   = pRowSeparator || "&";
        pSeparator      = pSeparator || "=";
        
        if (pStr === "") return null;
        // console.log('stringToJson.공백.');

        list        = pStr.split(pRowSeparator);

        for (var i = 0; i < list.length; i++) {
            listSub = list[i].split(pSeparator);
            if (listSub[0].length > 0 && listSub.length > 0) {
                json = json || {};
                json[listSub[0]] = listSub[1] ? listSub[1] : "";
            }
        }
        return json;
    };

    // queryString => JSON 변환
    RequestInfo.prototype.queryStringToJson = function(pQueryString) {
        return this.stringToJson(pQueryString, "&", "=");
    };
    
    RequestInfo.prototype.JsonToQueryString = function(pJSON) {

        var queryString = "";

        for (var key in pJSON) {
            if ( pJSON.hasOwnProperty(key)){
                queryString += key + "=" + pJSON[key].toString() + "&";
            }
        }        
        return queryString;
    };

    RequestInfo.prototype.LArrayToQueryString = function(pLArray) {

        var queryString = "";
        var key         = null;
        var value       = null;

        for (var i = 0; i < pLArray.length; i++) {
            key     = pLArray.attributeOfIndex(i);
            value   = pLArray[i];
            queryString += key + "=" + pLArray[key].toString() + "&";
        }

        if (queryString.endsWith("&")) {
            queryString = queryString.substring(0, queryString.length - 1);
        }
        
        return queryString;
    };

    // 이벤트 등록
    RequestInfo.prototype.onEvent = function(pType, pFn) {
        if (this.eventList.indexOf(pType) > -1) {
            this._event.subscribe(pFn, pType);
        } else {
            throw new Error('pType 에러 발생 pType:' + pType);
        }
    }

    // 이벤트 해제
    RequestInfo.prototype.offEvent = function(pType, pFn) {
        if (this.eventList.indexOf(pType) > -1) {
            this._event.unsubscribe(pFn, pType);
        } else {
            throw new Error('pType 에러 발생 pType:' + pType);
        }
    }

}());



