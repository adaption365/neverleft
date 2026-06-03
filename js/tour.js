/* NeverLeft onboarding intro + spotlight tour (modular split phase 2) */

function nlEnterApp(){
  try{ localStorage.setItem('basecamp_introSeen','1'); }catch(e){}
  var el=document.getElementById('nlIntro');
  if(el){
    el.style.opacity='0'; el.style.pointerEvents='none';
    setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 360);
  }
  try{
    if(localStorage.getItem('basecamp_orientSeen')!=='1'){
      var o=document.getElementById('nlOrient'); if(o) o.style.display='flex';
    }
  }catch(e){}
}
function nlFinishOrient(showPayoff){
  try{ localStorage.setItem('basecamp_orientSeen','1'); }catch(e){}
  var o=document.getElementById('nlOrient');
  if(o){
    o.style.opacity='0'; o.style.pointerEvents='none';
    setTimeout(function(){ if(o.parentNode) o.parentNode.removeChild(o); }, 360);
  }
  if(showPayoff){
    setTimeout(function(){
      try{
        if(typeof S!=='undefined' && S.trips && S.trips.length && typeof openTrip==='function'){
          openTrip(S.trips[0].id);
          if(typeof nlTourMaybeAuto==='function') nlTourMaybeAuto();
        }
      }catch(e){}
    }, 420);
  }
}
function replayOnboarding(){
  try{
    localStorage.removeItem('basecamp_introSeen');
    localStorage.removeItem('basecamp_orientSeen');
    localStorage.removeItem('basecamp_tourSeen');
    localStorage.removeItem('basecamp_kitTourSeen');
  }catch(e){}
  location.reload();
}
(function(){
  try{
    var introDone=localStorage.getItem('basecamp_introSeen')==='1';
    var orientDone=localStorage.getItem('basecamp_orientSeen')==='1';
    var i=document.getElementById('nlIntro');
    if(i && introDone){ i.parentNode.removeChild(i); }
    var o=document.getElementById('nlOrient');
    if(o){
      if(orientDone){ o.parentNode.removeChild(o); }
      else if(introDone){ o.style.display='flex'; }
    }
  }catch(e){}
})();

(function(){
var tripSteps=[
  {sel:['.journey-scroll'],eyebrow:'1 of 4',title:'The journey',body:'Every trip moves through stages, from planning to packing to camp to home. NeverLeft keeps the right things in front of you at each one.'},
  {sel:['.consumable-prep'],eyebrow:'2 of 4',title:'What to buy',body:'It works out which consumables to top up, comparing what this trip needs with what you already have in stock.'},
  {sel:['.cprog','.cprog-pack-main','.checklist-toolbar'],eyebrow:'3 of 4',title:'A list that builds itself',body:'This packing list assembled itself from your Kit, scaled to the nights and people on the trip. Tick things off as you pack.'},
  {sel:['#dockKitBtn'],eyebrow:'4 of 4',title:'It all comes from your Kit',body:'Your Camping Kit is the one place you keep what you own. Every trip list is drawn from it, which is why we start you off with one.'}
];
var kitSteps=[
  {sel:['#pg-inv .kit-stats'],eyebrow:'1 of 3',title:'Everything you own',body:'Your whole kit at a glance: what you have, what is running low, all counted and grouped. This is the source of truth your trips draw from.'},
  {sel:['#pg-inv .kit-view-toggle'],eyebrow:'2 of 3',title:'A type and a home',body:'Every item has a type (always packed, bring from home, consumable) and a place it lives. Browse by category, or by place. That is what lets NeverLeft pack the right things and flag what to restock.'},
  {sel:['#dockTripsBtn'],eyebrow:'3 of 3',title:'It feeds your trips',body:'Add or change anything here and every trip\u2019s packing list updates to match. Your kit and your trips stay in sync.'}
];
var idx=0, order=[], catchEl, spot, pop, built=false, curSeenKey='basecamp_tourSeen';
function build(){
  if(built) return;
  catchEl=document.createElement('div'); catchEl.className='nlt-catch'; catchEl.addEventListener('click',next);
  spot=document.createElement('div'); spot.className='nlt-spot';
  pop=document.createElement('div'); pop.className='nlt-pop';
  document.body.appendChild(catchEl); document.body.appendChild(spot); document.body.appendChild(pop);
  built=true;
}
function findTarget(step){
  for(var i=0;i<step.sel.length;i++){ var e=document.querySelector(step.sel[i]); if(e && e.getClientRects().length) return e; }
  return null;
}
function place(t){
  var r=t.getBoundingClientRect(), pad=8;
  spot.style.left=(r.left-pad)+'px'; spot.style.top=(r.top-pad)+'px';
  spot.style.width=(r.width+pad*2)+'px'; spot.style.height=(r.height+pad*2)+'px';
  var pw=pop.offsetWidth, ph=pop.offsetHeight, vw=window.innerWidth, vh=window.innerHeight, top, left;
  if(r.bottom+14+ph<vh) top=r.bottom+14; else if(r.top-14-ph>12) top=r.top-14-ph; else top=Math.max(12,vh-ph-12);
  left=Math.min(Math.max(12, r.left+r.width/2-pw/2), vw-pw-12);
  pop.style.top=top+'px'; pop.style.left=left+'px';
}
function render(){
  var step=order[idx], t=findTarget(step);
  if(!t){ if(idx<order.length-1){ idx++; return render(); } return end(); }
  var last=idx===order.length-1;
  var dots=order.map(function(_,i){return '<span class="nlt-pop__dot'+(i===idx?' nlt-pop__dot--on':'')+'"></span>';}).join('');
  pop.innerHTML='<p class="nlt-pop__eyebrow">'+step.eyebrow+'</p><h3 class="nlt-pop__title">'+step.title+'</h3><p class="nlt-pop__body">'+step.body+'</p><div class="nlt-pop__row"><div class="nlt-pop__dots">'+dots+'</div><div style="display:flex;align-items:center;gap:4px"><button type="button" class="nlt-pop__skip">Skip</button><button type="button" class="nlt-pop__next">'+(last?'Done':'Next')+'</button></div></div>';
  pop.querySelector('.nlt-pop__skip').addEventListener('click',function(ev){ev.stopPropagation();end();});
  pop.querySelector('.nlt-pop__next').addEventListener('click',function(ev){ev.stopPropagation();next();});
  try{ t.scrollIntoView({block:'center',behavior:'smooth'}); }catch(e){ t.scrollIntoView(); }
  setTimeout(function(){ place(t); }, 360);
}
function next(){ if(idx<order.length-1){ idx++; render(); } else end(); }
function end(){
  try{ localStorage.setItem(curSeenKey,'1'); }catch(e){}
  if(catchEl) catchEl.style.display='none';
  if(spot) spot.style.display='none';
  if(pop) pop.style.display='none';
}
function start(stepsArr,seenKey){
  build(); order=(stepsArr||tripSteps).slice(); curSeenKey=seenKey||'basecamp_tourSeen'; idx=0;
  catchEl.style.display='block'; spot.style.display='block'; pop.style.display='block';
  render();
}
function tourActive(){ return built && catchEl && catchEl.style.display!=='none'; }
window.nlTripTour=function(){ start(tripSteps,'basecamp_tourSeen'); };
window.nlKitTour=function(){ start(kitSteps,'basecamp_kitTourSeen'); };
window.nlTourStart=function(){ start(tripSteps,'basecamp_tourSeen'); };
window.nlTourLaunch=function(){
  try{
    if(typeof mainTab!=='undefined' && mainTab==='inv'){ start(kitSteps,'basecamp_kitTourSeen'); return; }
    if(typeof S==='undefined'||!S.trips||!S.trips.length) return;
    if(typeof activeTripId!=='undefined' && activeTripId){ start(tripSteps,'basecamp_tourSeen'); }
    else if(typeof openTrip==='function'){ openTrip(S.trips[0].id); setTimeout(function(){ start(tripSteps,'basecamp_tourSeen'); },520); }
  }catch(e){}
};
window.nlTourMaybeAuto=function(){
  try{ if(!tourActive() && localStorage.getItem('basecamp_tourSeen')!=='1') setTimeout(function(){ start(tripSteps,'basecamp_tourSeen'); },650); }catch(e){}
};
window.nlKitTourMaybeAuto=function(){
  try{ if(!tourActive() && localStorage.getItem('basecamp_kitTourSeen')!=='1') setTimeout(function(){ start(kitSteps,'basecamp_kitTourSeen'); },500); }catch(e){}
};
})();
