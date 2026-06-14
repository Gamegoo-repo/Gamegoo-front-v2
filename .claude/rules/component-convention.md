---
globs: src/**/ui/**
---

# 컴포넌트 개발 규칙

## 1. UI 라이브러리 우선 정책

원자적 UI(버튼, 인풋, 모달, 배지 등)는 사내 디자인 시스템과 shadcn/ui를 우선 사용한다.

- `@gamegoo-ui/design-system` — 사내 디자인 시스템. `DesignSystemProvider`가 `__root.tsx`에 마운트되어 있다.
- shadcn/ui — `components.json`에 style `new-york`, baseColor `neutral`, icon `lucide`로 구성. CLI 추가 후 `src/shared/ui/<component>/`로 이동.

```bash
# 추가
npx shadcn add button badge modal
# 이동
mv src/components/ui/button.tsx src/shared/ui/button/
```

직접 antd/MUI 등 다른 UI 라이브러리 import 금지 — 디자인 일관성을 깬다.

```tsx
// ✅ Good
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

// ❌ Bad — 동일 의미의 커스텀 컴포넌트를 새로 만들기
const CustomButton = () => <button className="...">...</button>;
```

## 2. 파일 & 네이밍

- 파일명: PascalCase (`ChatMessage.tsx`, `ModelSelector.tsx`)
- 컴포넌트명: 파일명과 동일한 PascalCase
- Props 인터페이스: `{ComponentName}Props`
  ```ts
  interface ChatMessageProps {
    message: string;
    sender: "user" | "ai";
  }
  ```

## 3. Export

- **named export만 사용** — `export default` 금지
  ```ts
  // ✅ Good
  export const ChatMessage = ({ message, sender }: ChatMessageProps) => { ... };

  // ❌ Bad
  export default function ChatMessage() { ... }
  ```

## 4. Props 타이핑

- `interface`로 정의 (단순 union이 아니면 `type` 지양)
- 구조 분해 할당에서 기본값 설정
- `any` 금지 — 불가피하면 `unknown` + 타입 가드
  ```ts
  export const Panel = ({ title, collapsed = false }: PanelProps) => { ... };
  ```

## 5. 스타일링

- **Tailwind CSS 유틸리티 클래스** 우선 사용
- Emotion styled-components / CSS-in-JS 지양
- 동적 값은 `style` prop 또는 Tailwind 임의값(`w-[200px]`)
- 클래스 병합은 `cn` 유틸 (`@/shared/lib/utils`)
- Biome `useSortedClasses: on` — 클래스 순서 자동 정렬

```tsx
import { cn } from "@/shared/lib/utils";

<div className={cn("flex items-center gap-2 p-4", isActive && "bg-blue-50")}>
  <span className="text-sm text-gray-600">{label}</span>
</div>;
```

className 작성 시 함정(`${cond && '...'}`이 `'false'` 문자열을 박는 문제 등)은 `.claude/rules/className-convention.md` 참조.

## 6. forwardRef

- DOM 접근 또는 imperative handle이 필요한 경우에만 사용
- `displayName` 필수 설정
  ```ts
  export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    ({ label, ...rest }, ref) => {
      return <input ref={ref} {...rest} />;
    },
  );
  TextInput.displayName = "TextInput";
  ```

## 7. 컴포넌트 구조

- 한 파일에 하나의 export 컴포넌트 (헬퍼 컴포넌트는 비-export로 같은 파일에 가능)
- 복합 컴포넌트는 서브디렉토리로 분리:
  ```
  ui/
  ├── ChatMessage.tsx        # 단순 컴포넌트
  └── ChatPanel/             # 복합 컴포넌트
      ├── ChatPanel.tsx
      ├── ChatHeader.tsx
      └── index.ts           # barrel export
  ```

## 8. 상태 관리

- 컴포넌트 내부 상태: `useState`, `useReducer`
- 공유 상태: Zustand store (`model/` 세그먼트에 정의)
- 서버 상태: TanStack Query (`api/` 세그먼트에 정의)
- UI 컴포넌트에 비즈니스 로직 직접 작성 금지 — `model/` 또는 `lib/`에서 import
