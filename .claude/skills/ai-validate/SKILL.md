---
name: ai-validate
description: 'Phase 3: 타입 체크, 린트, 빌드, FSD 레이어 검증을 실행한다'
---

# Phase 3: Validate

## 지시사항

아래 5단계 검증을 순차 실행하고 결과를 종합 보고하라.

### Step 1: TypeScript 타입 체크

```bash
npx tsc --noEmit
```

### Step 2: Biome 린트 + 포맷 검사

```bash
pnpm ci
```

(`pnpm ci`는 `biome ci .` 별칭 — lint + format 동시 검증)

### Step 3: 빌드

```bash
pnpm build
```

### Step 4: FSD Import 규칙 검증

레이어 위반을 검사:

```bash
# shared → 상위 레이어 import 금지
grep -rn "from '@/entities\|from '@/features\|from '@/widgets\|from '@/pages" src/shared/ 2>/dev/null || true

# entities → features, widgets, pages import 금지
grep -rn "from '@/features\|from '@/widgets\|from '@/pages" src/entities/ 2>/dev/null || true

# features → widgets, pages import 금지
grep -rn "from '@/widgets\|from '@/pages" src/features/ 2>/dev/null || true

# widgets → pages import 금지
grep -rn "from '@/pages" src/widgets/ 2>/dev/null || true

# cross-slice 검사: 같은 레이어 내 다른 slice import
grep -rn "from '@/entities/" src/entities/ 2>/dev/null || true
grep -rn "from '@/features/" src/features/ 2>/dev/null || true
grep -rn "from '@/widgets/" src/widgets/ 2>/dev/null || true
grep -rn "from '@/pages/" src/pages/ 2>/dev/null || true

# generated 모듈 직접 참조 검사
grep -rn "from '@/shared/api/@generated" src/ 2>/dev/null | grep -v "src/shared/api/" || true
```

`@/<layer>/<slice>/internal-path` 형태가 같은 layer 내부에서 등장하면 cross-slice 의심 — 같은 슬라이스 내부면 상대 경로(`./` `../`)를 써야 한다.

### 결과 보고 형식

```
## Validation Report

| Check | Status | Details |
|-------|--------|---------|
| TypeScript | ✅/❌ | 에러 수 또는 "Clean" |
| Biome (lint+format) | ✅/❌ | 경고/에러 수 또는 "Clean" |
| Build | ✅/❌ | 빌드 시간 또는 에러 |
| FSD Rules | ✅/❌ | 위반 수 또는 "No violations" |

### Errors (있는 경우)
- **카테고리**: 파일 경로 — 에러 설명
- **Suggested Fix**: 수정 제안
```

**실패 시**: 에러를 수정하고 재검증 (최대 3회 시도). 3회 초과 시 현재 상태를 보고하고 중단.

모든 검증 통과 시: `✅ All validations passed (tsc, biome, build, FSD rules)`

### Step 5: 요구사항 체크리스트 생성

모든 검증(Step 1~4)이 통과한 경우, 현재 구현 대상 REQ의 체크리스트를 **반드시** 생성한다.

1. `requirements/specs/in-progress/` 또는 `requirements/specs/done/`에서 해당 REQ 파일을 읽는다.
2. 요구사항 항목을 하나씩 구현 코드와 대조하여 충족 여부를 확인한다.
3. `requirements/reports/checklists/REQ-{번호}.md`에 결과를 저장한다.

#### 체크리스트 파일 형식

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

- `구현 위치`: 컴포넌트명, 함수명, Tailwind 클래스 등 구현을 특정할 수 있는 정보
- 미충족 항목이 있으면 상태를 ❌로 표기하고 결과 보고에 포함
- 리팩토링 모드: 체크리스트는 "이전 매핑이 모두 적용됐는가" + "동작 동일성"을 항목으로 포함
