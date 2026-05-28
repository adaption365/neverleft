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
| [APE-18](https://linear.app/aperturegraph/issue/APE-18) | forgotten_item… | `qty-rules-ux` |
| [APE-19](https://linear.app/aperturegraph/issue/APE-19) | forgotten_item… | `close-loop-later` (optional) |
| [APE-20](https://linear.app/aperturegraph/issue/APE-20) | packable_parent… | `add-sub-prompt` |
| [APE-21](https://linear.app/aperturegraph/issue/APE-21) | forgotten_item… | `qty-rules-model` |
| [APE-22](https://linear.app/aperturegraph/issue/APE-22) | packable_parent… | `kit-editor-copy` |
| [APE-23](https://linear.app/aperturegraph/issue/APE-23) | forgotten_item… | `post-trip-ui` |
| [APE-24](https://linear.app/aperturegraph/issue/APE-24) | kit_parent_picker… | `move-to-group-menu` |
| [APE-25](https://linear.app/aperturegraph/issue/APE-25) | trip_experience_hub | Phase 3 — Met Office / directions |
| [APE-26](https://linear.app/aperturegraph/issue/APE-26) | trip_experience_hub | Phase 2 — print cover (Done) |
| [APE-27](https://linear.app/aperturegraph/issue/APE-27) | trip_experience_hub | Phase 2 — custom site rules settings (Done) |

**Build order** (Linear priority): demo graduation + backup (APE-12–14, APE-13) → trip experience polish (APE-11, APE-25–27, APE-26) → camp mode (APE-15–17, APE-23) → qty rules (APE-21, APE-18) → kit UX (APE-20, APE-22, APE-24).

**Batched delivery (retrospective):** [backlog_batches_wave1_wave2.plan.md](backlog_batches_wave1_wave2.plan.md) — Wave 1 Done; Wave 2 Batch C Done (APE-43, 45, 46) criteria-gated stepper + `at-camp`.

## NeverLeft (this app)

| File | Status | Summary |
|------|--------|---------|
| [backlog_batches_wave1_wave2.plan.md](backlog_batches_wave1_wave2.plan.md) | Living | Retrospective batch order (Wave 1–2 shipped + Wave 2 Batch C scope) |
| [forgotten_item_feature_ux_d218206d.plan.md](forgotten_item_feature_ux_d218206d.plan.md) | Planned | Camp mode, trip learnings, qty rules, demo graduation, mandatory backup before wipe |
| [packable_parent_vs_group_container.plan.md](packable_parent_vs_group_container.plan.md) | Partial | Kit grouping vs packable bag/box; editor copy + add-sub prompt; checklist dual-row UX done |
| [kit_parent_picker_ux.plan.md](kit_parent_picker_ux.plan.md) | Partial | Searchable / A–Z group picker + locked “Add to group”; “Move to group” menu deferred |
| [trip_attendees_and_kit_40ad2a8d.plan.md](trip_attendees_and_kit_40ad2a8d.plan.md) | Done | Trip roster, checklist scoping, manual includes |
| [trip_experience_hub.plan.md](trip_experience_hub.plan.md) | Partial | Site/booking/travel/weather on trip; progressive disclosure on trip detail |
| [trip_setup_journey.plan.md](trip_setup_journey.plan.md) | Done | Emotional 4-step trip setup wizard (booked + idea paths) |

**Suggested build order** (from feature plan): demo graduation + backup gate → trip experience polish → Camp mode → qty rules.

## Archived (other projects)

Copied from Cursor for reference; not implemented in `index.html`:

- `360-degree_entity_cards_38495244.plan.md` — Knowledge graph entity cards
- `enterprisesearchpage_10_10_refactor_5ac31bf2.plan.md` — Enterprise search refactor
- `market_domination_strategy_d0f9a8c1.plan.md` — Community platform strategy
- `the_common_mvp_implementation_d1642ce9.plan.md` — The Common MVP

You can delete archived plans from this folder if you only want NeverLeft roadmaps here.
