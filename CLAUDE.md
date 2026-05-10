# Gamegoo Frontend v2

## Project Overview

pnpm + Rsbuild 단일 SPA. React 19 / TypeScript / TanStack Router. 롤(LoL) 실시간 듀오 매칭 서비스(겜구).

## Commands

```bash
# Development
pnpm dev          # Dev server on http://localhost:3000
pnpm build        # Production build
pnpm preview      # Serve production build

# Code Quality (Biome — formatter + linter)
pnpm format       # biome check --write .
pnpm format:check # biome check .
pnpm lint         # biome lint .
pnpm lint:fix     # biome lint --write .
pnpm ci           # biome ci .

# API client
pnpm openapi      # OpenAPI → src/shared/api/@generated (NEVER edit by hand)

# UI components
npx shadcn add <component>   # style: new-york, base: neutral
                             # → 추가 후 src/shared/ui/<component>/로 이동
```

## Tech Stack

- **Build**: Rsbuild (rspack) + TanStack Router 플러그인 (file-based routing)
- **UI**: React 19, shadcn/ui (Radix + Tailwind), `@gamegoo-ui/design-system`
- **State**: Zustand (client) + TanStack Query v5 (server)
- **HTTP**: axios via OpenAPI-generated `typescript-axios` client
- **Routing**: TanStack Router, 자동 생성 트리 → `src/shared/lib/@generated/routeTree.gen.ts`
- **Styling**: Tailwind CSS v4 + `tw-animate-css` + `tailwind-merge` + `clsx`
- **Real-time**: socket.io-client (싱글톤 매니저)
- **Forms/validation**: Zod, `@use-funnel/react-router`
- **Toast**: `sonner` (custom container)
- **Icons**: lucide-react + SVGR (`?react` import suffix)
- **Lint/Format**: Biome 2.2 (tabs, double quotes, LF, sortedClasses on)
- **Package manager**: pnpm 10+ (preinstall에서 `only-allow pnpm`로 강제)

## FSD 아키텍처

본 프로젝트의 목표 아키텍처는 **정통 FSD 4-layer + pages 구조**다. 레이어 의존 방향(하향만 허용):

```
pages(4) → widgets(3) → features(2) → entities(1) → shared(0)
```

규칙 상세는 `.claude/rules/`:

| 파일 | 범위 |
|------|------|
| `fsd-shared.md` | shared 레이어 segment 표준 |
| `fsd-entities.md` | entities 레이어 (`model/`/`api/`/`ui/`/`lib/`) |
| `fsd-features.md` | features 레이어 |
| `fsd-widgets.md` | widgets 레이어 |
| `fsd-pages.md` | pages 레이어 + TanStack Router 파일 라우팅 연계 |
| `import-convention.md` | path alias·정렬·cross-layer 규칙 |
| `api-convention.md` | OpenAPI 클라이언트 + TanStack Query 훅 |
| `state-convention.md` | Zustand 스토어 |
| `component-convention.md` | shadcn/ui + named export 컴포넌트 |
| `className-convention.md` | className 함정 (false 문자열 등) |
| `constants-convention.md` | 상수 추출 판단 |
| `refactor-checklist.md` | 리팩토링 모드 전용 6대 점검 항목 (FSD / 가독성 / 함수 / 모듈화 / 성능 + 사전 결정 기준) |
| `requirements-management.md` | requirements/ 디렉토리 + Changelog + mode |

`PreToolUse` 훅(`.claude/hooks/fsd-layer-check.sh`)이 Edit/Write 시 import 방향과 cross-slice 위반을 차단한다.

## 두 가지 작업 모드

본 레포의 일부 코드는 정통 FSD에서 벗어나 있다. `ai-plan` 스킬은 작업을 두 모드로 분리해 처리한다:

- **구현 모드 (feature)** — 새 기능 구현. 신규 코드는 정통 FSD 규칙을 그대로 따른다. 기존 비표준 위치(`entities/*/config/`, `entities/chat/store/`, `shared/hooks/`, `shared/providers/`, `shared/model/`, default-export 컴포넌트, kebab-case 컴포넌트 파일명 등)에 새 코드를 추가하지 않는다.
- **리팩토링 모드 (refactor)** — 기존 코드를 정통 FSD 위치로 이전. plan에서 이전 매핑(현 위치 → 목표 위치)을 명시하고, 이동·rename·import 갱신을 의존 순서(shared → entities → features → widgets → pages)대로 진행한다.

자세한 모드별 절차는 `.claude/skills/ai-plan/SKILL.md` 참조.

## Path Alias

`tsconfig.json`의 alias는 단 하나: `@/*` → `src/*`. 레이어별 alias가 별도로 없으므로 cross-layer 참조는 `@/<layer>/<slice>` 형태로 작성한다.

```ts
// ✅ Good
import { httpClient } from "@/shared/api";
import { ChatSession } from "@/entities/chat";

// ❌ Bad — 다른 레이어를 상대 경로로 거슬러 올라감 (FSD layer-check hook이 차단)
import { httpClient } from "../../../shared/api";
```

## Code Style

- **Biome**: tabs / double quotes / LF / `useSortedClasses: on`
- **컴포넌트**: PascalCase 파일명 (`LoginButton.tsx`), `interface {Component}Props`, **named export만** (default export 금지)
- **그 외 함수/유틸**: kebab-case 파일명, 화살표 함수, named export
- **Boolean**: `is*` / `has*` 접두사
- **Imports**: 같은 slice는 상대 경로, 다른 레이어는 `@/...`. type-only는 `import type`
- **Generated code**: `src/shared/api/@generated/`, `src/shared/lib/@generated/routeTree.gen.ts` — 절대 직접 수정 금지

## Important Notes

- `pnpm` 강제 (`preinstall: only-allow pnpm`)
- `postinstall`이 git hook 디렉토리를 `.githooks/`로 전환
- `routeTree.gen.ts`는 dev/build 시 자동 생성 — 직접 편집 금지
- 환경변수는 `PUBLIC_*` 접두사 (Rsbuild). API base URL은 `import.meta.env.PUBLIC_API_BASE_URL`
- 인증 토큰: accessToken·refreshToken 모두 localStorage. 401 응답 시 인터셉터가 refresh 후 재시도, refresh 실패 시 `tokenManager.onRefreshFailed`로 logout-alert-modal 자동 트리거
- 프로덕션 배포는 Docker(맥미니 서버) — `Dockerfile`, `nginx.conf` 참조
- shadcn/ui CLI는 `src/components/ui/`에 떨어뜨리므로 추가 후 `src/shared/ui/<component>/`로 이동, import 경로 정리

## Workflow Skills

`.claude/skills/`에 5단계 파이프라인:

| Skill | 용도 |
|-------|------|
| `ai-plan` | 요구사항 분석 + 구현/리팩토링 모드 결정 + FSD 구현 계획 작성 |
| `ai-orchestrate` | shared → entities → features → widgets → pages 순으로 코드 작성/이전 |
| `ai-validate` | tsc / biome / build / FSD import 규칙 검증 + 체크리스트 |
| `ai-deliver` | barrel export 정리 + 커밋 메시지 제안 (직접 커밋 ✗) |
| `ai-retrospect` | 코드 리뷰 + 회고 보고서 |
| `ai-pipeline` | 위 5단계 순차 실행 |
