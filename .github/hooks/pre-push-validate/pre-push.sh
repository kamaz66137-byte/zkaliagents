#!/usr/bin/env bash
# pre-push.sh — Pre-push validation hook for z-kali plugin repository
# Delegates to the z-kali-analyzer skill's validate script.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$(cd "$(dirname "$0")/../../.." && pwd)")"
VALIDATE="$REPO_ROOT/.github/skills/z-kali-analyzer/validate.sh"

if [ -f "$VALIDATE" ]; then
  bash "$VALIDATE"
else
  echo "Warning: validate.sh not found at $VALIDATE" >&2
  exit 0
fi
