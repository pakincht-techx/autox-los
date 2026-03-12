---
description: Git branching and commit workflow for feature development
---

# Git Flow Workflow

## Default: Push directly to main

Unless the user explicitly requests a feature branch, always push directly to `main`.

## 1. Stage and commit with conventional commits

```bash
git add .
git commit -m "<type>: <description in English>"
```

Commit types:
| Type | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | UI/CSS only |
| `docs:` | Documentation |
| `refactor:` | Code restructure, no behavior change |
| `chore:` | Build, tooling, or config changes |

## 2. Push to main

// turbo
```bash
git push origin main
```

## (Optional) Feature branch workflow

Only use when the user explicitly asks to work on a branch.

```bash
git checkout -b <type>/<short-name>
```

Branch naming:
- `feat/<name>` — new features (e.g. `feat/loan-tracking`)
- `fix/<name>` — bug fixes (e.g. `fix/date-validation`)
- `style/<name>` — UI/CSS changes (e.g. `style/table-hover`)
- `docs/<name>` — documentation (e.g. `docs/api-guide`)

After work is done:
```bash
git push origin <branch-name>
```

Then create a Pull Request on GitHub targeting `main`.
