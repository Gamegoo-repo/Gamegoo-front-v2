---
name: ai-retrospect
description: "Phase 5: 구현 품질을 리뷰하고 기술 부채를 식별하며 개선점을 제안한다"
---

# Phase 5: Retrospect

## 변경 범위

### 최근 변경 통계
!`git diff --stat`

### 현재 파일 구조
!`find src -type f \( -name '*.ts' -o -name '*.tsx' \) -not -path '*/@generated/*' | sort`

### 파일 수
!`find src \( -name '*.ts' -o -name '*.tsx' \) -not -path '*/@generated/*' | wc -l`

## 지시사항

변경된 파일을 모두 읽고 아래 관점에서 리뷰하라.

### 1. FSD 준수 검사

- 각 파일이 올바른 레이어/세그먼트에 위치하는가
- `model/`, `api/`, `ui/`, `lib/` 세그먼트가 적절히 사용되었는가
- barrel export가 빠짐없이 구성되었는가
- (refactor) plan의 Migration Map이 모두 반영되었는가

### 2. 코드 품질 검사

- 네이밍 컨벤션 (PascalCase 컴포넌트, camelCase 함수/변수, kebab-case 슬라이스 폴더)
- TypeScript 타입 명시성 (`any` 사용 여부)
- 에러 핸들링 (특히 `api/` 세그먼트, 토큰 refresh 경로)
- 불필요한 코드 중복

### 3. 아키텍처 검사

- 순환 의존성 여부
- 과도한 re-export 체인
- 레이어 경계가 모호한 코드
- generated 모듈 직접 참조 여부 (`@/shared/api/@generated/...`)

### 4. 성능 고려

- 불필요한 re-render 유발 패턴 (Zustand 전체 store 구독)
- 대용량 barrel export로 인한 tree-shaking 문제
- TanStack Query 캐시 키 누수 (queryKey 누락)

### 4-1. (리팩토링 모드 전용) 체크리스트 재평가

`.claude/rules/refactor-checklist.md`의 6개 항목을 다시 평가한다 (plan 단계의 사전 평가와 비교):

```
## Refactor Checklist Post-Evaluation

| # | 항목 | plan 시점 | 현재 | 변동 |
|---|------|-----------|------|------|
| 1 | FSD 준수 | pass / 사항 | pass / 사항 | ↑/=/↓ |
| 2 | 가독성 / 클린 코드 | pass / 사항 | pass / 사항 | ↑/=/↓ |
| 3 | 명확한 함수 | pass / 사항 | pass / 사항 | ↑/=/↓ |
| 4 | 모듈화 | pass / 사항 | pass / 사항 | ↑/=/↓ |
| 5 | 성능 (계측 기반) | pass / 사항 / N/A | pass / 사항 / N/A | ↑/=/↓ |
| 0 | 동작 동일성 (스모크 / 테스트) | — | pass / fail | — |
```

악화된 항목(`↓`)이 하나라도 있으면 retrospect의 Action Items에 추가한다.

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

### 5. 자기 점검 (저장 전)

보고서를 작성한 뒤, 저장하기 전에 아래 3문항으로 자체 검증한다. 이 단계는 **생략 금지**이며, 의문이 남으면 보고서를 수정한 뒤 저장한다.

- 각 개선사항/Action Item이 **지금 실행 가능**한가? 실행 불가능하면 Action Item이 아니라 메모(학습 기록 또는 후속 스펙 후보).
- **과장된 표현**(매직 넘버, 심각한 결함 등)이 없나? 실제 영향 범위에 맞게 톤을 맞출 것.
- **빠진 리스크**(a11y, 스크롤/overflow, 예외 플로우, 시멘틱 HTML 등)는 없나?

### 6. 회고 보고서 저장

리뷰 완료 후 `requirements/reports/retrospects/REQ-{번호}.md`에 보고서를 **반드시** 저장한다.

#### 저장 규칙

- **파일이 없는 경우**: 새 파일 생성 (frontmatter + 첫 번째 보고서)
- **파일이 이미 있는 경우**: 기존 내용 유지, 하단에 `---` 구분선 후 새 회차 추가
- 회차 제목 형식: `## Retrospective Report — {YYYY-MM-DD} #{회차번호}`
- `retrospected` frontmatter는 최초 생성일 유지

#### 보고서 파일 형식

```markdown
---
id: REQ-{번호}
title: {요구사항 제목}
mode: feature|refactor
retrospected: {YYYY-MM-DD}
---

## Retrospective Report — {YYYY-MM-DD} #1

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

---

## Retrospective Report — {YYYY-MM-DD} #2

(이후 회차는 하단에 추가)
```
