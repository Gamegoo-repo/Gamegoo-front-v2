---
globs: src/**/model/**
---

# 상태 관리 규칙 (Zustand)

본 프로젝트는 Zustand로 상태를 관리한다. Recoil/Redux/MobX 사용 금지.

## 1. Store 생성

`create()` 함수로 슬라이스별 독립 store 생성:

```ts
// entities/chat-session/model/chatSessionStore.ts
import { create } from 'zustand';

interface ChatSessionState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  setSessions: (sessions: ChatSession[]) => void;
  setActiveSessionId: (id: string | null) => void;
}

export const useChatSessionStore = create<ChatSessionState>((set) => ({
  sessions: [],
  activeSessionId: null,
  setSessions: (sessions) => set({ sessions }),
  setActiveSessionId: (id) => set({ activeSessionId: id }),
}));
```

## 2. 네이밍 규칙

| 항목             | 규칙                                                 | 예시                                        |
| ---------------- | ---------------------------------------------------- | ------------------------------------------- |
| Store 훅         | `use{SliceName}Store`                                | `useChatSessionStore`                       |
| 파일명           | `{sliceName}Store.ts`                                | `chatSessionStore.ts`                       |
| State 인터페이스 | `{SliceName}State`                                   | `ChatSessionState`                          |
| Action 함수      | `set{Property}`, `reset{Property}`, `{verb}{Entity}` | `setSessions`, `resetFilters`, `addMessage` |

## 3. Selector 패턴

리렌더 최소화를 위해 필요한 값만 선택:

```ts
// ✅ Good — 필요한 값만 구독
const activeSessionId = useChatSessionStore((state) => state.activeSessionId);
const setActiveSessionId = useChatSessionStore((state) => state.setActiveSessionId);

// ❌ Bad — 전체 store 구독 (불필요한 리렌더 유발)
const store = useChatSessionStore();
```

여러 값을 함께 사용할 때는 `useShallow` 사용:

```ts
import { useShallow } from 'zustand/react/shallow';

const { sessions, activeSessionId } = useChatSessionStore(
  useShallow((state) => ({
    sessions: state.sessions,
    activeSessionId: state.activeSessionId,
  }))
);
```

## 4. Immer Middleware

중첩 객체 업데이트 시 immer 미들웨어 사용:

```ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useChatStore = create<ChatState>()(
  immer((set) => ({
    messages: [],
    addMessage: (message) =>
      set((state) => {
        state.messages.push(message);
      }),
    updateMessage: (id, content) =>
      set((state) => {
        const msg = state.messages.find((m) => m.id === id);
        if (msg) msg.content = content;
      }),
  }))
);
```

## 5. FSD 배치 규칙

| 위치                | 용도                                                 |
| ------------------- | ---------------------------------------------------- |
| `shared/lib/`       | Zustand 유틸리티 (커스텀 미들웨어, devtools 설정 등) |
| `entities/*/model/` | 엔티티 단위 store (도메인 데이터 상태)               |
| `features/*/model/` | 기능 단위 store (UI 인터랙션 상태)                   |
| `widgets/*/model/`  | 위젯 수준 store (필요 시에만, 최소화)                |

- store 정의는 **model/ 세그먼트에만** 위치
- ui/ 세그먼트에서 store를 import하여 사용
- api/ 세그먼트에서 store 직접 참조 금지 — 서비스 함수는 순수하게 유지

## 6. 컴포넌트 외부에서 접근

React 외부(인터셉터, 유틸 등)에서 store 접근 시 `getState()` / `setState()` 사용:

```ts
// API 인터셉터에서 토큰 읽기
const token = useAuthStore.getState().token;

// 에러 핸들러에서 상태 초기화
useAuthStore.setState({ token: null, isAuthenticated: false });
```

## 7. 금지 사항

- `recoil`, `recoil-nexus`, `recoil-persist`, `redux`, `mobx` import 금지
- store 파일에 React 컴포넌트 코드 작성 금지
- api/ 세그먼트에서 store import 금지
- `any` 타입의 state 금지 — 모든 state에 명시적 인터페이스 정의
