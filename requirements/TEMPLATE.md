---
id: REQ-000
title: 요구사항 제목
priority: high | medium | low
mode: feature | refactor
labels:
  [기능 정의, UI 정의, API 연동, 리팩토링, 성능, 인증, 채팅, 매칭, 게시판, 매너, 알림, lol-bti]
created: YYYY-MM-DD
---

## Summary

한 줄 요약.

## Background

왜 이 기능/리팩토링이 필요한지, 어떤 문제를 해결하는지. (관련 GitHub issue·PR이 있으면 링크)

## Requirements

- 구체적인 요구사항 1
- 구체적인 요구사항 2

> **레이아웃 수치 권장**: UI 정의 스펙의 경우, 여백(padding/margin)·간격(gap)·모달 크기·heading 레벨 등 구현에 필요한 수치를 가능한 한 명시한다. 미명시 시 구현자가 Tailwind 표준 스케일 관례값으로 채우며, 디자인 실측 대조가 후속으로 필요해진다.

> **상수 키워드**: 본문에 `"별도로 설정값으로 관리"`, `"관리 포인트"`, `"상수로 관리"` 같은 키워드가 있으면 해당 값은 반드시 상수로 추출된다 (`.claude/rules/constants-convention.md`).

## Acceptance Criteria

- [ ] 수용 기준 1
- [ ] 수용 기준 2

## (refactor 모드 한정) Migration Map

`mode: refactor`인 경우 이전 매핑 표를 작성한다. 구현 모드면 이 섹션은 삭제.

| 현재 경로                            | 목표 경로                           | 변경 종류           |
| ------------------------------------ | ----------------------------------- | ------------------- |
| src/entities/{slice}/config/types.ts | src/entities/{slice}/model/types.ts | move + segment 변경 |

## Notes

참고 사항, 제약 조건, 디자인 링크, 영향 받는 슬라이스 목록 등.

## Changelog

`specs/in-progress/` 또는 `specs/done/`에서 본문이 변경된 경우에만 기록 (`to-do`에선 불필요). 자세한 형식은 `.claude/rules/requirements-management.md` 참조.

```markdown
- **YYYY-MM-DD**: 변경 요약 한 줄
  - 사유: 왜 바뀌었는지
  - 연관 커밋: `{단축 해시}`
  - 영향: 변경된 파일 경로 또는 재검증 필요 영역
```
