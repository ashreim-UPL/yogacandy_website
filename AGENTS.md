<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Git & PR Workflow (ALL agents must follow this)

## Branch model

```
main         ← production, deploys to yogacandy.info on every merge. NEVER push directly.
 ├── claude  ← Claude Code's integration branch. Always kept in sync with main.
 └── codex   ← Codex's integration branch. Always kept in sync with main.
```

## Rules for every agent session

1. **Start every session by syncing with main:**
   ```bash
   git fetch origin
   git checkout main && git merge --ff-only origin/main
   ```

2. **Create a feature branch from main** (never from `claude` or `codex` directly):
   ```bash
   # Claude Code sessions:
   git checkout -b claude/<short-description> origin/main

   # Codex sessions:
   git checkout -b codex/<short-description> origin/main
   ```

3. **One concern per branch.** Don't mix unrelated changes.

4. **Commit with conventional format:**
   ```
   type(scope): short description

   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   ```
   Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`

5. **Before opening a PR**, rebase onto the latest main:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

6. **Open a PR to `main`**, not to `claude` or `codex`.
   - Title: `type(scope): description` (under 70 chars)
   - Body: bullet summary + test plan

7. **After PR merges**, update `claude` and `codex` branches:
   ```bash
   git push origin main:claude
   git push origin main:codex
   ```

## Hard rules

- Never `git push --force` to `main`
- Never commit directly to `main` (branch protection enforced)
- Never skip the build check (`npm run build` must pass before PR)
- Never mix Supabase schema changes with UI changes in the same PR
- The `out/` directory is gitignored — never commit build artifacts

## Conflict resolution

If your branch conflicts with `origin/main`:
```bash
git fetch origin
git rebase origin/main
# resolve conflicts, then:
git rebase --continue
git push --force-with-lease origin <your-branch>
```
Use `--force-with-lease`, never bare `--force`.

## Supabase migrations

Any DB schema change must:
1. Live in `supabase/migrations/<timestamp>_<description>.sql`
2. Be in its own PR, separate from application code changes
3. Be applied to the Supabase project before the code PR merges
