---
globs: src/**
---

# Import 규칙

## 정렬 순서

import 구문은 아래 순서로 그룹핑하며, 그룹 사이에 빈 줄을 넣는다:

```ts
// 1. React 관련
import { useState, useCallback } from "react";

// 2. 외부 npm 패키지
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 3. Cross-layer import (path alias 사용)
import { httpClient } from "@/shared/api";
import { ChatSession } from "@/entities/chat";

// 4. Same-slice 내부 (상대 경로)
import { chatMessageSchema } from "./model/schema";
import { MessageBubble } from "./ui/MessageBubble";
```

(Biome `organizeImports: on`이 자동 정렬한다.)

## Path Alias 사용 규칙

- **다른 레이어 참조**: 반드시 path alias 사용
  ```ts
  // ✅ Good
  import { httpClient } from "@/shared/api";
  import { ChatSession } from "@/entities/chat";

  // ❌ Bad — 상대 경로로 다른 레이어 접근 금지
  import { httpClient } from "../../shared/api";
  import { ChatSession } from "../../../entities/chat";
  ```

- **같은 slice 내부**: 상대 경로 사용
  ```ts
  // ✅ Good (entities/chat/ 내부에서)
  import { ChatSessionType } from "./model/types";
  import { ChatBubble } from "../ui/ChatBubble";
  ```

## 사용 가능한 Alias

`tsconfig.json`의 alias는 `@/*` → `src/*` 단 하나. 레이어별 alias는 별도로 없으므로 cross-layer 참조는 `@/<layer>/...` 형태로 작성한다.

| Alias 사용 형태 | Target |
|----------------|--------|
| `@/shared/...` | `src/shared/...` |
| `@/entities/...` | `src/entities/...` |
| `@/features/...` | `src/features/...` |
| `@/widgets/...` | `src/widgets/...` |
| `@/pages/...` | `src/pages/...` |
| `@/app/...` | `src/app/...` |

`tsconfig.json` paths(타입 체크 + IDE)와 Rsbuild의 alias(빌드) 모두 자동 인식.

## 자동 생성 코드 import 금지 영역

`src/shared/api/@generated/**`은 OpenAPI 생성 클라이언트 자체. UI/feature 코드에서 직접 import하지 말고 `src/shared/api/index.ts`의 barrel을 통해 사용한다.

```ts
// ❌ Bad — generated 모듈 직접 참조
import { BoardApi } from "@/shared/api/@generated/api/board-api";

// ✅ Good — barrel을 통한 싱글톤 사용
import { api } from "@/shared/api";
api.private.board.someMethod(...);
```

`src/shared/lib/@generated/routeTree.gen.ts`는 `src/index.tsx`만 import한다.

## Type-only import

`tsconfig.json`이 `verbatimModuleSyntax: true`이므로 타입만 import할 때는 반드시 `import type`을 사용한다.

```ts
// ✅ Good
import type { ButtonHTMLAttributes } from "react";
import type { User } from "@/entities/user";

// ❌ Bad — 빌드 에러
import { ButtonHTMLAttributes } from "react";
```
