// 공통 함수
(function(global) {
    
    var common = common || {};

    // 배열 차원 검사 (최대 제한값 10 설정됨)
    // 첫번째 배열만 검사 (배열의 넢이가 같은 겨우만)
    // _getArrayLevel(pElem) 사용법
    // pDepts : 내부 사용값
    common.getArrayLevel = function(pElem, pDepts) {
        var MAX     = 10;
        var level   = 0;
        
        pDepts = pDepts || 0;

        if (pElem instanceof Array && MAX > pDepts) {
            level++;
            pDepts++;
            level = level + this.getArrayLevel(pElem[0], pDepts);  // 재귀로 깊이 찾기
        }
        return level;
    }

    // REVIEW: 공통화 필요
    common.isArray = function(value) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === "[object Array]";
        }
    }

    // REVIEW: 공통화 필요
    common.querySelecotrOuter = function(pElement, pSelector) {
        
        // TODO:  Element 검사
        var elem =  null;
        
        if (!pElement.parentElement) {
            elem = document.createElement('span');
            elem.appendChild(pElement);
        } else {
            elem = pElement.parentElement;
        }
        
        elem = elem.querySelector(pSelector);

        return elem;
    }

    // slot 기준으로 잘라내기
    common.cutElement = function(pOrgElement, pCutSelector, pIsRemove) {
        
        var maxLength   = 0;
        var tempElem    = null;
        var selectorElem    = null;

        pIsRemove   = pIsRemove || false;

        if (!(pOrgElement instanceof HTMLElement)) {
            throw new Error('pOrgElement가 HTMLElement 객체 아님 에러! :');
            return null;
        }

        if (pIsRemove) {
            tempElem = pOrgElement;
        } else {
            tempElem = pOrgElement.cloneNode(true);
        }
        
        selectorElem = common.querySelecotrOuter(tempElem, pCutSelector);
        // selectorElem = tempElem.querySelector(pCutSelector);
           
        maxLength = selectorElem.childNodes.length;

        for (var i = maxLength - 1; i >= 0; i--) {  // NodeList 임
            selectorElem.removeChild(selectorElem.childNodes[i]);
        }            
        return selectorElem;
    };

    global.common = common;

}(this));  
