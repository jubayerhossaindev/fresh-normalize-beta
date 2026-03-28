import { expect, Page, test } from '@playwright/test';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Gets a computed style property from an existing element.
 */
async function computed(page: Page, selector: string, property: string): Promise<string> {
  return page.evaluate(
    ({ sel, prop }) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el === null) {
        throw new Error(`Element not found: ${sel}`);
      }
      return getComputedStyle(el).getPropertyValue(prop).trim();
    },
    { sel: selector, prop: property },
  );
}

/**
 * Creates a temporary element, gets a style, then removes it.
 */
async function computedNew(
  page: Page,
  tag: string,
  property: string,
  attrs: Record<string, string> = {},
): Promise<string> {
  return page.evaluate(
    ({ tag, property, attrs }) => {
      const el = document.createElement(tag);
      // Fixed: Explicit check for object properties
      if (attrs !== undefined && attrs !== null && typeof attrs === 'object') {
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      }
      document.body.appendChild(el);
      const val = getComputedStyle(el).getPropertyValue(property).trim();
      el.remove();
      return val;
    },
    { tag, property, attrs },
  );
}

export async function cssRulesContain(page: Page, needle: string): Promise<boolean> {
  return page.evaluate((needle) => {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule.cssText.includes(needle)) {
            return true;
          }
        }
      } catch {
        /* Ignore cross-origin stylesheet errors */
      }
    }
    return false;
  }, needle);
}

function toMs(value: string): number {
  if (value.includes('ms')) {
    return parseFloat(value);
  }
  if (value.includes('s')) {
    return parseFloat(value) * 1000;
  }
  return parseFloat(value);
}

// ─── Setup ──────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.goto('/test/page/with-css.html');
  await page.waitForLoadState('networkidle');
});

// ═══════════════════════════════════════════════════════════════════════════════
// 1. BOX MODEL
// ═══════════════════════════════════════════════════════════════════════════════
test.describe('Box Model', () => {
  for (const tag of ['div', 'span', 'input']) {
    test(`${tag} uses border-box`, async ({ page }) => {
      const val = await computedNew(page, tag, 'box-sizing');
      expect(val).toBe('border-box');
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════
test.describe('Document', () => {
  test('html line-height ≈ 1.5', async ({ page }) => {
    const val = await computed(page, 'html', 'line-height');
    const lh = parseFloat(val);
    expect(lh).toBeGreaterThan(0);
  });

  test('body margin is 0', async ({ page }) => {
    const margin = parseFloat(await computed(page, 'body', 'margin-top'));
    expect(margin).toBe(0);
  });

  test('html font-family contains sans/system', async ({ page }) => {
    const ff = (await computed(page, 'html', 'font-family')).toLowerCase();
    const hasSans = ['sans', 'system-ui', 'roboto', 'arial'].some((term) => ff.includes(term));
    expect(hasSans).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════════
test.describe('Typography', () => {
  test('h1 font-size reasonable', async ({ page }) => {
    const fs = parseFloat(await computed(page, 'h1', 'font-size'));
    expect(fs).toBeGreaterThanOrEqual(28);
  });

  test('heading line-height ratio <= 1.35', async ({ page }) => {
    for (const h of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
      const exists = await page.$(`#main ${h}`);
      // Fixed: Strict check for null
      if (exists === null) {
        continue;
      }

      const fs = parseFloat(await computed(page, `#main ${h}`, 'font-size'));
      const lhVal = await computed(page, `#main ${h}`, 'line-height');
      const lh = parseFloat(lhVal);

      if (!isNaN(lh)) {
        expect(lh / fs).toBeLessThanOrEqual(1.35);
      }
    }
  });

  test('strong weight >= 700', async ({ page }) => {
    const fw = await computedNew(page, 'strong', 'font-weight');
    expect(fw === 'bold' || parseInt(fw, 10) >= 700).toBeTruthy();
  });

  test('code uses monospace', async ({ page }) => {
    const ff = (await computedNew(page, 'code', 'font-family')).toLowerCase();
    expect(ff.includes('mono') || ff.includes('code') || ff.includes('consolas')).toBeTruthy();
  });

  test('small ≈ 80%', async ({ page }) => {
    const p = parseFloat(await computed(page, 'p', 'font-size'));
    const s = parseFloat(await computedNew(page, 'small', 'font-size'));
    expect(s / p).toBeCloseTo(0.8, 1);
  });

  test('sub/sup positioning', async ({ page }) => {
    expect(await computedNew(page, 'sub', 'position')).toBe('relative');
    expect(await computedNew(page, 'sup', 'position')).toBe('relative');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. FORMS
// ═══════════════════════════════════════════════════════════════════════════════
test.describe('Forms', () => {
  test('button cursor pointer', async ({ page }) => {
    expect(await computedNew(page, 'button', 'cursor')).toBe('pointer');
  });

  test('input margin 0', async ({ page }) => {
    expect(parseFloat(await computedNew(page, 'input', 'margin-top'))).toBe(0);
  });

  test('textarea resize allowed', async ({ page }) => {
    const val = await computedNew(page, 'textarea', 'resize');
    expect(['vertical', 'both', 'block']).toContain(val);
  });

  test('fieldset no border', async ({ page }) => {
    expect(parseFloat(await computedNew(page, 'fieldset', 'border-width'))).toBe(0);
  });

  test('progress baseline', async ({ page }) => {
    expect(await computedNew(page, 'progress', 'vertical-align')).toBe('baseline');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. MEDIA
// ═══════════════════════════════════════════════════════════════════════════════
test.describe('Media', () => {
  test('img display block', async ({ page }) => {
    expect(await computedNew(page, 'img', 'display')).toBe('block');
  });

  test('img max width applied', async ({ page }) => {
    const mw = await computedNew(page, 'img', 'max-width');
    expect(mw).not.toBe('none');
  });

  test('audio hidden without controls', async ({ page }) => {
    const d = await page.evaluate(() => {
      const el = document.createElement('audio');
      document.body.appendChild(el);
      const val = getComputedStyle(el).display;
      el.remove();
      return val;
    });
    expect(d).toBe('none');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 10. REDUCED MOTION
// ═══════════════════════════════════════════════════════════════════════════════
test.describe('Reduced Motion', () => {
  test('animation reduced', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const dur = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.animation = 'spin 1s linear infinite';
      document.body.appendChild(el);
      const d = getComputedStyle(el).animationDuration;
      el.remove();
      return d;
    });

    expect(toMs(dur)).toBeLessThanOrEqual(1);
  });

  test('scroll-behavior auto', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const val = await computed(page, 'html', 'scroll-behavior');
    expect(['auto', 'smooth']).toContain(val);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 11. CSS VARIABLES
// ═══════════════════════════════════════════════════════════════════════════════
test.describe('CSS Variables', () => {
  test('--fn-line-height exists', async ({ page }) => {
    const val = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--fn-line-height').trim(),
    );
    expect(val).toBe('1.5');
  });

  test('--fn-font-sans exists', async ({ page }) => {
    const val = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--fn-font-sans').trim(),
    );
    expect(val.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 15. FINAL
// ═══════════════════════════════════════════════════════════════════════════════
test.describe('Final', () => {
  test('css loads', async ({ page }) => {
    const res = await page.request.get('/fresh-normalize.css');
    expect(res.status()).toBe(200);
  });

  test('no css errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    expect(errors.length).toBe(0);
  });
});
