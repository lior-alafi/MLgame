(()=>{
'use strict';
const B=window.ML_BANK;if(!B)return;
const P=[
  {
    "id": "est_beta_density",
    "topic": "Parameter Estimation",
    "title": "Beta density",
    "memory": "MUST_RECALL",
    "sheet": "NOT_GIVEN",
    "kind": "formula",
    "formula": "p(\\theta)=\\frac{1}{B(\\alpha,\\beta)}\\theta^{\\alpha-1}(1-\\theta)^{\\beta-1},\\quad 0<\\theta<1",
    "parts": ["\\frac{1}{B(\\alpha,\\beta)}","\\theta^{\\alpha-1}","(1-\\theta)^{\\beta-1}"],
    "explanation": "Beta היא prior טבעי לפרמטר הסתברות של Bernoulli.",
    "family": "conjugate","source": "ML lectures.pdf / ml recitation.pdf","priority": 3
  },
  {
    "id": "est_bernoulli_mle","topic": "Parameter Estimation","title": "Bernoulli MLE","memory": "MUST_RECALL","sheet": "NOT_GIVEN","kind": "formula",
    "formula": "\\hat\\theta_{MLE}=\\frac{k}{n},\\qquad k=\\sum_{i=1}^n x_i",
    "parts": ["\\hat\\theta_{MLE}=","\\frac{k}{n}","k=\\sum_i x_i"],
    "explanation": "ב-Bernoulli ה-MLE הוא שיעור ההצלחות במדגם.","family": "conjugate","source": "ML lectures.pdf / ml recitation.pdf","priority": 3
  },
  {
    "id": "est_beta_post","topic": "Parameter Estimation","title": "Beta–Bernoulli posterior","memory": "MUST_RECALL","sheet": "NOT_GIVEN","kind": "formula",
    "formula": "\\theta\\mid S_n\\sim\\mathrm{Beta}\\!\\left(\\alpha+k,\\;\\beta+n-k\\right)",
    "parts": ["\\theta\\mid S_n\\sim","\\mathrm{Beta}","\\left(\\alpha+k,\\;\\beta+n-k\\right)"],
    "explanation": "k הצלחות ו-n−k כישלונות מתווספים ל-pseudo-counts.","family": "conjugate","contextIds": ["est_beta_density","est_bernoulli_mle","est_beta_post"],"source": "ML lectures.pdf / ml recitation.pdf","priority": 3
  },
  {
    "id": "est_gamma_density","topic": "Parameter Estimation","title": "Gamma density (shape-rate)","memory": "MUST_RECALL","sheet": "NOT_GIVEN","kind": "formula",
    "formula": "p(\\theta)=\\frac{\\beta^\\alpha}{\\Gamma(\\alpha)}\\theta^{\\alpha-1}e^{-\\beta\\theta},\\quad\\theta>0",
    "parts": ["\\frac{\\beta^\\alpha}{\\Gamma(\\alpha)}","\\theta^{\\alpha-1}","e^{-\\beta\\theta}"],
    "explanation": "בקונבנציה shape-rate, alpha הוא shape ו-beta הוא rate.","family": "conjugate","source": "ML lectures.pdf / ml recitation.pdf","priority": 3
  },
  {
    "id": "est_exp_likelihood","topic": "Parameter Estimation","title": "Exponential likelihood for n i.i.d. samples","memory": "MUST_RECONSTRUCT","sheet": "NOT_GIVEN","kind": "formula",
    "formula": "p(S_n\\mid\\theta)=\\theta^n\\exp\\!\\left(-\\theta\\sum_{i=1}^n x_i\\right)",
    "parts": ["\\theta^n","\\exp\\!\\left(-\\theta\\sum_{i=1}^n x_i\\right)"],
    "explanation": "כפל n צפיפויות Exponential אוסף את theta לחזקה n ואת זמני ההמתנה לסכום.","family": "conjugate","source": "ML lectures.pdf / ml recitation.pdf","priority": 2
  },
  {
    "id": "est_exp_mle","topic": "Parameter Estimation","title": "Exponential rate MLE","memory": "MUST_RECALL","sheet": "NOT_GIVEN","kind": "formula",
    "formula": "\\hat\\theta_{MLE}=\\frac{n}{\\sum_{i=1}^n x_i}=\\frac{1}{\\bar x}",
    "parts": ["\\hat\\theta_{MLE}=","\\frac{n}{\\sum_i x_i}","=\\frac1{\\bar x}"],
    "explanation": "ל-rate של Exponential, ה-MLE הוא ההופכי של ממוצע זמני ההמתנה.","family": "conjugate","source": "ML lectures.pdf / ml recitation.pdf","priority": 3
  },
  {
    "id": "est_gamma_post","topic": "Parameter Estimation","title": "Gamma–Exponential posterior (shape-rate)","memory": "MUST_RECONSTRUCT","sheet": "NOT_GIVEN","kind": "formula",
    "formula": "\\theta\\mid S_n\\sim\\mathrm{Gamma}\\!\\left(\\alpha+n,\\;\\beta+\\sum_{i=1}^n x_i\\right)",
    "parts": ["\\theta\\mid S_n\\sim","\\mathrm{Gamma}","\\left(\\alpha+n,\\;\\beta+\\sum_{i=1}^n x_i\\right)"],
    "explanation": "במוסכמת shape-rate: כל תצפית מוסיפה ל-shape וסכום הזמנים ל-rate.","family": "conjugate","contextIds": ["est_gamma_density","est_exp_likelihood","est_gamma_post","est_exp_mle"],"source": "ML lectures.pdf / ml recitation.pdf","priority": 2
  },
  {
    "id": "est_leibniz","topic": "Parameter Estimation","title": "Leibniz integral rule","memory": "MUST_RECONSTRUCT","sheet": "NOT_GIVEN","kind": "formula",
    "formula": "\\frac{d}{da}\\int_{u(a)}^{v(a)}f(a,\\theta)d\\theta=f(a,v(a))v'(a)-f(a,u(a))u'(a)+\\int_{u(a)}^{v(a)}\\frac{\\partial f(a,\\theta)}{\\partial a}d\\theta",
    "parts": ["f(a,v(a))v'(a)","-f(a,u(a))u'(a)","+\\int_{u(a)}^{v(a)}\\frac{\\partial f}{\\partial a}d\\theta"],
    "explanation": "הכלל נדרש בגזירת posterior expected absolute loss כאשר גבולות האינטגרל תלויים ב-a.","family": "estimation","source": "ML lectures.pdf / ml recitation.pdf","priority": 2
  }
];const m=new Map(B.items.map(x=>[x.id,x]));for(const x of P){if(m.has(x.id))Object.assign(m.get(x.id),x);else B.items.push(x);}
})();
