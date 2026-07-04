---
globs: src/**/*.tsx
---

# className 작성 규칙

JSX `className`을 템플릿 리터럴로 조합할 때 자주 발생하는 두 가지 함정과 권장 패턴을 정의한다.

## 함정 1 — `${cond && 'classes'}`는 `'false'` 문자열을 주입한다

`{}` 표현식 안에서 boolean을 렌더링하면 React가 무시하지만, **템플릿 리터럴(`` ` ` ``) 안의 `${}`는 단순 문자열 보간**이다. `cond`가 `false`이면 `Boolean.prototype.toString()`이 호출되어 `'false'`라는 단어가 className에 그대로 들어간다.

```tsx
// ❌ Bad — cond=false 시 className에 'false' 단어가 박힘
<div className={`${cond && "flex h-screen"}`} />
// 결과: <div class="false">

// ❌ Bad — Tailwind 클래스 사이에도 'false' 단어가 끼어들 수 있음
<div className={`px-4 ${cond && "bg-blue-50"} py-2`} />
// cond=false → "px-4 false py-2"
```

```tsx
// ✅ Good — 삼항 + 빈 문자열 fallback
<div className={`${cond ? "flex h-screen" : ""}`} />

// ✅ Good — 짧은 표현은 단축 평가의 우항을 빈 문자열로
<div className={`px-4 ${cond ? "bg-blue-50" : ""} py-2`} />

// ✅ Best — cn 유틸 (clsx 기반, falsy 자동 무시)
import { cn } from "@/shared/lib/utils";
<div className={cn("px-4 py-2", cond && "bg-blue-50")} />
```

`{cond && <ReactNode>}` 패턴(자식 렌더링)과 헷갈리기 쉬우므로, **className 안에서는 항상 삼항 또는 `cn`**으로 작성한다고 기억할 것.

## 함정 2 — 항상 적용해야 할 클래스를 조건부 묶음 안에 넣지 말 것

`flex-1`, `h-full`처럼 **부모 영역을 채우거나 레이아웃 골격을 잡는 클래스**를 조건부 클래스 묶음에 함께 넣으면, 가드가 활성화될 때 같이 빠져 레이아웃이 무너진다.

```tsx
// ❌ Bad — gate가 false면 flex-1까지 같이 사라져 컨테이너가 자식 크기로 줄어듦
<div className={`${gate ? "flex-1 p-6" : ""}`} />

// ✅ Good — 항상 필요한 레이아웃 클래스는 조건부 밖으로
<div className={`flex-1 ${gate ? "p-6" : ""}`} />
```

판별 기준: 가드가 비활성일 때도 **자식이 부모 크기를 받아야 하는가?** 그렇다면 `flex-1`/`h-full`/`w-full`은 조건부 밖에 둔다.

## 권장 패턴 정리

1. **`cn` 유틸 우선** (`@/shared/lib/utils`) — falsy를 자동으로 무시하므로 가장 안전
2. 템플릿 리터럴을 쓸 거면 항상 **삼항 + 빈 문자열**: `${cond ? 'classes' : ''}`
3. **항상 필요한 클래스**(레이아웃 골격, base 스타일)는 조건부 밖에 고정
4. variant가 많으면 `class-variance-authority`(`cva`)로 캡슐화

## CVA 예 (variant가 많은 경우)

```ts
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);
```
