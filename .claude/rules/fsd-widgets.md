---
globs: src/widgets/**
---

# widgets 레이어 (Layer 3)

## 허용 Import

- `@/shared/*` — 허용
- `@/entities/*` — 허용
- `@/features/*` — 허용
- `@/widgets/*` (다른 slice) — 금지 (cross-slice)

## 구조

slice 단위로 조직:
```
widgets/{widget-name}/
├── ui/       # 복합 컴포넌트 (entities + features 조합)
├── model/    # 위젯 수준 상태 (필요시)
├── lib/      # 조합 로직
└── index.ts  # slice barrel export
```

## 원칙

- 여러 entities와 features를 조합한 복합 UI 블록 (header, board-view, floating-chat-dialog, match, user-info 등)
- 외부 소비자(pages 등)가 주로 import하는 최종 컴포넌트
- 비즈니스 로직을 직접 포함하지 않음 — features와 entities를 조합만 수행
- widget 간 공통 로직은 features 이하 레이어로 내릴 것
