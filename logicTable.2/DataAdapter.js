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
    this.template       = new TemplateElement();
    this.tables         = new LArray();

    // 컨테이너 객체 초기화
    ContainerAdapter.prototype.clear = function() {
        this.putElement     = null;     // 붙일 위치
        this.element        = null;
        this.template       = new TemplateElement();
        this.tables         = new LArray();
    };

    ContainerAdapter.prototype.insertTable = function(pTableName) {
        this.tables.pushAttr(new Table(), pTableName);
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
    ContainerAdapter.prototype.insertCommand = function(pTableName, pDataRow, pIdx, pMainSlotName) {
        
        var slotIdx = -1;

        // TODO: 기본검사 상위에 둬야 함
        if (!this.template) {
            throw new Error('template 객체 없음 에러! pTableName:');
        }

        // 슬롯이 없을경우 기본 슬롯 생성
        if (this.template.slot.length <= 0) {
            this.template.defaultSetSlot();
        }
        
        // 슬롯이 하나 이거나 슬롯 이름을 미정시 0번 인덱스 선택
        if (!pMainSlotName || this.template.slot.length === 1) {
            slotIdx = 0;
        } else if (pMainSlotName) {
            slotIdx = this.template.slot.indexOfAttr(pMainSlotName);
        }
        
        if (slotIdx < 0) {
            // 예외 처리
        }
        
        // TODO: 검사 해야 함
        if (this.tables[pTableName]) {

            // ***********
            // 메인 컨테이너 : table
            var clone = null;
            var selector = "";
            var refElem = null;

            if (!this.element || this.element === null) {
                var tempElem = this.template.slot[slotIdx];
                var mainSelector = tempElem["S_Selector"];
                 clone = tempElem.cloneNode(true);
            } else {
                clone = this.element;
            }
            // ***********
            // 컨테이너 : thead, tbody ...
            if (this.tables[pTableName].containerElement.slot.length <= 0) {
                this.tables[pTableName].containerElement.defaultSetSlot();
            }

            selector = this.tables[pTableName].containerElement.slot[0]["S_Selector"];
            
            if (this.element) {
                refElem = this.element.querySelector(selector);
            }
            // TODO: 찾는 로직 만들어야 함
            var clone_3 = null;

            if (!refElem) {
                slotIdx = 0;
                tempElem = this.tables[pTableName].containerElement.slot[slotIdx];
                clone_3 = tempElem.cloneNode(false);
                clone.appendChild(clone_3);
            } else {
                clone_3 = refElem;
            }

            // ***********
            // 레코드
            if (this.tables[pTableName].recordElement.slot.length <= 0) {
                this.tables[pTableName].recordElement.defaultSetSlot();
            }
            // TODO: 찾는 로직 만들어야 함
            slotIdx = 0;
            tempElem = this.tables[pTableName].recordElement.slot[slotIdx];
            var clone_1 = tempElem.cloneNode(false);
            
            // pIdx 가 있는 경우
            if (pIdx && typeof pIdx === "number") {
                clone_3.insertBefore(clone_1, clone_3.childNodes[pIdx]);
            } else {
                clone_3.appendChild(clone_1);
            }
            

            // ***********
            // 컬럼  
            //
            if (this.tables[pTableName].columnElement.slot.length <= 0) {
                this.tables[pTableName].columnElement.defaultSetSlot();
            }
            
            // TODO: 찾는 로직 만들어야 함
            slotIdx = 0;
            tempElem = this.tables[pTableName].columnElement.slot[slotIdx];
            for (var i = 0; i < pDataRow.length; i++) {
                var clone_2 = tempElem.cloneNode(false);
                var elem = document.createTextNode(pDataRow[i]);
                clone_2.appendChild(elem);

                // 레코드에 붙임
                clone_1.appendChild(clone_2);
            }
           
            // 메인에 지정
            if (!this.element) {
                this.element = clone;

                // put 위치에 붙임
                this.putElement.appendChild(clone);                
            }

        } else {
            throw new Error('pTableName 또는  container 객체 없음 에러! pTableName:' + pTableName);
        }
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
function Table(pContainerElement, pRecordElement, pColumnElement) {
    
    this.containerElement   = pContainerElement || new TemplateElement();
    this.recordElement      = pRecordElement ||  new TemplateElement();
    this.columnElement      = pColumnElement ||  new TemplateElement();
}
(function() {   // prototype 상속
    
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// pObjct : Element, selector => X 없음
// 종속성 : DOM Element
function TemplateElement(pObject, pIsDeep) {

    this._original   = null;
    this._elemTemp   = null;

    this.element    = null;
    this.slot       = new LArray();
    this.deep       = pIsDeep || true;

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
        return elem.querySelector("*");
    }

    function _importScript(pObject) {
        return null;
    }

    function _importTemplate(pObject) {
        return null;
    }

    function _importElement(pObject) {
        return pObject;
    }

    function _importText(pObject) {
        return null;
    }
    
    // 초기화
    TemplateElement.prototype.clear = function() {
        this._original       = null;
        this._elemTemp       = null;
        this.element    = null;
        this.slot       = new LArray();
        this.deep       = pIsDeep || true;
    };

    TemplateElement.prototype.importTemplate = function(pObject) {
        
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
        this.element    = elem;
        this._original       = elem
        return elem;
    }
    
    // 슬롯이 추가되고 자식은 삭제됨
    TemplateElement.prototype.defaultSetSlot = function() {
        
        var firstNodeSelector = "";

        if (this._original) {
            firstNodeSelector = String(this._original.nodeName);
            firstNodeSelector = firstNodeSelector.toLowerCase();
            this.insertSlot(firstNodeSelector);
            return true;
        } else {
            // 에외 처리
        }
        return false;
    }

    // 슬롯이 추가되고 자식은 삭제됨
    TemplateElement.prototype.insertSlot = function(pSelector, pSlotName) {
        
        var refElem = null;
        
        // 레퍼방식으로 변환함
        // refElem = this.element.querySelector(pSelector);
        
        refElem = common.querySelecotrOuter(this.element, pSelector);

        // var slot = document.createElement('slot');
        var maxLength = refElem.childNodes.length;
        for (var i = maxLength - 1; i >= 0; i--) {  // NodeList 임
            refElem.removeChild(refElem.childNodes[i]);
        }
        
        // REVIEW: <slot> 꼭 필요한지 유무 => 필요없을듯?
        // refElem.appendChild(slot);
        refElem["S_Selector"] = pSelector;
        this.slot.pushAttr(refElem, pSlotName);
        
        // LArray 사용구조로 개선함 !!
        // this.slot[pSlotName] = refElem;      
        // this.slot[pSlotName]["S_Selector"] = pSelector;
    };
    
    // 슬롯이 삭제되고 원본에서 자식이 복구됨
    TemplateElement.prototype.deleteSlot = function(pSlotName) {
        
        var selector = this.slot[pSlotName].S_Selector;
        var refElem = this.element.querySelector(selector);
        var orgElem = this._original.querySelector(selector);

        // 슬롯 삭제
        for (var i = 0; i < refElem.length; i++) {  // NodeList 임
            refElem.removeChild(refElem.childNodes[i]);
        }
        
        // 슬롯 삭제
        this.slot.popAttr(pSlotName);

        // 기존 복구
        for (var i = 0; i < orgElem.length; i++) {  // NodeList 임
            this.element.appendChild(orgElem.childNodes[i]);
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






