# Groups: a dedicated bundle, not a re-skinned item

**Status:** Ready for testing (supersedes the first "group mode in the item modal" build).
**Linear:** [APE-57](https://linear.app/aperturegraph/issue/APE-57).
**Related:** [packable_parent_vs_group_container.plan.md](packable_parent_vs_group_container.plan.md), [kit_parent_picker_ux.plan.md](kit_parent_picker_ux.plan.md).

## Why the rewrite

The first attempt let a group borrow the **item modal** and hid/relocated fields. That was the
root cause of every complaint: a blank "packs into", hints in the wrong place, and a cold,
disconnected feel. It also asked the user to **configure children that don't exist yet**
("Defaults for items inside") — the ERP smell we want to avoid.

A group and an item are **different objects**. They should stop sharing one face.

## Mental model

A group is a **bundle you already think in** — "Sleep kit", "Biscuit's bag", "Kitchen box".
Its payoff is calm: *"sleep kit's sorted"* instead of fifteen ticks.

- Creating a group should feel like **naming a box** — almost no commitment.
- The joy is **filling it**, not configuring it.
- Smart defaults for items added inside should be **invisible**, never a form section.

## Decisions (agreed)

| Question | Decision |
|----------|----------|
| Minimum to create | **Name + Category + Location** |
| Placement in kit | **Under a category** (so a group has a category) |
| After create | **Land inline, expanded**, with a "+ Add the first thing" affordance |
| Type on a group | **Dropped** — a bundle isn't a type (stored as `always` internally, never shown) |
| Inheritance | Children silently inherit **category + location** (invisible copy-down) |
| Conversion | A **menu action**, not a checkbox on a shared form |

## The group sheet (new, dedicated)

A small, warm modal — its own identity, not the item modal.

- **Name *** (placeholder: *"e.g. Sleep kit, Biscuit's bag, Kitchen box"*)
- **Category** (where it sits in the kit)
- **Location** — labelled *"Where it lives (optional)"*, with a *"— No fixed place —"* default
  (items in a bundle often live in different places). When empty, the kit row shows a muted "—".
- **Assign to person(s)** (optional — e.g. Biscuit's kit → the dog)
- **Notes** (optional)

That's all. No Type, Quantity, Trip quantity, Season, Activity, Packs into, restock, Actions, or
"Group only" checkbox. Same sheet is used for **edit** (title flips to "Edit group").

On save it writes/updates a normal item with `isContainer: true`, `type: 'always'` (silent), no
qtyRule / packsInto / season / activity / actions.

## Data model

No new persisted shape. A group is still `isContainer: true`. We just stop surfacing the
item-only fields and give it a purpose-built sheet. Internal `type` is forced to `always` so
existing filter/trip logic keeps working without ever showing a Type control on a group.

## Build

### 1. Remove the group-mode hacks from the item modal
- Delete the `#iGroupDefaults` "Defaults for items inside" section and the Category/Location
  relocation logic.
- Delete `applyItemModalGroupMode` and all its call sites.
- Remove the **"Group only (not packed on trip)"** checkbox (`#iContainer`) and its help text from
  the item modal. The item modal returns to being purely for items.

### 2. New `groupModal` + functions
- Markup: a compact modal with Name / Category / Location / Assign / Notes.
- `openNewGroupModal()` — clears the sheet, title "New group", focuses name.
- `openEditGroupModal(id)` — loads an existing container into the sheet, title "Edit group".
- `saveGroup()` — create or update: `isContainer:true`, `type:'always'`, name/category/location/
  personIds/notes; everything else left at safe defaults; persists + re-renders + focuses the
  group inline (expanded) in the kit.

### 3. Routing
- "+ New group" entry points (header + kit util menu) → `openNewGroupModal`.
- `openEditItemModal(id)` branches: if `item.isContainer` → `openEditGroupModal(id)`, else the item
  modal as today.

### 4. Land inline (expanded)
- After `saveGroup` for a new group: add its id to the expanded set, scroll to it, and show a
  clear **"+ Add the first thing"** affordance on the empty group (reuse `openAddSubModal`).

### 5. Conversion as a menu action
- Keep the **add-sub first-child prompt** (APE-20): adding the first child to a plain item still
  asks "real bag/box or kit grouping?" and sets `isContainer` accordingly.
- Add a kit context-menu action **"Turn into group"** for a plain item (sets `isContainer:true`;
  opens the group sheet so name/category/location can be confirmed).
- Add a kit context-menu action **"Ungroup"** for a group (`ungroupItem`): its children move out
  to top-level and stay in the kit, the group label is removed (confirm first). Empty groups just
  ask to remove the label.

### 6. Invisible inheritance (unchanged, keep)
- `openAddSubModal(parentId)` pre-fills **category + location** from the parent group. No section,
  no labels — it just behaves. Season/activity/packs-into/people stay per-item.

## Out of scope
- Custom per-group **emoji** (nice future delight; category icon represents the group for now).
- Live/resolver inheritance and "apply group settings to all items inside" bulk action.

## Test plan
1. "+ New group" → dedicated sheet shows **only** Name / Category / Location / Assign / Notes;
   save "Sleep kit" → lands expanded inline under its category with "+ Add the first thing".
2. Add an item inside → category + location pre-filled from the group; change one → sticks.
3. Edit the group → opens the **group sheet** (not the item form); change name/location → persists.
4. "+ Add item" (normal) → full item form, no "Group only" checkbox anywhere.
5. Plain item → context menu "Turn into group" → becomes a group, opens group sheet.
6. Group → context menu "Ungroup" → children move out to top-level and stay in the kit; group
   label gone. Group created with "— No fixed place —" shows a muted "—" for location.
7. Reload → group, children, and inherited fields persist; existing demo groups (Kitchen kit,
   Biscuit's kit) open correctly in the group sheet.
