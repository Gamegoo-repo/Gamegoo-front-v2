#!/usr/bin/env bash
# FSD Layer Dependency Check Hook (Gamegoo)
# PreToolUse hook for Edit/Write — blocks upward layer imports and cross-slice imports.
# Exit 0 = pass, Exit 2 = violation (blocks tool execution)
#
# Layer hierarchy (lower number = lower layer; only downward imports allowed):
#   shared(0) → entities(1) → features(2) → widgets(3) → pages(4)

set -euo pipefail

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only check files inside src/ of this project
if [[ "$FILE_PATH" != *"/src/"* ]]; then
  exit 0
fi

# Skip generated code
if [[ "$FILE_PATH" == *"/@generated/"* ]] || [[ "$FILE_PATH" == *"/routeTree.gen.ts" ]]; then
  exit 0
fi

# Only TS/TSX
if [[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
  exit 0
fi

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // .tool_input.content // empty')
if [ -z "$CONTENT" ]; then
  exit 0
fi

RELATIVE_PATH="${FILE_PATH##*/src/}"
CURRENT_LAYER=""
CURRENT_LAYER_NUM=-1
CURRENT_SLICE=""

if [[ "$RELATIVE_PATH" == shared/* ]]; then
  CURRENT_LAYER="shared"
  CURRENT_LAYER_NUM=0
elif [[ "$RELATIVE_PATH" == entities/* ]]; then
  CURRENT_LAYER="entities"
  CURRENT_LAYER_NUM=1
  CURRENT_SLICE=$(echo "$RELATIVE_PATH" | cut -d'/' -f2)
elif [[ "$RELATIVE_PATH" == features/* ]]; then
  CURRENT_LAYER="features"
  CURRENT_LAYER_NUM=2
  CURRENT_SLICE=$(echo "$RELATIVE_PATH" | cut -d'/' -f2)
elif [[ "$RELATIVE_PATH" == widgets/* ]]; then
  CURRENT_LAYER="widgets"
  CURRENT_LAYER_NUM=3
  CURRENT_SLICE=$(echo "$RELATIVE_PATH" | cut -d'/' -f2)
elif [[ "$RELATIVE_PATH" == pages/* ]] || [[ "$RELATIVE_PATH" == app/* ]]; then
  # pages and app may import from any lower layer; no slice scoping
  CURRENT_LAYER="pages"
  CURRENT_LAYER_NUM=4
else
  # Root-level files (index.tsx, env.d.ts) — skip
  exit 0
fi

VIOLATIONS=""

while IFS= read -r line; do
  if [[ "$line" =~ from[[:space:]]+[\'\"](@/|\.\./) ]]; then
    IMPORT_PATH=$(echo "$line" | sed -E "s/.*from[[:space:]]+['\"]([^'\"]+)['\"].*/\1/")

    TARGET_LAYER=""
    TARGET_LAYER_NUM=-1
    TARGET_SLICE=""

    # @ alias imports
    if [[ "$IMPORT_PATH" == @/shared* ]]; then
      TARGET_LAYER="shared"
      TARGET_LAYER_NUM=0
    elif [[ "$IMPORT_PATH" == @/entities* ]]; then
      TARGET_LAYER="entities"
      TARGET_LAYER_NUM=1
      TARGET_SLICE=$(echo "$IMPORT_PATH" | sed -E 's|@/entities/([^/]+).*|\1|')
    elif [[ "$IMPORT_PATH" == @/features* ]]; then
      TARGET_LAYER="features"
      TARGET_LAYER_NUM=2
      TARGET_SLICE=$(echo "$IMPORT_PATH" | sed -E 's|@/features/([^/]+).*|\1|')
    elif [[ "$IMPORT_PATH" == @/widgets* ]]; then
      TARGET_LAYER="widgets"
      TARGET_LAYER_NUM=3
      TARGET_SLICE=$(echo "$IMPORT_PATH" | sed -E 's|@/widgets/([^/]+).*|\1|')
    elif [[ "$IMPORT_PATH" == @/pages* ]] || [[ "$IMPORT_PATH" == @/app* ]]; then
      TARGET_LAYER="pages"
      TARGET_LAYER_NUM=4
    # Relative imports crossing into other layers — flag as style violation
    elif [[ "$IMPORT_PATH" == *"../shared"* ]]; then
      TARGET_LAYER="shared"
      TARGET_LAYER_NUM=0
    elif [[ "$IMPORT_PATH" == *"../entities"* ]]; then
      TARGET_LAYER="entities"
      TARGET_LAYER_NUM=1
    elif [[ "$IMPORT_PATH" == *"../features"* ]]; then
      TARGET_LAYER="features"
      TARGET_LAYER_NUM=2
    elif [[ "$IMPORT_PATH" == *"../widgets"* ]]; then
      TARGET_LAYER="widgets"
      TARGET_LAYER_NUM=3
    elif [[ "$IMPORT_PATH" == *"../pages"* ]] || [[ "$IMPORT_PATH" == *"../app"* ]]; then
      TARGET_LAYER="pages"
      TARGET_LAYER_NUM=4
    fi

    if [ -z "$TARGET_LAYER" ]; then
      continue
    fi

    # Upward dependency violation
    if [ "$TARGET_LAYER_NUM" -gt "$CURRENT_LAYER_NUM" ]; then
      VIOLATIONS="${VIOLATIONS}\n  ✗ imports '${IMPORT_PATH}' → ${CURRENT_LAYER}(${CURRENT_LAYER_NUM}) cannot import from ${TARGET_LAYER}(${TARGET_LAYER_NUM})"
    fi

    # Cross-slice violation (same layer, different slice) — only meaningful for entities/features/widgets
    if [ "$TARGET_LAYER" = "$CURRENT_LAYER" ] && [ -n "$CURRENT_SLICE" ] && [ -n "$TARGET_SLICE" ] && [ "$CURRENT_SLICE" != "$TARGET_SLICE" ]; then
      VIOLATIONS="${VIOLATIONS}\n  ✗ imports '${IMPORT_PATH}' → cross-slice import within ${CURRENT_LAYER}/ (${CURRENT_SLICE} → ${TARGET_SLICE})"
    fi

    # Cross-layer relative-path style violation
    if [[ "$IMPORT_PATH" == *"../"* ]] && [ -n "$TARGET_LAYER" ] && [ "$TARGET_LAYER" != "$CURRENT_LAYER" ]; then
      VIOLATIONS="${VIOLATIONS}\n  ✗ relative import '${IMPORT_PATH}' crosses layers — use '@/${TARGET_LAYER}/...' alias instead"
    fi
  fi
done <<< "$CONTENT"

if [ -n "$VIOLATIONS" ]; then
  echo -e "FSD VIOLATION in src/${RELATIVE_PATH}:${VIOLATIONS}" >&2
  echo -e "\nAllowed dependency direction: pages(4) → widgets(3) → features(2) → entities(1) → shared(0)" >&2
  echo -e "Cross-slice imports within the same layer are NOT allowed.\n" >&2
  exit 2
fi

exit 0
