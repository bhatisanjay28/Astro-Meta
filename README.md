# Astro-Meta — Vyotish-Astro meta repository

This is the **meta repository** for the Vyotish-Astro project. It maps the project's
implementation repositories as git submodules and hosts the repository catalog.

## Repositories in this project

| Repo | Role | Live |
|------|------|------|
| [Astro-Frontend](https://github.com/bhatisanjay28/Astro-Frontend) | Website (React + Vite) | https://vyotish.com |
| [Astro-Backend](https://github.com/bhatisanjay28/Astro-Backend) | API (Node.js + Express) | — |

The full catalog lives in [`docs/repo-catalog.yaml`](docs/repo-catalog.yaml).
**To add a new repository:** append an entry to the YAML — everything else follows from it.

## Cloning this meta repo (with submodules)

```bash
git clone --recurse-submodules https://github.com/bhatisanjay28/Astro-Meta.git
```

If you already cloned without `--recurse-submodules`:

```bash
git submodule update --init --recursive
```

## Pulling / pushing changes from the meta repo

Submodules are pinned to a commit, so "pull latest of everything" is:

```bash
git submodule update --remote --merge   # pull latest main of each submodule
git add frontend backend                # record the new pins
git commit -m "chore: bump submodule pins"
git push
```

To push changes you made inside a submodule (edit files under `frontend/` or `backend/`):

```bash
cd frontend            # or backend/
git add -A
git commit -m "your change"
git push               # pushes to the submodule's own GitHub repo
cd ..
git add frontend       # update the pin recorded in Astro-Meta
git commit -m "chore: bump frontend pin"
git push
```

## Layout

```
Astro-Meta/
├── backend/    → submodule: Astro-Backend
├── frontend/   → submodule: Astro-Frontend
└── docs/
    └── repo-catalog.yaml   ← add new repos here
```
