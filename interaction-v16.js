(()=>{
'use strict';
// Robust first-tap activation for single-answer buttons.
// Mouse answers on pointerdown; touch/pen answers on pointerup after a small movement check.
// This avoids browser click/focus quirks and also avoids a delayed native click firing twice.
const starts=new Map();
const findBtn=e=>e.target?.closest?.('button[data-opt]')||null;
function activate(btn,e){
  if(!btn || btn.disabled || btn.dataset.v16Handled==='1') return false;
  const fn=btn.onclick;
  if(typeof fn!=='function') return false;
  btn.dataset.v16Handled='1';
  try{ fn.call(btn,e); } finally {
    // If the app did not mark the question answered for some reason, allow another attempt.
    queueMicrotask(()=>{ if(!btn.disabled) delete btn.dataset.v16Handled; });
  }
  return true;
}

document.addEventListener('pointerdown',e=>{
  const btn=findBtn(e); if(!btn||btn.disabled)return;
  starts.set(e.pointerId,{btn,x:e.clientX,y:e.clientY,type:e.pointerType});
  if(e.pointerType==='mouse'){
    if(activate(btn,e)) e.preventDefault();
  }
},{capture:true,passive:false});

document.addEventListener('pointerup',e=>{
  const s=starts.get(e.pointerId); starts.delete(e.pointerId);
  if(!s || s.type==='mouse' || s.btn.disabled)return;
  const btn=findBtn(e); if(btn!==s.btn)return;
  if(Math.hypot(e.clientX-s.x,e.clientY-s.y)>16)return;
  if(activate(btn,e)) e.preventDefault();
},{capture:true,passive:false});

document.addEventListener('pointercancel',e=>starts.delete(e.pointerId),{capture:true,passive:true});

// Keyboard / browsers without useful Pointer Events: capture the very first click.
document.addEventListener('click',e=>{
  const btn=findBtn(e); if(!btn||btn.disabled)return;
  if(activate(btn,e)){
    e.preventDefault();
    e.stopPropagation();
  }
},{capture:true});
})();
