(() => {
  'use strict';
  const BANK = window.ML_BANK;
  const KEY = 'ml-recall-2026-v1';
  const $app = document.getElementById('app');
  const now = () => Date.now();
  const shuffle = arr => [...arr].sort(() => Math.random() - .5);
  const clamp = (x,a,b)=>Math.max(a,Math.min(b,x));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const defaultState = {theme:'dark', progress:{}, total:0, correct:0, settings:{topics:[]}, lastMode:null};
  let state = load();
  let session = null;
  let currentQ = null;
  let timerHandle = null;
  let deferredInstallPrompt = null;

  function load(){
    try { return {...defaultState, ...JSON.parse(localStorage.getItem(KEY)||'{}')}; }
    catch { return structuredClone(defaultState); }
  }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function prog(id){
    if(!state.progress[id]) state.progress[id]={seen:0,correct:0,wrong:0,streak:0,interval:0,due:0,lastReviewed:0,favorite:false,didntKnow:0,almost:0,knew:0};
    return state.progress[id];
  }
  function accuracy(p){ const n=(p.correct||0)+(p.wrong||0); return n?Math.round(100*p.correct/n):0; }
  function topicStats(topic){
    const its=BANK.items.filter(x=>x.topic===topic); let c=0,w=0,seen=0;
    its.forEach(it=>{const p=prog(it.id); c+=p.correct; w+=p.wrong; if(p.seen)seen++;});
    return {accuracy:(c+w)?Math.round(100*c/(c+w)):0, seen, total:its.length};
  }
  function itemMastery(it){
    const p=prog(it.id); if(!p.seen) return 'notseen';
    const a=accuracy(p); if(p.streak>=3 && a>=80) return 'mastered';
    if(a<55 || p.didntKnow>p.knew) return 'weak';
    return 'learning';
  }
  function setTheme(t){ state.theme=t; save(); document.documentElement.dataset.theme=t; }
  setTheme(state.theme||'dark');

  function math(tex, display=true){
    const id='m'+Math.random().toString(36).slice(2);
    queueMicrotask(()=>renderMathId(id,tex,display));
    return `<div class="math" id="${id}" dir="ltr"></div>`;
  }
  function inlineMath(tex){
    const id='m'+Math.random().toString(36).slice(2);
    queueMicrotask(()=>renderMathId(id,tex,false));
    return `<span id="${id}" dir="ltr" style="unicode-bidi:isolate"></span>`;
  }
  function renderMathId(id,tex,display){
    const el=document.getElementById(id); if(!el) return;
    if(window.katex){ try{katex.render(tex,el,{throwOnError:false,displayMode:display,strict:false});return;}catch{} }
    el.textContent=tex; el.classList.add('tiny');
  }
  function shell(content, title='ML Recall', back=false){
    $app.innerHTML=`<main class="app-shell"><header class="topbar">
      ${back?'<button class="icon-btn" data-nav="home" aria-label="חזרה">←</button>':''}
      <div class="title">${esc(title)}</div>
      <button class="icon-btn" id="themeBtn" aria-label="מצב תצוגה">${state.theme==='dark'?'☀️':'🌙'}</button>
    </header>${content}</main>`;
    bindNav();
    const tb=document.getElementById('themeBtn'); if(tb) tb.onclick=()=>{setTheme(state.theme==='dark'?'light':'dark'); location.hash=location.hash||'#home'; route();};
  }
  function bindNav(){ document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.nav;}); }

  function home(){
    clearTimer();
    const acc=state.total?Math.round(100*state.correct/state.total):0;
    const due=BANK.items.filter(it=>(prog(it.id).due||0)<=now() && prog(it.id).seen).length;
    shell(`<section class="hero"><h1>Machine Learning Recall</h1><p>Active recall בלי הקלדה · דף נוסחאות מודע · spaced repetition</p></section>
      <div class="panel" style="margin-bottom:12px"><div class="stat-grid">
        <div><div class="stat-number">${acc}%</div><div class="tiny">דיוק כולל</div></div>
        <div><div class="stat-number">${due}</div><div class="tiny">פריטים לחזרה עכשיו</div></div>
      </div></div>
      <section class="grid">
        <button class="home-btn primary" id="continue"><span class="emoji">▶️</span><strong>Continue</strong><small>Spaced repetition לפי מה שמגיע לחזרה</small></button>
        <button class="home-btn" id="quick"><span class="emoji">🛏️</span><strong>Quick / Bed Mode</strong><small>קצר, כפתורים גדולים, בלי שאלות ארוכות</small></button>
        <button class="home-btn" id="exam"><span class="emoji">🎯</span><strong>Exam Mode</strong><small>עדיפות ל-NOT GIVEN ומסיחים דומים</small></button>
        <button class="home-btn" id="weak"><span class="emoji">📉</span><strong>Weak Topics</strong><small>נושאים ופריטים עם דיוק נמוך</small></button>
        <button class="home-btn" id="notgiven"><span class="emoji">🔴</span><strong>Not on Formula Sheet</strong><small>רק מה שלא מודפס בנספח הרשמי</small></button>
        <button class="home-btn" data-nav="topics"><span class="emoji">🧭</span><strong>Topics</strong><small>בחר פרקים לתרגול</small></button>
        <button class="home-btn" id="fav"><span class="emoji">⭐</span><strong>Favorites</strong><small>רק פריטים שסימנת</small></button>
        <button class="home-btn" data-nav="stats"><span class="emoji">📊</span><strong>Statistics</strong><small>דיוק לפי נושא ופריט</small></button>
        <button class="home-btn" data-nav="coverage"><span class="emoji">🧩</span><strong>Coverage</strong><small>Mastered / Learning / Weak / Not seen</small></button>
        <button class="home-btn install-card" id="installApp"><span class="emoji">📲</span><strong>התקנה למסך הבית</strong><small id="installHint">פותח כמו אפליקציה בטלפון כשמותקן מ-HTTPS</small></button>
      </section>`, 'ML Recall');
    document.getElementById('continue').onclick=()=>startSession({mode:'continue',count:25});
    document.getElementById('exam').onclick=()=>startSession({mode:'exam',count:30});
    document.getElementById('weak').onclick=()=>startSession({mode:'weak',count:30});
    document.getElementById('notgiven').onclick=()=>startSession({mode:'notgiven',count:30});
    document.getElementById('fav').onclick=()=>startSession({mode:'favorites',count:30});
    document.getElementById('quick').onclick=quickModal();
    const installBtn=document.getElementById('installApp');
    if(installBtn){
      const hint=document.getElementById('installHint');
      if(isStandalone() && hint) hint.textContent='כבר פועל במצב אפליקציה';
      installBtn.onclick=openInstallFlow;
    }
  }

  function isStandalone(){
    return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  async function openInstallFlow(){
    if(isStandalone()){
      installInfoModal('האפליקציה כבר מותקנת', 'המשחק כבר פתוח במצב standalone. ההתקדמות נשמרת מקומית במכשיר הזה.');
      return;
    }
    if(deferredInstallPrompt){
      const prompt=deferredInstallPrompt; deferredInstallPrompt=null;
      try{
        prompt.prompt();
        const choice=await prompt.userChoice;
        if(choice?.outcome==='accepted') installInfoModal('ההתקנה התחילה', 'אפשר לפתוח את ML Recall מהאייקון במסך הבית.');
      }catch{ installInstructionsModal(); }
      return;
    }
    installInstructionsModal();
  }

  function installInfoModal(title, body){
    const modal=document.createElement('div'); modal.className='modal';
    modal.innerHTML=`<div class="sheet install-sheet"><h2>${esc(title)}</h2><p>${esc(body)}</p><button class="primary-btn" id="closeInstall" style="width:100%">סגור</button></div>`;
    document.body.appendChild(modal);
    modal.onclick=e=>{if(e.target===modal) modal.remove();};
    modal.querySelector('#closeInstall').onclick=()=>modal.remove();
  }

  function installInstructionsModal(){
    const secure=window.isSecureContext;
    const ios=/iPhone|iPad|iPod/i.test(navigator.userAgent||'');
    const platformTip=ios
      ? 'ב-Safari: לחץ על Share (ריבוע עם חץ למעלה) → Add to Home Screen → Add.'
      : 'ב-Chrome: לחץ על ⋮ → Add to Home screen. כאשר האתר מוגש ב-HTTPS תופיע בדרך כלל האפשרות Install app.';
    const securityNote=secure
      ? 'החיבור הנוכחי נחשב secure, ולכן הדפדפן יכול לאפשר התקנת PWA מלאה.'
      : 'אתה כרגע ב-HTTP דרך כתובת ה-LAN. אפשר להשתמש במשחק בטלפון וליצור קיצור דרך, אבל התקנת PWA מלאה + offline דורשת HTTPS.';
    const modal=document.createElement('div'); modal.className='modal';
    modal.innerHTML=`<div class="sheet install-sheet"><h2>📲 התקנה למסך הבית</h2>
      <div class="install-step"><b>1.</b><span>${esc(platformTip)}</span></div>
      <div class="install-step"><b>2.</b><span>${esc(securityNote)}</span></div>
      <div class="install-note">הגרסה הזו כוללת manifest, אייקונים ו-Service Worker עם cache ממוספר לפי build. כשמארחים אותה ב-HTTPS היא נפתחת כ-app standalone ותומכת ב-offline לאחר טעינה ראשונה.</div>
      <button class="primary-btn" id="closeInstall" style="width:100%;margin-top:12px">הבנתי</button></div>`;
    document.body.appendChild(modal);
    modal.onclick=e=>{if(e.target===modal) modal.remove();};
    modal.querySelector('#closeInstall').onclick=()=>modal.remove();
  }

  function quickModal(){
    const modal=document.createElement('div'); modal.className='modal'; modal.innerHTML=`<div class="sheet"><h2>Quick / Bed Mode</h2><p class="tiny">שאלות קצרות בלבד. אפשר לסגור בהחלקה/לחיצה על הרקע.</p>
      <div class="session-choices">
        <button data-min="5">⏱️ 5 דקות</button><button data-min="10">⏱️ 10 דקות</button>
        <button data-count="20">20 שאלות</button><button data-count="50">50 שאלות</button>
      </div><button class="secondary-btn" id="closeModal" style="width:100%;margin-top:10px">סגור</button></div>`;
    document.body.appendChild(modal);
    modal.onclick=e=>{if(e.target===modal) modal.remove();};
    modal.querySelector('#closeModal').onclick=()=>modal.remove();
    modal.querySelectorAll('[data-min]').forEach(b=>b.onclick=()=>{modal.remove(); startSession({mode:'quick',minutes:+b.dataset.min,count:999});});
    modal.querySelectorAll('[data-count]').forEach(b=>b.onclick=()=>{modal.remove(); startSession({mode:'quick',count:+b.dataset.count});});
  }

  function eligible(opts){
    let its=[...BANK.items];
    if(opts.mode==='notgiven') its=its.filter(x=>x.sheet==='NOT_GIVEN');
    if(opts.mode==='favorites') its=its.filter(x=>prog(x.id).favorite);
    if(opts.mode==='weak'){
      const weakTopics=new Set(BANK.topics.filter(t=>topicStats(t).accuracy<75));
      its=its.filter(x=>weakTopics.has(x.topic)||itemMastery(x)==='weak');
    }
    if(opts.topics?.length) its=its.filter(x=>opts.topics.includes(x.topic));
    return its;
  }
  function weightedPick(its, mode){
    if(!its.length) return null;
    const bag=[];
    for(const it of its){
      const p=prog(it.id); let w=it.priority||1;
      if((p.due||0)<=now()) w*=2.2;
      if(!p.seen) w*=1.6;
      if(itemMastery(it)==='weak') w*=2.4;
      if(mode==='exam') w*=it.sheet==='NOT_GIVEN'?3:it.sheet==='PARTIAL'?1.8:.55;
      if(mode==='quick' && it.kind==='algorithm' && it.steps?.length>5) w*=.45;
      for(let i=0;i<Math.max(1,Math.round(w*2));i++) bag.push(it);
    }
    return bag[Math.floor(Math.random()*bag.length)];
  }
  function startSession(opts){
    const its=eligible(opts);
    if(!its.length){ alert('אין כרגע פריטים שמתאימים למסנן הזה.'); return; }
    session={...opts, answered:0, correct:0, used:[], started:now(), endAt:opts.minutes?now()+opts.minutes*60000:null};
    state.lastMode=opts; save();
    location.hash='#play';
    nextQuestion();
    if(session.endAt) startTimer();
  }
  function nextQuestion(){
    if(!session){ location.hash='#home'; return; }
    if(session.answered>=session.count || (session.endAt && now()>=session.endAt)){ finishSession(); return; }
    let pool=eligible(session);
    if(pool.length>5){ const recent=new Set(session.used.slice(-5)); const filtered=pool.filter(x=>!recent.has(x.id)); if(filtered.length) pool=filtered; }
    const item=weightedPick(pool,session.mode); if(!item){finishSession();return;}
    session.used.push(item.id); currentQ=makeQuestion(item,session.mode); renderQuestion();
  }

  function isAtomicPracticePart(tex){
    const s=String(tex||'').replace(/\\[a-zA-Z]+/g,'X').replace(/[{}_^()\[\]\\,.;:\s]/g,'').trim();
    return s.length<=1 || ['/','+','-','='].includes(String(tex||'').trim());
  }
  function practiceParts(item){
    const raw=(item.parts||[]).filter(Boolean).map(String);
    if(raw.length<2) return raw;
    const out=[];
    for(let i=0;i<raw.length;i++){
      const cur=raw[i];
      if(isAtomicPracticePart(cur) && i+1<raw.length){
        raw[i+1]=`${cur} ${raw[i+1]}`;
      }else if(isAtomicPracticePart(cur) && out.length){
        out[out.length-1]=`${out[out.length-1]} ${cur}`;
      }else out.push(cur);
    }
    return out.filter(Boolean);
  }
  function formulaStem(item,parts){
    if(!item.formula || !parts?.length) return '';
    if(String(parts[0]).includes('=')) return '';
    const idx=item.formula.indexOf('=');
    if(idx<0) return '';
    const lhs=item.formula.slice(0,idx+1).trim();
    return lhs.length<=70?lhs:'';
  }
  function sameFamily(item){
    const fam=BANK.items.filter(x=>x.id!==item.id && item.family && x.family===item.family);
    const topic=BANK.items.filter(x=>x.id!==item.id && x.topic===item.topic && !fam.some(y=>y.id===x.id));
    return shuffle([...fam,...topic]);
  }
  function formulaPeers(item,limit=3){
    return sameFamily(item).filter(x=>x.kind==='formula' && x.formula).slice(0,limit);
  }
  function makeQuestion(item,mode){
    const types=[];
    if(item.kind==='formula'){
      const pp=practiceParts(item);
      if(pp.length>1) types.push('arrange','missingPiece','nextPiece');
      types.push('whichFormula');
      if(item.wrongFormula) types.push('findError');
    }
    if(item.kind==='definition') types.push('definitionBuilder');
    if(item.kind==='algorithm'){ types.push('ordering'); if((item.steps||[]).length>1) types.push('whatNext'); }
    if(item.kind==='theorem') types.push('conditions');
    if(item.kind==='concept') types.push('choice');
    if(mode==='quick'){
      const short=types.filter(x=>['missingPiece','nextPiece','whichFormula','findError','choice','whatNext'].includes(x));
      if(short.length) return buildQ(item,short[Math.floor(Math.random()*short.length)],mode);
    }
    return buildQ(item,types[Math.floor(Math.random()*types.length)]||'choice',mode);
  }
  function buildQ(item,type,mode){
    const q={item,type,answered:false,user:[],selected:new Set(),correct:false};
    const pp=practiceParts(item);
    if(type==='whichFormula'){
      const others=formulaPeers(item,3);
      q.prompt=`איזו נוסחה מייצגת בדיוק את ${item.title}?`;
      q.cue=`${item.topic} · ${item.title}`;
      q.context=item.questionContext || 'בחר נוסחה אחת בלבד. ההקשר והגודל המבוקש מופיעים בכותרת; אין צורך לנחש מה הנושא.';
      q.options=shuffle([{v:item.formula,ok:true},...others.map(x=>({v:x.formula,ok:false}))]);
    } else if(type==='arrange'){
      q.prompt=`הרכב את הנוסחה המלאה של ${item.title}`;
      q.cue=`${item.topic} · ${item.title}`;
      q.context=item.questionContext || 'לחץ על הבלוקים לפי הסדר שבו הם מופיעים בנוסחה. המטרה היא להגיע לנוסחה המלאה של הפריט ששמו מופיע בכותרת.';
      q.pool=shuffle(pp.map((v,i)=>({v,i}))); q.target=pp.map((v,i)=>i);
    } else if(type==='missingPiece'){
      const candidates=pp.map((_,i)=>i).filter(i=>!isAtomicPracticePart(pp[i]));
      const idx=candidates.length?candidates[Math.floor(Math.random()*candidates.length)]:0;
      q.answer=pp[idx];
      q.blankIndex=idx;
      q.blankParts=pp.map((v,i)=>i===idx?String.raw`\boxed{\;?\;}`:v);
      q.stem=formulaStem(item,pp);
      const distract=sameFamily(item).flatMap(x=>practiceParts(x)).filter(x=>x!==q.answer && !isAtomicPracticePart(x));
      q.options=shuffle([{v:q.answer,ok:true},...shuffle([...new Set(distract)]).slice(0,3).map(v=>({v,ok:false}))]);
      q.prompt=`השלם את החלק החסר בנוסחה של ${item.title}`;
      q.cue=`${item.topic} · ${item.title}`;
      q.context=item.questionContext || 'הנוסחה מוצגת עם חור אחד בלבד. בחר את הביטוי המדויק שנכנס במקום סימן השאלה.';
    } else if(type==='nextPiece'){
      // A next-piece question is only valid when the learner can see a real prefix.
      // Never ask for the first chunk in isolation: at least one previous chunk is shown.
      const idx=1+Math.floor(Math.random()*(pp.length-1));
      q.prefixParts=pp.slice(0,idx);
      q.answer=pp[idx];
      q.stem=formulaStem(item,pp);
      const distract=sameFamily(item).flatMap(x=>practiceParts(x))
        .filter(x=>x!==q.answer && !q.prefixParts.includes(x) && !isAtomicPracticePart(x));
      q.options=shuffle([{v:q.answer,ok:true},...shuffle([...new Set(distract)]).slice(0,3).map(v=>({v,ok:false}))]);
      q.prompt=`בונים את הנוסחה של ${item.title}. איזה בלוק מגיע מיד אחרי הרצף שכבר מוצג?`;
      q.cue=`${item.topic} · ${item.title}`;
      q.context=item.questionContext || 'כל מה שכבר נבנה מופיע בשורת הנוסחה שמתחת. בחר רק את הבלוק הבא; אם לא מוצג רצף קודם, זו תקלה ולא שאלה תקינה.';
    } else if(type==='findError'){
      q.prompt='בנוסחה הבאה יש טעות. מה בדיוק שגוי?'; q.cue=item.title;
      q.context='בחר את התיקון המתמטי המדויק, לא תיאור כללי של הנושא.';
      q.shown=item.wrongFormula; q.options=shuffle(item.errorOptions.map((v,i)=>({v,ok:i===0})));
    } else if(type==='definitionBuilder'){
      q.prompt=`בנה את ההגדרה המלאה של ${item.title}`; q.cue=`${item.topic} · ${item.title}`;
      q.context='סדר את חלקי ההגדרה כך שתתקבל טענה פורמלית שלמה.';
      q.pool=shuffle(item.definitionParts.map((v,i)=>({v,i}))); q.target=item.definitionParts.map((v,i)=>i);
    } else if(type==='ordering'){
      q.prompt=item.isProof?`סדר את שלבי ההוכחה של ${item.title} בסדר הלוגי`:`סדר את שלבי ${item.title} בסדר הביצוע`; q.cue=`${item.topic} · ${item.title}`;
      q.context=item.isProof?'סדר את מהלך ההוכחה מהגדרת אירוע הכשל ועד לחסם הסופי.':'הסדר צריך לתאר ריצה אמיתית של האלגוריתם, מהשלב הראשון לאחרון.';
      q.pool=shuffle(item.steps.map((v,i)=>({v,i}))); q.target=item.steps.map((v,i)=>i);
    } else if(type==='whatNext'){
      const idx=Math.floor(Math.random()*Math.max(1,item.steps.length-1)); q.prefixSteps=item.steps.slice(0,idx+1); q.answer=item.steps[idx+1]||item.steps[item.steps.length-1];
      const distract=shuffle(item.steps.filter(x=>x!==q.answer)).slice(0,3); q.options=shuffle([{v:q.answer,ok:true},...distract.map(v=>({v,ok:false}))]);
      q.prompt=item.isProof?`מהו הצעד הבא בהוכחה של ${item.title}?`:`מהו הצעד הבא ב-${item.title}?`; q.cue=`${item.topic} · ${item.title}`; q.context=item.isProof?'שלבי ההוכחה שכבר בוצעו מוצגים למטה. בחר את הצעד שמגיע מיד אחריהם.':'השלבים שכבר בוצעו מוצגים למטה. בחר רק את הצעד שמגיע מיד אחריהם.';
    } else if(type==='conditions'){
      q.prompt=`אילו תנאים נדרשים עבור ${item.title}?`; q.cue=`${item.topic} · ${item.title}`;
      q.statement=item.conclusion;
      q.context='אפשר לבחור יותר מתשובה אחת. בחר את כל התנאים הנדרשים ורק אותם.';
      const ds=item.conditionDistractors||['הטענה נכונה ללא תנאים','אין צורך בהנחות נוספות'];
      q.options=shuffle([...item.conditions.map(v=>({v,ok:true})),...ds.map(v=>({v,ok:false}))]); q.multi=true;
    } else {
      q.prompt=item.prompt||item.title;
      q.cue=item.prompt?item.title:'';
      q.context='בחר את התשובה המדויקת ביותר לפי חומר הקורס.';
      q.options=shuffle([{v:item.correct||item.conclusion,ok:true},...(item.distractors||[]).map(v=>({v,ok:false}))]);
    }
    if(mode==='exam') q.hideTopic=true;
    validateSequenceQuestion(q);
    return q;
  }

  function validateSequenceQuestion(q){
    if(q.type==='nextPiece'){
      if(!Array.isArray(q.prefixParts) || q.prefixParts.length<1 || !q.answer){
        throw new Error(`Invalid nextPiece question for ${q.item?.id||'unknown'}: previous formula sequence is not visible.`);
      }
    }
    if(q.type==='whatNext'){
      if(!Array.isArray(q.prefixSteps) || q.prefixSteps.length<1 || !q.answer){
        throw new Error(`Invalid whatNext question for ${q.item?.id||'unknown'}: previous steps are not visible.`);
      }
    }
  }

  function sheetBadge(s){ return s==='GIVEN'?'<span class="badge sheet-given">🟢 GIVEN</span>':s==='PARTIAL'?'<span class="badge sheet-part">🟡 PARTIAL</span>':'<span class="badge sheet-not">🔴 NOT GIVEN</span>'; }
  function memoryBadge(m){ return `<span class="badge">${m==='MUST_RECALL'?'🔴 MUST RECALL':m==='MUST_RECONSTRUCT'?'🟡 MUST RECONSTRUCT':'🟢 UNDERSTAND'}</span>`; }
  function renderQuestion(){
    const q=currentQ, it=q.item; if(!q) return;
    const pct=Math.round(100*session.answered/session.count);
    const acc=session.answered?Math.round(100*session.correct/session.answered):0;
    const shownIndex=currentQ?.retryOfMistake?Math.max(1,session.answered):session.answered+1;
    const remaining=session.endAt?`<span class="timer" id="timer"></span>`:`${shownIndex}/${session.count}`;
    let body='';
    if(q.type==='whichFormula' || q.type==='missingPiece' || q.type==='nextPiece'){
      if(q.type==='missingPiece'){
        const shown=[q.stem,...q.blankParts].filter(Boolean).join(String.raw`\;`);
        body+=`<div class="built-label">השלם את החור בנוסחה:</div><div class="built-formula">${math(shown)}</div>`;
      }
      if(q.type==='nextPiece'){
        const shown=[q.stem,...q.prefixParts].filter(Boolean).join(String.raw`\;`)+String.raw`\;\boxed{\;?\;}`;
        body+=`<div class="built-label">הרצף שנבנה עד עכשיו — זהו בדיוק ה-prefix של השאלה:</div><div class="built-formula sequence-prefix">${math(shown)}</div><div class="tiny sequence-hint">בחר את הבלוק שמגיע מיד אחרי הרצף המוצג.</div>`;
      }
      body+=`<div class="options math-options">${q.options.map((o,i)=>`<button class="option math-option" data-opt="${i}"><span id="opt${i}">${esc(o.v)}</span></button>`).join('')}</div>`;
    } else if(q.type==='findError'){
      body+=math(q.shown)+`<div class="options">${q.options.map((o,i)=>`<button class="option" data-opt="${i}">${esc(o.v)}</button>`).join('')}</div>`;
    } else if(['arrange','definitionBuilder','ordering'].includes(q.type)){
      body+=`<div class="answer-zone" id="answerZone"><span class="tiny">לחץ על החלקים לפי הסדר</span></div><div class="pieces" id="pieces">${q.pool.map((p,i)=>`<button class="piece" data-piece="${i}">${q.type==='arrange'?`<span id="piece${i}"></span>`:esc(p.v)}</button>`).join('')}</div>
        <div class="action-row"><button class="secondary-btn" id="undo">↩︎ ביטול</button><button class="primary-btn" id="check">בדיקה</button></div>`;
    } else if(q.type==='whatNext'){
      body+=`<div class="panel" style="box-shadow:none;margin:10px 0"><ol>${q.prefixSteps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div><div class="options">${q.options.map((o,i)=>`<button class="option" data-opt="${i}">${esc(o.v)}</button>`).join('')}</div>`;
    } else if(q.type==='conditions'){
      const st=q.statement?(String(q.statement).includes('\\')?math(q.statement):`<div class="statement-box">${esc(q.statement)}</div>`):'';
      body+=`${st}<div class="options">${q.options.map((o,i)=>`<button class="option" data-multi="${i}">${o.v.includes('\\')?inlineMath(o.v):esc(o.v)}</button>`).join('')}</div><div class="action-row"><button class="primary-btn" id="checkMulti">בדיקה</button></div>`;
    } else {
      body+=`<div class="options">${q.options.map((o,i)=>`<button class="option" data-opt="${i}">${esc(o.v)}</button>`).join('')}</div>`;
    }
    shell(`<div class="progress-wrap"><div class="progress-bar" style="width:${pct}%"></div></div>
      <div class="session-meta"><span>${remaining}</span><span>דיוק <b>${acc}%</b></span><span>🔥 <b>${prog(it.id).streak}</b></span></div>
      <section class="question-card">
        <div class="q-head"><div class="q-copy"><div class="q-title" dir="rtl">${esc(q.prompt)}</div>${q.cue?`<div class="q-cue" dir="ltr">${esc(q.cue)}</div>`:''}<div class="q-sub" dir="ltr">${q.hideTopic?'Exam Mode — topic hidden':esc(it.topic)} · v9</div>${q.context?`<div class="q-context" dir="rtl">${esc(q.context)}</div>`:''}</div><button class="star" id="star" aria-label="מועדפים">${prog(it.id).favorite?'⭐':'☆'}</button></div>
        <div class="badges" style="margin-top:9px">${sheetBadge(it.sheet)}${memoryBadge(it.memory)}</div>
        ${body}<div id="feedback"></div>
      </section>`, session.mode==='exam'?'EXAM MODE':session.mode==='quick'?'BED MODE':'Practice', true);
    document.querySelector('[data-nav="home"]').onclick=()=>{session=null;location.hash='#home';};
    document.getElementById('star').onclick=()=>{const p=prog(it.id);p.favorite=!p.favorite;save();document.getElementById('star').textContent=p.favorite?'⭐':'☆';};
    if(q.type==='whichFormula'||q.type==='missingPiece'||q.type==='nextPiece'){
      q.options.forEach((o,i)=>queueMicrotask(()=>renderMathId('opt'+i,o.v,false)));
      bindSingleOptions();
    } else if(['findError','whatNext','choice'].includes(q.type)) bindSingleOptions();
    else if(['arrange','definitionBuilder','ordering'].includes(q.type)) bindBuilder();
    else if(q.type==='conditions') bindMulti();
    if(q.type==='arrange') q.pool.forEach((p,i)=>queueMicrotask(()=>renderMathId('piece'+i,p.v,false)));
    updateTimerText();
  }

  function bindSingleOptions(){
    document.querySelectorAll('[data-opt]').forEach(btn=>btn.onclick=()=>{
      if(currentQ.answered) return; const i=+btn.dataset.opt; currentQ.answered=true; currentQ.correct=!!currentQ.options[i].ok;
      document.querySelectorAll('[data-opt]').forEach((b,j)=>{if(currentQ.options[j].ok)b.classList.add('correct'); else if(j===i)b.classList.add('wrong'); b.disabled=true;});
      objectiveRecord(currentQ.correct); showFeedback();
    });
  }
  function bindBuilder(){
    const q=currentQ, zone=document.getElementById('answerZone');
    const refresh=()=>{
      zone.innerHTML=q.user.length?q.user.map((u,k)=>`<button class="piece" data-picked="${k}">${q.type==='arrange'?`<span id="picked${k}"></span>`:esc(u.v)}</button>`).join(''):'<span class="tiny">לחץ על החלקים לפי הסדר</span>';
      if(q.type==='arrange') q.user.forEach((u,k)=>queueMicrotask(()=>renderMathId('picked'+k,u.v,false)));
      document.querySelectorAll('[data-picked]').forEach(b=>b.onclick=()=>{if(q.answered)return; const idx=+b.dataset.picked; q.user.splice(idx,1); refresh();});
    };
    document.querySelectorAll('[data-piece]').forEach(btn=>btn.onclick=()=>{if(q.answered)return; const p=q.pool[+btn.dataset.piece]; q.user.push(p); refresh();});
    document.getElementById('undo').onclick=()=>{q.user.pop();refresh();};
    document.getElementById('check').onclick=()=>{
      if(q.answered||q.user.length!==q.target.length)return;
      q.answered=true; q.correct=q.user.every((p,i)=>p.i===q.target[i]); objectiveRecord(q.correct); showFeedback();
    };
  }
  function bindMulti(){
    const q=currentQ;
    document.querySelectorAll('[data-multi]').forEach(btn=>btn.onclick=()=>{if(q.answered)return; const i=+btn.dataset.multi; q.selected.has(i)?q.selected.delete(i):q.selected.add(i);btn.classList.toggle('selected');});
    document.getElementById('checkMulti').onclick=()=>{
      if(q.answered)return; q.answered=true;
      q.correct=q.options.every((o,i)=>o.ok===q.selected.has(i));
      document.querySelectorAll('[data-multi]').forEach((b,i)=>{if(q.options[i].ok)b.classList.add('correct'); else if(q.selected.has(i))b.classList.add('wrong'); b.disabled=true;});
      objectiveRecord(q.correct); showFeedback();
    };
  }
  function objectiveRecord(ok){
    // A same-question retry is for learning, not a second scored attempt.
    if(currentQ.retryOfMistake) return;
    const p=prog(currentQ.item.id); p.seen++; p.lastReviewed=now(); if(ok){p.correct++;p.streak++;}else{p.wrong++;p.streak=0;} state.total++;if(ok)state.correct++;session.answered++;if(ok)session.correct++;save();
  }
  function questionSpecificWhy(q,it){
    if(q.type==='missingPiece'){
      const ans=q.options?.find(o=>o.ok)?.v || q.answer;
      return `<div class="why-section"><div class="why-label">למה זה החלק החסר?</div><div class="prose-he">החור נמצא בתוך הנוסחה של <b>${esc(it.title)}</b>. הצבה של הביטוי הנכון מחזירה את הנוסחה המלאה:</div>${math(it.formula)}${ans?`<div class="prose-he">לכן הביטוי שנדרש בחור הוא ${inlineMath(ans)}.</div>`:''}</div>`;
    }
    if(q.type==='whichFormula') return `<div class="why-section"><div class="why-label">מה היה צריך לזהות?</div><div class="prose-he">השאלה ביקשה לזהות במפורש את <b>${esc(it.title)}</b>, ולכן משווים את המבנה של כל אפשרות לנוסחה המלאה של הפריט.</div></div>`;
    return '';
  }
  function deepExplainHTML(it,q){
    let out=questionSpecificWhy(q,it);
    if(it.why) out+=`<div class="why-section"><div class="why-label">למה זה עובד?</div><div class="prose-he">${esc(it.why)}</div></div>`;
    if(it.explanation) out+=`<div class="why-section"><div class="why-label">הרעיון</div><div class="prose-he">${esc(it.explanation)}</div></div>`;
    if(it.kind==='formula'){
      if(it.parts?.length){
        out+=`<div class="why-section"><div class="why-label">מסלול שחזור</div><div class="reconstruct-parts">${it.parts.map((v,i)=>`<div class="reconstruct-step"><span>${i+1}</span>${inlineMath(v)}</div>`).join('')}</div></div>`;
      }
      if(it.formula) out+=`<div class="why-section"><div class="why-label">הנוסחה המלאה</div>${math(it.formula)}</div>`;
    } else if(it.kind==='theorem'){
      out+=`<div class="why-section"><div class="why-label">מבנה המשפט</div><div class="prose-he"><b>תנאים:</b> ${it.conditions.map(x=>esc(x)).join(' · ')}<br><b>מסקנה:</b> ${esc(it.conclusion||'')}</div></div>`;
      if(it.proofSteps?.length) out+=`<div class="why-section"><div class="why-label">מבנה ההוכחה</div><ol class="why-list">${it.proofSteps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`;
    } else if(it.kind==='algorithm'){
      out+=`<div class="why-section"><div class="why-label">${it.isProof?'מבנה ההוכחה המלא':'הסדר המלא'}</div><ol class="why-list">${it.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`;
    } else if(it.kind==='definition'){
      out+=`<div class="why-section"><div class="why-label">ההגדרה בשלמותה</div><ol class="why-list">${it.definitionParts.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`;
    } else if(it.kind==='concept'){
      out+=`<div class="why-section"><div class="why-label">התשובה שצריך לשלוף</div><div class="prose-he"><b>${esc(it.correct||it.conclusion||'')}</b></div></div>`;
    }
    out+=`<div class="why-section"><div class="why-label">במבחן</div><div class="prose-he">${it.sheet==='GIVEN'?'הנוסחה עצמה נתונה בדף הרשמי; התמקד בזיהוי מתי ואיך להשתמש בה.':it.sheet==='PARTIAL'?'חלק מהמידע נתון בדף הרשמי, אבל צריך להשלים או לשחזר את החלק החסר.':'הפריט אינו מופיע בדף הנוסחאות הרשמי, ולכן כדאי להיות מסוגל לשחזר אותו ללא עזרה.'}</div></div>`;
    return out;
  }
  function correctAnswerHTML(q,it){
    if(q.type==='ordering' && it.steps?.length){
      return `<div class="correct-answer-block"><div class="feedback-label">${it.isProof?'הסדר הנכון של ההוכחה:':'הסדר הנכון:'}</div><ol class="why-list">${it.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`;
    }
    if(q.type==='definitionBuilder' && it.definitionParts?.length){
      return `<div class="correct-answer-block"><div class="feedback-label">ההגדרה בסדר הנכון:</div><ol class="why-list">${it.definitionParts.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`;
    }
    if(q.type==='arrange' && it.formula){
      return `<div class="correct-answer-block"><div class="feedback-label">הנוסחה הנכונה:</div>${math(it.formula)}</div>`;
    }
    if(['whichFormula','missingPiece','nextPiece'].includes(q.type)){
      const ans=q.options?.find(o=>o.ok)?.v || q.answer || it.formula;
      if(ans) return `<div class="correct-answer-block"><div class="feedback-label">התשובה הנכונה:</div>${String(ans).includes('\\')?math(ans):`<div class="prose-he"><b>${esc(ans)}</b></div>`}</div>`;
    }
    if(['findError','whatNext','choice'].includes(q.type)){
      const ans=q.options?.find(o=>o.ok)?.v;
      if(ans) return `<div class="correct-answer-block"><div class="feedback-label">התשובה הנכונה:</div><div class="prose-he"><b>${esc(ans)}</b></div></div>`;
    }
    if(q.type==='conditions'){
      const ans=q.options?.filter(o=>o.ok).map(o=>o.v)||[];
      if(ans.length) return `<div class="correct-answer-block"><div class="feedback-label">התנאים הנכונים:</div><ul class="why-list">${ans.map(x=>`<li>${String(x).includes('\\')?inlineMath(x):esc(x)}</li>`).join('')}</ul></div>`;
    }
    if(it.formula) return `<div class="correct-answer-block"><div class="feedback-label">הנוסחה הנכונה:</div>${math(it.formula)}</div>`;
    if(it.conclusion) return `<div class="correct-answer-block"><div class="feedback-label">התשובה הנכונה:</div><div class="prose-he"><b>${esc(it.conclusion)}</b></div></div>`;
    return '';
  }
  function retrySameQuestion(){
    const old=currentQ;
    const fresh=buildQ(old.item,old.type,session.mode);
    fresh.retryOfMistake=true;
    fresh.hideTopic=old.hideTopic;
    currentQ=fresh;
    renderQuestion();
  }

  function showFeedback(){
    const q=currentQ,it=q.item, fb=document.getElementById('feedback');
    const correctBlock=q.correct?'':correctAnswerHTML(q,it);
    fb.innerHTML=`<div class="feedback ${q.correct?'good':'bad'}" dir="rtl"><div class="big">${q.correct?'✓ נכון':'✗ לא נכון'}</div>
      ${correctBlock}
      <div class="feedback-short prose-he">${esc(shortExplain(it.explanation))}</div>
      <div class="feedback-actions">${!q.correct?'<button class="secondary-btn retry-btn" id="retryBtn">↻ נסה שוב את אותה שאלה</button>':''}<button class="secondary-btn why-btn" id="whyBtn">Why? / הסבר</button></div>
      <div class="why" id="why">${deepExplainHTML(it,q)}</div></div>
      <div class="rating"><button class="no" data-rate="0">😵 לא ידעתי</button><button class="almost" data-rate="1">🤔 כמעט</button><button class="yes" data-rate="2">✓ ידעתי</button></div>`;
    document.getElementById('whyBtn').onclick=()=>{
      const why=document.getElementById('why'); why.classList.toggle('open');
      document.getElementById('whyBtn').textContent=why.classList.contains('open')?'סגור הסבר':'Why? / הסבר';
    };
    const retry=document.getElementById('retryBtn'); if(retry) retry.onclick=retrySameQuestion;
    document.querySelectorAll('[data-rate]').forEach(b=>b.onclick=()=>rateItem(+b.dataset.rate));
  }
  function shortExplain(s){ if(!s)return''; const x=s.split(/[.!?]/)[0]; return x.length>125?x.slice(0,122)+'…':x; }
  function rateItem(r){
    const p=prog(currentQ.item.id); const day=86400000;
    if(r===0){p.didntKnow++;p.interval=.02;p.due=now()+30*60*1000;}
    if(r===1){p.almost++;p.interval=Math.max(.2,(p.interval||.2)*1.5);p.due=now()+p.interval*day;}
    if(r===2){p.knew++;p.interval=p.interval?Math.min(30,p.interval*2.2):1;p.due=now()+p.interval*day;}
    save(); nextQuestion();
  }

  function finishSession(){
    clearTimer(); const a=session?.answered?Math.round(100*session.correct/session.answered):0;
    const touched=[...new Set(session?.used||[])].map(id=>BANK.items.find(x=>x.id===id)).filter(Boolean);
    const weak=touched.filter(x=>itemMastery(x)==='weak').slice(0,8);
    shell(`<section class="hero"><h1>סיום סשן</h1><p>${session?.answered||0} שאלות · דיוק ${a}%</p></section>
      <div class="panel"><div class="stat-number">${a}%</div><div class="tiny">Session accuracy</div></div>
      <h2 class="section-title">דורש חזרה</h2><div class="list">${weak.length?weak.map(x=>`<div class="row"><div class="grow"><b>${esc(x.title)}</b><br><small>${esc(x.topic)} · ${x.sheet}</small></div><span>${accuracy(prog(x.id))}%</span></div>`).join(''):'<div class="panel">לא זוהו פריטים חלשים חדשים בסשן הזה.</div>'}</div>
      <div class="action-row"><button class="primary-btn" data-nav="home">חזרה לבית</button></div>`, 'Session complete', true);
    bindNav(); session=null;
  }

  function topics(){
    const selected=new Set(state.settings.topics||[]);
    shell(`<section class="hero"><h1>Topics</h1><p>נושאי הקורס כפי שהם מופיעים בהרצאות ובתרגולים.</p></section>
      <div class="chips">${BANK.topics.map((t,i)=>`<button class="chip ${selected.has(t)?'on':''}" data-topic="${i}">${esc(t)} <small>${BANK.items.filter(x=>x.topic===t).length}</small></button>`).join('')}</div>
      <div class="action-row" style="position:sticky;bottom:10px"><button class="secondary-btn" id="clearTopics">נקה</button><button class="primary-btn" id="startTopics">התחל</button></div>`, 'Topics', true);
    document.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{const t=BANK.topics[+b.dataset.topic];selected.has(t)?selected.delete(t):selected.add(t);b.classList.toggle('on');});
    document.getElementById('clearTopics').onclick=()=>{selected.clear();document.querySelectorAll('[data-topic]').forEach(b=>b.classList.remove('on'));};
    document.getElementById('startTopics').onclick=()=>{state.settings.topics=[...selected];save();startSession({mode:'topics',count:40,topics:[...selected]});};
  }

  function stats(){
    const overall=state.total?Math.round(100*state.correct/state.total):0;
    const sorted=BANK.topics.map(t=>({t,...topicStats(t)})).sort((a,b)=>a.accuracy-b.accuracy);
    shell(`<section class="hero"><h1>Statistics</h1><p>נשמר אוטומטית ב-localStorage.</p></section>
      <div class="stat-grid"><div class="stat-box"><div class="stat-number">${overall}%</div><div class="tiny">Overall accuracy</div></div><div class="stat-box"><div class="stat-number">${state.total}</div><div class="tiny">Answers</div></div></div>
      <h2 class="section-title">לפי נושא</h2><div class="list">${sorted.map(s=>`<div class="row"><div class="grow"><b>${esc(s.t)}</b><div class="barline"><i style="width:${s.accuracy}%"></i></div><small>${s.seen}/${s.total} פריטים נראו</small></div><b>${s.accuracy}%</b></div>`).join('')}</div>
      <h2 class="section-title">Formula sheet</h2><div class="panel"><div class="badges">${sheetBadge('NOT_GIVEN')}${sheetBadge('PARTIAL')}${sheetBadge('GIVEN')}</div><p class="tiny">Exam Mode נותן משקל גבוה במיוחד ל-NOT GIVEN.</p></div>`, 'Statistics', true);
  }

  function coverage(){
    shell(`<section class="hero"><h1>Coverage Audit</h1><p>${esc(BANK.audit.basis)}</p></section>
      <div class="coverage-table">${BANK.topics.map(t=>{const its=BANK.items.filter(x=>x.topic===t);const counts={mastered:0,learning:0,weak:0,notseen:0};its.forEach(x=>counts[itemMastery(x)]++);return `<div class="coverage-row"><b>${esc(t)}</b><div class="nums"><span><b>${counts.mastered}</b>Mastered</span><span><b>${counts.learning}</b>Learning</span><span><b>${counts.weak}</b>Weak</span><span><b>${counts.notseen}</b>Not seen</span></div><div class="tiny" style="margin-top:8px">Total ${its.length} · NOT GIVEN ${its.filter(x=>x.sheet==='NOT_GIVEN').length}</div></div>`;}).join('')}</div>
      <h2 class="section-title">מה כן נתון רשמית</h2><div class="panel"><div class="chips">${BANK.audit.formulaSheetGiven.map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div></div>`, 'Coverage', true);
  }

  function startTimer(){ clearTimer(); timerHandle=setInterval(()=>{updateTimerText(); if(session?.endAt&&now()>=session.endAt)finishSession();},1000); }
  function clearTimer(){ if(timerHandle){clearInterval(timerHandle);timerHandle=null;} }
  function updateTimerText(){
    const el=document.getElementById('timer'); if(!el||!session?.endAt)return; const ms=Math.max(0,session.endAt-now()); const m=Math.floor(ms/60000),s=Math.floor(ms%60000/1000);el.textContent=`${m}:${String(s).padStart(2,'0')}`;
  }

  function route(){
    const r=(location.hash||'#home').slice(1);
    if(r==='home') home(); else if(r==='topics') topics(); else if(r==='stats') stats(); else if(r==='coverage') coverage(); else if(r==='play'){ if(session&&currentQ) renderQuestion(); else home(); } else home();
  }
  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferredInstallPrompt=e;
    const hint=document.getElementById('installHint');
    if(hint) hint.textContent='מוכן להתקנה — לחץ כאן';
  });
  window.addEventListener('appinstalled',()=>{
    deferredInstallPrompt=null;
    const hint=document.getElementById('installHint');
    if(hint) hint.textContent='הותקן בהצלחה';
  });
  window.addEventListener('hashchange',route);
  window.addEventListener('katexready',()=>{ if(currentQ && location.hash==='#play') renderQuestion(); });
  window.addEventListener('keydown',e=>{ if(e.key==='Escape'&&location.hash!=='#home') location.hash='#home'; });
  route();
})();
