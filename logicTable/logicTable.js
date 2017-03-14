    
/**
 * 동적 테이블 생성 (클래스)
 * @NAME : LogicTable
 * @DATE : 2017-03-14
 **/
function LogicTable() {
    var _pravate    = null;

    /**
     * @public attribute(속성/포로퍼티)
     **/
    this.version    = "0.0.0";
    this.dataSet    = {};
    this.container  = null;
    this.table      = null;
    this.thead      = null;
    this.tbody      = null;
    this.tfooter    = null;
    this.AreaTop    = null;
    this.AreaBottom = null;

    /**
     * ***************************************
     * @private method
     * ***************************************
     **/

    // 컨테이너 초기화 (기본객체 생성)
    LogicTable.prototype._createContainer = function() {
        var div        = document.createElement("div");
        var AreaTop    = document.createElement("div");
        var AreaBottom = document.createElement("div");
        var table      = document.createElement("table");
        var thead      = document.createElement("thead");
        var tbody      = document.createElement("tbody");
        var tfooter    = document.createElement("tfooter");

        // 요소 구성 등록
        table.appendChild(thead);
        table.appendChild(tbody);
        table.appendChild(tfooter);

        div.appendChild(AreaTop);
        div.appendChild(table);
        div.appendChild(AreaBottom);

        // 객체 속성에 참조 연결
        this.container  = div;       // 컨테이너 (div)
        this.table      =  this.container.querySelector('table');
        this.thead      =  this.container.querySelector('thead');
        this.tbody      =  this.container.querySelector('tbody');
        this.tfooter    =  this.container.querySelector('tfooter');
        this.AreaTop    = AreaTop;
        this.AreaBottom = AreaBottom;
    }

    // 컨테이너, 테이블 생성 유무
    LogicTable.prototype._isContainer = function() {
        if (this.container === null || this.table === null) {
            return false;
        } else {
            return true;
        }
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

        if (typeof pElem === "string") {
            elem = document.createTextNode(pElem);
        } else if (pElem instanceof Element) {
            elem = pElem;
        } else {
            // REVEIW : 조건이 맞는지 확인 필요
            elem = document.createElement(pElem);
        }
        return elem;
    }

    /**
     * **************************************
     * @public method(메소드)
     * **************************************
     **/

    /**
     * @method init
     * 초기화 (전체)
     */
    LogicTable.prototype.init = function() {
        this.dataSet    = {};
        this.container  = null;
        this.table      = null;
        this.thead      = null;
        this.tbody      = null;
        this.tfooter    = null;
        this.AreaTop    = null;
        this.AreaBottom = null;
    }

    /**
     * @method setDataSet
     * 데이터셋 설정
     * @param {JSON} JSON 형태의 정해진 스키마
     * 
     * 스키마
     *      {
     *          tables: "",
     *          dataRow: ""
     *      }
     * 
     */
    // 데이터셋 설정
    LogicTable.prototype.setDataSet = function(pJSON) {
    }

    /**
     * @method setHead
     * 동적 head 등록 (싱글 레코드)
     * @param {Array} 추가할 td 배열요소
     */
    LogicTable.prototype.setHead = function(pElem) {
        if (!this._isContainer()) {
            this._createContainer();
        }
        // var head = document.createElement('thead');
        var tr = this._createTr();
        var td = this._createTd(pElem);
        
        for (var i = 0; i < td.length; i++) {
            tr.appendChild(td[i]);
        }
        this.thead.appendChild(tr);
    }

    /**
     * @method setBody
     * 동적 body 등록 (멀티 레코드)
     * @param {Array} [[td요소]] 이중 배열 형태
     */
    LogicTable.prototype.setBody = function(pElem) {
        var body = document.createElement('tbody');
        var arrElem = null;
        var tr = null;
        var arrTd = null;
        
        for (var i = 0; i < pElem.length; i++) {
            arrElem = pElem[i];
            tr = this._createTr();
            arrTd = this._createTd(arrElem);
            
            for (var ii = 0; ii < arrTd.length; ii++) {
                tr.appendChild(arrTd[ii]);
            }
            this.tbody.appendChild(tr);
        }
    }

    // TODO: 동적 footer 등록 (싱글 레코드) 
    LogicTable.prototype.setFooter = function(pElem) {
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


}

