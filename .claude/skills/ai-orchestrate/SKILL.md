---
name: ai-orchestrate
description: 'Phase 2: 계획을 실행하여 정통 FSD 규칙에 맞게 코드를 작성/이전한다'
---

# Phase 2: Orchestrate

## 프로젝트 컨텍스트

### FSD 규칙

!`cat CLAUDE.md`

### 현재 파일 구조

!`find src -type f \( -name '*.ts' -o -name '*.tsx' \) -not -path '*/@generated/*' | sort`

### TypeScript 설정

!`cat tsconfig.json`

### 빌드 설정

!`cat rsbuild.config.ts`

## 지시사항

대화 컨텍스트에 있는 Phase 1 계획을 기반으로 코드를 작성/이전하라. $ARGUMENTS

### 공통 실행 규칙

1. **의존 순서 준수**: shared → entities → features → widgets → pages 순으로 작업
2. **세그먼트 생성**: 각 slice에 필요한 세그먼트 디렉토리 생성 (`model/`, `api/`, `ui/`, `lib/`)
3. **barrel export 업데이트**: slice 생성/변경 후 해당 slice의 `index.ts`에 re-export 추가
4. **path alias 사용**: 크로스 레이어 import는 `@/<layer>/...` 형태
5. **상향 import 금지**: 절대로 상위 레이어를 import하지 않음 — PreToolUse hook이 차단
6. **cross-slice 금지**: 같은 레이어의 다른 slice를 직접 import하지 않음
7. **타입 명시**: `any` 대신 명시적 타입 사용. 필요 시 `model/types.ts`에 정의

### 구현 모드(`mode: feature`)에서

- 신규 파일은 정통 FSD 위치에만 생성
- 기존 비표준 위치(`entities/*/config/`, `shared/hooks/`, `shared/providers/`, `shared/model/`)에 새 코드 추가 금지
- 컴포넌트 파일은 PascalCase + named export로 작성
- 인접 비표준 코드를 만나면 **plan에 명시된 범위 내에서만** 가벼운 정리, 본질적 리팩토링은 별도 REQ로 분리

### 리팩토링 모드(`mode: refactor`)에서

- plan의 "Migration Map" 표를 그대로 따라 이동·rename·segment 변경 수행
- import 갱신은 한 PR 안에서 끝낸다 (대상 파일 + import 사이트 모두 갱신)
- 이동 시 파일 내용 변경은 정통 컨벤션 적용에 한정 (default→named export, PascalCase rename, segment에 맞는 폴더 이동)
- 도메인 동작 변경 금지 — 이름·위치만 변경
- 각 매핑 단위로 작업하고, 단위마다 빌드/타입체크 green 유지
- 작업 진행 중 `.claude/rules/refactor-checklist.md`의 6개 점검 항목(FSD / 가독성 / 명확한 함수 / 모듈화 / 성능 / 결정 기준)을 항상 확인. 위반 발견 시 같은 매핑 단위 안에서 즉시 수정하거나, 범위를 넘으면 retrospect의 Action Items로 기록

### 작업 완료 보고

각 계획 항목 완료 시 아래 형식으로 보고:

```
✅ [layer] 작업 설명
   - 생성/수정 파일: path/to/file.ts
   - export 추가: ModuleName
   - (refactor) Old: src/.../old.ts → New: src/.../New.ts (import 사이트 N곳 갱신)
```

모든 항목 완료 후 전체 요약 출력. Phase 3(`ai-validate`)로 진행 여부를 사용자에게 확인.
