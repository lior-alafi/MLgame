(()=>{
'use strict';
// Make single-answer options react on the first pointer release. This is deliberately
// limited to data-opt buttons: their normal click handler is idempotent after the
// question is marked answered, so the later native click becomes a harmless no-op.
const starts=new Map();
const optionFrom=e=>e.target?.closest?.('button[data-opt]')||null;
document.addEventListener('pointerdown',e=>{
  const btn=optionFrom(e);
  if(!btn||btn.disabled)return;
  starts.set(e.pointerId,{btn,x:e.clientX,y:e.clientY});
},{capture:true,passive:true});
document.addEventListener('pointercancel',e=>starts.delete(e.pointerId),{capture:true,passive:true});
document.addEventListener('pointerup',e=>{
  const s=starts.get(e.pointerId);starts.delete(e.pointerId);
  if(!s||s.btn.disabled)return;
  const btn=optionFrom(e);
  if(btn!==s.btn)return;
  if(Math.hypot(e.clientX-s.x,e.clientY-s.y)>14)return; // do not answer on a scroll/drag
  const fn=btn.onclick;
  if(typeof fn==='function') fn.call(btn,e);
},{capture:true,passive:true});
})();
