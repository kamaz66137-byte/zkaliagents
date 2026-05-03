---
name: 'Pre-Push Validate'
description: 'Validates all agent, instruction, skill, hook, and workflow Markdown files for correct front matter and naming conventions before code is pushed to the remote repository.'
tags:
  - validation
  - pre-push
  - front-matter
---

# Pre-Push Validate Hook

This hook runs automatically before every `git push` and validates that all z-kali plugin files comply with the front matter requirements and naming conventions defined in [AGENTS.md](../../../AGENTS.md).

## What Gets Validated

- **Agent files** (`*.agent.md`) — checks for `description` field
- **Instruction files** (`*.instructions.md`) — checks for `description` and `applyTo` fields
- **Skill files** (`skills/*/SKILL.md`) — checks for `name` and `description` fields; verifies name matches folder
- **Hook README files** (`hooks/*/README.md`) — checks for `name` and `description` fields; verifies `hooks.json` exists
- **Workflow files** (`workflows/*.md`) — checks for `name` and `description` fields
- **Plugin files** (`plugin.json`) — checks for `name`, `description`, and `version` fields

## Bound Resources

- [`pre-push.sh`](pre-push.sh) — the validation script executed by the hook

## Behavior

- Exits `0` (push proceeds) when all files pass validation
- Exits `1` (push is blocked) when any validation errors are found, printing a list of issues

## Manual Run

```bash
bash .github/hooks/pre-push-validate/pre-push.sh
```
