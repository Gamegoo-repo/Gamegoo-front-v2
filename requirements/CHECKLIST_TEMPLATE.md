---
id: REQ-000
title: 요구사항 제목
mode: feature | refactor
validated: YYYY-MM-DD
---

## Checklist

| #   | 요구사항      | 구현 위치                                                                     | 상태  |
| --- | ------------- | ----------------------------------------------------------------------------- | ----- |
| 1   | 요구사항 설명 | `src/{layer}/{slice}/{file}.tsx` — 함수명/Tailwind 클래스 등 특정 가능한 정보 | ✅/❌ |
| 2   |               |                                                                               |       |

> `구현 위치` 작성 가이드:
>
> - 컴포넌트: `path/Component.tsx — <Element prop=... />`
> - 훅: `path/useXxx.ts — useXxx`
> - 상수: `path/constants.ts — CONSTANT_NAME`
> - 클래스: `path/Component.tsx — Tailwind: "px-4 gap-2"`
> - 미충족(❌): 사유와 후속 작업 필요 여부 명시

## (refactor 모드 추가 항목)

- [ ] Migration Map의 모든 행이 적용되었는가
- [ ] 영향 받는 import 사이트가 모두 갱신되었는가
- [ ] 동작 동일성 확인 — 수동 스모크 / 라우트 진입 / 기존 테스트 결과
