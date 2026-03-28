# Setup Guide — fresh-normalize

This guide walks you through publishing `fresh-normalize` end-to-end on a **free GitHub account**.

---

## Step 1 — Create GitHub repo

1. Go to <https://github.com/new>
2. Name it `fresh-normalize`
3. Set to **Public** (required for free npm publish + free Codecov)
4. **Do NOT** initialize with README (you have one already)

Then push this project:

```bash
cd fresh-normalize
git init
git add .
git commit -m "feat: initial release of fresh-normalize"
git remote add origin https://github.com/YOUR_USERNAME/fresh-normalize.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Create npm account & token

1. Sign up at <https://www.npmjs.com> (free)
2. Go to **Account → Access Tokens → Generate New Token**
3. Choose **Automation** token type
4. Copy the token (starts with `npm_...`)

---

## Step 3 — Add NPM_TOKEN to GitHub

1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `NPM_TOKEN`
4. Value: paste your npm token
5. Click **Add secret**

> **That's the only secret needed.** `GITHUB_TOKEN` is automatic — GitHub provides it free.

---

## Step 4 — Update YOUR_USERNAME in files

Replace `YOUR_USERNAME`, `YOUR_NAME`, `YOUR_EMAIL`, `YOUR_URL` in:

- `package.json`
- `README.md`
- `.github/dependabot.yml`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/SECURITY.md`
- `CONTRIBUTING.md`
- `LICENSE`
- `Dockerfile`
- `test/page/preview.html`

Quick replace (macOS/Linux):

```bash
grep -rl 'YOUR_USERNAME' . --include='*.json' --include='*.md' --include='*.yml' --include='*.html' \
  | xargs sed -i '' 's/YOUR_USERNAME/myusername/g'
```

---

## Step 5 — How semantic-release works (automatic versioning)

`semantic-release` reads your **commit messages** to determine the version bump:

| Commit message starts with        | Version bump          | Example                                   |
| --------------------------------- | --------------------- | ----------------------------------------- |
| `fix:`                            | patch (1.0.0 → 1.0.1) | `fix(forms): normalize select in Firefox` |
| `feat:`                           | minor (1.0.0 → 1.1.0) | `feat(dialog): add popover normalization` |
| `feat!:` or `BREAKING CHANGE`     | major (1.0.0 → 2.0.0) | `feat!: drop Safari 16 support`           |
| `docs:`, `chore:`, `test:`, `ci:` | **no release**        | `docs: update README`                     |

**No manual version bumping needed.** Just push commits with proper prefixes.

---

## Step 6 — Your first release

After setup, your first release happens automatically when you push to `main`:

```bash
git commit -m "feat: initial release"
git push origin main
```

The CI will:

1. ✅ Lint CSS
2. ✅ Run unit tests (100% coverage)
3. ✅ Run E2E tests (Chromium, Firefox, WebKit)
4. ✅ Build minified dist
5. 🚀 semantic-release → publishes to npm as `v1.0.0`
6. 📝 Creates GitHub Release with changelog
7. 💾 Commits updated `CHANGELOG.md` back to main

---

## Step 7 — (Optional) Codecov for coverage badges

1. Go to <https://codecov.io> and sign in with GitHub (free for public repos)
2. Add your repo
3. Copy your upload token
4. Add it as repo secret: `CODECOV_TOKEN`
5. Add badge to README:

```markdown
[![codecov](https://codecov.io/gh/YOUR_USERNAME/fresh-normalize/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/fresh-normalize)
```

---

## Step 8 — (Optional) GitHub Pages demo

Enable GitHub Pages:

1. Repo → **Settings → Pages**
2. Source: **GitHub Actions**

The `docs.yml` workflow auto-deploys the preview page on every push to main.

---

## Free Account Limitations

| Feature                | Free Account       | Workaround                   |
| ---------------------- | ------------------ | ---------------------------- |
| npm publish            | ✅ Works           | Uses `NPM_TOKEN` secret      |
| GitHub Releases        | ✅ Works           | `GITHUB_TOKEN` built-in      |
| semantic-release       | ✅ Works           | No paid features needed      |
| Protected environments | ❌ Not available   | Not used — jobs run directly |
| Private repos CI       | Limited minutes    | Use public repo              |
| Codecov                | ✅ Free for public | Sign up at codecov.io        |

---

## Troubleshooting

**`semantic-release` says "no release needed"?** Your commits don't use conventional commit format.
Make sure commits start with `feat:`, `fix:`, etc.

**npm publish fails with 403?** Check that `NPM_TOKEN` secret is set correctly and the package name
isn't taken.

**Tests fail on `coverage thresholds`?** Every test in `test/unit/fresh-normalize.test.ts` must
pass. Run `npm test` locally first.

**Branch protection blocks `semantic-release` push?** On free accounts, you can't use required
status checks + auto-push. Either disable branch protection or use a Personal Access Token
(`GH_PAT`) instead of `GITHUB_TOKEN`.
