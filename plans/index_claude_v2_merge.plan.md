---
status: ready-for-testing
source: index_claude_v2.html
target: index.html
linear_parent: APE-82
copy_note: "blueprint kit" in v2 → "starting kit" in production
steps:
  - id: orientation-overlay
    linear: APE-84
    status: done
  - id: spotlight-tour
    linear: APE-83
    status: done
  - id: replay-and-menus
    linear: APE-87
    status: done
  - id: demo-settings-copy
    linear: APE-85
    status: done
  - id: polish-scroll-labels
    linear: APE-86
    status: done
---

# Merge `index_claude_v2.html` → `index.html`

Cherry-pick vetted onboarding v2 from [`index_claude_v2.html`](../index_claude_v2.html) into production [`index.html`](../index.html). Shipped as one cycle (all steps). Demo copy uses **Your starting kit** / **Make this mine** (not v2’s “blueprint” wording).

**Parent Linear:** [APE-82](https://linear.app/aperturegraph/issue/APE-82)

**Prerequisite:** [index_claude_merge.plan.md](index_claude_merge.plan.md) (APE-75) already in `index.html`.

## Steps (all shipped)

### Step 1 — Orientation overlay ([APE-84](https://linear.app/aperturegraph/issue/APE-84))

- `#nlOrient` after `#nlIntro`; `basecamp_orientSeen`
- `nlEnterApp` / boot IIFE / `nlFinishOrient(showPayoff)`
- Orient bullet: “starting kit and a sample trip”
- Privacy `<details>` block

**Test:** Fresh storage → intro → orient; “Show me how it works” opens first trip; “explore on my own” skips tour trigger path except manual tour.

### Step 2 — Spotlight tour ([APE-83](https://linear.app/aperturegraph/issue/APE-83))

- `.nlt-*` CSS + IIFE; `basecamp_tourSeen`
- `nlTourStart`, `nlTourLaunch`, `nlTourMaybeAuto`
- `prefers-reduced-motion` on tour transitions

**Test:** Demo first trip on packing/plan stage; 4 steps or skip missing targets; Skip/Done; z-index over app chrome.

### Step 3 — Replay & entry points ([APE-87](https://linear.app/aperturegraph/issue/APE-87))

- `replayOnboarding()` clears intro, orient, and tour keys, reloads
- Mobile `···`: Replay intro, Show me around
- Settings → Data: same buttons

**Test:** Replay shows intro again; completing orient with “Show me how it works” can auto-run tour again.

### Step 4 — Demo / settings copy ([APE-85](https://linear.app/aperturegraph/issue/APE-85))

| Surface | Copy |
|---------|------|
| Banner title | Your starting kit |
| Banner body | We’ve started you off… Make it yours, or start from scratch |
| CTAs | Make this mine / Start from scratch |
| Settings (demo) | This is your starting kit… **Make this mine** |

### Step 5 — Polish ([APE-86](https://linear.app/aperturegraph/issue/APE-86))

- `openTrip` → `scrollTo(0,0)`
- Quick-add + item type dropdown: Bring from home
- `setItemMoreAuto` person-btn selector broadened
- Kept `openM` catch fallback `setItemMore(false)`

## Test plan (sign-off)

1. Clear `localStorage` (or incognito) → full flow intro → orient → optional auto tour on demo trip.
2. Mobile `···` → Replay intro / Show me around.
3. Settings → Data buttons on demo and non-demo.
4. Demo banner labels and graduation still work.
5. Reduced motion: intro + tour don’t fight OS setting.

## Deferred / out of scope

- Re-merge of APE-75 items
