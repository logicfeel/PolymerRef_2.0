    
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
        
            for (var prop in  pJSON.dataRow) {
                if ( pJSON.dataRow.hasOwnProperty(prop)){
                    ds.dr[prop] = [];                                                   // #1 테이블 = 벼열타입

                    for (var i = 0; i < pJSON.dataRow[prop].length; i++ ) {
                        ds.dr[prop][i] = {};                                            // #2 테이블.Row = 객체타입
                        ds.dr[prop][i] = pJSON.dataRow[prop][i];                        // #3 테이블.Row.컬럼들 일괄 삽입 = 배열(객체에 혼합됨)

                        // 컬럼명(key)에 각각 값 삽입
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
 * set                  : 설정
 * register             : 등록
 * modify               : 수정
 * remove               : 삭제
 * CSS                  : CSS설정(추가/수정/삭제)
 * bind                 : 바인딩

 * 
 * [레코드셋]
 * {속성}
 * dataRecordQueue      : dr 큐
 * {메소드}
 * setDataSet           : 레코드 테이블 설정
 * createRecord         : 레코드 삽입(생성)
 * updateRecord         : 레코드 수정(갱신)
 * deleteRecord         : 레코드 삭제
 * initRecord           : 레코드 초기화
 * regRecordKey         : 레코드 키 등록
 * getTableIndex        : 레코드 테이블 idx 얻기
 * isSchemaCheck        : 스키마 검사
 *
 * [바인딩]
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
 * registerTemplate     : 템플릿 등록
 * unregisterTemplate   : 템플릿 해제
 * getTemplate          : 템플릿 받기
 * 
 * [컨테이너]
 * {속성}
 * name                 : 컨테이너 이름
 * {메소드}
 * initContainer        : 컨테이너 초기화 
 * createContainer      : 컨테이너 생성(추가)
 * appendContainer      : 컨테이너 붙임
 * replaceContainer     : 컨테이너 교체
 * removeContainer      : 컨테이너 삭제
 * createElements       : 요소 생성
 * createRecordElement  : Row 컨테이너 요소 생성(tr생성)
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

// 동적 요소 빌더
function DynamicElement() {
    DynamicElement.prototype.init = function() {}
    DynamicElement.prototype.set = function() {}
    DynamicElement.prototype.register = function() {}
    DynamicElement.prototype.modify = function() {}
    DynamicElement.prototype.remove = function() {}
    DynamicElement.prototype.css = function() {}
    DynamicElement.prototype.bind = function() {}
    DynamicElement.prototype.css = function() {}
}

// 동적 테이블 빌더
function LogicTable() {
    DynamicElement.call(this);  // 부모생성자
}
LogicTable.prototype =  Object.create(DynamicElement.prototype);
LogicTable.prototype.constructor = Child;

// 데이터셋
function DataSet() {
    DataSet.prototype.setDataSet = function() {}
    DataSet.prototype.createRecord = function() {}
    DataSet.prototype.updateRecord = function() {}
    DataSet.prototype.deleteRecord = function() {}
    DataSet.prototype.initRecord = function() {}
    DataSet.prototype.regRecordKey = function() {}
    DataSet.prototype.getTableIndex = function() {}
    DataSet.prototype.isSchemaCheck = function() {}
}

// 테이블 바인딩
function TableBinding() {
    TableBinding.prototype.bindRecord = function() {}
    TableBinding.prototype.bindAppendRecord = function() {}
    TableBinding.prototype.bindReplaceRecord = function() {}
    TableBinding.prototype.bindRemoveRecord = function() {}
    TableBinding.prototype.pushQueue = function() {}
    TableBinding.prototype.popQueue = function() {}
}

// 템플릿
function Template() {
    Template.prototype.registerTemplate = function() {}
    Template.prototype.unregisterTemplate = function() {}
    Template.prototype.getTemplate = function() {}
}

function TableTemplate() {
    Container.call(this);  // 상속(부모생성자 호출)


}
TableTemplate.prototype =  Object.create(Template.prototype);
TableTemplate.prototype.constructor = Child;

// 요소 컨테이너
function Container() {}

// 테이블 컨테이너
function TableContainer() {
        Container.call(this);  // 상속(부모생성자 호출)
        
        TableContainer.prototype.initContainer = function() {}
        TableContainer.prototype.createContainer = function() {}
        TableContainer.prototype.appendContainer = function() {}
        TableContainer.prototype.replaceContainer = function() {}
        TableContainer.prototype.removeContainer = function() {}
        TableContainer.prototype.createElements = function() {}
        TableContainer.prototype.createRecordElement = function() {}
        TableContainer.prototype.createColumnElement = function() {}
        TableContainer.prototype.appendElements = function() {}
        TableContainer.prototype.replaceElements = function() {}
        TableContainer.prototype.removeElements = function() {}
        TableContainer.prototype.selectorElements = function() {}
        TableContainer.prototype.getContainer = function() {}
}
LogicTable.prototype =  Object.create(DynamicElement.prototype);
LogicTable.prototype.constructor = Child;

// #######################################################
// OOP 상속 (Object.create + call 방식) 가장 좋은 예
function Parent() {
}

function Child() {
    Parent.call(this);
}
Child.prototype =  Object.create(Parent.prototype);
Child.prototype.constructor = Child;




