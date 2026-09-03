````markdown
# Knowledge Archive

학습한 지식과 참고 자료를 한곳에 저장하고, 제목 검색과 태그로 다시 찾을 수 있도록 만든 개인 지식 관리 서비스입니다.

Spring Boot 기반 REST API와 Thymeleaf 화면을 함께 제공하며, 사용자 인증부터 자료와 태그 관리까지 하나의 애플리케이션으로 구성했습니다.

## 주요 기능

### 사용자

- **회원가입**: 이메일, 비밀번호 등 요청값을 검증한 뒤 사용자를 등록합니다.
- **이메일 중복 확인**: 가입 전에 동일한 이메일로 등록된 사용자가 있는지 확인합니다.
- **안전한 비밀번호 저장**: 원문 비밀번호를 저장하지 않고 BCrypt로 암호화합니다.
- **이메일 기반 로그인**: Spring Security form login을 통해 로그인 요청을 처리합니다.
- **인증 사용자별 데이터 접근**: 로그인 세션의 사용자 식별자를 기준으로 자료를 조회합니다.

### 자료

- **자료 등록**: 제목, 메모, URL과 태그를 함께 저장할 수 있습니다.
- **자료 목록 조회**: 로그인한 사용자의 자료만 목록으로 조회합니다.
- **자료 상세 조회**: 자료의 상세 내용과 연결된 정보를 확인합니다.
- **자료 수정**: 자료 내용을 수정하고 연결된 태그 관계를 최신 상태로 동기화합니다.
- **자료 삭제**: 자료와 연결된 태그 관계를 함께 정리한 뒤 자료를 삭제합니다.
- **제목 검색**: 제목 조건으로 필요한 자료를 빠르게 검색합니다.
- **태그 검색**: 하나 이상의 태그 조건을 사용해 관련 자료를 조회합니다.

### 태그

- **태그 생성**: 자료를 분류하기 위한 태그를 등록합니다.
- **태그 목록 및 상세 조회**: 등록된 태그를 전체 또는 개별 단위로 조회합니다.
- **태그 수정 및 삭제**: 태그 이름을 변경하거나 불필요한 태그를 삭제합니다.
- **자료 연결 관리**: 연결 테이블을 통해 하나의 자료에 여러 태그를 연결하고, 하나의 태그를 여러 자료에서 사용할 수 있습니다.

### 공통

- **일관된 API 응답**: 공통 응답 객체를 사용해 API 응답 형식을 관리합니다.
- **입력값 검증**: Bean Validation과 `@Valid`를 이용해 잘못된 요청을 차단합니다.
- **예외 응답 표준화**: `@RestControllerAdvice`로 검증 실패, 중복 이메일, 사용자 조회 실패, 잘못된 비밀번호를 처리합니다.
- **API 문서화**: Swagger / OpenAPI를 통해 엔드포인트를 확인하고 테스트할 수 있습니다.

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Language | Java 17 |
| Framework | Spring Boot 3.5.16 |
| Security | Spring Security 6, BCrypt |
| Persistence | MyBatis 3.0.5 |
| Database | PostgreSQL |
| View | Thymeleaf |
| API Docs | Springdoc OpenAPI 2.8.16 |
| Build | Gradle |

## 기술적 요소

### 계층형 구조와 도메인 분리

사용자, 자료, 태그를 각각 독립적인 도메인으로 나누고 Controller, Service, Mapper, DTO, Domain의 역할을 분리했습니다.
요청과 응답은 DTO로 관리하고, 비즈니스 로직은 Service 계층에 두어 API 진입점과 데이터 접근 로직의 결합도를 낮췄습니다.

### MyBatis 기반 SQL 제어

MyBatis Mapper 인터페이스와 XML Mapper를 조합해 SQL을 직접 관리합니다.
`map-underscore-to-camel-case` 설정으로 데이터베이스의 snake_case 컬럼과 Java의 camelCase 필드를 매핑하며, 조회 조건에 따른 SQL을 명시적으로 관리할 수 있습니다.

### 트랜잭션을 통한 관계 데이터 일관성

자료를 생성하거나 수정할 때 자료 본문과 `material_tag` 관계 데이터를 하나의 작업 단위로 처리합니다.
수정 시 기존 태그 관계를 삭제한 뒤 새 관계를 저장하고, 삭제 시에도 연결 관계를 먼저 정리해 참조 데이터가 남지 않도록 구성했습니다.

### 사용자 인증과 보안

Spring Security의 인증 흐름과 접근 제어를 사용합니다.
비밀번호는 `PasswordEncoder`로 BCrypt 해시 처리하며, 인증이 필요한 리소스에는 로그인 사용자만 접근할 수 있도록 설정했습니다.
JWT 서명 키와 만료 시간 설정을 주입받는 토큰 제공자도 구성되어 있어 인증 확장에 필요한 기반을 마련했습니다.

### 전역 예외 처리와 검증

`@RestControllerAdvice`에서 예외를 한곳에서 처리하고, 예외 유형에 따라 적절한 HTTP 상태 코드와 오류 메시지를 반환합니다.
Controller의 요청 검증과 Service의 비즈니스 예외를 분리해 정상 흐름과 오류 흐름을 명확하게 유지합니다.

### 서버 렌더링과 REST API의 결합

Thymeleaf 템플릿으로 로그인, 회원가입, 자료, 태그 관리 화면을 제공하면서 같은 Spring Boot 애플리케이션에서 REST API도 제공합니다.
화면 라우팅은 `page` 패키지로 분리해 도메인 API Controller와 책임을 구분했습니다.

## 프로젝트 구조

```text
src/main/java/com/sumin/knowledgearchive
├── common       # 공통 응답 및 예외 처리
├── config       # Spring 및 Swagger 설정
├── material     # 자료 도메인과 API
├── page         # Thymeleaf 화면 라우팅
├── security     # 인증 및 보안 처리
├── tag          # 태그 도메인과 API
└── user         # 사용자 도메인과 API

src/main/resources
├── mapper       # MyBatis XML Mapper
├── static       # CSS 및 JavaScript
└── templates    # Thymeleaf 템플릿
```

## 데이터 관계

자료와 태그는 연결 테이블을 이용한 N:M 관계입니다.

```text
User 1 ─── N Material 1 ─── N Material_Tag N ─── 1 Tag
```

`material_tag`는 `material_id`, `tag_id` 복합 키를 사용하여 같은 관계가 중복 저장되지 않도록 합니다.

## 실행 환경

- Java 17 이상
- PostgreSQL 14 이상
- Git

## 화면 및 API

주요 화면:

- `/login.html` 로그인
- `/signup.html` 회원가입
- `/materials.html` 자료 목록
- `/material-create.html` 자료 등록
- `/tags.html` 태그 관리

Swagger UI:

```text
http://localhost:8080/swagger-ui/index.html
```

주요 API 리소스:

| 리소스 | 경로 | 설명 |
| --- | --- | --- |
| User | `/user` | 사용자 조회, 회원가입, 로그인 |
| Material | `/material` | 자료 CRUD 및 제목 검색 |
| Tag | `/tag` | 태그 CRUD |

## 테스트

```bash
gradlew.bat test
```

macOS / Linux에서는 `./gradlew test`를 사용합니다.

## 현재 작업 및 개선 예정

- 태그 기반 자료 검색
- 테스트 코드 확대
- API 설계 및 응답 구조 개선
- Docker 기반 배포
- CI/CD 구성
- Elasticsearch 도입 검토
- AI 기반 자료 추천 및 요약 검토

## 라이선스

현재 별도의 라이선스를 지정하지 않았습니다.
