#!/usr/bin/env bash
# deploy.sh — push the LandingPages repo to a `gh-pages` branch for GitHub Pages.
#
# OPTIONAL. The recommended path is Settings → Pages → Deploy from a branch → main.
# Use this script only if you want to isolate the deployed site on its own branch.
#
# Requirements: git on PATH.
#
# Usage:
#   bash scripts/deploy.sh
#
# What it does:
#   1. Checks that index.html exists at the repo root.
#   2. Splits the current `main` branch into the `gh-pages` branch using
#      `git subtree split` (this preserves history and doesn't wipe main).
#   3. Force-pushes the new `gh-pages` branch to origin.
#   4. Reminds you to set Pages → Source: gh-pages / / (root).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BRANCH="gh-pages"

cd "$REPO_ROOT"

# 1. Sanity check
if [[ ! -f index.html ]]; then
  echo "ERROR: index.html not found at repo root. Aborting." >&2
  exit 1
fi

# 2. Remote check
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "ERROR: no 'origin' remote configured. Add one with:" >&2
  echo "  git remote add origin https://github.com/jaraserg/LandingPages.git" >&2
  exit 1
fi

# 3. Make sure we have a clean working tree before splitting
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: working tree has uncommitted changes. Commit or stash them before deploying." >&2
  echo "  git add -A && git commit -m 'Prepare deploy'" >&2
  exit 1
fi

echo "→ Splitting current 'main' into branch '$BRANCH'…"
git branch -f "$BRANCH" main
# Reset the branch contents to the working tree
git checkout "$BRANCH"

echo "→ Force-pushing '$BRANCH' to origin…"
git push origin "$BRANCH" --force

git checkout main >/dev/null 2>&1 || true

echo ""
echo "✅ Pushed to '$BRANCH'."
echo ""
echo "Next step: open https://github.com/jaraserg/LandingPages/settings/pages"
echo "  Source : Deploy from a branch"
echo "  Branch : $BRANCH"
echo "  Folder : / (root)"
echo "  Save."
echo ""
echo "Site will be live at: https://jaraserg.github.io/LandingPages/"