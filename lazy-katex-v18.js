(()=>{
'use strict';
if(!window.katex?.render)return;
const original=window.katex.render.bind(window.katex);
window.__ML_ORIGINAL_KATEX_RENDER=original;

// Why panels are hidden by default. Rendering every reconstruction/context formula
// immediately after answering wastes time on mobile. Store those renders and flush
// them only when the learner actually opens Why.
window.katex.render=(tex,el,opts={})=>{
  const why=el?.closest?.('#why.why');
  if(why && !why.classList.contains('open')){
    el.dataset.mlLazyKatex=String(tex);
    el.dataset.mlLazyDisplay=opts.displayMode?'1':'0';
    el.replaceChildren();
    return;
  }
  return original(tex,el,opts);
};

function flush(root){
  root?.querySelectorAll?.('[data-ml-lazy-katex]').forEach(el=>{
    const tex=el.dataset.mlLazyKatex||'';
    const display=el.dataset.mlLazyDisplay==='1';
    try{original(tex,el,{throwOnError:false,displayMode:display,strict:false});}
    catch{el.textContent=tex;}
    delete el.dataset.mlLazyKatex;
    delete el.dataset.mlLazyDisplay;
  });
}
window.ML_FLUSH_WHY_MATH=flush;

document.addEventListener('click',e=>{
  if(!e.target?.closest?.('#whyBtn'))return;
  requestAnimationFrame(()=>{
    const why=document.querySelector('#why.why.open');
    if(why)flush(why);
  });
});
})();
