# 리팩토링 체크리스트 (`mode: refactor`)

리팩토링 모드에서 따라야 할 6가지 점검 항목. plan 단계에서 합격 여부를 평가하고, orchestrate 중에 위반이 발견되면 즉시 수정한다. retrospect 단계에서 다시 채점한다.

리팩토링은 **동작 변경 없이** 구조·가독성·성능을 개선하는 작업이다. 동작이 바뀌어야 하면 그건 리팩토링이 아니라 기능 변경이므로 `mode: feature`로 분리한다.

---

## 0. "해야 하나 말아야 하나?" — 사전 결정 기준

리팩토링을 시작하기 전, 아래 5문항 중 **3개 이상이 Yes**일 때만 진행한다. 충분치 않으면 메모로 남기고 다음 기회(인접 기능 작업)에 처리한다.

1. **반복 비용**: 같은 비표준 패턴이 3곳 이상에서 반복되거나, 신규 기능 작업마다 우회 비용을 발생시키는가?
2. **확장 막힘**: 다음 기능을 정통 FSD로 추가하려면 이 부분의 위치가 먼저 정리되어야 하는가?
3. **검증 가능**: 동작 동일성을 확인할 수 있는 경로가 있는가? (수동 스모크 / 라우트 진입 / 기존 테스트 / 콘솔 / 네트워크 패널)
4. **범위 제한**: 한 PR(또는 한두 단위 PR)으로 끝낼 수 있는가? import 사이트 영향이 100곳을 넘지 않는가?
5. **리스크 격리**: socket / 인증 토큰 인터셉터 / OpenAPI 자동 생성 흐름·`tokenManager`처럼 **민감 영역**이 변경 대상이 아니거나, 변경되더라도 별도 안전 가드가 있는가?

3개 미만이면 plan에서 "보류 — 사유 기록"으로 종결하고 별도 REQ 후보로 남긴다. 보이스카우트 룰(인접 정리)은 plan 범위에 명시된 경우에만 허용한다.

### 자동 보류 신호 (한 항목이라도 해당되면 진행 금지)

- ❌ 동작 변경이 동시에 들어감 → `feature`로 분리
- ❌ 영향 import 사이트 100개 초과인데 단일 PR로 묶음 → 단계 PR로 쪼개기
- ❌ `routeTree.gen.ts` 같은 자동 생성 산출물을 직접 손봐야 함 → 입력(파일 경로) 단계로 돌아가서 처리
- ❌ 빌드/타입체크가 작업 시작 시점에 이미 fail → 리팩토링 전에 main을 green으로 만들 것

---

## 1. FSD 준수 (Architecture)

| 점검 항목          | 합격 기준                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| 레이어 의존 방향   | shared(0) → entities(1) → features(2) → widgets(3) → pages(4), 상향 import 0건                                                       |
| Cross-slice import | 같은 레이어 내 다른 슬라이스 import 0건. 공통화는 entities/shared로 강하                                                             |
| Segment 표준       | `model/`, `api/`, `ui/`, `lib/` 외 segment 신설 금지. 비표준 segment(`config/`, `store/`, `hooks/`, `providers/`)는 정통 위치로 이전 |
| Barrel export      | 슬라이스 외부 노출 항목은 `index.ts`를 통해서만. private 헬퍼는 export 금지                                                          |
| Generated 격리     | `@/shared/api/@generated/...` 직접 참조 0건. `@/shared/api`의 `api` 싱글톤만 사용                                                    |
| Path alias         | 다른 레이어 참조는 `@/...`만. 상대 경로로 레이어 경계를 넘지 않는다                                                                  |

검증은 `ai-validate`의 Step 4 grep + PreToolUse 훅이 자동 수행한다.

---

## 2. 클린 코드 / 읽기 쉬운 코드 (Readability)

### 네이밍

- 의도를 드러내는 이름. `data`, `temp`, `info`, `handle`, `get` 단독 금지
- Boolean: `is*` / `has*` / `should*` / `can*` 접두사
- 이벤트 핸들러: `handle{Namespace}{Event}` (`handleModalClose`, `handlePostSubmit`)
- 파일명: 컴포넌트 PascalCase, 훅 PascalCase(`useXxx.ts`), 유틸 kebab-case, store camelCase(`xxxStore.ts`), 슬라이스 kebab-case
- 약어보다 명시 — `qr` ❌ → `query` ✅, `usr` ❌ → `user` ✅

### 표현

- 중첩 삼항 금지 — 변수로 분해
- 깊은 중첩(3단 초과) 회피 — early return / guard clause로 평탄화
- `else` 회피: `if`가 항상 return하면 `else` 생략
- 항상 중괄호 (한 줄 if도 `{ }`)
- 매직 넘버 제거 — 단 `constants-convention.md`의 "인라인 처리" 기준은 유지 (레이아웃 수치는 인라인)

### 주석 정책

- 주석은 **WHY**만. WHAT은 코드가 말한다.
- 작업 추적 코멘트(`// fix for #123`, `// added for X feature`) 금지 — git blame으로 충분
- 사라진 코드는 지운다. `// removed: ...` 코멘트 남기지 않는다
- 다단 docstring 금지. 한 줄 코멘트 우선

---

## 3. 명확한 함수 (Single Responsibility)

| 점검 항목        | 합격 기준                                                                               |
| ---------------- | --------------------------------------------------------------------------------------- |
| 단일 책임        | 함수가 두 가지 일을 동시에 하면 분리 (예: 데이터 변환 + 사이드이펙트 → 두 함수)         |
| 길이             | 50줄 초과 시 분해 검토. 100줄 초과 시 거의 항상 분해                                    |
| 인자 수          | 3개 초과 시 옵션 객체 `{ a, b, c }` 패턴                                                |
| 반환 타입        | 명시 — 추론에만 의존하지 않음 (서비스 함수, query 훅, 유틸 모두)                        |
| Side effect 격리 | useEffect / mutation / 로깅은 호출자에서 또는 명시적 hook에 격리. 순수 함수와 섞지 않음 |
| 예외 흐름        | 에러를 무시하지 않음. catch 블록이 있다면 처리 또는 명시적 re-throw                     |

### React 컴포넌트 함수

- 한 컴포넌트 = 한 책임. JSX가 200줄을 넘으면 서브컴포넌트로 분리
- 핸들러는 `handle*`로 분리, JSX 내 인라인 람다는 짧을 때만
- `useEffect`는 도메인 로직 둥지가 아니다 — 비즈니스 로직은 store/api 훅으로 옮기고 컴포넌트는 표시·연결만

---

## 4. 모듈화 (Module Boundaries)

| 점검 항목             | 합격 기준                                                                             |
| --------------------- | ------------------------------------------------------------------------------------- |
| 슬라이스 경계         | 외부 노출 표면은 `index.ts` barrel만. private 모듈은 슬라이스 내부에서만 import       |
| 도메인 응집           | 한 슬라이스가 다른 슬라이스의 내부 구현(types/lib)을 알 필요 없음                     |
| 중복 → 승격           | 두 슬라이스에서 반복되면 entities/shared로 승격. 세 번째 등장 전에 결정               |
| 레이어별 segment 표준 | `entities`/`features`/`widgets`/`pages`는 `{model,api,ui,lib}` 4 segment 외 추가 금지 |
| public API 제어       | barrel에서 의도적으로 노출하지 않은 모듈은 외부에서 import 불가 (deep import 금지)    |
| 컴포넌트-로직 분리    | 비즈니스 로직은 `model/` 또는 `lib/`. UI 컴포넌트(`ui/`)는 표시·이벤트 핸들 위임만    |

### "지금 추출할까 미룰까" 결정

- **2번 등장**: 인라인 유지 (premature abstraction 비용이 더 큼)
- **3번 등장**: 추출. 추출 위치는 사용 슬라이스를 모두 포함하는 가장 낮은 레이어
- 단발성 헬퍼는 같은 파일에 비-export로 두기. 슬라이스 외부에서 안 쓰면 `lib/`로 올리지 않음

---

## 5. 성능 최적화 (Performance)

리팩토링 중 발견되면 같은 PR에서 처리. 단, **계측 없는 추측 최적화 금지** — 측정 후 개선.

### Zustand

- ❌ `const store = useStore()` 전체 구독
- ✅ selector로 필요한 값만: `useStore((s) => s.x)`
- ✅ 여러 값은 `useShallow`로 묶어서: `useStore(useShallow((s) => ({ a: s.a, b: s.b })))`

### TanStack Query

- queryKey 누수 방지 — `api/queryKeys.ts`로 모음
- mutation 후 `invalidateQueries`의 키가 정확한지 (`exact: true` 필요한 경우)
- `staleTime` / `gcTime`은 도메인 의미가 분명할 때만 조정. 기본값으로 충분한 경우가 많음
- `enabled` 가드로 불필요한 페치 차단

### React 렌더

- `memo`/`useMemo`/`useCallback`은 **측정 후** 적용. 무분별한 사용은 GC 부담만 증가
- React 19 환경에서는 컴파일러 자동 메모이제이션 영역이 늘어나므로 수동 메모는 더더욱 신중
- 무거운 리스트는 가상화 (intersection observer + 페이지네이션이 이미 있으면 우선 그 경로 활용)
- `useState` 초기값으로 무거운 계산이 들어가면 lazy initializer (`useState(() => compute())`)

### 번들

- `lodash` 전체 import 금지 — `lodash-es`의 named import (`import { debounce } from "lodash-es"`)
- barrel re-export 체인이 길면 tree-shaking이 깨질 수 있음. 슬라이스 barrel에서 의도적으로 노출 항목만 명시
- 라우트 파일 자체는 자동 코드 스플리팅(`autoCodeSplitting: true` in `rsbuild.config.ts`)으로 분할됨 — 슬라이스 분할은 라우트 단위로 자연스럽게 일어남
- 동적 import는 사용자 인터랙션 직후 로드되는 무거운 위젯에만 적용

### 네트워크

- OpenAPI 자동 생성 클라이언트는 인증 인터셉터를 한 곳(`shared/api/config.ts`)에 둔다 — 중복 생성 금지
- socket은 싱글톤 매니저로만 — 추가 인스턴스 생성 금지(`socket-convention.md`)

---

## 합격선 (이 모든 게 점검됐다면)

`ai-validate`가 green이고 위 6개 항목이 모두 합격이면 `ai-deliver`로 진행. retrospect에서 점수표(FSD 준수 / 타입 안전성 / 코드 완성도 / 에러 핸들링)에 가독성·모듈화·성능 항목을 추가하고 1~5점으로 평가한다.

미달 항목은:

- 같은 PR에서 고칠 수 있으면 즉시 수정
- 범위를 넘으면 메모 → 별도 REQ 후보로 retrospect의 Action Items에 기록
