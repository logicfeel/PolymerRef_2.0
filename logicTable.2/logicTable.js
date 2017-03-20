/**
 * 
 * logicTable 설계 전체 변경
 *  - DataSet 도입
 */

// 공통 함수
var Common = Common || {};

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

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function DataSet(pName) {
    var dataRecordQueue = null;

    this.tables = null;
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
function DataTable(pTableName, pSchema) {
    
    this.columns    = [];
    this.rows       = [];
    tableName       = pTableName;

    if (pSchema !== null) {
        this.load(pSchema);
    }

    // DataTable 로딩
    DataTable.prototype.load = function(pSchema) {
        var columns = {};

        if ("columns" in pSchema) {
            
            this.columns = new DataColumn(pSchema["columns"])
            }
        }
    }

    DataTable.prototype.add = function() {}
    DataTable.prototype.clear = function() {}
    DataTable.prototype.select = function() {}

    // TODO : 나중에
    DataSet.prototype.clone = function() {}
    DataSet.prototype.copy = function() {}

    // 변경 적용 관련 
    DataSet.prototype.acceptChanges = function() {}
    DataSet.prototype.getChanges = function() {}
    DataSet.prototype.rejectChanges = function() {}
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function DataRow() {

    this.item = null;

    DataRow.prototype.add = function() {}
    DataRow.prototype.remove = function() {}
    DataRow.prototype.find = function() {}

    // 변경 적용 관련     
    DataRow.prototype.acceptChanges = function() {}
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function DataColumn(pConfigs) {
    
    this.caption        = pConfigs.caption || null;
    this.columnName     = pConfigs.columnName || null;
    this.dataType       = pConfigs.dataType || null;
    this.defaultValue   = pConfigs.defaultValue || null;
    this.unique         = pConfigs.unique || null;

    DataColumn.prototype.add = function() {}
    DataColumn.prototype.contains = function() {}
    DataColumn.prototype.indexOf = function() {}
    DataColumn.prototype.remove = function() {}
    DataColumn.prototype.removeAt = function() {}

}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function DynamicElement(pContainer) {
    pContainer = pContainer || Container;
    this.DS = null;
    this.C  = new pContainer();
    
    // 초기화
    DynamicElement.prototype.init = function(pContainer) {
        this.DS = new DataSet();
        this.C  = new pContainer();
    }
    
    // DataSet 로딩
    DynamicElement.prototype.load = function(pDataSet) {
        this.DS.load(pDataSet);
    }

    DynamicElement.prototype.register = function() {}
    DynamicElement.prototype.modify = function() {}
    DynamicElement.prototype.remove = function() {}
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function LogicTable(pContainer) {

    // 컨테이너명 지정
    pContainer = pContainer || TableTemplateContainer;
    DynamicElement.call(this, pContainer);  // 상속(부모생성자 호출)

    // Get 과 Set
    LogicTable.prototype.css = function() {}
}
LogicTable.prototype =  Object.create(DynamicElement.prototype);
LogicTable.prototype.constructor = LogicTable;
LogicTable.prototype.parent = DynamicElement.prototype;

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


