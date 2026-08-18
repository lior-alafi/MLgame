(()=>{
'use strict';
const B=window.ML_BANK;if(!B)return;
const it=B.items.find(x=>x.id==='pca_encode');
if(it){
  // Keep the two equations visibly separated even when one chunk is hidden by
  // a Missing Piece question. The intended course formula is:
  // a = V^T x,   x' = V a = V V^T x.
  it.formula=String.raw`a=V^Tx,\qquad x'=Va=VV^Tx`;
  it.parts=[String.raw`a=V^Tx,\qquad`,String.raw`x'=Va`,String.raw`=VV^Tx`];
  it.explanation='מקודדים עם a=V^Tx ומפענחים עם x\'=Va=VV^Tx. לנתון לא ממורכז משתמשים ב-x−x̄ ומחזירים x̄ בדקודר.';
  it.questionContext='ב-PCA לאחר מרכוז: הקידוד הוא a=V^Tx והפענוח הוא x\'=Va=VV^Tx. השלם את החלק החסר כך ששתי המשוואות יישארו תקינות.';
}
window.ML_BUILD='v17';
})();
