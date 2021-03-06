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


// 공통 함수
var Common = Common || {};

(function() { 

    // 배열 차원 검사 (최대 제한값 10 설정됨)
    // 첫번째 배열만 검사 (배열의 넢이가 같은 겨우만)
    // _getArrayLevel(pElem) 사용법
    // pDepts : 내부 사용값
    Common.getArrayLevel = function(pElem, pDepts) {
        var MAX     = 10;
        var level   = 0;
        
        pDepts = pDepts || 0;

        if (pElem instanceof Array && MAX > pDepts) {
            level++;
            pDepts++;
            level = level + this.getArrayLevel(pElem[0], pDepts);  // 재귀로 깊이 찾기
        }
        return level;
    }

    // REVIEW: 공통화 필요
    Common.isArray = function(value) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === "[object Array]";
        }
    }

    // TODO: gobal 전역 번수 공통 로직
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
    this.container      = null;     // 컨테이너 (div)
    this.recordElement  = null;
    this.columnElement  = null;    
    this.element        = null;    
    
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
        
        this.putElement     = null;
        this.container      = null;
        this.recordElement  = null;
        this.columnElement  = null;
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
    ContainerAdapter.prototype.constructor = AjaxAdapter;
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

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Container() {
    
    this.dataSource     = null;     // DataSet
    this.orgConnection  = null;     // Connection
    this.original       = null;     // DataAdapter
    this.container      = null;     // DataAdapter

    Container.prototype.dataBind = function() {};
    Container.prototype.dataUpdate = function() {};
}
(function() {   // prototype 상속

}());


//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function TableContainer() {
    Container.call(this);  // 상속(부모생성자 호출)

    TableContainer.prototype.appendContainer = function() {};
    TableContainer.prototype.replaceContainer = function() {};
    TableContainer.prototype.removeContainer = function() {};
    TableContainer.prototype.createContainer = function() {};
}
(function() {   // prototype 상속
    TableContainer.prototype =  Object.create(Container.prototype);
    TableContainer.prototype.constructor = TableContainer;
    TableContainer.prototype.parent = Container.prototype;
}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function TemplateContainer() {
    Container.call(this);  // 상속(부모생성자 호출)

    TemplateContainer.prototype.registerTemplate = function() {};
    TemplateContainer.prototype.unregisterTemplate = function() {};
    TemplateContainer.prototype.getTemplate = function() {};
    TemplateContainer.prototype.pushQueue = function() {};
    TemplateContainer.prototype.popQueue = function() {};
}
(function() {   // prototype 상속
    TemplateContainer.prototype =  Object.create(Container.prototype);
    TemplateContainer.prototype.constructor = TemplateContainer;
    TemplateContainer.prototype.parent = Container.prototype;
}());
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function TableTemplateContainer() {
    TemplateContainer.call(this);  // 상속(부모생성자 호출)

    var _table      = null;
    var _thead      = null;
    var _tbody      = null;
    var _tfooter    = null;
    var _areaTop    = null;
    var _areaBottom = null;

    // 인스턴스 속성/메소드 정의
    TableTemplateContainer.prototype.mothod = function() {};
}
(function() {   // prototype 상속
    TableTemplateContainer.prototype =  Object.create(TemplateContainer.prototype);
    TableTemplateContainer.prototype.constructor = TableTemplateContainer;
    TableTemplateContainer.prototype.parent = TemplateContainer.prototype;
}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function ContainerBuilder(pContainer) {

    var _container      = pContainer || Container;

    _container.original       = null;
    _container.orgConnection  = null;
    _container.datasource     = null;
    
    // 초기화 
    // TODO: => 뭘 초기화 할지, 어떤 대상을 초기화 할지 결정후 주석처리
    ContainerBuilder.prototype.init = function(pContainer) {

    };
    
    // DataSet 로딩
    ContainerBuilder.prototype.load = function(pDataSet) {
        // this.DS.load(pDataSet);
    };

    // DataSet 로딩
    ContainerBuilder.prototype.setContainer = function(pContainer) {
        // this.DS.load(pDataSet);
    };

    // 등록(위치지정)
    // REVIEW : pDataRow 이후에 []을 삽입하면 등록가능하게
    ContainerBuilder.prototype.register = function(pTableName, pDataRow, pIdx) {
        // var table = null;
        // if (this.DS.tables[pTableName]) {
        //     table = new DataTable(pTableName);
        // }
        // // this.DS.tables[pTableName];
        // if (pIdx) {
        //     table.rows.insertAt(pDataRow, pIdx);
        // } else {
        //     table.rows.add(pDataRow);
        // }
    };

    // 수정
    ContainerBuilder.prototype.modify = function(pTableName, pDataRow, pIdx) {

    };
    
    // 삭제
    ContainerBuilder.prototype.remove = function(pTableName, pIdx) {
        
    };

    // 컨테이너 객체와 데이터셋과 묶음 (전체)
    // 컨테이너 초기화 이후 바인딩
    ContainerBuilder.prototype.bind = function() {
        // this.bind();
    };
    
    // 변경 부분만 바인딩
    // DS 등록/수정/삭제 대상만 바인딩 -> 커밋 처리
    ContainerBuilder.prototype.bindChanges = function() {
        // this.bind();
    };

    // 원본 소스에 연결데 어뎁터에 갱신 처리 함
    // 변경 부분만 처리됨
    ContainerBuilder.prototype.update = function() {
        
    };
    
}
(function() {   // prototype 상속

}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function LogicTable(pContainer) {

    // 컨테이너명 지정 (기본지정:테이블템플릿 컨테이너)
    pContainer = pContainer || TableTemplateContainer;
    LogicBuilder.call(this, pContainer);  // 상속(부모생성자 호출)

    // Get 과 Set
    LogicTable.prototype.css = function() {};
}
(function() {   // prototype 상속
    LogicTable.prototype =  Object.create(ContainerBuilder.prototype);
    LogicTable.prototype.constructor = LogicTable;
    LogicTable.prototype.parent = ContainerBuilder.prototype;
}());

/**
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * ###############################################################
 * DataSet      Tcollection             Rcollection     DataRow       
 * ----------------------------------------------------------------
 * DataSet      .tables  [0]            .rows[0]        .[0]
 * DataSet      .tables  ["tName"]                      .["cName"]
 *              .tables.count
 *                                      .rows.count
 * ================================================================ 
 * DataSet      Tcollection             Ccollection
 * ----------------------------------------------------------------
 * DataSet      .tables  [0]            .columns[0]
 * DataSet                              .columns["cName"]
 *                                      .columns.count
 * ================================================================ 
 * 데이터 셋
 * @param {String} pDataSetName 데이터셋 이름
 */
function DataSet(pDataSetName) {

    this.tables = new DataTableCollection(this);
    // this.dt = this.tables;      // Ref?
    this.dataSetName = pDataSetName;

    // dataReader 를 통한 가져오기
    // REVIEW: 가져오기 옵션 있음
    DataSet.prototype.load = function(pDataSet) {
    };

    // DataRows 를 제거 (columns 스키마는 유지됨)
    DataSet.prototype.clear = function() {
        this.tables.clear();
    };

    // TODO : 나중에
    // 구조복사  (데이터 복사X)
    DataSet.prototype.clone = function() {};
    
    // 구조 + 데이터 복사
    DataSet.prototype.copy = function() {};

    // DataSet 로딩 (tables + rows + columns)
    DataSet.prototype.read = function(pDataSet) {

        var ds          = null;
        var dataTable   = null;

        try {
            
            if (!pDataSet || !pDataSet.tables) {
                throw new Error('pDataSet  tables 객체 없음 :');
            }

            for (var i = 0; i < pDataSet.tables.length; i++) {
                dataTable = new DataTable();
                dataTable.read(pDataSet.tables[i]);
                this.tables.add(dataTable);
            }
        } catch (e) { 
            console.log('DataSet load 오류 :' + e);
        }
    };

    // MS: 호환성
    DataSet.prototype.readXml = DataSet.prototype.read;          

    // 스키마 (datatable, column 설정)
    DataSet.prototype.readSchema = function(pDataTables) {
        // var datTables = {};

        // for (var table in pDataTables) {
        //     if ( pDataTables.hasOwnProperty(table)){
        //         datTables[table] = new DataTable(table);

        //         // 생각좀...
        //         // TODO:
        //     }
        // }
    };

    // MS: 호환성
    DataSet.prototype.readXmlSchema = DataSet.prototype.readSchema;              

    DataSet.prototype.readXmlSchema = function() {};    // MS: 호환성

    // commit (변경내용처리)
    DataSet.prototype.acceptChanges = function() {
        
        var isSuccess = true;
        
        for(var i = 0; i < this.tables.length; i++) {
            isSuccess = this.tables[i].acceptChanges();
            
            if (!isSuccess) return false;
        }
        return isSuccess;
    };
    
    // rollback (변경내용 커밋전으로 되돌림)
    DataSet.prototype.rejectChanges = function() {

        var isSuccess = true;
        
        for(var i = 0; i < this.tables.length; i++) {
            isSuccess = this.tables[i].rejectChanges();
            
            if (!isSuccess) return false;
        }
        return isSuccess;
    };

    // 변경내용 가져옴
    DataSet.prototype.getChanges = function() {
        
        var changes     = new LArray();
        var collection  = null;

        for(var i = 0; i < this.tables.length; i++) {
            collection = this.tables[i].getChanges();
            
            if (collection) {
                changes.pushAttr(collection, this.tables[i].tableName);
            }
        }
        if (0 >= changes.length) return null;
        return changes;
    };

    // commit 여부 조회
    DataSet.prototype.hasChanges = function() {
        
        for(var i = 0; i < this.tables.length; i++) {
            collection = this.tables[i].getChanges();
            
            // 첫번째 내용 발견시
            if (collection) return true;
        }
        return false;
    };
}
(function() {   // prototype 상속

}());

/**
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
 * 데이터테이블 컬렉션
 * @param {DataSet} pDataSet 데이터셋
 */
function DataTableCollection(pDataSet) {

    var _dataSet = pDataSet;

    this._items = [];
    this._SCOPE = "DataTableCollection";

    this.setPropCallback("count", function() {return this.length});

    // pObject : String = 테이블명
    // DataTable : 데이터테이블 객체
    DataTableCollection.prototype.add = function(pObject) {

        var dataTable = null;

        if (typeof pObject === "string") {      
            dataTable = new DataTable(pObject);
        } else if (pObject instanceof DataTable) {
            dataTable = pObject;
        } else {
            return null;
        }

        this.pushAttr(dataTable, dataTable.tableName);
        return  dataTable;
    };

    // 데이터테이블 초기화
    DataTableCollection.prototype.clear = function() {
        for (var i = 0; i < this._items.length; i++) {
            this._items[i].clear();
        }
    };
    
    // 지정 컬렴 여부
    //  pTableName, pColumnName (선택)
    DataTableCollection.prototype.contains = function(pTableName, pColumnName) {
        
        if (pTableName && pColumnName) {
            return this._items[this.indexOf(pTableName)].columns.contains(pColumnName);
        } else {
            return (0 <= this._items.indexOf(pTableName));
        }
    };
    
    // TODO: 필요시 구현해도 됨
    DataTableCollection.prototype.copyTo = function() {};
    
    // 객체 비교
    DataTableCollection.prototype.equals = function(pObject) {
        return (this._items === pObject);
    };
    
    // 객체의 index 값 조회
    DataTableCollection.prototype.indexOf = function(pObject) {
        
        for (var i = 0; i < th_dataSet.tables.length; i++) {
            
            if (typeof pObject ==="string") {
                if (_dataSet.tables[i].tableName === pObject) return i;
            } else if (pObject) {
                if (_dataSet.tables[i] === pObject)  return i;
            }
        }
        return -1; 
    };
    
    // rollback 안됨 (비추천) 바로 commit 됨
    DataTableCollection.prototype.remove = function(pObject) {
        
        var index = -1;

        index = this._items.indexOf(pObject);

        if (0 <= index) {
            return this.removeAt(index);               // 배열 요소 삭제
        } else {
            return [];
        }        
    };

    DataTableCollection.prototype.removeAt = function(pIdx) {
        this.splice(pIdx, 1);                   // 내부 참조 삭제
        delete this[pIdx].columnName;           // 내부 이름 참조 삭제
        return this._items.splice(pIdx, 1);     // _items 삭제
    };
}
(function() {   // prototype 상속
    DataTableCollection.prototype =  Object.create(LArray.prototype); // Array 상속
    DataTableCollection.prototype.constructor = DataTableCollection;
    DataTableCollection.prototype.parent = LArray.prototype;
}());

/**
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
 * 데이터테이블
 * @param {String} pTableName 테이블명
 */
function DataTable(pTableName) {

    this.columns    = new DataColumnCollection(this);
    this.rows       = new DataRowCollection(this);
    this.tableName  = pTableName;

    // row의 넢이 검사
    function _equalRowWidth(pRow) {
        
        var rowWidth = -1;
        
        // TODO: 이중배열 여부 검사

        for (var i = 0; i < pRow.length; i++) {
            
            // 첫번째 row 넢이 
            if (i === 0) {
                rowWidth = pRow[i].length;

                // 넢이가 없는 경우
                if (0 >= rowWidth) {
                    return false;
                }
            } else {

                // 넚이가 다른 경우
                if (rowWidth !== pRow[i].length) {
                    return false;
                }
            }
        }
        return true;
    }
    
    function _getObjectType(pObject) {
        // REVIEW: 필요시 조건 삽입
        // switch (typeof pObject) {
        //     case 1:
        //         doSomethig();
        //         break;
        //     case 2:
        //         return true;
        //     default:
        //         return "string";
        // }
        return typeof pObject;
    }

    // DataTable 로딩
    // TODO: 컬럼을 가져 오는지, Rows 를 가져 오는지, 둘다가져오는지 ?
    // 둘다 가져오는듯  (naver검색 결과)
    // 컬럼여부를 유추를 파악해서 등록함
    // JSON 또는 객체를 가져오는 기능이 되야함
    // !pSchema 는 DataTable과 같은 기준으로 검사함
    // 동적 메소드
    DataTable.prototype.read = function(pTableDataObj) {

        var dataTable   = null; 
        var dtRows      = pTableDataObj["rows"];
        var dtColumns   = pTableDataObj["columns"];
        var dtTableName = pTableDataObj["tableName"];
        var column      = null;
        var dr          = null;
        
        // 스키마 읽기 
        this.readSchema(pTableDataObj);

        // 데이터 읽기 (rows)
        try { 
            // 입력 pSchema 검사 
            if (!pTableDataObj) {
                throw new Error('입력스키마 pSchema 오류 tableName:' + dtTableName);
            }
            if (!dtTableName) {
                throw new Error('테이블이름 없음 오류 tableName:' + dtTableName);
            }
            if (dtRows && 2 > Common.getArrayLevel(dtRows)) {
                throw new Error('rows 이중배열 아님 오류 :');
            }
            if (dtRows && !_equalRowWidth(dtRows)) {
                throw new Error('row들의 넚이가 다름 오류 :');
            }
            if (!dtRows && !dtColumns) {
                throw new Error('rows와 columns 없음 오류 :');
            }

            dataTable = new DataTable(dtTableName);
            
            // *************************
            // 로우 데이터 가져오기
            if (dtRows) {

                // 컬럼.count == 로우.conunt 검사 (이미 넢이는 검사했으므로..)
                if (dtRows[0].length !== this.columns.count) {
                    throw new Error('rows !== columns  오류 row.index:' + i);
                }

                for(var i = 0; i < dtRows.length; i++) {
                    dr = dataTable.newRow();
                    for (var ii = 0; ii < dtRows[i].length; ii++) {
                        dr[ii] = dtRows[i][ii];
                    }
                    dataTable.rows.add(dr);
                }
            }
        } catch (e) { 
            console.log('DataTable read 오류: ' + e);
        }
        
        // 개체 복사
        this.rows = dataTable.rows;
        
        return dataTable;        
    };


    DataTable.prototype.readSchema = function(pTableDataObj) {
        var dataTable   = null; 
        var dtRows      = pTableDataObj["rows"];
        var dtColumns   = pTableDataObj["columns"];
        var dtTableName = pTableDataObj["tableName"];        
        var column      = null;
        try { 
            // 입력 pSchema 검사 
            if (!pTableDataObj) {
                throw new Error('입력스키마 pSchema 오류 tableName:' + dtTableName);
            }
            if (!dtTableName) {
                throw new Error('테이블이름 없음 오류 tableName:' + dtTableName);
            }
            if (dtColumns && !(dtColumns instanceof Array)) {
                throw new Error('colum 배열 아님 오류 :');
            }

            dataTable = new DataTable(dtTableName);
            
            // *************************
            // 컬럼 스키마 가져오기

            if (dtColumns) {
                
                // A. 컬럼 스키마가 있는 경우
                for (var i = 0; i < dtColumns.length; i++) {
                    
                    // 필수 요소 검사
                    if (!(dtColumns[i]["columnName"] && dtColumns[i]["dataType"])) {
                        throw new Error('colum에 필수 정보 (columnName, dataType)없음 오류 tableName:' + dtTableName);
                    }
                    
                    column = new DataColumn( dtColumns[i]["columnName"], dtColumns[i]["dataType"],
                            dtColumns[i]["caption"], dtColumns[i]["defaultValue"], dtColumns[i]["unique"]);
                    dataTable.columns.add(column);
                }
            } else if (dtRows) {

                // B. 컬럼스키마가 없는 경우
                // 첫번째 row를 가져와서 컬럼 스키마를 생성
                for (var i = 0; i < dtRows[0].length; i++) {
                    column = new DataColumn("column_" + i, _getObjectType(dtRows[0][i]));
                    dataTable.columns.add(column);
                }
            }

        } catch (e) { 
            console.log('DataTable readSchema 오류: ' + e);
        }
        
        // 개체 복사
        this.tableName = dataTable.tableName;
        this.columns = dataTable.columns;
        
        return dataTable;          
    };

    // MS: DataReader 
    DataTable.prototype.load = function(pTableDataObj) {};


    // DataRow 만 초기화 (!columns는 유지됨/스키마는 유지)
    DataTable.prototype.clear = function() {
        this.rows   = new DataRowCollection(this);
    };

    DataTable.prototype.select = function() {
        console.log('DataTable. select');
    };
    
    // row 추가
    DataTable.prototype.newRow = function() {
        return new DataRow(this);
        // console.log('DataTable. newRow');
    };

    // TODO : 나중에
    DataTable.prototype.clone = function() {};
    DataTable.prototype.copy = function() {};

    // commit (변경내용처리)
    DataTable.prototype.acceptChanges = function() {
        return this.rows.transQueue.commit();
    };
    
    // rollback (변경내용 커밋전으로 되돌림)
    DataTable.prototype.rejectChanges = function() {
        return this.rows.transQueue.rollback();
    };    

    // 변경내용 가져옴
    DataTable.prototype.getChanges = function() {

        var table = {};
        var getChanges = this.rows.transQueue.select();
        
        if (!getChanges) return null;

        table["table"] = this.tableName;
        table["changes"] = getChanges;
        
        // return this
        return table;
    };
}
(function() {   // prototype 상속
    DataTable.prototype =  Object.create(LArray.prototype); // Array 상속
    DataTable.prototype.constructor = DataTable;
    DataTable.prototype.parent = LArray.prototype;
}());

/**
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * 테이터컬럼 컬렉션
 * @param {DataTable} pDataTable 데이터테이블
 */
function DataColumnCollection(pDataTable) {

    var _dataTable = pDataTable;

    this._items = [];
    this._SCOPE = "DataColumnCollection";

    this.setPropCallback("count", function() {return this._items.length});

    DataColumnCollection.prototype.add = function(pDataColumn) {
        
        if (pDataColumn instanceof DataColumn) {
            this.pushAttr(pDataColumn, pDataColumn.columnName);
            return true;
        } else {
            return false;
        }
    };
    
    // 데이터컬럼
    DataColumnCollection.prototype.clear = function() {
        _dataTable.columns  = new DataColumnCollection(_dataTable);
    };
    
    // 지정 컬렴 여부
    DataColumnCollection.prototype.contains = function(pColumnName) {
        
        for (var i = 0; i < this.length; i++) {
            if (this[i].columnName === pColumnName) return true;
        }
        return false;
    };
    
    // TODO: 필요시 구현해도 됨
    DataColumnCollection.prototype.copyTo = function() {};
    
    // 객체 비교
    DataColumnCollection.prototype.equals = function(PObject) {
        return (this === pObject);
    };
    
    // 객체의 index 값 조회
    // 객체 또는 컬럼명 으로 조회
    DataColumnCollection.prototype.indexOf = function(pObject) {

        for (var i = 0; i < this.length; i++) {
            
            if (typeof pObject ==="string") {
                if (this[i].columnName === pObject) return i;
            } else if (pObject) {
                if (this[i] === pObject)  return i;
            }
        }
        return -1;        
    };
    
    DataColumnCollection.prototype.remove = function(pObject) {
        
        var index = -1;

        index = this.indexOf(pObject);
 
        if (0 <= index) {
            return this.removeAt(index);               // 배열 요소 삭제
        } else {
            return [];
        }
    };

    DataColumnCollection.prototype.removeAt = function(pIdx) {
        this.splice(pIdx, 1);                   // 내부 참조 삭제
        delete this[pIdx].columnName;           // 내부 이름 참조 삭제
        return this._items.splice(pIdx, 1);     // _index 삭제
    };
}
(function() {   // prototype 상속
    DataColumnCollection.prototype =  Object.create(LArray.prototype); // Array 상속
    DataColumnCollection.prototype.constructor = DataColumnCollection;
    DataColumnCollection.prototype.parent = LArray.prototype;
}());

/**
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
 * @param {String} pColumnName 컬럼명
 * @param {String} pType  typeOf 값의 결과값 정보 원시값 : "string", "number"... 
 * @param {Object} pConfigs  설정정보 
 *                 {
 *                      columnName: "", dataType: "", caption: "",
 *                      defaultValue: "", unique: ""
 *                  }
 */
function DataColumn(pColumnName, pType, pCaption, pDefaultValue, pUnique) {

    this.columnName     = pColumnName || null;
    this.dataType       = pType || null;

    this.caption        = pCaption || null;
    this.defaultValue   = pDefaultValue || null;
    this.unique         = pUnique || false;

    // 필수값 검사
    // columnName, dataType
    if(this.columnName === null || this.dataType === null) {
        throw new Error('데이터컬럼 columnName, dataType = null  오류 ');
    }
    
    DataColumn.prototype.equals = function(PObject) {
        return (this === pObject);
    };   

}
(function() {   // prototype 상속
    DataColumn.prototype =  Object.create(Array.prototype); // Array 상속
    DataColumn.prototype.constructor = DataColumn;
    DataColumn.prototype.parent = Array.prototype;
}());

/**
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *  데이터 로우 컬렉션 Row
 * @param {DataTable} pDataTable 데이터테이블
 */
function DataRowCollection(pDataTable) {

    var _dataTable = pDataTable;

    // REVIEW: 이슈 있음
    this._items = [];  
    this._SCOPE = "DataRowCollection";

    this.transQueue = new TransQueue(this, null);
    
    this.setPropCallback("count", function() {return this._items.length});
    
    function _push(pDataRow) {
        this.push(pDataRow);
        this._items.push(pDataRow);        
    }

    function _insertAt(pDataRow, pIdx) {
        this.splice(pIdx, 0, pDataRow);
        this._items.splice(pIdx, 0, pDataRow);
    }    
    
    function _removeAt(pIdx) {
        this.splice(pIdx, 1);                   // 내부 참조 삭제
        return this._items.splice(pIdx, 1);     // _index 삭제 
    }

    DataRowCollection.prototype.add = function(pDataRow) {

        // TYPE1: TransQeueue 사용 안할 경우
        // this.push(pDataRow);     
        
        // TYPE2: TransQeueue 사용 사용
        var bindPushFunc = _push.bind(this, pDataRow);  
        this.transQueue.insert(pDataRow, null, bindPushFunc); 
    };

    DataRowCollection.prototype.clear = function() {
        _dataTable.rows =  new DataRowCollection(_dataTable);
        this.transQueue.init();
    };
    
    // column 값 여부
    // TODO: 필요시 구현해도 됨
    DataRowCollection.prototype.contains = function() {};

    // column 값 리턴
    // TODO: 필요시 구현해도 됨
    DataRowCollection.prototype.find = function() {};

    // TODO: 필요시 구현해도 됨
    DataRowCollection.prototype.copyTo = function() {};
    
    // TODO: 뭐랑 비교하는 정 확인 필요
    DataRowCollection.prototype.equals = function(pObject) {
        return (this === pObject);
    };
    
    DataRowCollection.prototype.indexOf = function(pDataRow) {

        for (var i = 0; i < this.length; i++) {
            if (this[i] === pDataRow) return i;
        }
        return -1;
    };
    
    DataRowCollection.prototype.insertAt = function(pDataRow, pIdx) {
        
        if (pDataRow instanceof DataRow &&  typeof pIdx === "number") {
            
            // TYPE1: TransQeueue 사용 안할 경우
            // this.splice(pIdx, 0, pDataRow);

            // TYPE2: TransQeueue 사용 사용
            var bindInsertAtFunc = _insertAt.bind(this, pDataRow, pIdx);  
            this.transQueue.insert(pDataRow, pIdx, bindInsertAtFunc); 
            return true;
        }
        return false;
    };
    
    // rollback 안됨 (비추천) 바로 commit 됨 :: delete() 메소드로 사용
    // !! 자동커밋 처리 안되게함 (MS 방식 차이점)
    DataRowCollection.prototype.remove = function(pDataRow) {
        return this.removeAt(this.indexOf(pDataRow));
    };

    // rollback 안됨 (비추천) 바로 commit 됨 :: delete() 메소드로 사용
    // !! 자동커밋 처리 안되게함  (MS 방식 차이점)
    DataRowCollection.prototype.removeAt = function(pIdx) {
        
        // TYPE1: TransQeueue 사용 안할 경우
        // return this.splice(pIdx, 1);

        // TYPE2: TransQeueue 사용 사용
        var bindRemoveAtFunc = _removeAt.bind(this, pIdx);  
        return this.transQueue.delete(pIdx, null, bindRemoveAtFunc); 
    };
}
(function() {   // prototype 상속
    DataRowCollection.prototype =  Object.create(LArray.prototype); // Array 상속
    DataRowCollection.prototype.constructor = DataRowCollection;
    DataRowCollection.prototype.parent = LArray.prototype;
}());

/**
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
 * 데이터로우
 * @param {DataTable} pDataTable 데이터테이블
 */
function DataRow(pDataTable) {

    var _dataTable = pDataTable;    // 소유한 데이터테이블
    var columnName = "";

    // ! REVIEW 주의 TArray _items 오버라이딩함
    this._items = [];
    this._SCOPE = "DataRow";

    if (pDataTable instanceof DataTable) {
        for (var i = 0; i < _dataTable.columns.length; i++) {
            columnName = _dataTable.columns[i].columnName;      // !! 버그 발견함 this 이슈
            this.pushAttr(null, columnName);
        }
    }

    this.setPropCallback("count", function() {return this._items.length});

    DataRow.prototype.delete = function() {
        
        var idx = _dataTable.rows.indexOf(this);
        
        _dataTable.rows.removeAt(idx);
    };

    // 변경 적용 관련 (불필요함:DataTable에서 row 관리)
    // row => 컬럼의 변화를 관리할 필요시에 구현
    DataRow.prototype._acceptChanges = function() {};
    DataRow.prototype._rejectChanges = function() {};
}
(function() {   // prototype 상속
    DataRow.prototype =  Object.create(LArray.prototype); // Array 상속
    DataRow.prototype.constructor = DataRow;
    DataRow.prototype.parent = LArray.prototype;
}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
/**
 * 네이밍 변경
 * 데이터 셋을 요소 기반으로 캐스팅해서 사용
 * [역활]
 *  - 데이터셋 로딩 (스키마, 데이터)
 *  - 데이터 제어 (등록, 수정, 삭제)
 *  - 변경내용 데이터셋 조회 (전체, 테이블선택)
 *  - 바인딩(전체, 변경내용)
 *      + 데이터셋 -> 컨테이너의 바인딩 처리
 * 
 */
// function DataSetBuilder(pContainer) {
//     pContainer = pContainer || Container;
//     this.DS = null;
//     this.C  = new pContainer();

//     // 초기화
//     DataSetBuilder.prototype.init = function(pContainer) {
//         this.DS = new DataSet();
//         this.C  = new pContainer();
//     };
    
//     // DataSet 로딩
//     DataSetBuilder.prototype.load = function(pDataSet) {
//         this.DS.load(pDataSet);
//     };

//     DataSetBuilder.prototype.register = function(pTableName, pDataRow, pIdx) {
//         var table = null;
//         if (this.DS.tables[pTableName]) {
//             table = new DataTable(pTableName);
//         }
//         // this.DS.tables[pTableName];
//         if (pIdx) {
//             table.rows.insertAt(pDataRow, pIdx);
//         } else {
//             table.rows.add(pDataRow);
//         }
        
//     };

//     DataSetBuilder.prototype.modify = function(pTableName, pDataRow, pIdx) {

//     };
    
//     DataSetBuilder.prototype.remove = function(pTableName, pIdx) {
        
//     };

//     // DS 전체 바인딩
//     DataSetBuilder.prototype.bind = function() {
//         this.bind();
//     };

//     // DS 등록/수정/삭제 대상만 바인딩 -> 커밋 처리
//     DataSetBuilder.prototype.bindChanges = function() {
//         this.bind();
//     };    
// }
// (function() {   // prototype 상속

// }());

// //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// function LogicTable(pContainer) {

//     // 컨테이너명 지정
//     pContainer = pContainer || TableTemplateContainer;
//     LogicBuilder.call(this, pContainer);  // 상속(부모생성자 호출)

//     // Get 과 Set
//     LogicTable.prototype.css = function() {};
// }
// (function() {   // prototype 상속
//     LogicTable.prototype =  Object.create(DataSetBuilder.prototype);
//     LogicTable.prototype.constructor = LogicTable;
//     LogicTable.prototype.parent = DataSetBuilder.prototype;
// }());

// //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// function Elements() {
//     Elements.prototype.createElements = function() {};
//     Elements.prototype.appendElements = function() {};
//     Elements.prototype.replaceElements = function() {};
//     Elements.prototype.removeElements = function() {};
//     Elements.prototype.selectorElements = function() {};
//     Elements.prototype.createRecordElement = function() {};
//     Elements.prototype.createColumnElement = function() {};
// }

// (function() {   // prototype 상속

// }());






