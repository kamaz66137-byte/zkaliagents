---
description: 'Coding standards and best practices for z-kali plugin development, covering Markdown front matter, file naming conventions, and plugin structure requirements.'
applyTo: '**.md, **/*.agent.md, **/*.instructions.md'
---

# Z-Kali Coding Standards

## Markdown Front Matter

All Markdown files that define agents, instructions, skills, hooks, or workflows must include front matter with the required fields.

### Required Front Matter by File Type

**Agent files (`*.agent.md`):**
- `name` — human-readable name (e.g., `'Z-Kali'`)
- `description` — wrapped in single quotes, must not be empty
- `model` — strongly recommended (e.g., `claude-sonnet-4-5`)
- `tools` — recommended list of tools the agent can use

**Instruction files (`*.instructions.md`):**
- `description` — wrapped in single quotes, must not be empty
- `applyTo` — file pattern(s) the instruction applies to (e.g., `'**.js, **.ts'`)

**Skill files (`skills/*/SKILL.md`):**
- `name` — must match the folder name (lowercase, hyphen-separated, max 64 chars)
- `description` — wrapped in single quotes, 10–1024 characters

**Hook README files (`hooks/*/README.md`):**
- `name` — human-readable name
- `description` — wrapped in single quotes, must not be empty
- `tags` — optional array for categorization

**Workflow files (`workflows/*.md`):**
- `name` — human-readable name
- `description` — wrapped in single quotes, must not be empty
- `on` — trigger events
- `permissions` — minimum required permissions

## File Naming Conventions

- All file names must be lowercase
- Words separated by hyphens (e.g., `my-agent.agent.md`)
- No spaces or uppercase letters in file or folder names

## Plugin Structure

Each plugin directory at the repository root must contain:
- `plugin.json` — metadata with `name` (matching folder name), `description`, and `version`
- `README.md` — documentation for the plugin

The `plugin.json` `version` field must follow semantic versioning (e.g., `"1.0.0"`).

## Line Endings

Always normalize line endings to LF (Unix-style) before committing by running:

```bash
bash scripts/fix-line-endings.sh
```
