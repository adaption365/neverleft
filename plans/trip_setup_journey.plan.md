# Trip setup journey (emotional companion)

**Status:** Done (booked path) — Full 4-step companion wizard in `index.html`

## Goal

Replace data-entry trip modal with a calm, quiz-like multi-stage companion. Same underlying trip fields; emotional copy and fast exit ramps.

## Chunk 1 (done)

- [x] Step 0: What are you planning? (booked vs possible)
- [x] Branch A stage 1: Essentials (name, date, nights, who's coming, dog)
- [x] Validation: booked requires name + date + nights for Start planning
- [x] Actions: Start planning · Add more trip details
- [x] Branch B: Idea capture → status `idea`
- [x] Trips filter: All · Trips · Ideas
- [x] Graduate idea on trip page

## Chunk 2 (done)

- [x] Stage 2: Kit hints (`2 of 4 · What you'll need`) — season, site, distance, activities
- [x] Copy: kit suggestion helper + skip tone
- [x] Continue → stage 3 placeholder; Start planning now exits to trip page
- [x] Add more trip details → saves essentials, stays in wizard, opens stage 2
- [x] Back navigation between fork / 1 / 2 / 3
- [x] `openEditTripModal(id, 'kit'|'site'|'essentials')` for stage deep-links (chunk 4 UI)

## Chunk 3 (done)

- [x] Stage 3: Campsite — place, location, booking ref, check-in/out, site rules, site notes, contact (optional)
- [x] Copy: offline / rush helper tone
- [x] Continue → step 4 placeholder; trip page edit links per stage

## Chunk 4 (done)

- [x] Stage 4 (`4 of 4 · Before you go`): trip notes, travel (miles, motorways, directions link), site conditions
- [x] Forecast stays on trip page; snapshot note + clear only if already saved
- [x] Finish trip setup · Start planning now · Back
- [x] Trip page stage links (Essentials / Kit / Site / Remember)

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Idea status label | `idea` (not draft) |
| Trips home | Filter + same card layout, purple tint for ideas |
| Weather in setup | Trip page only (forecast); site conditions in stage 4 later |
| Edit | Full 4-step; deep-link to stage from trip page (chunk 4) |
| Booked minimum | Name, date, duration |
