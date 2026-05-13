#!/usr/bin/env node
// scripts/build-marketplace.js
// Auto-generates .github/plugin/marketplace.json from all plugin.json files
// and plugins/external.json entries.

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(REPO_ROOT, '.github', 'plugin');
const OUTPUT = path.join(OUTPUT_DIR, 'marketplace.json');

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return null; }
}

const marketplace = [];

// ── Local plugins (top-level directories with plugin.json) ───────────────────
const entries = fs.readdirSync(REPO_ROOT).filter(name => {
  const pluginFile = path.join(REPO_ROOT, name, 'plugin.json');
  return fs.existsSync(pluginFile);
});

for (const dir of entries.sort()) {
  const pluginJson = readJson(path.join(REPO_ROOT, dir, 'plugin.json'));
  if (!pluginJson) continue;
  marketplace.push({
    name: pluginJson.name || dir,
    version: pluginJson.version || '0.0.0',
    description: pluginJson.description || '',
    keywords: pluginJson.keywords || [],
    source: {
      type: 'local',
      path: `./${dir}`
    },
    agents: pluginJson.agents || [],
    skills: pluginJson.skills || [],
    commands: pluginJson.commands || []
  });
}

// ── External plugins (plugins/external.json) ──────────────────────────────────
const externalPath = path.join(REPO_ROOT, 'plugins', 'external.json');
const external = readJson(externalPath);
if (Array.isArray(external)) {
  for (const entry of external) {
    if (entry.name === 'example-external-plugin') continue; // skip the placeholder
    marketplace.push({
      name: entry.name,
      version: entry.version || '0.0.0',
      description: entry.description || '',
      keywords: entry.keywords || [],
      source: entry.source || {}
    });
  }
}

// ── Write output ──────────────────────────────────────────────────────────────
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
fs.writeFileSync(OUTPUT, JSON.stringify(marketplace, null, 2) + '\n', 'utf8');
console.log(`Generated ${path.relative(REPO_ROOT, OUTPUT)} (${marketplace.length} plugin(s))`);
