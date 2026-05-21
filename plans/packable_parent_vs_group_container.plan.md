---
name: Packable parent vs group-only container
overview: Product model for inventory parents with sub-items — distinguish kit grouping (not packed as its own line) from physical units (duffle, pouch, vac bag) that are packed and contain trackable children. Clarify UX copy and defaults; checklist dual-row behaviour is implemented.
todos:
  - id: kit-editor-copy
    content: "Rename/clarify isContainer in item editor: e.g. 'Group only (not packed on trip)' with one-line help; avoid implying 'has children'"
    status: pending
  - id: add-sub-prompt
    content: "When user adds first sub-item (or sets parentId), prompt: 'Real bag/box you pack, or just a kit grouping?' → set isContainer vs packable parent accordingly"
    status: pending
  - id: checklist-ux-done
    content: "Packing list + pack-up/away — non-container parents with subs: checkbox packs parent, title/chevron/body expands; ci-group-block + 'Pack this · contents below' (index.html ciRow, packTripGroupRow)"
    status: completed
  - id: progress-rules-doc
    content: "Keep progress as independent parent + children (no auto-pack parent when all subs done) unless product revisits"
    status: pending
isProject: false
---

# Packable parent vs group-only container

## Problem

Parents with sub-items serve **two different real-world meanings**, but one tree (`parentId`) and one flag (`isContainer`) can feel like a single choice:

| Meaning | Examples | What the trip checklist should do |
|--------|----------|-----------------------------------|
| **Kit grouping** | “Beds & sleep kit”, “Kitchen kit” | Show children as pack lines; parent is organisation only — not “checked off” |
| **Physical unit** | Duffle, vac bag, cable pouch, rucksack | Pack **the bag** and track **contents** as separate lines |

Users are torn between “subs ⇒ container” (simple) and “bags need packing too” (accurate). **Both are valid**; they must not be collapsed into one rule.

## Product decision (recommended)

1. **Subs always imply nested structure** (`parentId` / sub-items in kit).
2. **`isContainer` means group-only** — not “has children”. On trip: header row, children count toward progress; parent excluded from packing % ([`checklistProgressCIs`](index.html)).
3. **Parent with subs and `!isContainer` = packable unit** — opt-in minority case: parent has its own pack checkbox **and** expandable children.
4. **Default when adding sub-items:** lean **group-only** (`isContainer: true`), with an explicit prompt for physical bags/boxes.
5. **Do not auto-convert** every parent to container when children are added.

### Progress / completion

For packable parents: **parent and children are independent** — check bag when it is in the car; check contents when loaded. Do **not** auto-mark parent packed when all children are packed (unless revisited later as an optional rule).

For group-only containers: progress is **children only** (existing [`packingProgressContribution`](index.html) + [`checklistProgressCIs`](index.html)).

## How NeverLeft models this today

| Mechanism | Role |
|-----------|------|
| `parentId` | Kit hierarchy (parent ↔ children) |
| `isContainer` | Group-only: checklist header, no parent pack line, parent omitted from % |
| `location` / `packsInto` | Where items live / travel (e.g. demo “duffle” as **location**, not a packable parent item) |
| Non-container + subs | Packable parent row + sub-rows ([`ciRow`](index.html), [`packTripGroupRow`](index.html)) |

Demo seed uses **containers** for “Beds & sleep kit”, “Kitchen kit”; **duffle** appears as a **storage location** on child items, not as a packable parent — both patterns are intentional.

## UX direction (to implement)

### Item editor

- Relabel **`isContainer`** → e.g. **“Group only (not packed on trip)”**.
- Short help: *Use for kit labels like “Sleep kit”. Uncheck if this is a real bag or box you pack and track contents inside.*

### Add sub-item flow

When the user creates the **first** child (or assigns `parentId`), show a small choice (modal or inline):

> **Is this a real bag/box you pack, or just a kit grouping?**
>
> - **Kit grouping** → set `isContainer: true`
> - **Bag / box I pack** → set `isContainer: false` (packable parent)

Optional later: if parent has distinct `packsInto` / location from all children, suggest “bag/box” — not required for v1.

### Checklist (done)

Non-container parents with subs:

- **Checkbox** → `cycleState` / pack cycle on parent.
- **Title, chevron, body** → `toggleChecklistGroup`.
- Label: **“Pack this · contents below”**.
- Collapsed hint: **“tap ▼ or title to expand”**.

Containers unchanged: [`ci-group-hdr`](index.html) header-only row.

## Out of scope (for now)

- Third entity type (separate “physical unit” flag) — not needed if copy + prompt make `isContainer` unambiguous.
- Auto-pack parent when all children packed.
- Renaming `isContainer` in persisted JSON (UI copy only unless a migration is justified).

## Related code

- [`index.html`](index.html): `isContainer`, `ciRow`, `packTripGroupRow`, `checklistProgressCIs`, `packingProgressContribution`, item editor (`iContainer` checkbox)
- [trip_attendees_and_kit_40ad2a8d.plan.md](trip_attendees_and_kit_40ad2a8d.plan.md) — container parent auto-ensure on manual includes

## Build order

Can ship **after** or **alongside** checklist polish; no hard dependency on Camp mode / demo graduation. Suggested order:

1. Kit editor copy (low risk).
2. Add-sub prompt (small `saveItem` / add-child hook).
3. Revisit progress rules only if user feedback demands parent/child coupling.
