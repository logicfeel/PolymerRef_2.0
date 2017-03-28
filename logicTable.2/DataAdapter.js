/**
 * 
 * logicTable 설계 전체 변경
 *  - DataSet 도입
 */

// 주석 블럭 : DataAdapter
(function() {

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // function Connection() {
    //     Connection.prototype.mothod = function() {}
    // }

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // function Command() {
        
    //     this.parameters = [];
        
    //     Command.prototype.mothod = function() {}
    // }

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // function JsonCommand() {
    //     Command.call(this);  // 상속(부모생성자 호출)

    //        JsonAdapter.prototype.mothod = function() {}
    // }
    // JsonAdapter.prototype =  Object.create(Command.prototype);
    // JsonAdapter.prototype.constructor = JsonAdapter;


    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // function DataAdapter() {

    //     this.insertCommand = null;
    //     this.updateCommand = null;
    //     this.deleteCommand = null;
    //     this.selectCommand = null;

    //     DataAdapter.prototype.fill = function() {}
    // }

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // function JsonAdapter() {
    //     DataAdapter.call(this);  // 상속(부모생성자 호출)

    //        JsonAdapter.prototype.mothod = function() {}
    // }
    // JsonAdapter.prototype =  Object.create(DataAdapter.prototype);
    // JsonAdapter.prototype.constructor = JsonAdapter;

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // function AjaxAdapter() {
    //     DataAdapter.call(this);  // 상속(부모생성자 호출)

    //        AjaxAdapter.prototype.mothod = function() {}
    // }
    // AjaxAdapter.prototype =  Object.create(DataAdapter.prototype);
    // AjaxAdapter.prototype.constructor = AjaxAdapter;

}());


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Connection() {
    
    Container.prototype.open = function() {};
    Container.prototype.close = function() {};
}
(function() {   // prototype 상속
    
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// @종속성 :  DOM
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
// @종속성 : JQuery
// REVIEW: 이후에 종속성 제거 검토
function AjaxConnection(pUrl, pData, pCallback) {
    
}
(function() {   // prototype 상속
    AjaxConnection.prototype =  Object.create(Connection.prototype);
    AjaxConnection.prototype.constructor = AjaxConnection;
    AjaxConnection.prototype.parent = Connection.prototype;
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Command(pDataAdapter) {

    this.dataAdapter = pDataAdapter || null;

    // 테이터 구조를 가지며면 될듯...

}
(function() {   // prototype 상속
    
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function ContainerCommand() {

}
(function() {   // prototype 상속
    ContainerCommand.prototype =  Object.create(Command.prototype);
    ContainerCommand.prototype.constructor = ContainerCommand;
    ContainerCommand.prototype.parent = Command.prototype;
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function AjaxCommand(pDataAdapter) {
    Command.call(this);  // 상속(부모생성자 호출)

}
(function() {   // prototype 상속
    AjaxCommand.prototype =  Object.create(Command.prototype);
    AjaxCommand.prototype.constructor = AjaxCommand;
    AjaxCommand.prototype.parent = Command.prototype;
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function DataAdapter() {

    this.insertCommand  = null;
    this.updateCommand  = null;
    this.deleteCommand  = null;
    this.selectCommand  = null;

    // 추상 클래스
    DataAdapter.prototype.fill = function(pDataSet, pTableName) {};
    
    // 어뎁터에 연결된 데이터 소스에 pDataSet 바인딩 처리함
    // 추상 클래스
    DataAdapter.prototype.update = function(pDataSet, pTableName) {};
}
(function() {   // prototype 상속
    
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// pObjct : Element, selector => X 없음
// 종속성 : DOM Element
function TemplateElement(pObject, pIsDeep) {

    var _original   = null;
    var _elemTemp   = null;

    this.element    = null;
    this.slot       = {};
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
        return elem;
    }

    function _importScript(pObject) {
        return null;
    }

    function _importTemplate(pObject) {
        return null;
    }

    function _importElement(pObject) {
        return null;
    }

    function _importText(pObject) {
        return null;
    }
    
    // 초기화
    TemplateElement.prototype.clear = function() {
        _original       = null;
        _elemTemp       = null;
        this.element    = null;
        this.slot       = {};
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
        _original       = elem
        return elem;
    }
    
    // 슬롯이 추가되고 자식은 삭제됨
    TemplateElement.prototype.insertSlot = function(pSelector, pSlotName) {
        
        var refElem = this.element.querySelector(pSelector);
        var slot = document.createElement('slot');

        for (var i = 0; i < refElem.length; i++) {  // NodeList 임
            refElem.removeChild(refElem.childNodes[i]);
        }
        refElem.appendChild(slot);
        this.slot[pSlotName] = refElem;
        this.slot[pSlotName]["S_Selector"] = pSelector;
    };
    
    // 슬롯이 삭제되고 원본에서 자식이 복구됨
    TemplateElement.prototype.deleteSlot = function(pSlotName) {
        
        var selector = this.slot[pSlotName].S_Selector;
        var refElem = this.element.querySelector(selector);
        var orgElem = _original.querySelector(selector);

        // 슬롯 삭제
        for (var i = 0; i < refElem.length; i++) {  // NodeList 임
            refElem.removeChild(refElem.childNodes[i]);
        }
        delete this.slot[pSlotName];

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
// 종속성 : HTML DOM
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
    
    this.putElement     = null;     // 붙일 위치
    this.container      = null;     // TemplateElement : 컨테이너 (div)
    this.recordElement  = null;     // TemplateElement
    this.columnElement  = null;     // TemplateElement
    this.element        = null;     // TemplateElement
    
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
    ContainerAdapter.prototype.update = function(pDataSet, pTableName) {};

    // 컨테이너 객체 초기화
    ContainerAdapter.prototype.clear = function() {
        this.putElement     = null;     // 붙일 위치
        this.container      = null;     // TemplateElement : 컨테이너 (div)
        this.recordElement  = null;     // TemplateElement
        this.columnElement  = null;     // TemplateElement
        this.element        = null;     // TemplateElement
    };

    // 이거에 용도
    // ContainerAdapter.prototype.createRecordElement = function(pTableName, pDataRow, pIdx) {
    // };

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

    this.insertCommand  = ContainerAdapter.prototype.appendContainer;
    this.updateCommand  = ContainerAdapter.prototype.replaceContainer;
    this.deleteCommand  = ContainerAdapter.prototype.replaceContainer;
}
(function() {   // prototype 상속
    ContainerAdapter.prototype =  Object.create(DataAdapter.prototype);
    ContainerAdapter.prototype.constructor = ContainerAdapter;
    ContainerAdapter.prototype.parent = DataAdapter.prototype;    
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function AjaxAdapter() {

}
(function() {   // prototype 상속
    AjaxAdapter.prototype =  Object.create(DataAdapter.prototype);
    AjaxAdapter.prototype.constructor = AjaxAdapter;
    AjaxAdapter.prototype.parent = DataAdapter.prototype;    
}());






