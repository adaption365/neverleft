/* NeverLeft import/export + backup gates (modular split phase 3) */

// IMPORT / EXPORT
// ══════════════════════════════════════════════════
const DESTRUCTIVE_GATE_KEY='basecamp_destructive_gate_ok';
let _destructiveGateOnConfirmed=null;

function isDestructiveGateUnlocked(){
  return sessionStorage.getItem(DESTRUCTIVE_GATE_KEY)==='1';
}

function markDestructiveGateBackupDone(){
  sessionStorage.setItem(DESTRUCTIVE_GATE_KEY,'1');
  refreshDestructiveBackupModal();
}

function clearDestructiveGateSession(){
  sessionStorage.removeItem(DESTRUCTIVE_GATE_KEY);
  _destructiveGateOnConfirmed=null;
}

function requestDestructiveDataAction(cfg){
  clearDestructiveGateSession();
  _destructiveGateOnConfirmed=cfg.onConfirmed;
  renderDestructiveBackupModal(cfg);
}

function removeDestructiveBackupOverlay(){
  const ov=document.getElementById('destructiveBackupOverlay');
  if(ov) ov.remove();
}

function renderDestructiveBackupModal(cfg){
  removeDestructiveBackupOverlay();
  const last=localStorage.getItem('basecamp_last_export');
  const lastStr=last?new Date(last).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'Never backed up';
  const unlocked=isDestructiveGateUnlocked();
  const modalHtml=`
    <div id="destructiveBackupOverlay" class="sheet-overlay" onclick="if(event.target===this)closeDestructiveBackupModal()">
      <div class="sheet-panel sheet-panel--wide">
        <div class="sheet-handle"></div>
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px">
          <div style="font-family:'Familjen Grotesk',sans-serif;font-size:20px;font-weight:600;letter-spacing:-.015em;color:var(--text);line-height:1.2">${esc(cfg.title)}</div>
          <button type="button" onclick="closeDestructiveBackupModal()" style="background:var(--canvas-3);border:none;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-m);font-size:14px;flex-shrink:0;margin-left:12px;margin-top:2px" aria-label="Close">✕</button>
        </div>
        <div style="font-size:14px;color:var(--text-m);margin-bottom:6px;line-height:1.55">${esc(cfg.body)}</div>
        <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text-m);margin-bottom:18px">Last backup: ${lastStr} \u00b7 a fresh backup is required here</div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px">
          <button type="button" class="backup-action-btn backup-action-btn--primary" onclick="shareBackup({fromDestructiveGate:true})">
            <div>
              <div>Share or save a backup</div>
              <div style="font-size:12px;opacity:.55;margin-top:2px;font-weight:400">iCloud, Google Drive, WhatsApp, email\u2026</div>
            </div>
            <span style="font-size:18px;opacity:.6">\u2192</span>
          </button>
          <button type="button" class="backup-action-btn backup-action-btn--secondary" onclick="exportData({fromDestructiveGate:true})">
            <div>
              <div>Download backup file</div>
              <div style="font-size:12px;opacity:.5;margin-top:2px;font-weight:400">Saves to your Downloads folder</div>
            </div>
            <span style="font-size:18px;opacity:.4">\u2193</span>
          </button>
        </div>
        <p id="destructiveGateBackupHint" style="font-size:12px;color:var(--text-m);margin-bottom:14px;line-height:1.5">${unlocked?'Backup saved in this flow. You can continue \u2014 this still cannot be undone.':'Download or share a backup above to unlock the next step.'}</p>
        <button type="button" id="destructiveGateConfirmBtn" class="backup-action-btn backup-action-btn--primary" style="margin-bottom:10px;background:var(--rust);color:#fff;opacity:${unlocked?1:0.45};cursor:${unlocked?'pointer':'not-allowed'}" ${unlocked?'':'disabled'} onclick="confirmDestructiveGateAction()">${esc(cfg.confirmLabel)}</button>
        <button type="button" onclick="closeDestructiveBackupModal()" style="background:transparent;border:none;cursor:pointer;font-family:'Familjen Grotesk',sans-serif;font-size:13px;color:var(--text-m);padding:0;width:100%;text-align:center">Cancel</button>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend',modalHtml);
}

function refreshDestructiveBackupModal(){
  const btn=document.getElementById('destructiveGateConfirmBtn');
  const hint=document.getElementById('destructiveGateBackupHint');
  if(!btn) return;
  const unlocked=isDestructiveGateUnlocked();
  btn.disabled=!unlocked;
  btn.style.opacity=unlocked?'1':'0.45';
  btn.style.cursor=unlocked?'pointer':'not-allowed';
  if(hint) hint.textContent=unlocked?'Backup saved in this flow. You can continue \u2014 this still cannot be undone.':'Download or share a backup above to unlock the next step.';
}

function closeDestructiveBackupModal(){
  removeDestructiveBackupOverlay();
  clearDestructiveGateSession();
}

function confirmDestructiveGateAction(){
  if(!isDestructiveGateUnlocked()) return;
  const fn=_destructiveGateOnConfirmed;
  closeDestructiveBackupModal();
  if(typeof fn==='function') fn();
}

function exportData(opts){
  try{
    const json=JSON.stringify({version:3,exported:new Date().toISOString(),...S},null,2);
    const blob=new Blob([json],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=`neverleft-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
    localStorage.setItem('basecamp_last_export', new Date().toISOString());
    if(opts&&opts.fromDestructiveGate) markDestructiveGateBackupDone();
    else closeBackupModal();
    return true;
  }catch(e){
    showToast('Could not create backup. Try again or free browser storage before clearing data.');
    return false;
  }
}

async function shareBackup(opts){
  const json=JSON.stringify({version:3,exported:new Date().toISOString(),...S},null,2);
  const filename=`neverleft-${new Date().toISOString().slice(0,10)}.json`;
  const file=new File([json], filename, {type:'application/json'});
  if(navigator.canShare && navigator.canShare({files:[file]})){
    try{
      await navigator.share({
        title:'NeverLeft Backup',
        text:'NeverLeft camping inventory backup, '+new Date().toLocaleDateString('en-GB')+'. Open with NeverLeft to restore.',
        files:[file]
      });
      localStorage.setItem('basecamp_last_export', new Date().toISOString());
      if(opts&&opts.fromDestructiveGate) markDestructiveGateBackupDone();
      else closeBackupModal();
      return;
    }catch(e){
      if(e.name==='AbortError') return;
      showToast('Share failed. Try downloading a backup instead.');
      return;
    }
  }
  exportData(opts);
}

function checkBackupReminder(){
  if(isDemoMode()) return;
  const last=localStorage.getItem('basecamp_last_export');
  if(!last){
    // Never exported — show reminder after a small delay so app loads first
    setTimeout(showBackupModal, 1200);
    return;
  }
  const daysSince=(Date.now()-new Date(last).getTime())/(1000*60*60*24);
  if(daysSince>=7) setTimeout(showBackupModal, 1200);
}

function showBackupModal(){
  const last=localStorage.getItem('basecamp_last_export');
  const lastStr=last?new Date(last).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'Never backed up';
  const daysSince=last?Math.floor((Date.now()-new Date(last).getTime())/(1000*60*60*24)):null;
  const urgency=!last||daysSince>30;

  const heading=urgency?'Time to back up':'Back up your Camping Kit';
  const subheading=urgency
    ?'Your data has not been backed up'+(daysSince>0?' in '+daysSince+' days':'')+'. Browsers can clear local data without warning.'
    :'Your data lives on this device. A quick backup keeps everything safe if your browser clears its storage.';

  const modalHtml=`
    <div id="backupModalOverlay" class="sheet-overlay" onclick="if(event.target===this)closeBackupModal()">
      <div class="sheet-panel sheet-panel--wide">

        <!-- Handle -->
        <div class="sheet-handle"></div>

        <!-- Header -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px">
          <div style="font-family:'Familjen Grotesk',sans-serif;font-size:20px;font-weight:600;letter-spacing:-.015em;color:var(--text);line-height:1.2">${heading}</div>
          <button onclick="closeBackupModal()" style="background:var(--canvas-3);border:none;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-m);font-size:14px;flex-shrink:0;margin-left:12px;margin-top:2px">✕</button>
        </div>
        <div style="font-size:14px;color:var(--text-m);margin-bottom:6px;line-height:1.55">${subheading}</div>
        <div style="font-family:'DM Mono',monospace;font-size:11px;color:${urgency?'var(--rust)':'var(--text-m)'};margin-bottom:22px">Last backup: ${lastStr}</div>

        <!-- Actions -->
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
          <button type="button" class="backup-action-btn backup-action-btn--primary" onclick="shareBackup()">
            <div>
              <div>Share or save a backup</div>
              <div style="font-size:12px;opacity:.55;margin-top:2px;font-weight:400">iCloud, Google Drive, WhatsApp, email…</div>
            </div>
            <span style="font-size:18px;opacity:.6">→</span>
          </button>
          <button type="button" class="backup-action-btn backup-action-btn--secondary" onclick="exportData();closeBackupModal()">
            <div>
              <div>Download backup file</div>
              <div style="font-size:12px;opacity:.5;margin-top:2px;font-weight:400">Saves to your Downloads folder</div>
            </div>
            <span style="font-size:18px;opacity:.4">↓</span>
          </button>
        </div>

        <!-- Footer -->
        <div style="display:flex;justify-content:space-between;align-items:center">
          <button onclick="snoozeBackup()" style="background:transparent;border:none;cursor:pointer;font-family:'Familjen Grotesk',sans-serif;font-size:13px;color:var(--text-m);padding:0">Remind me tomorrow</button>
          <button onclick="closeBackupModal()" style="background:transparent;border:none;cursor:pointer;font-family:'Familjen Grotesk',sans-serif;font-size:13px;color:var(--text-m);padding:0">Not now</button>
        </div>

      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeBackupModal(){
  const ov=document.getElementById('backupModalOverlay');
  if(ov) ov.remove();
}

function snoozeBackup(){
  // Set last export to 6 days ago so it reminds again tomorrow
  const snooze=new Date(Date.now()-6*24*60*60*1000).toISOString();
  localStorage.setItem('basecamp_last_export', snooze);
  closeBackupModal();
}

function validateBackupImport(data){
  const MAX_ITEMS=20000,MAX_TRIPS=3000,MAX_PEOPLE=300;
  if(data===null||(typeof data!=='object'&&!Array.isArray(data)))
    return{ok:false,msg:'Invalid backup: file must contain JSON (an object or array).'};
  if(Array.isArray(data)){
    if(data.length>MAX_ITEMS) return{ok:false,msg:'Invalid backup: too many entries in array ('+data.length+').'};
    if(data.some(x=>!x||typeof x!=='object'||Array.isArray(x)))
      return{ok:false,msg:'Invalid backup: each entry must be a plain object.'};
    return{ok:true,legacyArray:true};
  }
  const ctor=data.constructor&&data.constructor.name;
  if(ctor&&ctor!=='Object') return{ok:false,msg:'Invalid backup: unsupported JSON object type.'};
  if(!Array.isArray(data.items))
    return{ok:false,msg:'Invalid backup: missing "items" array. Choose a file exported from NeverLeft.'};
  if(data.items.length>MAX_ITEMS)
    return{ok:false,msg:'Invalid backup: too many items ('+data.items.length+').'};
  if(data.version!=null&&(typeof data.version!=='number'||data.version<1||data.version>3))
    return{ok:false,msg:'Unsupported backup version. Export a new file from NeverLeft.'};
  if(data.trips!=null&&!Array.isArray(data.trips))
    return{ok:false,msg:'Invalid backup: "trips" must be an array if present.'};
  if(Array.isArray(data.trips)&&data.trips.length>MAX_TRIPS)
    return{ok:false,msg:'Invalid backup: too many trips.'};
  if(data.people!=null&&!Array.isArray(data.people))
    return{ok:false,msg:'Invalid backup: "people" must be an array if present.'};
  if(Array.isArray(data.people)&&data.people.length>MAX_PEOPLE)
    return{ok:false,msg:'Invalid backup: too many people.'};
  if(data.settings!=null&&(typeof data.settings!=='object'||Array.isArray(data.settings)))
    return{ok:false,msg:'Invalid backup: "settings" must be an object if present.'};
  if(data.settings){
    for(const k of ['categories','locations','activities']){
      const v=data.settings[k];
      if(v!=null&&!Array.isArray(v)) return{ok:false,msg:'Invalid backup: settings.'+k+' must be an array.'};
    }
  }
  return{ok:true,legacyArray:false};
}

function importData(event){
  const file=event.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const data=JSON.parse(e.target.result);
      const chk=validateBackupImport(data);
      if(!chk.ok){ alert(chk.msg); return; }
      const rawItems=chk.legacyArray?data:data.items;
      const tripCount=chk.legacyArray?0:(data.trips||[]).length;
      if(!rawItems){ alert('This file doesn\'t look like a NeverLeft backup. Please choose a file you exported from NeverLeft.'); return; }
      if(!confirm('Restore '+rawItems.length+' items and '+tripCount+' trips from this backup? This will replace all your current data.')) return;

      // Migrate items — fill in all fields with safe defaults
      const items=rawItems.map(i=>({
        id:          i.id||uid(),
        parentId:    i.parentId||null,
        name:        i.name||'Unnamed item',
        type:        i.type||'always',
        category:    i.category||'other',
        location:    i.location||'shed',
        qty:         (i.qty!=null)?Number(i.qty):1,
        qtyRule:     normalizeQtyRule(i.qtyRule),
        season:      i.season||'all',
        activity:    i.activity||'',
        restock:     !!i.restock,
        isContainer: !!i.isContainer,
        packsInto:   i.packsInto||null,
        personIds:   i.personIds||[],
        actions:     i.actions||[],
        notes:       i.notes||''
      }));

      // Migrate trips
      const trips=(chk.legacyArray?[]:(data.trips||[])).map(t=>({
        id:          t.id||uid(),
        name:        t.name||'Unnamed trip',
        status:      t.status||'planning',
        date:        t.date||'',
        nights:      t.nights||3,
        season:      t.season||'summer',
        site:        t.site||'basic',
        extraPeople: t.extraPeople||0,
        distance:    t.distance||'regional',
        ...(t.dog!=null?{dog:!!t.dog}:{}),
        activities:  t.activities||[],
        notes:       t.notes||'',
        checklist:   (t.checklist||[]).map(c=>({
          itemId: c.itemId,
          state:  c.state||(c.checked===true?'packed':'unchecked')
        })),
        actionStates:    t.actionStates||{},
        customActions:   Array.isArray(t.customActions)?t.customActions.map(a=>({
          id: a.id||uid(),
          label: String(a.label||'').trim(),
          stage: a.stage||'pre-trip',
        })).filter(a=>a.label):[],
        packUpStates:    t.packUpStates||{},
        packAwayStates:  t.packAwayStates||{},
        leftAtSite:      t.leftAtSite||{},
        damaged:         t.damaged||{},
        forgotEntries:   Array.isArray(t.forgotEntries)?t.forgotEntries.map(normalizeForgotEntry):[],
        unusedMarks:     Array.isArray(t.unusedMarks)?t.unusedMarks.map(normalizeUnusedMark):[],
        journalNotes:    Array.isArray(t.journalNotes)?t.journalNotes.map(normalizeJournalNote).filter(n=>n.text):[],
        journalMeals:    Array.isArray(t.journalMeals)?t.journalMeals.map(normalizeJournalMeal).filter(m=>m.had||m.worked||m.didnt||m.planned):[],
        journalDayMeta:  (t.journalDayMeta&&typeof t.journalDayMeta==='object'&&!Array.isArray(t.journalDayMeta))?t.journalDayMeta:{},
        attendeeIds:     Array.isArray(t.attendeeIds)?t.attendeeIds.filter(Boolean):[],
        manualIncludeIds:Array.isArray(t.manualIncludeIds)?t.manualIncludeIds.filter(Boolean):[],
        excludedItemIds:Array.isArray(t.excludedItemIds)?t.excludedItemIds.filter(Boolean):[],
        completedStages:Array.isArray(t.completedStages)?t.completedStages.filter(Boolean):[],
        venue:    t.venue&&typeof t.venue==='object'?t.venue:{},
        route:    t.route&&typeof t.route==='object'?t.route:{},
        weather:  t.weather&&typeof t.weather==='object'?t.weather:{},
      }));

      // Migrate people
      const people=(chk.legacyArray?[]:(data.people||[])).map(p=>({
        id:    p.id||uid(),
        name:  p.name||'Unknown',
        emoji: p.emoji||'👤',
        color: p.color||'#d4902a'
      }));

      // Migrate settings — keep custom lists if present, fall back to defaults
      const ds=defaultSettings();
      const settings=chk.legacyArray?ds:{
        categories: (data.settings&&data.settings.categories&&data.settings.categories.length)
          ? data.settings.categories : ds.categories,
        locations:  (data.settings&&data.settings.locations&&data.settings.locations.length)
          ? data.settings.locations  : ds.locations,
        activities: (data.settings&&data.settings.activities&&data.settings.activities.length)
          ? data.settings.activities : ds.activities,
        customSiteRules: Array.isArray(data.settings?.customSiteRules)?data.settings.customSiteRules:ds.customSiteRules,
        preferredMapsApp: MAPS_APP_OPTIONS.some(o=>o.id===data.settings?.preferredMapsApp)?data.settings.preferredMapsApp:ds.preferredMapsApp,
      };

      S={ items, trips, people, settings };
      S.trips.forEach(t=>{ normalizeTripStages(t); normalizeTripDogFlag(t); normalizeTripCustomActions(t); });
      if(data.meta&&typeof data.meta==='object'&&!Array.isArray(data.meta)) S.meta=data.meta;
      else S.meta={ dataSource:'user', importedAt:new Date().toISOString() };
      if(S.meta.dataSource==='demo') localStorage.setItem('basecamp_demo','1');
      else localStorage.removeItem('basecamp_demo');
      sessionStorage.removeItem('basecamp_demo_banner_hidden');
      save(); renderAll();
      initDemoBanner();
      alert('✓ Restored successfully, '+items.length+' items, '+trips.length+' trips, '+people.length+' people.');
    }catch(err){
      alert('Could not read file: '+err.message);
    }
  };
  reader.readAsText(file);
  event.target.value='';
}

// ══════════════════════════════════════════════════
