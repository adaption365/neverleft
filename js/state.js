/* NeverLeft global state + constants (modular split phase 3) */

// STATE
// ══════════════════════════════════════════════════
const SK = 'basecamp_v3';
let S = { items:[], trips:[] };
let editItemId = null, editTripId = null;
let tf = 'all', mainTab = 'trips';
let activeTripId = null, activeTripTab = 'checklist';
let activeExperienceTab = null;
let activeExperienceForTripId = null;
let experiencePanelDismissed = false;
let tripWizardStep = 'fork';
let tripWizardPath = null;
let tripsTypeFilter = 'all';
let collapsedCats = new Set();   // inventory category sections
let collapsedInvLocs = new Set(); // inventory location sections (kit “by place” view)
let expandedInvGroups = new Set(); // kit item groups user opened (default collapsed)
let _focusInvItemId = null; // scroll/highlight after save (cleared after render)
let expandedChecklistGroups = new Set(); // tripId::itemId — packing list item groups user opened
let collapsedLocs = new Set();   // checklist locations
/** Checklist group ids (clgrp-*) user expanded while fully packed — stops auto re-collapse on each render. */
let expandedPackedChecklistGroups = new Set();
let personFilter = 'all';        // inventory person filter
let kitTripFilter = 'all';       // inventory trip filter ('all' | trip id)
let checklistPersonFilter = 'all'; // checklist person filter
let checklistLocFilter = 'all';    // checklist location filter
let checklistSort = 'location';    // checklist sort order
let checklistHidePacked = false;   // hide packed items
let checklistFiltersOpen = false;  // filter panel open state
let checklistSearch = '';          // packing list text filter (same rules as kit #srch)

const PACKING_VIEW_STORAGE_KEY='nlPackingViewMode';
function getPackingViewMode(){
  try{ return localStorage.getItem(PACKING_VIEW_STORAGE_KEY)==='full'?'full':'pack'; }catch(e){ return 'pack'; }
}
function setPackingViewMode(mode){
  markPackModeHintSeen();
  try{ localStorage.setItem(PACKING_VIEW_STORAGE_KEY, mode==='full'?'full':'pack'); }catch(e){}
  renderTrips();
}
function packingCalmViewActive(trip){
  return !!(trip&&trip.status==='packing'&&getPackingViewMode()==='pack');
}
function packingViewToggleActive(trip){
  return !!(trip&&trip.status==='packing');
}
function checklistHidePackedForTrip(trip){
  return checklistHidePacked;
}
let tripTodoFocusItemId = null;    // pack mode: item whose footer to-dos were opened from row chip
let _invTripPickTripId = null;     // active trip for “Add from inventory” modal
const PACK_CALM_GROUPS_INIT_KEY='nlPackCalmGroupsInit';
const PACK_MODE_HINT_SEEN_KEY='nlPackModeHintSeen';
function packModeHintSeen(){
  try{return localStorage.getItem(PACK_MODE_HINT_SEEN_KEY)==='1';}catch(e){return false;}
}
function markPackModeHintSeen(){
  try{localStorage.setItem(PACK_MODE_HINT_SEEN_KEY,'1');}catch(e){}
}

const CATS    = ['shelter','sleep','kitchen','clothing','hygiene','dog','other'];
const CLAB    = { shelter:'⛺ Shelter', sleep:'🛌 Sleep', kitchen:'🍳 Kitchen', clothing:'🧥 Clothing', hygiene:'🪥 Hygiene', dog:'🐕 Dog', other:'📦 Other' };
const TLAB    = { always:'Always packed', house:'Bring from home', consumable:'Consumable', seasonal:'Seasonal', wishlist:'Want list' };
const LLAB    = { shed:'Shed', duffle:'Duffle Bag', house:'House', car:'Car' };
const SELAB   = { summer:'Summer', shoulder:'Spring / Autumn', winter:'Winter', all:'All' };
const SITELAB = { hookup:'Full hookup', basic:'Basic', wild:'Wild' };
const DISTLAB = { local:'Local', regional:'Regional', remote:'Remote' };
const STLAB   = { idea:'Idea', planning:'Plan', packing:'Packing', 'at-camp':'At camp', 'pack-up':'Packing up', 'pack-away':'Back home', 'post-trip':'Back home', complete:'Done' };
/** Journey steps shown on the trip stepper (status ids). */
const TRIP_JOURNEY_STAGES=[
  {id:'planning',  label:'Plan',       tab:'notes'},
  {id:'packing',   label:'Packing',    tab:'checklist'},
  {id:'at-camp',   label:'At Camp',    tab:'at-camp'},
  {id:'pack-up',   label:'Packing up', tab:'pack-up'},
  {id:'pack-away', label:'Back home',  tab:'pack-away'},
];
const TRIP_STAGE_IDS=TRIP_JOURNEY_STAGES.map(s=>s.id);
const SITE_RULE_CHIPS=[
  {id:'no-dogs',label:'No dogs'},
  {id:'no-fires',label:'No open fires'},
  {id:'firepits-ok',label:'Fire pits OK'},
  {id:'quiet-hours',label:'Quiet hours'},
  {id:'no-parties',label:'No parties'},
  {id:'no-generators',label:'No generators'},
  {id:'hookup',label:'Electric hookup'},
  {id:'hard-standing',label:'Hard standing only'},
  {id:'shop-on-site',label:'Shop on site'},
  {id:'wifi',label:'Wi‑Fi available'},
];
let _tripRulesDraft={standard:new Set(),custom:[]};
const PERSON_COLORS = ['#d4902a','#6b8c5a','#5a7ab8','#b85c3a','#8a6ab8','#5a9a8a','#c8a84a','#b8a87a'];

// ══════════════════════════════════════════════════
