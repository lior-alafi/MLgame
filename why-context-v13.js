(()=>{
'use strict';
const B=window.ML_BANK;if(!B)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function currentItem(){
  const cue=(document.querySelector('.q-cue')?.textContent||'').trim();
  if(cue){
    const exact=B.items.find(x=>cue===`${x.topic} · ${x.title}`);
    if(exact)return exact;
    const byTitle=B.items.find(x=>cue.endsWith(x.title));
    if(byTitle)return byTitle;
  }
  const title=(document.querySelector('.q-title')?.textContent||'').trim();
  return B.items.find(x=>title.includes(x.title))||null;
}

function texBlock(tex,label=''){
  return `<div class="v13-context-step">${label?`<div class="v13-context-label">${esc(label)}</div>`:''}<div class="v13-tex" data-v13-tex="${esc(tex)}" dir="ltr"></div></div>`;
}
function textBlock(text,label=''){
  return `<div class="v13-context-step">${label?`<div class="v13-context-label">${esc(label)}</div>`:''}<div class="prose-he">${esc(text)}</div></div>`;
}
function itemMath(it){
  if(it.formula)return texBlock(it.formula,it.title);
  if(it.conclusion && String(it.conclusion).includes('\\'))return texBlock(it.conclusion,it.title);
  if(it.definitionParts?.length){
    const f=it.definitionParts.find(x=>String(x).includes('\\')||/[=≤≥∈]/.test(String(x)));
    if(f)return texBlock(String(f),it.title);
  }
  return '';
}

function genericContext(it){
  const related=(it.family?B.items.filter(x=>x.id!==it.id&&x.family===it.family):B.items.filter(x=>x.id!==it.id&&x.topic===it.topic))
    .filter(x=>x.formula || (x.conclusion&&String(x.conclusion).includes('\\')))
    .slice(0,6);
  let html=`<div class="prose-he">הפריט הזה אינו עומד לבדו. הנה הנוסחאות הקרובות אליו באותו ${it.family?'אשכול מתמטי':'נושא'}, כדי לזכור מה בא לפניו ומה אחריו.</div>`;
  if(it.formula)html+=itemMath(it);
  for(const r of related)html+=itemMath(r);
  return html;
}

function fullContextHTML(it){
  const c=it.fullContext;
  if(!c)return genericContext(it);
  let html=c.intro?`<div class="prose-he v13-context-intro">${esc(c.intro)}</div>`:'';
  for(const s of c.steps||[]){
    if(s.tex)html+=texBlock(s.tex,s.label);
    else if(s.text)html+=textBlock(s.text,s.label);
  }
  return html;
}

function renderTex(root=document){
  root.querySelectorAll?.('[data-v13-tex]').forEach(el=>{
    if(el.dataset.v13Rendered==='1') return;
    const tex=el.dataset.v13Tex||'';
    if(window.katex){
      try{
        katex.render(tex,el,{throwOnError:false,displayMode:true,strict:false});
        el.dataset.v13Rendered='1';
        return;
      }catch{}
    }
    // Before KaTeX finishes loading, show the source once without repeatedly
    // mutating the DOM. katexready will render it later.
    if(el.textContent!==tex) el.textContent=tex;
  });
}

function augmentWhy(){
  const why=document.querySelector('#why.why');
  if(!why||why.querySelector('.full-context-v13'))return;
  const it=currentItem();if(!it)return;
  const sec=document.createElement('div');
  sec.className='why-section full-context-v13';
  sec.innerHTML=`<div class="why-label">הקשר מלא / Full context</div>${fullContextHTML(it)}`;
  why.insertBefore(sec,why.firstChild);
  renderTex(sec);
}

function decorateVersion(){
  document.querySelectorAll('.q-sub').forEach(el=>{
    const next=el.textContent.replace(/· v9\b/g,'· v14').replace(/· v11\b/g,'· v14').replace(/· v12\b/g,'· v14').replace(/· v13\b/g,'· v14');
    if(next!==el.textContent) el.textContent=next;
  });
}

let scheduled=false;
const schedule=()=>{
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{
    scheduled=false;
    augmentWhy();
    decorateVersion();
    renderTex(document);
  });
};
const obs=new MutationObserver(schedule);
obs.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('katexready',()=>{
  document.querySelectorAll('[data-v13-tex]').forEach(el=>delete el.dataset.v13Rendered);
  renderTex(document);
});
schedule();
})();
