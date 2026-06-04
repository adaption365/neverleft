---
status: ready_for_testing
linear_epic: APE-73
phases:
  - id: pack-full-list-mode
    linear: APE-70
    status: ready_for_testing
  - id: disclosure-defaults
    linear: APE-72
    status: backlog
  - id: todo-presentation
    linear: APE-74
    status: ready_for_testing
  - id: toolbar-power-overflow
    linear: APE-69
    status: partial
    note: APE-94 shipped unified top ⋯; finish grouping + dismiss in design pass Slice 4
  - id: trip-actions-menu
    linear: APE-94
    status: ready_for_testing
  - id: visual-calm-pass
    linear: APE-71
    status: planned
    plan: packing_calm_design_pass.plan.md
  - id: design-pass-execution
    linear: APE-71
    status: planned
    slices: [hot-motion, instruction-budget, menu-cohesion, visual-weight]
resolved_decisions:
  toggle_placement: below progress bar, above list (segmented Pack | Full list)
  auto_advance_location: yes when a location group completes in Pack mode
  v1_scope: packing checklist only; pack-up/pack-away later
  todo_surface_pack: A (bottom master list; row chip scrolls to footer)
  todo_surface_full: inline + bottom as today
  user_preference_todos: deferred post-v1 (was option C)
  criteria_gate_banner: only when user taps Packing done and criteria fail
  progress_pack_mode: single line e.g. 24 packed · 4 ready · 6 to go (sage + amber bar)
  journey_bar_placement: under title on all trip stages (before trip experience hub)
  journey_bar_mobile_scroll: arrow buttons + edge fade when stepper overflows (APE-89)
  hide_packed_pack_mode: optional via Full list toggle; packed rows visible in Pack for feedback
  persist_key: nlPackingViewMode pack|full default pack
---

# Packing calm UX (heart of the app)

**Status:** Ready for testing — [APE-70](https://linear.app/aperturegraph/issue/APE-70), [APE-52](https://linear.app/aperturegraph/issue/APE-52), [APE-74](https://linear.app/aperturegraph/issue/APE-74), [APE-94](https://linear.app/aperturegraph/issue/APE-94) in `index.html`  
**Discovery doc:** [packing_calm_ux_discovery.md](packing_calm_ux_discovery.md)  
**Design pass (Emil audit + lean slices):** [packing_calm_design_pass.plan.md](packing_calm_design_pass.plan.md)  
**Linear epic:** [APE-73](https://linear.app/aperturegraph/issue/APE-73) (In Progress)

Embody NeverLeft’s core promise: **reassuring ritual, not inventory panic.** Progressive disclosure on the packing workflow; power tools remain, but quiet.

## North star

> Packing shows me the next few things to put in the car; everything else is one tap away, and nothing shouts unless I’m actually stuck.

## Principles

See discovery doc — summary: **one loud layer**, **momentum over debt**, **Pack vs Full list**, **instruction budget**, **same data calmer UI**.

## Pack vs Full: what changes (critical)

The toggle is **not** a different trip page. It only changes the **packing checklist region** — how you scan, filter, and act on lines.

### Always visible (both Pack and Full list)

Everything on the trip screen **above and around** the list stays — no feature loss when switching modes:

| Area | Examples (today in `tripDetail`) |
|------|----------------------------------|
| Trip chrome | Back, title, subtitle; Feature / Edit / Delete in top **⋯** (APE-94) |
| **Trip experience hub** | `renderTripExperiencePanel` — site, booking, weather summary, tabs (Site / Booking / Weather / Travel), links, Load forecast |
| Journey | Segmented journey bar under title on **all** stages; ⋯ on in-progress step; compact hub below bar in Pack |
| Trip prep | **Consumable / shopping prep strip** (`renderConsumablePrepStrip`) — suggested amounts, shortfall |
| Footer sections | **Before you go** to-dos (`tripStageFooterHtml`), **Notes** |

Pack mode may **simplify checklist progress + rows + toolbar** and the **trip hub chrome** (stepper under title; compact site card with one glance line + small section pills instead of large Site/Booking/Weather/Travel tabs; details expand on tap). It does **not** hide trip details, weather, or the shopping prep strip.

### Pack mode only (calmer checklist slice)

- Single progress line (`packed · ready · to go`) + dual-segment bar
- Segmented Pack \| Full list under progress
- No list-toolbar row; **+ Add** and list power actions in top **⋯** only (APE-94)
- Compact rows; one open location group deferred (APE-72); packed rows stay visible when marked
- To-do chips → scroll/highlight that item’s footer tasks + **Back to item** (APE-74)

### Full list only (parity with today’s checklist body)

**Full list must retain 100% of current checklist capabilities** — nothing removed, only reorganized if needed:

| Capability | Keep in Full list |
|------------|-------------------|
| Search | ✓ |
| Filter panel (person, location, sort, hide packed) | ✓ |
| Sort & filter controls (`clControls` / `clFilters` — consolidate UI, not drop features) | ✓ |
| Dual ready / packed progress + hint | ✓ |
| Full toolbar (rebuild, uncheck, quick add, inventory, both prints) | ✓ |
| Row density (meta, badges, inline to-dos, menus, groups/subs) | ✓ |
| Highlighted items, qty, packable parents | ✓ |
| Packing gate hint | Only on failed “Packing done” (per resolved decision) — applies to both modes when triggered |

**Acceptance (APE-70):** Switching to Full list on a demo trip exposes the same actions and data as today’s packing tab; trip hub + consumable strip unchanged from Pack view.

## Resolved decisions (May 2026)

Ready for Pack-mode mock in `NeverLeftClaudeDesign.html` and APE-70 implementation.

| Question | Decision | Rationale |
|----------|----------|-----------|
| Pack / Full toggle placement | **Below progress bar**, above toolbar + list — segmented control **Pack \| Full list** | Mode is about *how* you work the list, not which journey step you’re on. Stepper stays for trip stage only. |
| Hide packed in Pack mode | **Always on** — no toggle in Pack mode | Pack = “what’s left”; showing packed items adds scroll and anxiety. Full list restores today’s hide/show control. |
| Auto-advance location group | **Yes** in Pack mode when a group is fully packed/ready | Gentle momentum: completed garage collapses, next incomplete location opens. User can still expand others manually. |
| v1 scope | **Packing checklist only** (`packing` + checklist tab) | Validate calm UX on the busiest screen first. Pack-up / pack-away inherit later (APE-72+ or follow-up issue). |
| To-do surface (Pack) | **A — bottom master list**; rows show **“N to-dos”** chip → scroll/focus footer | User wanted full tickable list below + calm rows; avoids duplicate inline checkboxes in Pack mode. |
| To-do surface (Full list) | **Inline + bottom** as shipped (APE-62) | Curators and power users keep both surfaces. |
| User preference (option C) | **Deferred** post-v1 | Ship one calm default; add Settings later if testing asks for it. |
| Criteria gate banner | **On “Packing done” attempt only** — not persistent mid-list | Instruction budget: no ambient rust guilt while packing. |
| Progress (Pack mode) | **One line**: `packed · ready · to go` + sage/amber bar | Ready visible so “to go” dropping on tap makes sense. |
| Persistence | `localStorage` key `nlPackingViewMode`: `pack` \| `full`, default **`pack`** | Per device; new users land calm. |

## Pack-mode mock brief (next: design file)

Static mock should show **one screen** — demo trip, Packing step, **Pack** selected:

1. Trip header + stepper (unchanged)
2. Single progress: `18 packed · 9 to go` + thin bar
3. Segmented toggle: **[ Pack ]** Full list — helper line under toggle
4. Primary **+ Add** + **⋯** only (no six-button row)
5. One open group: **Garage** (3/8 mini progress) — compact rows: checkbox, name, optional `2 to-dos` chip
6. Collapsed groups: **Kitchen ✓ All packed**, **Loft** (muted)
7. Footer **Before you go**: 4–5 tickable lines (no duplicate inline boxes on rows in mock)
8. No filter panel, no rust gate banner, no dual ready/packed %

**Mock (shipped):** [`NeverLeftClaudeDesign-pack-mode.html`](../NeverLeftClaudeDesign-pack-mode.html) — Pack | Full list toggle, compact trip hub, footer to-dos, **segmented journey bar** (APE-52): three states, glow on in-progress, ⋯ → mark complete. Open in browser (not the bundled `NeverLeftClaudeDesign.html`).

## Phased delivery

Implement in order; each phase shippable behind Pack mode or feature flag if needed.

### Phase 1 — Pack vs Full list mode ([APE-70](https://linear.app/aperturegraph/issue/APE-70))

**Goal:** Cognitive split without losing today’s screen.

- Toggle: segmented **Pack** (default) \| **Full list** — placed **under** `cprog`, above toolbar
- Pack: single progress line (`packed · remaining`); no filter panel; `nlPackingViewMode=pack`
- Full list: today’s progress + filters; `nlPackingViewMode=full`
- Copy: subtitle under toggle — Pack: “Focus on what’s left” · Full list: “Search, sort, and manage everything”

**Acceptance:** Sunday-night packer can complete a demo trip in Pack mode without opening filters; curator can switch to Full list and use today’s controls.

**Shipped (`index.html`, commits through `5bb3c40`):** `nlPackingViewMode`; Pack progress `packed · ready · to go`; accurate totals with packed rows visible; filter/sort hidden in Pack; slim toolbar; journey bar under title on **all** trip stages ([APE-52](https://linear.app/aperturegraph/issue/APE-52): viewing highlight vs in-progress pulse, ⋯ mark complete); compact trip hub in Pack; to-do chips → focused footer + back/auto-return ([APE-74](https://linear.app/aperturegraph/issue/APE-74)). Full list unchanged parity. **Deferred:** compact rows, one open location, auto-advance (APE-72); toolbar overflow polish (APE-69); visual calm (APE-71).

### Phase 2 — Disclosure defaults ([APE-72](https://linear.app/aperturegraph/issue/APE-72))

**Goal:** Less on screen at once in Pack mode.

- Compact row template (name + state; meta behind expand or tap)
- Pack mode: **hide packed** always on; one incomplete location group open; **auto-open next** incomplete group when current completes
- Completed groups stay collapsed (extend existing behavior)
- Consolidate duplicate filter UIs in Full list (single filter surface)

**Acceptance:** First screenful in Pack mode shows progress + one group + compact rows, not six toolbar buttons and dual filter bars.

### Phase 3 — To-do presentation ([APE-74](https://linear.app/aperturegraph/issue/APE-74))

**Goal:** One default to-do surface in Pack mode; no duplicate visual noise.

- Pack mode default: **bottom master list**; rows show count chip → scroll/highlight **that item’s** footer rows + banner “To-dos for [item]” + **↑ Back to item**; auto-return when last to-do ticked
- Blocked ready/pack tap scrolls to focused footer for that item
- Full list: retain inline + bottom (or user preference later)
- Pack footer hint when not focused: tap chip on row

**Status:** Ready for testing (`5bb3c40`). Optional later: group footer by item, inline one-liner on row.

**Depends on:** APE-70 (mode gate).  
**Related:** [APE-62](https://linear.app/aperturegraph/issue/APE-62), [APE-64](https://linear.app/aperturegraph/issue/APE-64) (done / testing).

### Phase 4 — Toolbar & power actions ([APE-69](https://linear.app/aperturegraph/issue/APE-69) + [APE-94](https://linear.app/aperturegraph/issue/APE-94))

**Goal:** Primary actions only in Pack mode.

- **Shipped (APE-94):** Single top **⋯** (`btn btn-o btn-sm`) beside title — list actions (+ Add, Rebuild, …) + trip actions (Feature, Edit, Delete); no second **⋯** above list in Pack.
- **Remaining (APE-69):** Menu grouping, click-outside/Escape dismiss, visual alignment with journey **⋯** — see [packing_calm_design_pass.plan.md](packing_calm_design_pass.plan.md) Slice 4.
- Full list: full toolbar unchanged.
- Revisit [APE-67](https://linear.app/aperturegraph/issue/APE-67) sticky bar **after** APE-69/71 baseline.

### Phase 5 — Visual calm & motion ([APE-71](https://linear.app/aperturegraph/issue/APE-71))

**Goal:** Taste and emotional tone without over-building.

**Do not** treat APE-71 as one big polish PR. Execute **[packing_calm_design_pass.plan.md](packing_calm_design_pass.plan.md)** in order:

1. **Slice 1** — Hot-path motion (row scale, checkSettle, bar)
2. **Slice 2** — Instruction budget (nudges, single to-do affordance)
3. **Slice 3** — APE-72 disclosure (one open group, hide packed in Pack)
4. **Slice 4** — Menu cohesion (APE-69 finish)
5. **Slice 5** — Visual weight (consumable strip, hint once, flatter rows)

Captured Emil audit tables and guardrails live in that plan. Align with [neverleft-ui-polish](../.cursor/skills/neverleft-ui-polish/SKILL.md).

## Cross-cutting

| Topic | Where |
|-------|--------|
| Journey stepper / completion anxiety | [APE-52](https://linear.app/aperturegraph/issue/APE-52) — **ready for testing** (`5bb3c40`): bar under title on all stages; viewing vs in-progress; ⋯ menu |
| Journey bar narrow-screen scroll | [APE-89](https://linear.app/aperturegraph/issue/APE-89) (child of APE-52) — **ready for testing**: ‹ › when overflow; edge fade; active step scrolled into view |
| Trip detail hub tone | [trip_experience_hub.plan.md](trip_experience_hub.plan.md) |
| Print | [trip_todo_print.plan.md](trip_todo_print.plan.md) — power layer |

## Suggested build order

**Shipped / testing:** APE-70, APE-52, APE-74, APE-94.

**Next (lean, no big-bang polish):**

1. Sign off **APE-94** (unified top **⋯**).
2. **[Design pass](packing_calm_design_pass.plan.md)** Slice 1 → 2 (motion + instruction).
3. **APE-72** (disclosure) — Slice 3 in design pass.
4. Design pass Slice 4 → 5 (menus + visual weight) = finish **APE-69** + **APE-71**.
5. **APE-67** sticky bar last.

Do **not** parallel APE-72 and a large APE-71 CSS rewrite in one PR.

## Test themes (epic)

1. **Sunday-night packer** — demo trip, Pack mode only, no filter panel, completes packing without reading docs.
2. **List curator** — Full list, rebuild + person filter + print unchanged.
3. **Regression** — packable parents, subs, criteria gate, to-do sync row ↔ footer.

## When to mark epic Done

All phases shipped; discovery open questions resolved in frontmatter; README + [trip_experience_hub](trip_experience_hub.plan.md) cross-links updated.
