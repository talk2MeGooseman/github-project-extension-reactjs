# AGENTS.md

Canonical guidance for AI coding agents (Claude Code, GitHub Copilot, Cursor,
Codex, and others) working in this repository. `CLAUDE.md` just points here —
**edit this file**, not that one.

## Project Overview

A **Twitch panel extension** (React 19 + TypeScript, built with Vite 8) that
lets a broadcaster showcase GitHub repositories on their channel. It has two
surfaces served from the same bundle:

- **Config view** — the broadcaster's setup UI (3-step wizard).
- **Viewer view** — the read-only panel shown to channel viewers.

The backend is the **GraphQL API of `guzman_app_elixir`** (a Phoenix/Absinthe
app), reached at `https://guzman.codes/api` in production and
`http://0.0.0.0:4000/api` for codegen. The README's Twitch listing link is the
extension itself; the old `github-project-extension-firebase` EBS is dead —
the Elixir app is the current backend.

## Commands

```bash
npm install            # install deps (Node >= 20.19 required)
npm start              # vite dev server on port 8080, host 0.0.0.0
npm run vite:start     # plain `vite` (default port from vite.config.ts: 8080)
npm run build          # production build → dist/
npm run preview        # serve the production build locally
npm run typecheck      # tsc --noEmit (strict mode)
npm run lint           # ESLint 9 flat config (eslint.config.js)
npm run lint:fix       # ESLint with --fix
npm run format         # Prettier 3
npm run codegen        # GraphQL codegen — requires the Elixir backend running
                       # locally at http://0.0.0.0:4000/api (see codegen.ts)
```

- There are **no tests** in this repo.
- Linting no longer runs inside the Vite dev server (the old
  `vite-plugin-eslint` was dropped with the ESLint 9 migration) — run
  `npm run lint` / `npm run typecheck` yourself before committing.
- ESLint uses **flat config** (`eslint.config.js`): `@eslint/js`,
  `typescript-eslint`, `eslint-plugin-react-hooks` (React-Compiler-powered
  rules), `jsx-a11y`, `eslint-plugin-primer-react`, and
  `eslint-config-prettier`. Prettier config is empty (defaults).

### GraphQL codegen caveat

`codegen.ts` is configured to emit the client preset into `./src/gql/`, but the
checked-in types actually live in a single hand-maintained file, `src/gql.tsx`,
which `src/shared/graphql.tsx` imports for its operation types. If you re-run
codegen, reconcile the output with `src/gql.tsx` rather than assuming the
generated folder is wired up.

## Architecture

### Entry & mode switching
- `index.html` loads the Twitch extension helper
  (`twitch-ext.min.js`) from Twitch's CDN and mounts `src/index.tsx`.
- `src/index.tsx` imports the `@primer/primitives` token CSS (required by
  Primer React v38's CSS-modules styling), creates a React 19 `createRoot`,
  and picks the view from the query string: `?mode=config` → `<Config />`,
  otherwise `<Viewer />`. Both are wrapped in `AuthWrapper` and `StrictMode`.

### Auth + GraphQL client (`src/shared/auth-wrapper.tsx`)
- Waits for `window.Twitch.ext.onAuthorized` (typed in `src/global.d.ts`),
  then builds a **urql v5** `Client` that sends the Twitch-signed JWT in the
  **`x-extension-jwt`** header — this is how the Elixir backend authenticates
  extension requests.
- The client sets `preferGetMethod: false` — urql v5 defaults queries to GET
  requests, but the Phoenix backend serves `POST /api`. Don't remove it.
- Provides `AuthContext` (channelId) and the urql `Provider`.

### State
- Global state is a **little-state-machine v5** store: `{ username, repos,
  fetching }` (`persist: 'none'`, created in `auth-wrapper.tsx`). v5 has no
  `StateMachineProvider` — the store is a module-level singleton and hooks are
  called as `useStateMachine({ actions: { updateAction } })`. The single
  reducer is `updateAction` (`src/state/update-action.tsx`), a typed shallow
  merge. Both views hydrate it from the `ChannelQuery` (viewer via
  `src/shared/use-fetch-state.ts`).

### GraphQL operations (`src/shared/graphql.tsx`)
- `ChannelQuery` — current channel's `githubProjectsConfig` (username + repos).
- `UpsertGithubProjectsConfigMutation` — saves the broadcaster's selection.
- `GithubUserInfo`, `GithubUsersRepositoriesQuery`, `GithubRepositoryQuery` —
  proxied GitHub data served by the backend.

### Config wizard (`src/views/config/`)
- `component.tsx` lays out the wizard with Primer's `SplitPageLayout`;
  steps live in `form-components/` (`step-one` username, `step-two` repo
  selection, `step-three` ordering) and use **react-hook-form** (v7,
  `useWatch` rather than `watch` — the react-hooks compiler lint flags
  `watch`).
- Drag-and-drop ordering uses **react-sortablejs** via the shared
  `List`/`ListItem` components (`src/shared/list.tsx`), which render Primer
  (`@primer/react` v38) UI. The viewer reuses `List` with `disableSorting`.

### Styling (Primer v38)
- Primer React v38 **removed the `sx` prop and `Box`** (styled-components is
  gone). Component-specific styles live in CSS modules (`list.module.css`,
  `form.module.css`) using Primer design-token CSS variables
  (`--borderColor-default`, `--fgColor-muted`, `--base-size-*`, …).
- v38 extracts `ActionList` slots (`LeadingVisual`, `Description`) only from
  **direct children** of an item — wrapping them in a fragment silently dumps
  everything into the label and stacks the layout (see `list-item.tsx`).
- The multi-select repo list (`step-two.tsx`) needs
  `role="listbox"` on `ActionList` — without a list role, v38 renders the
  checkboxes but never applies `aria-selected`, so items never *look*
  selected. With `role="listbox"`, `ActionList.GroupHeading` must NOT have an
  `as` heading level (runtime invariant).

### Things to know
- `vite.config.ts` sets `base: './'` — Twitch hosts extension assets from a
  relative path; don't change this to an absolute base.
- Vite 8 is rolldown-based; `splitVendorChunkPlugin` no longer exists, and the
  bundle is intentionally a single chunk (fine for a panel loaded once).
- `public/` contains only `favicon.ico` — the legacy pre-Vite artifacts
  (`mui.min.*`, `js/config.js`, `manifest.json`) were removed.

## CI / Release

`.github/workflows/pre-release.yml` runs on push to `master`: Node 22 +
`npm ci` → `npm run typecheck` → `npm run lint` → `npm run build` → zips
`dist/` → publishes an automatic GitHub **prerelease** tagged `latest`. The
zip is what gets uploaded to the Twitch extension console.
