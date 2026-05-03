---
name: z-kali-analyzer
description: 'Analyzes z-kali plugin files for compliance with front matter requirements, naming conventions, and plugin structure rules. Validates agents, instructions, skills, hooks, and workflows.'
---

# Z-Kali Analyzer Skill

This skill validates z-kali plugin repository files against the specification defined in AGENTS.md.

## What This Skill Does

- Scans `.agent.md` files for required front matter fields (`name`, `description`, `model`)
- Scans `.instructions.md` files for required front matter fields (`description`, `applyTo`)
- Validates `SKILL.md` files in `skills/*/` folders
- Validates `README.md` and `hooks.json` files in `hooks/*/` folders
- Validates `*.md` files in `workflows/` folder
- Checks `plugin.json` files for `name`, `description`, and `version` fields
- Reports non-compliant files with actionable fix suggestions

## Bound Resources

- [`validate.sh`](validate.sh) — shell script that runs all validation checks

## Usage

Run validation on the entire repository:

```bash
bash .github/skills/z-kali-analyzer/validate.sh
```

The script exits with code `0` if all files pass validation, or `1` if any violations are found.
