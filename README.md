# Knowledge Archive

> **자료를 저장하고 태그로 관리하며, 자료 간 관계를 마인드맵으로 시각화하는 개인 지식 관리 서비스**

Knowledge Archive는 학습 및 업무 중 수집한 자료를 관리하고, 자료 간의 관계를 마인드맵으로 구성할 수 있도록 만든 개인 프로젝트입니다.

기본적인 자료 CRUD에서 시작해 **사용자 인증·접근 제어 → 태그 및 검색 → 자료 관계 관리 → Cytoscape.js 기반 마인드맵**으로 기능을 확장했습니다.

---

## 주요 기능

### 자료 관리
- 자료 등록 / 조회 / 수정 / 삭제
- 제목 및 태그 기반 검색
- 자료별 작성자 관리
- 여러 태그 연결

### 사용자 인증
- 회원가입 및 이메일 중복 검증
- 비밀번호 유효성 검증 및 BCrypt 암호화
- Spring Security 기반 로그인
- 로그인 사용자 기준 자료 접근 제어

### 태그 관리
- 태그 생성 / 조회 / 수정 / 삭제
- Material - Tag 다대다 관계 관리
- 태그 삭제 시 연결 관계 정리

### 마인드맵
- 마인드맵별 자료 추가 / 삭제
- 자료를 노드로 시각화
- 노드 위치 좌표 저장 및 변경
- 자료 간 Edge 생성 / 삭제
- Edge의 source / target 관계 관리
- 마인드맵 내 자료 상세 수정

### Cytoscape.js
- Cytoscape.js 기반 그래프 UI
- 노드 생성 및 드래그
- 마우스 휠 감도 조정
- 우클릭 드래그를 통한 화면 이동

---

## 기술 스택

| 구분 | 기술 |
|---|---|
| Backend | Java, Spring Boot |
| Security | Spring Security |
| Database | PostgreSQL |
| Data Access | MyBatis |
| API Documentation | Swagger / OpenAPI |
| Frontend | HTML, CSS, JavaScript |
| Graph | Cytoscape.js |

---

## 핵심 데이터 구조

```text
USER
 │
 ├── MATERIAL
 │      │
 │      └── MATERIAL_TAG ── TAG
 │
 └── MINDMAP
        │
        ├── MINDMAP_MATERIAL ── MATERIAL
        │       └── coord_x / coord_y
        │
        └── EDGE
             ├── source
             └── target
```

- `MATERIAL`: 관리할 지식 자료
- `TAG`: 자료 분류 및 검색을 위한 태그
- `MINDMAP_MATERIAL`: 특정 마인드맵에 포함된 자료와 해당 노드의 좌표 관리
- `EDGE`: 같은 마인드맵에 포함된 자료 간의 연결 관계 관리

---

## 주요 구현

### 사용자 인증 및 접근 제어

Spring Security를 적용하여 로그인 사용자를 인증하고, 인증된 사용자 정보를 기반으로 자료의 작성자를 관리합니다.

자료 조회·수정·삭제 시 사용자 정보를 함께 검증하여 **본인이 관리할 수 있는 자료만 접근하도록 구현**했습니다.

### Material - Tag 관계 관리

자료와 태그의 다대다 관계를 `MATERIAL_TAG` 테이블로 분리했습니다.

자료 생성·수정 시 태그 관계를 함께 관리하고, 태그 삭제 시 연결된 관계도 정리합니다.

### 마인드맵 데이터 모델

동일한 Material을 여러 마인드맵에서 사용할 수 있도록 좌표 정보를 `MATERIAL`이 아닌 `MINDMAP_MATERIAL`에서 관리합니다.

따라서 하나의 자료가 마인드맵마다 다른 위치를 가질 수 있습니다.

### 자료 간 연결 관계

마인드맵의 자료 간 연결을 `EDGE`로 분리하여 관리합니다.

Edge의 source와 target이 해당 마인드맵에 실제로 포함된 자료인지 검증하여 데이터 무결성을 유지합니다.

### Cytoscape.js 기반 시각화

백엔드에서 마인드맵의 노드와 Edge 데이터를 Cytoscape.js에서 사용할 수 있는 JSON 형태로 제공하고, 프론트엔드에서 이를 그래프로 렌더링합니다.

---

## 개발 흐름

```text
Material CRUD
      ↓
Spring Security
      ↓
Tag & 검색
      ↓
Material - Tag 관계
      ↓
Mindmap
      ↓
Mindmap - Material
      ↓
Edge
      ↓
Cytoscape.js
      ↓
노드 생성 / 이동
```

기본적인 자료 관리 기능을 구현한 뒤, 자료 간 관계를 표현하고 시각적으로 탐색할 수 있도록 마인드맵 기능을 단계적으로 확장했습니다.

---

## API Documentation

Swagger UI에서 API를 확인하고 테스트할 수 있습니다.

```text
/swagger-ui/index.html
```

---

## 향후 개선

- 마인드맵 편집 기능 고도화
- 노드 및 Edge UI 개선
- 대규모 마인드맵 조회 및 좌표 업데이트 최적화
- 테스트 코드 확대
- 마인드맵 탐색 및 자료 검색 기능 개선
