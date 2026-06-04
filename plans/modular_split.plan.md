---
name: Modular split (index.html)
overview: Phased extraction of NeverLeft monolith into maintainable assets with PWA precache safety.
todos:
  - id: phase-1-css
    content: Extract CSS + fonts to /css/, update sw.js precache (neverleft-shell-v2)
    status: completed
  - id: phase-2-tour
    content: Extract intro + spotlight tour scripts to tour.js
    status: completed
  - id: phase-3-state
    content: Extract state.js, storage.js, backup.js
    status: completed
  - id: phase-4-domains
    content: Extract kit, trips, settings, etc. (see module map)
    status: pending
---

# Modular split plan

**Goal:** Reduce fragility of the ~11k-line `index.html` without breaking offline PWA behaviour.

## Phase 3 — state / storage / backup (done)

| Asset | Role |
|-------|------|
| [`js/state.js`](../js/state.js) | `SK`, `S`, UI state, constants (`CATS`, journey stages, packing view helpers) |
| [`js/storage.js`](../js/storage.js) | `load`, `save`, demo mode, `uid` / `esc` / `fmtDate` |
| [`js/backup.js`](../js/backup.js) | Import/export, backup modals, destructive-action gate |
| [`index.html`](../index.html) | Settings helpers + domain logic remain inline for now |
| [`sw.js`](../sw.js) | `neverleft-shell-v4` precaches all three JS files |

**Scripts (Node only — UTF-8, no BOM):** `scripts/extract-phase3.mjs`, `scripts/apply-phase3.mjs`, `scripts/verify-phase3-utf8.mjs`

Settings block (`defaultSettings`, `showToast`, …) stays in `index.html` until phase 4 `settings.js`.

### Phase 3 test plan

1. Hard refresh at http://localhost:3456 — Network: `state.js`, `storage.js`, `backup.js` → 200.
2. App loads with demo data; dock arrows/emojis render correctly (no mojibake).
3. Edit item → save → reload — data persists.
4. **More → Download backup** and **Restore backup** (test file round-trip).
5. Settings → destructive flows still require backup gate first.
6. Offline reload: shell v4 serves extracted scripts from cache.

## Phase 2 — tour.js (done)

| Asset | Role |
|-------|------|
| [`js/tour.js`](../js/tour.js) | `nlEnterApp`, `nlFinishOrient`, `replayOnboarding`, spotlight tour (`nlTourLaunch`, kit/trip tours) |
| [`index.html`](../index.html) | Intro/orient markup only; `<script src="/js/tour.js">` after overlays |
| [`sw.js`](../sw.js) | `neverleft-shell-v3` precaches `/js/tour.js` |

**Scripts:** `scripts/extract-tour-phase2.ps1`, `scripts/apply-tour-phase2.ps1`

### Phase 2 test plan

1. Clear site data or use private window; first visit shows intro → orient → optional trip tour.
2. **More → Replay intro** clears keys and reloads.
3. **More → Show me around** on Trips (trip tour) and Kit tab (kit tour, 3 steps).
4. Offline reload after visit: `tour.js` served from cache; tours still launch.

### UTF-8

PowerShell `Set-Content -Encoding utf8` (phase 1 apply) corrupted arrows (`→`, `↑`, `←`). Restored via `node scripts/fix-utf8-mojibake.mjs`; apply scripts now write UTF-8 **without BOM**.

## Phase 1 — CSS (done)

| Asset | Role |
|-------|------|
| [`css/fonts.css`](../css/fonts.css) | Embedded `@font-face` (latin subset, offline) |
| [`css/styles.css`](../css/styles.css) | App UI + intro + tour styles |
| [`index.html`](../index.html) | Shell markup + JS only; links styles in `<head>` |
| [`sw.js`](../sw.js) | `neverleft-shell-v2` precaches `index.html`, both CSS files |

**Scripts:** `scripts/extract-css-phase1.ps1`, `scripts/apply-css-phase1.ps1` (re-run only if reverting inline CSS).

### Phase 1 test plan

1. Serve over HTTP: `npx serve .` (not `file://`).
2. Hard refresh; DevTools → Network: `fonts.css` + `styles.css` load 200; no `fonts.googleapis.com`.
3. Visual: Trips list, open trip (journey bar), Kit tab, item modal, intro replay (More → Replay intro).
4. Offline: Application → Service Workers → check `neverleft-shell-v2`; go offline; reload — app styled, fonts correct.
5. Print to-do / packing print still works (print HTML uses inline styles in JS — unchanged).

## Later phases (module map)

Load order when using classic scripts:

```
state.js → storage.js → backup.js
→ kit.js → itemEditor.js → trips.js → tripWizard.js
→ shopping.js → memoryLoop.js → settings.js → tour.js
→ app.js
```

Keep `onclick` handlers working via `window` or single `NL` namespace.

## Rollback

```bash
git revert <phase-1-commit>
# or
git reset --hard <checkpoint-before-split>
```

Bump `SHELL_CACHE` on any shell asset change.
