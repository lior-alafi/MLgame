/*
  ML Recall Game — knowledge bank
  Content sources of truth: ML lectures.pdf and ml recitation.pdf only.
  The official "דף נוסחאות 2026.pdf" is used only to classify GIVEN / PARTIAL / NOT_GIVEN.
  Do not add course concepts or named results that are absent from the lectures/recitation.
*/

window.ML_BANK = (() => {
  const items = [];
  const F = (id, topic, title, memory, sheet, formula, parts, explanation, extra={}) => items.push({
    id, topic, title, memory, sheet, kind:'formula', formula, parts, explanation, ...extra
  });
  const D = (id, topic, title, memory, sheet, definitionParts, explanation, extra={}) => items.push({
    id, topic, title, memory, sheet, kind:'definition', definitionParts, explanation, ...extra
  });
  const A = (id, topic, title, memory, sheet, steps, explanation, extra={}) => items.push({
    id, topic, title, memory, sheet, kind:'algorithm', steps, explanation, ...extra
  });
  const T = (id, topic, title, memory, sheet, conditions, conclusion, explanation, extra={}) => items.push({
    id, topic, title, memory, sheet, kind:'theorem', conditions, conclusion, explanation, ...extra
  });
  const C = (id, topic, title, memory, sheet, prompt, correct, distractors, explanation, extra={}) => items.push({
    id, topic, title, memory, sheet, kind:'concept', prompt, correct, distractors, explanation, ...extra
  });

  // 1. Mathematical Background
  F('math_inner_norm','Mathematical Background','Inner product & Euclidean norm','UNDERSTAND','NOT_GIVEN',
    String.raw`x^T y=\sum_{j=1}^d x_jy_j,\qquad \|x\|_2=\sqrt{x^Tx}`,
    [String.raw`x^Ty`,String.raw`=\sum_{j=1}^d x_jy_j`,String.raw`\|x\|_2`,String.raw`=\sqrt{x^Tx}`],
    'מכפלה פנימית היא סקלר; הנורמה האוקלידית היא שורש המכפלה של הווקטור בעצמו.', {family:'linear-algebra'});
  F('math_orthogonal','Mathematical Background','Orthogonal matrix','MUST_RECALL','NOT_GIVEN',
    String.raw`Q^TQ=QQ^T=I\quad\Longleftrightarrow\quad Q^{-1}=Q^T`,
    [String.raw`Q^TQ=I`,String.raw`QQ^T=I`,String.raw`Q^{-1}=Q^T`],
    'במטריצה אורתוגונלית העמודות והשורות אורתונורמליות.', {family:'linear-algebra'});
  F('math_eigen','Mathematical Background','Eigenvector definition','MUST_RECALL','NOT_GIVEN',
    String.raw`Av=\lambda v,\qquad v\neq 0`,
    [String.raw`A`,String.raw`v`,String.raw`=\lambda`,String.raw`v`],
    'וקטור עצמי שומר על הכיוון תחת A ורק נמתח/מתהפך.', {family:'eigen'});
  F('math_spectral','Mathematical Background','Spectral decomposition','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`A=Q\Lambda Q^T\quad(A=A^T)`,
    [String.raw`A=`,String.raw`Q`,String.raw`\Lambda`,String.raw`Q^T`],
    'למטריצה סימטרית ניתן לבחור בסיס אורתונורמלי של וקטורים עצמיים.', {family:'eigen'});
  T('math_psd','Mathematical Background','PSD characterization','MUST_RECALL','NOT_GIVEN',
    [String.raw`A=A^T`,String.raw`z^TAz\ge 0\ \forall z`],
    'כל הערכים העצמיים אינם שליליים',
    'למטריצה סימטרית, PSD שקול לערכים עצמיים לא-שליליים.', {conditionDistractors:['A must be orthogonal','det(A)=1']});
  T('math_cov_psd','Mathematical Background','Covariance matrix is PSD','MUST_RECONSTRUCT','NOT_GIVEN',
    [String.raw`\Sigma=\mathbb E[(X-\mu)(X-\mu)^T]`],
    String.raw`z^T\Sigma z=\mathbb E[(z^T(X-\mu))^2]\ge 0`,
    'הוכחה קצרה: מכניסים את z לתוך התוחלת ומקבלים תוחלת של ריבוע.',
    {proofSteps:['מציבים את הגדרת הקווריאנס','מכניסים את z הקבוע לתוך התוחלת','מזהים סקלר בריבוע','מסיקים אי-שליליות']});
  F('math_var','Mathematical Background','Variance identity','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\operatorname{Var}(X)=\mathbb E[X^2]-(\mathbb E[X])^2`,
    [String.raw`\operatorname{Var}(X)=`,String.raw`\mathbb E[X^2]`,String.raw`-(\mathbb E[X])^2`],
    'זהות שימושית שמתקבלת מפיתוח הריבוע סביב התוחלת.', {family:'probability'});
  F('math_cov','Mathematical Background','Covariance identity','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\operatorname{Cov}(X,Y)=\mathbb E[XY]-\mathbb E[X]\mathbb E[Y]`,
    [String.raw`\operatorname{Cov}(X,Y)=`,String.raw`\mathbb E[XY]`,String.raw`-\mathbb E[X]\mathbb E[Y]`],
    'קווריאנס אפס מצביע על היעדר קשר ליניארי, לא בהכרח על אי-תלות.', {family:'probability'});
  F('math_bayes','Mathematical Background','Bayes rule','UNDERSTAND','GIVEN',
    String.raw`P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)}`,
    [String.raw`P(A\mid B)=`,String.raw`P(B\mid A)`,String.raw`P(A)`,String.raw`/P(B)`],
    'הנוסחה מופיעה בדף הרשמי; צריך לזהות posterior, likelihood, prior ו-marginal.', {family:'probability'});
  F('math_gaussian','Mathematical Background','Multivariate Gaussian','UNDERSTAND','GIVEN',
    String.raw`p(x)=\frac{1}{(2\pi)^{d/2}|\Sigma|^{1/2}}\exp\!\left[-\frac12(x-\mu)^T\Sigma^{-1}(x-\mu)\right]`,
    [String.raw`\frac{1}{(2\pi)^{d/2}|\Sigma|^{1/2}}`,String.raw`\exp`,String.raw`-\frac12`,String.raw`(x-\mu)^T\Sigma^{-1}(x-\mu)`],
    'הגאוסיאן הרב-ממדי נתון בדף הנוסחאות.', {family:'distributions'});

  // 2. Workflow & Generalization
  D('workflow_erm','ML Workflow & Generalization','Empirical Risk Minimization','MUST_RECALL','NOT_GIVEN',
    ['בוחרים השערה מתוך מחלקת ההשערות','שממזערת את ממוצע ההפסד על דוגמאות האימון'],
    'ERM ממזער שגיאה אמפירית, לא שגיאת אמת.', {formula:String.raw`\hat h_{ERM}=\arg\min_{h\in\mathcal H}\frac1n\sum_{i=1}^n\ell(h(x_i),y_i)`});
  F('workflow_true_error','ML Workflow & Generalization','True risk','MUST_RECALL','NOT_GIVEN',
    String.raw`\operatorname{Err}_{\mathcal D}(h)=\mathbb E_{(X,Y)\sim\mathcal D}[\ell(h(X),Y)]`,
    [String.raw`\operatorname{Err}_{\mathcal D}(h)=`,String.raw`\mathbb E_{(X,Y)\sim\mathcal D}`,String.raw`[\ell(h(X),Y)]`],
    'השגיאה האמיתית היא תוחלת לפי התפלגות הנתונים.', {family:'risk'});
  F('workflow_emp_error','ML Workflow & Generalization','Empirical risk','MUST_RECALL','NOT_GIVEN',
    String.raw`\operatorname{Err}_{S_n}(h)=\frac1n\sum_{i=1}^n\ell(h(x_i),y_i)`,
    [String.raw`\frac1n`,String.raw`\sum_{i=1}^n`,String.raw`\ell(h(x_i),y_i)`],
    'שגיאת האימון היא ממוצע הפסדים על המדגם.', {family:'risk'});
  F('workflow_biasvar','ML Workflow & Generalization','Bias–Variance decomposition','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\mathrm{MSE}=\sigma^2+\mathrm{Bias}^2+\mathrm{Variance}`,
    [String.raw`\mathrm{MSE}=`,String.raw`\sigma^2`,String.raw`+\mathrm{Bias}^2`,String.raw`+\mathrm{Variance}`],
    'Noise irreducible + bias² + variance.', {family:'generalization'});
  F('workflow_kfold','ML Workflow & Generalization','K-fold sizes','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`n_{train}\approx \frac{n(K-1)}K,\qquad n_{val}\approx\frac nK`,
    [String.raw`n_{train}\approx`,String.raw`\frac{n(K-1)}K`,String.raw`n_{val}\approx`,String.raw`\frac nK`],
    'ב-LOO, K=n ולכן בכל fold יש n−1 דוגמאות אימון.', {family:'validation'});

  // 3. Bayesian Decision Theory
  F('bdt_risk','Bayesian Decision Theory','Conditional risk','MUST_RECALL','NOT_GIVEN',
    String.raw`R(\alpha_k\mid x)=\sum_j\lambda(\alpha_k,\omega_j)P(\omega_j\mid x)`,
    [String.raw`R(\alpha_k\mid x)=`,String.raw`\sum_j`,String.raw`\lambda(\alpha_k,\omega_j)`,String.raw`P(\omega_j\mid x)`],
    'הסיכון המותנה הוא התוחלת של העלות אחרי שראינו x.', {family:'bayes-decision'});
  F('bdt_action','Bayesian Decision Theory','Bayes action','MUST_RECALL','NOT_GIVEN',
    String.raw`\alpha^*(x)=\arg\min_{\alpha_k}R(\alpha_k\mid x)`,
    [String.raw`\alpha^*(x)=`,String.raw`\arg\min_{\alpha_k}`,String.raw`R(\alpha_k\mid x)`],
    'בוחרים את הפעולה בעלת הסיכון המותנה המינימלי.', {family:'bayes-decision'});
  T('bdt_01','Bayesian Decision Theory','0–1 loss ⇒ maximum posterior','MUST_RECONSTRUCT','PARTIAL',
    ['הפעולות הן בחירת מחלקה','עלות 0 אם צדקנו ו-1 אם טעינו'],
    String.raw`\alpha^*(x)=\arg\max_k P(\omega_k\mid x)`,
    'ב-0–1 loss מתקבל R=1−posterior ולכן מינימום הסיכון הוא maximum posterior.',
    {proofSteps:['כותבים את הסיכון המותנה','מציבים 0–1 loss','מקבלים 1-P(ω_k|x)','ממזערים ⇔ ממקסמים posterior']});

  // 4. Parameter Estimation
  F('est_mle','Parameter Estimation','MLE','MUST_RECALL','NOT_GIVEN',
    String.raw`\hat\theta_{MLE}=\arg\max_\theta\prod_{i=1}^n p(x_i\mid\theta)=\arg\max_\theta\sum_{i=1}^n\log p(x_i\mid\theta)`,
    [String.raw`\arg\max_\theta`,String.raw`\prod_i p(x_i\mid\theta)`,String.raw`=\arg\max_\theta`,String.raw`\sum_i\log p(x_i\mid\theta)`],
    'i.i.d. הופך likelihood למכפלה; log הופך מכפלה לסכום.', {family:'estimation'});
  F('est_map','Parameter Estimation','MAP','MUST_RECALL','PARTIAL',
    String.raw`\hat\theta_{MAP}=\arg\max_\theta\left[\sum_{i=1}^n\log p(x_i\mid\theta)+\log p(\theta)\right]`,
    [String.raw`\arg\max_\theta`,String.raw`\sum_i\log p(x_i\mid\theta)`,String.raw`+\log p(\theta)`],
    'Bayes rule נתון, אבל נוסחת MAP לפרמטרים אינה מופיעה במלואה בדף.', {family:'estimation'});
  F('est_bayes','Parameter Estimation','Bayes estimator','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`a^*(S)=\arg\min_a\int \lambda(\theta,a)p(\theta\mid S)\,d\theta`,
    [String.raw`a^*(S)=`,String.raw`\arg\min_a`,String.raw`\int`,String.raw`\lambda(\theta,a)p(\theta\mid S)d\theta`],
    'האומד הבייסיאני ממזער posterior expected loss.', {family:'estimation'});
  C('est_loss_estimators','Parameter Estimation','Bayes estimator under common losses','MUST_RECALL','NOT_GIVEN',
    'התאם loss לאומד Bayes', 'L2 → posterior mean; L1 → posterior median; 0–1 → posterior mode',
    ['L2 → mode; L1 → mean; 0–1 → median','L2 → median; L1 → mode; 0–1 → mean'],
    'אלה שלוש תוצאות בסיסיות של Bayes estimators.', {family:'estimation'});
  F('est_beta_post','Parameter Estimation','Beta–Bernoulli posterior','MUST_RECALL','NOT_GIVEN',
    String.raw`\theta\mid S_n\sim\operatorname{Beta}(\alpha+k,\beta+n-k)`,
    [String.raw`\operatorname{Beta}(`,String.raw`\alpha+k`,String.raw`,\beta+n-k`,String.raw`)`],
    'k הצלחות ו-n−k כישלונות מתווספים ל-pseudo-counts.', {family:'conjugate'});
  F('est_gamma_post','Parameter Estimation','Gamma–Exponential posterior (shape-rate)','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\theta\mid S_n\sim\operatorname{Gamma}\!\left(\alpha+n,\beta+\sum_{i=1}^n x_i\right)`,
    [String.raw`\operatorname{Gamma}(`,String.raw`\alpha+n`,String.raw`,\beta+\sum_i x_i`,String.raw`)`],
    'במוסכמת shape-rate: כל תצפית מוסיפה ל-shape וסכום הזמנים ל-rate.', {family:'conjugate'});

  // 5. PAC — wording and notation follow the lecture PAC slides
  D('pac_definition','PAC Learning','PAC definition','MUST_RECALL','NOT_GIVEN',
    ['לכל ε,δ∈(0,1)','קיים sample complexity N(ε,δ)','לכל n≥N ולכל התפלגות D','בהסתברות לפחות 1−δ','שגיאת האמת של ההשערה המוחזרת קטנה מ-ε'],
    'ε קובע accuracy ו-δ קובע confidence. ההסתברות היא על המדגם האקראי S_n.', {formula:String.raw`P_{S_n\sim\mathcal D^n}(\operatorname{Err}_{\mathcal D}(A(S_n))<\varepsilon)>1-\delta`, why:'המדגם S_n הוא אקראי, ולכן גם ההשערה A(S_n) אקראית. PAC אומר שאם n גדול מספיק, רוב המדגמים (לפחות הסתברות 1−δ) יובילו להשערה ששגיאת האמת שלה קטנה מ-ε.'});
  D('pac_version_space','PAC Learning','Version Space','MUST_RECALL','NOT_GIVEN',
    ['כל ההשערות h∈H','שמקיימות Err_{S_n}(h)=0'],
    'במקרה realizable, ERM יכול לבחור כל השערה עקבית מתוך ה-Version Space.', {formula:String.raw`V(S_n)=\{h\in\mathcal H:\operatorname{Err}_{S_n}(h)=0\}`, why:'Version Space הוא קבוצת ההשערות שלא עשו אף טעות על מדגם האימון. הבעיה היא שגם השערה עם true error גדול יכולה במקרה לא לטעות על S_n ולהישאר ב-Version Space.'});
  F('pac_bad_set','PAC Learning','Bad hypotheses set','MUST_RECALL','NOT_GIVEN',
    String.raw`\mathcal H_{bad}(\mathcal D,\varepsilon)=\{h\in\mathcal H:\operatorname{Err}_{\mathcal D}(h)>\varepsilon\}`,
    [String.raw`\mathcal H_{bad}(\mathcal D,\varepsilon)=`,String.raw`\{h\in\mathcal H:`,String.raw`\operatorname{Err}_{\mathcal D}(h)>\varepsilon\}`],
    'Bad hypothesis היא השערה ששגיאת האמת שלה גדולה מ-ε.', {family:'pac-realizable-proof', why:'המטרה בהוכחה היא לחסום את ההסתברות ש-ERM “ייפול” על השערה מתוך H_bad אף שהיא עקבית על מדגם האימון.'});
  F('pac_bad_survival','PAC Learning','Bad hypothesis survives the sample','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`P(\operatorname{Err}_{S_n}(h)=0)\le(1-\varepsilon)^n\le e^{-n\varepsilon}\qquad(h\in\mathcal H_{bad})`,
    [String.raw`P(\operatorname{Err}_{S_n}(h)=0)`,String.raw`\le(1-\varepsilon)^n`,String.raw`\le e^{-n\varepsilon}`],
    'אם true error של h גדול מ-ε, ההסתברות שהיא צודקת בדוגמה אחת קטנה מ-1−ε; בגלל i.i.d. מעלים בחזקת n.', {family:'pac-realizable-proof', why:'ל-h∈H_bad יש הסתברות גדולה מ-ε לטעות על דוגמה חדשה, ולכן הסתברות קטנה מ-1−ε לא לטעות. כדי לשרוד ב-Version Space היא חייבת לא לטעות בכל n הדוגמאות. עצמאות הדוגמאות נותנת (1−ε)^n, ואז משתמשים ב-(1−x)^n≤e^{-nx}.'});
  F('pac_union_bad','PAC Learning','Union bound over bad hypotheses','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`P(\operatorname{Err}_{\mathcal D}(ERM(S_n))>\varepsilon)\le\sum_{h\in\mathcal H_{bad}(\mathcal D,\varepsilon)}P(\operatorname{Err}_{S_n}(h)=0)`,
    [String.raw`P(\operatorname{Err}_{\mathcal D}(ERM(S_n))>\varepsilon)`,String.raw`\le\sum_{h\in\mathcal H_{bad}(\mathcal D,\varepsilon)}`,String.raw`P(\operatorname{Err}_{S_n}(h)=0)`],
    'אם ERM מחזיר bad hypothesis, לפחות bad hypothesis אחת שרדה ב-Version Space; Union Bound מחבר את הסתברויות ההישרדות.', {family:'pac-realizable-proof', why:'אירוע הכשל של ERM כלול באיחוד האירועים “h bad מסוימת עקבית על S_n”. לכן Union Bound נותן הסתברות כשל לכל היותר סכום ההסתברויות על כל h∈H_bad.'});
  F('pac_bad_cardinality','PAC Learning','Bounding the number of bad hypotheses','MUST_RECALL','NOT_GIVEN',
    String.raw`|\mathcal H_{bad}(\mathcal D,\varepsilon)|\le|\mathcal H|`,
    [String.raw`|\mathcal H_{bad}(\mathcal D,\varepsilon)|`,String.raw`\le`,String.raw`|\mathcal H|`],
    'H_bad היא תת-קבוצה של H, ולכן מספר ההשערות הרעות לא יכול לעלות על |H|.', {family:'pac-realizable-proof'});
  F('pac_failure_bound','PAC Learning','Finite realizable failure bound','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`P(\operatorname{Err}_{\mathcal D}(ERM(S_n))>\varepsilon)\le|\mathcal H|e^{-n\varepsilon}\le\delta`,
    [String.raw`P(\operatorname{Err}_{\mathcal D}(ERM(S_n))>\varepsilon)`,String.raw`\le|\mathcal H|`,String.raw`e^{-n\varepsilon}`,String.raw`\le\delta`],
    'זה החסם שממנו פותרים עבור n.', {family:'pac-realizable-proof', why:'אחרי Union Bound מקבלים |H_bad|(1−ε)^n. מחליפים |H_bad| ב-|H| כדי לקבל חסם פשוט יותר, ואז (1−ε)^n≤e^{-nε}. לבסוף דורשים שכל הביטוי יהיה לכל היותר δ.'});
  F('pac_finite_realizable','PAC Learning','Finite hypothesis class — realizable sample bound','MUST_RECALL','NOT_GIVEN',
    String.raw`n>\frac1\varepsilon\ln\left(\frac{|\mathcal H|}{\delta}\right)`,
    [String.raw`n>`,String.raw`\frac1\varepsilon`,String.raw`\ln\left(\frac{|\mathcal H|}{\delta}\right)`],
    'במקרה realizable, finite H ו-ERM עקבי, בחירה כזו של n מבטיחה PAC.', {family:'pac-bounds', why:'מתחילים מ-|H|e^{-nε}≤δ. מחלקים ב-|H|, לוקחים ln, ומסדרים כדי לקבל n>(1/ε)ln(|H|/δ).'});
  F('pac_hoeffding','PAC Learning','Hoeffding inequality','MUST_RECALL','NOT_GIVEN',
    String.raw`P(|\bar Z-\mathbb E Z|>\varepsilon)\le 2e^{-2n\varepsilon^2}`,
    [String.raw`P(|\bar Z-\mathbb E Z|>\varepsilon)`,String.raw`\le 2`,String.raw`e^{-2n\varepsilon^2}`],
    'למשתנים בלתי תלויים וחסומים; בהרצאה משתמשים בו במקרה finite agnostic.', {family:'pac-bounds'});
  F('pac_finite_agnostic','PAC Learning','Finite hypothesis class — agnostic sample bound','MUST_RECALL','NOT_GIVEN',
    String.raw`n>\frac1{\varepsilon^2}\ln\left(\frac{2|\mathcal H|}{\delta}\right)`,
    [String.raw`n>`,String.raw`\frac1{\varepsilon^2}`,String.raw`\ln\left(\frac{2|\mathcal H|}{\delta}\right)`],
    'במקרה agnostic התלות ב-ε היא 1/ε².', {family:'pac-bounds'});
  C('pac_vc_idea','PAC Learning','Infinite hypothesis classes and VC dimension','UNDERSTAND','NOT_GIVEN',
    'בהרצאה, במה מחליפים את ln|H| כאשר H אינסופית?', 'במדד מורכבות שנקרא VC Dimension',
    ['במספר דוגמאות האימון בלבד','במספר המחלקות בלבד','ב-Hoeffding ללא מדד מורכבות'],
    'ההרצאה מציינת את הרעיון בלבד; היא לא נותנת כאן נוסחת sample complexity מפורטת ל-VC.');
  A('pac_proof_realizable','PAC Learning','Finite realizable PAC proof','MUST_RECONSTRUCT','NOT_GIVEN',
    ['מגדירים H_bad(D,ε)={h∈H : Err_D(h)>ε}','ל-h∈H_bad: ההסתברות להישאר עקבית על S_n היא לכל היותר (1−ε)^n','אם ERM נכשל, לפחות h אחת מ-H_bad שרדה ב-Version Space; מפעילים Union Bound','מקבלים |H_bad(D,ε)|(1−ε)^n','משתמשים ב-|H_bad(D,ε)|≤|H| וב-(1−ε)^n≤e^(−nε)','דורשים |H|e^(−nε)≤δ ופותרים: n>(1/ε)ln(|H|/δ)'],
    'המטרה היא לחסום את הסתברות הכשל: ש-ERM יחזיר השערה עם true error גדול מ-ε.',
    {isProof:true, why:'הנקודה המרכזית היא שלא מנסים להראות שכל bad hypothesis נכשלת על המדגם. לכל אחת יש סיכוי קטן “לשרוד”. מאחדים את כל אפשרויות הכשל בעזרת Union Bound, מחליפים את מספר ה-bad hypotheses בחסם |H|, ואז בוחרים n כך שסך הסתברות הכשל תהיה לכל היותר δ.'});

  // 6. Optimization
  F('opt_gd','Optimization','Gradient Descent update','MUST_RECALL','NOT_GIVEN',
    String.raw`w_{t+1}=w_t-\eta\nabla L(w_t)`,
    [String.raw`w_{t+1}=`,String.raw`w_t`,String.raw`-\eta`,String.raw`\nabla L(w_t)`],
    'צועדים נגד כיוון הגרדיאנט כדי להקטין את הפונקציה.', {family:'optimizers'});
  F('opt_minibatch','Optimization','Mini-batch gradient','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`g_t=\frac1{|B_t|}\sum_{i\in B_t}\nabla\ell_i(w_t),\qquad w_{t+1}=w_t-\eta g_t`,
    [String.raw`g_t=\frac1{|B_t|}`,String.raw`\sum_{i\in B_t}\nabla\ell_i(w_t)`,String.raw`w_{t+1}=w_t-\eta g_t`],
    'Mini-batch משתמש בממוצע גרדיאנטים על תת-קבוצה.', {family:'optimizers'});
  D('opt_smooth','Optimization','β-smoothness','MUST_RECALL','NOT_GIVEN',
    [String.raw`\|\nabla f(x)-\nabla f(y)\|_2\le \beta\|x-y\|_2`],
    'בתרגול פונקציה נקראת β-smooth כאשר הגרדיאנט שלה Lipschitz עם קבוע β.', {formula:String.raw`\|\nabla f(x)-\nabla f(y)\|_2\le \beta\|x-y\|_2`});
  F('opt_descent_lemma','Optimization','Descent lemma after GD step','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`f(x_{t+1})\le f(x_t)-\eta\left(1-\frac{\eta \beta}{2}\right)\|\nabla f(x_t)\|_2^2`,
    [String.raw`f(x_{t+1})\le f(x_t)`,String.raw`-\eta`,String.raw`(1-\eta \beta/2)`,String.raw`\|\nabla f(x_t)\|^2`],
    'נובע מ-β-smoothness והצבה y=x−η∇f(x).', {family:'gd-proof'});
  A('opt_gd_proof','Optimization','GD convex convergence proof skeleton','MUST_RECONSTRUCT','NOT_GIVEN',
    ['כותבים את המרחק בריבוע אל w* אחרי עדכון GD','מפתחים את הריבוע','משתמשים בקמירות לקשר inner product לפער פונקציה','משתמשים בחסם על הגרדיאנט/חלקות לפי המשפט','מסכמים טלסקופית ומחלקים ב-T'],
    'המבחן יכול לדרוש את מבנה ההוכחה, לא כל שורת אלגברה.');

  // 7. Regression
  F('reg_mse','Regression','MSE','UNDERSTAND','GIVEN',
    String.raw`L(y,\hat y)=\frac1n(y-\hat y)^T(y-\hat y)`,
    [String.raw`\frac1n`,String.raw`(y-\hat y)^T`,String.raw`(y-\hat y)`],
    'מופיע בדף הרשמי.', {family:'regression'});
  F('reg_grad','Regression','OLS gradient','MUST_RECONSTRUCT','PARTIAL',
    String.raw`\nabla_w\mathrm{MSE}=-\frac2nX^T(y-Xw)`,
    [String.raw`-\frac2n`,String.raw`X^T`,String.raw`(y-Xw)`],
    'MSE וחוקי הגזירה נתונים, אבל הגרדיאנט הסופי אינו נתון במפורש.', {family:'regression'});
  F('reg_normal','Regression','Normal equations','MUST_RECALL','NOT_GIVEN',
    String.raw`X^TX\hat w=X^Ty`,
    [String.raw`X^TX`,String.raw`\hat w`,String.raw`=X^Ty`],
    'מתקבל מהשוואת גרדיאנט OLS לאפס.', {family:'regression'});
  F('reg_ols','Regression','OLS closed form','MUST_RECALL','NOT_GIVEN',
    String.raw`\hat w=(X^TX)^{-1}X^Ty`,
    [String.raw`(X^TX)^{-1}`,String.raw`X^Ty`],
    'תקף כאשר X^TX הפיכה.', {family:'regression', wrongFormula:String.raw`\hat w=(XX^T)^{-1}X^Ty`, errorOptions:['צריך X^TX בתוך ההופכי','צריך להפוך גם את X^Ty','צריך להוסיף λI']});
  T('reg_invertible','Regression','When is XᵀX invertible?','MUST_RECALL','NOT_GIVEN',
    ['עמודות X בלתי תלויות ליניארית','rank(X)=d'],
    'X^TX הפיכה',
    'n>d לבדו אינו מספיק; צריך full column rank.', {conditionDistractors:['X must be square','n>d is sufficient']});
  F('reg_ridge_obj','Regression','Ridge objective','MUST_RECALL','NOT_GIVEN',
    String.raw`J_\lambda(w)=\|y-Xw\|_2^2+\lambda\|w\|_2^2`,
    [String.raw`\|y-Xw\|_2^2`,String.raw`+\lambda`,String.raw`\|w\|_2^2`],
    'Ridge מוסיף L2 penalty.', {family:'ridge'});
  F('reg_ridge','Regression','Ridge closed form','MUST_RECALL','NOT_GIVEN',
    String.raw`\hat w_\lambda=(X^TX+\lambda I)^{-1}X^Ty`,
    [String.raw`X^TX`,String.raw`+\lambda I`,String.raw`^{-1}`,String.raw`X^Ty`],
    'λI מזיז כל eigenvalue של XᵀX ב-λ ולכן עבור λ>0 מתקבלת הפיכות.', {family:'ridge', wrongFormula:String.raw`\hat w=(X^TX)^{-1}(X^Ty+\lambda I)`, errorOptions:['λI צריך להיות בתוך המטריצה לפני ההופכי','λ צריך להכפיל את y','I צריך להיות מחוץ לסוגריים']});
  F('reg_ridge_svd','Regression','Ridge prediction shrinkage factor','MUST_RECALL','NOT_GIVEN',
    String.raw`\hat y_\lambda=\sum_j u_j\frac{\sigma_j^2}{\sigma_j^2+\lambda}u_j^Ty`,
    [String.raw`u_j`,String.raw`\frac{\sigma_j^2}{\sigma_j^2+\lambda}`,String.raw`u_j^Ty`],
    'Ridge מכווץ במיוחד כיוונים בעלי singular value קטן.', {family:'ridge'});
  F('reg_poly','Regression','Polynomial feature map','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\phi(x)=(1,x,x^2,\ldots,x^p)^T,\qquad \hat y=w^T\phi(x)`,
    [String.raw`\phi(x)=`,String.raw`(1,x,x^2,\ldots,x^p)^T`,String.raw`\hat y=w^T\phi(x)`],
    'המודל לא לינארי ב-x אך לינארי בפרמטרים w.', {family:'regression'});

  // 8. Linear classifiers
  F('lin_perceptron_pred','Linear Classifiers','Perceptron prediction','MUST_RECALL','NOT_GIVEN',
    String.raw`\hat y_i=\operatorname{sign}(w^Tx_i+b)`,
    [String.raw`\operatorname{sign}(`,String.raw`w^Tx_i+b`,String.raw`)`],
    'Perceptron הוא מסווג לינארי.', {family:'perceptron'});
  F('lin_perceptron_update','Linear Classifiers','Perceptron update','MUST_RECALL','NOT_GIVEN',
    String.raw`w\leftarrow w+\eta y_ix_i,\qquad b\leftarrow b+\eta y_i`,
    [String.raw`w\leftarrow w`,String.raw`+\eta y_ix_i`,String.raw`b\leftarrow b`,String.raw`+\eta y_i`],
    'מעדכנים רק אם y_i(wᵀx_i+b)≤0.', {family:'perceptron'});
  F('lin_sigmoid','Linear Classifiers','Sigmoid','UNDERSTAND','GIVEN',
    String.raw`\sigma(z)=\frac1{1+e^{-z}}`,
    [String.raw`1`,String.raw`/(1+e^{-z})`],
    'מופיע בדף הרשמי.', {family:'logistic'});
  F('lin_logodds','Linear Classifiers','Log-odds identity','MUST_RECALL','NOT_GIVEN',
    String.raw`\log\frac{p}{1-p}=w^Tx+b`,
    [String.raw`\log`,String.raw`\frac{p}{1-p}`,String.raw`=w^Tx+b`],
    'מכאן השם logistic regression: ה-log odds לינארי ב-x.', {family:'logistic'});
  F('lin_bce_grad','Linear Classifiers','Logistic BCE gradient','MUST_RECONSTRUCT','PARTIAL',
    String.raw`\nabla_w\ell=(p-y)x,\qquad \frac{\partial\ell}{\partial b}=p-y`,
    [String.raw`\nabla_w\ell=`,String.raw`(p-y)`,String.raw`x`,String.raw`\frac{\partial\ell}{\partial b}=p-y`],
    'ברגרסיה לוגיסטית לדוגמה אחת, אם z=w^Tx+b, p=σ(z) ו-ℓ הוא BCE, מתקבל ∂ℓ/∂z=p−y. כלל השרשרת נותן ∂z/∂w=x ו-∂z/∂b=1.',
    {family:'logistic',
     questionContext:'ברגרסיה לוגיסטית לדוגמה אחת נגדיר z=w^Tx+b, p=σ(z), ו-ℓ כ-BCE. השלם את הגרדיאנט המבוקש; כל הסימנים הוגדרו כאן.',
     why:'מסלול השחזור: z=w^Tx+b → p=σ(z) → עם BCE מתקבל ∂ℓ/∂z=p−y → כלל השרשרת: ∇_wℓ=(∂ℓ/∂z)(∂z/∂w)=(p−y)x, וביחס ל-b מתקבל (p−y)·1.'});

  // 9. Softmax
  F('softmax_formula','Softmax','Softmax','UNDERSTAND','GIVEN',
    String.raw`p_k=\frac{e^{z_k}}{\sum_{j=1}^K e^{z_j}}`,
    [String.raw`e^{z_k}`,String.raw`/`,String.raw`\sum_j e^{z_j}`],
    'Softmax מופיע בדף הרשמי.', {family:'softmax'});
  F('softmax_ce','Softmax','Multiclass cross-entropy','MUST_RECALL','PARTIAL',
    String.raw`\ell=-\sum_{k=1}^K y_k\log p_k`,
    [String.raw`-`,String.raw`\sum_{k=1}^K`,String.raw`y_k\log p_k`],
    'הדף נותן BCE, לא את גרסת ה-one-hot הרב-מחלקתית.', {family:'softmax'});
  F('softmax_grad','Softmax','Softmax + CE logit gradient','MUST_RECALL','PARTIAL',
    String.raw`\nabla_z\ell=p-y`,
    [String.raw`\nabla_z\ell=`,String.raw`p-y`],
    'תוצאה מרכזית ל-backprop בשכבת softmax.', {family:'softmax'});
  F('softmax_temp','Softmax','Temperature scaling','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`p_k(T)=\frac{e^{z_k/T}}{\sum_j e^{z_j/T}},\qquad T>0`,
    [String.raw`e^{z_k/T}`,String.raw`/\sum_j e^{z_j/T}`,String.raw`T>0`],
    'T>1 מרכך התפלגות; T<1 מחדד אותה.', {family:'calibration'});

  // 10. SVM & Kernels
  F('svm_distance','SVM & Kernels','Distance to hyperplane','MUST_RECALL','NOT_GIVEN',
    String.raw`d(x,\mathcal H)=\frac{|w^Tx-b|}{\|w\|_2}`,
    [String.raw`|w^Tx-b|`,String.raw`/\|w\|_2`],
    'מרחק נקודה ממישור מנורמל באורך w.', {family:'svm'});
  F('svm_hard','SVM & Kernels','Hard-margin primal','MUST_RECALL','NOT_GIVEN',
    String.raw`\min_{w,b}\frac12\|w\|_2^2\quad\text{s.t.}\quad y_i(w^Tx_i-b)\ge1\ \forall i`,
    [String.raw`\min_{w,b}`,String.raw`\frac12\|w\|^2`,String.raw`y_i(w^Tx_i-b)\ge1`],
    'מזעור הנורמה שקול למקסום margin.', {family:'svm'});
  F('svm_soft','SVM & Kernels','Soft-margin primal','MUST_RECALL','NOT_GIVEN',
    String.raw`\min_{w,b,\xi}\frac12\|w\|_2^2+C\sum_i\xi_i\quad\text{s.t.}\quad y_i f(x_i)\ge1-\xi_i,\ \xi_i\ge0`,
    [String.raw`\frac12\|w\|^2`,String.raw`+C\sum_i\xi_i`,String.raw`y_if(x_i)\ge1-\xi_i`,String.raw`\xi_i\ge0`],
    'Slack variables מאפשרים הפרות margin.', {family:'svm'});
  F('svm_hinge','SVM & Kernels','Hinge-loss form','MUST_RECALL','NOT_GIVEN',
    String.raw`\min_{w,b}\frac12\|w\|_2^2+C\sum_i\max(0,1-y_if(x_i))`,
    [String.raw`\frac12\|w\|^2`,String.raw`+C\sum_i`,String.raw`\max(0,1-y_if(x_i))`],
    'ניסוח לא-מוגבל השקול ל-soft-margin.', {family:'svm'});
  F('svm_dual','SVM & Kernels','SVM dual','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\max_\alpha\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jK(x_i,x_j)`,
    [String.raw`\sum_i\alpha_i`,String.raw`-\frac12`,String.raw`\sum_{i,j}\alpha_i\alpha_jy_iy_jK(x_i,x_j)`],
    'ב-hard margin: α_i≥0 ו-Σα_i y_i=0; ב-soft margin גם α_i≤C.', {family:'svm'});
  F('svm_kkt','SVM & Kernels','Complementary slackness for hard-margin SVM','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\alpha_i\,[y_if(x_i)-1]=0`,
    [String.raw`\alpha_i`,String.raw`[y_if(x_i)-1]`,String.raw`=0`],
    'Support vectors יכולים לקבל α_i>0; אז האילוץ פעיל בשוויון.', {family:'kkt'});
  F('svm_kernel','SVM & Kernels','Kernel trick','MUST_RECALL','NOT_GIVEN',
    String.raw`K(x,z)=\phi(x)^T\phi(z)`,
    [String.raw`K(x,z)=`,String.raw`\phi(x)^T`,String.raw`\phi(z)`],
    'מחשבים מכפלה פנימית במרחב תכונות בלי לבנות אותו מפורשות.', {family:'kernels'});
  F('svm_rbf','SVM & Kernels','RBF kernel','MUST_RECALL','NOT_GIVEN',
    String.raw`K(x,z)=\exp(-\gamma\|x-z\|_2^2)`,
    [String.raw`\exp(`,String.raw`-\gamma`,String.raw`\|x-z\|_2^2`,String.raw`)`],
    'Kernel נפוץ עם גבול החלטה לא-לינארי.', {family:'kernels'});
  A('svm_dual_steps','SVM & Kernels','Primal → dual derivation skeleton','MUST_RECONSTRUCT','NOT_GIVEN',
    ['כותבים את ה-primal והאילוצים','בונים Lagrangian עם α_i≥0','גוזרים לפי w,b ומשווים לאפס','מקבלים w=Σα_i y_i x_i ו-Σα_i y_i=0','מציבים חזרה ב-L ומקבלים את ה-dual','משתמשים ב-KKT וב-kernel trick לפי הצורך'],
    'זהו מסלול השחזור החשוב; אין צורך לשנן כל פתיחת סוגריים.');

  // 11. NB / KNN / Metrics
  F('nb_cond_ind','KNN / Naive Bayes / Metrics','Naive Bayes conditional independence','MUST_RECALL','NOT_GIVEN',
    String.raw`p(x\mid c)=\prod_{j=1}^d p(x_j\mid c)`,
    [String.raw`p(x\mid c)=`,String.raw`\prod_{j=1}^d`,String.raw`p(x_j\mid c)`],
    'העצמאות היא מותנית במחלקה c.', {family:'naive-bayes'});
  F('nb_rule','KNN / Naive Bayes / Metrics','Naive Bayes decision rule','MUST_RECALL','PARTIAL',
    String.raw`\hat y=\arg\max_c\left[\log P(c)+\sum_j\log p(x_j\mid c)\right]`,
    [String.raw`\arg\max_c`,String.raw`\log P(c)`,String.raw`+\sum_j\log p(x_j\mid c)`],
    'Bayes rule נתון; factorization וה-log rule אינם בדף.', {family:'naive-bayes'});
  F('nb_laplace','KNN / Naive Bayes / Metrics','Laplace smoothing','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\hat P(x_j=v\mid c)=\frac{N_{c,j,v}+\alpha}{N_c+\alpha V}`,
    [String.raw`N_{c,j,v}+\alpha`,String.raw`/`,String.raw`N_c+\alpha V`],
    'מונע הסתברות אפס בערכים קטגוריאליים שלא נצפו.', {family:'naive-bayes'});
  A('knn_algo','KNN / Naive Bayes / Metrics','KNN algorithm','MUST_RECALL','NOT_GIVEN',
    ['מחשבים מרחק מה-query לכל דוגמת אימון','בוחרים את K השכנים הקרובים ביותר','בסיווג מחזירים majority/mode של התוויות'],
    'KNN הוא lazy learner: אין שלב training פרמטרי.');
  F('metric_precision','KNN / Naive Bayes / Metrics','Precision','MUST_RECALL','NOT_GIVEN',
    String.raw`\mathrm{Precision}=\frac{TP}{TP+FP}`,
    [String.raw`TP`,String.raw`/(TP+FP)`], 'מתוך מה שחזינו כחיובי — כמה באמת חיובי.', {family:'metrics'});
  F('metric_recall','KNN / Naive Bayes / Metrics','Recall / TPR','MUST_RECALL','NOT_GIVEN',
    String.raw`\mathrm{Recall}=\mathrm{TPR}=\frac{TP}{TP+FN}`,
    [String.raw`TP`,String.raw`/(TP+FN)`], 'מתוך החיוביים האמיתיים — כמה מצאנו.', {family:'metrics'});
  F('metric_fpr','KNN / Naive Bayes / Metrics','False Positive Rate','MUST_RECALL','NOT_GIVEN',
    String.raw`\mathrm{FPR}=\frac{FP}{FP+TN}`,
    [String.raw`FP`,String.raw`/(FP+TN)`], 'ROC מצייר TPR מול FPR כאשר משנים threshold.', {family:'metrics'});
  F('metric_f1','KNN / Naive Bayes / Metrics','F1','MUST_RECALL','NOT_GIVEN',
    String.raw`F_1=2\frac{\mathrm{Precision}\cdot\mathrm{Recall}}{\mathrm{Precision}+\mathrm{Recall}}`,
    [String.raw`2`,String.raw`\frac{PR}{P+R}`], 'ממוצע הרמוני של precision ו-recall.', {family:'metrics'});
  C('metric_auc','KNN / Naive Bayes / Metrics','AUC interpretation','UNDERSTAND','NOT_GIVEN',
    'מה פירוש הסתברותי של AUC?', 'ההסתברות שדוגמה חיובית אקראית תקבל score גבוה מדוגמה שלילית אקראית',
    ['הדיוק הממוצע בכל thresholds','ההסתברות שכל החיוביים מסווגים נכון'],
    'AUC = P(s(X⁺)>s(X⁻)).', {formula:String.raw`AUC=P(s(X^+)>s(X^-))`});

  // 12. Trees & Boosting
  F('tree_entropy','Trees & Boosting','Entropy','MUST_RECALL','NOT_GIVEN',
    String.raw`H(S)=-\sum_{k=1}^K p_k\log p_k`,
    [String.raw`-`,String.raw`\sum_k`,String.raw`p_k\log p_k`],
    'Entropy מודדת אי-טוהר/אי-ודאות בצומת.', {family:'trees'});
  F('tree_ig','Trees & Boosting','Information gain','MUST_RECALL','NOT_GIVEN',
    String.raw`IG(S,a)=H(S)-\sum_v\frac{|S_v|}{|S|}H(S_v)`,
    [String.raw`H(S)`,String.raw`-\sum_v`,String.raw`\frac{|S_v|}{|S|}`,String.raw`H(S_v)`],
    'באיטרציה עמוקה יותר S הוא תת-הקבוצה שהגיעה לצומת הנוכחי.', {family:'trees'});
  F('boost_ensemble','Trees & Boosting','Boosted ensemble','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`F(x)=\sum_{m=1}^M\gamma_m h_m(x)`,
    [String.raw`\sum_{m=1}^M`,String.raw`\gamma_m`,String.raw`h_m(x)`],
    'Boosting בונה מודל חזק מסדרה של weak learners.', {family:'boosting'});
  F('boost_residual','Trees & Boosting','Gradient boosting pseudo-residual','MUST_RECALL','NOT_GIVEN',
    String.raw`r_{im}=-\frac{\partial\ell(y_i,F(x_i))}{\partial F(x_i)}`,
    [String.raw`r_{im}=`,String.raw`-`,String.raw`\partial\ell/\partial F(x_i)`],
    'בעבור squared error זה מתקשר ל-residuals.', {family:'boosting'});
  F('adaboost_alpha','Trees & Boosting','AdaBoost learner weight','MUST_RECALL','NOT_GIVEN',
    String.raw`\alpha_t=\frac12\log\frac{1-\varepsilon_t}{\varepsilon_t}`,
    [String.raw`\frac12`,String.raw`\log`,String.raw`\frac{1-\varepsilon_t}{\varepsilon_t}`],
    'ככל שהweak learner טוב יותר מ-random, משקלו גדל.', {family:'adaboost'});
  F('adaboost_weights','Trees & Boosting','AdaBoost sample-weight update','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`D_{t+1}(i)=\frac{D_t(i)e^{-\alpha_t y_i h_t(x_i)}}{Z_t}`,
    [String.raw`D_t(i)`,String.raw`e^{-\alpha_t y_i h_t(x_i)}`,String.raw`/Z_t`],
    'דוגמאות שסווגו שגוי מקבלות משקל יחסי גדול יותר.', {family:'adaboost'});
  A('boost_gradient_algo','Trees & Boosting','Gradient boosting algorithm','MUST_RECONSTRUCT','NOT_GIVEN',
    ['מתחילים ממודל התחלתי','מחשבים pseudo-residuals כ-negative gradient','מתאימים weak learner ל-pseudo-residuals','מעדכנים את F בעזרת learning rate','חוזרים M פעמים'],
    'Gradient boosting הוא gradient descent במרחב הפונקציות.');

  // 13. MLP / Backprop
  F('mlp_forward','MLP / Backpropagation','Dense layer forward','MUST_RECALL','NOT_GIVEN',
    String.raw`z^{(l)}=W^{(l)}a^{(l-1)}+b^{(l)},\qquad a^{(l)}=\phi(z^{(l)})`,
    [String.raw`z^{(l)}=W^{(l)}a^{(l-1)}+b^{(l)}`,String.raw`a^{(l)}=\phi(z^{(l)})`],
    'הסימון מופיע לאורך חומר ה-MLP וה-backprop.', {family:'backprop'});
  F('mlp_relu','MLP / Backpropagation','ReLU','UNDERSTAND','GIVEN',
    String.raw`\operatorname{ReLU}(z)=\max(0,z)`, [String.raw`\max(0,z)`], 'ReLU עצמה נתונה בדף הרשמי.', {family:'activations'});
  F('mlp_sigmoid_deriv','MLP / Backpropagation','Sigmoid derivative','UNDERSTAND','GIVEN',
    String.raw`\sigma'(z)=\sigma(z)(1-\sigma(z))`, [String.raw`\sigma(z)`,String.raw`(1-\sigma(z))`], 'הנגזרת נתונה בדף הרשמי.', {family:'activations'});
  F('mlp_delta','MLP / Backpropagation','Backprop delta recurrence','MUST_RECALL','NOT_GIVEN',
    String.raw`\delta^{(l-1)}=((W^{(l)})^T\delta^{(l)})\odot\phi'(z^{(l-1)})`,
    [String.raw`(W^{(l)})^T`,String.raw`\delta^{(l)}`,String.raw`\odot`,String.raw`\phi'(z^{(l-1)})`],
    'הגרדיאנט זורם אחורה דרך transpose של W ואז דרך נגזרת האקטיבציה.', {family:'backprop'});
  F('mlp_gradw','MLP / Backpropagation','Weight gradient in a dense layer','MUST_RECALL','NOT_GIVEN',
    String.raw`\frac{\partial L}{\partial W^{(l)}}=\delta^{(l)}(a^{(l-1)})^T`,
    [String.raw`\delta^{(l)}`,String.raw`(a^{(l-1)})^T`],
    'Outer product: error signal × previous activation.', {family:'backprop'});
  A('mlp_backprop_algo','MLP / Backpropagation','Backpropagation order','MUST_RECONSTRUCT','PARTIAL',
    ['Forward pass ושמירת z,a','חישוב loss','חישוב delta בשכבת הפלט','הפצת delta אחורה עם chain rule','חישוב gradients של W,b בכל שכבה','עדכון הפרמטרים עם optimizer'],
    'הנגזרות הבסיסיות בדף; מבנה האלגוריתם לא.');

  // 14. CNN
  F('cnn_output','CNN','Convolution output size','MUST_RECALL','NOT_GIVEN',
    String.raw`H_{out}=\left\lfloor\frac{H+2P-D(K-1)-1}{S}\right\rfloor+1`,
    [String.raw`H+2P`,String.raw`-D(K-1)-1`,String.raw`/S`,String.raw`+1`],
    'אותה נוסחה לכל ציר מרחבי.', {family:'cnn'});
  F('cnn_params','CNN','Convolution parameter count','MUST_RECALL','NOT_GIVEN',
    String.raw`P_{conv}=K_hK_wC_{in}C_{out}+C_{out}`,
    [String.raw`K_hK_w`,String.raw`C_{in}`,String.raw`C_{out}`,String.raw`+C_{out}`],
    'כל filter משתרע על כל ערוצי הקלט ויש bias לכל ערוץ פלט.', {family:'cnn'});
  F('cnn_receptive','CNN','Receptive field — simple stride-1 case','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`R_L=1+L(K-1)`, [String.raw`1+`,String.raw`L`,String.raw`(K-1)`],
    'תקף במקרה הפשוט של stride 1 ללא dilation.', {family:'cnn'});
  C('cnn_weight_sharing','CNN','Weight sharing','UNDERSTAND','NOT_GIVEN',
    'מה פירוש weight sharing בקונבולוציה?', 'אותו kernel מופעל בכל המיקומים המרחביים',
    ['לכל פיקסל יש kernel נפרד','כל channel משתמש באותה activation'],
    'שיתוף משקולות מצמצם פרמטרים ומקודד equivariance להזזה.');

  // 15. Deep training
  F('deep_residual','Deep Training & Optimizers','Residual block gradient path','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`y=x+F(x;W),\qquad \frac{\partial y}{\partial x}=I+\frac{\partial F}{\partial x}`,
    [String.raw`y=x+F(x;W)`,String.raw`\partial y/\partial x=`,String.raw`I+\partial F/\partial x`],
    'ה-I נותן מסלול ישיר לגרדיאנט.', {family:'deep-training'});
  F('deep_mixup','Deep Training & Optimizers','MixUp','MUST_RECALL','NOT_GIVEN',
    String.raw`\lambda\sim\operatorname{Beta}(\alpha,\alpha),\quad \tilde x=\lambda x_i+(1-\lambda)x_j,\quad \tilde y=\lambda y_i+(1-\lambda)y_j`,
    [String.raw`\lambda\sim Beta(\alpha,\alpha)`,String.raw`\tilde x=\lambda x_i+(1-\lambda)x_j`,String.raw`\tilde y=\lambda y_i+(1-\lambda)y_j`],
    'MixUp מייצר דוגמאות ותוויות אינטרפולטיביות.', {family:'regularization'});
  F('deep_momentum','Deep Training & Optimizers','Momentum','MUST_RECALL','NOT_GIVEN',
    String.raw`v_t=\gamma v_{t-1}+\eta g_t,\qquad \theta\leftarrow\theta-v_t`,
    [String.raw`v_t=\gamma v_{t-1}`,String.raw`+\eta g_t`,String.raw`\theta\leftarrow\theta-v_t`],
    'Momentum צובר כיוון תנועה.', {family:'optimizers'});
  F('deep_adagrad','Deep Training & Optimizers','AdaGrad','MUST_RECALL','NOT_GIVEN',
    String.raw`c_{t,i}=c_{t-1,i}+g_{t,i}^2,\qquad \theta_{t+1,i}=\theta_{t,i}-\frac{\eta g_{t,i}}{\sqrt{c_{t,i}}+\varepsilon}`,
    [String.raw`c_{t,i}=c_{t-1,i}+g_{t,i}^2`,String.raw`\theta_{t+1,i}=\theta_{t,i}`,String.raw`-\eta g_{t,i}/(\sqrt{c_{t,i}}+\varepsilon)`],
    'הצטברות ריבועי גרדיאנטים מקטינה את learning rate האפקטיבי לכל פרמטר.', {family:'optimizers'});
  F('deep_adam','Deep Training & Optimizers','Adam moments','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`m_t=\beta_1m_{t-1}+(1-\beta_1)g_t,\quad v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2`,
    [String.raw`m_t=\beta_1m_{t-1}+(1-\beta_1)g_t`,String.raw`v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2`],
    'Adam משלב EMA של המומנט הראשון והשני.', {family:'optimizers'});
  F('deep_bn','Deep Training & Optimizers','BatchNorm transform','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\hat x=\frac{x-\mu_B}{\sqrt{\sigma_B^2+\varepsilon}},\qquad y=\gamma\hat x+\beta`,
    [String.raw`(x-\mu_B)`,String.raw`/\sqrt{\sigma_B^2+\varepsilon}`,String.raw`\gamma\hat x+\beta`],
    'ב-CNN מחשבים סטטיסטיקה לכל channel על batch והמיקומים המרחביים; γ,β נלמדים לכל channel.', {family:'normalization'});
  C('deep_high_train_test','Deep Training & Optimizers','High train AND test error','UNDERSTAND','NOT_GIVEN',
    'גם train error וגם test error גבוהים. מה הכיוון הסביר?', 'Underfitting/optimization problem — הגדלת capacity או תיקון optimization עשויים לעזור',
    ['להוסיף regularization חזקה יותר','להוסיף dropout כדי להקטין capacity'],
    'זו בדיוק רוח שאלת מועד א׳ 2026: יותר filters או learning-rate מתאים עשויים לעזור; regularization לרוב לא.');

  // 16. PCA
  F('pca_mean','PCA','Centering mean','MUST_RECALL','NOT_GIVEN',
    String.raw`\bar x=\frac1n\sum_{i=1}^n x_i,\qquad \tilde x_i=x_i-\bar x`,
    [String.raw`\bar x=\frac1n\sum_i x_i`,String.raw`\tilde x_i=x_i-\bar x`],
    'אחרי מרכוז, Σ_i \tilde x_i=0.', {family:'pca'});
  F('pca_cov','PCA','Sample covariance (course notation)','MUST_RECALL','NOT_GIVEN',
    String.raw`C=\frac1nX^TX`, [String.raw`\frac1n`,String.raw`X^T`,String.raw`X`],
    'כאשר שורות X הן דוגמאות ממורכזות.', {family:'pca'});
  F('pca_problem','PCA','PCA reconstruction objective','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`V^*=\arg\min_{V^TV=I_r}\sum_{i=1}^n\|VV^Tx_i-x_i\|_2^2`,
    [String.raw`\arg\min_{V^TV=I_r}`,String.raw`\sum_i`,String.raw`\|VV^Tx_i-x_i\|_2^2`],
    'מחפשים תת-מרחב אורתונורמלי מממד r שממזער reconstruction error.', {family:'pca'});
  F('pca_solution','PCA','PCA solution','MUST_RECALL','NOT_GIVEN',
    String.raw`V^*=[u_1,\ldots,u_r]\quad\text{for the top eigenvectors of }C`,
    [String.raw`V^*=`,String.raw`[u_1,\ldots,u_r]`,String.raw`\text{ top eigenvectors}`],
    'ממיינים eigenvalues בסדר יורד ולוקחים את הווקטורים המתאימים.', {family:'pca'});
  F('pca_encode','PCA','PCA encode/decode','MUST_RECALL','NOT_GIVEN',
    String.raw`a=V^Tx,\qquad x'=Va=VV^Tx`,
    [String.raw`a=V^Tx`,String.raw`x'=Va`,String.raw`=VV^Tx`],
    'לנתון לא ממורכז משתמשים ב-x−x̄ ומחזירים x̄ בדקודר.', {family:'pca'});
  F('pca_error','PCA','PCA reconstruction error','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\frac1n\sum_i\|x_i-VV^Tx_i\|_2^2=\sum_{j=r+1}^d\lambda_j`,
    [String.raw`\frac1n\sum_i\|x_i-VV^Tx_i\|^2`,String.raw`=`,String.raw`\sum_{j=r+1}^d\lambda_j`],
    'השגיאה היא סכום השונות בכיוונים שנזרקו.', {family:'pca'});
  A('pca_algo','PCA','PCA algorithm','MUST_RECONSTRUCT','NOT_GIVEN',
    ['מחשבים mean וממרכזים','מחשבים covariance C','מבצעים eigendecomposition','ממיינים eigenvalues יורד','בוחרים r eigenvectors מובילים','מקרינים עם V^T'],
    'אלגוריתם PCA לפי סימוני ההרצאה/תרגול.');

  // 17. Clustering / GMM / EM
  F('km_obj','Clustering / GMM / EM','K-means objective','MUST_RECALL','NOT_GIVEN',
    String.raw`J(\mu,r)=\sum_{i=1}^n\sum_{j=1}^K r_{ij}\|x_i-\mu_j\|_2^2,\quad r_{ij}\in\{0,1\},\ \sum_j r_{ij}=1`,
    [String.raw`\sum_i\sum_j`,String.raw`r_{ij}`,String.raw`\|x_i-\mu_j\|_2^2`,String.raw`\sum_jr_{ij}=1`],
    'Formal setup של K-means.', {family:'kmeans'});
  F('km_assign','Clustering / GMM / EM','K-means assignment step','MUST_RECALL','NOT_GIVEN',
    String.raw`j_i^*=\arg\min_j\|x_i-\mu_j\|_2^2`,
    [String.raw`\arg\min_j`,String.raw`\|x_i-\mu_j\|_2^2`],
    'כל נקודה משויכת למרכז הקרוב ביותר.', {family:'kmeans'});
  F('km_update','Clustering / GMM / EM','K-means centroid update','MUST_RECALL','NOT_GIVEN',
    String.raw`\mu_j=\frac{\sum_i r_{ij}x_i}{\sum_i r_{ij}}`,
    [String.raw`\sum_i r_{ij}x_i`,String.raw`/`,String.raw`\sum_i r_{ij}`],
    'אם המכנה אפס מתקבל empty cluster והעדכון אינו מוגדר.', {family:'kmeans'});
  A('km_convergence','Clustering / GMM / EM','K-means convergence proof skeleton','MUST_RECONSTRUCT','NOT_GIVEN',
    ['עם μ קבועים, assignment step ממזער J ביחס ל-r','עם r קבועים, update step ממזער J ביחס ל-μ','לכן J אינו עולה','יש מספר סופי של assignments','מכאן האלגוריתם נעצר בנקודה מקומית/קבועה'],
    'הוכחת המונוטוניות היא alternating minimization.');
  T('km_triangle','Clustering / GMM / EM','Triangle-inequality pruning','MUST_RECONSTRUCT','NOT_GIVEN',
    [String.raw`d(x,\mu_a)\text{ known}`,String.raw`d(\mu_a,\mu_b)>2d(x,\mu_a)`],
    String.raw`d(x,\mu_b)>d(x,\mu_a)`,
    'Reverse triangle inequality: d(x,μ_b)≥d(μ_a,μ_b)−d(x,μ_a). אם זה כבר גדול מ-d(x,μ_a), אין צורך לחשב.',
    {proofSteps:['מתחילים מ-d(μ_a,μ_b)≤d(μ_a,x)+d(x,μ_b)','מחסרים d(x,μ_a)','מקבלים lower bound ל-d(x,μ_b)','דורשים שה-lower bound יהיה גדול מהמרחק הידוע']});
  F('gmm_density','Clustering / GMM / EM','GMM density','MUST_RECALL','NOT_GIVEN',
    String.raw`p(x_i\mid\theta)=\sum_{k=1}^K\pi_k\,\mathcal N(x_i\mid\mu_k,\Sigma_k)`,
    [String.raw`\sum_{k=1}^K`,String.raw`\pi_k`,String.raw`\mathcal N(x_i\mid\mu_k,\Sigma_k)`],
    'π_k הם mixture weights / priors על component.', {family:'gmm'});
  F('gmm_resp','Clustering / GMM / EM','EM responsibility','MUST_RECALL','NOT_GIVEN',
    String.raw`\gamma_{ik}=\frac{\pi_k\mathcal N(x_i\mid\mu_k,\Sigma_k)}{\sum_{j=1}^K\pi_j\mathcal N(x_i\mid\mu_j,\Sigma_j)}`,
    [String.raw`\pi_k\mathcal N(x_i\mid\mu_k,\Sigma_k)`,String.raw`/`,String.raw`\sum_j\pi_j\mathcal N(x_i\mid\mu_j,\Sigma_j)`],
    'γ_ik הוא posterior responsibility אחרי צפייה ב-x_i; π_k הוא prior mixture weight.', {family:'gmm'});
  F('gmm_m_mu','Clustering / GMM / EM','GMM M-step mean','MUST_RECALL','NOT_GIVEN',
    String.raw`\mu_k\leftarrow\frac{\sum_i\gamma_{ik}x_i}{\sum_i\gamma_{ik}}`,
    [String.raw`\sum_i\gamma_{ik}x_i`,String.raw`/\sum_i\gamma_{ik}`],
    'ממוצע משוקלל לפי responsibilities.', {family:'gmm'});
  F('gmm_m_pi','Clustering / GMM / EM','GMM M-step mixture weight','MUST_RECALL','NOT_GIVEN',
    String.raw`\pi_k\leftarrow\frac1n\sum_i\gamma_{ik}`,
    [String.raw`\frac1n`,String.raw`\sum_i\gamma_{ik}`],
    'המשקל הוא fraction האפקטיבי של נקודות ברכיב.', {family:'gmm'});
  T('gmm_boundary','Clustering / GMM / EM','When is a GMM boundary linear?','UNDERSTAND','NOT_GIVEN',
    ['לשני הרכיבים אותה covariance matrix'],
    'האיברים הריבועיים ב-x מתבטלים והגבול בין הציונים לינארי',
    'עם covariances שונות הגבול בדרך כלל ריבועי; K-means נותן Voronoi לינארי בזוגות.', {conditionDistractors:['לכל הרכיבים אותו mean','כל π_k שווים בלבד']});
  A('gmm_em_algo','Clustering / GMM / EM','EM for GMM','MUST_RECONSTRUCT','NOT_GIVEN',
    ['מאתחלים π,μ,Σ','E-step: מחשבים γ_ik','M-step: מעדכנים μ_k','מעדכנים Σ_k','מעדכנים π_k','עוצרים כששינוי log-likelihood קטן'],
    'EM אינו מוריד את ה-log-likelihood בכל איטרציה.');

  // 18. Autoencoders / SSL
  F('ae_obj','Autoencoders / Self-Supervised','Autoencoder reconstruction loss','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`L_{AE}=\frac1n\sum_i\|x_i-g_\phi(f_\theta(x_i))\|_2^2`,
    [String.raw`x_i`,String.raw`-g_\phi(f_\theta(x_i))`,String.raw`\|\cdot\|_2^2`],
    'Encoder fθ, decoder gφ.', {family:'autoencoder'});
  F('dae_obj','Autoencoders / Self-Supervised','Denoising autoencoder','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\tilde x\sim q(\tilde x\mid x),\qquad L=\|x-g_\phi(f_\theta(\tilde x))\|_2^2`,
    [String.raw`\tilde x\sim q(\tilde x\mid x)`,String.raw`\|x-g_\phi(f_\theta(\tilde x))\|^2`],
    'משחיתים את הקלט אך משחזרים את המקור הנקי.', {family:'autoencoder'});
  A('ssl_simclr','Autoencoders / Self-Supervised','SimCLR training step','MUST_RECONSTRUCT','NOT_GIVEN',
    ['יוצרים שתי augmentations לכל דוגמה','מעבירים ב-encoder','מעבירים ב-projection head','מחשבים contrastive loss בין positive pairs מול שאר ה-batch','backprop ומעדכנים'],
    'ה-data עצמו מספק את supervision דרך augmentations.');

  // 19. Diffusion
  F('diff_forward','Diffusion','Forward diffusion transition','MUST_RECALL','NOT_GIVEN',
    String.raw`q(x_t\mid x_{t-1})=\mathcal N(\sqrt{1-\beta_t}\,x_{t-1},\beta_t I)`,
    [String.raw`\mathcal N(`,String.raw`\sqrt{1-\beta_t}\,x_{t-1}`,String.raw`,\beta_t I)`],
    'ה-forward process קבוע ומוסיף Gaussian noise.', {family:'diffusion'});
  F('diff_direct','Diffusion','Closed-form noising from x₀','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\,\varepsilon,\qquad \bar\alpha_t=\prod_{s=1}^t(1-\beta_s)`,
    [String.raw`\sqrt{\bar\alpha_t}x_0`,String.raw`+\sqrt{1-\bar\alpha_t}\varepsilon`,String.raw`\bar\alpha_t=\prod_s(1-\beta_s)`],
    'מאפשר לדגום x_t ישירות מ-x_0 בלי לבצע t צעדים.', {family:'diffusion'});
  F('diff_loss','Diffusion','Noise-prediction objective','MUST_RECALL','NOT_GIVEN',
    String.raw`L_{simple}=\mathbb E\|\varepsilon-\varepsilon_\theta(x_t,t)\|_2^2`,
    [String.raw`\mathbb E`,String.raw`\|\varepsilon-\varepsilon_\theta(x_t,t)\|_2^2`],
    'המודל לומד לנבא את הרעש שנוסף.', {family:'diffusion'});

  // 20. Word2Vec
  F('w2v_softmax','Word2Vec','Skip-gram context probability','MUST_RECALL','NOT_GIVEN',
    String.raw`P(o\mid c)=\frac{\exp(u_o^Tv_c)}{\sum_{w\in\mathcal V}\exp(u_w^Tv_c)}`,
    [String.raw`\exp(u_o^Tv_c)`,String.raw`/`,String.raw`\sum_{w\in\mathcal V}\exp(u_w^Tv_c)`],
    'לכל מילה שני embeddings: v כ-center ו-u כ-context.', {family:'word2vec', why:'ב-Skip-gram מילת המרכז c מיוצגת על ידי v_c ומילת ההקשר o על ידי u_o. המכפלה u_o^T v_c היא score של הזוג. עושים exp כדי לקבל ערך חיובי, ואז מחלקים בסכום על כל אוצר המילים כדי לקבל הסתברות שמסתכמת ל-1.'});
  F('w2v_obj','Word2Vec','Skip-gram objective','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`J=-\frac1T\sum_{t=1}^T\sum_{-m\le j\le m,\,j\ne0}\log P(w_{t+j}\mid w_t)`,
    [String.raw`-\frac1T\sum_t`,String.raw`\sum_{j\ne0}`,String.raw`\log P(w_{t+j}\mid w_t)`],
    'ממקסמים הסתברות של מילות הקשר בחלון סביב מילת המרכז.', {family:'word2vec', why:'עוברים על כל position t בקורפוס. עבור מילת המרכז w_t מסתכלים על כל מילת הקשר w_{t+j} בחלון, מחברים את log P(w_{t+j}|w_t), וממזערים את השלילי של הממוצע. לכן המודל מתוגמל כשהוא נותן הסתברות גבוהה למילים שבאמת הופיעו ליד המרכז.'});
  F('w2v_neg','Word2Vec','Negative sampling loss','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`L=-\log\sigma(u_o^Tv_c)-\sum_{k=1}^K\log\sigma(-u_{n_k}^Tv_c)`,
    [String.raw`-\log\sigma(u_o^Tv_c)`,String.raw`-\sum_k`,String.raw`\log\sigma(-u_{n_k}^Tv_c)`],
    'מחליף softmax מלא באבחנה בין positive pair ל-negatives.', {family:'word2vec', why:'במקום לנרמל softmax על כל אוצר המילים, מלמדים classifier בינארי: הזוג האמיתי (c,o) צריך לקבל sigmoid גבוה, ודוגמאות רעש n_k צריכות לקבל sigmoid נמוך. לכן יש איבר positive אחד ועוד סכום על K negatives.'});
  C('w2v_static','Word2Vec','Static vs contextual embeddings','UNDERSTAND','NOT_GIVEN',
    'מה החיסרון העיקרי של Word2Vec שהוביל ל-contextual embeddings?', 'אותה מילה מקבלת וקטור קבוע גם במשמעויות שונות',
    ['אין אפשרות לחשב cosine similarity','אי אפשר לאמן עם SGD'],
    'Transformers מייצרים representation תלוי-הקשר לכל מופע של token.');

  // 21. Transformers
  F('tr_qkv','Transformers','Q, K, V projections','MUST_RECALL','NOT_GIVEN',
    String.raw`Q=XW_Q,\qquad K=XW_K,\qquad V=XW_V`,
    [String.raw`Q=XW_Q`,String.raw`K=XW_K`,String.raw`V=XW_V`],
    'Q = what I seek; K = what I offer; V = content.', {family:'attention'});
  F('tr_attention','Transformers','Scaled dot-product attention','MUST_RECALL','NOT_GIVEN',
    String.raw`\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V`,
    [String.raw`QK^T`,String.raw`/\sqrt{d_k}`,String.raw`+M`,String.raw`\operatorname{softmax}(\cdot)V`],
    'הסקייל מונע logits גדולים מדי; M הוא mask כשצריך.', {family:'attention'});
  F('tr_mha','Transformers','Multi-head attention','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`\operatorname{MHA}=\operatorname{Concat}(head_1,\ldots,head_H)W_O`,
    [String.raw`\operatorname{Concat}(`,String.raw`head_1,\ldots,head_H`,String.raw`)W_O`],
    'כל head משתמש בהקרנות Q,K,V משלו.', {family:'attention'});
  F('tr_block','Transformers','Residual connection + Layer Normalization','MUST_RECALL','NOT_GIVEN',
    String.raw`\operatorname{Output}=\operatorname{LayerNorm}(x+\operatorname{Sublayer}(x))`,
    [String.raw`x+\operatorname{Sublayer}(x)`,String.raw`\operatorname{LayerNorm}(\cdot)`],
    'זה הניסוח שמופיע בהרצאה: Add residual ואז Layer Normalization.', {family:'transformer'});
  C('tr_ln','Transformers','Layer Normalization','MUST_RECALL','NOT_GIVEN',
    'על איזה ממד Layer Normalization מחשבת mean ו-variance בהרצאה?', 'על feature dimension, עבור כל token בנפרד',
    ['על כל ה-batch יחד','על sequence length בלבד','על כל ה-tokens וה-features יחד'],
    'זה בדיוק ההבדל המבני שמודגש בהרצאה: LayerNorm מנרמלת כל token על פני ה-features שלו.');
  C('tr_complexity','Transformers','Attention complexity','MUST_RECALL','NOT_GIVEN',
    'מה סיבוכיות הזמן של self-attention עבור אורך n וממד d?', 'O(n²d)',
    ['O(nd²)','O(n log n)','O(d²)'],
    'מטריצת attention היא n×n ולכן הזיכרון O(n²).');
  C('tr_mask','Transformers','Causal mask','UNDERSTAND','NOT_GIVEN',
    'מה עושה causal mask בדקודר?', 'מונע מ-position לראות tokens עתידיים על ידי score של −∞ לפני softmax',
    ['מוחק את ה-values','מאפס את positional encoding'],
    'כך נשמרת autoregressive causality.');

  // 22. Bias / Calibration / Fairness
  F('fair_temp','Bias / Calibration / Fairness','Temperature scaling for calibration','MUST_RECONSTRUCT','NOT_GIVEN',
    String.raw`p_k(T)=\frac{e^{z_k/T}}{\sum_j e^{z_j/T}}`,
    [String.raw`z_k/T`,String.raw`\sum_j e^{z_j/T}`],
    'Calibration post-hoc משנה confidence בלי לשנות לרוב את argmax כש-T>0.', {family:'calibration'});
  C('fair_calibration','Bias / Calibration / Fairness','Calibration definition','MUST_RECALL','NOT_GIVEN',
    'מה פירוש calibration?', 'מבין התחזיות שקיבלו confidence p, בערך fraction p אכן נכונות',
    ['כל הקבוצות מקבלות אותו positive rate','כל המחלקות מקבלות אותו threshold'],
    'Calibration עוסק בהתאמה בין confidence לתדירות אמפירית.');
  C('fair_demographic','Bias / Calibration / Fairness','Demographic parity','MUST_RECALL','NOT_GIVEN',
    'איזה תנאי מאפיין demographic parity?', 'P(Ŷ=1|A=a) זהה בין קבוצות A',
    ['TPR ו-FPR זהים בין קבוצות','P(Y=1|Ŷ=1,A) זהה'],
    'Demographic parity אינו מתנה על label האמיתי.');
  C('fair_equalized','Bias / Calibration / Fairness','Equalized odds','MUST_RECALL','NOT_GIVEN',
    'איזה תנאי מאפיין equalized odds?', 'Ŷ בלתי תלוי ב-A בהינתן Y — בפרט TPR ו-FPR זהים בין קבוצות',
    ['רק positive prediction rate זהה','רק calibration זהה'],
    'Equalized odds מתנה על label האמיתי.');
  C('fair_tradeoff','Bias / Calibration / Fairness','Fairness incompatibility intuition','UNDERSTAND','NOT_GIVEN',
    'כאשר base rates שונים בין קבוצות, מה עלול לקרות?', 'אי אפשר בדרך כלל לקיים בו-זמנית כמה קריטריוני fairness חזקים כגון calibration ו-equalized odds',
    ['כל fairness metrics נעשים שקולים','temperature scaling פותר את הבעיה'],
    'הקורס מדגיש trade-offs בין הגדרות הוגנות שונות.');

  // Official formula sheet reference items — exact GIVEN coverage
  const officialGiven = new Set([
    'math_bayes','math_gaussian','reg_mse','lin_sigmoid','mlp_relu','mlp_sigmoid_deriv','softmax_formula'
  ]);
  for (const it of items) {
    if (officialGiven.has(it.id)) it.sheet='GIVEN';
    it.source = it.source || 'ML lectures.pdf / ml recitation.pdf';
    it.priority = it.memory==='MUST_RECALL' ? 3 : it.memory==='MUST_RECONSTRUCT' ? 2 : 1;
  }

  const topics = [...new Set(items.map(x=>x.topic))];
  const audit = {
    basis: 'Content restricted to concepts/results supported by ML lectures.pdf or ml recitation.pdf; formula-sheet status audited against the official 2026 appendix.',
    formulaSheetGiven: [
      'Transpose rules','Inverse-transpose','Scalar transpose','Basic vector/matrix gradients',
      'E[AX+b]','Bayes rule','Bernoulli PDF','Univariate Gaussian','Multivariate Gaussian',
      'Sigmoid + derivative','Vector sigmoid derivative','ReLU','Softmax','MSE','Binary cross-entropy'
    ],
    notes: [
      'Items marked GIVEN are fully printed in the official sheet.',
      'PARTIAL means the sheet provides ingredients but not the full course result.',
      'NOT_GIVEN means the result is absent from the official sheet and is weighted more heavily in Exam Mode.'
    ]
  };
  return {items, topics, audit};
})();
