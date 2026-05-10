#!/usr/bin/env bash
# REQ Detection Hook (Gamegoo)
# PostToolUse hook for Write — REQ md 파일이 requirements/specs/{to-do,in-progress}에
# 작성되면 ai-plan 스킬 실행을 권유하는 system-reminder를 출력한다.
# Exit 0 = 정상.

set -euo pipefail

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
if [ "$TOOL_NAME" != "Write" ]; then
  exit 0
fi

FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# requirements/specs/{to-do|in-progress}/REQ-*.md 만 매칭
if [[ ! "$FILE_PATH" =~ /requirements/specs/(to-do|in-progress)/REQ-.+\.md$ ]]; then
  exit 0
fi

REQ_FILE=$(basename "$FILE_PATH")
REQ_NAME="${REQ_FILE%.md}"

# 디렉토리 추출 (to-do | in-progress)
if [[ "$FILE_PATH" =~ /requirements/specs/(to-do)/ ]]; then
  DIR_HINT="to-do 상태이므로 ai-plan에서 in-progress로 이동 제안을 받게 됩니다."
else
  DIR_HINT="in-progress 상태이므로 ai-plan이 즉시 분석을 시작합니다."
fi

cat <<EOF
<system-reminder>
요구사항 파일이 작성/수정되었습니다: ${FILE_PATH}

다음 작업으로 ai-plan 스킬을 실행하여 ${REQ_NAME}의 분석·구현 계획을 작성하십시오.
- 단계별 진행: ai-plan ${REQ_FILE}
- 5단계 한 번에: ai-pipeline ${REQ_FILE}

${DIR_HINT}

(이 메시지는 .claude/hooks/req-detect.sh가 자동 출력했습니다. ai-plan 시작이 부적절하다고 판단되면 사용자에게 의도를 한 번 확인한 뒤 진행 여부를 결정하십시오.)
</system-reminder>
EOF

exit 0
