# HELIO — Landing Page Selector

A showcase of **30+ single-page landing-page templates** built for different professions and use cases (CVs, portfolios, business landing pages, gamified demos). The root `index.html` is a HELIO-branded gallery that lets visitors browse every template as a 3D flip-card and open a live demo of each one.

- **Repository:** `github.com/jaraserg/LandingPages`
- **Live site (when Pages is enabled):** `https://jaraserg.github.io/LandingPages/`
- **License:** See individual template assets; treat as proprietary unless noted otherwise.

---

## Quick start

This is a **pure-static, zero-build** site. No `npm install`, no bundler, no transpiler required.

```bash
# Clone
git clone https://github.com/jaraserg/LandingPages.git
cd LandingPages

# Option A — open directly
open index.html            # macOS
xdg-open index.html        # Linux
start index.html           # Windows

# Option B — serve locally (recommended for fetch/relative-asset work)
python3 -m http.server 8000
# then visit http://localhost:8000/
```

> A local server is recommended because some templates use ES modules (`<script type="module">`) or fetch local JSON, which the `file://` protocol blocks in modern browsers.

---

## Repository layout

```
LandingPages/
├── index.html              # HELIO showcase gallery (the landing page)
├── README.md               # this file
├── docs/
│   ├── SHOWCASE.md         # catalogue of every template with one-line descriptions
│   └── deployment.md       # step-by-step GitHub Pages activation guide
├── scripts/
│   ├── deploy.sh           # one-shot gh-pages deployment helper (Unix)
│   ├── deploy.ps1          # Windows variant
│   └── verify.py           # sanity-check that every template folder has an index.html
├── optimize_html.py        # legacy: adds viewport meta + lazy-loading + footer
├── update_back_button.py   # legacy: injects the floating "← Showcase" back button
└── <TemplateName>/         # one folder per template (see below)
    ├── index.html
    ├── styles.css          # or style.css — varies by template
    ├── script.js           # optional
    └── example.png         # preview image, not served on Pages
```

### Template directory structure (canonical)

Every **complete** template follows this pattern:

```
<Name>/
├── index.html      # entry point — must be lowercase on Linux/GH-Pages
├── styles.css      # styling (some use style.css — both fine on case-insensitive FS)
├── script.js       # client-side JS (optional, e.g. for the CV form)
└── example.png     # preview shown in the showcase (optional)
```

Some templates deviate (see "Templates that need attention" below).

---

## How to add a new template

1. **Create a folder** under the repo root. Use `PascalCase` or `camelCase` (the showcase is case-sensitive on GitHub Pages because Pages serves from Linux).
   ```bash
   mkdir NewTemplate
   ```
2. **Add `index.html`** — link its stylesheet as `styles.css` (not `./NewTemplate/styles.css`) and reference any scripts as `script.js`. Use **relative** paths so the template works at `https://jaraserg.github.io/LandingPages/NewTemplate/`.
3. **Include a "← Showcase" back button** anchored to the bottom-left, so visitors can return to the gallery:
   ```html
   <a href="../index.html"
      style="position:fixed;bottom:20px;left:20px;z-index:999999;
             background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);
             color:white;padding:8px 16px;border-radius:20px;
             font-family:sans-serif;font-size:12px;font-weight:500;
             border:1px solid rgba(255,255,255,0.2);text-decoration:none;
             display:flex;align-items:center;gap:6px;">
       ← Showcase
   </a>
   ```
4. **Add a card** to `index.html` inside the `templates-grid` (search for `template-card`). Copy an existing `<a class="template-card">…</a>` block, point `href` at `./<Name>/index.html`, and update the title, tags, and description.
5. **Run the verifier** to make sure you didn't miss anything:
   ```bash
   python3 scripts/verify.py
   ```
6. **Commit & push.** GitHub Pages will pick up the change within ~1 minute (assuming Pages is already enabled — see `docs/deployment.md`).

---

## Templates that need attention

These templates are listed but **not linked from the showcase** because they're incomplete or use a different build pipeline.

| Folder | Status | Why it's hidden |
| --- | --- | --- |
| `Blueprint/` | **WIP** — no `index.html`, only screenshot references. Documented in `docs/SHOWCASE.md` as a planned technical-blueprint / engineering-schematic CV style. |
| `Magazine/` | **React + Vite app**, not a static page. Deploying the source folder to GitHub Pages shows a blank `<div id="root">`. Needs `npm run build` → `dist/` for the front-end to render. |
| `CleanFlex/` | **Untracked WIP.** Not yet committed to git and not linked from the showcase. |

All three will appear in `docs/SHOWCASE.md` so visitors and contributors can find them, but the root gallery filters them out.

---

## Deploying to GitHub Pages

The repo has **no build step**, so the fastest path is **Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)`**.

Full step-by-step with troubleshooting: see **[`docs/deployment.md`](./docs/deployment.md)**.

The `scripts/deploy.sh` / `scripts/deploy.ps1` helpers automate the alternative **`gh-pages` branch** workflow if you ever want template-only deploys.

---

## Contributing

1. Fork → feature branch → PR.
2. Run `python3 scripts/verify.py` before pushing.
3. Keep templates self-contained: no external CDN dependencies unless they significantly improve the demo, and **always** use relative asset paths.
4. Don't commit `node_modules/`, `dist/`, or `.env` (already in `.gitignore` at the repo root when needed).

---

## Tech notes

- **No framework**, no `package.json` at the repo root. Templates that need a framework (e.g. `Magazine/`'s React + Vite) keep their `package.json` inside their own folder.
- **Fonts** are loaded from `fonts.googleapis.com` in the root showcase only; individual templates either inherit those fonts or use system stack.
- **Images** in templates fall back to `loremflickr.com` if a local file is missing — that's `optimize_html.py`'s doing.
- **Back-button**: `update_back_button.py` injected the floating "← Showcase" link into every template that was processed. New templates need the link added manually (see snippet above).