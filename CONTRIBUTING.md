# Contributing to fresh-normalize

Thank you for your interest in contributing! This guide will help you get started.

## Philosophy

`fresh-normalize` is **not** a CSS reset or opinionated design system. It's a normalization library
— meaning every rule should fix a real browser inconsistency, not impose a design preference.

**The golden rule:** If a rule is not fixing a cross-browser inconsistency, it doesn't belong here.

## Browser Target

We target **evergreen browsers only**:

| Browser           | Minimum Version |
| ----------------- | --------------- |
| Chrome / Chromium | 120+            |
| Firefox           | 120+            |
| Safari            | 17+             |
| Edge              | 120+            |

No IE, no legacy Safari hacks (pre-17), no dead browsers.

## Development Setup

```bash
# Clone the repo
git clone [https://github.com/jubayerhossaindev/fresh-normalize.git](https://github.com/jubayerhossaindev/fresh-normalize.git)
cd fresh-normalize

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Start the dev server
npm run dev
# → Opens http://localhost:8080/test/page/preview.html

# Run all checks
npm test

# Run linting only
npm run lint

# Run browser tests
npm run test:browser
```
