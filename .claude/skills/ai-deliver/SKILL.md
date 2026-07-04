---
name: ai-deliver
description: 'Phase 4: barrel export 정리, 문서 업데이트, 커밋 준비를 수행한다'
---

# Phase 4: Deliver

## 현재 상태

### package.json

!`cat package.json`

### 변경된 파일

!`git diff --stat`

### 새로 추가된 파일

!`git status --porcelain`

## 지시사항

아래 항목을 순차적으로 수행하라.

### 1. Export 검증

- 새로 생성된 slice가 슬라이스 `index.ts`에 re-export되었는지 확인
- 새 slice가 외부에서 사용된다면 슬라이스 barrel(`src/{layer}/{slice}/index.ts`) 정합성 확인
- generated 모듈 직접 참조 없는지 확인 (`@/shared/api`만 사용)

### 2. 문서 업데이트

- `CLAUDE.md`의 아키텍처 설명이 현재 구조와 일치하는지 확인
- 변경이 필요하면 업데이트 (단, 자명한 변경에 한해 — 큰 정책 변경은 별도 REQ로)

### 3. Changelog 생성

변경 내역을 요약:

```
## Changes

### Added
- 추가된 항목

### Modified
- 수정된 항목

### (refactor) Migrated
- {old path} → {new path}

### Dependencies
- 추가/변경된 의존성
```

### 4. Git 스테이징

- 관련 파일만 선별적으로 `git add`
- `.env`, 자격 증명 파일 등 민감 파일 제외
- `src/shared/api/@generated/`, `src/shared/lib/@generated/routeTree.gen.ts`는 변경 시 함께 커밋 (스펙/플러그인 자동 갱신분)

### 5. 커밋 메시지 제안

Conventional Commits 형식으로 제안:

```
feat: [간결한 설명]

[상세 설명 — 무엇을 왜 변경했는지]
```

타입 가이드:

- `feat:` 새 기능 (구현 모드)
- `refactor:` 동작 변경 없는 구조 이전 (리팩토링 모드)
- `fix:` 버그 수정
- `chore:` 빌드/설정/도구 변경
- `docs:` 문서 변경

**주의**: 커밋을 직접 수행하지 않는다. 사용자에게 제안만 한다.
