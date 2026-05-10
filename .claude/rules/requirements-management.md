# 요구사항 관리 규칙

## 디렉토리 구조

```
requirements/
├── specs/
│   ├── to-do/          # 작업 대기
│   ├── in-progress/    # 현재 구현 중
│   └── done/           # 구현 완료
└── reports/
    ├── checklists/     # 검증 체크리스트 (validate 단계)
    └── retrospects/    # 회고 보고서 (retrospect 단계)
```

- 요구사항 원본: `specs/REQ-{번호}.md` (to-do → in-progress → done 이동)
- 체크리스트/회고: `reports/{checklists|retrospects}/REQ-{번호}.md` (이동 없음)

## 요구사항 파일 Frontmatter

```yaml
---
id: REQ-{번호}              # 필수. 파일명과 일치
title: {간결한 제목}         # 필수
priority: high|medium|low   # 필수
labels: [라벨1, 라벨2]       # 선택
created: YYYY-MM-DD         # 필수. 최초 작성일
revised: YYYY-MM-DD         # 선택. 변경 발생 시에만 기록/갱신
mode: feature|refactor      # 필수. 구현 모드 vs 리팩토링 모드
---
```

- `created`는 최초 1회만 기록하고 불변
- `revised`는 `Changelog` 항목이 추가될 때 함께 갱신 (최신 변경일)
- 오타·포맷 수정 등 경미한 변경은 `revised` 갱신 불필요
- `mode: feature` — 새 기능 구현 (구현 모드). 신규 코드는 정통 FSD를 따른다.
- `mode: refactor` — 기존 코드를 정통 FSD로 이전 (리팩토링 모드). plan에서 이전 매핑이 명시된다.

## 요구사항 변경 이력 관리

### 본문 작성 원칙

요구사항 본문은 **항상 현 구현 기준 최신 상태**만 유지한다.

- 취소선(`~~...~~`)을 본문에 남기지 않는다
- HTML 주석으로 삭제된 요구를 기록하지 않는다
- 이력은 파일 하단 `## Changelog` 섹션에 집약한다

### Changelog 섹션

**적용 시점**: `specs/in-progress/` 또는 `specs/done/` 상태에서 요구사항이 변경될 때. `specs/to-do/` 상태의 수정은 Changelog 불요.

**기록 대상**:
- 요구 항목 추가/제거/수치 변경
- 요구 해석에 영향을 주는 문구 교체
- 우선순위/범위 재조정

**기록 불필요**:
- 오타·띄어쓰기·포맷(줄바꿈, 리스트 기호) 정리
- 라벨만 교정

### 항목 구성 (3요소 필수)

```markdown
## Changelog

- **YYYY-MM-DD**: {변경 요약 한 줄}
  - 사유: {왜 바뀌었는지 — 결정 맥락이 드러나도록}
  - 연관 커밋: `{단축 해시1}`, `{단축 해시2}`
  - 영향: {변경된 파일 경로 또는 재검증 필요 영역}
```

- 최신 항목이 **위에 위치**
- 여러 커밋이 연관되면 `,`로 나열
- 원문 문구를 보고 싶을 때는 git log로 해당 커밋을 조회하거나, 사유에 인용문 삽입

## 회고 보고서와의 교차 참조

중대한 변경이 Changelog에 기록되는 경우, 해당 REQ의 `reports/retrospects/REQ-{번호}.md`에도 회차 회고(`## Retrospective Report — YYYY-MM-DD #N`)로 반영한다.

- Changelog: 요구사항 자체의 **사실 기록** (무엇이 바뀌었나)
- Retrospect: 구현 팀의 **학습 기록** (왜 그렇게 결정했고 다음엔 어떻게 할 건가)

둘은 중복이 아니라 상호 보완 관계다.

## 체크리스트와의 동기화

요구사항 변경 시 `reports/checklists/REQ-{번호}.md`의 관련 항목도 함께 갱신한다.

- 삭제된 요구 항목: 체크리스트에서도 제거하거나, 구현 위치 필드를 변경 사유로 교체
- 추가된 요구 항목: 체크리스트에 신규 행 추가
- 수치 변경: 해당 행의 구현 위치/값 업데이트

## 파이프라인 단계별 연동

| 단계 | 요구사항 파일 처리 |
|------|------------------|
| `ai-plan` | to-do → in-progress 이동 제안. `mode`(feature/refactor) 결정 |
| `ai-orchestrate` | 본문 변경 발생 시 Changelog 초안 준비 |
| `ai-validate` | 체크리스트 생성/갱신 (변경 항목 동기화 포함) |
| `ai-deliver` | 요구사항 본문·Changelog·`revised` 필드 정합성 확인 후 커밋 |
| `ai-retrospect` | 중대 변경 발생 시 회차 회고에 반영 |

## 금지 사항

- ❌ 본문에 `~~취소선~~` 남기기
- ❌ HTML 주석으로 "삭제됨" 표시
- ❌ 요구사항 파일에 구현 세부 코드 삽입 (해당 내용은 체크리스트/회고로)
- ❌ Changelog 항목에 사유 누락 (결정 맥락이 없으면 추후 판단 불가)
- ❌ `created` 필드 수정 (최초 작성일은 불변)
