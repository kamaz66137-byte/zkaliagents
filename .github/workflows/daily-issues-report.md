---
name: 'Daily Issues Report'
description: 'Generates a daily summary report of open issues, grouping them by label and priority, and posts the report as a new issue or updates a pinned tracking issue.'
on:
  schedule:
    - cron: '0 8 * * *'
  workflow_dispatch: {}
permissions:
  issues: write
  contents: read
safe-outputs:
  - issues
---

# Daily Issues Report Workflow

This agentic workflow runs every day at 08:00 UTC and generates a summary of all open issues in the repository.

## Steps

1. Fetch all open issues using the GitHub API
2. Group issues by their labels (bug, enhancement, documentation, etc.)
3. Identify issues that have been open for more than 7 days without any activity
4. Generate a Markdown-formatted report with sections for each label group
5. Post the report as a comment on the designated tracking issue (or create one if it doesn't exist)

## Permissions Required

- `issues: write` — to create or update the tracking issue
- `contents: read` — to read repository configuration

## Safe Outputs

This workflow only writes to issues. It does not modify repository files or code.
