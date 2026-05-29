---
name: Kit parent / group picker UX
overview: Make "Group under" easy when the kit is large — searchable, scannable parent picker instead of a long date-ordered native select. Prefer lightweight patterns over drag-and-drop for v1.
todos:
  - id: parent-sort-alpha
    content: "populateParentDropdown: sort candidates A→Z by name (localeCompare); optional optgroup by category"
    status: completed
  - id: parent-search-combobox
    content: "Replace or augment #iParent <select> with filter-as-you-type list when top-level count > ~12; keyboard + tap friendly"
    status: completed
  - id: parent-context-shortcuts
    content: "When opened via openAddSubModal(parentId), keep parent pre-selected and de-emphasise picker; edit flow shows current group pinned at top"
    status: completed
  - id: add-to-group-menu
    content: "Inventory ••• on top-level rows → 'Add item to group' (openAddSubModal); parent stays packable until user sets group-only in edit"
    status: completed
  - id: move-to-group-menu
    content: "Optional v2: inventory ••• → 'Move to group…' using same searchable picker (covers re-parent without opening full editor)"
    status: completed
  - id: dnd-defer
    content: "Defer drag-and-drop between groups unless user research demands it; revisit after combobox ships"
    status: pending
isProject: false
---

# Kit parent / group picker UX

## Pain point

**"Group under (optional)"** in the item modal ([`#iParent`](index.html)) is a native `<select>` filled by [`populateParentDropdown`](index.html):

- Every **top-level** non-wishlist item (`!parentId`)
- Order = **`S.items` array order** (insertion / add order — feels like "by date")
- No search, no grouping, no hierarchy labels

With a large kit (demo ~100 lines, real kits growing over time), picking "Kitchen kit" or "Beds & sleep kit" from a long scroll is slow and error-prone — especially on mobile.

**Note:** [`openAddSubModal(parentId)`](index.html) already pre-selects the parent when adding from **"+ Add item to group"** — that path is fine. Pain is worst when:

- Adding a **new top-level** item then assigning a group
- **Editing** an item and changing which group it belongs to
- Re-parenting after the kit has grown

## Recommendation (priority)

### 1. Alphabetical order — do first (cheap, high value)

Always sort parent candidates **A→Z** by `name` (`localeCompare`).

Optional: wrap in `<optgroup label="Kitchen">` by `item.category` so related kits cluster without losing alpha within each group.

### 2. Searchable combobox — main UX fix (lightweight)

Replace long `<select>` with a small **combobox** pattern (no new dependencies):

| Piece | Behaviour |
|-------|-----------|
| Text input | Filter list as user types (name + optional notes) |
| Results list | Max ~8 visible rows, scroll; tap/Enter selects |
| Empty filter | Show full sorted list (or top N + "type to filter") |
| Top-level only | Keep current rule: only `!parentId` candidates |
| Clear | "— Top-level item —" always first |

**Threshold:** use combobox when `topLevelCount > 12` (or always — simpler one code path).

Reuse visual language from kit search (`#srch` / `.sw`) for consistency.

**Accessibility:** `role="combobox"`, `aria-expanded`, arrow keys, Escape clears — match patterns already used elsewhere if any.

### 3. Context shortcuts (low effort)

- **Add to group:** parent locked or shown as read-only chip + "Change" link (most adds never need the full list).
- **Edit item:** pin **current parent** (and "Top-level") at top of results before alpha list.

### 4. "Move to group" from inventory — optional v2

From kit row **•••** menu: **Move to group…** → same searchable picker → set `parentId`, `save()`, `renderInv()`.

Achieves many DnD goals without touch targets, scroll containers, or accidental drops.

### 5. Drag-and-drop — defer

| Pros | Cons |
|------|------|
| Feels direct on desktop | Hard on mobile; conflicts with row click (expand group, edit) |
| Good for reordering | NeverLeft doesn't emphasise manual sort order in kit table today |
| | Needs drop targets, undo, accessibility |

**Verdict:** Not v1. If users still struggle after search + alpha + "Move to group", consider **drag row onto group header** in My Kit only (desktop-first), with menu path as accessible alternative.

## Out of scope (for now)

- Parent picker showing **nested** parents (only top-level can be parents today — keep unless product allows sub-sub-items).
- Fuzzy search / Levenshtein — substring match on name is enough.
- "Recent groups" / favourites — nice later if analytics show repeat picks.

## Related

- [packable_parent_vs_group_container.plan.md](packable_parent_vs_group_container.plan.md) — add-sub prompt when first child is created (complementary; reduces wrong group type, not findability)

## Suggested build order

1. Alpha sort (+ optional category optgroups) in `populateParentDropdown`
2. Combobox UI for `#iParent` with filter
3. Add-sub modal: read-only parent chip
4. Inventory "Move to group…" (optional)
