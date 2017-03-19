    
/**
 * 동적 테이블 생성 (클래스)
 * @name : LogicTable
 * @version : 1.0.0
 * @date : 2017-03-17
 **/

function LogicTable() {
    "use strict";

    var _table      = null;
    var _thead      = null;
    var _tbody      = null;
    var _tfooter    = null;
    var _areaTop    = null;
    var _areaBottom = null;
    // dataSet의 스키마 정의 
    // REVIEW: 이후에 경로 방식으 변경 필요 (또는 VS 의 json의 구조 참조)
    // LoadDataSet에 활용
    var _schemaDataSet = {
        tables: [
            {
                name : String,
                column : [
                    {
                        name : String,
                        type : Object
                    }
                ]
            }
        ],
        dataRow : {
            "*": [[]]   // 어떤한 Str에 내용 + 이중배열(자신과 자식이 배열)
        }
    };

    /**
     * @public attribute(속성/포로퍼티)
     **/
    this.version    = "0.0.0";
    this.dataSet    = {};       // TODO : 스키마 정보는 URL 형태로 제공
    this.container  = null;

    /**
     * ***************************************
     * @private method
     * ***************************************
     **/

    // 컨테이너, 테이블 생성 유무
    LogicTable.prototype._isContainer = function() {
        if (this.container === null || _table === null) {
            return false;
        } else {
            return true;
        }
    }

    // 컨테이너 초기화 (기본객체 생성)
    LogicTable.prototype._createContainer = function() {
        var div        = document.createElement("div");
        var areaTop    = document.createElement("div");
        var areaBottom = document.createElement("div");
        var table      = document.createElement("table");
        var thead      = document.createElement("thead");
        var tbody      = document.createElement("tbody");
        var tfooter    = document.createElement("tfooter");

        // 요소 구성 등록
        table.appendChild(thead);
        table.appendChild(tbody);
        table.appendChild(tfooter);

        div.appendChild(areaTop);
        div.appendChild(table);
        div.appendChild(areaBottom);

        // 객체 속성에 참조 연결
        this.container  = div;       // 컨테이너 (div)
        _table      =  this.container.querySelector('table');
        _thead      =  this.container.querySelector('thead');
        _tbody      =  this.container.querySelector('tbody');
        _tfooter    =  this.container.querySelector('tfooter');
        _areaTop    = areaTop;
        _areaBottom = areaBottom;
    }

    // tr 생성
    LogicTable.prototype._createTr = function() {
        return document.createElement('tr');
    }

    // td 생성
    LogicTable.prototype._createTd = function(pElem) {
        var arrTd = [];
        var td = null;
        var elem = null;

        // XXX : 배열 검사 해야함
        for (var i = 0; i < pElem.length; i++) {
            td = document.createElement('td');
            elem = this._customElem(pElem[i]);
            td.appendChild(elem);
            
            // td 배열에 삽입
            arrTd.push(td);
        };
        return arrTd;
    }

    // 동적 요소 등록
    LogicTable.prototype._customElem = function(pElem) {
        var elem = null;

        if (typeof pElem === "string" || typeof pElem === "number") {
            elem = document.createTextNode(pElem);
        } else if (pElem instanceof Element) {
            elem = pElem;
        } else {
            // REVEIW : 조건이 맞는지 확인 필요
            elem = document.createElement(pElem);
        }
        return elem;
    }

    // 데이터셋 스키마 검사
    // TODO : 임시로 true..
    // REVIEW : 이후에 별도로 분리 검토
    LogicTable.prototype._isSchemaCheck = function(pJSON, pSchema) {
        return true;
    }

    // 배열 차원 검사 (최대 제한값 10 설정됨)
    // 첫번째 배열만 검사 (배열의 넢이가 같은 겨우만)
    LogicTable.prototype._getArrayLevel = function(pElem, pDepts) {
        var MAX     = 10;
        var level   = 0;
        
        pDepts = pDepts || 0;

        if (pElem instanceof Array && MAX > pDepts) {
            level++;
            pDepts++;
            level = level + this._getArrayLevel(pElem[0], pDepts);  // 재귀로 깊이 찾기
        }
        return level;
    }

    // 컨텐츠 붙이기
    LogicTable.prototype._setContent = function(pElem, pTarget) {
        var arrElem = null;
        var tr = null;
        var arrTd = null;

        if (!this._isContainer()) {     // 컨테이너 검사 (없을시 생성)
            this._createContainer();
        }

        // 1차원 => 2차원 배열로 만듬
        if ( this._getArrayLevel(pElem) === 1) pElem = [pElem];    
        
        for (var i = 0; i < pElem.length; i++) {
            arrElem = pElem[i];
            tr = this._createTr();
            arrTd = this._createTd(arrElem);
            
            for (var ii = 0; ii < arrTd.length; ii++) {
                tr.appendChild(arrTd[ii]);
            }
            this.container.querySelector(pTarget).appendChild(tr);
            // this[pTarget].appendChild(tr);   
        }
    }    

    

    /**
     * **************************************
     * @public method(메소드)
     * **************************************
     **/

    /**
     * @method init
     * 초기화 (전체)
     * @param {Array} [[td요소]] 이중 배열 형태
     */
    LogicTable.prototype.init = function() {
        this.dataSet    = {};
        if (this.container) this.container.innerHTML = '';
        this.container  = null;
        _table          = null;
        _thead          = null;
        _tbody          = null;
        _tfooter        = null;
        _areaTop        = null;
        _areaBottom     = null;
    }

   /**
     * @method setHead
     * 동적 head 등록 (멀티 레코드)
     * @param {Array} 추가할 td 배열요소
     */
    LogicTable.prototype.setHead = function(pElem) {
        var TAG_NAME = "thead";
        this._setContent(pElem, TAG_NAME);
    }
    
    /**
     * @method setBody
     * 동적 body 등록 (멀티 레코드)
     * @param {Array} [[td요소]] 이중 배열 형태
     */
    LogicTable.prototype.setBody = function(pElem) {
        var TAG_NAME = "tbody";
        this._setContent(pElem, TAG_NAME);
    }

    /**
     * @method setFooter
     * 동적 body 등록 (멀티 레코드)
     * @param {Array} [[td요소]] 이중 배열 형태
     */
    LogicTable.prototype.setFooter = function(pElem) {
        var TAG_NAME = "tfooter";
        this._setContent(pElem, TAG_NAME);        
    }

    /**
     * @method setCSS
     * CSS 설정
     * @param {String} 동적으로 생성된 테이블 선택자
     * @param {String} ClasName 예> "class1 class2" 
     */
    LogicTable.prototype.setCSS = function(pSelector, pClassName) {
        var seletor = this.container.querySelectorAll(pSelector);

        for (var i = 0; i < seletor.length; i++) {
            seletor[i].className = pClassName;
        }
    }

    /**
     * this.dataSet 의 자료를 로딩함
     *  - 스키마 검사 
     *  - DataSet.dataRow 테이블 키 연결 (객체+배열 혼합 방법)
     * @param {JSON} pJSON 입력 JSON 데이터
     * @return {Boolean} 로딩 결과
     */
    LogicTable.prototype.loadDataSet = function(pJSON) {
        var ds = {};
        var tableIdx;
        var columnName;

        if (!this._isSchemaCheck(pJSON, _schemaDataSet)) {       // 스키마 검사
            return false;
        }

        try { 
            ds.tables = pJSON.tables;
            ds.dr = {};
            // for-3
            for (var prop in  pJSON.dataRow) {
                if ( pJSON.dataRow.hasOwnProperty(prop)){
                    ds.dr[prop] = [];                                                   // #1 테이블 = 벼열타입
                    // for-2
                    for (var i = 0; i < pJSON.dataRow[prop].length; i++ ) {
                        ds.dr[prop][i] = {};                                            // #2 테이블.Row = 객체타입
                        ds.dr[prop][i] = pJSON.dataRow[prop][i];                        // #3 테이블.Row.컬럼들 일괄 삽입 = 배열(객체에 혼합됨)

                        // 컬럼명(key)에 각각 값 삽입 : for-1
                        for (var ii = 0; ii < pJSON.dataRow[prop][i].length; ii++ ) {
                            tableIdx = this._getTableIndex(prop, ds.tables);
                            // 예외처리
                            if (tableIdx === null) throw new Error('데이터셋 tables 오류 :' + prop);    
                            columnName = ds.tables[tableIdx].colume[ii].name; 
                            ds.dr[prop][i][columnName] = pJSON.dataRow[prop][i][ii];    // #4 테이블.Row.key = 컬럼 연결
                            // console.log(columnName + ':' + ii);
                        }
                    }
                    // console.log(prop + ':t');
                }
            }
        } catch (e) {
            console.log(e);
        }       

        this.dataSet = ds;  // 데이터셋 등록

        if (this.dataSet.tables !== null && this.dataSet.dr !== null) {
            return true;
        } else {
            return false;
        }
    }    
    
    // 테이블의 index 값 얻기
    LogicTable.prototype._getTableIndex = function(pName, pTables) {
        for(var i = 0; i < pTables.length; i++) {
            if (pTables[i].name === pName) {
                return i;
            }
        }
        return null;
    }

    /**
     * @method bindDataSet
     * dataSet 과 내부 커테이너를 연결(생성)
     * @param {JSON} pJSON 입력 JSON 데이터 (선택값) 
     * 입력 없을시 설정된 this.dataSet 내부 값으로 바인딩
     * @return {Boolean} 처리 성공 여부
     */
    LogicTable.prototype.bind = function(pJSON) {
        var dataRow = null;
        try { 
            if (typeof pJSON !== "undefined") {
                this.init();
                this.loadDataSet(pJSON);
            }
            dataRow = this.dataSet.dr;

            for(var prop in dataRow) {
                if ( dataRow.hasOwnProperty(prop) ){
                    switch (prop) {
                        case "head":
                            this.setHead(dataRow[prop]);
                            break;
                        case "body":
                            this.setBody(dataRow[prop]);
                            break;
                        default:
                            throw new Error('데이터셋 :dataRow 오류:'+ prop);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }            
        console.log('bindDataSet');
    }


    // ################################
    // 3월16일 개발 ~
    // 데이터셋 수정
    // 테이블명, ROW, [Key | 번호]
    LogicTable.prototype.update = function(pDTCurser) {
        
        console.log('update');
    }

}

// Logic Utils
// 공통 유틸리티
var logicUtils = logicUtils || {};

var fnName = {
};

/**
 * [ 네이밍 ]
 * 
 * [메인/public]
 * init                 : 초기화
 * loadDataSet          : 데이터셋 로딩
 * set                  : 설정
 * register             : 등록
 * modify               : 수정
 * remove               : 삭제
 * CSS                  : CSS설정(추가/수정/삭제)
 * bind                 : 바인딩

 * 
 * [데이터셋]
 * {메소드}
 * init                 : 레코드셋 초기화
 * initRecord           : 레코드 초기화
 * setDataSet           : 레코드셋 설정
 * setTables            : 데이터 테이블 설정
 * setRecord            : 레코드 설정
 * createRecord         : 레코드 삽입(생성)
 * updateRecord         : 레코드 수정(갱신)
 * deleteRecord         : 레코드 삭제
 * regRecordKey         : 레코드 키 등록
 * getTableIndex        : 레코드 테이블 idx 얻기
 * isSchemaCheck        : 스키마 검사
 *
 * [바인딩]
 * {속성}
 * dataRecordQueue      : dr 큐
 * {메소드}
 * init                 : 테이블 바인딩 초기화
 * bindRecord           : 레코드 바인딩
 * bindAppendRecord     : 추가/삽입 바인딩
 * bindReplaceRecord    : 교체 바인딩
 * bindRemoveRecord     : 제거 바인딩
 * pushQueue            : 큐 넣기
 * popQueue             : 큐 빼기
 * 
 * [템플릿]
 * {속성}
 * hashTable            : 해쉬테이블 (키:값)
 * {메소드}
 * init                 : 템플릿 초기화
 * registerTemplate     : 템플릿 등록
 * unregisterTemplate   : 템플릿 해제
 * getTemplate          : 템플릿 받기
 * 
 * [컨테이너]
 * {속성}
 * name                 : 컨테이너 이름
 * {메소드}
 * init                 : 컨테이너 초기화 
 * createContainer      : 컨테이너 생성(추가)
 * appendContainer      : 컨테이너 붙임
 * replaceContainer     : 컨테이너 교체
 * removeContainer      : 컨테이너 삭제
 * createElements       : 요소 생성
 * createRecordElement  : row 컨테이너 요소 생성(tr생성)
 * createColumnElement  : column 컨테이너 요소 생성(td생성)
 * appendElements       : 요소 등록(붙임)
 * replaceElements      : 요소 교체
 * removeElements       : 요소 제거
 * selectorElements     : 요소 선택
 * getContainer         : 컨테이너 얻기
 
 
 ## 기존 등록 흐름 ##
 #########################################################
  
  setHead -> 
       _setContent 
               (유무검사) _createContainer
               이중배열화
               for _createTr
                   _createTd(배열)
                       for  _customElem(값)
  
  setBody -> _setContent
  
    bindRecord

        bindAppendRecord : 템플릿을 불러오고 컨테이너 생성 후 컨테이너 붙임
            getTemplate
            createContainer(대상객체[], 템플릿) :: 레코드기준
                for createRecordElement : 레코드
                    for createColumnElement : 컬럼
                        createElements : 요소 생성
            appendContainer(대상객체[], 템플릿, 붙임위치) 
               appendElements(요소들 [, 위치])

        bindReplaceRecord
            createContainer(대상객체[], 템플릿) :: 레코드기준
                for createRecordElement : 레코드
                    for createColumnElement : 컬럼
                        createElements : 요소 생성
            replaceContainer(대상객체[], 템플릿, 붙임위치) :: 레코드기준
                selectorElements
                replaceElements(요소들, 위치)

        bindRemoveRecord
            removeContainer(선택요소)
                SelectorElements
                removeElements(위치)
       
 ###########################################################              
  
 * 요소 셍성
 * 
 * 
 * 공통 배열 레벨 얻기 : getArrayLevel
 * 
 */



(function(){
    "use strict";

    // *************************************
    // 동적 요소 빌더 Class
    function DynamicElement() {

        this.DS = new DataSet();
        this.B  = new TableBinding();
        this.C  = new TableContainer();
        this.T  = new TableTemplate();

        // 초기화
        DynamicElement.prototype.init = function() {
            this.DS.init();
            this.B.init();
            this.C.init();
            this.T.init();
        }
        
        // 데이터셋 로딩
        DynamicElement.prototype.loadDataSet = function(pDataSet) {
            this.DS.setDataSet(pDataSet);
        }

        // 설정
        // DynamicElement.prototype.set = function() {}

        // 등록
        // Object 타입 {"aa": [[,]] }
        // TODO: 등록 위치 지정 필요
        // pCursorRow 삽입할 위치 미지정시 null 입력되어 맨뒤에 삽입됨
        DynamicElement.prototype.register = function(pDataRow, pCursorRow) {
            pRowCursor = pRowCursor || null;
            this.DS.setRecord(pDataRow);
        }

        // 수정
        DynamicElement.prototype.modify = function() {}

        // 삭제
        DynamicElement.prototype.remove = function() {}

        // CSS설정(추가/수정/삭제)
        DynamicElement.prototype.CSS = function() {}

        // 바인딩
        DynamicElement.prototype.bind = function() {
            this.B.bindRecord();
        }
    }

    // *************************************
    // 동적 테이블 빌더 Class
    function LogicTables() {
        DynamicElement.call(this);  // 부모생성자
    }
    LogicTables.prototype =  Object.create(DynamicElement.prototype);
    LogicTables.prototype.constructor = LogicTables;

    // REVIEW: 전역모둘 설정
    window.LogicTables = LogicTables;

    // *************************************
    // 데이터셋 Class
    function DataSet() {

        // 데이터셋
        this.dataSet = {};
        this.autoTables = false;

        // 배열 차원 검사 (최대 제한값 10 설정됨)
        // 첫번째 배열만 검사 (배열의 넢이가 같은 겨우만)
        // _getArrayLevel(pElem) 사용법
        function _getArrayLevel(pElem, pDepts) {
            var MAX     = 10;
            var level   = 0;
            
            pDepts = pDepts || 0;

            if (pElem instanceof Array && MAX > pDepts) {
                level++;
                pDepts++;
                level = level + this._getArrayLevel(pElem[0], pDepts);  // 재귀로 깊이 찾기
            }
            return level;
        }

        // 초기화
        DataSet.prototype.init = function() {
            this.dataSet = {
                tables: [],
                dataRow: {}
            };
        }

        // 레코드셋 초기화
        DataSet.prototype.initRecord = function() {}

        // 데이터셋 설정

        DataSet.prototype.setDataSet = function(pDataSet) {
              this.setTables(pDataSet.tables);
              this.setRecord(pDataSet.dataRow);
        }

        // 레코드 삽입(생성)
        DataSet.prototype.setTables = function(pDataTables) {

            try { 
                this.dataSet.tables = pDataTables;
            } catch (e) {
                this.init();    // 실패시 다시 초기화
                console.log(e);
            } finally { 
            } 
        }

        // 자동 DS.talbes 삽입
        DataSet.prototype.SetAutoTables = function(pDataRow) {
            // TODO: 
        }
        

        // 레코드 삽입(생성)
        // pDataRow = {}
        DataSet.prototype.setRecord = function(pDataRow) {
            var isSuccess = false;
            try { 
                // for-3 : tables 배열
                for (var prop in  pDataRow) {
                    if ( pDataRow.hasOwnProperty(prop)){
                        // this.dataSet.dr
                        isSuccess = this.createRecord(prop, pDataRow[prop]);
                        
                        if (!isSuccess) {    // 예외처리
                            throw new Error('레코드 등록 오류 :' + prop);
                        }
                    }
                }
            } catch (e) {
                this.init();    // 실패시 다시 초기화
                console.log(e);
            } finally { 
            }          
        }

        // 레코드 삽입(생성)
        DataSet.prototype.createRecord = function(pTables, pRecords) {
            var arrLevel    = 0;
            var record_key  = {};

            this.dataSet.dr = this.dataSet.dr || {};
            
            // TODO : try 로직 필요

            // TODO: tables 정보 여부 활인 로직 
            
            // TODO : tables 컬럼갯수와 레코드 갯수 확인

            // 이중배열 구조 맞추기
            arrLevel = _getArrayLevel();
            if ( pRecords === 1) {
                pRecords = [pRecords];  
            } else if (pRecords === 0) {
                pRecords = [[pRecords]];  
            }
            // for-2 :: row 배열
            for (var i = 0; i < pRecords.length; i++) {
                this.dataSet.dr[pTables] = this.dataSet.dr[pTables] || [];
                record_key = this.regRecordKey(pTables, pRecords[i]);
                this.dataSet.dr[pTables].push(record_key);
            }
            return true;
        }

        // 레코드 수정(갱신)
        DataSet.prototype.updateRecord = function() {}

        // 레코드 삭제
        DataSet.prototype.deleteRecord = function() {}

        // 레코드 키 등록
        DataSet.prototype.regRecordKey = function(pTables, pRecord) {
            var record      = {};
            var tableIdx    = null;
            var columnName  = "";
            // TODO: pRecord 의 배열 검사

            record = pRecord;   // 객체 <= 배열 주입

            // for-1 column 배열
            for (var i = 0; i < pRecord.length; i++ ) {
                tableIdx = this.getTableIndex(pTables);
       
                if (tableIdx === null) {    // 예외처리
                    throw new Error('데이터셋 tables index 오류 :' + prop);
                }
                columnName = this.dataSet.tables[tableIdx].colume[i].name; 
                record[columnName] = pRecord[i];    // #4 테이블.Row.key = 컬럼 연결
            }
            
            return record;
        }

        // 레코드 테이블 idx 얻기
        DataSet.prototype.getTableIndex = function(pTableName) {
            var tables = this.dataSet.tables;

            for(var i = 0; i < tables.length; i++) {
                if (tables[i].name === pTableName) {
                    return i;
                }
            }
            return null;
        }

        // 스키마 검사
        DataSet.prototype.isSchemaCheck = function() {}
    }

    // *************************************
    // 테이블 바인딩 Class
    function TableBinding() {

        // dataRecord 큐
        // 명령, 테이블, row [, column]
        this.dataRecordQueue = [{CRUD: ""}];    

        // 테이블 바인딩 초기화
        TableBinding.prototype.init = function() {
            this.dataRecordQueue = [];
        }

        // 레코드 바인딩
        TableBinding.prototype.bindRecord = function() {

        }

        // 추가/삽입 바인딩
        TableBinding.prototype.bindAppendRecord = function() {}

        // 교체 바인딩
        TableBinding.prototype.bindReplaceRecord = function() {}

        // 제거 바인딩
        TableBinding.prototype.bindRemoveRecord = function() {}

        // 큐 넣기
        TableBinding.prototype.pushQueue = function() {}

        // 큐 빼기
        TableBinding.prototype.popQueue = function() {}
    }

    // *************************************
    // 템플릿 Class
    function Template() {

        this.template = [];

        // 템플릿 초기화
        Template.prototype.init = function() {
            this.template = [];
        }

        // 템플릿 등록
        Template.prototype.registerTemplate = function() {}

        // 템플릿 해제
        Template.prototype.unregisterTemplate = function() {}

        // 템플릿 받기
        Template.prototype.getTemplate = function() {}
    }

    // *************************************
    // 테이블 템플릿 Class
    function TableTemplate() {
        Template.call(this);  // 상속(부모생성자 호출)


    }
    TableTemplate.prototype =  Object.create(Template.prototype);
    TableTemplate.prototype.constructor = TableTemplate;

    // *************************************
    // 요소 컨테이너 Class
    function Container() {
        this.container = null;
    }

    // *************************************
    // 테이블 컨테이너 Class
    function TableContainer() {
            Container.call(this);  // 상속(부모생성자 호출)
            
            var _table      = null;
            var _thead      = null;
            var _tbody      = null;
            var _tfooter    = null;
            var _areaTop    = null;
            var _areaBottom = null;

            // 컨테이너 초기화 
            TableContainer.prototype.init = function() {
                if (this.container) this.container.innerHTML = '';
                this.container  = null;
                _table          = null;
                _thead          = null;
                _tbody          = null;
                _tfooter        = null;
                _areaTop        = null;
                _areaBottom     = null;
            }

            // 컨테이너 생성(추가)
            TableContainer.prototype.createContainer = function() {}

            // 컨테이너 붙임
            TableContainer.prototype.appendContainer = function() {}

            // 컨테이너 교체
            TableContainer.prototype.replaceContainer = function() {}

            // 컨테이너 삭제
            TableContainer.prototype.removeContainer = function() {}

            // 요소 생성
            TableContainer.prototype.createElements = function() {}

            // row 컨테이너 요소 생성(tr생성)
            TableContainer.prototype.createRecordElement = function() {}

            // column 컨테이너 요소 생성(td생성)
            TableContainer.prototype.createColumnElement = function() {}

            // 요소 등록(붙임)
            TableContainer.prototype.appendElements = function() {}

            // 요소 교체
            TableContainer.prototype.replaceElements = function() {}

            // 요소 제거
            TableContainer.prototype.removeElements = function() {}

            // 요소 선택
            TableContainer.prototype.selectorElements = function() {}

            // 컨테이너 얻기
            TableContainer.prototype.getContainer = function() {}
    }
    TableContainer.prototype =  Object.create(Container.prototype);
    TableContainer.prototype.constructor = TableContainer;

    console.log('IIFE');
}());

// #######################################################
// OOP 상속 (Object.create + call 방식) 가장 좋은 예
function Parent() {
}

function Child(a, c) {
    Parent.call(this);
}
Child.prototype =  Object.create(Parent.prototype);
Child.prototype.constructor = Child;




