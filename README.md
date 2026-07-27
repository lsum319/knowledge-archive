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
- Spring Boot
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

```
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
 ├── common
 └── config
```

---

## 🗄 Database

현재 User와 Material을 중심으로 프로젝트를 구성하고 있습니다.

### User

- 회원 정보 관리
- 이메일 로그인

### Material

- 제목
- 메모
- URL
- 작성일
- 수정일
- 작성자(User)

---

## ✅ Implemented Features

### User

- [x] 회원가입
- [x] 사용자 조회

### Material

- [x] 자료 등록
- [x] 자료 목록 조회
- [x] 자료 상세 조회
- [x] 자료 수정
- [x] 자료 삭제

### Common

- [x] PostgreSQL 연동
- [x] MyBatis Mapper 적용

---

## 🚧 In Progress

- [ ] 로그인 API
- [ ] 예외 처리
- [ ] Validation 적용
- [ ] 검색 기능
- [ ] 태그 기능
- [ ] 리팩토링

---

## 📖 API

Swagger를 통해 API를 테스트할 수 있습니다.

```
http://localhost:8080/swagger-ui/index.html
```

---

## 💡 Why MyBatis?

실무에서 사용했던 기술 스택을 기반으로 프로젝트를 진행하기 위해 MyBatis를 선택했습니다.

SQL을 직접 작성하면서 데이터 조회 및 매핑 과정을 명확하게 이해하고 관리하는 것을 목표로 하고 있습니다.

---

## 📝 Development Log

프로젝트를 진행하면서 작성한 내용

- 코드 컨벤션
- ERD 설계
- 작업 일지
- 트러블슈팅
- 기능 구현 과정

은 지속적으로 정리하고 있습니다.

---

## 📅 Roadmap

### Step 1

- 회원 기능
- 자료 CRUD

### Step 2

- 검색 기능
- 태그 기능

### Step 3

- Elasticsearch 적용 검토

### Step 4

- AI를 활용한 자료 추천 및 요약 기능 검토

---

## 📈 Future Improvements

- JWT 인증
- Elasticsearch
- 테스트 코드 작성
- Docker 배포
- CI/CD 적용

---

## 👨‍💻 Author

Backend Developer

Java / Spring Boot / PostgreSQL / MyBatis