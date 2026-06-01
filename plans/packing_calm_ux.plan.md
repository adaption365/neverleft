---
status: discovery
linear_epic: APE-73
phases:
  - id: pack-full-list-mode
    linear: APE-70
    status: backlog
  - id: disclosure-defaults
    linear: APE-72
    status: backlog
  - id: todo-presentation
    linear: APE-74
    status: backlog
  - id: toolbar-power-overflow
    linear: APE-69
    status: backlog
  - id: visual-calm-pass
    linear: APE-71
    status: backlog
open_questions:
  - Pack/Full toggle placement
  - hide-packed always on in Pack mode?
  - Pack mode scope: packing only vs all checklist stages
  - Default to-do surface A vs B vs C
---

# Packing calm UX (heart of the app)

**Status:** Discovery  
**Discovery doc:** [packing_calm_ux_discovery.md](packing_calm_ux_discovery.md)  
**Linear epic:** [APE-73](https://linear.app/aperturegraph/issue/APE-73) (In Progress)

Embody NeverLeft’s core promise: **reassuring ritual, not inventory panic.** Progressive disclosure on the packing workflow; power tools remain, but quiet.

## North star

> Packing shows me the next few things to put in the car; everything else is one tap away, and nothing shouts unless I’m actually stuck.

## Principles

See discovery doc — summary: **one loud layer**, **momentum over debt**, **Pack vs Full list**, **instruction budget**, **same data calmer UI**.

## Phased delivery

Implement in order; each phase shippable behind Pack mode or feature flag if needed.

### Phase 1 — Pack vs Full list mode ([APE-70](https://linear.app/aperturegraph/issue/APE-70))

**Goal:** Cognitive split without losing today’s screen.

- Toggle: **Pack** (default) | **Full list**
- Pack: simplified progress line, hide secondary filter panel, defer duplicate `clFilters` / `clControls` to Full list only
- Persist mode in `localStorage`
- Copy: mode labels explain job (“Pack” / “Manage full list”)

**Acceptance:** Sunday-night packer can complete a demo trip in Pack mode without opening filters; curator can switch to Full list and use today’s controls.

### Phase 2 — Disclosure defaults ([APE-72](https://linear.app/aperturegraph/issue/APE-72))

**Goal:** Less on screen at once in Pack mode.

- Compact row template (name + state; meta behind expand or tap)
- Pack mode: **hide packed** default on; one incomplete location group open (optional: auto-open next on group complete)
- Completed groups stay collapsed (extend existing behavior)
- Consolidate duplicate filter UIs in Full list (single filter surface)

**Acceptance:** First screenful in Pack mode shows progress + one group + compact rows, not six toolbar buttons and dual filter bars.

### Phase 3 — To-do presentation ([APE-74](https://linear.app/aperturegraph/issue/APE-74))

**Goal:** One default to-do surface in Pack mode; no duplicate visual noise.

- Pack mode default: **bottom master list**; rows show count chip (“2 to-dos”) → scroll/focus footer (per discovery recommendation)
- Full list: retain inline + bottom (or user preference later)
- Single coaching line for to-dos

**Depends on:** APE-70 (mode gate).  
**Related:** [APE-62](https://linear.app/aperturegraph/issue/APE-62), [APE-64](https://linear.app/aperturegraph/issue/APE-64) (done / testing).

### Phase 4 — Toolbar & power actions ([APE-69](https://linear.app/aperturegraph/issue/APE-69))

**Goal:** Primary actions only in Pack mode.

- Pack: **+ Add** primary; **⋯** overflow — Rebuild, Uncheck, From inventory, Print list, Print to-dos
- Full list: full toolbar (or same overflow with “pin” option later)
- Revisit [APE-67](https://linear.app/aperturegraph/issue/APE-67) sticky bar **after** toolbar thinning

### Phase 5 — Visual calm pass ([APE-71](https://linear.app/aperturegraph/issue/APE-71))

**Goal:** Taste and emotional tone.

- Instruction budget enforced (gate banner timing, row nudges)
- Progress copy: packed-first, celebrate group completion
- Reduce ambient amber/rust; section spacing
- Align with [neverleft-ui-polish](.cursor/skills/neverleft-ui-polish/SKILL.md) / emil-design-eng

## Cross-cutting

| Topic | Where |
|-------|--------|
| Journey stepper / completion anxiety | [APE-52](https://linear.app/aperturegraph/issue/APE-52) — link epic; don’t duplicate |
| Trip detail hub tone | [trip_experience_hub.plan.md](trip_experience_hub.plan.md) |
| Print | [trip_todo_print.plan.md](trip_todo_print.plan.md) — power layer |

## Suggested build order

After APE-62/64 sign-off: **APE-70 → APE-72 → APE-74 → APE-69 → APE-71**. APE-67 last (after APE-69).

## Test themes (epic)

1. **Sunday-night packer** — demo trip, Pack mode only, no filter panel, completes packing without reading docs.
2. **List curator** — Full list, rebuild + person filter + print unchanged.
3. **Regression** — packable parents, subs, criteria gate, to-do sync row ↔ footer.

## When to mark epic Done

All phases shipped; discovery open questions resolved in frontmatter; README + [trip_experience_hub](trip_experience_hub.plan.md) cross-links updated.
