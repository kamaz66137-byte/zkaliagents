#!/usr/bin/env bash
# validate.sh — Z-Kali repository compliance validator
# Checks all agent, instruction, skill, hook, workflow, and plugin files
# for required front matter fields and naming conventions.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$(cd "$(dirname "$0")/../../.." && pwd)")"
ERRORS=0

red()   { printf '\033[0;31m%s\033[0m\n' "$*"; }
green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
warn()  { printf '\033[0;33m%s\033[0m\n' "$*"; }

has_frontmatter_field() {
  local file="$1"
  local field="$2"
  awk '/^---/{f=!f; next} f && /^'"$field"':/' "$file" | grep -q .
}

# ── Agent files ──────────────────────────────────────────────────────────────
while IFS= read -r -d '' file; do
  basename=$(basename "$file")
  if echo "$basename" | grep -qP '[A-Z ]'; then
    red "FAIL [naming] $file — must be lowercase with hyphens"
    ERRORS=$((ERRORS + 1))
  fi
  for field in description; do
    if ! has_frontmatter_field "$file" "$field"; then
      red "FAIL [agent] $file — missing front matter field: $field"
      ERRORS=$((ERRORS + 1))
    fi
  done
done < <(find "$REPO_ROOT/.github/agents" -name '*.agent.md' -print0 2>/dev/null)

# ── Instruction files ─────────────────────────────────────────────────────────
while IFS= read -r -d '' file; do
  basename=$(basename "$file")
  if echo "$basename" | grep -qP '[A-Z ]'; then
    red "FAIL [naming] $file — must be lowercase with hyphens"
    ERRORS=$((ERRORS + 1))
  fi
  for field in description applyTo; do
    if ! has_frontmatter_field "$file" "$field"; then
      red "FAIL [instruction] $file — missing front matter field: $field"
      ERRORS=$((ERRORS + 1))
    fi
  done
done < <(find "$REPO_ROOT/.github/instructions" -name '*.instructions.md' -print0 2>/dev/null)

# ── Skill SKILL.md files ──────────────────────────────────────────────────────
while IFS= read -r -d '' file; do
  dir=$(basename "$(dirname "$file")")
  if echo "$dir" | grep -qP '[A-Z ]'; then
    red "FAIL [naming] $file — folder must be lowercase with hyphens"
    ERRORS=$((ERRORS + 1))
  fi
  for field in name description; do
    if ! has_frontmatter_field "$file" "$field"; then
      red "FAIL [skill] $file — missing front matter field: $field"
      ERRORS=$((ERRORS + 1))
    fi
  done
  # Verify name matches folder name
  skill_name=$(awk '/^---/{f=!f; next} f && /^name:/{print $2}' "$file" | tr -d "'" | xargs)
  if [ -n "$skill_name" ] && [ "$skill_name" != "$dir" ]; then
    red "FAIL [skill] $file — name '$skill_name' does not match folder '$dir'"
    ERRORS=$((ERRORS + 1))
  fi
done < <(find "$REPO_ROOT/.github/skills" -name 'SKILL.md' -print0 2>/dev/null)

# ── Hook README.md files ──────────────────────────────────────────────────────
while IFS= read -r -d '' file; do
  dir=$(basename "$(dirname "$file")")
  hook_dir=$(dirname "$file")
  if echo "$dir" | grep -qP '[A-Z ]'; then
    red "FAIL [naming] $file — folder must be lowercase with hyphens"
    ERRORS=$((ERRORS + 1))
  fi
  for field in name description; do
    if ! has_frontmatter_field "$file" "$field"; then
      red "FAIL [hook] $file — missing front matter field: $field"
      ERRORS=$((ERRORS + 1))
    fi
  done
  if [ ! -f "$hook_dir/hooks.json" ]; then
    red "FAIL [hook] $hook_dir — missing hooks.json"
    ERRORS=$((ERRORS + 1))
  fi
done < <(find "$REPO_ROOT/.github/hooks" -name 'README.md' -print0 2>/dev/null)

# ── Workflow *.md files ───────────────────────────────────────────────────────
while IFS= read -r -d '' file; do
  basename=$(basename "$file")
  if echo "$basename" | grep -qP '[A-Z ]'; then
    red "FAIL [naming] $file — must be lowercase with hyphens"
    ERRORS=$((ERRORS + 1))
  fi
  for field in name description; do
    if ! has_frontmatter_field "$file" "$field"; then
      red "FAIL [workflow] $file — missing front matter field: $field"
      ERRORS=$((ERRORS + 1))
    fi
  done
done < <(find "$REPO_ROOT/.github/workflows" -name '*.md' -print0 2>/dev/null)

# ── plugin.json files ─────────────────────────────────────────────────────────
while IFS= read -r -d '' file; do
  dir=$(basename "$(dirname "$file")")
  if echo "$dir" | grep -qP '[A-Z ]'; then
    red "FAIL [naming] $file — folder must be lowercase with hyphens"
    ERRORS=$((ERRORS + 1))
  fi
  if ! python3 -m json.tool "$file" > /dev/null 2>&1; then
    red "FAIL [plugin] $file — invalid JSON"
    ERRORS=$((ERRORS + 1))
    continue
  fi
  for field in name description version; do
    if ! python3 -c "import json,sys; d=json.load(open('$file')); sys.exit(0 if '$field' in d and d['$field'] else 1)" 2>/dev/null; then
      red "FAIL [plugin] $file — missing or empty field: $field"
      ERRORS=$((ERRORS + 1))
    fi
  done
  plugin_name=$(python3 -c "import json; print(json.load(open('$file')).get('name',''))" 2>/dev/null || echo "")
  if [ -n "$plugin_name" ] && [ "$plugin_name" != "$dir" ]; then
    red "FAIL [plugin] $file — name '$plugin_name' does not match folder '$dir'"
    ERRORS=$((ERRORS + 1))
  fi
done < <(find "$REPO_ROOT" -maxdepth 2 -name 'plugin.json' -not -path '*/.git/*' -print0 2>/dev/null)

# ── Summary ───────────────────────────────────────────────────────────────────
if [ "$ERRORS" -eq 0 ]; then
  green "All validation checks passed."
  exit 0
else
  red "$ERRORS validation error(s) found."
  exit 1
fi
