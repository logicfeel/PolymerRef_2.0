


var test2;

var scripts = document.scripts;
for (var i = 0; i < scripts.length; i++) {
    var str  = String(scripts[i].src);
    if (str.indexOf("paramTest.js") > 0 ) {
        test2  = getParamJson(str);
        console.log('OK file');
    }
}
console.log('-js End-');