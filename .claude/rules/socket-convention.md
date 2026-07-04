---
globs: src/**/{socket,api,providers}/**
---

# 실시간(Socket) 시스템 규칙

Gamegoo의 socket.io 통신은 **싱글톤 매니저** 패턴이다. 위치는 정통 FSD에 따라 `shared/api/socket/`:

```
shared/api/socket/
├── socket-manager.ts   # SocketManager 싱글톤
├── socket.ts           # 저수준 socket.io 인스턴스
├── provider.tsx        # SocketProvider (React Context)
├── context.ts
├── hooks.ts            # useSocketMessage 등
├── types.ts
└── README.md
```

## 1. 단일 진입점

직접 `socket.io-client`를 import하지 않는다. 항상 `@/shared/api/socket`을 통해 접근:

```ts
import { socketManager, useSocketMessage, SocketProvider } from '@/shared/api/socket';
```

## 2. 이벤트 수신 — `useSocketMessage`

컴포넌트 내부에서:

```tsx
import { useSocketMessage } from '@/shared/api/socket';

export const FriendList = () => {
  useSocketMessage('friend-online', (data) => {
    console.log('Online:', data);
  });
  return <div>...</div>;
};
```

훅이 마운트/언마운트 시 자동으로 `socket.on` / `socket.off`를 처리한다 — 수동 정리 불필요.

## 3. 이벤트 송신

```ts
import { socketManager } from '@/shared/api/socket';

if (socketManager.connected) {
  socketManager.send('send-message', { roomId, content });
}
```

송신 전 연결 상태 확인. 매니저 내부에서 disconnected 상태일 때 큐잉/재연결을 처리하므로 수동 reconnect는 거의 불필요.

## 4. 인증 / 연결 트리거

- 토큰 부착·재연결 로직은 앱 부트스트랩 Provider에서 처리: `app/providers/GamegooSocketProvider.tsx` (현재 `shared/providers/`에 있는 파일들은 `app/providers/`로 이전 대상)
- 채팅 전용 socket은 `ChatSocketProvider` (room 단위 격리)
- `__root.tsx`에서 Provider tree로 마운트

## 5. 상태 동기화

소켓에서 받은 데이터로 Zustand 스토어를 갱신하는 핸들러는 `features/{slice}/api/use*Handler.ts`에 둔다:

```ts
// features/chat/api/useChatroomUpdateHandler.ts
import { useSocketMessage } from '@/shared/api/socket';
import { useChatStore } from '@/entities/chat';

export const useChatroomUpdateHandler = () => {
  const setRooms = useChatStore((s) => s.setRooms);
  useSocketMessage('chatroom-update', (rooms) => {
    setRooms(rooms);
  });
};
```

핸들러는 `__root.tsx` 또는 적절한 페이지 셸에서 호출 — 페이지 외부에서도 받아야 하면 root에 둔다.

## 6. 금지 사항

- `import { io } from "socket.io-client"`로 새 인스턴스 생성 금지 (싱글톤 위반)
- 컴포넌트 내부에서 `socket.on(...)` 직접 호출 금지 — 반드시 `useSocketMessage` 사용 (cleanup 누락 방지)
- 토큰 갱신 로직을 socket 측에 별도 작성 금지 — `tokenManager`와 provider가 이미 처리

## 디버깅

브라우저 콘솔의 prefix:

| Prefix  | 의미                    |
| ------- | ----------------------- |
| 🔌      | 연결 시도 / 상태 변경   |
| 🟢 / 🔴 | 온라인/오프라인         |
| 📊      | 상태 변경               |
| 🔧      | 이벤트 리스너 등록/해제 |
