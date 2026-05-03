#!/usr/bin/env bash
# fix-line-endings.sh — Normalize all tracked text files to LF line endings.
# Run this before committing to ensure consistent line endings across platforms.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"

echo "Normalizing line endings to LF in $REPO_ROOT ..."

# Configure git to use LF for all text files
git -C "$REPO_ROOT" config core.autocrlf false
git -C "$REPO_ROOT" config core.eol lf

# Convert all tracked text files to LF
find "$REPO_ROOT" \
  -not -path '*/.git/*' \
  -type f \
  \( -name '*.md' -o -name '*.json' -o -name '*.js' -o -name '*.ts' \
     -o -name '*.sh' -o -name '*.yml' -o -name '*.yaml' -o -name '*.txt' \) \
  -print0 | while IFS= read -r -d '' file; do
    if file "$file" | grep -q CRLF 2>/dev/null || \
       python3 -c "import sys; data=open('$file','rb').read(); sys.exit(0 if b'\r\n' in data else 1)" 2>/dev/null; then
      python3 -c "
import sys
path = sys.argv[1]
with open(path, 'rb') as f:
    content = f.read()
content = content.replace(b'\r\n', b'\n').replace(b'\r', b'\n')
with open(path, 'wb') as f:
    f.write(content)
print('Fixed:', path)
" "$file"
    fi
  done

echo "Line ending normalization complete."
