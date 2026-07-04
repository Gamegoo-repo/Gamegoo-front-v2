---
globs: src/features/**
---

# features 레이어 (Layer 2)

## 허용 Import

- `@/shared/*` — 허용
- `@/entities/*` — 허용
- `@/features/*` (다른 slice) — 금지 (cross-slice)
- `@/widgets/*` — 금지 (상위 레이어)

## 구조

slice 단위로 조직:

```
features/{feature-name}/
├── model/    # 기능 상태, 액션 로직
├── api/      # 기능 전용 API 호출 (mutation 등)
├── ui/       # 인터랙티브 컴포넌트 (이벤트 핸들러 포함)
├── lib/      # 기능 내부 헬퍼
└── index.ts  # slice barrel export
```

## 원칙

- 하나의 완결된 사용자 인터랙션을 표현 (sign-up, send-message, post-create, manner-evaluate, friend-add 등)
- entities의 표시 컴포넌트에 인터랙션을 추가하는 역할
- feature 간 공통 로직은 shared 또는 entities로 내릴 것
