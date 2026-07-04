---
name: ai-pipeline
description: '전체 AI 개발 파이프라인: plan → orchestrate → validate → deliver → retrospect 5단계 순차 실행'
argument-hint: <요구사항 파일명 또는 자유 텍스트>
---

# AI Development Pipeline

전체 5단계를 순차 실행한다. 각 Phase는 단독 skill(`ai-plan`, `ai-orchestrate`, `ai-validate`, `ai-deliver`, `ai-retrospect`)을 모두 흡수하므로, 파이프라인 단독 실행으로도 산출물·자기 점검 절차가 동일해야 한다.

## 프로젝트 컨텍스트

### FSD 규칙

!`cat CLAUDE.md`

### 현재 파일 구조

!`find src -type f \( -name '*.ts' -o -name '*.tsx' \) -not -path '*/@generated/*' | sort`

### package.json

!`cat package.json`

### tsconfig.json

!`cat tsconfig.json`

### rsbuild.config.ts

!`cat rsbuild.config.ts`

---

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

---

## Phase 1: Plan

요구사항을 분석하여 구현 계획을 수립한다.

### 0. 모드 결정 (필수, 가장 먼저)

본 레포의 일부 코드는 정통 FSD에서 벗어나 있다. 작업을 두 모드로 분리:

- **`mode: feature`** — 새 기능 구현. 신규 코드는 정통 FSD 규칙(`.claude/rules/fsd-*.md`)을 그대로 따르며, 기존 비표준 위치(`entities/*/config/`, `entities/chat/store/`, `shared/hooks/`, `shared/providers/`, `shared/model/`)에 새 코드를 추가하지 않는다. 새 컴포넌트는 PascalCase + named export.
- **`mode: refactor`** — 기존 코드를 정통 FSD 위치로 이전. plan에서 이전 매핑(현 위치 → 목표 위치)을 표 형태로 명시. 도메인 동작 변경 금지.

#### 빈번한 이전 매핑 참고 (refactor 모드에서 사용)

| 현재 위치 (수정 대상)                                  | 정통 위치 (목표)                                  |
| ------------------------------------------------------ | ------------------------------------------------- |
| `entities/{slice}/config/types.ts`                     | `entities/{slice}/model/types.ts`                 |
| `entities/{slice}/config/query-keys.ts`                | `entities/{slice}/api/queryKeys.ts`               |
| `entities/{slice}/config/{*-mock,stepper-colors,*}.ts` | `entities/{slice}/model/constants.ts` 또는 `lib/` |
| `entities/chat/store/`                                 | `entities/chat/model/chatStore.ts`                |
| `shared/hooks/`                                        | `shared/lib/hooks/`                               |
| `shared/providers/`                                    | `app/providers/`                                  |
| `shared/model/use-auth.ts`                             | `entities/auth/model/useAuth.ts`                  |
| `shared/lib/constants/`                                | `shared/config/`                                  |
| 컴포넌트 default export, kebab-case 파일명             | named export, PascalCase 파일명                   |

출력:

```
## Mode

- **mode**: feature | refactor
- 근거: {왜 이 모드인지 한 줄}
```

#### (refactor 한정) 사전 결정 5문항

`.claude/rules/refactor-checklist.md` 0번 섹션을 적용. 3개 이상 Yes일 때만 진행. 자동 보류 신호(동작 변경 동시 진행, import 영향 100+, 자동 생성 산출물 직접 편집, 시작 시점 빌드 fail)가 하나라도 있으면 plan 종결.

### 1. 요구사항 분해

- 요구사항을 이산적 작업 단위로 분해
- 각 작업에 FSD 레이어 태그: `[shared]`, `[entities]`, `[features]`, `[widgets]`, `[pages]`

### 1-1. 관리 포인트 식별 (구현 모드 한정)

요구사항의 값 중 **상수로 추출할 값**을 명시. 판단 기준은 `.claude/rules/constants-convention.md`.

```
## 관리 포인트 (Constants)

- `{CONSTANT_NAME}` = `{값}` — 근거: {키워드 매칭 / 비즈니스 의미 / 재사용 / 오버라이드}

## 인라인 처리 (Non-constants)

- {수치/값 설명} — 근거: 레이아웃 스펙 / 단일 컴포넌트 내부 / 구현 디테일
```

**필수 체크 키워드**: `"설정값으로 관리"`, `"관리 포인트"`, `"상수로 관리"`, `"상수로 정의"`. 매칭된 값은 반드시 관리 포인트에 포함.

### 2. 영향 분석

- 수정 대상 기존 파일 목록
- 신규 생성 파일 목록 (전체 경로)
- 필요한 npm 의존성 식별

### 2-1. (리팩토링 모드 전용) 이전 매핑 표

```
## Migration Map

| 현재 경로 | 목표 경로 | 변경 종류 |
|-----------|-----------|-----------|
```

각 행에 영향 받는 import 사이트를 함께 식별.

### 3. 의존 관계 검증

- 계획된 import 방향이 FSD 규칙을 준수하는지
- 위반 발견 시 entities/shared로 내려서 공유

### 4. 구현 계획 (체크리스트)

```
## Implementation Plan

- [ ] [shared] 작업 설명 — 복잡도: small/medium/large
- [ ] [entities] 작업 설명 — 복잡도: small/medium/large
- [ ] [features] 작업 설명 — 복잡도: small/medium/large
- [ ] [widgets] 작업 설명 — 복잡도: small/medium/large
- [ ] [pages] 작업 설명 — 복잡도: small/medium/large
```

순서는 반드시 shared → entities → features → widgets → pages.

### 5. 리스크 및 고려사항

- 기술적 리스크 (socket / 토큰 인터셉터 / OpenAPI 재생성 영향)
- 기존 코드 영향 범위
- 성능 고려사항 — **계측 없는 추측 최적화 금지**
- 리팩토링 모드: 동작 동일성 검증 방법

### 5-1. (리팩토링 모드 전용) 체크리스트 사전 평가

`.claude/rules/refactor-checklist.md`의 1~5번 항목 (FSD / 가독성 / 명확한 함수 / 모듈화 / 성능)을 표로 평가:

```
## Refactor Checklist Pre-Evaluation

| # | 항목 | 평가 | 비고 |
|---|------|------|------|
| 1 | FSD 준수 | pass / 사항 | |
| 2 | 가독성 / 클린 코드 | pass / 사항 | |
| 3 | 명확한 함수 | pass / 사항 | |
| 4 | 모듈화 | pass / 사항 | |
| 5 | 성능 (계측 기반) | pass / 사항 / N/A | |
```

미달 항목은 (a) 같은 PR에서 처리, (b) 별도 REQ로 분리, (c) 메모만 남김 중 하나로 분류한다.

### 6. 완료 후 액션

- 분석한 요구사항 파일이 `specs/to-do/`에 있었다면 `specs/in-progress/`로 이동을 제안.
- frontmatter `mode` 필드 갱신 제안.

**⏸️ 계획을 사용자에게 보여주고 진행 여부를 확인받아라. 사용자가 승인하면 Phase 2로 진행.**

---

## Phase 2: Orchestrate

Phase 1 계획을 실행하여 코드를 작성/이전한다.

### 공통 실행 규칙

1. **의존 순서 준수**: shared → entities → features → widgets → pages
2. **세그먼트 생성**: `model/`, `api/`, `ui/`, `lib/`
3. **barrel export 업데이트**: slice 생성/변경 후 `index.ts`에 re-export
4. **path alias 사용**: `@/<layer>/...`
5. **상향 import 금지** (PreToolUse hook이 차단)
6. **cross-slice 금지**
7. **타입 명시**: `any` 금지

### 구현 모드(`mode: feature`)에서

- 신규 파일은 정통 FSD 위치에만 생성
- 기존 비표준 위치에 새 코드 추가 금지
- 컴포넌트 PascalCase + named export
- 인접 비표준 코드는 plan 범위 내 가벼운 정리만

### 리팩토링 모드(`mode: refactor`)에서

- Migration Map을 그대로 따라 이동·rename·segment 변경
- import 갱신은 한 PR 안에 끝낸다
- 도메인 동작 변경 금지
- 매핑 단위로 빌드/타입체크 green 유지
- 작업 진행 중 `.claude/rules/refactor-checklist.md`의 6개 점검 항목을 항상 확인. 위반 발견 시 같은 매핑 단위 안에서 즉시 수정하거나, 범위를 넘으면 retrospect의 Action Items로 기록

### 작업 완료 보고

```
✅ [layer] 작업 설명
   - 생성/수정 파일: path/to/file.ts
   - export 추가: ModuleName
   - (refactor) Old: src/.../old.ts → New: src/.../New.ts (import 사이트 N곳 갱신)
```

---

## Phase 3: Validate

5단계 검증 순차 실행.

### Step 1: TypeScript 타입 체크

```bash
npx tsc --noEmit
```

### Step 2: Biome 린트 + 포맷 검사

```bash
pnpm ci
```

### Step 3: 빌드

```bash
pnpm build
```

### Step 4: FSD Import 규칙 검증

```bash
# shared → 상위 레이어 import 금지
grep -rn "from '@/entities\|from '@/features\|from '@/widgets\|from '@/pages" src/shared/ 2>/dev/null || true

# entities → features, widgets, pages import 금지
grep -rn "from '@/features\|from '@/widgets\|from '@/pages" src/entities/ 2>/dev/null || true

# features → widgets, pages import 금지
grep -rn "from '@/widgets\|from '@/pages" src/features/ 2>/dev/null || true

# widgets → pages import 금지
grep -rn "from '@/pages" src/widgets/ 2>/dev/null || true

# cross-slice 검사
grep -rn "from '@/entities/" src/entities/ 2>/dev/null || true
grep -rn "from '@/features/" src/features/ 2>/dev/null || true
grep -rn "from '@/widgets/" src/widgets/ 2>/dev/null || true
grep -rn "from '@/pages/" src/pages/ 2>/dev/null || true

# generated 모듈 직접 참조
grep -rn "from '@/shared/api/@generated" src/ 2>/dev/null | grep -v "src/shared/api/" || true
```

### 결과 보고 형식

```
## Validation Report

| Check | Status | Details |
|-------|--------|---------|
| TypeScript | ✅/❌ | 에러 수 또는 "Clean" |
| Biome (lint+format) | ✅/❌ | 경고/에러 수 또는 "Clean" |
| Build | ✅/❌ | 빌드 시간 또는 에러 |
| FSD Rules | ✅/❌ | 위반 수 또는 "No violations" |
```

**실패 시**: 에러 수정 후 재검증 (최대 3회). 3회 초과 시 중단.

모든 검증 통과: `✅ All validations passed`

### Step 5: 요구사항 체크리스트 생성

모든 검증 통과 시 `requirements/reports/checklists/REQ-{번호}.md` 생성. (생략 금지)

```markdown
---
id: REQ-{번호}
title: { 요구사항 제목 }
mode: feature|refactor
validated: { YYYY-MM-DD }
---

## Checklist

| #   | 요구사항      | 구현 위치           | 상태  |
| --- | ------------- | ------------------- | ----- |
| 1   | 요구사항 설명 | 파일 또는 코드 위치 | ✅/❌ |
```

리팩토링 모드: 항목에 "이전 매핑 적용" + "동작 동일성"을 포함.

---

## Phase 4: Deliver

배포 준비.

### 1. Export 검증

- 새 slice의 `index.ts` re-export
- generated 모듈 직접 참조 없음

### 2. 문서 업데이트

- `CLAUDE.md`의 아키텍처 설명이 현재 구조와 일치하는지 확인

### 3. Changelog 생성

```
## Changes

### Added
- 추가된 항목

### Modified
- 수정된 항목

### (refactor) Migrated
- {old path} → {new path}

### Dependencies
- 추가/변경된 의존성
```

### 4. Git 스테이징

- 관련 파일만 선별적으로 `git add`
- `.env`, 자격 증명 파일 등 민감 파일 제외
- generated 파일은 변경 시 함께 커밋

### 5. 커밋 메시지 제안

Conventional Commits:

```
feat: [간결한 설명]    # 새 기능
refactor: [간결한 설명]  # 동작 변경 없는 구조 이전
fix: [간결한 설명]
chore: [간결한 설명]
```

**주의**: 커밋을 직접 수행하지 않는다. 사용자에게 제안만 한다.

---

## Phase 5: Retrospect

### 1. FSD 준수 검사

- 각 파일이 올바른 레이어/세그먼트에 위치하는가
- barrel export 누락 여부
- (refactor) Migration Map 모두 반영되었는가

### 2. 코드 품질 검사

- 네이밍 컨벤션 (PascalCase 컴포넌트, camelCase 함수, kebab-case slice)
- TypeScript 타입 명시성
- 에러 핸들링 (`api/`, 토큰 refresh 경로)
- 코드 중복

### 3. 아키텍처 검사

- 순환 의존성
- 과도한 re-export
- generated 모듈 직접 참조

### 4. 성능 고려

- Zustand 전체 store 구독 패턴
- barrel export tree-shaking
- TanStack Query queryKey 누수

### 결과 보고 형식

```
## Retrospective Report

### ✅ What Went Well
- 항목

### ⚠️ What Needs Improvement
- 항목 — 파일 경로 — 개선 방안

### 📋 Action Items
- [ ] 구체적 개선 작업 — 우선순위 (high/medium/low)

### 📊 Quality Score
| 항목 | 점수 (1-5) |
|------|-----------|
| FSD 준수 | X/5 |
| 타입 안전성 | X/5 |
| 코드 완성도 | X/5 |
| 에러 핸들링 | X/5 |
| 가독성 / 클린 코드 | X/5 |
| 모듈화 | X/5 |
| 성능 (계측 기반) | X/5 또는 N/A |
```

(refactor 모드) `.claude/rules/refactor-checklist.md` 6개 항목을 plan 시점과 비교해 사후 재평가하고, 악화된 항목(`↓`)은 Action Items에 추가한다.

### 5. 자기 점검 (저장 전)

- 각 Action Item이 **지금 실행 가능**한가?
- **과장된 표현**이 없나?
- **빠진 리스크**(a11y, scroll/overflow, 예외 플로우)는 없나?

### 6. 회고 보고서 저장

`requirements/reports/retrospects/REQ-{번호}.md`에 저장. (생략 금지)

#### 저장 규칙

- 새 파일이면 frontmatter + 첫 회차
- 기존 파일이면 `---` 구분선 후 새 회차 추가
- 회차 제목: `## Retrospective Report — {YYYY-MM-DD} #{N}`

---

## Pipeline Summary

모든 Phase 완료 후 최종 요약:

```
## Pipeline Summary

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Plan | ✅/❌ | mode: feature\|refactor |
| 2. Orchestrate | ✅/❌ | |
| 3. Validate | ✅/❌ | 체크리스트 산출물: reports/checklists/REQ-{번호}.md |
| 4. Deliver | ✅/❌ | |
| 5. Retrospect | ✅/❌ | 회고 산출물: reports/retrospects/REQ-{번호}.md |
```

산출물 누락 검사: 파이프라인 종료 전 아래 두 파일이 실제로 존재하는지 확인하고, 누락 시 해당 Phase로 돌아가 생성한다.

- `requirements/reports/checklists/REQ-{번호}.md`
- `requirements/reports/retrospects/REQ-{번호}.md`
