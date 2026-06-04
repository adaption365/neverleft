/* NeverLeft load/save, demo mode, shared utils (modular split phase 3) */

// PERSISTENCE
// ══════════════════════════════════════════════════
function load(){
  try{
    const r=localStorage.getItem(SK);
    if(r){
      S=JSON.parse(r);
    } else {
      // First launch — load demo data and flag it
      const demo=demoData();
      S={ items:demo.items, trips:demo.trips, people:demo.people, settings:demo.settings };
      localStorage.setItem('basecamp_demo','1');
      save();
    }
    if(!S.items) S.items=[];
    S.items.forEach(i=>{
      if(i.qtyRule) i.qtyRule=normalizeQtyRule(i.qtyRule);
      else if(i.type==='consumable'){ const lg=legacyQtyRuleForName(i.name); if(lg) i.qtyRule=lg; }
    });
    if(!S.trips) S.trips=[];
    let migratedDogFlag=false;
    S.trips.forEach(t=>{
      if(!Array.isArray(t.manualIncludeIds)) t.manualIncludeIds=[];
      else{
        const ok=new Set(kitItems().map(i=>i.id));
        t.manualIncludeIds=t.manualIncludeIds.filter(id=>ok.has(id));
      }
      if(!Array.isArray(t.excludedItemIds)) t.excludedItemIds=[];
      else{
        const ok=new Set(kitItems().map(i=>i.id));
        t.excludedItemIds=t.excludedItemIds.filter(id=>ok.has(id));
      }
      normalizeTripLearnings(t);
      normalizeTripJournal(t);
      normalizeTripExperience(t);
      normalizeTripStages(t);
      if(t.dog!=null){ normalizeTripDogFlag(t); migratedDogFlag=true; }
      normalizeTripCustomActions(t);
    });
    if(migratedDogFlag) save();
    if(!S.people) S.people=[];
    if(S.featuredTripId&&!S.trips.some(t=>t.id===S.featuredTripId)) S.featuredTripId=null;
    if(!S.settings) S.settings=defaultSettings();
    else {
      if(!S.settings.categories||!S.settings.categories.length) S.settings.categories=defaultSettings().categories;
      if(!S.settings.locations||!S.settings.locations.length)   S.settings.locations=defaultSettings().locations;
      else S.settings.locations=S.settings.locations.map(l=>({isStorageLoc:true,...l}));
      if(!S.settings.activities||!S.settings.activities.length) S.settings.activities=defaultSettings().activities;
      if(!Array.isArray(S.settings.customSiteRules)) S.settings.customSiteRules=[];
      if(!MAPS_APP_OPTIONS.some(o=>o.id===S.settings.preferredMapsApp)) S.settings.preferredMapsApp='google';
    }
  }catch(e){
    const demo=demoData();
    S={ items:demo.items, trips:demo.trips, people:demo.people, settings:demo.settings };
  }
}

function isDemoMode(){
  return localStorage.getItem('basecamp_demo')==='1';
}

function initDemoBanner(){
  if(!isDemoMode()) return;
  if(sessionStorage.getItem('basecamp_demo_banner_hidden')==='1') return;
  const b=document.getElementById('demoBanner');
  if(b) b.style.display='flex';
}

function dismissDemoBanner(){
  const b=document.getElementById('demoBanner');
  if(b) b.style.display='none';
  if(isDemoMode()) sessionStorage.setItem('basecamp_demo_banner_hidden','1');
}

function graduateFromDemo(){
  if(!isDemoMode()){
    dismissDemoBanner();
    return;
  }
  localStorage.removeItem('basecamp_demo');
  sessionStorage.removeItem('basecamp_demo_banner_hidden');
  if(!S.meta||typeof S.meta!=='object'||Array.isArray(S.meta)) S.meta={};
  S.meta.dataSource='user';
  S.meta.graduatedAt=new Date().toISOString();
  save();
  dismissDemoBanner();
  showToast('This is your Camping Kit now.');
  const pg=document.getElementById('pg-settings');
  if(pg&&pg.style.display!=='none') renderSettings();
}

function clearDemoData(){
  requestResetAllData();
}

function requestResetAllData(){
  requestDestructiveDataAction({
    title:'Start fresh?',
    body:'This removes your Camping Kit, trips, people and settings from this device. Download or share a backup below first \u2014 then you can clear everything.',
    confirmLabel:'Clear all data',
    onConfirmed:()=>resetAllData()
  });
}

function requestLoadDemoDataAgain(){
  requestDestructiveDataAction({
    title:'Replace with demo data?',
    body:'This replaces your current Camping Kit with sample data. Save a backup below first so you can restore if you change your mind.',
    confirmLabel:'Replace with demo',
    onConfirmed:()=>loadDemoDataAgain()
  });
}

function resetAllData(){
  // Clear all user data — preserve theme and backup timestamp
  const theme=localStorage.getItem('basecamp_theme');
  const lastExport=localStorage.getItem('basecamp_last_export');
  localStorage.clear();
  // Demo mode flag and all NeverLeft keys cleared; restore only theme + last backup reminder below.
  if(theme) localStorage.setItem('basecamp_theme',theme);
  if(lastExport) localStorage.setItem('basecamp_last_export',lastExport);
  S={ items:[], trips:[], people:[], settings:defaultSettings() };
  save();
  dismissDemoBanner();
  renderAll();
  alert('\u2713 All data cleared. You\'re starting fresh.');
}

function loadDemoDataAgain(){
  const demo=demoData();
  S={ items:demo.items, trips:demo.trips, people:demo.people, settings:demo.settings };
  localStorage.setItem('basecamp_demo','1');
  sessionStorage.removeItem('basecamp_demo_banner_hidden');
  save();
  initDemoBanner();
  renderAll();
}
function save(){
  try{ localStorage.setItem(SK,JSON.stringify(S)); }
  catch(e){
    const full=e&&e.name==='QuotaExceededError';
    showToast(full?'Could not save, storage is full. Export a backup, then remove items or old trips.':'Could not save, your browser blocked storage.');
  }
}
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(d){ if(!d)return''; try{return new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});}catch(e){return d;} }

// ══════════════════════════════════════════════════
