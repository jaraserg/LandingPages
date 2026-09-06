#!/usr/bin/env python3
"""
verify.py — sanity-check every template folder has an index.html
and that the filename case matches what's safe on GitHub Pages (case-sensitive Linux).

Exits 0 if everything is OK, 1 otherwise. Prints a one-line per-template report.
"""

import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Folders that are intentionally not served as static Pages (WIP / build-pipeline).
# These are *allowed* to be missing index.html; we still report on them.
WIP_FOLDERS = {"Blueprint", "CleanFlex"}

# Folders linked from the root showcase that we can verify in-shell by
# grepping index.html. We keep a separate "linked" set so the verifier
# can warn if a *linked* folder is empty.
def find_linked_templates(root_index: str):
    import re
    if not os.path.isfile(root_index):
        return set()
    with open(root_index, "r", encoding="utf-8") as f:
        html = f.read()
    # matches href="./Foo/index.html" — case-sensitive
    return set(m.group(1) for m in re.finditer(r'href="\./([A-Za-z0-9_]+)/index\.html"', html))


def main() -> int:
    index_html = os.path.join(REPO_ROOT, "index.html")
    linked = find_linked_templates(index_html)

    problems: list[str] = []
    rows: list[tuple[str, str, str]] = []

    for entry in sorted(os.listdir(REPO_ROOT)):
        full = os.path.join(REPO_ROOT, entry)
        if not os.path.isdir(full):
            continue
        if entry.startswith(".") or entry in {"node_modules", "dist", "docs", "scripts"}:
            continue

        # Find any index.html regardless of case (so we can warn on the casing)
        found_case = None
        for name in os.listdir(full):
            if name.lower() == "index.html":
                found_case = name
                break

        if not found_case:
            status = "MISSING"
            note = "WIP" if entry in WIP_FOLDERS else "❌"
            if entry not in WIP_FOLDERS:
                problems.append(f"{entry}: missing index.html")
        elif found_case != "index.html":
            # Wrong case — will 404 on GitHub Pages (Linux FS is case-sensitive)
            status = f"WRONG CASE ({found_case})"
            note = "❌ rename to index.html"
            problems.append(f"{entry}: filename is '{found_case}', must be 'index.html' (case)")
        else:
            status = "OK"
            note = "✅" if entry in linked else "— (not linked from showcase)"

        rows.append((entry, status, note))

    width_name = max(len(r[0]) for r in rows) if rows else 10
    for name, status, note in rows:
        print(f"  {name:<{width_name}}  {status:<22}  {note}")

    print()
    if problems:
        print(f"❌ {len(problems)} problem(s) found:")
        for p in problems:
            print(f"   - {p}")
        return 1
    print("✅ All templates look good.")
    return 0


if __name__ == "__main__":
    sys.exit(main())