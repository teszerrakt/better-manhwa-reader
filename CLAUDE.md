# CLAUDE.md

Chrome MV3 extension that clamps manhwa reader pages to a configurable width on desktop. Built with WXT + Vue 3 + shadcn-vue.

- Package manager: **bun** (not npm or pnpm).
- Typecheck: `bun run compile` (runs `vue-tsc --noEmit`).
- Dev run: `bun run dev` (WXT launches a Chrome instance with the extension loaded; HMR for popup).
- Production build: `bun run build` → `.output/chrome-mv3/`.

## Planning

- Make plans extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, list any unresolved questions.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `teszerrakt/better-manhwa-reader`; use the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.
