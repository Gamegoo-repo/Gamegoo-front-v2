---
globs: src/pages/**
---

# pages 레이어 (Layer 4 — 최상위, 라우트 셸)

## 허용 Import

- `@/shared/*` — 허용
- `@/entities/*` — 허용
- `@/features/*` — 허용
- `@/widgets/*` — 허용
- `@/pages/*` (다른 slice) — 금지 (cross-slice)

## 구조

slice 단위로 조직:
```
pages/{page-name}/
├── ui/       # 페이지 컴포넌트 (widgets + features + entities 조합)
├── model/    # 페이지 수준 상태 (필요시, 최소화)
├── lib/      # 페이지 내부 헬퍼
└── index.ts  # slice barrel export
```

## 원칙

- 라우트 진입 페이지 셸. 페이지 컴포넌트는 **자기 완결**되어야 라우터(TanStack Router)가 파일·컴포넌트 시그니처만으로 마운트할 수 있다. 외부에서 주입이 필요한 데이터는 store/context로 처리.
- 비즈니스 로직을 직접 포함하지 않음 — widgets/features/entities 조합 + 라우트 수준 결합 로직만 둔다.
- 페이지 간 공통 로직은 widgets 이하 레이어로 내릴 것.

## TanStack Router 파일 라우팅 연계

본 프로젝트는 `rsbuild.config.ts`의 `tanstackRouter` 플러그인이 `src/pages/`를 `routesDirectory`로 스캔해 `src/shared/lib/@generated/routeTree.gen.ts`를 자동 생성한다. 슬라이스 구조와 파일 라우팅은 다음 규칙으로 결합한다:

- 라우트 파일은 슬라이스의 `ui/` 안에 두고, 슬라이스 루트에 라우트 파일을 직접 두지 않는다.
- 라우트 파일명 규약(TanStack Router):
  - `__root.tsx` — 루트 라우트
  - `_segment/route.tsx` — pathless layout
  - `index.tsx` — 인덱스 라우트
  - `foo.bar.tsx` — 중첩 경로(점 구분)
  - `$param.tsx` — 동적 path param
  - `-helper.tsx` — 라우터 무시(슬라이스 내부 헬퍼)
- 라우트 정의는 `createFileRoute(...)`로 작성하고 `Route` named export 필수.
- `createFileRoute("...")`의 경로 문자열은 플러그인이 저장 시 자동 정정 — 수동 변경하지 말 것.
- `routeTree.gen.ts`는 자동 생성 — **직접 편집 금지**.

```tsx
// pages/board/ui/BoardPage.tsx
import { createFileRoute } from "@tanstack/react-router";
import { BoardView } from "@/widgets/board-view";

export const Route = createFileRoute("/_header-layout/board/")({
  component: BoardPage,
});

export const BoardPage = () => {
  return <BoardView />;
};
```

## 데이터 흐름 (App ↔ pages)

페이지가 필요로 하는 인증·반응형·소켓 등의 컨텍스트는 `app/providers/`의 부트스트랩 Provider가 entities/shared의 store에 주입한다. 페이지는 store/context를 통해 읽기만 한다.

### 가드레일

1. **pages 간 직접 import 금지** — 다른 슬라이스를 참조하면 cross-page 의존이 생긴다. 공통 컴포넌트는 widgets로, 공통 로직은 features 이하로.
2. **공유 데이터는 push 채널로만 주입** — 인증 토큰·계정·소켓 등은 `app/providers/`의 부트스트랩 Provider가 store에 채워 넣고, 페이지는 store에서 읽는다.
3. **페이지 컴포넌트는 props 없이 자기 완결** — 라우터 시그니처가 props 전달을 차단한다. 데이터는 부트스트랩으로 채워진 store/context에서 읽는다.
4. **상태 동기화는 단방향** — 외부 입력(URL 파라미터, 부트스트랩 setter)을 useEffect로 감지하여 store에 반영. 페이지가 외부에 다시 쓰는 양방향 sync 금지.

### 권장 패턴 예

```tsx
// app/providers/AuthBootstrap.tsx — 부트스트랩 시점
import { useEffect } from "react";
import { useAuthStore } from "@/entities/auth";

export const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((s) => s.setUser);
  useEffect(() => {
    // localStorage / refresh 로직으로 user를 채운다
  }, [setUser]);
  return <>{children}</>;
};
```

```tsx
// pages/mypage/ui/MyPage.tsx — store에서 읽기만
import { useAuthStore } from "@/entities/auth";

export const MyPage = () => {
  const user = useAuthStore((s) => s.user);
  // ...
};
```

페이지 내부에서는 store(`@/shared` 또는 `@/entities/*/model`)를 통해 데이터를 읽는다.
