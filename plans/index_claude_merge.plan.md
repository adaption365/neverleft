---
status: done
source: index_claude.html
target: index.html
linear_parent: APE-75
steps:
  - id: demo-banner-mobile
    linear: APE-76
    status: done
  - id: trip-wizard-attendees-default
    linear: APE-77
    status: done
  - id: backup-reminder-demo-skip
    linear: APE-78
    status: done
  - id: item-modal-more-options
    linear: APE-79
    status: done
  - id: first-visit-intro
    linear: APE-80
    status: done
deferred: []
shipped_after_epic:
  - id: global-copy-punctuation
    linear: APE-81
    status: done
    note: User-facing em dash → comma/colon in index.html; comments, trip-name split, empty cells, demo seed unchanged
---

# Merge `index_claude.html` → `index.html` (phased)

Cherry-pick vetted changes from [`index_claude.html`](../index_claude.html) into production [`index.html`](../index.html). **One step per PR/commit cycle** — ship, test on mobile, sign off, then next step.

**Parent Linear:** [APE-75](https://linear.app/aperturegraph/issue/APE-75)

## Steps

### Step 1 — Demo banner mobile stack ([APE-76](https://linear.app/aperturegraph/issue/APE-76))

**Problem:** On narrow screens the gold sample-kit banner crushes copy into a thin column.

**Change:** `@media (max-width:560px)` — `#demoBanner` column layout; button row full width.

**Test:** Demo mode on phone ≤560px — text readable; buttons stack; dismiss still works.

**Status:** Done (signed off).

---

### Step 2 — Trip wizard: default all attendees ([APE-77](https://linear.app/aperturegraph/issue/APE-77))

**Problem:** New trip wizard leaves all crew unchecked when `attendeeIds` not set yet.

**Change:** `populateTripAttendeeGrid` — `on = saved ? saved.has(p.id) : true`.

**Test:** New booked trip → Who's coming? all ticked; edit existing trip respects saved selection.

**Status:** Done (signed off).

---

### Step 3 — Skip backup nag in demo mode ([APE-78](https://linear.app/aperturegraph/issue/APE-78))

**Change:** `checkBackupReminder()` early return when `isDemoMode()`.

**Test:** Fresh demo load — no export reminder until graduated / real data.

**Status:** Done (signed off).

---

### Step 4 — Item modal “More options” ([APE-79](https://linear.app/aperturegraph/issue/APE-79))

**Change:** Collapse advanced fields behind toggle; `setItemMoreAuto()` on open when item uses them.

**Test:** Add item (collapsed); edit item with qty rules/actions (auto-expand); save with fields collapsed.

**Status:** Done (signed off).

---

### Step 5 — First-visit intro overlay ([APE-80](https://linear.app/aperturegraph/issue/APE-80))

**Change:** `nl-intro` landing; `basecamp_introSeen`; remove on enter.

**Test:** First visit shows intro; return visit skips; modals/banner z-index OK.

**Status:** Done (signed off).

---

## Post-epic: global copy pass ([APE-81](https://linear.app/aperturegraph/issue/APE-81))

**Change:** User-visible copy in `index.html`: em dash → comma (or colon in dropdown labels). Unchanged: code comments, `split('—')` trip titles, table empty `—`, demo seed strings.

**Test:** Spot-check toasts, trip wizard, item modal, packing nudges; demo trip name uses `—` for hero title split (locale-based place, not fixed Easter/Peak District).

**Status:** Done (signed off).

---

## Out of scope (separate work)

- Journey bar mobile scroll/labels ([APE-52](https://linear.app/aperturegraph/issue/APE-52) / packing calm mobile pass)
