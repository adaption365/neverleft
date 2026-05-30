---
title: Mobile-first Kit & Want list rows
status: Done
linear: APE-58
scope: index.html — .irow card layout on phones (≤640px)
---

# Mobile-first Kit & Want list rows

## Problem

On phones the Kit and Want list rows squish and overlap. Each row is one
flex line holding five cells — name, type pill, location, qty, ⋯ menu — so the
name truncates / wraps awkwardly while the pills and controls crowd the right
edge. To make room the old rule even hid the location column entirely at
≤640px. It reads as cramped, not calm.

## Decision (with user)

- **Show location** as a tag on phones (there's room once rows stack).
- **Want list:** drop the inline "↑ Add to Inventory" button on phones; the
  action already lives in the ⋯ menu. Notes stay hidden on phones.
- **Breakpoint:** phones only (≤640px). Tablet/desktop unchanged.
- Keep everything else the same — pure CSS, no markup or JS changes.

## Mental model

A row on a phone is a small card that breathes:

```
┌─────────────────────────────────────┐
│ Item name                           │  ← title gets its own row
│ subtitle / notes                    │
│ [type] [location] [qty]        ⋯    │  ← tags + control row, menu at the end
└─────────────────────────────────────┘
```

## Build

`index.html`, inside `@media(max-width:640px)`:

- `.irow{flex-wrap:wrap}` so cells can stack.
- Name cell `td:nth-child(1){flex:0 0 100%}` → title on its own row.
- Kit: type/location/qty (`td:nth-child(2..4)`) wrap onto a second row;
  ⋯ menu (`td:nth-child(5)`) gets `margin-left:auto` to sit at the row end.
- Want list (`.irow.wishlist-item`): location on row 2, notes hidden,
  `.btn-g` (Add to Inventory) hidden, actions cell pinned right.
- Removed the old `.itbl td:nth-child(3){display:none}` rule that hid the
  location column on phones.

## Out of scope

- Trip checklist rows (`.ci`) — different component; revisit separately if the
  same squish shows up there.
- Tablet / desktop layout.

## Test plan

On a real phone (or browser device mode ~360–430px CSS width — note: the
in-editor browser renders at a fixed desktop viewport and can't exercise this
breakpoint):

1. Kit → each row: name on its own line; type, location, qty wrap below; ⋯ at
   the right; nothing overlaps.
2. Group rows (e.g. "Beds & sleep") and sub-items stack the same way.
3. Consumable rows: qty − / + stepper is tappable (40px targets) on row 2.
4. Want list → name on its own line, location tag below, ⋯ menu opens and still
   offers "Add to inventory"; no squished inline button.
5. Desktop/tablet unchanged (single-row layout as before).
