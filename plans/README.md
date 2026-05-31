# NeverLeft plans

Product and implementation plans for this repo. **Source of truth for planning** — commit changes here so every machine stays in sync.

Cursor’s local Plan mode may still write to `~/.cursor/plans/` on your machine; treat these files as the copy you version in git.

## Linear (backlog & capture)

**Project:** [Neverleft](https://linear.app/aperturegraph/project/neverleft) (team: Aperture)

Linear holds **issues / todos only** — each links back to a plan file here for full spec. Do not duplicate plan bodies in Linear.

| Linear | Plan | Plan todo / scope |
|--------|------|-------------------|
| [APE-11](https://linear.app/aperturegraph/issue/APE-11) | trip_experience_hub | Fix weather widget placement (Done) |
| [APE-12](https://linear.app/aperturegraph/issue/APE-12) | forgotten_item… | `demo-graduate-ux` (Done) |
| [APE-13](https://linear.app/aperturegraph/issue/APE-13) | forgotten_item… | `backup-before-wipe` (Done) |
| [APE-14](https://linear.app/aperturegraph/issue/APE-14) | forgotten_item… | `demo-graduate-logic` (Done) |
| [APE-15](https://linear.app/aperturegraph/issue/APE-15) | forgotten_item… | `copy-ritual` |
| [APE-16](https://linear.app/aperturegraph/issue/APE-16) | forgotten_item… | `data-model` |
| [APE-17](https://linear.app/aperturegraph/issue/APE-17) | forgotten_item… | `camp-mode-ux` |
| [APE-18](https://linear.app/aperturegraph/issue/APE-18) | batch_f… / forgotten_item… | `qty-rules-ux` — Done (Batch F) |
| [APE-19](https://linear.app/aperturegraph/issue/APE-19) | batch_e… / forgotten_item… | `close-loop-later` — full capstone (Batch E) |
| [APE-20](https://linear.app/aperturegraph/issue/APE-20) | packable_parent… | `add-sub-prompt` — Done |
| [APE-21](https://linear.app/aperturegraph/issue/APE-21) | batch_f… / forgotten_item… | `qty-rules-model` — Done (Batch F) |
| [APE-22](https://linear.app/aperturegraph/issue/APE-22) | packable_parent… | `kit-editor-copy` — Done |
| [APE-23](https://linear.app/aperturegraph/issue/APE-23) | forgotten_item… | `post-trip-ui` |
| [APE-24](https://linear.app/aperturegraph/issue/APE-24) | kit_parent_picker… | `move-to-group-menu` — Done |
| [APE-25](https://linear.app/aperturegraph/issue/APE-25) | trip_experience_hub | Phase 3 — Met Office / directions (largely superseded by APE-59) |
| [APE-26](https://linear.app/aperturegraph/issue/APE-26) | trip_experience_hub | Phase 2 — print cover (Done) |
| [APE-27](https://linear.app/aperturegraph/issue/APE-27) | trip_experience_hub | Phase 2 — custom site rules settings (Done) |
| [APE-52](https://linear.app/aperturegraph/issue/APE-52) | backlog_batches… | Trip workflow UX revisit (stepper, completion, undo) — discovery |
| [APE-55](https://linear.app/aperturegraph/issue/APE-55) | consumable_stock_shortfall… | Consumable stock & shortfall → shopping (Batch K; depends on F) |
| [APE-56](https://linear.app/aperturegraph/issue/APE-56) | consumable_stock_shortfall… | Count-aware / partial packing for ×N lines (Batch L; companion to K) |
| [APE-57](https://linear.app/aperturegraph/issue/APE-57) | quick_create_group… | Quick-create a group + child default inheritance (Batch M) — Done |
| [APE-58](https://linear.app/aperturegraph/issue/APE-58) | mobile_kit_wishlist_rows… | Mobile-first Kit & Want list rows (stack title/tags/⋯ on ≤640px) — Done |
| [APE-59](https://linear.app/aperturegraph/issue/APE-59) | trip_details_sections_links… | Trip details: section-scoped links, tabs, Load forecast, miles + drive time — Done |

**Build order** (Linear priority): demo graduation + backup (APE-12–14, APE-13) → trip experience polish (APE-11, APE-25–27, APE-26) → camp mode (APE-15–17, APE-23) → qty rules (APE-21, APE-18) → kit UX (APE-20, APE-22, APE-24).

**Batched delivery (retrospective):** [backlog_batches_wave1_wave2.plan.md](backlog_batches_wave1_wave2.plan.md) — Wave 1 Done; Wave 2 Batch C Done (APE-43, 45, 46) criteria-gated stepper + `at-camp`.

**Quick fixes (commit `9687d67`)** — Done: APE-54 (trip wizard buttons), APE-31 (scroll to top on navigation), APE-39 (floating scroll-to-top), APE-48 (want list refresh).

**Dog roster (APE-53)** — Done: dog is a normal crew member; kit lines use `personIds` + trip roster only (removed `trip.dog` checkbox and category-based dog gate).

**Trip to-dos at bottom (APE-60, APE-61)** — Done (commit `c915979`): trip-only tasks (`customActions`); kit actions + notes at bottom of each stage; To-do / Notes scroll links.

**Kit / groups batch** — Done: APE-20, APE-22, APE-24, APE-32, APE-35 (with APE-57 group sheet).

## NeverLeft (this app)

| File | Status | Summary |
|------|--------|---------|
| [backlog_batches_wave1_wave2.plan.md](backlog_batches_wave1_wave2.plan.md) | Living | Retrospective batch order (Wave 1–2 shipped + Wave 2 Batch C scope) |
| [batch_e_camp_learnings.plan.md](batch_e_camp_learnings.plan.md) | Done | Batch E — camp daily journal (notes/meals/weather/prompts), no-guilt learnings, APE-19 (commit `dfa534b`) |
| [batch_f_quantity_rules.plan.md](batch_f_quantity_rules.plan.md) | Done | Batch F — per-item `qtyRule` (perNight / perPersonPerNight), progressive-disclosure editor, checklist ×N tooltip, contextual stock hint (APE-21, APE-18; commit `9487f67`) |
| [consumable_stock_shortfall.plan.md](consumable_stock_shortfall.plan.md) | Queued | Batch K — consumable-only stock vs trip demand → shopping shortfall (APE-55; depends on F) |
| [quick_create_group.plan.md](quick_create_group.plan.md) | Done | Batch M — groups get a dedicated sheet (not the item form), invisible category+location inheritance, "Turn into group" / "Ungroup" menu actions, optional location (APE-57) |
| [mobile_kit_wishlist_rows.plan.md](mobile_kit_wishlist_rows.plan.md) | Done | Mobile-first Kit & Want list rows — stack title / tags / ⋯ menu on phones (≤640px) so cells stop overlapping; show location on phones (APE-58) |
| [forgotten_item_feature_ux_d218206d.plan.md](forgotten_item_feature_ux_d218206d.plan.md) | Partial | Camp learnings largely in app; qty rules + camp reframe remain |
| [packable_parent_vs_group_container.plan.md](packable_parent_vs_group_container.plan.md) | Done | Kit grouping vs packable bag/box; editor copy + add-sub prompt (APE-20, APE-22, APE-35) |
| [kit_parent_picker_ux.plan.md](kit_parent_picker_ux.plan.md) | Done | Searchable / A–Z group picker + “Move to group” menu (APE-24) |
| [trip_attendees_and_kit_40ad2a8d.plan.md](trip_attendees_and_kit_40ad2a8d.plan.md) | Done | Trip roster, checklist scoping, manual includes |
| [trip_experience_hub.plan.md](trip_experience_hub.plan.md) | Partial | Site/booking/travel/weather on trip; progressive disclosure on trip detail |
| [trip_details_sections_links.plan.md](trip_details_sections_links.plan.md) | Done | Trip details declutter — links in Site/Booking/Weather/Travel tabs; weather summary in header; Load forecast; miles + drive time; per-tab Edit jumps (APE-59) |
| [trip_setup_journey.plan.md](trip_setup_journey.plan.md) | Done | Emotional 4-step trip setup wizard (booked + idea paths) |

**Suggested build order** (from feature plan): demo graduation + backup gate → trip experience polish → Camp mode → qty rules.

## Archived (other projects)

Copied from Cursor for reference; not implemented in `index.html`:

- `360-degree_entity_cards_38495244.plan.md` — Knowledge graph entity cards
- `enterprisesearchpage_10_10_refactor_5ac31bf2.plan.md` — Enterprise search refactor
- `market_domination_strategy_d0f9a8c1.plan.md` — Community platform strategy
- `the_common_mvp_implementation_d1642ce9.plan.md` — The Common MVP

You can delete archived plans from this folder if you only want NeverLeft roadmaps here.
