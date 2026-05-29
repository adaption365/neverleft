# Backlog batches (retrospective)

Living record of **batched delivery order** from the Neverleft Linear backlog (May 2026). Linear holds issues/todos only; full specs stay here and in linked plan files.

## Wave 1 — Fix what breaks daily use

### Batch A: Packing list integrity — **Done**

| Linear | Title | Shipped |
|--------|-------|---------|
| [APE-44](https://linear.app/aperturegraph/issue/APE-44) | Missing items on packing list | Progress aligned with visible rows; `excludedItemIds` |
| [APE-42](https://linear.app/aperturegraph/issue/APE-42) | Hide group when packed | `checklistParentHiddenByHidePacked` |
| [APE-41](https://linear.app/aperturegraph/issue/APE-41) | Remove from trip (sub-items) | `trip.excludedItemIds` |

**Commit:** `0254ccf`

### Batch B: Kit list refresh — **Done**

| Linear | Title | Shipped |
|--------|-------|---------|
| [APE-30](https://linear.app/aperturegraph/issue/APE-30) | Update kit list on add item | `focusKitItemAfterSave` |
| [APE-29](https://linear.app/aperturegraph/issue/APE-29) | Duplicate item creation | Create-only dialog; `editItemId` cleared on close |
| [APE-28](https://linear.app/aperturegraph/issue/APE-28) | Add item from search | **+ Add “{term}”** on empty kit search |

**Commit:** `33acb81`

---

## Wave 2 — Trip workflow clarity

*Unblocks [APE-17](https://linear.app/aperturegraph/issue/APE-17) camp mode.*

### Batch C: Stepper behaviour — **Done** (tested 2026-05-28)

| Linear | Title | Decision / shipped |
|--------|-------|-------------------|
| [APE-43](https://linear.app/aperturegraph/issue/APE-43) | “At camp” step | **New status** `at-camp` between `packing` and `pack-up` |
| [APE-45](https://linear.app/aperturegraph/issue/APE-45) | Explicit step completion | `trip.completedStages[]`; stepper **navigate only**; `completeTripStage()` gated by per-step criteria; `syncTripStageCompletion()` cascades uncomplete |
| [APE-46](https://linear.app/aperturegraph/issue/APE-46) | To-do per phase | `actionsBody(trip, filter)` by status; **At camp** tab = during tasks + camp log |

**Journey order:** Plan → Packing → **At camp** → Packing up → Back home → (post-trip review) → Done

**Data:**

- `trip.completedStages` — string[] of stage ids marked complete (criteria-driven, not navigation)
- `normalizeTripStages()` on load/import — legacy trips on `pack-up`+ backfill prior steps but **not** `at-camp` (skipped for old flow)

**UX:**

- Stepper tap → jump only (no auto-complete)
- Status button → complete current step when criteria met, then advance
- **Packing:** all lines packed + all pre-trip actions ticked; optional **Mark all packed** (confirm); unpack / undo actions drops Packing ✓ and later steps
- **Packing up / Back home:** button enabled when all rows on that list are done
- **Done:** requires all five journey steps complete (no bulk-tick)
- `atCampBody` — camp log strip + filtered “while camping” actions + link to packing list

---

## Follow-up (UX, not a shipped batch)

| Linear | Title | Notes |
|--------|-------|--------|
| [APE-52](https://linear.app/aperturegraph/issue/APE-52) | Trip workflow UX revisit | Simplify stepper / completion / undo after Batch C (APE-43, 45, 46). Discovery → design → implementation issue. |

---

## Wave 3+ (not started)

| Batch | Focus | Linear (representative) |
|-------|--------|-------------------------|
| D | Trip hub Phase 3 — **Ready for testing** | [APE-25](https://linear.app/aperturegraph/issue/APE-25) — Official forecast, Plan route, Settings maps app, per-trip Leave from |
| E | Camp **daily journal** + learnings — **Done** (commit `dfa534b`); per-day notes/meals/weather/prompts + no-guilt learnings + APE-19 | APE-15, 16, 17, 23, 19 |
| F | Quantity rules | APE-21, 18 |
| G | Kit grouping | APE-22, 20, 35, 24, 32 |
| H | Packing list UX | APE-36, 37 |
| I | Want list | APE-48, 49 |
| J | Scroll / navigation | APE-31, 39 |

## Plan file links

| Topic | File |
|-------|------|
| Camp mode / learnings | [forgotten_item_feature_ux_d218206d.plan.md](forgotten_item_feature_ux_d218206d.plan.md), [batch_e_camp_learnings.plan.md](batch_e_camp_learnings.plan.md) |
| Trip hub | [trip_experience_hub.plan.md](trip_experience_hub.plan.md) |
| Kit grouping | [packable_parent_vs_group_container.plan.md](packable_parent_vs_group_container.plan.md) |
