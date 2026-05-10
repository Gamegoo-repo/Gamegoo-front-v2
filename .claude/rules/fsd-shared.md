---
globs: src/shared/**
---

# shared 레이어 (Layer 0 — 최하위)

## 허용 Import

- 외부 npm 패키지만 import 가능
- `@/entities`, `@/features`, `@/widgets` import 절대 금지

## 구조

shared는 slice가 아닌 flat segment 구조:
```
shared/
├── api/      # HTTP 클라이언트, 요청 헬퍼, 인터셉터
├── config/   # 상수, 환경 설정값
├── lib/      # 유틸리티 함수, 외부 라이브러리 래퍼
├── types/    # 공통 TypeScript 인터페이스, 타입
├── ui/       # 원자적 UI 컴포넌트 (버튼, 인풋 등)
└── index.ts  # 전체 barrel export
```

## 원칙

- 도메인 무관한 코드만 위치 (LoL·매칭·게시판·채팅 도메인 로직은 entities에)
- 다른 모든 레이어가 의존하므로 export 안정성 유지
- 변경 시 영향 범위가 가장 넓음에 주의
