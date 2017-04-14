

// ******************************************
// 1단계 : 호출 형태 요약

var ds = new DataSet("t_dataSet");

var CD1 = new ContainerAdapter();
CD1.import(CD1_sel);
CD1.insertTable("Notice", "#template_sub2 tbody");
CD1.tables["Notice"].record.import(select_elem, "tr");
CD1.tables["Notice"].column.import(select_elem, "tr");

var A1 = new AjaxAdapter();
A1.insertTable("Notice");
A1.tables["Notice"].select.url = "Notice_Lst.C.asp";
A1.tables["Notice"].select.addCollection("abc=sss");
A1.fill(ds, "Notice");
A1.tables["Notice"].select.onSucceed = function () {
        CD1.update(ds, "Notice");
};

// ******************************************
// 2단계 : 객체 형태

var ds = new DataSet({
    name : "t_dataSet",
});
var CD1 = new ContainerAdapter({
    import: "",
    tables: { 
        name: "Notice", 
        selector: "#template_sub2 tbody",
        record: { selector: "#template_sub2 tbody" },
        column: { selector: "#template_sub2 tbody" }
    },
});

var A1 = new AjaxAdapter({
    tables: {
        name: "Notice",
        select: {
            url: "Notice_Lst.C.asp",
            Collection: "abc=sss",
            onSucceed: function () { CD1.update(ds, "Notice");}
        }
    }
});
