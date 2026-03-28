#!/usr/bin/env node
/**
 * scripts/validate-css.js
 *
 * Performs structural validation checks on fresh-normalize.css:
 * - All custom properties follow --fn- convention
 * - No @charset rule (shouldn't need it)
 * - CSS file ends with newline
 * - Version header present
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const css = readFileSync(join(ROOT, 'fresh-normalize.css'), 'utf-8');

const errors = [];

// ─── Check: ends with newline ─────────────────────────────────────────────────
if (!css.endsWith('\n')) {
  errors.push('File must end with a newline character');
}

// ─── Check: no CRLF ───────────────────────────────────────────────────────────
if (css.includes('\r\n')) {
  errors.push('File contains CRLF line endings — use LF only');
}

// ─── Check: no @charset ───────────────────────────────────────────────────────
if (css.includes('@charset')) {
  errors.push('@charset found — not needed for UTF-8 CSS in modern browsers');
}

// ─── Check: custom properties follow --fn- convention ─────────────────────────
const customProps = css.match(/--[a-z][a-z0-9-]+:/g) ?? [];
const badProps = customProps.filter((p) => !p.startsWith('--fn-'));
if (badProps.length > 0) {
  errors.push(
    `Custom properties must follow --fn-* convention. Found: ${[...new Set(badProps)].join(', ')}`,
  );
}

// ─── Check: expected @media queries present ───────────────────────────────────
const expectedMediaQueries = [
  'prefers-color-scheme: dark',
  'prefers-reduced-motion: reduce',
  'print',
];
expectedMediaQueries.forEach((mq) => {
  if (!css.includes(mq)) {
    errors.push(`Missing expected @media query: ${mq}`);
  }
});

// ─── Check: version in header ─────────────────────────────────────────────────
if (!css.match(/\/\*! fresh-normalize v\d+\.\d+\.\d+/)) {
  errors.push('Missing or malformed version header: /*! fresh-normalize vX.Y.Z ...');
}

// ─── Report ───────────────────────────────────────────────────────────────────
console.log('\n🔍 CSS Structural Validation\n' + '─'.repeat(45));

if (errors.length > 0) {
  console.log('\n❌ Errors:');
  errors.forEach((e) => console.error(`  • ${e}`));
  console.log('');
  process.exit(1);
} else {
  console.log('\n✅ All structural checks passed\n');
}
