# Match Widget - 소켓 및 API 요청 정리

## 📋 개요

매칭 시스템의 소켓 통신과 API 요청을 현재 버전2로 마이그레이션하기 위한 문서입니다.

## 🏗️ 아키텍처

### Funnel 패턴

매칭 프로세스는 Funnel 패턴을 사용하여 단계별로 진행됩니다:

- `match-type`: 매칭 종류 선택 (BASIC/PRECISE)
- `game-mode`: 게임 모드 선택 (FAST/SOLO/FREE/ARAM)
- `profile`: 프로필 등록 및 확인
- `match-start`: 매칭 진행 중
- `match-complete`: 매칭 완료 대기

상태는 `useMatchFunnel` 훅을 통해 관리되며, `sessionStorage`에 저장되어 새로고침 시에도 유지됩니다.

### 소켓 관리

- `socketManager` 싱글톤 인스턴스 사용 (`@/shared/api/socket`)
- `socketManager.send()`: 이벤트 전송
- `socketManager.on()`: 이벤트 수신
- `socketManager.off()`: 이벤트 리스너 제거
- `socketManager.connected`: 연결 상태 확인

## 🔌 소켓 이벤트 (Socket Events)

### 📤 송신 이벤트 (Emit Events)

#### 1. 매칭 요청

```typescript
import { socketManager } from '@/shared/api/socket'

socketManager.send("matching-request", {
  matchingType: "BASIC" | "PRECISE",
  gameMode: "FAST" | "SOLO" | "FREE" | "ARAM",
  threshold: number, // 게임 모드별 기본값: FAST(25), SOLO(67), FREE(65), ARAM(19)
  mike: "AVAILABLE" | "UNAVAILABLE",
  mainP: string,
  subP: string,
  wantP: string[],
  gameStyleIdList: number[] | null
});
```

**중복 전송 방지**: `sessionStorage`를 사용하여 동일 사용자의 중복 요청을 방지합니다.

```typescript
const requestDedupKey = `matching-request-sent:${userId}`;
sessionStorage.setItem(requestDedupKey, 'true');
```

#### 2. 매칭 재시도

```typescript
socketManager.send('matching-retry', {
  threshold: number, // 30초마다 1.5씩 감소
});
```

#### 3. 매칭 상대 발견 성공 (Receiver 전용)

```typescript
socketManager.send('matching-found-success', {
  senderMatchingUuid: string,
});
```

#### 4. 매칭 성공 (Receiver)

```typescript
socketManager.send('matching-success-receiver', {
  senderMatchingUuid: string,
});
```

#### 5. 매칭 최종 성공 (Sender)

```typescript
socketManager.send('matching-success-final');
```

#### 6. 매칭 실패

```typescript
socketManager.send('matching-fail');
```

#### 7. 매칭 취소/종료

```typescript
socketManager.send('matching-quit');
```

#### 8. 매칭 상대 없음

```typescript
socketManager.send('matching-not-found');
```

### 📥 수신 이벤트 (Listen Events)

#### 1. 매칭 시작

```typescript
socketManager.on('matching-started', (data) => {
  console.log('매칭 시작:', data);
  // 매칭 시작 확인
});
```

#### 2. 매칭 카운트 업데이트

```typescript
socketManager.on('matching-count', (data: MatchingCountData) => {
  // 티어별 매칭 인원수 업데이트
  setTierCounts({
    ...data.data.tierCount,
    total: data.data.userCount,
  });
});
```

**타입 정의** (`lib/matching-types.ts`):

```typescript
export interface MatchingCountData {
  data: {
    tierCount: Record<string, number>;
    userCount: number;
  };
  event: string;
  timestamp: string;
}
```

#### 3. 매칭 상대 발견 (Sender)

```typescript
socketManager.on('matching-found-sender', (data: MatchingFoundData) => {
  clearTimers(); // 매칭 타이머 정리
  funnel.toStep('match-complete', {
    matchComplete: {
      role: 'sender',
      opponent: data.data,
      matchingUuid: data.data.senderMatchingInfo?.matchingUuid ?? '',
    },
  });
});
```

#### 4. 매칭 상대 발견 (Receiver)

```typescript
socketManager.on('matching-found-receiver', (data: MatchingFoundData) => {
  clearTimers(); // 매칭 타이머 정리

  // matching-found-success 전송 (중복 방지)
  if (!didSendFoundSuccessRef.current) {
    didSendFoundSuccessRef.current = true;
    socketManager.send('matching-found-success', {
      senderMatchingUuid: data.data.senderMatchingInfo.matchingUuid,
    });
  }

  funnel.toStep('match-complete', {
    matchComplete: {
      role: 'receiver',
      opponent: data.data.senderMatchingInfo,
      matchingUuid: data.data.senderMatchingInfo.matchingUuid,
    },
  });
});
```

**타입 정의** (`lib/matching-types.ts`):

```typescript
export interface MatchingFoundData {
  data: {
    senderMatchingInfo?: {
      matchingUuid: string;
    };
    senderMatchingUuid?: string;
    opponent?: {
      gameName: string;
      tag: string;
      tier: string;
      mainP: string;
      subP: string;
    };
  };
  event: string;
  timestamp: string;
}
```

#### 5. 매칭 성공 (Sender 전용)

```typescript
socketManager.on('matching-success-sender', () => {
  // Sender가 Receiver의 응답을 받았을 때
  // matching-success-final 전송 후 3초 타이머 시작
  socketManager.send('matching-success-final');

  const timer = setTimeout(() => {
    socketManager.send('matching-fail');
  }, 3000);
});
```

#### 6. 매칭 최종 성공

```typescript
socketManager.on('matching-success', (data: MatchingSuccessData) => {
  clearAllTimers();

  // 중복 전송 방지 키 해제
  sessionStorage.removeItem(`matching-request-sent:${userId}`);

  // 채팅방 UUID 설정 및 채팅방 열기
  // TODO: 채팅 연결 로직 구현
  // setChatRoomUuid(data.chatroomUuid);
  // openChatRoom();
});
```

**타입 정의** (`lib/matching-types.ts`):

```typescript
export interface MatchingSuccessData {
  chatroomUuid: string;
  opponent: {
    gameName: string;
    tag: string;
    tier: string;
    mainP: string;
    subP: string;
  };
}
```

#### 7. 매칭 실패

```typescript
socketManager.on('matching-fail', () => {
  clearAllTimers();

  // 중복 전송 방지 키 해제
  sessionStorage.removeItem(`matching-request-sent:${userId}`);

  // 프로필 단계로 복귀
  funnel.toStep('profile');
});
```

#### 8. 에러 처리

```typescript
// 소켓 에러는 socketManager의 전역 에러 핸들러에서 처리
// 또는 raw socket을 통해 직접 처리 가능
if (socketManager.socketInstance?.socket) {
  const socket = socketManager.socketInstance.socket;
  socket.on('error', (errorData) => {
    if (errorData.data === 'You are already in the matching room...') {
      // 이미 매칭 중 모달 표시
    }
  });
}
```

**이벤트 리스너 정리**:

```typescript
useEffect(() => {
  // 이벤트 리스너 등록
  socketManager.on('matching-started', handleMatchingStarted);
  socketManager.on('matching-count', handleMatchingCount);

  return () => {
    // 컴포넌트 언마운트 시 리스너 제거 (메모리 누수 방지)
    socketManager.off('matching-started', handleMatchingStarted);
    socketManager.off('matching-count', handleMatchingCount);
  };
}, []);
```

## 🌐 API 요청 (API Requests)

> **참고**: API 요청은 TanStack Query를 사용하여 처리합니다. 프로필 데이터는 `useAuthUser()` 훅을 통해 전역으로 관리됩니다.

### 1. 사용자 프로필 조회

```typescript
import { useAuthUser } from '@/shared/providers';

// 프로필 데이터는 전역 AuthUserProvider에서 관리
const { authUser } = useAuthUser();
// authUser는 MyProfileResponse 타입
```

### 2. 챔피언 통계 새로고침

```typescript
// TODO: TanStack Query mutation으로 구현 필요
// POST /api/member/refresh-champion-stats
await memberApi.refreshChampionStats({
  memberId: number,
});
```

### 3. 매너 레벨 조회

```typescript
// TODO: TanStack Query로 구현 필요
// GET /api/manner/level/{memberId}
const mannerRes = await getMemberMannerLevel(userId);
```

### 4. 게시판 목록 조회

```typescript
// TODO: TanStack Query로 구현 필요
// GET /api/board
const response = await getBoardList({
  page: number,
  pageIdx: number,
  gameMode: GameMode,
  tier: string,
  mainP: string,
  mike: string,
});
```

## 🔄 상태 관리 (State Management)

### Funnel 상태 관리

```typescript
import { useMatchFunnel } from '@/widgets/match/hooks';

const funnel = useMatchFunnel();

// 단계 이동
funnel.toStep('match-start', {
  profile: {
    /* 프로필 데이터 */
  },
});

// 현재 상태 접근
const currentStep = funnel.step;
const context = funnel.context;
const user = funnel.user;
```

**상태 저장**: `sessionStorage`에 자동 저장되어 새로고침 시에도 유지됩니다.

- `funnel-step`: 현재 단계
- `funnel-context`: 컨텍스트 데이터

### 전역 상태 관리

- **Zustand**: 전역 상태 관리 (예: `useLoginRequiredModalStore`)
- **TanStack Query**: 서버 상태 관리 및 캐싱
- **AuthUserProvider**: 사용자 인증 및 프로필 데이터

### Session Storage

```typescript
// 중복 전송 방지 키
sessionStorage.setItem(`matching-request-sent:${userId}`, 'true');
sessionStorage.removeItem(`matching-request-sent:${userId}`);

// Funnel 상태 (useMatchFunnel에서 자동 관리)
sessionStorage.getItem('funnel-step');
sessionStorage.getItem('funnel-context');
```

## ⏰ 타이머 관리 (Timer Management)

### 상수 정의

```typescript
const MAX_MATCHING_TIME = 300; // 5분 (초)
const MATCHING_COMPLETE_TIME = 10; // 10초
const TIMER_INTERVAL = 1000; // 1초
```

### 1. 매칭 대기 타이머 (5분)

```typescript
const timerRef = useRef<NodeJS.Timeout | null>(null);
const thresholdRef = useRef(51.5); // 초기 threshold 값

const startMatchingProcess = () => {
  if (timerRef.current) return; // 이미 실행 중이면 중복 실행 방지

  // 게임 모드별 초기 threshold 설정
  thresholdRef.current = GAME_MODE_THRESHOLD[gameMode] + 1.5;

  timerRef.current = setInterval(() => {
    setTimeLeft((prevTime) => {
      if (prevTime === 1) {
        // 5분 타이머 종료 시 매칭 실패 처리
        clearTimers();
        socketManager.send('matching-not-found');
        handleRetry(); // 매칭 실패 모달
        return 0;
      } else if (prevTime < 300 && prevTime % 30 === 0) {
        // 30초마다 threshold 감소하며 재시도
        thresholdRef.current -= 1.5;
        socketManager.send('matching-retry', {
          threshold: thresholdRef.current,
        });
      }
      return prevTime - 1;
    });
  }, TIMER_INTERVAL);
};

const clearTimers = () => {
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
};
```

**게임 모드별 Threshold 기본값**:

```typescript
const GAME_MODE_THRESHOLD: Record<string, number> = {
  FAST: 25, // 빠른 대전
  SOLO: 67, // 개인 랭크
  FREE: 65, // 자유 랭크
  ARAM: 19, // 칼바람
};
```

### 2. 매칭 완료 대기 타이머 (10초)

```typescript
const mainTimerRef = useRef<NodeJS.Timeout | null>(null);
const [timeLeft, setTimeLeft] = useState(MATCHING_COMPLETE_TIME);

useEffect(() => {
  mainTimerRef.current = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(mainTimerRef.current!);

        // Receiver: 타임아웃 시 성공 응답 전송
        if (role === 'receiver' && matchingUuid) {
          socketManager.send('matching-success-receiver', {
            senderMatchingUuid: matchingUuid,
          });

          // 5초 대기 후 실패 처리
          secondaryTimerRef.current = setTimeout(() => {
            socketManager.send('matching-fail');
          }, 5000);
        }
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => {
    if (mainTimerRef.current) {
      clearInterval(mainTimerRef.current);
    }
  };
}, [role, matchingUuid]);
```

### 3. 매칭 성공 대기 타이머 (5초/3초)

```typescript
const secondaryTimerRef = useRef<NodeJS.Timeout | null>(null);
const finalTimerRef = useRef<NodeJS.Timeout | null>(null);

// Receiver: 5초 대기 (matching-success-receiver 전송 후)
secondaryTimerRef.current = setTimeout(() => {
  socketManager.send('matching-fail');
}, 5000);

// Sender: 3초 대기 (matching-success-final 전송 후)
finalTimerRef.current = setTimeout(() => {
  socketManager.send('matching-fail');
}, 3000);

// 모든 타이머 정리
const clearAllTimers = () => {
  if (mainTimerRef.current) clearInterval(mainTimerRef.current);
  if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current);
  if (finalTimerRef.current) clearTimeout(finalTimerRef.current);
};
```

**타이머 정리 주의사항**:

- 컴포넌트 언마운트 시 모든 타이머를 정리해야 메모리 누수를 방지할 수 있습니다.
- `useEffect`의 cleanup 함수에서 타이머를 정리합니다.

## 🎯 구현 우선순위

### Phase 1: 기본 매칭 플로우 ✅

1. ✅ 매칭 요청 (`matching-request`)
2. ✅ 매칭 카운트 수신 (`matching-count`)
3. ✅ 매칭 상대 발견 (`matching-found-sender/receiver`)
4. ✅ 매칭 완료 처리 (`matching-success`)
5. ✅ Funnel 패턴 구현
6. ✅ 소켓 매니저 통합

### Phase 2: 고급 기능 🔄

1. ✅ 매칭 재시도 로직 (`matching-retry`)
2. ✅ 매칭 실패 처리 (`matching-fail`)
3. ✅ 타이머 관리
4. ✅ 중복 전송 방지
5. 🔄 에러 핸들링 (`error` 이벤트)
6. 🔄 매칭 실패 모달 (재시도 옵션)
7. 🔄 게시판 연동 (매칭 실패 시)

### Phase 3: 최적화 ⏳

1. ✅ 소켓 연결 상태 관리
2. ✅ 메모리 누수 방지 (타이머/리스너 정리)
3. ⏳ 에러 복구 로직
4. ⏳ 채팅 연결 로직 (`matching-success` 후)
5. ⏳ 사용자 경험 개선
6. ⏳ 로딩 상태 개선

## 📝 주의사항

### 소켓 이벤트 정리

- ✅ 모든 소켓 이벤트 리스너는 컴포넌트 언마운트 시 정리 필요
- ✅ 중복 이벤트 리스너 방지를 위한 `socketManager.off()` 사용
- ✅ 메모리 누수 방지를 위한 타이머 정리
- ✅ `useEffect` cleanup 함수에서 반드시 정리

**예시**:

```typescript
useEffect(() => {
  socketManager.on('event', handler);

  return () => {
    socketManager.off('event', handler);
  };
}, []);
```

### 중복 전송 방지

- ✅ `sessionStorage`를 사용한 중복 요청 방지
- ✅ `useRef`를 사용한 컴포넌트 내 중복 방지
- ✅ 매칭 완료/실패 시 세션 스토리지 키 해제

### API 에러 처리

- ⏳ 네트워크 오류 시 재시도 로직
- ⏳ 사용자 친화적 에러 메시지
- ⏳ 로딩 상태 관리

### 상태 동기화

- ✅ Funnel 상태와 `sessionStorage` 동기화
- ✅ 소켓 이벤트와 UI 상태 동기화
- ⏳ URL 파라미터와 상태 동기화 (필요 시)

### 타입 안정성

- ✅ `lib/matching-types.ts`에 타입 정의
- ✅ TypeScript 타입 활용
- ⏳ 타입 가드 추가 (필요 시)

## 🚀 다음 단계

### 즉시 구현 필요

1. **채팅 연결 로직**: `matching-success` 이벤트 수신 시 채팅방 열기
2. **매칭 실패 모달**: 재시도 옵션 및 게시판 연동
3. **에러 핸들링**: 소켓 에러 및 네트워크 에러 처리

### 개선 사항

1. **로딩 상태**: 매칭 진행 중 사용자 피드백 개선
2. **에러 복구**: 매칭 실패 시 자동 복구 로직
3. **테스트**: 단위 테스트 및 통합 테스트
4. **모니터링**: 매칭 성공률 및 에러 추적

### 참고 자료

- 소켓 시스템: `src/shared/api/socket/README.md`
- 타입 정의: `src/widgets/match/lib/matching-types.ts`
- Funnel 훅: `src/widgets/match/hooks/use-match-funnel.tsx`

## 📁 파일 구조

```
src/widgets/match/
├── hooks/
│   ├── index.ts
│   └── use-match-funnel.tsx      # Funnel 상태 관리 훅
├── lib/
│   ├── constants.ts               # 상수 정의 (MATCH_STEPS_LABEL)
│   ├── matching-types.ts          # 매칭 관련 타입 정의
│   └── types.ts                   # FunnelStep 타입 정의
├── ui/
│   ├── index.ts
│   ├── match.tsx                  # 메인 매칭 컴포넌트
│   ├── match-header.tsx           # 매칭 헤더 컴포넌트
│   └── match-steps/
│       ├── index.ts
│       ├── game-mode-step.tsx     # 게임 모드 선택 단계
│       ├── match-type-step.tsx    # 매칭 종류 선택 단계
│       ├── profile-step.tsx       # 프로필 등록 단계
│       ├── match-start-step/
│       │   ├── index.ts
│       │   ├── match-start-step.tsx      # 매칭 진행 중 단계
│       │   ├── match-loading-card.tsx    # 매칭 로딩 카드
│       │   └── match-start-profile.tsx   # 프로필 표시 컴포넌트
│       └── match-complete-step/
│           └── match-complete-step.tsx   # 매칭 완료 대기 단계
├── index.ts
└── README.md                      # 이 문서
```

## 🔑 주요 컴포넌트

### `MatchComponent` (`ui/match.tsx`)

- Funnel 패턴을 사용한 단계별 매칭 프로세스 관리
- `useMatchFunnel` 훅을 통해 상태 관리

### `MatchStartStep` (`ui/match-steps/match-start-step/match-start-step.tsx`)

- 매칭 요청 전송 및 진행 상태 관리
- 소켓 이벤트 리스닝 및 타이머 관리
- 매칭 카운트 업데이트 처리

### `MatchCompleteStep` (`ui/match-steps/match-complete-step/match-complete-step.tsx`)

- 매칭 완료 대기 및 최종 성공/실패 처리
- Sender/Receiver 역할별 다른 로직 처리
- 10초 타이머 및 추가 타이머 관리

### `useMatchFunnel` (`hooks/use-match-funnel.tsx`)

- Funnel 상태 관리 훅
- `sessionStorage`를 통한 상태 영속화
- 단계 이동 및 컨텍스트 관리
