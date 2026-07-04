---
globs: src/**/api/**
---

# API 개발 규칙

본 프로젝트는 OpenAPI(`https://api.gamegoo.co.kr/v3/api-docs`)에서 typescript-axios 클라이언트를 자동 생성한다(`pnpm openapi`). 위치는 `src/shared/api/@generated/`이며 **수동 편집 금지**.

## FSD 내 API 배치

| 위치              | 용도                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------- |
| `shared/api/`     | HTTP 클라이언트 인스턴스, 인터셉터, 토큰 매니저, 공통 에러 핸들러, 자동 생성 클라이언트 |
| `entities/*/api/` | 엔티티 CRUD 서비스 함수 + queryKeys.ts + Query 훅                                       |
| `features/*/api/` | 기능 전용 API 호출 (mutation 중심) + Mutation 훅                                        |

## 1. HTTP 클라이언트 (shared/api/)

axios 인스턴스를 용도별로 생성:

```ts
// shared/api/client.ts (정통 형태)
import axios from 'axios';

export const privateApiClient = axios.create({
  baseURL: import.meta.env.PUBLIC_API_BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

export const publicApiClient = axios.create({
  baseURL: import.meta.env.PUBLIC_API_BASE_URL,
  timeout: 30_000,
});
```

인터셉터는 별도 파일로 분리:

```ts
// shared/api/interceptors.ts
import type { AxiosInstance } from 'axios';

export const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => handleApiError(error)
  );
};
```

토큰 매니저(`tokenManager`)는 accessToken·refreshToken을 localStorage에 저장하고, 401 응답 시 refresh 후 원래 요청을 재시도한다. refresh 실패 시 `tokenManager.onRefreshFailed?.()`로 logout-alert-modal을 트리거한다.

## 2. 서비스 함수 패턴

async 함수 기반, AxiosResponse를 unwrap하여 데이터만 반환:

```ts
// entities/chat-session/api/chatSessionService.ts
import { api } from '@/shared/api';
import type { ChatSession, CreateChatSessionRequest } from '../model/types';

export const getChatSessions = async (): Promise<ChatSession[]> => {
  const { data } = await api.private.chat.getChatSessions();
  return data;
};

export const createChatSession = async (
  request: CreateChatSessionRequest
): Promise<ChatSession> => {
  const { data } = await api.private.chat.createChatSession(request);
  return data;
};
```

규칙:

- **named export 함수만** 사용 (클래스 금지)
- 반환 타입 **명시적** 작성 (`Promise<T>`)
- 요청/응답 타입은 같은 slice의 `model/types.ts`에 정의

## 3. React Query 훅

### useQuery

```ts
// entities/chat-session/api/useGetChatSessionsQuery.ts
import { useQuery } from '@tanstack/react-query';
import type { ExtendedError } from '@/shared/types';
import { getChatSessions } from './chatSessionService';
import { CHAT_SESSION_KEYS } from './queryKeys';

export const useGetChatSessionsQuery = () => {
  return useQuery<ChatSession[], ExtendedError>({
    queryKey: CHAT_SESSION_KEYS.LIST,
    queryFn: getChatSessions,
  });
};
```

### useMutation

```ts
// features/send-message/api/useSendMessageMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ExtendedError } from '@/shared/types';
import { CHAT_SESSION_KEYS } from '@/entities/chat-session';
import { sendMessage } from './sendMessageService';

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Message, ExtendedError, SendMessageRequest>({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_SESSION_KEYS.LIST });
    },
  });
};
```

규칙:

- 타입 파라미터 3개 명시: `<Response, Error, Request>`
- 훅 파일명: `use{Action}{Entity}Query.ts` 또는 `use{Action}Mutation.ts`
- 한 파일에 하나의 훅만 export

## 4. Query Key 컨벤션

각 slice의 `api/queryKeys.ts`에 정의:

```ts
// entities/chat-session/api/queryKeys.ts
export const CHAT_SESSION_KEYS = {
  ALL: ['chat-session'] as const,
  LIST: ['chat-session', 'list'] as const,
  DETAIL: (id: string) => ['chat-session', 'detail', id] as const,
} as const;
```

규칙:

- 객체로 그룹핑, `as const` 사용
- 키 이름: `ALL`, `LIST`, `DETAIL` (UPPER_SNAKE_CASE)
- 동적 파라미터는 함수로 제공
- 계층 구조 유지: `["domain", "scope", ...params]`

## 5. 에러 타입

공통 에러 인터페이스는 `shared/types/`에 정의:

```ts
// shared/types/error.ts
import type { AxiosError } from 'axios';

export interface ApiErrorResponse {
  code: string;
  message: string;
  status: number;
  timestamp: string;
}

export interface ExtendedError extends AxiosError {
  response: AxiosError['response'] & {
    data: ApiErrorResponse;
  };
}
```
