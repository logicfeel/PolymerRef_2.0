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
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function DataSet(pName) {
    var dataRecordQueue = null;

    this.tables = new DataTableCollection();
    this.dt = this.tables;      // Ref
    this.dataSetName = pName;

    // DataSEt 로딩
    DataSet.prototype.load = function(pDataSet) {
        var isloading = false;

        if ("tables" in pDataSet) {
            this.readSchema(pDataSet["tables"])
            isloading = true;
        }
    };

    DataSet.prototype.clear = function() {};

    // TODO : 나중에
    DataSet.prototype.clone = function() {};
    DataSet.prototype.copy = function() {};

    // DataRow 데이터 읽기
    DataSet.prototype.read = function(pDataRows) {};


    DataSet.prototype.readXml = function() {};          // MS: 호환성

    // 스키마 (datatable, column 설정)
    DataSet.prototype.readSchema = function(pDataTables) {
        var datTables = {};

        for (var table in pDataTables) {
            if ( pDataTables.hasOwnProperty(table)){
                datTables[table] = new DataTable(table);

                // 생각좀...
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
            if (!collection) {  // 첫번째 내용 발견시
                return true;
            }
        }
        return false;
    };
}
(function() {   // prototype 상속
    // DataSet();
}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function DataTableCollection() {

    this._items = [];

    DataTableCollection.prototype.add = function(pTableName) {

        var dataTable = new DataTable(pTableName);

        if (pTableName && typeof pTableName === "string") {
            this.pushAttr(dataTable, pTableName);
            this.setPropCallback("count", function() {return this.length});
        } else {
            return null;
        }
        return  dataTable;
    };

    DataTableCollection.prototype.clear = function() {};
    
    DataTableCollection.prototype.contains = function() {};
    
    DataTableCollection.prototype.copyTo = function() {};
    
    DataTableCollection.prototype.equals = function() {};
    
    DataTableCollection.prototype.indexOf = function() {};
    
    // rollback 안됨 (비추천) 바로 commit 됨
    DataTableCollection.prototype.remove = function() {};
}
(function() {   // prototype 상속
    DataTableCollection.prototype =  Object.create(LArray.prototype); // Array 상속
    DataTableCollection.prototype.constructor = DataRow;
    DataTableCollection.prototype.parent = LArray.prototype;
}());


//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// DataTable dt = new DataTable("결과");
// DataColumn name_dc = new DataColumn("name",typeof(String));
// dt.Columns.Add(name_dc);
// dt.columns[0] + 벼열 + 객체
function DataTable(pTableName) {

    var _changesQueu    = new TransQueue();

    this.columns    = new DataColumn();
    // this.rows    = new DataRow();
    // this.rows       = DataRow();
    this.rows       = new DataRowCollection();
    this.tableName  = pTableName;
    
    // 인스턴스화 필요 !! (중요)
    // this._items = [];

    // if (pTableName && typeof pTableName === "string") {
    //     this.pushAttr(null, pTableName);
    // }

    // DataTable 로딩
    DataTable.prototype.load = function(pSchema) {
        var columns = {};

        if ("column" in pSchema) {
            for(var i = 0; i < pSchema["column"].length; i++) {
                // this.columns = new DataColumn(pSchema["column"]);
            }
        }
    };

    // DataTable.prototype.add = function(pDataTable) {
    //     this.push(pDataTable);
    // };

    DataTable.prototype.clear = function() {
        
        _transQueue.init();    // 큐 초기화
    };

    DataTable.prototype.select = function() {
        console.log('DataTable. select');
    };
    
    // row 추가
    DataTable.prototype.newRow = function() {
        return new DataRow(this.columns);
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
        changes.changes = getChanges;
        return changes;
    };
    

}
(function() {   // prototype 상속
    DataTable.prototype =  Object.create(LArray.prototype); // Array 상속
    DataTable.prototype.constructor = DataTable;
    DataTable.prototype.parent = LArray.prototype;
    // DataTable();
    
}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// .Net 사용/접근법
// DataTable dt = new DataTable("결과");
// DataColumn name_dc = new DataColumn("name",typeof(String));
// dt.Columns.Add(name_dc);
// 정적과 동적의미가 

function DataColumn(pName, pType, pConfigs) {

    this.columnName     = pName || null;
    this.dataType       = pType || null;

    this.caption        = pConfigs ? (pConfigs.caption ? pConfigs.caption : null ) : null;
    this.defaultValue   = pConfigs ? (pConfigs.defaultValue ? pConfigs.defaultValue : null ) : null;
    this.unique         = pConfigs ? (pConfigs.unique ? pConfigs.unique : null ) : null;
    

    //**************************
    // DataColumnCollection 클래스 참조
    this.item = [];

    DataColumn.prototype.add = function(pDataColumn) {
        // TODO: 타입 검사 필요
        this.push(pDataColumn);
    };
    
    DataColumn.prototype.clear = function() {};
    // REVIEW: 필요시 구현
    DataColumn.prototype.contains = function() {};

    // 문자열의 index 리턴
    // Test :  dt.columns.indexOf("p2_name")
    DataColumn.prototype.indexOf = function(pStr) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].columnName === pStr) {
                return i;
            }
        }
        return -1;
    };

    // 컬럼명 기준 삭제
    DataColumn.prototype.remove = function(pColumnName) {
        var index = -1;
        index = this.indexOf(pColumnName);
        this.removeAt(index);
    };
    
    // index 기준 삭제
    // REVIEW: 전역으로 사용 가능 대상 
    DataColumn.prototype.removeAt = function(pIdx) {
        this.splice(pIdx, 1);
    };
    
    //**************************
    // 내부    

}
(function() {   // prototype 상속
    DataColumn.prototype =  Object.create(Array.prototype); // Array 상속
    DataColumn.prototype.constructor = DataColumn;
    DataColumn.prototype.parent = Array.prototype;
    // DataColumn();
}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function DataRowCollection() {

    this.transQueue = new TransQueue(this, null);

    function _push(pRow) {
        this.push(pRow);
    }

    DataRowCollection.prototype.add = function(pRow) {
        
        
        // TYPE1: TransQeueue 사용 안할 경우
        // this.push(pRow);     
        
        // TYPE2: TransQeueue 사용 사용
        var bindPushFunc = _push.bind(this, pRow);  
        this.transQueue.insert(pRow, null, bindPushFunc); 

        this.setPropCallback("count", function() {return this.length});
    };

    DataRowCollection.prototype.clear = function() {};
    
    DataRowCollection.prototype.contains = function() {};
    
    DataRowCollection.prototype.copyTo = function() {};
    
    DataRowCollection.prototype.equals = function() {};
    
    DataRowCollection.prototype.find = function() {};
    
    DataRowCollection.prototype.indexOf = function() {};
    
    DataRowCollection.prototype.insertAt = function(pRow, pIdx) {

    };
    // rollback 안됨 (비추천) 바로 commit 됨
    DataRowCollection.prototype.remove = function() {};
}
(function() {   // prototype 상속
    DataRowCollection.prototype =  Object.create(LArray.prototype); // Array 상속
    DataRowCollection.prototype.constructor = DataRow;
    DataRowCollection.prototype.parent = LArray.prototype;
}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// .Net 사용법    
// SqlDataReader sdr = scom.ExecuteReader();
// DataRow dr = null;
// while (sdr.Read())
// {
//     dr = dt.NewRow();
//     dr["name"] = sdr["m_name"];
//     dr["msg"] = sdr["m_msg"];
//     dt.Rows.Add(dr);
// }
function DataRow(pDataColumn) {

    // this.item   = new LArray();
    // var _item   = new LArray();
    // var _item = [];

    // ! REVIEW 주의 
    this._items = [];

    if (pDataColumn instanceof DataColumn) {
        for (var i = 0; i < pDataColumn.length; i++) {
            // _item.pushAttr(null, pDataColumn[i].columnName);
            this.pushAttr(null, pDataColumn[i].columnName);
        }
    }
    //**************************
    // 내부
    DataRow.prototype.delete = function() {};

    // 변경 적용 관련     
    DataRow.prototype.acceptChanges = function() {};
    DataRow.prototype.rejectChanges = function() {};
    
    //**************************
    // 사용자 추가 

}
(function() {   // prototype 상속
    DataRow.prototype =  Object.create(LArray.prototype); // Array 상속
    DataRow.prototype.constructor = DataRow;
    DataRow.prototype.parent = LArray.prototype;
    // DataRow();
    // 정적 메소드
    // DataRow.add = function () {
    //     console.log('DataRow.add static... ');
    // };
    
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
function LogicBuilder(pContainer) {
    pContainer = pContainer || Container;
    this.DS = null;
    this.C  = new pContainer();

    // 초기화
    LogicBuilder.prototype.init = function(pContainer) {
        this.DS = new DataSet();
        this.C  = new pContainer();
    };
    
    // DataSet 로딩
    LogicBuilder.prototype.load = function(pDataSet) {
        this.DS.load(pDataSet);
    };

    LogicBuilder.prototype.register = function(pTableName, pRow, pIdx) {
        var table = null;
        if (this.DS.tables[pTableName]) {
            table = new DataTable(pTableName);
        }
        // this.DS.tables[pTableName];
        if (pIdx) {
            table.rows.insertAt(pRow, pIdx);
        } else {
            table.rows.add(pRow);
        }
        
    };

    LogicBuilder.prototype.modify = function(pTableName, pRow, pIdx) {

    };
    
    LogicBuilder.prototype.remove = function(pTableName, pIdx) {
        
    };

    // DS 전체 바인딩
    LogicBuilder.prototype.bind = function() {
        this.bind();
    };

    // DS 등록/수정/삭제 대상만 바인딩 -> 커밋 처리
    LogicBuilder.prototype.bindChanges = function() {
        this.bind();
    };    
}
(function() {   // prototype 상속
    // LogicBuilder();
}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function LogicTable(pContainer) {

    // 컨테이너명 지정
    pContainer = pContainer || TableTemplateContainer;
    LogicBuilder.call(this, pContainer);  // 상속(부모생성자 호출)

    // Get 과 Set
    LogicTable.prototype.css = function() {};
}
(function() {   // prototype 상속
    LogicTable.prototype =  Object.create(LogicBuilder.prototype);
    LogicTable.prototype.constructor = LogicTable;
    LogicTable.prototype.parent = LogicBuilder.prototype;
    // LogicTable();
}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Elements() {
    Elements.prototype.createElements = function() {};
    Elements.prototype.appendElements = function() {};
    Elements.prototype.replaceElements = function() {};
    Elements.prototype.removeElements = function() {};
    Elements.prototype.selectorElements = function() {};
    Elements.prototype.createRecordElement = function() {};
    Elements.prototype.createColumnElement = function() {};
}

(function() {   // prototype 상속
    // Elements();
}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Container() {
    
    this.dataSource = null;
    this.container  = null;
    this.Elems      = null;

    Container.prototype.bind = function() {};
    Container.prototype.bindInsert = function() {};
    Container.prototype.bindUpdate = function() {};
    Container.prototype.bindDelete = function() {};
    Container.prototype.bindSelect = function() {};
    Container.prototype.createContainer = function() {};
    Container.prototype.appendContainer = function() {};
    Container.prototype.replaceContainer = function() {};
    Container.prototype.removeContainer = function() {};
    Container.prototype.getContainer = function() {};
}
(function() {   // prototype 상속
    // Container();
}());

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function TemplateContainer() {
    Container.call(this);  // 상속(부모생성자 호출)

    TemplateContainer.prototype.mothod = function() {};
}
(function() {   // prototype 상속
    TemplateContainer.prototype =  Object.create(Container.prototype);
    TemplateContainer.prototype.constructor = TemplateContainer;
    TemplateContainer.prototype.parent = Container.prototype;
    // TemplateContainer();
}());
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function TableTemplateContainer() {
    TemplateContainer.call(this);  // 상속(부모생성자 호출)

    var _table = null;
    var _thead = null;
    var _tbody = null;
    var _tfooter = null;
    var _areaTop = null;
    var _areaBottom = null;

    // 인스턴스 속성/메소드 정의
    TableTemplateContainer.prototype.mothod = function() {};
}
(function() {   // prototype 상속
    TableTemplateContainer.prototype =  Object.create(TemplateContainer.prototype);
    TableTemplateContainer.prototype.constructor = TableTemplateContainer;
    TableTemplateContainer.prototype.parent = TemplateContainer.prototype;
    // TableTemplateContainer();
}());
// *****************************************************
// *****************************************************
// *****************************************************


