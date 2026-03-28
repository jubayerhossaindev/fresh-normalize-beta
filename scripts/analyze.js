#!/usr/bin/env node
/**
 * scripts/analyze.js — Analyzes the built CSS for stats and size reporting
 *
 * This script analyzes the CSS bundle size and provides detailed statistics
 * about rules, declarations, media queries, and custom properties.
 */

import { readFileSync } from 'node:fs';
import { createGzip } from 'node:zlib';
import { Readable } from 'node:stream';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/**
 * Calculate the gzip-compressed size of a string
 * @param {string} content - The content to compress
 * @returns {Promise<number>} The size of the gzipped content in bytes
 */
async function getGzipSize(content) {
  const chunks = [];
  const readable = Readable.from([content]);
  const gzip = createGzip({ level: 9 });
  readable.pipe(gzip);
  for await (const chunk of gzip) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).length;
}

const BUDGET_RAW_KB = 35;
const BUDGET_GZIP_KB = 10;

async function analyze() {
  const mainPath = join(ROOT, 'fresh-normalize.css');
  const minPath = join(ROOT, 'dist', 'fresh-normalize.min.css');

  let mainCss;
  let minCss = null;

  try {
    mainCss = readFileSync(mainPath, 'utf-8');
  } catch {
    console.error('❌ fresh-normalize.css not found');
    process.exit(1);
  }

  try {
    minCss = readFileSync(minPath, 'utf-8');
  } catch {
    console.warn('⚠️  dist/fresh-normalize.min.css not found — run npm run build:minify first');
  }

  const mainGzip = await getGzipSize(mainCss);
  const minGzip = minCss !== null ? await getGzipSize(minCss) : null;

  // Count CSS rules and declarations
  const ruleMatches = mainCss.match(/\{[^}]+\}/g) ?? [];
  const declarationMatches = mainCss.match(/[\w-]+\s*:[^;{]+;/g) ?? [];
  const mediaQueryMatches = mainCss.match(/@media[^{]+\{/g) ?? [];
  const customPropMatches = mainCss.match(/--fn-[\w-]+:/g) ?? [];
  const selectorMatches = mainCss.match(/^[^@{}\s][^{]*\{/gm) ?? [];

  const stats = {
    main: {
      raw: mainCss.length,
      gzip: mainGzip,
    },
    min:
      minCss !== null
        ? {
            raw: minCss.length,
            gzip: minGzip,
            savings: `${(((mainCss.length - minCss.length) / mainCss.length) * 100).toFixed(1)}%`,
          }
        : null,
    css: {
      ruleBlocks: ruleMatches.length,
      declarations: declarationMatches.length,
      mediaQueries: mediaQueryMatches.length,
      customProperties: new Set(customPropMatches).size,
      selectors: selectorMatches.length,
    },
  };

  console.log('\n📊 fresh-normalize Build Analysis\n' + '─'.repeat(45));
  console.log(`\n📄 fresh-normalize.css`);
  console.log(`   Raw:   ${(stats.main.raw / 1024).toFixed(2)} kB`);
  console.log(`   Gzip:  ${(stats.main.gzip / 1024).toFixed(2)} kB`);

  if (stats.min !== null) {
    console.log(`\n📦 dist/fresh-normalize.min.css`);
    console.log(`   Raw:   ${(stats.min.raw / 1024).toFixed(2)} kB (saves ${stats.min.savings})`);
    console.log(`   Gzip:  ${(stats.min.gzip / 1024).toFixed(2)} kB`);
  }

  console.log(`\n📐 CSS Statistics`);
  console.log(`   Rule blocks:       ${stats.css.ruleBlocks}`);
  console.log(`   Declarations:      ${stats.css.declarations}`);
  console.log(`   Media queries:     ${stats.css.mediaQueries}`);
  console.log(`   Custom properties: ${stats.css.customProperties}`);
  console.log(`   Selectors:         ${stats.css.selectors}`);

  // Size budget check
  let budgetFailed = false;

  if (stats.main.raw > BUDGET_RAW_KB * 1024) {
    console.error(
      `\n❌ SIZE BUDGET EXCEEDED: ${(stats.main.raw / 1024).toFixed(2)} kB > ${BUDGET_RAW_KB} kB raw`,
    );
    budgetFailed = true;
  }
  if (stats.main.gzip > BUDGET_GZIP_KB * 1024) {
    console.error(
      `\n❌ SIZE BUDGET EXCEEDED: ${(stats.main.gzip / 1024).toFixed(2)} kB > ${BUDGET_GZIP_KB} kB gzip`,
    );
    budgetFailed = true;
  }

  if (!budgetFailed) {
    console.log(`\n✅ Size budget OK (< ${BUDGET_RAW_KB} kB raw, < ${BUDGET_GZIP_KB} kB gzip)`);
  }

  console.log('');

  if (budgetFailed) {
    process.exit(1);
  }
}

analyze().catch((err) => {
  console.error('Analysis failed:', err.message);
  process.exit(1);
});
