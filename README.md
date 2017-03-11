PolymerRef_2.0

 - 폴리머 정의

 - 폴리머 요소 상속
    + 사용자 요소 상속
    + 내장 요소 상속

 - ES6
    + 상위 호출
 
 - slot 의 사용 사례
 
 - IE 관련 호환성 관련 설명


############################
 - 주요 필요한 임시 소스 샘플
 
 - 컴파일 빌더에 관한 전반적인 소스

 - HTMLElement 상속후 일반 클래스 사용
    + id 로 호출하여 메소드 호출 => OK
 
 - 쉐도우 DOM 이용

# 범용브라우저 컴파일
polymer build --js-compile

# OSX 에 설치 
sudo -s                             : OSX 에서 설치시 root 권한 얻기
npm install -g polymer-cli@next     : 설치
polymer --version                   : 버전확인

# polymer 설치
bower install Polymer/polymer#2.0.0-rc.2