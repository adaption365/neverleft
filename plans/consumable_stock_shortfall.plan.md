# Consumable stock & shortfall → shopping list

**Status:** Queued (not started). Sketch only — refine before build.
**Depends on:** Batch F quantity rules ([batch_f_quantity_rules.plan.md](batch_f_quantity_rules.plan.md)).
**Linear:** see Neverleft project (created with this plan).

## Why this is its own batch

Batch F gave us the **computed pack quantity** (×N). This batch adds the *other* half — for
**consumables only** — "how much do we have vs how much this trip needs, and what's worth
buying." It deliberately does **not** touch durables (camping equipment / household items),
which stay a calm pack-count-only world. See the category model in the Batch F plan.

## Core idea

For a `consumable`:

- `item.qty` is reinterpreted as **stock on hand** ("In stock").
- A trip computes **demand** via `computeTripQty` (existing).
- **Shortfall = max(0, demand − stock)**.
- A shortfall is offered — gently, opt-in — as a **shopping-list suggestion**. One tap to add.
- Nothing auto-mutates stock; the app never silently decrements or rewrites `item.qty`.

Durables (`always` / `house` / `seasonal`) are excluded entirely from shortfall/shopping.

## Principles (keep the calm tone)

- **Suggest, never nag.** A shortfall is a quiet "you may want N more," not a red alert.
- **No phantom inventory.** We never claim to know exact stock unless the user set it; if stock
  is unknown/zero we can still suggest the full trip demand, framed as "you'll likely need ~N."
- **Consumables only.** Hard gate on `type === 'consumable'` so socks/tents never appear.
- **User stays in control of stock.** Stock changes only via explicit edits or an opt-in
  "restocked" / "used some" action — never as a side effect of planning a trip.

## Surfaces (to design)

1. **Trip prep / packing** — an optional "Suggested amounts for this trip" strip (consumables
   with `demand > 0`), showing demand, stock, and shortfall, each with "Add N to shopping list."
   This is the deferred Batch F prep summary, now scoped consumable-only.
2. **Shopping list** — today it's flag-based (`restock || qty===0`,
   `itemsNeedingRestock()` ~index.html:1713). Extend so a consumable shortfall can populate it
   with a **quantity to buy**, not just a flag. Keep the manual flag path intact.
3. **Item editor** — relabel "Quantity" → **"In stock"** for consumables (contextual copy);
   durables keep "Default pack qty" or hide it when a rule is set.
4. **(Optional, later)** post-trip "ran out / had too much" feedback that nudges stock or the
   rule rate — explicitly confirmed, never automatic.

## Data / logic notes

- Likely no new persistent fields required for v1: shortfall is derived (`demand − qty`).
  A shopping line may need a `qtyToBuy` to carry the suggested amount.
- Reuse `computeTripQty` for demand and `itemsNeedingRestock` / shopping plumbing for output.
- Aggregate across **the active trip** (or trips?) — open question below.

## Open questions

- Shortfall against **one trip** at a time, or summed across upcoming trips?
- When stock is unknown (never set), do we suggest full demand or stay silent until the user
  opts in?
- Does adding a shortfall to the shopping list also set the existing `restock` flag, or live as
  a separate "to buy: N" line?
- Where does the prep strip live exactly (planning vs start-of-packing) and is it dismissible?

## Future companion — count-aware packing ([APE-56](https://linear.app/aperturegraph/issue/APE-56))

Today a checklist line is a single status (unchecked → ready → packed); a `×N` line assumes the
whole quantity packs on one tap. A companion enhancement adds **opt-in partial counts** on `×N`
lines only: a small `8 / 12` with −/+ steppers (persist `ci.packedQty`), auto-flipping to
`packed` at N so the one-tap path still means "all of them". Pairs with this batch's "what's
left" framing. Default stays whole-line tap — counts are an addition, never required.

## Out of scope

- Any stock tracking for non-consumables.
- Automatic stock depletion / barcode / true inventory.
- Auto-rewriting `qtyRule` rates without explicit confirmation.
