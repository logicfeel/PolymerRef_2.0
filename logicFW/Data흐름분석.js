

// 
/*
    ContainerAdapter                    : 생성
        importTemplate(obj)             : 원본템플릿객체 
            clear()                     : 초기화
            // 
            importElem                  : 타입별 가져옴
            element = importElem        : 객체설정
            _original = importElem      : 원본객체 설정
        insertTable("head", "thead")    : 테이블 및 슬롯 설정

*/


    var CD = new ContainerAdapter("div");
    var template = document.querySelector("#temp_1").firstChild;
    CD.template.importTemplate(template);

    CD.insertTable("body", "tbody");

    var mainElem;   // 테스용
    // mainElem = common.querySelecotrOuter(CD._original, "*");
    mainElem = CD.template._original;


    select_elem = mainElem.querySelector("tbody tr");
    CD.tables["body"].recordElement.importTemplate(select_elem, "tr");

    select_elem = mainElem.querySelector("tbody tr td");
    CD.tables["body"].columnElement.importTemplate(select_elem, "td");





    // ###############################

    /**
     * 1안 :원본 템플릿을 활용한 경우
     */

    var CD = new ContainerAdapter("div");                       // 붙임 위치 바로 지정
    var template = document.querySelector("#temp_1").firstChild;
    CD.template.import(template);
    CD.insertTable("body", "tbody");                            // 테이블에 슬롯을 추가한 경우
    

    // 주입위치
    CD.tables["body"].record.slot("tr");
    CD.tables["body"].column.slot("td");

    CD.update(ds, "body");


    /**
     * 2안 : 슬롯에 별도 요소 추가할 경우
     */
    var CD = new ContainerAdapter("div");                       // 붙임 위치 바로 지정
    var template = document.querySelector("#temp_1").firstChild;
    CD.template.import(template);
    CD.insertTable("body", "tbody");                            // 테이블에 슬롯을 추가한 경우
    

    var record_Elem = document.querySelector("#li");
    var column_Elem = document.querySelector("#li span");

    /**
     * - 선택자 = 슬롯 위치
     * - 선택자 != 슬롯 위치
     * 
     * - 잘라내서 삽입하는 경우
     * - 선택자에 주입하는 경우
     */

    CD.tables["body"].record.import( "tr");
    CD.tables["body"].column.import("td");

    CD.update(ds, "body");
    