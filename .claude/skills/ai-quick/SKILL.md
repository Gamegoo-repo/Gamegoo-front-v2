---
name: ai-quick
description: "즉석 요청 단축 경로 — 계획 ceremony 없이 룰·훅만 적용하여 산출하고 변경 파일 한정 lite 검증을 수행한다"
argument-hint: <자유 텍스트 요청>
---

# AI Quick — 즉석 요청 모드

## 언제 사용하나

"이거 좀 고쳐줘", "X에 Y 추가해줘"처럼 **REQ 문서가 없고 변경 범위가 작은** 요청. 일상 작업의 대부분이 여기 해당.

## 언제 사용하지 말 것

아래 중 하나라도 해당하면 `ai-pipeline`(또는 `ai-plan`) 사용을 권유:

- REQ 문서가 있거나 만들어야 하는 작업
- 변경 영향 import 사이트가 5개 이상으로 예상됨
- cross-layer 영향이 있는 변경 (`shared`/`entities` 변경이 다수 슬라이스에 전파)
- socket / 인증 토큰 인터셉터 / OpenAPI 자동 생성 흐름 변경
- 새 슬라이스 신설

작업을 시작한 뒤 위 신호가 발견되면 사용자에게 spec 모드로 승격 권유 후 중단.

## 프로젝트 컨텍스트

### FSD 규칙
!`cat CLAUDE.md`

### 변경 시작 시점 git status
!`git status --porcelain`

## 인자

**요청**: $ARGUMENTS

## 실행 절차

### 1. Intent 자동 판정 (한 줄로 선언)

```
## Intent

- **mode**: feature | refactor
- **scope**: {예상 변경 슬라이스/파일 1~3개}
```

판정 근거가 모호하면 사용자에게 한 번 확인.

### 2. 변경 수행

룰은 PreToolUse 훅(`fsd-layer-check.sh`)이 강제하므로 평소처럼 Edit/Write 사용. 다음만 의식적으로 지킴:

- 신규 코드는 정통 FSD 위치에만 (`entities/{slice}/{model,api,ui,lib}/` 등). 기존 비표준 위치(`config/`, `store/`, `shared/hooks/`, `shared/providers/`, `shared/model/`)에 새 코드 추가 금지
- 컴포넌트는 PascalCase + named export
- import는 같은 slice 상대 경로, 다른 레이어 `@/<layer>/...`
- type-only는 `import type`
- 모호한 부분은 plan-style 분석 한 줄로 사용자에게 노출

### 3. Lite 검증 (변경 파일 한정)

전체 빌드/lint를 돌리지 않고 변경된 파일만 빠르게 검증:

```bash
# 변경된 .ts/.tsx 파일 추출
CHANGED=$(git diff --name-only --diff-filter=ACMR HEAD | grep -E '\.(ts|tsx)$' | grep -v '/@generated/' || true)

# tsc는 프로젝트 전체로 돌려야 정확하지만, 빠른 피드백을 위해 noEmit
npx tsc --noEmit

# biome는 변경 파일만
if [ -n "$CHANGED" ]; then
  echo "$CHANGED" | xargs npx biome check
fi

# FSD grep — 변경 파일이 위반을 도입하지 않았는지
if [ -n "$CHANGED" ]; then
  for f in $CHANGED; do
    case "$f" in
      src/shared/*) grep -nE "from ['\"]@/(entities|features|widgets|pages)" "$f" 2>/dev/null && echo "VIOLATION in $f: shared cannot import upper layers" ;;
      src/entities/*) grep -nE "from ['\"]@/(features|widgets|pages)" "$f" 2>/dev/null && echo "VIOLATION in $f: entities cannot import upper layers" ;;
      src/features/*) grep -nE "from ['\"]@/(widgets|pages)" "$f" 2>/dev/null && echo "VIOLATION in $f: features cannot import upper layers" ;;
      src/widgets/*) grep -nE "from ['\"]@/pages" "$f" 2>/dev/null && echo "VIOLATION in $f: widgets cannot import pages" ;;
    esac
  done
fi
```

### 4. 결과 보고

```
## Result

| Check | Status | Detail |
|-------|--------|--------|
| TypeScript | ✅/❌ | |
| Biome (changed files) | ✅/❌ | |
| FSD (changed files) | ✅/❌ | |

### Changed Files
- {list}

### Suggested Commit
{Conventional Commits 형식 — feat: 또는 fix: 또는 refactor: + 한 줄 요약}
```

### 5. 산출물 파일 생성 안 함

quick 모드는 `requirements/specs/`, `requirements/reports/checklists/`, `requirements/reports/retrospects/` 어디에도 파일을 만들지 않는다. 산출물 파일은 spec 모드(`ai-pipeline`)의 책임.

## 승격 신호 — 작업 중 발견 시

작업을 진행하면서 아래 신호가 발견되면 즉시 보고 후 **spec 모드 승격**을 권유:

- 변경 파일 5개 초과 또는 import 사이트 영향이 클 것으로 보임
- cross-layer 영향이 다수 슬라이스로 전파됨
- 동작 변경(`feature`)인지 구조 이전(`refactor`)인지 한 PR 안에 섞이려 함
- socket / 토큰 인터셉터 / OpenAPI 흐름이 영향 받음

승격 권유 형식:

```
⚠️ 이 변경은 quick 모드 범위를 넘습니다. 다음을 권유합니다:
- requirements/specs/in-progress/REQ-{번호}.md 작성
- ai-pipeline 또는 ai-plan으로 진행

여기서 중단할까요? 아니면 quick 모드로 계속 진행할까요?
```

## 직접 커밋 금지

검증이 통과해도 **커밋은 사용자가 수행**한다. 스킬은 `Suggested Commit` 메시지 제안까지만.
