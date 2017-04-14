# gulp 사용법


# 설치

    - 참조 사이트 : https://velopert.com/1344


# 설치 순서

    - npm install -g gulp :  Gulp 전역(Global) 설치하기

    * 도중에  graceful-fs 와 lodash 에 관한 경고가 뜨면, 최신버전으로 설치해주세요
    - npm install -g graceful-fs lodash


# 주요 항목 설명

gulp.task   : 작업정의

gulp.src    : 읽을 파일 지정

gulp.dest   : 저장 위치 지정

gulp.watch  : 변동 검사

---------------------------------------

gulp.task(name [, deps, fn])

    - name  : 테스크명  (String)
    - deps  : 테스크 내역 (Array) * deps test 를 수행 후 콜백 실행
    - fn    : 콜백 함수


[헨들바 연동]
https://www.npmjs.com/package/gulp-compile-handlebars

