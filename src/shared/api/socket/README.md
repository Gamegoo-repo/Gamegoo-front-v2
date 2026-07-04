# Socket 시스템 (Singleton Pattern)

이 문서는 Gamegoo 프론트엔드의 Socket.io 기반 실시간 통신 시스템에 대한 가이드입니다.

## 📋 개요

Socket 시스템은 **싱글톤 패턴**을 기반으로 다음과 같은 기능을 제공합니다:

- 🏗️ **싱글톤 아키텍처**: 전역에서 단일 소켓 인스턴스 관리
- 🔐 **토큰 기반 인증**: JWT 토큰을 통한 안전한 소켓 연결
- 🔄 **스마트 재연결**: 불필요한 재연결을 방지하는 지능형 로직
- 🔑 **토큰 갱신**: 토큰 만료 시 자동 재인증 처리
- 🧹 **메모리 관리**: 자동 이벤트 리스너 정리로 메모리 누수 방지
- ⚛️ **React 통합**: Provider/Hook 패턴으로 쉬운 React 통합
- 📊 **상태 관리**: Enum 기반 명확한 연결 상태 관리
- 🐛 **디버깅 지원**: 상세한 로깅으로 연결 상태 추적

## 🏗️ 아키텍처

### 새로운 싱글톤 아키텍처

```
src/shared/api/socket/
├── socket-manager.ts   # 🆕 싱글톤 소켓 매니저 (핵심)
├── socket.ts          # GamegooSocket 클래스
├── provider.tsx       # React Context Provider (싱글톤 연동)
├── context.ts         # React Context 정의
├── hooks.ts           # React Hooks (싱글톤 연동)
├── types.ts           # 타입 및 Enum 정의
└── index.ts           # 모든 exports
```

### 핵심 컴포넌트

1. **SocketManager (Singleton)** - `socket-manager.ts`
   - 전역 단일 소켓 인스턴스 관리
   - 중앙화된 이벤트 관리
   - 연결 상태 추적 및 제어

2. **GamegooSocket** - `socket.ts`
   - Socket.io 래퍼 클래스
   - 인증, 재연결, 하트비트 로직

3. **SocketProvider** - `provider.tsx`
   - React Context 제공
   - 싱글톤 매니저와 React 상태 동기화

4. **Hooks** - `hooks.ts`
   - `useSocketMessage`: 싱글톤 기반 이벤트 리스닝
   - `useSocketStatus`: 연결 상태 모니터링
   - `useSocketSend`: 안전한 메시지 전송

## 🚀 빠른 시작

### 1. 기본 설정

```tsx
import { SocketProvider } from '@/shared/socket';

function App() {
  return (
    <SocketProvider
      endpoint="ws://localhost:3001"
      tokenProvider={async () => {
        // JWT 토큰 반환
        return getAccessToken();
      }}
      onSocketOpen={() => console.log('소켓 연결됨')}
      onSocketError={(error) => console.error('소켓 오류:', error)}
    >
      <YourAppComponents />
    </SocketProvider>
  );
}
```

### 2. 컴포넌트에서 사용 (싱글톤 기반)

```tsx
import {
  useSocketStatus,
  useSocketSend,
  useSocketMessage,
  SocketReadyState,
  socketManager,
} from '@/shared/api/socket';

function ChatComponent() {
  const { isConnected, stateLabel, readyState } = useSocketStatus();
  const { send } = useSocketSend();

  // 🆕 싱글톤 매니저 직접 사용 (고급)
  const checkConnection = () => {
    console.log('연결 상태:', socketManager.connected);
    console.log('재연결 시도:', socketManager.reconnectAttemptCount);
  };

  // 메시지 수신 리스너 (자동으로 싱글톤 매니저 사용)
  useSocketMessage('chat_message', (data) => {
    console.log('새 메시지:', data);
  });

  const sendMessage = () => {
    send('chat_message', {
      text: 'Hello World!',
      timestamp: Date.now(),
    });
  };

  return (
    <div>
      <div>연결 상태: {stateLabel}</div>
      <div>연결됨: {isConnected ? '예' : '아니오'}</div>

      {readyState === SocketReadyState.OPEN && <button onClick={sendMessage}>메시지 보내기</button>}

      <button onClick={checkConnection}>🔍 연결 정보 확인</button>
    </div>
  );
}
```

## 📚 API 참조

### SocketProvider Props

```tsx
interface SocketProviderProps {
  children: React.ReactNode;
  endpoint: string; // WebSocket 서버 URL
  enabled?: boolean; // 소켓 활성화 여부 (기본: true)
  tokenProvider?: () => Promise<string>; // 토큰 제공 함수
  authData?: SocketAuthData; // 직접 인증 데이터 제공
  options?: SocketOptions; // 소켓 옵션
  onSocketOpen?: () => void; // 연결 성공 콜백
  onSocketClose?: (reason: string) => void; // 연결 종료 콜백
  onSocketError?: (error: Error) => void; // 오류 콜백
  onSocketReconnect?: (attempt: number) => void; // 재연결 성공 콜백
  onSocketReconnectFailed?: () => void; // 재연결 실패 콜백
}
```

### SocketOptions

```tsx
interface SocketOptions {
  maxReconnectAttempts?: number; // 최대 재연결 시도 횟수 (기본: 5)
  reconnectDelay?: number; // 재연결 지연 시간 (기본: 3000ms)
  heartbeatInterval?: number; // 하트비트 간격 (기본: 30000ms)
  heartbeatTimeout?: number; // 하트비트 타임아웃 (기본: 5000ms)
}
```

### Socket 상태 (SocketReadyState)

```tsx
enum SocketReadyState {
  CONNECTING = 0, // 연결 중
  OPEN = 1, // 연결됨
  CLOSING = 2, // 연결 종료 중
  CLOSED = 3, // 연결 끊어짐
}
```

## 🎯 주요 Hooks

### useSocketStatus()

소켓 연결 상태 정보를 제공합니다.

```tsx
const {
  readyState, // SocketReadyState enum
  stateLabel, // 한국어 상태 레이블
  isConnecting, // 연결 중 여부
  isOpen, // 연결 완료 여부
  isClosing, // 연결 종료 중 여부
  isClosed, // 연결 끊어짐 여부
  isConnected, // 연결됨 여부 (isOpen과 동일)
  reconnectAttempts, // 현재 재연결 시도 횟수
} = useSocketStatus();
```

### useSocketSend()

안전한 메시지 전송 기능을 제공합니다.

```tsx
const { send, isConnected } = useSocketSend();

// 사용 예시
const success = send('event_name', { data: 'value' });
if (!success) {
  console.log('메시지 전송 실패');
}
```

### useSocketMessage()

특정 이벤트의 메시지를 수신합니다. 싱글톤 매니저를 자동으로 사용합니다.

```tsx
useSocketMessage<MessageType>('event_name', (data) => {
  console.log('받은 데이터:', data);
});

// 실제 사용 예시: 친구 온라인 상태
function useFriendOnline() {
  const { setFriendOnline, setFriendOffline } = useChatStore();

  useSocketMessage('init-online-friend-list', (res) => {
    const onlineFriends = res.data.onlineFriendMemberIdList;
    setFriendOnline(onlineFriends);
  });

  useSocketMessage('friend-online', (res) => {
    const friendId = res.data.memberId;
    setFriendOnline(friendId);
  });

  useSocketMessage('friend-offline', (res) => {
    const friendId = res.data.memberId;
    setFriendOffline(friendId);
  });
}
```

### useSocketEvent()

소켓 자체 이벤트(connect, disconnect 등)를 수신합니다.

```tsx
useSocketEvent('connect', () => {
  console.log('연결됨!');
});

useSocketEvent('disconnect', (reason) => {
  console.log('연결 끊어짐:', reason);
});
```

### useSocketConnectionEvents()

모든 연결 관련 이벤트를 한번에 처리합니다.

```tsx
useSocketConnectionEvents({
  onConnect: () => console.log('연결됨'),
  onDisconnect: (reason) => console.log('끊어짐:', reason),
  onError: (error) => console.error('오류:', error),
  onReconnect: (attempt) => console.log('재연결됨, 시도:', attempt),
  onReconnectFailed: () => console.log('재연결 실패'),
});
```

### useSocketControls()

소켓을 직접 제어하는 기능을 제공합니다.

```tsx
const { reconnect, disconnect, send } = useSocketControls();

// 수동 재연결
const handleReconnect = () => {
  reconnect();
};

// 연결 종료
const handleDisconnect = () => {
  disconnect();
};
```

## 🔧 고급 사용법

### 1. 토큰 기반 인증

```tsx
// 토큰 제공자 함수
const tokenProvider = async (): Promise<string> => {
  const token = await refreshAccessToken();
  return token;
};

<SocketProvider endpoint="ws://localhost:3001" tokenProvider={tokenProvider}>
  <App />
</SocketProvider>;
```

### 2. 직접 인증 데이터 제공

```tsx
const authData = {
  token: 'your-jwt-token',
  userId: 'user123',
};

<SocketProvider endpoint="ws://localhost:3001" authData={authData}>
  <App />
</SocketProvider>;
```

### 3. 조건부 소켓 활성화

```tsx
const [isLoggedIn, setIsLoggedIn] = useState(false);

<SocketProvider endpoint="ws://localhost:3001" enabled={isLoggedIn} tokenProvider={getToken}>
  <App />
</SocketProvider>;
```

### 4. 커스텀 옵션 설정

```tsx
const socketOptions = {
  maxReconnectAttempts: 10,
  reconnectDelay: 5000,
  heartbeatInterval: 60000,
  heartbeatTimeout: 10000,
};

<SocketProvider endpoint="ws://localhost:3001" options={socketOptions} tokenProvider={getToken}>
  <App />
</SocketProvider>;
```

## 🎨 실제 사용 사례

### 채팅 시스템

```tsx
function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { send } = useSocketSend();
  const { isConnected, stateLabel } = useSocketStatus();

  // 새 메시지 수신
  useSocketMessage('chat_message', (message) => {
    setMessages((prev) => [...prev, message]);
  });

  // 사용자 입장/퇴장 알림
  useSocketMessage('user_joined', (data) => {
    console.log(`${data.username}님이 입장했습니다`);
  });

  useSocketMessage('user_left', (data) => {
    console.log(`${data.username}님이 퇴장했습니다`);
  });

  const sendMessage = () => {
    if (newMessage.trim() && isConnected) {
      send('chat_message', {
        text: newMessage,
        timestamp: Date.now(),
      });
      setNewMessage('');
    }
  };

  return (
    <div>
      <div>상태: {stateLabel}</div>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx}>{msg.text}</div>
        ))}
      </div>

      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        disabled={!isConnected}
        placeholder={isConnected ? '메시지 입력...' : '연결 중...'}
      />

      <button onClick={sendMessage} disabled={!isConnected}>
        전송
      </button>
    </div>
  );
}
```

### 실시간 알림

```tsx
function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);

  useSocketMessage('notification', (notification) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 4)]);

    // 5초 후 알림 제거
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  });

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification">
          {notification.message}
        </div>
      ))}
    </div>
  );
}
```

### 매칭 시스템

```tsx
function MatchingSystem() {
  const [isMatching, setIsMatching] = useState(false);
  const [matchFound, setMatchFound] = useState(null);
  const { send } = useSocketSend();

  useSocketMessage('matching_start', () => {
    setIsMatching(true);
  });

  useSocketMessage('match_found', (matchData) => {
    setIsMatching(false);
    setMatchFound(matchData);
  });

  useSocketMessage('matching_cancelled', () => {
    setIsMatching(false);
    setMatchFound(null);
  });

  const startMatching = () => {
    send('start_matching', {
      gameMode: 'ranked',
      region: 'kr',
    });
  };

  const cancelMatching = () => {
    send('cancel_matching');
    setIsMatching(false);
  };

  return (
    <div>
      {!isMatching && !matchFound && <button onClick={startMatching}>매칭 시작</button>}

      {isMatching && (
        <div>
          <div>매칭 중...</div>
          <button onClick={cancelMatching}>매칭 취소</button>
        </div>
      )}

      {matchFound && (
        <div>
          <h3>매칭 완료!</h3>
          <p>상대방: {matchFound.opponent.nickname}</p>
          <p>게임 ID: {matchFound.gameId}</p>
        </div>
      )}
    </div>
  );
}
```

## 🛠️ 디버깅 및 모니터링

### 연결 상태 모니터링

```tsx
function SocketDebugInfo() {
  const { readyState, stateLabel, reconnectAttempts, isConnected } = useSocketStatus();

  const { socket } = useSocket();

  useSocketConnectionEvents({
    onConnect: () => console.log('✅ 소켓 연결됨'),
    onDisconnect: (reason) => console.log('❌ 소켓 끊어짐:', reason),
    onError: (error) => console.error('🔥 소켓 오류:', error),
    onReconnect: (attempt) => console.log('🔄 재연결됨 (시도:', attempt, ')'),
    onReconnectFailed: () => console.log('💥 재연결 실패'),
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
      }}
    >
      <div>상태: {stateLabel}</div>
      <div>코드: {readyState}</div>
      <div>연결: {isConnected ? '예' : '아니오'}</div>
      <div>재시도: {reconnectAttempts}</div>
      <div>소켓ID: {socket?.socket?.id || 'N/A'}</div>
    </div>
  );
}
```

## 🎯 싱글톤 패턴의 장점

### ✅ 해결된 문제들

1. **다중 연결 방지**: 여러 컴포넌트에서 동시에 소켓을 생성해도 단일 인스턴스 보장
2. **메모리 누수 제거**: 자동 이벤트 리스너 정리로 메모리 누수 완전 방지
3. **불필요한 재연결 방지**: 컴포넌트 리렌더링시에도 연결 유지
4. **일관된 상태**: 모든 컴포넌트가 동일한 소켓 상태 공유
5. **성능 최적화**: 불필요한 연결 생성/해제 오버헤드 제거

### 🔍 디버깅 지원

싱글톤 매니저는 상세한 로깅을 제공합니다:

```typescript
// 브라우저 콘솔에서 볼 수 있는 로그들
🔌 싱글톤 소켓 연결을 시도합니다...
✅ 싱글톤 소켓 연결 성공!
🔄 이미 연결된 소켓이 있어 재연결을 건너뜁니다.
🟢 친구 온라인 이벤트 수신: { data: { memberId: 123 } }
📊 온라인 친구 목록 전체 업데이트: [123, 456, 789]
```

## ⚠️ 주의사항 및 모범 사례

### 🚫 하지 말아야 할 것

1. **직접 소켓 생성**: `new GamegooSocket()` 대신 `socketManager` 사용
2. **수동 이벤트 등록**: `socket.on()` 대신 `useSocketMessage()` 사용
3. **Provider 다중 생성**: 애플리케이션 루트에서 한 번만 생성

### ✅ 권장 사항

1. **토큰 만료**: `tokenProvider`를 제공하면 토큰 만료 시 자동으로 갱신됩니다.

2. **Hook 사용**: Hook들은 자동으로 정리되므로 항상 Hook을 사용하세요.

3. **네트워크 상태**: 네트워크가 불안정한 환경에서는 `maxReconnectAttempts`와 `reconnectDelay`를 적절히 조정하세요.

4. **서버 측 구현**: 서버에서도 토큰 검증 및 하트비트를 처리해야 합니다.

5. **연결 상태 확인**: 메시지 전송 전에 `socketManager.connected` 확인

### 📋 체크리스트

- [ ] `useSocketMessage`를 사용해 이벤트 리스너 등록
- [ ] 컴포넌트 언마운트시 자동 정리 확인
- [ ] `socketManager.connected` 확인 후 메시지 전송
- [ ] Provider는 애플리케이션 루트에서 한 번만 사용
- [ ] 디버깅시 브라우저 콘솔 로그 확인

## 🔄 업데이트 로그

- **v2.0.0**: 싱글톤 패턴 적용 🆕
  - 싱글톤 SocketManager 도입으로 다중 연결 방지
  - 메모리 누수 완전 제거
  - 스마트 재연결 로직으로 불필요한 재연결 방지
  - 상세한 디버깅 로그 시스템
  - 친구 온라인 상태 관리 최적화
  - React 컴포넌트 리렌더링과 무관한 연결 유지

- **v1.0.0**: 초기 구현
  - Socket.io 기반 실시간 통신
  - 토큰 기반 인증 시스템
  - 자동 재연결 및 하트비트
  - React Provider/Hook 패턴
  - Enum 기반 상태 관리

## 🚀 마이그레이션 가이드 (v1 → v2)

### 변경 사항

1. **import 경로 변경**: 일부 고급 기능에서 `socketManager` import 추가
2. **자동 개선**: 기존 Hook들은 그대로 동작하지만 내부적으로 싱글톤 사용
3. **새로운 기능**: `socketManager` 직접 접근으로 더 세밀한 제어 가능

### 기존 코드 호환성

✅ **100% 호환**: 기존 Hook 기반 코드는 수정 없이 동작
✅ **성능 향상**: 자동으로 싱글톤 패턴의 이점 적용
✅ **추가 기능**: 필요시 `socketManager`로 고급 제어 가능

```typescript
// v1 코드 (그대로 동작)
useSocketMessage('event', handler);

// v2 추가 기능 (선택적)
import { socketManager } from '@/shared/api/socket';
if (socketManager.connected) {
  socketManager.send('event', data);
}
```
