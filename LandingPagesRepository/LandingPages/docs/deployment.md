# Deploying to GitHub Pages

This repo is **pure static HTML/CSS/JS** — there is no build step. The fastest path to a live site is **Settings → Pages → Deploy from a branch**.

---

## Option A — Branch deploy (recommended, zero config)

### 1. Push the repo to GitHub

If not already done:

```bash
cd LandingPages
git remote add origin https://github.com/jaraserg/LandingPages.git
git push -u origin main
```

### 2. Enable Pages

1. Open **https://github.com/jaraserg/LandingPages/settings/pages**.
2. Under **Source**, choose **Deploy from a branch**.
3. **Branch:** `main`, **Folder:** `/ (root)`.
4. Click **Save**.

GitHub will start a workflow named `pages build and deployment`. Wait ~30–60 seconds.

### 3. Visit the live site

After the workflow succeeds, your site is live at:

```
https://jaraserg.github.io/LandingPages/
```

### 4. (Optional) Custom domain

In **Settings → Pages → Custom domain**, enter your domain (e.g. `landingpages.jarad.co`) and click **Save**. Add the DNS records GitHub shows you. Pages will auto-provision a Let's Encrypt certificate.

---

## Option B — `gh-pages` branch (use only if you want template-only deploys)

Some teams prefer to keep `main` clean and serve from a separate `gh-pages` branch. This repo includes `scripts/deploy.sh` / `scripts/deploy.ps1` to automate that.

### 1. Install the GitHub CLI

```bash
# macOS
brew install gh

# Windows
winget install --id GitHub.cli

# Linux
sudo apt install gh
```

Then authenticate:

```bash
gh auth login
```

### 2. Run the deploy script

**Unix / Git Bash on Windows:**

```bash
bash scripts/deploy.sh
```

**PowerShell on Windows:**

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1
```

The script will:

1. Sanity-check that `index.html` exists at the repo root.
2. `git checkout -B gh-pages` (or create the branch).
3. `git push --force origin gh-pages`.
4. Tell you to set Pages → Source: `gh-pages` / `/ (root)`.

### 3. Tell Pages to use `gh-pages`

**Settings → Pages → Source: `Deploy from a branch` → `gh-pages` / `/ (root)` → Save.**

---

## Verification checklist

After enabling Pages, open the live URL and confirm:

- [ ] **Showcase loads** — the HELIO gallery at `/LandingPages/` shows all 30+ flip-cards.
- [ ] **Template links work** — click any card and the corresponding template's `index.html` loads. Pay special attention to **case-sensitive** folder names (`Architect/`, `OpticalConsultant/`, `ExecutiveAssistant/`, etc.).
- [ ] **Back button** — every template's bottom-left "← Showcase" pill returns you to `/`.
- [ ] **No 404s in DevTools** — open DevTools → Network tab, reload, and confirm no red 404 entries.
- [ ] **Mobile** — resize the browser to ~390 px wide. The showcase grid should collapse to a single column and template pages should remain readable.

### Quick verifier

```bash
python3 scripts/verify.py
```

This walks every subdirectory, prints whether `index.html` is present, and exits non-zero if any are missing.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Showcase loads but a specific template card opens a blank page | The template folder name's case doesn't match the `href` in `index.html` (GitHub Pages runs on Linux, which is case-sensitive). | Rename the folder so it matches the link. Run `python3 scripts/verify.py` after to confirm. |
| 404 on the root | Pages not enabled, or source set to a non-existent branch. | **Settings → Pages** → set `main` / `/ (root)`. |
| Template shows a blank `<div id="root">` | It's a React/Vite app (currently `Magazine/`). Source files can't be served directly. | Build with `cd Magazine && npm install && npm run build` and either configure Vite's `base: '/LandingPages/Magazine/'`, or hide the template from the showcase until a build pipeline is added. |
| Asset 404s (CSS/JS/images) | Hard-coded absolute paths like `/styles.css` instead of `styles.css`. | Make all asset paths **relative** to the template folder. |
| "There isn't a GitHub Pages site here" | The repo is private and Pages is disabled for private repos on your plan, OR Pages hasn't been enabled at all. | **Settings → Pages → Save** with the desired source. |
| Fonts don't load | Ad-blocker or offline sandbox blocking `fonts.googleapis.com`. | Templates should ideally also include a system-font fallback (most already do via `font-family: sans-serif`). |

---

## Custom 404 page

Drop a `404.html` at the repo root and GitHub Pages will serve it automatically when a template link breaks.

---

## Re-deploying

Every push to the configured branch triggers a fresh deploy in ~30 s. To watch:

```bash
gh run watch --repo jaraserg/LandingPages
```