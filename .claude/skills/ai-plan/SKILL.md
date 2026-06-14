---
name: ai-plan
description: "Phase 1: 요구사항을 분석하고 Gamegoo 프로젝트의 FSD 구현 계획을 수립한다 (구현 모드 / 리팩토링 모드 분기)"
argument-hint: <요구사항 파일명 또는 자유 텍스트>
---

# Phase 1: Plan

## 현재 프로젝트 상태

### FSD 규칙
!`cat CLAUDE.md`

### 현재 파일 구조
!`find src -type f \( -name '*.ts' -o -name '*.tsx' \) -not -path '*/@generated/*' | sort`

### 현재 의존성
!`cat package.json`

## 요구사항 소스

### in-progress 디렉토리 (현재 작업 대상)
!`ls requirements/specs/in-progress/ 2>/dev/null | grep -v .gitkeep || echo "(비어 있음)"`

### to-do 디렉토리 (대기 중)
!`ls requirements/specs/to-do/ 2>/dev/null | grep -v .gitkeep || echo "(비어 있음)"`

## 요구사항 입력

`$ARGUMENTS`가 주어지면 아래 순서로 요구사항을 결정한다:

1. **파일명이 주어진 경우** (예: `001-chat-room.md`)
   → `requirements/specs/in-progress/` 또는 `specs/to-do/`에서 해당 파일을 읽는다.
2. **"all" 또는 인자 없음**
   → `specs/in-progress/` 디렉토리의 모든 .md 파일을 읽어 분석한다.
3. **자유 텍스트가 주어진 경우**
   → 해당 텍스트를 요구사항으로 직접 사용한다.

**인자**: $ARGUMENTS

## 모드 결정 — 구현 vs 리팩토링

본 레포의 일부 코드는 정통 FSD에서 벗어나 있다. 작업을 시작하기 전에 모드를 결정한다.

### 구현 모드 (`mode: feature`)

**적용 조건**: 새 기능 / 새 컴포넌트 / 새 도메인 추가가 주된 목표.

**원칙**:
- 신규 코드는 정통 FSD 규칙(`.claude/rules/fsd-*.md`)을 그대로 따른다.
- 기존 비표준 위치에 새 코드를 추가하지 않는다 (예: `entities/*/config/`, `entities/chat/store/`, `shared/hooks/`, `shared/providers/`, `shared/model/`).
- 새 컴포넌트 파일은 PascalCase + named export로 작성한다 (default export 컴포넌트를 새로 만들지 않는다).
- 새 코드가 닿은 인접 비표준 코드는 **PR 범위에서만** 가벼운 정리를 허용 (단, 본질적인 리팩토링은 별도 REQ로 분리).

### 리팩토링 모드 (`mode: refactor`)

**적용 조건**: 기존 코드를 정통 FSD 위치로 이전이 주된 목표 (도메인 변경 없음).

**원칙**:
- 이전 매핑(현 위치 → 목표 위치)을 plan에서 명시적으로 표 형태로 작성한다.
- 의존 순서대로 진행: shared → entities → features → widgets → pages.
- import 갱신은 같은 PR 안에서 모두 마친다 (lint/build green 유지).
- 동작 변경 금지 — 이전 후 실 동작이 동일해야 한다 (테스트/스모크로 검증).

**필수 체크리스트** — `.claude/rules/refactor-checklist.md` 항목을 plan 단계에서 사전 평가한다:

1. **사전 결정 기준 5문항** (반복 비용 / 확장 막힘 / 검증 가능 / 범위 제한 / 리스크 격리). 3개 이상 Yes일 때만 진행. 자동 보류 신호(동작 변경 동시 진행, import 영향 100+, 자동 생성 산출물 직접 편집, 시작 시점에 빌드 fail)가 하나라도 있으면 보류.
2. **FSD 준수** — 레이어 의존 방향, cross-slice, segment 표준, barrel, generated 격리, path alias.
3. **클린 코드 / 가독성** — 네이밍, 표현, 주석 정책.
4. **명확한 함수** — 단일 책임, 길이, 인자 수, 반환 타입, side effect 격리, 예외 흐름.
5. **모듈화** — 슬라이스 경계, 도메인 응집, 중복 승격, segment 표준, public API 제어, 컴포넌트-로직 분리.
6. **성능 최적화** — Zustand selector, TanStack Query queryKey/invalidate, React 메모는 측정 후, 번들/네트워크. **계측 없는 추측 최적화 금지**.

각 항목에 대해 plan에 합격/미달을 명시하고, 미달 항목은 같은 PR 범위에 포함할지 별도 REQ로 분리할지 결정한다.

### 빈번한 이전 매핑 참고 (refactor 모드에서 사용)

| 현재 위치 (수정 대상) | 정통 위치 (목표) |
|---------------------|----------------|
| `entities/{slice}/config/types.ts` | `entities/{slice}/model/types.ts` |
| `entities/{slice}/config/query-keys.ts` | `entities/{slice}/api/queryKeys.ts` |
| `entities/{slice}/config/{*-mock-data,stepper-colors,*}.ts` | `entities/{slice}/model/constants.ts` 또는 `entities/{slice}/lib/` |
| `entities/chat/store/` | `entities/chat/model/chatStore.ts` |
| `shared/hooks/` | `shared/lib/hooks/` |
| `shared/providers/` | `app/providers/` |
| `shared/model/use-auth.ts` | `entities/auth/model/useAuth.ts` |
| `shared/model/responsive-context.tsx` | `shared/lib/responsive-context.tsx` |
| `shared/lib/constants/` | `shared/config/` |
| `shared/assets/` | `shared/ui/icons/` (또는 `shared/lib/assets/`) |
| `src/test/` | 격리된 dev-only 디렉토리 (또는 제거) |
| 컴포넌트 default export, kebab-case 파일명 | named export, PascalCase 파일명 |

각 매핑은 plan에서 케이스별로 검토 — 무조건 일괄 적용하지 않는다.

## 지시사항

요구사항을 분석하여 아래 형식의 구현 계획을 수립하라.

### 0. 모드 선언 (필수, 가장 먼저)

```
## Mode

- **mode**: feature | refactor
- 근거: {왜 이 모드인지 한 줄}
```

### 1. 요구사항 분해

- 요구사항을 이산적인 작업 단위로 분해
- 각 작업이 어떤 FSD 레이어에 해당하는지 태그 부여: `[shared]`, `[entities]`, `[features]`, `[widgets]`, `[pages]`

### 1-1. 관리 포인트 식별 (구현 모드 한정)

요구사항에 등장한 값 중 **상수로 추출할 값**을 명시적으로 식별한다. 판단 기준은 `.claude/rules/constants-convention.md` 참조.

출력 형식:

```
## 관리 포인트 (Constants)

- `{CONSTANT_NAME}` = `{값}` — 근거: {키워드 매칭 / 비즈니스 의미 / 재사용 / 오버라이드}

## 인라인 처리 (Non-constants)

- {수치/값 설명} — 근거: 레이아웃 스펙 / 단일 컴포넌트 내부 / 구현 디테일
```

**필수 체크**: 요구사항 본문에서 아래 키워드를 검색하고, 매칭된 값은 반드시 관리 포인트 목록에 포함한다:
- `"설정값으로 관리"`
- `"관리 포인트"` / `"관리포인트"`
- `"상수로 관리"` / `"상수로 정의"`

### 2. 영향 분석

- 수정 대상 기존 파일 목록 (전체 경로)
- 신규 생성 파일 목록 (전체 경로)
- 필요한 npm 의존성 식별

### 2-1. (리팩토링 모드 전용) 이전 매핑 표

현 위치 → 목표 위치를 표로 작성한다. 위 "빈번한 이전 매핑 참고"를 우선 적용하고, 케이스별로 추가:

```
## Migration Map

| 현재 경로 | 목표 경로 | 변경 종류 |
|-----------|-----------|-----------|
| src/entities/user/config/types.ts | src/entities/user/model/types.ts | move + segment 변경 |
| src/features/auth/ui/login-button.tsx | src/features/auth/ui/LoginButton.tsx | rename + default→named export |
```

각 행에 영향 받는 import 사이트를 함께 식별한다.

### 3. 의존 관계 검증

- 계획된 import 방향이 FSD 규칙을 준수하는지 확인
- 위반이 있으면 대안 제시
- cross-slice import 발견 시 entities/shared로 내려서 공유하도록 재배치

### 4. 구현 계획 (체크리스트)

아래 형식으로 출력 (의존 순서: shared → entities → features → widgets → pages):

```
## Implementation Plan

- [ ] [shared] 작업 설명 — 복잡도: small/medium/large
- [ ] [entities] 작업 설명 — 복잡도: small/medium/large
- [ ] [features] 작업 설명 — 복잡도: small/medium/large
- [ ] [widgets] 작업 설명 — 복잡도: small/medium/large
- [ ] [pages] 작업 설명 — 복잡도: small/medium/large
```

### 5. 리스크 및 고려사항

- 기술적 리스크 (특히 socket / 인증 토큰 / OpenAPI 재생성 영향)
- 기존 코드 영향 범위
- 성능 고려사항
- 리팩토링 모드: 동작 동일성 검증 방법 (manual smoke / 기존 테스트 / 라우트 진입 확인)

### 5-1. (리팩토링 모드 전용) 체크리스트 사전 평가

`.claude/rules/refactor-checklist.md`의 0~6번 항목을 표로 평가한다:

```
## Refactor Checklist Pre-Evaluation

| # | 항목 | 평가 | 비고 |
|---|------|------|------|
| 0 | 사전 결정 기준 (5문항 중 Yes 개수) | x/5 | 3개 미만이면 plan 종결 |
| 0 | 자동 보류 신호 | none / 해당 항목 | 하나라도 있으면 종결 |
| 1 | FSD 준수 | pass / 사항 | |
| 2 | 가독성 / 클린 코드 | pass / 사항 | |
| 3 | 명확한 함수 | pass / 사항 | |
| 4 | 모듈화 | pass / 사항 | |
| 5 | 성능 (계측 기반) | pass / 사항 / N/A | 측정 없이 추측 최적화 금지 |
```

미달 항목은 (a) 같은 PR에서 처리, (b) 별도 REQ로 분리, (c) 메모만 남김 중 하나로 분류한다.

### 6. 완료 후 액션

- 분석한 요구사항 파일이 `specs/to-do/`에 있었다면 `specs/in-progress/`로 이동을 제안한다.
- frontmatter의 `mode` 필드를 결정된 값으로 갱신 제안.

**⏸️ 계획을 사용자에게 보여주고 진행 여부를 확인받아라. 사용자가 승인하면 Phase 2(`ai-orchestrate`)로 진행.**
