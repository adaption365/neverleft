---
title: Trip details — section-scoped links, always-on tabs, drive time
status: Ready for testing
linear: APE-59
scope: index.html — renderTripExperiencePanel, trip wizard route fields, weather copy
---

# Trip details — declutter header, put links & edits in their sections

## Problem

The trip experience panel duplicated information and felt busy:

- **One big "header" row of links** (Open in Maps · Plan route · Directions ·
  Campsite website · Email · Official forecast) sat above the panel, while the
  Site / Booking / Weather / Travel sub-tabs below only _described_ the same
  things ("Saved directions link on file", "Use Plan route above"). Links lived
  in the header; their context lived in the tabs.
- **Sub-tabs only appeared when they already held data**, so a new/empty trip
  showed almost nothing — no obvious place to add site, booking or travel info.
- **Editing** happened via a generic link row at the bottom (Essentials /
  Camping Kit / Site / Remember); it wasn't clear which edit changed what.
- "Save forecast" read like it stored something, not fetched it.

## Decision (with user)

- **Journey length** = a new **manual drive-time** field (e.g. "2h 30m") shown
  next to miles. No routing API (offline-first).
- **Always show all four sections** (Site / Booking / Weather / Travel), even
  when empty. Empty ones show a short "No … yet" line plus an **Add …** button.
- **Links move into their section** (deliberate disclosure — you don't see
  directions while packing):
  - **Site** → Open in Maps
  - **Booking** → Campsite website · Email site
  - **Weather** → Official forecast + Get / Refresh forecast (already in block)
  - **Travel** → Plan route · Directions
  - **Header glance** keeps only the at-a-glance lines (dates, times, and the
    **weather summary once loaded**) + chips (rules, avoid motorways, miles,
    drive time).
- Each section has a **contextual Edit button that jumps to the right wizard
  step**: Site & Booking → `site` step (twBooked3); Weather & Travel →
  `remember` step (twBooked4). The old bottom edit-links row is removed (the
  toolbar Edit button still opens the full wizard).
- Rename **Save forecast → Load forecast** (+ Reload when a snapshot exists); related copy / hints / toast updated.
- **All four tabs always visible**; on first open of a trip, the first section that still needs data opens (else Site). **Hide** collapses until you tap a tab again.

## Implementation (index.html)

- `normalizeTripExperience` — add `route.duration` (trimmed string).
- Wizard `twBooked4` — add `#tRouteDuration` text input next to miles;
  read in `readTripExperienceFromForm`, set in `fillTripExperienceForm`,
  clear in `clearTripExperienceForm`.
- `renderTripExperiencePanel` — rebuilt: four fixed tabs, per-section panels
  carrying their own links + Add/Edit jump; dropped the top actions row and the
  bottom edit-links row; drive time shown as a chip and in the Travel "Journey"
  line (`<miles> · <drive time>`).
- Forecast copy: button **Load forecast** / **Reload forecast**; season hint,
  no-postcode hint, success toast, and wizard hint aligned.
- Glance header adds a **journey line** (miles · drive time) when known, plus chips.
- Trip wizard travel preview shows **Plan route / Directions only** (forecast links live in the Weather tab on the trip page).

## Notes / testing

- Pure markup/JS in one file; no schema migration needed (duration defaults to
  '' for existing trips).
- Verify on a real phone: collapsed by default, all four tabs always present,
  empty tabs prompt + jump to the correct wizard step, links only appear in
  their section, weather summary still shows in the header once a forecast is
  loaded, drive time appears as a chip and in Travel.
