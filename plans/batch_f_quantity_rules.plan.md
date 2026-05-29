# Batch F — Quantity rules (APE-21 + APE-18)

**Status:** Ready for testing.
**Issues:** APE-21 (data model), APE-18 (editor + checklist UX).
**Parent context:** [forgotten_item_feature_ux_d218206d.plan.md](forgotten_item_feature_ux_d218206d.plan.md) § "Duration-aware quantities".

## Goal

Replace the three hard-coded `adjQty` name regexes (toilet roll / gas / dog food) with an
explicit, editable, per-item **quantity rule** that scales packing quantity by trip **nights**
and (optionally) **people**. Opt-in and calm: most items stay Fixed; trip quantity is always
**computed** and never rewrites home stock.

## Data model (APE-21)

Optional `qtyRule` on inventory items:

```js
item.qtyRule = {
  kind: 'perNight' | 'perPersonPerNight',  // absent / 'fixed' => use item.qty
  rate: 1,            // units per night (decimal ok: 0.5 = one every two nights)
  spare: false,       // +1 constant
  remoteBuffer: false // +1 when trip.distance === 'remote'
}
```

`normalizeQtyRule(r)` returns `null` for fixed/invalid, else a clean rule. Stored as `null`
when Fixed (keeps items lean).

### Compute

```
base = perNight            -> ceil(nights × rate)
       perPersonPerNight   -> ceil(nights × rate × people)
qty  = base + (spare ? 1 : 0) + (remoteBuffer && remote ? 1 : 0)
```

`ceil(x - 1e-9)` guards float error. **People** = assigned attendees on the trip
(`item.personIds ∩ effectiveTripAttendeeIds`) if any, else whole roster size (min 1).
Guests (`extraPeople`) are **deferred**.

`adjQty(item, trip)` now delegates to `computeTripQty`; if an item has no rule it falls back to
the legacy name match for un-migrated consumables, so nothing regresses.

### Migration & backup

- On `load()`, each item: normalize an existing `qtyRule`, else assign the legacy rule if it's a
  consumable whose name matches toilet roll / gas / dog food.
- Backup import maps `qtyRule` through `normalizeQtyRule`.
- Demo seed: gas (`perNight 1/3 +remote`), toilet roll (`perNight 0.5 +remote`),
  dog food (`perNight 1 +spare`), and **Socks** (`perPersonPerNight 1`) as the per-person proof.

### Rule ↔ legacy equivalence

| Item | Rule | Old logic |
|------|------|-----------|
| Toilet roll | perNight 0.5 + remote | `ceil(n/2) + remote` |
| Gas | perNight ⅓ + remote | `ceil(n/3) + remote` |
| Dog food | perNight 1 + spare | `n + 1` |
| Socks | perPersonPerNight 1 | `nights × people` |

## UX (APE-18)

- **Item editor** — a "Trip quantity" row on all non–want-list items (progressive disclosure):
  collapsed it reads `Fixed — uses Quantity above` with a **Scale for trip…** toggle; expanded
  shows kind dropdown, units-per-night field, and +spare / +remote checkboxes. A live summary
  line (e.g. `1 per person/night · +1 remote`) makes a set rule discoverable on revisit. The
  editor auto-expands when a rule already exists.
- **Checklist** — existing `×N` badge gains a `title` tooltip via `tripQtyExplain` (e.g.
  `3 nights × 4 people · +1 remote`).

## Quantity model — the three categories (agreed)

The word "quantity" actually covers **two separate concepts**; conflating them is what made
this feel complicated. They split cleanly along the existing `item.type` field, so behaviour is
driven by type rather than a universal inventory system.

| Owner's category | `item.type` | Exact stock matters? | What "quantity" means |
|------------------|-------------|----------------------|------------------------|
| Camping equipment (tent, awning) | `always` | No | Pack count (usually 1) |
| Household items we take (clothes, pillows, games) | `house` / `seasonal` | No | Pack count (often a per-person ×N; `item.qty` often irrelevant) |
| Consumables (toilet roll, gas, dog food) | `consumable` | **Yes — the killer app** | **In-stock count** |

**Two concepts:**

1. **Pack quantity (×N)** — "how many to bring on this trip." Useful for anything that scales
   (durable or not). Computed at the checklist, **never writes back** to `item.qty`. This is
   what Batch F ships. For a per-person rule, `item.qty` doesn't even enter the maths — so
   "do we own 4 socks or 50" genuinely never matters.
2. **Stock & shortfall** — "how many do we have, how many are we missing, buy the difference."
   Only meaningful for **consumables**, the only things that truly deplete and get rebought.

**Design decisions from this:**

- **Do not track stock** for `always` / `house` / `seasonal`. Quantity there is a pack count
  only — no depletion, no shopping integration, no guilt. (Washing socks stays an ad-hoc user
  action, never an app-generated shopping line.)
- **Stock + shortfall + shopping is consumable-only**, gated on `type === 'consumable'`.
- **`item.qty` is never auto-edited by a trip.** Trip quantity stays computed and read-only.
- The editor's **"Quantity" label should become contextual** — "In stock" for consumables,
  "Default pack qty" (or hidden) for durables once trip-scaling exists. (Copy tweak, future.)

## Out of scope (deferred)

- **Consumable stock & shortfall → shopping list** — promoted to its own batch:
  [consumable_stock_shortfall.plan.md](consumable_stock_shortfall.plan.md).
- Guests (`extraPeople`) in shared-consumable math.
- Post-trip "ran out" feedback adjusting a rule's rate.
- Contextual "Quantity" → "In stock" editor relabel.

## Test plan

1. **Demo load** — fresh demo; no console errors.
2. **Editor (existing rule)** — open Toilet roll: row expanded, `0.5 per night`, remote checked.
3. **Editor (set rule)** — Fixed item → Scale for trip… → Per person, per night, rate 1, save;
   reopen and confirm persistence + expanded state.
4. **Checklist ×N** — 3-night / 4-person trip: Socks shows ×N (nights×people) with a hover
   tooltip; Toilet roll shows ×N.
5. **Persistence** — reload; set rule survives; demo intact.
6. **Backup** — export/import round-trips `qtyRule`.

## Resolved decisions

- Rule set: Fixed / Per night / Per person-per-night (+ spare & remote). No "every N nights"
  phrasing — decimal rate covers it.
- People basis: assigned-else-roster; guests deferred.
- Editor scope: all non–want-list items via progressive disclosure (not type-gated) — pants /
  socks are the key per-person case and aren't `consumable`.
- Prep summary: deferred.
