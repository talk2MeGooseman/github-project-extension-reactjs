# AGENTS.md

Canonical guidance for AI coding agents (Claude Code, GitHub Copilot, Cursor,
Codex, and others) working in this repository. `CLAUDE.md` just points here —
**edit this file**, not that one.

## Project Overview

A **Twitch panel extension** (React 18 + TypeScript, built with Vite) that lets
a broadcaster showcase GitHub repositories on their channel. It has two
surfaces served from the same bundle:

- **Config view** — the broadcaster's setup UI (3-step wizard).
- **Viewer view** — the read-only panel shown to channel viewers.

The backend is the **GraphQL API of `guzman_app_elixir`** (a Phoenix/Absinthe
app), reached at `https://guzman.codes/api` in production and
`http://0.0.0.0:4000/api` for codegen. Note: the README still links to the old
`github-project-extension-firebase` EBS — that is stale; the Elixir app is the
current backend.

## Commands

```bash
npm install            # install deps
npm start              # vite dev server on port 8080, host 0.0.0.0
npm run vite:start     # plain `vite` (default port from vite.config.js: 8080)
npm run build          # production build → dist/
npm run codegen        # GraphQL codegen — requires the Elixir backend running
                       # locally at http://0.0.0.0:4000/api (see codegen.ts)
```

- There are **no tests** in this repo.
- Linting runs automatically in dev via `vite-plugin-eslint` (with `fix: true`).
  ESLint config (`.eslintrc.json`) extends `react-app`, `jsx-a11y`, `prettier`,
  and `primer-react`. Prettier config is empty (defaults).

### GraphQL codegen caveat

`codegen.ts` is configured to emit the client preset into `./src/gql/`, but the
checked-in types actually live in a single hand-maintained file, `src/gql.tsx`,
which `src/shared/graphql.tsx` imports for its operation types. If you re-run
codegen, reconcile the output with `src/gql.tsx` rather than assuming the
generated folder is wired up.

## Architecture

### Entry & mode switching
- `index.html` loads the Twitch extension helper
  (`twitch-ext.min.js`) from Twitch's CDN and mounts `src/index.jsx`.
- `src/index.jsx` picks the view from the query string:
  `?mode=config` → `<Config />`, otherwise `<Viewer />`. Both are wrapped in
  `AuthWrapper`.

### Auth + GraphQL client (`src/shared/auth-wrapper.tsx`)
- Waits for `window.Twitch.ext.onAuthorized`, then builds a **urql** `Client`
  that sends the Twitch-signed JWT in the **`x-extension-jwt`** header — this
  is how the Elixir backend authenticates extension requests.
- Provides three layers of context: `AuthContext` (channelId/client),
  urql `Provider`, and a **little-state-machine** `StateMachineProvider`.

### State
- Global state is a little-state-machine store: `{ username, repos, fetching }`
  (`persist: 'none'`). The single reducer is `updateAction`
  (`src/state/update-action.tsx`), a shallow merge. Both views hydrate it from
  the `ChannelQuery` (viewer via `src/shared/use-fetch-state.ts`).

### GraphQL operations (`src/shared/graphql.tsx`)
- `ChannelQuery` — current channel's `githubProjectsConfig` (username + repos).
- `UpsertGithubProjectsConfigMutation` — saves the broadcaster's selection.
- `GithubUserInfo`, `GithubUsersRepositoriesQuery`, `GithubRepositoryQuery` —
  proxied GitHub data served by the backend.
- `src/services/github.tsx` additionally hits the **GitHub REST API directly**
  (unauthenticated) for repo lookups.

### Config wizard (`src/views/config/`)
- `component.tsx` lays out the wizard with Primer's `SplitPageLayout`;
  steps live in `form-components/` (`step-one` username, `step-two` repo
  selection, `step-three` ordering) and use **react-hook-form**.
- Drag-and-drop ordering uses **react-sortablejs** via the shared
  `List`/`ListItem` components (`src/shared/list.tsx`), which render Primer
  (`@primer/react`) UI. The viewer reuses `List` with `disableSorting`.

### Things to know
- `vite.config.js` sets `base: './'` — Twitch hosts extension assets from a
  relative path; don't change this to an absolute base.
- `public/` contains legacy pre-Vite artifacts (`mui.min.*`,
  `js/config.js`/`js/viewer.js` entry-point globals, `manifest.json`
  referencing a nonexistent `viewer.html`). They are vestigial — the live
  entry is `index.html` + `?mode=`.
- `index.html` sets `global = window` — some deps (styled-components v5 era)
  expect a Node-style global.

## CI / Release

`.github/workflows/pre-release.yml` runs on push to `master`: `yarn install` →
`yarn build` (with `CI=false` and a 4 GB Node heap) → zips `dist/` → publishes
an automatic GitHub **prerelease** tagged `latest`. The zip is what gets
uploaded to the Twitch extension console.
