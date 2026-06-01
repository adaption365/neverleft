# Trip to-do print

**Status:** Ready for testing  
**Linear:** [APE-64](https://linear.app/aperturegraph/issue/APE-64) (print to-do list), [APE-62](https://linear.app/aperturegraph/issue/APE-62) (inline packing to-dos — APE-61 regression)

## Problem

- **APE-61** moved all kit/trip to-dos to the bottom of each trip stage. Packing still needs tasks **on each row** while packing; the bottom block is the “what’s left” summary.
- **Print packing list** (`printChecklist`) is item-centric (locations, checkboxes for pack state). There is no dedicated **to-do-only** print for the current journey step.

## Goals (APE-64)

1. **Print to-dos** — new action on trip stages that have to-dos (packing, plan, at-camp, pack-up, pack-away, post-trip).
2. One printable page: grouped by stage label (matches `STAGE_LABELS` / `actionStagesForTripStatus`).
3. Each line: empty checkbox, task label, **item name** (kit actions) or **This trip only** (custom).
4. Default: **unfinished only**; if none left, print full list with “All complete” subtitle.
5. Reuse `openHtmlPrintPreview` / NeverLeft Field Notes print styling.

## Shipped in app (related, not APE-64)

- **APE-62** — `inlineActions()` on packing rows (`pre-trip` only); bottom keeps full actionable list (deduped: subs already on checklist are not added again via parent). Checklist toolbar above item list.

## Out of scope (future Linear)

| Issue | Summary |
|-------|---------|
| [APE-63](https://linear.app/aperturegraph/issue/APE-63) | Print to-dos respects active packing filters (person / location / hide packed) |
| [APE-65](https://linear.app/aperturegraph/issue/APE-65) | Align `printChecklist('packing')` action stages with on-screen (`pre-trip` only, not `during`) |
| [APE-66](https://linear.app/aperturegraph/issue/APE-66) | In-app toggle: print open vs all to-dos (not only fallback when all done) |
| [APE-67](https://linear.app/aperturegraph/issue/APE-67) | Sticky contextual toolbar on long trip stage lists (packing actions while scrolling) |

## Test plan (APE-64)

- Demo trip → **Packing** → **Print to-dos**: pre-trip kit tasks + trip-only tasks; item names shown; checkboxes empty.
- Complete all pre-trip tasks → **Print to-dos** again: prints with “all complete” messaging or full list per implementation.
- **At camp** / **Pack up** / **Plan**: stage-appropriate tasks only.
- Pop-up blocked: preview iframe still works.

## Test plan (APE-62)

- Packing rows: pre-trip checkboxes under items (and subs).
- Bottom **Before you go**: full tickable list; each kit to-do appears **once** (dedupe via `eachTripChecklistItemForActions`).
- Toolbar (Rebuild, add, print) sits **above** the item list.
