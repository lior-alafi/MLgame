(() => {
  'use strict';
  const BANK = window.ML_BANK;
  if(!BANK) return;

  // Keep the same preference key so the user's existing topic choice is preserved.
  const TOPIC_KEY = 'ml-math-topics-v12';
  const originalItems = [...BANK.items];
  const originalTopics = [...BANK.topics];
  let active = false;
  let lastRuntimeError = '';

  window.addEventListener('error', e => {
    lastRuntimeError = e?.error?.stack || e?.message || 'Unknown JavaScript error';
  });
  window.addEventListener('unhandledrejection', e => {
    lastRuntimeError = e?.reason?.stack || String(e?.reason || 'Unhandled promise rejection');
  });

  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const eligibleSheet = it => it.sheet === 'NOT_GIVEN' || it.sheet === 'PARTIAL';
  const isMathItem = it => {
    if(!eligibleSheet(it)) return false;
    if(it.sheet === 'PARTIAL') return true;
    if(it.kind === 'formula') return true;
    if(it.kind === 'theorem') return true;
    if(it.kind === 'definition' && (it.formula || it.definitionParts?.some(x => /Err|arg|max|min|∈|=|≤|≥|sum|P\(|N\(/i.test(String(x))))) return true;
    if(it.kind === 'algorithm' && it.isProof) return true;
    return false;
  };

  const allMathItems = () => originalItems.filter(isMathItem);
  const mathTopics = () => originalTopics.filter(t => allMathItems().some(x => x.topic === t));

  function loadPrefs(){
    try {
      const p=JSON.parse(localStorage.getItem(TOPIC_KEY)||'null');
      if(p && typeof p==='object') return {all:p.all!==false, topics:Array.isArray(p.topics)?p.topics:[]};
    } catch{}
    return {all:true, topics:[]};
  }
  function savePrefs(p){ localStorage.setItem(TOPIC_KEY, JSON.stringify(p)); }

  function boosted(it){
    let mul = it.sheet==='NOT_GIVEN' ? 4.5 : 3.4;
    if(it.memory==='MUST_RECALL') mul*=1.8;
    else if(it.memory==='MUST_RECONSTRUCT') mul*=1.55;
    return {...it, priority:Math.max(1,(it.priority||1)*mul)};
  }

  function applyFilter(pref){
    const selected = pref.all ? null : new Set(pref.topics);
    const items = allMathItems().filter(x => !selected || selected.has(x.topic)).map(boosted);
    if(!items.length) return false;
    BANK.items = items;
    BANK.topics = originalTopics.filter(t => items.some(x => x.topic===t));
    active = true;
    window.ML_MATH_MODE_ACTIVE = true;
    return true;
  }

  function restore(){
    if(!active) return;
    BANK.items = originalItems;
    BANK.topics = originalTopics;
    active = false;
    window.ML_MATH_MODE_ACTIVE = false;
  }
  window.ML_MATH_RESTORE = restore;

  function closeModal(){ document.getElementById('mathModeModal')?.remove(); }

  function failStart(message){
    restore();
    const old=document.getElementById('mathStartFailure'); old?.remove();
    const box=document.createElement('div');
    box.className='modal'; box.id='mathStartFailure';
    box.innerHTML=`<div class="sheet math-sheet" dir="rtl"><h2>Math Memory לא התחיל</h2><p class="prose-he">${esc(message)}</p>${lastRuntimeError?`<details><summary>פרטי שגיאה</summary><pre style="direction:ltr;white-space:pre-wrap;font-size:11px">${esc(lastRuntimeError)}</pre></details>`:''}<button class="primary-btn" id="mathFailClose" style="width:100%">חזרה</button></div>`;
    document.body.appendChild(box);
    box.querySelector('#mathFailClose').onclick=()=>box.remove();
  }

  function launchMathSession(){
    // v13 used one immediate hidden-DOM click. After a timed-out/reloaded build that could
    // silently miss the button. v14 retries for a short bounded interval and verifies that
    // an actual question card was created.
    let attempts=0;
    const tryLaunch=()=>{
      attempts++;
      const btn=document.getElementById('continue');
      if(btn){
        btn.click();
        setTimeout(()=>{
          const ok = location.hash==='#play' && !!document.querySelector('.question-card');
          if(ok){ decoratePlay(); return; }
          if(attempts<8){ setTimeout(tryLaunch,80); return; }
          failStart('לא נוצרה שאלה אחרי לחיצה על Start. הגרסה נשארה יציבה והמסנן הוחזר למצב הרגיל.');
        },120);
        return;
      }
      if(attempts<8){ setTimeout(tryLaunch,80); return; }
      failStart('כפתור Continue של מנוע התרגול לא נמצא. רענון אחד אמור לפתור זאת; ההתקדמות לא נמחקת.');
    };
    requestAnimationFrame(tryLaunch);
  }

  function openChooser(){
    closeModal();
    restore();
    lastRuntimeError='';
    const pref=loadPrefs();
    const selected=new Set(pref.topics.filter(t=>mathTopics().includes(t)));
    let all=pref.all || selected.size===0;
    const modal=document.createElement('div');
    modal.className='modal'; modal.id='mathModeModal';
    const topicRows=mathTopics().map((t,i)=>{
      const n=allMathItems().filter(x=>x.topic===t).length;
      return `<button class="chip math-topic ${!all&&selected.has(t)?'on':''}" data-math-topic="${i}">${esc(t)} <small>${n}</small></button>`;
    }).join('');
    modal.innerHTML=`<div class="sheet math-sheet" dir="rtl">
      <h2>🧮 Math Memory</h2>
      <p class="prose-he">תרגול מתמטי בלבד של <b>NOT GIVEN + PARTIAL</b>: נוסחאות, תנאי משפטים והוכחות פורמליות. כל המצבים הרגילים נשארים ללא שינוי.</p>
      <div class="math-summary"><b>${allMathItems().filter(x=>x.kind==='formula').length}</b> נוסחאות · <b>${allMathItems().filter(x=>x.sheet==='PARTIAL').length}</b> פריטי PARTIAL · <b>${allMathItems().filter(x=>x.sheet==='NOT_GIVEN').length}</b> פריטי NOT GIVEN</div>
      <div class="math-select-row">
        <button class="secondary-btn ${all?'math-all-on':''}" id="mathAll">✓ כל הנושאים</button>
        <button class="secondary-btn" id="mathClear">בחירה ידנית / נקה</button>
      </div>
      <div class="tiny math-pick-label">או בחר נושאים ספציפיים:</div>
      <div class="chips math-topic-grid">${topicRows}</div>
      <div class="math-selected-note" id="mathSelectedNote"></div>
      <div class="action-row"><button class="secondary-btn" id="mathCancel">ביטול</button><button class="primary-btn" id="mathStart">התחל Math Memory</button></div>
    </div>`;
    document.body.appendChild(modal);

    const note=modal.querySelector('#mathSelectedNote');
    const allBtn=modal.querySelector('#mathAll');
    const startBtn=modal.querySelector('#mathStart');
    const refresh=()=>{
      allBtn.classList.toggle('math-all-on',all);
      modal.querySelectorAll('[data-math-topic]').forEach((b,i)=>{
        const t=mathTopics()[i]; b.classList.toggle('on',!all&&selected.has(t));
      });
      note.textContent=all ? `כל ${mathTopics().length} הנושאים נבחרו` : selected.size ? `${selected.size} נושאים נבחרו` : 'לא נבחר נושא — בחר לפחות אחד או לחץ ״כל הנושאים״';
    };
    refresh();

    allBtn.onclick=()=>{all=true;selected.clear();refresh();};
    modal.querySelector('#mathClear').onclick=()=>{all=false;selected.clear();refresh();};
    modal.querySelectorAll('[data-math-topic]').forEach((b,i)=>b.onclick=()=>{
      all=false; const t=mathTopics()[i]; selected.has(t)?selected.delete(t):selected.add(t); refresh();
    });
    modal.querySelector('#mathCancel').onclick=closeModal;
    modal.onclick=e=>{if(e.target===modal) closeModal();};
    startBtn.onclick=()=>{
      if(!all && !selected.size){ note.textContent='בחר לפחות נושא אחד.'; return; }
      startBtn.disabled=true;
      startBtn.textContent='פותח Math Memory…';
      note.textContent=all?'מכין תרגול מכל הנושאים…':`מכין תרגול מ-${selected.size} נושאים…`;
      const chosen={all,topics:[...selected]}; savePrefs(chosen);
      if(!applyFilter(chosen)){ startBtn.disabled=false; startBtn.textContent='התחל Math Memory'; note.textContent='לא נמצאו פריטי Math Memory למסנן הזה.'; return; }
      closeModal();
      launchMathSession();
    };
  }

  function decoratePlay(){
    if(!active) return;
    const title=document.querySelector('.topbar .title');
    if(title && title.textContent!=='🧮 MATH MEMORY') title.textContent='🧮 MATH MEMORY';
    const meta=document.querySelector('.question-card .q-sub');
    if(meta && !meta.textContent.includes('Math Memory')) meta.textContent += ' · Math Memory';
  }

  function injectHomeButton(){
    if(location.hash && location.hash!=='#home') { decoratePlay(); return; }
    const grid=document.querySelector('.grid');
    if(!grid || document.getElementById('mathMemory')) return;
    const btn=document.createElement('button');
    btn.className='home-btn math-memory-card'; btn.id='mathMemory';
    btn.innerHTML='<span class="emoji">🧮</span><strong>Math Memory</strong><small>NOT GIVEN + PARTIAL · כל הנושאים או בחירה ידנית</small>';
    const install=grid.querySelector('#installApp');
    if(install) grid.insertBefore(btn,install); else grid.appendChild(btn);
    btn.onclick=openChooser;
  }

  const observer=new MutationObserver(()=>{ injectHomeButton(); decoratePlay(); });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(()=>{
    if((location.hash==='' || location.hash==='#home') && active) restore();
    injectHomeButton(); decoratePlay();
  },0));
  injectHomeButton();
})();
