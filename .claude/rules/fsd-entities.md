---
globs: src/entities/**
---

# entities 레이어 (Layer 1)

## 허용 Import

- `@/shared/*` — 허용
- `@/entities/*` (다른 slice) — 금지 (cross-slice)
- `@/features/*`, `@/widgets/*` — 금지 (상위 레이어)

## 구조

slice 단위로 조직:

```
entities/{entity-name}/
├── model/    # 타입 정의, Zod 스키마, Zustand store
├── api/      # 엔티티 CRUD API 호출
├── ui/       # 표시 전용 컴포넌트 (사용자 인터랙션 로직 없음)
├── lib/      # 엔티티 전용 헬퍼 함수
└── index.ts  # slice barrel export
```

## 원칙

- Gamegoo 도메인의 비즈니스 엔티티를 표현 (user, chat, post, game, lol-bti, auth, term, notification, manner 등)
- ui/ 컴포넌트는 순수 표시용 — 이벤트 핸들러, 상태 변경 로직은 features에
- 엔티티 간 공통 로직이 필요하면 shared로 올릴 것
