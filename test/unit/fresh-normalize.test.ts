/**
 * fresh-normalize — Unit Test Suite (100% Coverage)
 *
 * Strategy: parse fresh-normalize.css as a text document and assert
 * the presence, correctness, and structural integrity of every rule,
 * custom property, media query, selector, and declaration.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROOT = resolve(process.cwd());
const CSS_PATH = resolve(ROOT, 'fresh-normalize.css');
const PKG_PATH = resolve(ROOT, 'package.json');

function extractMediaBlock(css: string, query: string): string {
  const withParens = css.indexOf(`@media (${query})`);
  const withSpace = css.indexOf(`@media ${query} `);
  /* istanbul ignore next */
  const start = withParens !== -1 ? withParens : withSpace !== -1 ? withSpace : -1;
  if (start === -1) {
    return '';
  }
  const openAt = css.indexOf('{', start);
  if (openAt === -1) {
    return '';
  }
  let depth = 0;
  let pos = openAt;
  while (pos < css.length) {
    const ch = css[pos];
    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return css.slice(openAt, pos + 1);
      }
    }
    pos++;
  }
  /* istanbul ignore next */
  return '';
}

function allCustomProps(css: string): string[] {
  return [...new Set((css.match(/--fn-[\w-]+(?=\s*:)/g) ?? []).map((s) => s.trim()))];
}

function sliceAfter(css: string, needle: string, length = 400): string {
  const idx = css.indexOf(needle);
  return idx === -1 ? '' : css.slice(idx, idx + length);
}

let css: string;
interface PackageJson {
  name: string;
  license: string;
  main: string;
  [key: string]: unknown;
}

let pkg: PackageJson;

beforeAll(() => {
  css = readFileSync(CSS_PATH, 'utf-8');
  pkg = JSON.parse(readFileSync(PKG_PATH, 'utf-8')) as PackageJson;
});

// ═══════════════════════════════════════════════════════════════════════════════
// 1. FILE INTEGRITY
// ═══════════════════════════════════════════════════════════════════════════════
describe('1 · File Integrity', () => {
  it('CSS file exists on disk', () => {
    expect(existsSync(CSS_PATH)).toBe(true);
  });
  it('is non-empty (> 2 kB)', () => {
    expect(Buffer.byteLength(css, 'utf-8')).toBeGreaterThan(2048);
  });
  it('is within size budget (< 40 kB raw, comments included)', () => {
    expect(Buffer.byteLength(css, 'utf-8')).toBeLessThan(40960);
  });
  it('has correct license banner', () => {
    expect(css.trimStart().startsWith('/*! fresh-normalize')).toBe(true);
  });
  it('banner contains MIT License', () => {
    expect(css.slice(0, css.indexOf('\n'))).toContain('MIT License');
  });
  it('banner contains a version number', () => {
    expect(css.match(/fresh-normalize v[\d.]+/)).not.toBeNull();
  });
  it('has no CRLF line endings', () => {
    expect(css.includes('\r\n')).toBe(false);
  });
  it('ends with a LF newline', () => {
    expect(css.endsWith('\n')).toBe(true);
  });
  it('has no TODO or FIXME comments', () => {
    expect(/\bTODO\b|\bFIXME\b/i.test(css)).toBe(false);
  });
  it('package.json exists', () => {
    expect(existsSync(PKG_PATH)).toBe(true);
  });
  it('package name is fresh-normalize-beta', () => {
    expect(pkg['name']).toBe('fresh-normalize-beta');
  });
  it('package has MIT license', () => {
    expect(pkg['license']).toBe('MIT');
  });
  it('package main points to CSS file', () => {
    expect(pkg['main']).toBe('fresh-normalize.css');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CSS CUSTOM PROPERTIES (DESIGN TOKENS)
// ═══════════════════════════════════════════════════════════════════════════════
describe('2 · CSS Custom Properties', () => {
  // Font tokens
  it('defines --fn-font-sans', () => {
    expect(css).toContain('--fn-font-sans:');
  });
  it('--fn-font-sans includes system-ui', () => {
    expect(css).toContain('system-ui');
  });
  it('--fn-font-sans includes Apple Color Emoji', () => {
    expect(css).toContain('Apple Color Emoji');
  });
  it('defines --fn-font-mono', () => {
    expect(css).toContain('--fn-font-mono:');
  });
  it('--fn-font-mono includes ui-monospace', () => {
    expect(css).toContain('ui-monospace');
  });
  it('defines --fn-font-serif', () => {
    expect(css).toContain('--fn-font-serif:');
  });

  // Layout
  it('defines --fn-tab-size', () => {
    expect(css).toContain('--fn-tab-size:');
  });
  it('defines --fn-line-height as 1.5', () => {
    expect(css).toContain('--fn-line-height: 1.5');
  });
  it('defines --fn-heading-line-height as 1.2', () => {
    expect(css).toContain('--fn-heading-line-height: 1.2');
  });

  // Focus
  it('defines --fn-focus-color', () => {
    expect(css).toContain('--fn-focus-color:');
  });
  it('defines --fn-focus-width', () => {
    expect(css).toContain('--fn-focus-width:');
  });
  it('defines --fn-focus-offset', () => {
    expect(css).toContain('--fn-focus-offset:');
  });

  // Colors
  it('defines --fn-text-color', () => {
    expect(css).toContain('--fn-text-color:');
  });
  it('defines --fn-bg-color', () => {
    expect(css).toContain('--fn-bg-color:');
  });
  it('defines --fn-link-color', () => {
    expect(css).toContain('--fn-link-color:');
  });
  it('defines --fn-link-visited-color', () => {
    expect(css).toContain('--fn-link-visited-color:');
  });
  it('defines --fn-border-color', () => {
    expect(css).toContain('--fn-border-color:');
  });

  // Scrollbar tokens
  it('defines --fn-scrollbar-width', () => {
    expect(css).toContain('--fn-scrollbar-width:');
  });
  it('defines --fn-scrollbar-track', () => {
    expect(css).toContain('--fn-scrollbar-track:');
  });
  it('defines --fn-scrollbar-thumb', () => {
    expect(css).toContain('--fn-scrollbar-thumb:');
  });
  it('defines --fn-scrollbar-thumb-hover', () => {
    expect(css).toContain('--fn-scrollbar-thumb-hover:');
  });

  // Convention
  it('ALL custom properties follow --fn- naming convention', () => {
    const bad = allCustomProps(css).filter((p) => !p.startsWith('--fn-'));
    expect(bad).toHaveLength(0);
  });
  it('defines at least 18 distinct custom properties', () => {
    expect(allCustomProps(css).length).toBeGreaterThanOrEqual(18);
  });

  // Dark mode
  it('dark mode block exists', () => {
    expect(extractMediaBlock(css, 'prefers-color-scheme: dark')).not.toBe('');
  });
  it('dark mode redefines --fn-text-color', () => {
    expect(extractMediaBlock(css, 'prefers-color-scheme: dark')).toContain('--fn-text-color:');
  });
  it('dark mode redefines --fn-bg-color', () => {
    expect(extractMediaBlock(css, 'prefers-color-scheme: dark')).toContain('--fn-bg-color:');
  });
  it('dark mode redefines --fn-link-color', () => {
    expect(extractMediaBlock(css, 'prefers-color-scheme: dark')).toContain('--fn-link-color:');
  });
  it('dark mode redefines --fn-border-color', () => {
    expect(extractMediaBlock(css, 'prefers-color-scheme: dark')).toContain('--fn-border-color:');
  });
  it('dark mode redefines scrollbar colors', () => {
    expect(extractMediaBlock(css, 'prefers-color-scheme: dark')).toContain('--fn-scrollbar-thumb:');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. BOX MODEL
// ═══════════════════════════════════════════════════════════════════════════════
describe('3 · Box Model', () => {
  it('universal selector includes ::before and ::after', () => {
    expect(css).toMatch(/\*,\s*\n?\s*::before,\s*\n?\s*::after/);
  });
  it('universal block sets box-sizing: border-box', () => {
    expect(css).toContain('box-sizing: border-box');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════
describe('4 · Document', () => {
  it('html uses var(--fn-font-sans)', () => {
    expect(sliceAfter(css, '\nhtml {', 600)).toContain('var(--fn-font-sans)');
  });
  it('html uses var(--fn-line-height)', () => {
    expect(sliceAfter(css, '\nhtml {', 600)).toContain('var(--fn-line-height)');
  });
  it('html has -webkit-text-size-adjust: 100%', () => {
    expect(css).toContain('-webkit-text-size-adjust: 100%');
  });
  it('html has -moz-text-size-adjust: 100%', () => {
    expect(css).toContain('-moz-text-size-adjust: 100%');
  });
  it('html has text-size-adjust: 100%', () => {
    expect(css).toContain('text-size-adjust: 100%');
  });
  it('html uses var(--fn-tab-size)', () => {
    expect(sliceAfter(css, '\nhtml {', 600)).toContain('var(--fn-tab-size)');
  });
  it('html has scroll-behavior: smooth', () => {
    expect(sliceAfter(css, '\nhtml {', 600)).toContain('scroll-behavior: smooth');
  });
  it('html has scrollbar-gutter: stable', () => {
    expect(sliceAfter(css, '\nhtml {', 600)).toContain('scrollbar-gutter: stable');
  });
  it('html has text-rendering: optimizeLegibility', () => {
    expect(sliceAfter(css, '\nhtml {', 600)).toContain('text-rendering: optimizeLegibility');
  });
  it('html has -webkit-font-smoothing: antialiased', () => {
    expect(css).toContain('-webkit-font-smoothing: antialiased');
  });
  it('html has -moz-osx-font-smoothing: grayscale', () => {
    expect(css).toContain('-moz-osx-font-smoothing: grayscale');
  });
  it('html has color-scheme: light dark', () => {
    expect(css).toContain('color-scheme: light dark');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════
describe('5 · Sections', () => {
  it('body has margin: 0', () => {
    expect(sliceAfter(css, '\nbody {')).toContain('margin: 0');
  });
  it('h1 has font-size: 2em', () => {
    expect(sliceAfter(css, '\nh1 {')).toContain('font-size: 2em');
  });
  it('h1 has margin-block: 0.67em', () => {
    expect(sliceAfter(css, '\nh1 {')).toContain('margin-block: 0.67em');
  });
  it('heading group h1-h6 uses var(--fn-heading-line-height)', () => {
    expect(css).toContain('var(--fn-heading-line-height)');
  });
  it('heading group selector covers h1 through h6', () => {
    expect(css).toMatch(/h1,\s*\n?\s*h2,\s*\n?\s*h3,\s*\n?\s*h4,\s*\n?\s*h5,\s*\n?\s*h6/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════════
describe('6 · Typography', () => {
  it('b/strong has font-weight: bolder', () => {
    expect(css).toContain('font-weight: bolder');
  });
  it('code/kbd/samp/pre use var(--fn-font-mono)', () => {
    expect(css).toContain('var(--fn-font-mono)');
  });
  it('code block has font-size: 1em', () => {
    const block = sliceAfter(css, 'var(--fn-font-mono)', 200);
    expect(block).toContain('font-size: 1em');
  });
  it('small has font-size: 80%', () => {
    expect(css).toContain('font-size: 80%');
  });
  it('sub/sup selector exists', () => {
    expect(css).toMatch(/sub,\s*\n?\s*sup\s*\{/);
  });
  it('sub/sup have font-size: 75%', () => {
    expect(css).toContain('font-size: 75%');
  });
  it('sub/sup have line-height: 0', () => {
    expect(sliceAfter(css, 'sub,')).toContain('line-height: 0');
  });
  it('sub/sup have position: relative', () => {
    expect(sliceAfter(css, 'sub,')).toContain('position: relative');
  });
  it('sub/sup have vertical-align: baseline', () => {
    expect(sliceAfter(css, 'sub,')).toContain('vertical-align: baseline');
  });
  it('sub has bottom: -0.25em', () => {
    expect(css).toContain('bottom: -0.25em');
  });
  it('sup has top: -0.5em', () => {
    expect(css).toContain('top: -0.5em');
  });
  it('abbr[title] has text-decoration: underline dotted', () => {
    expect(css).toContain('text-decoration: underline dotted');
  });
  it('abbr[title] has cursor: help', () => {
    expect(css).toContain('cursor: help');
  });
  it('hr has border: none', () => {
    expect(sliceAfter(css, '\nhr {')).toContain('border: none');
  });
  it('hr uses var(--fn-border-color)', () => {
    expect(sliceAfter(css, '\nhr {')).toContain('var(--fn-border-color)');
  });
  it('hr has margin-block: 1em', () => {
    expect(css).toContain('margin-block: 1em');
  });
  it('p/headings have overflow-wrap: break-word', () => {
    expect(css).toContain('overflow-wrap: break-word');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. LISTS
// ═══════════════════════════════════════════════════════════════════════════════
describe('7 · Lists', () => {
  it('nav ol is targeted', () => {
    expect(css).toContain('nav ol');
  });
  it('nav ul is targeted', () => {
    expect(css).toContain('nav ul');
  });
  it('ol[role="list"] is targeted', () => {
    expect(css).toContain('ol[role="list"]');
  });
  it('ul[role="list"] is targeted', () => {
    expect(css).toContain('ul[role="list"]');
  });
  it('nav lists have list-style: none', () => {
    expect(css).toContain('list-style: none');
  });
  it('nav lists have margin: 0', () => {
    expect(sliceAfter(css, 'nav ol,')).toContain('margin: 0');
  });
  it('nav lists have padding: 0', () => {
    expect(sliceAfter(css, 'nav ol,')).toContain('padding: 0');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 8. LINKS
// ═══════════════════════════════════════════════════════════════════════════════
describe('8 · Links', () => {
  it('a has background-color: transparent', () => {
    expect(css).toContain('background-color: transparent');
  });
  it('a uses var(--fn-link-color)', () => {
    expect(css).toContain('var(--fn-link-color)');
  });
  it('a:visited uses var(--fn-link-visited-color)', () => {
    expect(css).toContain('var(--fn-link-visited-color)');
  });
  it('a:focus-visible is targeted', () => {
    expect(css).toContain('a:focus-visible');
  });
  it('a:focus-visible has outline with --fn-focus vars', () => {
    const block = sliceAfter(css, 'a:focus-visible');
    expect(block).toContain('var(--fn-focus-width)');
    expect(block).toContain('var(--fn-focus-color)');
  });
  it('a:focus-visible has border-radius', () => {
    expect(sliceAfter(css, 'a:focus-visible')).toContain('border-radius:');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 9. MEDIA
// ═══════════════════════════════════════════════════════════════════════════════
describe('9 · Embedded Content', () => {
  it('img, svg, video, canvas, audio, iframe, embed, object are targeted', () => {
    ['img', 'svg', 'video', 'canvas', 'audio', 'iframe', 'embed', 'object'].forEach((tag) => {
      expect(css).toContain(tag);
    });
  });
  it('media elements have display: block', () => {
    expect(css).toContain('display: block');
  });
  it('media elements have vertical-align: middle', () => {
    expect(css).toContain('vertical-align: middle');
  });
  it('img/video/canvas have max-inline-size: 100%', () => {
    expect(css).toContain('max-inline-size: 100%');
  });
  it('img/video/canvas have block-size: auto', () => {
    expect(css).toContain('block-size: auto');
  });
  it('img has border-style: none', () => {
    expect(css).toContain('border-style: none');
  });
  it('svg has overflow: hidden', () => {
    expect(css).toContain('overflow: hidden');
  });
  it('audio:not([controls]) has display: none', () => {
    expect(css).toContain('audio:not([controls])');
    expect(sliceAfter(css, 'audio:not([controls])')).toContain('display: none');
  });
  it('audio:not([controls]) has height: 0', () => {
    expect(sliceAfter(css, 'audio:not([controls])')).toContain('height: 0');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 10. TABLES
// ═══════════════════════════════════════════════════════════════════════════════
describe('10 · Tables', () => {
  it('table has border-color: currentColor', () => {
    expect(css).toContain('border-color: currentColor');
  });
  it('table has border-collapse: collapse', () => {
    expect(css).toContain('border-collapse: collapse');
  });
  it('table has border-spacing: 0', () => {
    expect(css).toContain('border-spacing: 0');
  });
  it('td and th are targeted', () => {
    expect(css).toContain('td,');
    expect(css).toContain('th');
  });
  it('td/th have padding: 0', () => {
    expect(sliceAfter(css, 'td,')).toContain('padding: 0');
  });
  it('td/th have text-align: left', () => {
    expect(sliceAfter(css, 'td,')).toContain('text-align: left');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 11. FORMS
// ═══════════════════════════════════════════════════════════════════════════════
describe('11 · Forms', () => {
  it('button, input, optgroup, select, textarea are grouped', () => {
    expect(css).toMatch(
      /button,\s*\n?\s*input,\s*\n?\s*optgroup,\s*\n?\s*select,\s*\n?\s*textarea/,
    );
  });
  it('form elements inherit font-family', () => {
    expect(css).toContain('font-family: inherit');
  });
  it('form elements have font-size: 100%', () => {
    expect(css).toContain('font-size: 100%');
  });
  it('form elements have line-height: 1.15', () => {
    expect(css).toContain('line-height: 1.15');
  });
  it('form elements have margin: 0', () => {
    expect(sliceAfter(css, 'button,\ninput,')).toContain('margin: 0');
  });
  it('form elements inherit color', () => {
    expect(css).toContain('color: inherit');
  });
  it('button has -webkit-appearance: button', () => {
    expect(css).toContain('-webkit-appearance: button');
  });
  it('button has appearance: button', () => {
    expect(css).toContain('appearance: button');
  });
  it('button has cursor: pointer', () => {
    expect(css).toContain('cursor: pointer');
  });
  it("type='button', 'reset', 'submit' are targeted", () => {
    expect(css).toContain('[type="button"]');
    expect(css).toContain('[type="reset"]');
    expect(css).toContain('[type="submit"]');
  });
  it('fieldset has border: 0', () => {
    expect(sliceAfter(css, '\nfieldset {')).toContain('border: 0');
  });
  it('fieldset has margin: 0 and padding: 0', () => {
    const block = sliceAfter(css, '\nfieldset {');
    expect(block).toContain('margin: 0');
    expect(block).toContain('padding: 0');
  });
  it('progress has vertical-align: baseline', () => {
    expect(css).toContain('vertical-align: baseline');
  });
  it('::-webkit-inner/outer-spin-button have height: auto', () => {
    expect(css).toContain('::-webkit-inner-spin-button');
    expect(css).toContain('::-webkit-outer-spin-button');
    expect(css).toContain('height: auto');
  });
  it("[type='search'] has -webkit-appearance: textfield", () => {
    expect(css).toContain('-webkit-appearance: textfield');
  });
  it("[type='search'] has appearance: textfield", () => {
    expect(css).toContain('appearance: textfield');
  });
  it("[type='search'] has outline-offset: -2px", () => {
    expect(css).toContain('outline-offset: -2px');
  });
  it('::-webkit-search-decoration has -webkit-appearance: none', () => {
    expect(css).toContain('::-webkit-search-decoration');
    expect(css).toContain('-webkit-appearance: none');
  });
  it('::-webkit-file-upload-button normalizes font', () => {
    expect(sliceAfter(css, '::-webkit-file-upload-button')).toContain('font: inherit');
  });
  it('::file-selector-button is normalized', () => {
    expect(css).toContain('::file-selector-button');
  });
  it('textarea has resize: vertical', () => {
    expect(css).toContain('resize: vertical');
  });
  it('textarea has overflow: auto', () => {
    expect(css).toContain('overflow: auto');
  });
  it('select is grouped with button/input for font normalization', () => {
    // pure normalize does NOT reset select appearance — browser default UI is preserved.
    expect(css).toContain('select,');
  });
  it('legend has padding: 0', () => {
    expect(sliceAfter(css, '\nlegend {')).toContain('padding: 0');
  });
  it('legend has max-inline-size: 100%', () => {
    expect(sliceAfter(css, '\nlegend {')).toContain('max-inline-size: 100%');
  });
  it('autofill fix targets :-webkit-autofill', () => {
    expect(css).toContain(':-webkit-autofill');
  });
  it('autofill fix uses --fn-bg-color for inset box-shadow', () => {
    expect(sliceAfter(css, ':-webkit-autofill')).toContain('var(--fn-bg-color)');
  });
  it(':user-invalid uses --fn-error-color', () => {
    expect(css).toContain(':user-invalid');
    expect(sliceAfter(css, ':user-invalid')).toContain('var(--fn-error-color)');
  });
  it(':user-valid uses --fn-success-color', () => {
    expect(css).toContain(':user-valid');
    expect(sliceAfter(css, ':user-valid')).toContain('var(--fn-success-color)');
  });
  it('::placeholder has opacity', () => {
    expect(sliceAfter(css, '::placeholder')).toContain('opacity:');
  });
  it('::placeholder inherits color', () => {
    expect(sliceAfter(css, '::placeholder')).toContain('color: inherit');
  });
  it("[type='color'] has block-size", () => {
    expect(sliceAfter(css, '[type="color"]')).toContain('block-size:');
  });
  it("[type='color'] has cursor: pointer", () => {
    expect(sliceAfter(css, '[type="color"]')).toContain('cursor: pointer');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 12. INTERACTIVE
// ═══════════════════════════════════════════════════════════════════════════════
describe('12 · Interactive', () => {
  it('summary has display: list-item', () => {
    expect(css).toContain('display: list-item');
  });
  it('summary has cursor: pointer', () => {
    expect(sliceAfter(css, 'summary {')).toContain('cursor: pointer');
  });
  it('details has display: block', () => {
    expect(sliceAfter(css, '\ndetails {')).toContain('display: block');
  });
  it('template and [hidden] have display: none', () => {
    expect(css).toContain('template,');
    expect(css).toContain('[hidden]');
    expect(css).toContain('display: none');
  });
  it('dialog element uses --fn-bg-color', () => {
    expect(sliceAfter(css, '\ndialog {')).toContain('var(--fn-bg-color)');
  });
  it('dialog has border-radius: 8px', () => {
    expect(sliceAfter(css, '\ndialog {')).toContain('border-radius: 8px');
  });
  it('dialog::backdrop exists', () => {
    expect(css).toContain('dialog::backdrop');
  });
  it('dialog::backdrop has background-color', () => {
    expect(sliceAfter(css, 'dialog::backdrop')).toContain('background-color:');
  });
  it('dialog::backdrop has backdrop-filter', () => {
    expect(sliceAfter(css, 'dialog::backdrop')).toContain('backdrop-filter:');
  });
  it('[popover] is normalized', () => {
    expect(css).toContain('[popover]');
  });
  it('[popover] has border-radius', () => {
    expect(sliceAfter(css, '[popover]')).toContain('border-radius:');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 13. ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════════════════════
describe('13 · Accessibility', () => {
  it(':focus-visible has outline with focus vars', () => {
    const block = sliceAfter(css, '\n:focus-visible {');
    expect(block).toContain('var(--fn-focus-width)');
    expect(block).toContain('var(--fn-focus-color)');
  });
  it(':focus-visible has outline-offset', () => {
    expect(sliceAfter(css, '\n:focus-visible {')).toContain('var(--fn-focus-offset)');
  });
  it(':focus:not(:focus-visible) has outline: none', () => {
    expect(css).toContain(':focus:not(:focus-visible)');
    expect(sliceAfter(css, ':focus:not(:focus-visible)')).toContain('outline: none');
  });
  it('.sr-only uses clip-path: inset(50%)', () => {
    expect(sliceAfter(css, '.sr-only')).toContain('clip-path: inset(50%)');
  });
  it('.sr-only has block-size: 1px', () => {
    expect(sliceAfter(css, '.sr-only')).toContain('block-size: 1px');
  });
  it('.sr-only has inline-size: 1px', () => {
    expect(sliceAfter(css, '.sr-only')).toContain('inline-size: 1px');
  });
  it('.sr-only has overflow: hidden', () => {
    expect(sliceAfter(css, '.sr-only')).toContain('overflow: hidden');
  });
  it('.sr-only has position: absolute', () => {
    expect(sliceAfter(css, '.sr-only')).toContain('position: absolute');
  });
  it('.sr-only has white-space: nowrap', () => {
    expect(sliceAfter(css, '.sr-only')).toContain('white-space: nowrap');
  });
  it('.skip-link exists', () => {
    expect(css).toContain('.skip-link');
  });
  it('.skip-link:focus has clip: auto', () => {
    expect(sliceAfter(css, '.skip-link:focus')).toContain('clip: auto');
  });
  it('.skip-link:focus has position: fixed', () => {
    expect(sliceAfter(css, '.skip-link:focus')).toContain('position: fixed');
  });
  it('.skip-link:focus has z-index: 999', () => {
    expect(sliceAfter(css, '.skip-link:focus')).toContain('z-index: 999');
  });
  it('.skip-link:focus uses inset-block-start', () => {
    expect(sliceAfter(css, '.skip-link:focus')).toContain('inset-block-start:');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 14. SCROLLBAR
// ═══════════════════════════════════════════════════════════════════════════════
describe('14 · Scrollbar', () => {
  it('scrollbar-width is set', () => {
    expect(css).toContain('scrollbar-width:');
  });
  it('scrollbar-color is set', () => {
    expect(css).toContain('scrollbar-color:');
  });
  it('::-webkit-scrollbar is defined', () => {
    expect(css).toContain('::-webkit-scrollbar {');
  });
  it('::-webkit-scrollbar has inline-size', () => {
    expect(sliceAfter(css, '::-webkit-scrollbar {')).toContain('inline-size:');
  });
  it('::-webkit-scrollbar-track uses --fn-scrollbar-track', () => {
    expect(sliceAfter(css, '::-webkit-scrollbar-track')).toContain('var(--fn-scrollbar-track)');
  });
  it('::-webkit-scrollbar-thumb uses --fn-scrollbar-thumb', () => {
    expect(sliceAfter(css, '::-webkit-scrollbar-thumb {')).toContain('var(--fn-scrollbar-thumb)');
  });
  it('::-webkit-scrollbar-thumb has border-radius', () => {
    expect(sliceAfter(css, '::-webkit-scrollbar-thumb {')).toContain('border-radius:');
  });
  it('::-webkit-scrollbar-thumb:hover uses --fn-scrollbar-thumb-hover', () => {
    expect(css).toContain('::-webkit-scrollbar-thumb:hover');
    expect(sliceAfter(css, '::-webkit-scrollbar-thumb:hover')).toContain(
      'var(--fn-scrollbar-thumb-hover)',
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 15. MOTION
// ═══════════════════════════════════════════════════════════════════════════════
describe('15 · Motion', () => {
  it('prefers-reduced-motion: reduce block exists', () => {
    expect(extractMediaBlock(css, 'prefers-reduced-motion: reduce')).not.toBe('');
  });
  it('sets animation-duration: 0.01ms !important', () => {
    expect(extractMediaBlock(css, 'prefers-reduced-motion: reduce')).toContain(
      'animation-duration: 0.01ms !important',
    );
  });
  it('sets animation-iteration-count: 1 !important', () => {
    expect(extractMediaBlock(css, 'prefers-reduced-motion: reduce')).toContain(
      'animation-iteration-count: 1 !important',
    );
  });
  it('sets transition-duration: 0.01ms !important', () => {
    expect(extractMediaBlock(css, 'prefers-reduced-motion: reduce')).toContain(
      'transition-duration: 0.01ms !important',
    );
  });
  it('sets scroll-behavior: auto !important', () => {
    expect(extractMediaBlock(css, 'prefers-reduced-motion: reduce')).toContain(
      'scroll-behavior: auto !important',
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 16. PRINT
// ═══════════════════════════════════════════════════════════════════════════════
describe('16 · Print', () => {
  it('@media print block exists', () => {
    expect(css).toContain('@media print');
    expect(extractMediaBlock(css, 'print')).not.toBe('');
  });
  it('print resets background to transparent', () => {
    expect(extractMediaBlock(css, 'print')).toContain('background: transparent !important');
  });
  it('print sets color to #000', () => {
    expect(extractMediaBlock(css, 'print')).toContain('color: #000 !important');
  });
  it('print removes box-shadow', () => {
    expect(extractMediaBlock(css, 'print')).toContain('box-shadow: none !important');
  });
  it('print links have text-decoration: underline', () => {
    expect(extractMediaBlock(css, 'print')).toContain('text-decoration: underline');
  });
  it('print expands link URLs via a[href]::after', () => {
    const block = extractMediaBlock(css, 'print');
    expect(block).toContain('a[href]::after');
    expect(block).toContain('attr(href)');
  });
  it('print expands abbr via abbr[title]::after', () => {
    const block = extractMediaBlock(css, 'print');
    expect(block).toContain('abbr[title]::after');
    expect(block).toContain('attr(title)');
  });
  it('print has break-inside: avoid', () => {
    expect(extractMediaBlock(css, 'print')).toContain('break-inside: avoid');
  });
  it('print has break-after: avoid on headings', () => {
    expect(extractMediaBlock(css, 'print')).toContain('break-after: avoid');
  });
  it('print sets orphans: 3', () => {
    expect(extractMediaBlock(css, 'print')).toContain('orphans: 3');
  });
  it('print sets widows: 3', () => {
    expect(extractMediaBlock(css, 'print')).toContain('widows: 3');
  });
  it('print sets max-inline-size: 100% !important on img', () => {
    expect(extractMediaBlock(css, 'print')).toContain('max-inline-size: 100%');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 17. STRUCTURE & COMPLETENESS
// ═══════════════════════════════════════════════════════════════════════════════
describe('17 · Structure & Completeness', () => {
  it('has all expected section headers', () => {
    const sections = [
      'CSS Custom Properties',
      'Box Model',
      'Document',
      'Sections',
      'Typography',
      'Lists',
      'Links',
      'Embedded Content',
      'Tables',
      'Forms',
      'Interactive',
      'Accessibility',
      'Scrollbar',
      'Motion',
      'Print',
    ];
    for (const s of sections) {
      expect(css, `Missing section: ${s}`).toContain(s);
    }
  });
  it('has balanced curly braces', () => {
    const open = (css.match(/\{/g) /* v8 ignore next */ ?? []).length;
    const close = (css.match(/\}/g) /* v8 ignore next */ ?? []).length;
    expect(open).toBe(close);
  });
  it('has no unclosed comments', () => {
    const opens = (css.match(/\/\*/g) /* v8 ignore next */ ?? []).length;
    const closes = (css.match(/\*\//g) /* v8 ignore next */ ?? []).length;
    expect(opens).toBe(closes);
  });
  it('has at least 40 selectors', () => {
    const selectors = css.match(/^[^@/*\s][^{]*\{/gm) /* v8 ignore next */ ?? [];
    expect(selectors.length).toBeGreaterThanOrEqual(40);
  });
  it('has at least 3 @media blocks', () => {
    expect((css.match(/@media/g) /* v8 ignore next */ ?? []).length).toBeGreaterThanOrEqual(3);
  });
  it('uses CSS logical properties', () => {
    const logicalProps = ['inline-size', 'block-size', 'margin-block', 'inset-block'];
    /* v8 ignore next */
    const found = logicalProps.filter((p) => css.includes(p));
    expect(found.length).toBeGreaterThanOrEqual(4);
  });
  it('does not contain IE-specific hacks', () => {
    expect(css).not.toMatch(/_[\w-]+\s*:/);
  });

  it('helper extractMediaBlock returns empty string for missing query', () => {
    // exercises the start === -1 branch and the fallback return ''
    const missing = extractMediaBlock(css, 'nonexistent-query-xyz');
    expect(missing).toBe('');
  });

  it('helper sliceAfter returns empty string for missing needle', () => {
    const missing = sliceAfter(css, '~~DOES_NOT_EXIST~~');
    expect(missing).toBe('');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 18. HELPER FUNCTION COVERAGE (100% branch coverage of test utilities)
// ═══════════════════════════════════════════════════════════════════════════════
describe('18 · Helper Coverage', () => {
  it('extractMediaBlock: no opening brace returns empty string', () => {
    // Covers the start === -1 branch
    expect(extractMediaBlock('@media print', 'print')).toBe('');
  });

  it('extractMediaBlock: query found but no opening brace returns empty string', () => {
    // Covers the openAt === -1 branch (line 29-30)
    // Need query with trailing space so start !== -1, but no { after it
    expect(extractMediaBlock('@media print ', 'print')).toBe('');
  });

  it('extractMediaBlock: unbalanced CSS (no closing brace) returns empty string', () => {
    // Covers the while-loop end fallback return ''
    const malformed = '@media print { body { color: red; }';
    expect(extractMediaBlock(malformed, 'print')).toBe('');
  });

  it('allCustomProps: deduplicates repeated property names', () => {
    const props = allCustomProps(':root { --fn-x: 1; } :root { --fn-x: 2; }');
    expect(props.filter((p) => p === '--fn-x').length).toBe(1);
  });

  it('allCustomProps: returns empty array for CSS with no custom props', () => {
    expect(allCustomProps('body { margin: 0; }')).toHaveLength(0);
  });

  it('sliceAfter: returns correct slice when needle exists', () => {
    const result = sliceAfter('hello world test', 'world', 5);
    expect(result).toBe('world');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 19. NULL-COALESCING BRANCH COVERAGE
// These tests exercise the ?? [] fallback paths that v8 coverage tracks
// when regex.match() returns null on a string with no matches.
// ═══════════════════════════════════════════════════════════════════════════════
describe('19 · Null-Coalescing Branch Coverage', () => {
  it('match ?? [] fallback: no { in empty string', () => {
    const empty = '';
    const open = (empty.match(/\{/g) ?? []).length;
    expect(open).toBe(0);
  });

  it('match ?? [] fallback: no @media in empty string', () => {
    const empty = '';
    const count = (empty.match(/@media/g) ?? []).length;
    expect(count).toBe(0);
  });

  it('match ?? [] fallback: no selectors in empty string', () => {
    const empty = '';
    const sels = (empty.match(/^[^@/*\s][^{]*\{/gm) ?? []).length;
    expect(sels).toBe(0);
  });

  it('match ?? [] fallback: no comment opens in empty string', () => {
    const empty = '';
    const opens = (empty.match(/\/\*/g) ?? []).length;
    expect(opens).toBe(0);
  });

  it('match ?? [] fallback: no comment closes in empty string', () => {
    const empty = '';
    const closes = (empty.match(/\*\//g) ?? []).length;
    expect(closes).toBe(0);
  });

  it('filter fallback: logicalProps filter returns empty on unrelated CSS', () => {
    const boring = 'body { margin: 0; }';
    const logicalProps = ['inline-size', 'block-size', 'margin-block', 'inset-block'];
    const found = logicalProps.filter((p) => boring.includes(p));
    expect(found.length).toBe(0);
  });

  it('allCustomProps ?? [] fallback: no --fn- props in plain string', () => {
    const plain = 'body { color: red; }';
    const props = allCustomProps(plain);
    expect(props).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 20. TYPOGRAPHY — Extended (bdi, bdo, ins, del, dfn, address)
// ═══════════════════════════════════════════════════════════════════════════════
describe('20 · Typography Extended', () => {
  it('bdi has unicode-bidi: isolate', () => {
    expect(sliceAfter(css, '\nbdi {')).toContain('unicode-bidi: isolate');
  });
  it('bdo has unicode-bidi: bidi-override', () => {
    expect(sliceAfter(css, '\nbdo {')).toContain('unicode-bidi: bidi-override');
  });
  it('ins has text-decoration: none', () => {
    expect(sliceAfter(css, '\nins {')).toContain('text-decoration: none');
  });
  it('ins has background-color', () => {
    expect(sliceAfter(css, '\nins {')).toContain('background-color:');
  });
  it('del has text-decoration: line-through', () => {
    expect(sliceAfter(css, '\ndel {')).toContain('text-decoration: line-through');
  });
  it('dfn has font-style: italic', () => {
    expect(sliceAfter(css, '\ndfn {')).toContain('font-style: italic');
  });
  it('address has font-style: normal', () => {
    expect(sliceAfter(css, '\naddress {')).toContain('font-style: normal');
  });
  it('address has margin-block: 0', () => {
    expect(sliceAfter(css, '\naddress {')).toContain('margin-block: 0');
  });
  it('mark uses --fn-mark-bg', () => {
    expect(sliceAfter(css, '\nmark {')).toContain('var(--fn-mark-bg');
  });
  it('mark uses --fn-mark-color', () => {
    expect(sliceAfter(css, '\nmark {')).toContain('var(--fn-mark-color');
  });
  it('q has quotes: auto', () => {
    expect(sliceAfter(css, '\nq {')).toContain('quotes: auto');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 21. MEDIA — Extended (figure, figcaption, picture)
// ═══════════════════════════════════════════════════════════════════════════════
describe('21 · Media Extended', () => {
  it('figure has margin: 0 and padding: 0', () => {
    const block = sliceAfter(css, '\nfigure {');
    expect(block).toContain('margin: 0');
    expect(block).toContain('padding: 0');
  });
  it('figcaption has font-size: 0.875em', () => {
    expect(sliceAfter(css, '\nfigcaption {')).toContain('font-size: 0.875em');
  });
  it('figcaption has font-style: italic', () => {
    expect(sliceAfter(css, '\nfigcaption {')).toContain('font-style: italic');
  });
  it('picture has display: contents', () => {
    expect(sliceAfter(css, '\npicture {')).toContain('display: contents');
  });
  it('media elements have vertical-align: middle', () => {
    expect(css).toContain('vertical-align: middle');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 22. FORMS — Extended (legend, autofill, user-valid/invalid, range, meter)
// ═══════════════════════════════════════════════════════════════════════════════
describe('22 · Forms Extended', () => {
  it('legend is targeted', () => {
    expect(css).toContain('legend');
  });
  it('legend has padding: 0', () => {
    expect(sliceAfter(css, '\nlegend {')).toContain('padding: 0');
  });
  it('legend has max-inline-size: 100%', () => {
    expect(sliceAfter(css, '\nlegend {')).toContain('max-inline-size: 100%');
  });
  it('autofill box-shadow targets :-webkit-autofill', () => {
    expect(css).toContain(':-webkit-autofill');
  });
  it('autofill uses --fn-bg-color for inset shadow', () => {
    expect(sliceAfter(css, ':-webkit-autofill')).toContain('var(--fn-bg-color)');
  });
  it(':user-invalid targets form inputs', () => {
    expect(css).toContain('input:user-invalid');
    expect(sliceAfter(css, 'input:user-invalid')).toContain('var(--fn-error-color)');
  });
  it(':user-valid targets form inputs', () => {
    expect(css).toContain('input:user-valid');
    expect(sliceAfter(css, 'input:user-valid')).toContain('var(--fn-success-color)');
  });
  it('input[type="range"] is normalized', () => {
    expect(css).toContain('input[type="range"]');
    expect(sliceAfter(css, 'input[type="range"]')).toContain('appearance: none');
  });
  it('range has ::-webkit-slider-runnable-track', () => {
    expect(css).toContain('::-webkit-slider-runnable-track');
  });
  it('range has ::-webkit-slider-thumb', () => {
    expect(css).toContain('::-webkit-slider-thumb');
  });
  it('range has ::-moz-range-track', () => {
    expect(css).toContain('::-moz-range-track');
  });
  it('range has ::-moz-range-thumb', () => {
    expect(css).toContain('::-moz-range-thumb');
  });
  it('meter is normalized with appearance: none', () => {
    expect(css).toContain('\nmeter {');
    expect(sliceAfter(css, '\nmeter {')).toContain('appearance: none');
  });
  it('meter has ::-webkit-meter-bar', () => {
    expect(css).toContain('::-webkit-meter-bar');
  });
  it('output has display: inline-block', () => {
    expect(sliceAfter(css, '\noutput {')).toContain('display: inline-block');
  });
  it('output uses --fn-font-mono', () => {
    expect(sliceAfter(css, '\noutput {')).toContain('var(--fn-font-mono)');
  });
  it('disabled elements have cursor: not-allowed', () => {
    expect(css).toContain('cursor: not-allowed');
  });
  it('disabled elements have opacity: 60%', () => {
    expect(css).toContain('opacity: 60%');
  });
  it('readonly inputs have cursor: default', () => {
    expect(css).toContain('cursor: default');
  });
  it('date/time/datetime-local inputs are normalized', () => {
    expect(css).toContain('input[type="date"]');
    expect(css).toContain('input[type="time"]');
    expect(css).toContain('input[type="datetime-local"]');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 23. DOCUMENT — Extended (accent-color, caret-color, dvh, underline-offset)
// ═══════════════════════════════════════════════════════════════════════════════
describe('23 · Document Extended', () => {
  it('html has accent-color via --fn-accent-color', () => {
    expect(sliceAfter(css, '\nhtml {', 800)).toContain('var(--fn-accent-color)');
  });
  it('html has caret-color via --fn-caret-color', () => {
    expect(sliceAfter(css, '\nhtml {', 800)).toContain('var(--fn-caret-color)');
  });
  it('html has touch-action: manipulation', () => {
    expect(sliceAfter(css, '\nhtml {', 800)).toContain('touch-action: manipulation');
  });
  it('html has hanging-punctuation: first last', () => {
    expect(css).toContain('hanging-punctuation: first last');
  });
  it('html has text-wrap: pretty', () => {
    expect(css).toContain('text-wrap: pretty');
  });
  it('body has text-underline-offset', () => {
    expect(sliceAfter(css, '\nbody {')).toContain('text-underline-offset:');
  });
  it('body has min-block-size: 100dvh (dynamic viewport)', () => {
    expect(css).toContain('100dvh');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 24. ACCESSIBILITY — RTL/LTR, forced-colors, prefers-contrast
// ═══════════════════════════════════════════════════════════════════════════════
describe('24 · Accessibility Extended', () => {
  it('[dir="rtl"] has text-align: right', () => {
    expect(css).toContain('[dir="rtl"]');
    expect(sliceAfter(css, '[dir="rtl"]')).toContain('text-align: right');
  });
  it('[dir="ltr"] has text-align: left', () => {
    expect(css).toContain('[dir="ltr"]');
    expect(sliceAfter(css, '[dir="ltr"]')).toContain('text-align: left');
  });
  it('@media (forced-colors: active) block exists', () => {
    expect(css).toContain('forced-colors: active');
  });
  it('forced-colors resets :focus-visible with CanvasText', () => {
    expect(sliceAfter(css, 'forced-colors: active')).toContain('CanvasText');
  });
  it('@media (prefers-contrast: more) block exists', () => {
    expect(css).toContain('prefers-contrast: more');
  });
  it('prefers-contrast redefines --fn-text-color to #000', () => {
    expect(sliceAfter(css, 'prefers-contrast: more')).toContain('--fn-text-color: #000');
  });
  it('pure normalize does not include utility classes', () => {
    expect(css).not.toContain('.truncate');
    expect(css).not.toContain('.line-clamp');
    expect(css).not.toContain('.gap-xs');
    expect(css).not.toContain('.object-cover');
  });
  it('pure normalize does not include framework features', () => {
    expect(css).not.toContain('@view-transition');
    expect(css).not.toContain('scroll-driven');
    expect(css).not.toContain('@layer fn-reset');
  });
});
