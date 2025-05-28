# survey-mate-web
지은 &amp; 다정이의 설문조사 프로젝트의 프론트엔드

Back-End : https://github.com/uwhami/survey-mate-api

&nbsp;

## Survey Mate Web 설명

Next.js 기반 설문조사 플랫폼의 프론트엔드 프로젝트입니다.  
사용자는 설문 응답, 로그인/회원가입, 그룹 관리 기능을 웹에서 편리하게 이용할 수 있습니다.  
백엔드와는 REST API로 연동되며, 사용자 친화적인 인터페이스와 공통 컴포넌트 아키텍처를 적용하였습니다.


##  주요 기술 스택

- **Next.js**, **React**, **TypeScript**
- **Recoil** – 전역 상태 관리
- **i18next** – 다국어 지원 (국문/영문)
- **Tailwind CSS** – 반응형 UI 스타일링
- **axios**, **react-hook-form**


## 주요 구현 기능

### UI 아키텍처 & 인증
- RESTful API 연동 구조 기반으로 페이지 및 컴포넌트 설계
- JWT 기반 로그인 인증 및 사용자 역할에 따른 화면 분기 처리
- 로그인 상태 관리를 위한 Recoil 기반 전역 상태관리 적용

### 컴포넌트 구조 & 공통 기능 설계
- Recoil, Custom Hook을 활용한 전역 알림 모달창, 로딩바 구현
- i18next를 활용한 다국어 지원 (국문/영문)

### 스타일링 & 페이지 구성
- Tailwind CSS를 기반으로 반응형 UI 구성
- 사용자 친화적인 레이아웃, 테마 컬러 일관성 유지

&nbsp;
## 수정 예정 기능
- 설문지 작성 시 Range 범위 기능 추가 에러

## 추가 예정 기능
- 그룹이 또는 일반 설문 url 주소 복사 기능.
