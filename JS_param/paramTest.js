



/**
 * 스크립트의 get 형식의 파라메터를 리턴한다.
 * @param {String} fileName 현재 파일명.js
 */
function getParamInner(fileName) {
    var scripts = document.scripts;
    var arrParam = {};

    for (var i = 0; i < scripts.length; i++) {
        var str  = String(scripts[i].src);
        if (str.indexOf("paramTest.js") > 0 ) {
            arrParam  = getParamJson(str);
            console.log('OK file');
        }
    }

    return arrParam;
}

var test2 = getParamInner("paramTest.js");

console.log('-js End-');