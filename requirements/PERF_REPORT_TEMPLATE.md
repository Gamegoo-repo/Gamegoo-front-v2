---
id: REQ-000-perf-report
parent: REQ-000
title: 성능 측정 리포트 제목
measured: YYYY-MM-DD
---

## 측정 환경

- 브라우저: (Chrome XXX / Edge XXX / Safari XXX)
- OS: (macOS XX / Windows XX)
- 화면 해상도:
- viewport: (모바일/태블릿/데스크탑 — 매칭 서비스는 모바일 비중이 높으므로 명시)
- React StrictMode: ON / OFF (개발 모드 영향 기록)
- DevTools: 열림 / 닫힘 (Long Task 측정 시 열어둬야 함)
- 백그라운드 탭/확장: OFF
- 네트워크: (Wi-Fi / Fast 3G throttle 등)

## 시나리오 실행 방법

1. `pnpm dev` (또는 `pnpm preview`)
2. 측정 페이지 진입 경로:
3. 트리거 동작:
4. 데이터 수집 도구: (Performance 패널 / `performance.now()` / 커스텀 logger)

## 측정 단계

### 1차 측정 — 변경 전 (baseline)

| 시나리오 | 지표 | 값 |
|---------|------|----|
| {시나리오} | LongTask (5+ms) 개수 | |
| | TBT (Total Blocking Time) | |
| | LCP | |
| | INP / FID | |
| | 메모리 (heap MB) | |

### 2차 측정 — 변경 후 (after fix)

| 시나리오 | 지표 | 값 | 변동 |
|---------|------|----|----|
| | | | ↓ x% / ↑ x% |

## 결론

- 핵심 변화: (어떤 변경이 가장 큰 효과를 냈는지)
- 채택 결정: (베스트 전략 / fallback)
- 부작용: (메모리·번들 사이즈 트레이드오프 등)

## Action Items

- [ ] 후속 측정 또는 추적이 필요한 항목

## 첨부

- Performance 패널 스크린샷 / Chrome trace JSON
- 측정 raw 데이터 (가능하면 inline 표 또는 별도 .json 첨부)
