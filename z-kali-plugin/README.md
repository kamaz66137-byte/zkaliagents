# z-kali-plugin

The core z-kali plugin for GitHub Copilot. This plugin bundles:

- **Z-Kali Agent** — a specialized Copilot agent for plugin development
- **Z-Kali Analyzer Skill** — validates repository files for front matter compliance and naming conventions
- **Coding Standards Instructions** — applies z-kali conventions to all Markdown files

## Installation

Install via the GitHub Copilot CLI:

```bash
gh copilot plugin install kamaz66137-byte/zkaliagents/z-kali-plugin
```

## What's Included

| Component | Path | Description |
|-----------|------|-------------|
| Agent | `.github/agents/z-kali.agent.md` | Z-Kali development assistant agent |
| Skill | `.github/skills/z-kali-analyzer/` | Front matter & naming convention validator |
| Instructions | `.github/instructions/z-kali-coding-standards.instructions.md` | Coding standards for Markdown files |

## Version

`1.0.0` — initial release
