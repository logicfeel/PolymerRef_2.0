/**
 * 
 * logicTable 설계 전체 변경
 *  - DataSet 도입
 */

// 공통 함수
var Common = Common || {};
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

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function DataSet(pName) {
    var dataRecordQueue = null;

    this.tables = new DataTable();
    this.dt = this.tables;      // Ref
    this.dataSetName = pName;

    // DataSEt 로딩
    DataSet.prototype.load = function(pDataSet) {
        var isloading = false;

        if ("tables" in pDataSet) {
            this.readSchema(pDataSet["tables"])
            isloading = true;
        }
    }

    DataSet.prototype.clear = function() {}

    // TODO : 나중에
    DataSet.prototype.clone = function() {}
    DataSet.prototype.copy = function() {}
    
    // DataRow 데이터 읽기
    DataSet.prototype.read = function(pDataRows) {}
    
    
    DataSet.prototype.readXml = function() {}           // MS: 호환성
    
    // 스키마 (datatable, column 설정)
    DataSet.prototype.readSchema = function(pDataTables) {
        var datTables = {};

        for (var table in pDataTables) {
            if ( pDataTables.hasOwnProperty(table)){
                datTables[table] = new DataTable(table);

                // 생각좀...
            }
        }
    }

    DataSet.prototype.readXmlSchema = function() {}     // MS: 호환성

    // 변경 적용 관련 
    DataSet.prototype.acceptChanges = function() {}
    DataSet.prototype.getChanges = function() {}
    DataSet.prototype.rejectChanges = function() {}
    DataSet.prototype.hasChanges = function() {}    
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// DataTable dt = new DataTable("결과");
// DataColumn name_dc = new DataColumn("name",typeof(String));
// dt.Columns.Add(name_dc);
// dt.columns[0] + 벼열 + 객체
function DataTable(pTableName) {

    var _changesQueu    = new TransQueue();

    this.columns    = new DataColumn();
    this.rows       = new DataRow();
    this.tableName  = pTableName;

    // if (pSchema !== null) {
    //     this.load(pSchema);
    // }

    // DataTable 로딩
    DataTable.prototype.load = function(pSchema) {
        var columns = {};

        if ("column" in pSchema) {
            for(var i = 0; i < pSchema["column"].length; i++) {
                // this.columns = new DataColumn(pSchema["column"]);
            }
        }
    }

    DataTable.prototype.add = function(pDataTable) {
        this.push(pDataTable);
    }

    DataTable.prototype.clear = function() {
        
        _transQueue.init();    // 큐 초기화
    }
    DataTable.prototype.select = function() {
        console.log('DataTable. select');
    }
    // 
    DataTable.prototype.newRow = function() {
        return new DataRow(this.columns);
        // console.log('DataTable. newRow');
    }

    // TODO : 나중에
    DataTable.prototype.clone = function() {}
    DataTable.prototype.copy = function() {}

    // 변경 적용 관련 
    DataTable.prototype.acceptChanges = function() {}
    DataTable.prototype.getChanges = function() {}
    DataTable.prototype.rejectChanges = function() {}
}
DataTable.prototype =  Object.create(Array.prototype); // Array 상속
DataTable.prototype.constructor = DataTable;
DataTable.prototype.parent = Array.prototype;

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
    
    // get / set 방식 프로퍼티 (function 연동)
    // 키 레퍼런스 만듬
    var bValue = 38;
    Object.defineProperty(this, 'b', {
    get: function() { return bValue; },
    set: function(newValue) { bValue = newValue; },
    enumerable: true,
    configurable: true
    });

    //**************************
    // DataColumnCollection 클래스 참조
    this.item = [];
    
    DataColumn.prototype.add = function(pDataColumn) {
        // TODO: 타입 검사 필요
        this.push(pDataColumn);
    }
    
    DataColumn.prototype.clear = function() {}    
    // REVIEW: 필요시 구현
    DataColumn.prototype.contains = function() {}    

    // 문자열의 index 리턴
    // Test :  dt.columns.indexOf("p2_name")
    DataColumn.prototype.indexOf = function(pStr) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].columnName === pStr) {
                return i;
            }
        }
        return -1;
    }

    // 컬럼명 기준 삭제
    DataColumn.prototype.remove = function(pColumnName) {
        var index = -1;
        index = this.indexOf(pColumnName);
        this.removeAt(index);
    }
    
    // index 기준 삭제
    // REVIEW: 전역으로 사용 가능 대상 
    DataColumn.prototype.removeAt = function(pIdx) {
        this.splice(pIdx, 1);
    }
    
    //**************************
    // 내부

}
DataColumn.prototype =  Object.create(Array.prototype); // Array 상속
DataColumn.prototype.constructor = DataColumn;
DataColumn.prototype.parent = Array.prototype;


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

    this.item = [];
    
    if (pDataColumn instanceof DataColumn) {
        for (var i = 0; i < pDataColumn.length; i++) {

            // get, set방식
            this.item.splice(i, 0, null);
            this.splice(i, 0, this.item[i]);
            var cName = pDataColumn[i].columnName;
            var cValue = this.item[i];
            var defind = {cName, }

            Object.defineProperty(this, cName, {
                get: function() { return cValue; },
                set: function(newValue) { cValue = newValue; },
                enumerable: true,
                configurable: true
            });
            

            // // XXX: 스코프 문제 해결해야함
            // (function(scope) {
            //     var initData = {1:1};
            //     scope.push(initData);
            //  scope[pDataColumn[i].columnName] = initData;
            // }(this));

            // // get /set방식
            // var bValue = 38;
            // Object.defineProperty(this, 'b', {
            //     get: function() { return bValue; },
            //     set: function(newValue) { bValue = newValue; },
            //     enumerable: true,
            //     configurable: true
            // });
            
            // 객체 참조 속성 방식


        }

        // HACK: 임시 테스트용
        Object.defineProperty(this, [0], {
            get: function() { return this.item[0]; },
            set: function(newValue) { this.item[0] = newValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(this, "p1_name", {
            get: function() { return this.item[0]; },
            set: function(newValue) { this.item[0] = newValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(this, [1], {
            get: function() { return this.item[1]; },
            set: function(newValue) { this.item[1] = newValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(this, "p2_name", {
            get: function() { return this.item[1]; },
            set: function(newValue) { this.item[1] = newValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(this, [2], {
            get: function() { return this.item[2]; },
            set: function(newValue) { this.item[2] = newValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(this, "p3_name", {
            get: function() { return this.item[2]; },
            set: function(newValue) { this.item[2] = newValue; },
            enumerable: true,
            configurable: true
        });


    }

    //**************************
    // DataRowCollection  클래스 참조

    DataRow.prototype.add = function(pRow) {}
    
    DataRow.prototype.clear = function() {}
    
    DataRow.prototype.contains = function() {}
    
    DataRow.prototype.copyTo = function() {}
    
    DataRow.prototype.equals = function() {}
    
    DataRow.prototype.find = function() {}
    
    DataRow.prototype.indexOf = function() {}
    
    DataRow.prototype.insertAt = function(pRow, pIdx) {

    }
    
    // rollback 안됨 (비추천) 바로 commit 됨
    DataRow.prototype.remove = function() {}    

    //**************************
    // 내부
    DataRow.prototype.delete = function() {}

    // 변경 적용 관련     
    DataRow.prototype.acceptChanges = function() {}
    DataRow.prototype.rejectChanges = function() {}
    
    //**************************
    // 사용자 추가

}
DataRow.prototype =  Object.create(Array.prototype); // Array 상속
DataRow.prototype.constructor = DataRow;
DataRow.prototype.parent = Array.prototype;


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
    }
    
    // DataSet 로딩
    LogicBuilder.prototype.load = function(pDataSet) {
        this.DS.load(pDataSet);
    }

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
        
    }

    LogicBuilder.prototype.modify = function(pTableName, pRow, pIdx) {

    }
    
    LogicBuilder.prototype.remove = function(pTableName, pIdx) {
        
    }

    // DS 전체 바인딩
    LogicBuilder.prototype.bind = function() {
        this.bind();
    }

    // DS 등록/수정/삭제 대상만 바인딩 -> 커밋 처리
    LogicBuilder.prototype.bindChanges = function() {
        this.bind();
    }

}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function LogicTable(pContainer) {

    // 컨테이너명 지정
    pContainer = pContainer || TableTemplateContainer;
    LogicBuilder.call(this, pContainer);  // 상속(부모생성자 호출)

    // Get 과 Set
    LogicTable.prototype.css = function() {}
}
LogicTable.prototype =  Object.create(LogicBuilder.prototype);
LogicTable.prototype.constructor = LogicTable;
LogicTable.prototype.parent = LogicBuilder.prototype;

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Elements() {
    
    Elements.prototype.createElements = function() {}
    Elements.prototype.appendElements = function() {}
    Elements.prototype.replaceElements = function() {}
    Elements.prototype.removeElements = function() {}
    Elements.prototype.selectorElements = function() {}
    Elements.prototype.createRecordElement = function() {}
    Elements.prototype.createColumnElement = function() {}
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Container() {
    
    this.dataSource = null;
    this.container  = null;
    this.Elems      = null;

    Container.prototype.bind = function() {}
    Container.prototype.bindInsert = function() {}
    Container.prototype.bindUpdate = function() {}
    Container.prototype.bindDelete = function() {}
    Container.prototype.bindSelect = function() {}
    Container.prototype.createContainer = function() {}
    Container.prototype.appendContainer = function() {}
    Container.prototype.replaceContainer = function() {}
    Container.prototype.removeContainer = function() {}
    Container.prototype.getContainer = function() {}
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function TemplateContainer() {
    Container.call(this);  // 상속(부모생성자 호출)


    TemplateContainer.prototype.mothod = function() {}
}
TemplateContainer.prototype =  Object.create(Container.prototype);
TemplateContainer.prototype.constructor = TemplateContainer;
TemplateContainer.prototype.parent = Container.prototype;

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function TableTemplateContainer() {
    TemplateContainer.call(this);  // 상속(부모생성자 호출)

    var _table = null;
    var _thead = null;
    var _tbody = null;
    var _tfooter = null;
    var _areaTop = null;
    var _areaBottom = null;

    TableTemplateContainer.prototype.mothod = function() {}
}
TableTemplateContainer.prototype =  Object.create(TemplateContainer.prototype);
TableTemplateContainer.prototype.constructor = TableTemplateContainer;
TableTemplateContainer.prototype.parent = TemplateContainer.prototype;

// *****************************************************
// *****************************************************
// *****************************************************


