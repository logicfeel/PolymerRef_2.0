/**
 * 
 * logicTable 설계 전체 변경
 *  - DataSet 도입
 */

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function DataContainer() {
    
    this.dataSource     = null;     // DataSet
    this.orgConnection  = null;     // Connection
    this.original       = null;     // DataAdapter
    this.container      = null;     // DataAdapter

    DataContainer.prototype.dataBind = function() {};
    DataContainer.prototype.dataUpdate = function() {};
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
    TableContainer.prototype =  Object.create(DataContainer.prototype);
    TableContainer.prototype.constructor = TableContainer;
    TableContainer.prototype.parent = DataContainer.prototype;
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
    TemplateContainer.prototype =  Object.create(DataContainer.prototype);
    TemplateContainer.prototype.constructor = TemplateContainer;
    TemplateContainer.prototype.parent = DataContainer.prototype;
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
