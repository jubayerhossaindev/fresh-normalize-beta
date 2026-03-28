#!/usr/bin/env node
/**
 * scripts/bump-version.js — Updates version in CSS header to match package.json
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
const version = pkg.version;

const cssPath = join(ROOT, 'fresh-normalize.css');
const css = readFileSync(cssPath, 'utf-8');

// Update the version in the header comment
const updated = css.replace(
  /\/\*! fresh-normalize v[\d.]+(?:-[\w.]+)? \|/,
  `/*! fresh-normalize v${version} |`,
);

if (updated === css) {
  console.error('❌ Could not find version in CSS header');
  process.exit(1);
}

writeFileSync(cssPath, updated);
console.log(`✅ Updated CSS header to v${version}`);
