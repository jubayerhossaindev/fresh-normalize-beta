# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] — 2026-01-01

### Added

- Initial release of `fresh-normalize`
- CSS custom properties (`--fn-*`) for all configurable values
- Auto dark mode support via `prefers-color-scheme: dark`
- Accessibility utilities: `.sr-only` and `.skip-link`
- Modern `:focus-visible` focus ring (keyboard-only, no mouse ring)
- Reduced motion support via `prefers-reduced-motion: reduce`
- Scrollbar normalization (Firefox + Chrome/WebKit)
- `<dialog>` and `[popover]` element normalization
- `::file-selector-button` normalization (modern standard)
- Responsive media defaults (`max-inline-size: 100%`, `display: block`)
- Table normalization with `border-collapse: collapse`
- Print styles with link URL expansion
- Full CI/CD pipeline (GitHub Actions, npm auto-publish, Docker)
- Multi-browser acceptance tests (Chromium, Firefox, WebKit, Edge)
- Unit tests with Vitest
- Bundle size budget enforcement

### Philosophy

- Targets evergreen browsers only (Chrome 120+, Firefox 120+, Safari 17+)
- No IE / legacy browser hacks
- CSS logical properties where appropriate
- All custom properties follow `--fn-*` naming convention

[Unreleased]: https://github.com/YOUR_USERNAME/fresh-normalize/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/YOUR_USERNAME/fresh-normalize/releases/tag/v1.0.0
