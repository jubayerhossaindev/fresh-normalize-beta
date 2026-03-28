# 🌿 fresh-normalize

<div align="center">

**The freshest CSS reset for the web of 2026** ✨

_Beautifully consistent. Effortlessly modern. Zero opinions, maximum harmony._

**Lightweight • Accessible • Dark-mode native • Themed with love**

---

![License](https://img.shields.io/badge/license-MIT-8b5cf6?style=for-the-badge)

**Made for the browsers of tomorrow. Feels like magic today.**

</div>

---

## Why fresh-normalize? 🌟

Tired of fighting browser quirks? **fresh-normalize** is a forward-thinking CSS normalization
library built exclusively for the modern web.

It smooths out inconsistencies, injects delightful accessible defaults, and hands you full creative
control through **25+ reactive CSS custom properties**.

> [!TIP] No heavy design systems. No legacy baggage. Just pure, fresh harmony for your next
> masterpiece.

### 💎 Key Benefits

| Feature                | What Makes It Fresh                                                     |
| :--------------------- | :---------------------------------------------------------------------- |
| 🎯 **Evergreen Only**  | Optimized for Chrome 120+, Safari 17+, and beyond.                      |
| 🌓 **Auto-Adaptive**   | Native `prefers-color-scheme` support with gorgeous dark-mode defaults. |
| ♿ **A11y First**      | Intelligent `focus-visible`, skip links, and reduced motion built-in.   |
| 🎨 **Live Theming**    | 25+ design tokens—change your entire brand vibe in seconds.             |
| 📱 **Fluid Viewports** | Touch-friendly logic using dynamic viewport units (`dvh`, `dvw`).       |
| ⚡ **Zero Bloat**      | Pure CSS. No JavaScript. No dependencies.                               |

---

## Fresh vs. The Old Guard 🥊

| Feature            |  fresh-normalize   | normalize.css | sanitize.css | CSS Reset |
| :----------------- | :----------------: | :-----------: | :----------: | :-------: |
| **Dark Mode**      |    ✅ Built-in     |      ❌       |      ❌      |    ❌     |
| **CSS Variables**  |   ✅ 25+ tokens    |      ❌       |      ❌      |    ❌     |
| **Accessibility**  |   ✅ A11y-native   |   ⚠️ Basic    |   ⚠️ Basic   |    ❌     |
| **Focus States**   | ✅ `focus-visible` |      ❌       |   ⚠️ Basic   |    ❌     |
| **Form Controls**  |   ✅ Modernized    |  ⚠️ Partial   |  ⚠️ Partial  |    ❌     |
| **Size (gzipped)** |     **~8 KB**      |     ~2 KB     |    ~3 KB     |  ~0.5 KB  |

---

## Quick Start 🚀

### 1. Install

```bash
# Pick your poison
npm install fresh-normalize
pnpm add fresh-normalize
yarn add fresh-normalize
```

### 2\. Implementation

Simply drop the CDN link into your `<head>`:

```html
<link
  rel="stylesheet"
  href="[https://cdn.jsdelivr.net/npm/fresh-normalize/fresh-normalize.css](https://cdn.jsdelivr.net/npm/fresh-normalize/fresh-normalize.css)"
/>
```

**Or import it directly in your CSS architecture:**

```css
@import 'fresh-normalize';

:root {
  --fn-link-color: #22d3ee; /* Set your vibe */
  --fn-font-sans: 'Geist', sans-serif;
}
```

---

## What Makes It Feel Alive ✨

### 🌓 Automatic Dark Mode

No more flashing white screens. It detects system preferences instantly and applies a curated dark
palette that’s easy on the eyes.

### 📋 Form Controls That Don’t Suck

Sliders, date pickers, and checkboxes are finally consistent. We’ve handled the weird Webkit/Mozilla
pseudo-elements so you don't have to.

### 🛠 Utility Classes Included

```html
<span class="sr-only">Hidden but screen-reader friendly</span>
<a href="#main" class="skip-link">Skip to content</a>
```

---

## Customization — Your Style, Instantly 🎨

Everything is controlled by CSS Variables. Overriding them is as simple as:

```css
:root {
  /* Brand Identity */
  --fn-accent-color: #a78bfa;
  --fn-focus-color: #ec4899;

  /* Typography */
  --fn-line-height: 1.65;
  --fn-radius: 0.75rem;

  /* Scrollbar Aesthetics */
  --fn-scrollbar-thumb: #4ade80;
}
```

---

## Browser Support 🌐

**Only the future matters.** We support the last 2 major versions of:

- ✅ Chrome & Edge (120+)
- ✅ Firefox (120+)
- ✅ Safari (17+)
- ✅ Chrome Android & iOS Safari

---

## Contributing 🤝

We ❤️ fresh ideas\!

1. **Fork** the repository.
2. **Create** your feature branch: `git checkout -b feature/fresh-idea`.
3. **Commit** your changes: `git commit -m 'Add some freshness'`.
4. **Push** to the branch: `git push origin feature/fresh-idea`.
5. **Open** a Pull Request.

---

**Made with ❤️ for the modern web**

[Contributing](https://www.google.com/search?q=CONTRIBUTING.md) •
[License](https://www.google.com/search?q=LICENSE) •
[Changelog](https://www.google.com/search?q=CHANGELOG.md)

[⬆ Back to top](https://www.google.com/search?q=%23-fresh-normalize)
