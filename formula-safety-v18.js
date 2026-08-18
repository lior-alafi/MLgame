(()=>{
'use strict';
const B=window.ML_BANK;if(!B)return;

// Piece-based questions are only allowed when the authored chunks reconstruct the
// complete formula (including relations/separators). If they do not, regenerate
// conservative chunks directly from the full formula. This prevents malformed
// Missing Piece / Next Piece questions such as a missing '=' or '\\qquad'.
const norm=s=>String(s??'')
  .replace(/\\[;,!]/g,'')
  .replace(/\\left/g,'')
  .replace(/\\right/g,'')
  .replace(/\s+/g,'');

function appStem(it,parts){
  if(!it.formula||!parts?.length)return'';
  if(String(parts[0]).includes('='))return'';
  const idx=it.formula.indexOf('=');
  if(idx<0)return'';
  const lhs=it.formula.slice(0,idx+1).trim();
  return lhs.length<=70?lhs:'';
}
function reconstruct(it,parts){
  return [appStem(it,parts),...(parts||[])].filter(Boolean).join(String.raw`\;`);
}
function balanced(s){
  s=String(s??'');
  let depth=0;
  for(let i=0;i<s.length;i++){
    if(s[i]==='\\'){i++;continue;}
    if(s[i]==='{')depth++;
    else if(s[i]==='}'&&--depth<0)return false;
  }
  if(depth!==0)return false;
  const l=(s.match(/\\left\b/g)||[]).length;
  const r=(s.match(/\\right\b/g)||[]).length;
  return l===r;
}
function splitKeepingQquad(formula){
  const starts=[0];
  const re=/(?:,?\\qquad)/g;
  let m;
  while((m=re.exec(formula)))starts.push(m.index);
  if(starts.length===1)return null;
  const out=[];
  for(let i=0;i<starts.length;i++){
    const end=i+1<starts.length?starts[i+1]:formula.length;
    const p=formula.slice(starts[i],end);
    if(p)out.push(p);
  }
  return out;
}
function conservativeParts(formula){
  const multi=splitKeepingQquad(formula);
  if(multi?.length>1 && multi.every(balanced))return multi;
  const eq=formula.indexOf('=');
  if(eq>=0){
    const p=[formula.slice(0,eq+1),formula.slice(eq+1)];
    if(p[1] && p.every(balanced))return p;
  }
  return [formula];
}

const repaired=[];
const formulaErrors=[];
for(const it of B.items){
  if(it.kind!=='formula'||!it.formula)continue;
  if(!balanced(it.formula)){formulaErrors.push(it.id);continue;}
  const parts=Array.isArray(it.parts)?it.parts.filter(Boolean).map(String):[];
  const exact=parts.length>0 && norm(reconstruct(it,parts))===norm(it.formula);
  const chunksOk=parts.every(balanced);
  if(!exact||!chunksOk){
    const old=parts;
    it.parts=conservativeParts(String(it.formula));
    it.pieceAudit={repaired:true,reason:!chunksOk?'invalid-chunk':'reconstruction-mismatch',oldParts:old};
    repaired.push(it.id);
  }
}
window.ML_FORMULA_AUDIT={repaired,formulaErrors,totalFormulas:B.items.filter(x=>x.kind==='formula').length};
if(repaired.length)console.info(`[ML Recall] formula-piece audit repaired ${repaired.length} items.`);
if(formulaErrors.length)console.warn('[ML Recall] formulas with structural errors:',formulaErrors);
})();
