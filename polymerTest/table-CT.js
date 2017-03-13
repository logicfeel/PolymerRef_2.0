/**
 * 테이블형 컨테이너
 * - 동적으로 DOM 생성
 * - td, th 태그에 동적으로 컨테이너 또는 텍스트 삽입
 */
class TableContainer {
    constructor() {
        super();

        /**
         * 장점 : 전체 구조를 한번에 파악 하기 쉽다.
         * 단점 : row 가 분리 되어 있고, JSON 깊이가 깊다.
         */
        this._table = {
            dataset: {
                item: {
                    type: {
                        item: {
                            type: {
                                type: String,
                                name: ""
                            },
                            row: [null]     // <- 삭제 요망
                        }
                        
                    },
                    name: "row"
                },
                row: [null]
            }
        };

        /**
         * 변형 타입
         */
        this._table = {
            dataset: {
                item: {
                    type: {
                        item: {
                            type: {
                                type: String,
                                name: ""
                            },
                            row: [null]
                        }
                        
                    },
                    name: "row"
                },
                row: [[null]]   // 중복 배열 형태
            }
        };

        /**
         * 일반화 시켜서 분리한 형태
         * 장점 : 깊이가 같다, 
         * 단점 : 
         */
        this._table = {
            dataset: {
                head : {
                    item: {
                        type: this.body,
                        name: "세로하목"
                    },
                    row: [null]
                },
                body: {
                    item: {
                        type: String,
                        name: "가로줄"
                    },
                    row: [null]
                }
            }
        };

        /**
         * 배열의 가로 세로에 대한 바인딩
         * 바인딩 = 배열 + 배열의타입
         * dataBind(json) 형태로 전달받아서 dataSet 형태로 저장관리함
         * .NET ADO 의 구조 참조함
         * "이것은 접근 관점의 구조를 표현함"
         */
        this.dataSet = {
            tables : [
                {
                    name: "body",
                    colume :[
                        {
                            name: "key1",
                            type: String,
                            title: "설명"
                        },
                        {
                            name: "key2",
                            type: Number,
                            title: "조회수"
                        }
                    ]
                }
            ],
            dataRow : {
                // this.tables[0].name,
                "body": [
                    { "key1": "AAA1", "key2": "BBB1" },
                    { "key1": "AAA2", "key2": "BBB2" }
                ]      
            }
        };

        var a = this.dataSet.dataRow.body[0].key1;
        var b = this.dataSet.dataRow.body[0].key2;

        /**
         * 원시자료
         */
        var orgJson = {
            tables : [
                {
                    name: "body",
                    colume :[
                        {
                            name: "key1",
                            type: String,
                            title: "설명"
                        },
                        {
                            name: "key2",
                            type: Number,
                            title: "조회수"
                        }
                    ]
                }
            ],
            dataRow : {
                // this.tables[0].name,
                "body": [
                    ["AAA1", "BBB1"],
                    ["AAA2", "BBB2"],
                ]      
            }
        };

        /**
         * this.dataSet 의 자료를 로딩함
         * 기본 접근 기능만 로딩함
         * @param {*} json 입력 JSON 데이터
         */
        function dataSetting(json) {
            // TODO: 입력된 데이터 구조를 표준화 형태로 맞춤
            var _j ={};
            _j.tables = json.tables;
            _j.dr = json.dataRow;
            //_j.
            this.dataSet = _j;
            return _j;
        }

        var temp = dataSetting(orgJson);

        var bbb;
        
    }


}