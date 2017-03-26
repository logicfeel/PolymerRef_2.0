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

    
    Container.prototype.fill = function(pDataSet, pTableName) {};
    
    // 어뎁터에 연결된 데이터 소스에 pDataSet 바인딩 처리함
    Container.prototype.update = function(pDataSet, pTableName) {

    };
}
(function() {   // prototype 상속
    
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// function AjaxAdapter() {

// }
// (function() {   // prototype 상속
    
// }());

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
s
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
    this.dt = this.tables;      // Ref
    this.dataSetName = pDataSetName;

    // DataSEt 로딩
    DataSet.prototype.load = function(pDataSet) {
        var isloading = false;

        if ("tables" in pDataSet) {
            this.readSchema(pDataSet["tables"])
            isloading = true;
        }
    };

    // DataRows 를 제거 (columns 유지, 스키마는 유지됨)
    DataSet.prototype.clear = function() {
        this.tables.clear();
    };

    // TODO : 나중에
    // 구조복사  (데이터 복사X)
    DataSet.prototype.clone = function() {};
    
    // 구조 + 데이터 복사
    DataSet.prototype.copy = function() {};

    // DataRow 데이터 읽기
    DataSet.prototype.read = function(pDataRows) {};

    // MS: 호환성
    DataSet.prototype.readXml = function() {};          

    // 스키마 (datatable, column 설정)
    DataSet.prototype.readSchema = function(pDataTables) {
        var datTables = {};

        for (var table in pDataTables) {
            if ( pDataTables.hasOwnProperty(table)){
                datTables[table] = new DataTable(table);

                // 생각좀...
                // TODO:
            }
        }
    };

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
        
        var changes     = [];
        var collection  = null;

        for(var i = 0; i < this.tables.length; i++) {
            collection = this.tables[i].getChanges();
            if (collection) {
                changes = changes.concat(collection);
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

    this.setPropCallback("count", function() {return this.length});

    DataTableCollection.prototype.add = function(pTableName) {

        var dataTable = new DataTable(pTableName);

        if (pTableName && typeof pTableName === "string") {
            this.pushAttr(dataTable, pTableName);
        } else {
            return null;
        }
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
    DataTableCollection.prototype.constructor = DataRow;
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

    // DataTable 로딩
    // TODO: 컬럼을 가져 오는지, Rows 를 가져 오는지, 둘다가져오는지 ?
    // 둘다 가져오는듯  (naver검색 결과)
    // 컬럼여부를 유추를 파악해서 등록함
    // JSON 또는 객체를 가져오는 기능이 되야함
    DataTable.prototype.load = function(pSchema) {
        
        var column = null;

        if ("column" in pSchema) {
            column = new DataColumn( pSchema["column"]["columnName"],
                                        pSchema["column"]["pType"],
                                        pSchema["column"]["caption"],
                                        pSchema["column"]["defaultValue"],
                                        pSchema["column"]["unique"],);
            // for(var i = 0; i < pSchema["column"].length; i++) {
            // }
        }

        if ("rows" in pSchema) {
            

            for(var i = 0; i < pSchema["rows"].length; i++) {
                
                // 컬럼이 있을 경우
                if (pSchema["rows"][0].length !== column.count) {
throw new Error('데이터컬럼 columnName, dataType = null  오류 ');
                }
                // 없을시 생성
            }
        }


    };

    // DataRow 만 초기화 (!columns는 유지됨/스키마는 유지)
    DataTable.prototype.clear = function() {
        this.rows.clear();
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

        var changes = {};
        var getChanges = this.rows.transQueue.select();
        
        if (!getChanges) return null;

        changes["table"] = this.tableName;
        changes["changes"] = getChanges;
        return changes;
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
    
    this.setPropCallback("count", function() {return this.length});

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
    DataColumnCollection.prototype.constructor = DataRow;
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

    this.transQueue = new TransQueue(this, null);
    
    this.setPropCallback("count", function() {return this.length});
    
    function _push(pDataRow) {
        this.push(pDataRow);
    }

    function _insertAt(pDataRow, pIdx) {
        this.splice(pIdx, 0, pDataRow);
    }    
    
    function _removeAt(pIdx) {
        return this.splice(pIdx, 1);
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
    };
    
    // column 값 여부
    // TODO: 필요시 구현해도 됨
    DataRowCollection.prototype.contains = function() {};

    // column 값 리턴
    // TODO: 필요시 구현해도 됨
    DataRowCollection.prototype.find = function() {};

    // TODO: 필요시 구현해도 됨
    DataRowCollection.prototype.copyTo = function() {};
    
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
            this.splice(pIdx, 0, pDataRow);

            // TYPE2: TransQeueue 사용 사용
            var bindInsertAtFunc = _insertAt.bind(this, pDataRow);  
            this.transQueue.insert(pDataRow, pIdx, bindInsertAtFunc); 
            this.splice(pIdx, 0, pDataRow);
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
    DataRowCollection.prototype.constructor = DataRow;
    DataRowCollection.prototype.parent = LArray.prototype;
}());

/**
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
 * 데이터로우
 * @param {DataTable} pDataTable 데이터테이블
 */
function DataRow(pDataTable) {

    var _dataTable = pDataTable;    // 소유한 데이터테이블

    // ! REVIEW 주의 TArray _items 오버라이딩함
    this._items = [];

    if (pDataTable instanceof DataTable) {
        for (var i = 0; i < _dataTable.columns.length; i++) {
            this.pushAttr(null, _dataTable.columns[i].columnName);
        }
    }

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






