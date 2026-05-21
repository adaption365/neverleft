# Trip experience hub (camping landing zone)

**Status:** Partial — Phase 1 in `index.html` (schema + trip detail panel + edit modal sections).  
**Goal:** Trip detail feels like a **camping experience hub**, not an inventory dashboard. Kit/packing stays one tap away; site, travel, and booking context uses **progressive disclosure**.

## Principles

1. **Default path unchanged** — Create trip: name + dates (+ existing season/site/dog). Packing checklist remains the main action once started.
2. **Progressive disclosure** — Glance card on trip open → expand “Site & directions”, “Booking”, “Weather & conditions” only when needed.
3. **Offline-first** — All fields stored locally. Maps/directions links are optional `target="_blank"` when `navigator.onLine`; never required to use the app.
4. **No silent API dependency** — Weather: `estimate` from existing `season` (+ optional manual override). Live forecast deferred until explicit online fetch UX exists.

## Data model (`trip` object)

```js
trip.venue = {
  name, address, website, email,
  bookingRef, checkIn, checkOut,   // times as "HH:MM" strings
  directionsUrl,                 // optional deep link (Google/Apple directions)
  rules: [],                      // string ids e.g. 'no-dogs', 'firepits-ok'
  siteNotes
};
trip.route = {
  distance,                      // legacy enum: local | regional | remote
  miles,                         // optional number
  avoidMotorways: boolean,
  driveNotes
};
trip.weather = {
  mode: 'estimate' | 'manual',
  summary, highC, lowC
};
```

`normalizeTripExperience(t)` runs on load (like learnings).

## UX layers

| Layer | Where | Content |
|-------|--------|---------|
| 0 | New trip modal | Name, date, nights only (unchanged required fields) |
| 1 | Trip detail glance | Site name, dates, check-in/out, weather one-liner, rule chips |
| 2 | Trip detail `<details>` | Site & directions (address, maps link, directions URL, miles, avoid motorways) |
| 3 | Trip edit modal `<details>` | Full field entry; “Site & booking”, “Travel”, “Weather” |
| 4 | Online affordances | “Open in Maps” / “Directions” buttons disabled or muted offline with tooltip |

## Phase 1 (shipped)

- Schema + migration
- Trip detail experience panel + remove kit stat tiles from trip header
- Edit modal collapsible sections
- Estimated weather from season; manual summary override

## Phase 2

- **Rule chips (done):** Standard toggles in trip edit; `trip.venue.customRules`; saved presets in `S.settings.customSiteRules`
- Hero card on Trips home: site name, check-in (≤7 days), up to 2 headline rules in meta; notes hidden when site set (done)
- Print/export block: booking ref + address on packing print cover (next)
- Settings UI to rename/delete saved custom rules (optional)

## Phase 3 (weather — partial)

- **Done:** Weather `<details>` on trip (open by default); season / manual / Open-Meteo snapshot; `fetchedAt` + stale hint; yr.no / search forecast link; editorial nudge for shoulder/winter
- Geocode stored on `venue.lat` / `venue.lng` after fetch
- Optional: Met Office deep link; directions with avoid motorways

## Additional fields worth capturing (backlog)

| Field | Why |
|-------|-----|
| Pitch / loop / plot number | Finding the tent on arrival |
| What3words | Rural sites with poor addressing |
| Hookup amperage (10A/16A) | Kit + electric hookup planning |
| Quiet hours | Noise / kids bedtime |
| Payment on arrival / balance due | Admin at check-in |
| Nearest hospital / pharmacy | Safety offline reference |
| Target leave-home time | Travel day orchestration (pairs with check-in) |
| Elevation / exposure note | Wind/rain planning beyond season enum |
| Fuel / food shop en route | Drive day (manual note) |

## What we deliberately defer

- Live traffic routing APIs
- Replacing packing stepper with a tab bar
- Requiring venue data before `Start packing`

## Build order

After Phase 1 stabilises: forgotten-item Camp mode can link “on site” sheet to `venue.siteNotes` + rules.
