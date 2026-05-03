#!/usr/bin/env node
// scripts/build-readme.js
// Auto-generates .github/README.md from all agents, instructions, skills, hooks, and workflows.

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const GITHUB_DIR = path.join(REPO_ROOT, '.github');
const OUTPUT = path.join(GITHUB_DIR, 'README.md');

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^'|'$/g, '');
    fm[key] = value;
  }
  return fm;
}

function readDir(dir) {
  try { return fs.readdirSync(dir); } catch { return []; }
}

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch { return ''; }
}

// ── Agents ────────────────────────────────────────────────────────────────────

function buildAgentsSection() {
  const agentsDir = path.join(GITHUB_DIR, 'agents');
  const files = readDir(agentsDir).filter(f => f.endsWith('.agent.md'));
  if (files.length === 0) return '';

  let section = '## Agents\n\n';
  section += '| File | Name | Description |\n|------|------|-------------|\n';
  for (const file of files.sort()) {
    const content = readFile(path.join(agentsDir, file));
    const fm = parseFrontMatter(content);
    const name = fm.name || file.replace('.agent.md', '');
    const desc = fm.description || '_No description_';
    section += `| [\`${file}\`](agents/${file}) | ${name} | ${desc} |\n`;
  }
  return section + '\n';
}

// ── Instructions ──────────────────────────────────────────────────────────────

function buildInstructionsSection() {
  const instrDir = path.join(GITHUB_DIR, 'instructions');
  const files = readDir(instrDir).filter(f => f.endsWith('.instructions.md'));
  if (files.length === 0) return '';

  let section = '## Instructions\n\n';
  section += '| File | Applies To | Description |\n|------|------------|-------------|\n';
  for (const file of files.sort()) {
    const content = readFile(path.join(instrDir, file));
    const fm = parseFrontMatter(content);
    const applyTo = fm.applyTo || '_All files_';
    const desc = fm.description || '_No description_';
    section += `| [\`${file}\`](instructions/${file}) | \`${applyTo}\` | ${desc} |\n`;
  }
  return section + '\n';
}

// ── Skills ────────────────────────────────────────────────────────────────────

function buildSkillsSection() {
  const skillsDir = path.join(GITHUB_DIR, 'skills');
  const folders = readDir(skillsDir).filter(f => {
    return fs.existsSync(path.join(skillsDir, f, 'SKILL.md'));
  });
  if (folders.length === 0) return '';

  let section = '## Skills\n\n';
  section += '| Folder | Name | Description |\n|--------|------|-------------|\n';
  for (const folder of folders.sort()) {
    const content = readFile(path.join(skillsDir, folder, 'SKILL.md'));
    const fm = parseFrontMatter(content);
    const name = fm.name || folder;
    const desc = fm.description || '_No description_';
    section += `| [\`${folder}/\`](skills/${folder}/) | ${name} | ${desc} |\n`;
  }
  return section + '\n';
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function buildHooksSection() {
  const hooksDir = path.join(GITHUB_DIR, 'hooks');
  const folders = readDir(hooksDir).filter(f => {
    return fs.existsSync(path.join(hooksDir, f, 'README.md'));
  });
  if (folders.length === 0) return '';

  let section = '## Hooks\n\n';
  section += '| Folder | Name | Events | Description |\n|--------|------|--------|-------------|\n';
  for (const folder of folders.sort()) {
    const content = readFile(path.join(hooksDir, folder, 'README.md'));
    const fm = parseFrontMatter(content);
    const name = fm.name || folder;
    const desc = fm.description || '_No description_';

    // Extract events from hooks.json
    let events = '_unknown_';
    try {
      const hooksJson = JSON.parse(readFile(path.join(hooksDir, folder, 'hooks.json')));
      events = (hooksJson.hooks || []).map(h => `\`${h.event}\``).join(', ') || '_none_';
    } catch { /* ignore */ }

    section += `| [\`${folder}/\`](hooks/${folder}/) | ${name} | ${events} | ${desc} |\n`;
  }
  return section + '\n';
}

// ── Workflows ─────────────────────────────────────────────────────────────────

function buildWorkflowsSection() {
  const wfDir = path.join(GITHUB_DIR, 'workflows');
  const files = readDir(wfDir).filter(f => f.endsWith('.md'));
  if (files.length === 0) return '';

  let section = '## Workflows\n\n';
  section += '| File | Name | Description |\n|------|------|-------------|\n';
  for (const file of files.sort()) {
    const content = readFile(path.join(wfDir, file));
    const fm = parseFrontMatter(content);
    const name = fm.name || file.replace('.md', '');
    const desc = fm.description || '_No description_';
    section += `| [\`${file}\`](workflows/${file}) | ${name} | ${desc} |\n`;
  }
  return section + '\n';
}

// ── Main ──────────────────────────────────────────────────────────────────────

const now = new Date().toISOString().slice(0, 10);

const readme = `<!-- AUTO-GENERATED — do not edit manually. Run \`npm run build:readme\` to regenerate. -->
# Z-Kali Agents — Resource Index

_Generated on ${now}_

${buildAgentsSection()}${buildInstructionsSection()}${buildSkillsSection()}${buildHooksSection()}${buildWorkflowsSection()}---

> This file is automatically generated by \`scripts/build-readme.js\`.
> Edit source files in the \`.github/agents/\`, \`.github/instructions/\`, \`.github/skills/\`, \`.github/hooks/\`, and \`.github/workflows/\` directories.
`;

fs.writeFileSync(OUTPUT, readme, 'utf8');
console.log(`Generated ${path.relative(REPO_ROOT, OUTPUT)}`);
