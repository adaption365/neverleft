# Quick-create a group + child default inheritance

**Status:** Ready for testing.
**Linear:** [APE-57](https://linear.app/aperturegraph/issue/APE-57).
**Related:** [packable_parent_vs_group_container.plan.md](packable_parent_vs_group_container.plan.md), [kit_parent_picker_ux.plan.md](kit_parent_picker_ux.plan.md).

## Problem

After Batch G, groups are first-class, but there's still no way to **create a group from
scratch** — you make a normal item and flag it "group only," which no longer matches the mental
model. And a group form shows item-only fields (Quantity, trip rule, restock) that are
meaningless for something that isn't packed.

## Decisions (agreed)

- **A1 — dedicated create flow + group mode form.**
- **B1 — copy-down defaults** onto children at creation (no live inheritance, no data-model change).
- **storage-min — inherit category, location, packs-into only.** Season / activity / assigned
  people stay per-item.

## What a group is

Identity + storage + scope + people. The packing-quantity fields don't apply (a group isn't a
packed line). No new persisted shape — a group is still an `isContainer: true` item.

| Field | In group form | Inherited by children |
|-------|---------------|------------------------|
| Name | yes | no |
| Category | yes | **yes** |
| Location | yes | **yes** |
| Packs into | yes | **yes** |
| Season / Activity | yes | no (per-item) |
| Assigned people | yes | no (per-item) |
| Notes | yes | no |
| Quantity / Trip quantity / Restock | **hidden** | n/a |

## Build

### 1. Group mode in the item modal

- `applyItemModalGroupMode(isGroup)` toggles visibility of the **item-only** controls:
  - Quantity row (`#iQty` field), Trip quantity block (`#iQtyRuleBlock`), restock checkbox.
- Wire to the `#iContainer` checkbox `onchange`, so the modal adapts live whether you're
  creating a group, editing one, or flipping an existing item to group-only.
- Call it from `openEditItemModal` (based on `item.isContainer`) and the new-group flow.

### 2. `openNewGroupModal()`

- `editItemId=null`, `clearItemForm()`, title **"New group"**.
- Check `#iContainer`, run `applyItemModalGroupMode(true)`.
- Default dropdowns; parent = none (groups are top-level); focus name.
- Save uses existing `saveItem` (already reads `iContainer`). Optional: after save, offer
  "+ Add item to group" for the new group.

### 3. Entry points

- Add **"+ New group"** to the Kit util menu (next to "+ Add item"); optionally surface in the
  kit empty state. Keep "+ Add item" as the primary.

### 4. Child copy-down (B1, storage-min)

- Extend `openAddSubModal(parentId)` to also pre-fill **packs-into** from the parent (category +
  location already copied). Leave season/activity/people untouched.
- Values are written onto the child on save and remain editable — no resolver, no link.

## Out of scope

- **B2** live inheritance (children resolving from parent at read time).
- **B3** "Apply group settings to all items inside" bulk action — possible later if reorganising
  existing groups proves fiddly.
- Inheriting season / activity / people (kept per-item by decision).
- New persisted field for "group" — `isContainer` stays the mechanism.

## Test plan

1. Kit util menu → "+ New group" → form shows no Quantity / Trip quantity / restock; save a
   group (e.g. "Cooking kit").
2. Edit an existing group → item-only fields hidden; edit a normal item → they show; tick
   "group only" → they hide live.
3. Add an item inside the new group → category, location, packs-into pre-filled from the group;
   change one → override sticks.
4. Reload → group + child persist.
