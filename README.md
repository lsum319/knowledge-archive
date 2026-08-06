````markdown
# Knowledge Archive

개인적으로 학습한 지식과 참고 자료를 체계적으로 관리하기 위한 **Knowledge Archive** 프로젝트입니다.

단순한 메모 저장이 아닌, 검색과 태그 기반으로 필요한 정보를 빠르게 찾을 수 있는 지식 관리 서비스를 목표로 개발하고 있습니다.

현재는 Spring Boot 기반의 백엔드 API를 구현하고 있으며, 기능을 지속적으로 추가 및 개선하고 있습니다.

---

## 📌 Project Overview

공부를 하면서 정리한 내용들이 노션, 메모장, 블로그, 북마크 등에 흩어져 있어 원하는 정보를 다시 찾기 어려운 문제를 해결하고자 시작한 프로젝트입니다.

Knowledge Archive는 개인이 수집한 자료를 하나의 공간에서 관리하고, 효율적으로 검색할 수 있는 서비스를 목표로 합니다.

---

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot 3.5.16
- MyBatis

### Database
- PostgreSQL

### Build Tool
- Gradle

### API Documentation
- Swagger(OpenAPI)

### Version Control
- Git
- GitHub

---

## 📂 Project Structure

```text
src
├── user
│    ├── controller
│    ├── service
│    ├── mapper
│    ├── domain
│    ├── dto
│    └── xml
│
├── material
│    ├── controller
│    ├── service
│    ├── mapper
│    ├── domain
│    ├── dto
│    └── xml
│
├── tag
│    ├── controller
│    ├── service
│    ├── mapper
│    ├── domain
│    ├── dto
│    └── xml
│
├── common
│    └── exception
│
└── config
````

---

## 🗄 Database

현재 User, Material, Tag를 중심으로 프로젝트를 구성하고 있으며,
Material과 Tag는 N:M 관계로 설계했습니다.

### User

* 회원 정보 관리
* 이메일 로그인

### Material

* 제목
* 메모
* URL
* 작성일
* 수정일
* 작성자(User)

### Tag

* 태그 이름
* 태그 생성 / 수정 / 삭제

### Material_Tag

Material과 Tag의 N:M 관계를 관리하는 연결 테이블입니다.

```text
Material 1 ─── N Material_Tag N ─── 1 Tag
```

`material_tag`는 `material_id`와 `tag_id`를 복합 PK로 사용하여 동일한 Material-Tag 관계가 중복 저장되는 것을 방지하도록 설계했습니다.

---

## ✅ Implemented Features

### User

* [x] 회원가입
* [x] 사용자 조회
* [x] 로그인
* [x] 이메일 중복 검사
* [x] 회원가입 요청 데이터 Validation
* [x] 사용자 관련 예외 처리

### Material

* [x] 자료 등록
* [x] 자료 목록 조회
* [x] 자료 상세 조회
* [x] 자료 제목 검색
* [x] 자료 수정
* [x] 자료 삭제
* [x] 자료 생성 시 태그 연결
* [x] 자료 수정 시 태그 관계 동기화
* [x] 자료 삭제 시 연결된 태그 관계 삭제

### Tag

* [x] 태그 생성
* [x] 태그 목록 조회
* [x] 태그 상세 조회
* [x] 태그 수정
* [x] 태그 삭제

### Material-Tag

* [x] Material : Tag N:M 관계 설계
* [x] Material 생성 시 태그 연결
* [x] Material 수정 시 태그 관계 동기화
* [x] Material 삭제 시 연결된 관계 데이터 삭제
* [x] `(material_id, tag_id)` 복합 PK 적용

### Common

* [x] PostgreSQL 연동
* [x] MyBatis Mapper 적용
* [x] 전역 예외 처리
* [x] Bean Validation 적용
* [x] Swagger(OpenAPI) 적용
* [x] 트랜잭션 처리

---

## ⚠️ Exception Handling

Spring의 `@ControllerAdvice`를 이용하여 전역 예외 처리를 적용했습니다.

주요 예외 상황을 구분하여 적절한 HTTP 상태 코드와 에러 응답을 반환하도록 구성했습니다.

* 존재하지 않는 사용자
* 잘못된 비밀번호
* 중복 이메일
* 존재하지 않는 Material
* 존재하지 않는 Tag
* 요청 데이터 Validation 실패

---

## 🔍 Validation

회원가입 등의 요청 데이터에 Bean Validation을 적용했습니다.

예:

```java
@Email
private String email;

@NotBlank
@Size(min = 5, max = 15)
private String password;
```

Controller에서 `@Valid`를 사용하여 요청 데이터를 검증하고,
검증 실패 시 전역 예외 처리기를 통해 클라이언트에 오류 응답을 전달합니다.

---

## 📖 API

Swagger를 통해 API를 테스트할 수 있습니다.

```text
http://localhost:8080/swagger-ui/index.html
```

주요 API 영역:

```text
/user
/material
/tag
```

---

## 💡 Why MyBatis?

실무에서 사용했던 기술 스택을 기반으로 프로젝트를 진행하기 위해 MyBatis를 선택했습니다.

SQL을 직접 작성하면서 데이터 조회 및 매핑 과정을 명확하게 이해하고 관리하는 것을 목표로 하고 있습니다.

---

## 📝 Development Log

프로젝트를 진행하면서 작성한 내용

* 코드 컨벤션
* ERD 설계
* 작업 일지
* 트러블슈팅
* 기능 구현 과정
* API 설계 및 테스트

은 지속적으로 정리하고 있습니다.

---

## 📅 Roadmap

### Step 1 - 기본 기능

* [x] 회원 기능
* [x] 자료 CRUD

### Step 2 - 태그 및 검색

* [x] 자료 제목 검색
* [x] 태그 CRUD
* [x] Material-Tag N:M 관계 구현
* [ ] 태그 기반 자료 검색

### Step 3 - 품질 개선

* [x] Exception Handling
* [x] Validation
* [x] Swagger
* [ ] 테스트 코드 작성
* [ ] API 리팩토링

### Step 4 - 검색 및 AI 기능

* [ ] Elasticsearch 적용 검토
* [ ] AI를 활용한 자료 추천 및 요약 기능 검토

---

## 📈 Future Improvements

* JWT 인증
* Elasticsearch
* 테스트 코드 작성
* Docker 배포
* CI/CD 적용
* AI 기반 자료 추천 및 요약
