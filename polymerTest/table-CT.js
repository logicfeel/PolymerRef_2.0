/**
 * 테이블형 컨테이너
 * - 동적으로 DOM 생성
 * - td, th 태그에 동적으로 컨테이너 또는 텍스트 삽입
 */
class TableContainer {
    constructor() {
        super();
    }
    
    /**
     * 장점 : 전체 구조를 한번에 파악 하기 쉽다.
     * 단점 : row 가 분리 되어 있고, JSON 깊이가 깊다.
     */
    _table = {
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
            row: [null]
        }
    };

    /**
     * 변형 타입
     */
    _table = {
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
    _table = {
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
     */


}