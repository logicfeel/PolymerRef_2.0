
(function(global) {
    /**
     * @name LAarry (LoagicArayy)
     */
    function LArray() {
        // Array.call(this);

        // var _items = [];

        // function _setPpropertie(pIdx) {
            
        //     var obj = {
        //         get: function() { return _items[pIdx]; },
        //         set: function(newValue) { _items[pIdx] = newValue; },
        //         enumerable: true,
        //         configurable: true
        //     };
        //     return obj;        
        // }

        // /**
        //  *  - pValue : (필수) 값  
        //  *      +  구조만 만들경우에는 null 삽입
        //  *  - 객체는 필수, pAttrName : (선택) 속성명
        //  */
        // LArray.prototype.pushAttr = function(pValue, pAttrName) {
            
        //     var index   = -1;
            
        //     this.push(pValue);
        //     _items.push(pValue);

        //     index = (this.length === 1) ? 0 : this.length  - 1;

        //     Object.defineProperty(this, [index], _setPpropertie(index));
        //     if (pAttrName) {
        //         Object.defineProperty(this, pAttrName, _setPpropertie(index));
        //     }

        // };
         
        this._items = [];
        this.abc = 12;

        function _setPpropertie(pIdx) {
            
            var obj = {
                get: function() { return this._items[pIdx]; },
                set: function(newValue) { this._items[pIdx] = newValue; },
                enumerable: true,
                configurable: true
            };
            return obj;        
        }

        /**
         *  - pValue : (필수) 값  
         *      +  구조만 만들경우에는 null 삽입
         *  - 객체는 필수, pAttrName : (선택) 속성명
         */
        LArray.prototype.pushAttr = function(pValue, pAttrName) {
            
            var index   = -1;
            
            this.push(pValue);
            this._items.push(pValue);

            index = (this.length === 1) ? 0 : this.length  - 1;

            Object.defineProperty(this, [index], _setPpropertie(index));
            if (pAttrName) {
                Object.defineProperty(this, pAttrName, _setPpropertie(index));
            }

        };

    }
    (function() {   // prototype 정의
        LArray.prototype =  Object.create(Array.prototype); // Array 상속
        LArray.prototype.constructor = LArray;
        LArray.prototype.parent = Array.prototype;
        LArray();   // 내부에 정의된 프로토타입 로딩
    }());

    global.LArray = this.LArray || LArray;

}(this));