# requirements/

Gamegoo 프론트엔드 요구사항 워크플로우 디렉토리. 룰은 `.claude/rules/requirements-management.md`에 정의되어 있고, 5단계 파이프라인(`.claude/skills/ai-{plan,orchestrate,validate,deliver,retrospect,pipeline}`)이 이 디렉토리의 파일들을 입력·산출물로 사용한다.

## 디렉토리 구조

```
requirements/
├── TEMPLATE.md                  # REQ 작성 템플릿
├── CHECKLIST_TEMPLATE.md        # 체크리스트 템플릿 (ai-validate 산출)
├── RETROSPECT_TEMPLATE.md       # 회고 보고서 템플릿 (ai-retrospect 산출)
├── PERF_REPORT_TEMPLATE.md      # 성능 측정 리포트 템플릿 (선택)
├── README.md                    # 이 파일
├── specs/
│   ├── to-do/                   # 작업 대기 — 새 REQ를 여기 작성
│   ├── in-progress/             # 현재 구현 중 — ai-plan이 to-do에서 이동 제안
│   └── done/                    # 구현 완료 — ai-deliver 후 이동
└── reports/
    ├── checklists/              # 검증 체크리스트 (이동 없음, REQ별 1파일)
    ├── retrospects/             # 회고 보고서 (이동 없음, 회차 누적)
    └── perf/                    # 성능 측정 리포트 (선택)
```

## 워크플로우

### 1. REQ 작성

`TEMPLATE.md`를 복사하여 `specs/to-do/REQ-{번호}.md`로 작성한다.

```bash
cp requirements/TEMPLATE.md requirements/specs/to-do/REQ-001.md
```

번호 규칙:

- GitHub Issue 번호와 일치시키면 추적이 쉬움 → `REQ-157.md` (issue #157과 매핑)
- Issue가 없는 사내 작업은 자체 일련번호 → `REQ-001`, `REQ-002`, ...

frontmatter의 `mode` 필드는 필수 — `feature`(새 기능) / `refactor`(구조 이전).

### 2. ai-plan 호출

REQ 작성 후 다음 중 하나로 분석·계획 단계 시작:

- 단계별: `/ai-plan REQ-001.md`
- 파이프라인: `/ai-pipeline REQ-001.md`
- 자연어로 "REQ-001 plan 짜줘" — description 매칭으로 ai-plan 자동 invoke

### 3. 5단계 산출물 위치

| Phase            | 입력                                           | 산출물                                          |
| ---------------- | ---------------------------------------------- | ----------------------------------------------- |
| `ai-plan`        | `specs/to-do/` 또는 `specs/in-progress/`의 REQ | (선택) `to-do → in-progress` 이동               |
| `ai-orchestrate` | plan의 todo 체크리스트                         | `src/` 코드 변경                                |
| `ai-validate`    | 변경된 코드 + REQ                              | `reports/checklists/REQ-{번호}.md`              |
| `ai-deliver`     | 모든 변경                                      | 커밋 메시지 제안 (직접 커밋 ✗)                  |
| `ai-retrospect`  | 변경된 코드 + REQ                              | `reports/retrospects/REQ-{번호}.md` (회차 누적) |

### 4. 즉석 작업(quick 모드)

REQ 문서를 만들 가치가 없는 작은 수정은 `ai-quick` 사용. 산출물 파일을 생성하지 않는다.

## frontmatter 핵심 필드

```yaml
---
id: REQ-001 # 파일명과 일치
title: 간결한 제목
priority: high | medium | low
mode: feature | refactor # 작업 모드
labels: [기능 정의, 매칭] # 도메인/유형
created: YYYY-MM-DD # 최초 작성일 (불변)
revised: YYYY-MM-DD # 변경 발생 시 갱신
---
```

`created`는 최초 1회만 기록하고 변경하지 않는다. `revised`는 본문의 Changelog 항목이 추가될 때 함께 갱신.

## Changelog 작성 시점

`in-progress` 또는 `done` 상태에서 본문이 바뀌면 파일 하단 `## Changelog` 섹션에 기록한다. `to-do` 상태의 수정은 Changelog 불요. 자세한 형식은 `.claude/rules/requirements-management.md`.

## 라벨 가이드 (Gamegoo 도메인)

| 라벨        | 사용                                 |
| ----------- | ------------------------------------ |
| `기능 정의` | 새 기능 명세                         |
| `UI 정의`   | 화면/컴포넌트 시안 구현              |
| `API 연동`  | OpenAPI 신규/변경 endpoint 통합      |
| `리팩토링`  | mode: refactor 동반 (FSD 이전, 정리) |
| `성능`      | 렌더·번들·네트워크 최적화            |
| `인증`      | 토큰/세션/소셜 로그인                |
| `채팅`      | socket 메시지/방                     |
| `매칭`      | 듀오 매칭 흐름                       |
| `게시판`    | 게시글/필터/페이지네이션             |
| `매너`      | 매너평가/리뷰                        |
| `알림`      | 푸시·인앱 알림                       |
| `lol-bti`   | 롤BTI 진단                           |

라벨은 자유롭게 추가 가능. 위 표는 시작점.

## 금지 사항

- ❌ 본문에 `~~취소선~~`으로 삭제 표시
- ❌ HTML 주석으로 "삭제됨" 표시
- ❌ Changelog 항목에 사유 누락
- ❌ `created` 필드 사후 수정
- ❌ 구현 세부 코드를 REQ 본문에 삽입 (코드는 체크리스트의 "구현 위치"로)
