
(function(global) {
    'use strict';
    /**
     * !! prototype 노출형 부모 (부모.call(this);  <= 불필요
     * 제한1 : var(private) 사용 못함
     * 제한2 : 생성자 전달 사용 못함
     * 장점 : 중복 호출 방지 (성능 향상)  **
     * @name LAarry (LoagicArayy)
     */
    function LArray() {

        // this._items = [];
        // this._SCOPE = "LArray";

        // function _setPropertie(pIdx) {
            
        //     var obj = {
        //         get: function() { return this._items[pIdx]; },
        //         set: function(newValue) { this._items[pIdx] = newValue; },
        //         enumerable: true,
        //         configurable: true
        //     };
        //     return obj;        
        // }
    }
    (function() {   // prototype 상속 정의
        LArray.prototype =  Object.create(Array.prototype); // Array 상속
        LArray.prototype.constructor = LArray;
        LArray.prototype.parent = Array.prototype;
    }());

    LArray.prototype._items = [];
    LArray.prototype._SCOPE = "LArray";

    LArray.prototype._setPropertie = function(pIdx) {
        
        var obj = {
            get: function() { return this._items[pIdx]; },
            set: function(newValue) { this._items[pIdx] = newValue; },
            enumerable: true,
            configurable: true
        };
        return obj;        
    }

    LArray.prototype.setPropCallback = function(pPropName, pGetCallback, pSetCallback) {
        
        var obj = {
            enumerable: true,
            configurable: true
        };
        
        if (typeof pGetCallback === "function") {
            obj.get = pGetCallback;
        }
        if (typeof pSetCallback === "function") {
            obj.set = pSetCallback;
        }

        Object.defineProperty(this, pPropName, obj);
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

        Object.defineProperty(this, [index], this._setPropertie(index));
        if (pAttrName) {
            Object.defineProperty(this, pAttrName, this._setPropertie(index));
        }
    };

    // TODO: 삭제 구현 필요
    // pObject : pAttrName || pIdx 둘중 하나
    LArray.prototype.popAttr = function(pObject) {};

    global.LArray = global.LArray || LArray;

}(this));