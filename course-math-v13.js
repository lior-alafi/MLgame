(()=>{
'use strict';
const B=window.ML_BANK;if(!B)return;
const upsert=x=>{const old=B.items.find(y=>y.id===x.id);if(old)Object.assign(old,x);else B.items.push(x);};
const F=(id,topic,title,memory,sheet,formula,parts,explanation,extra={})=>upsert({id,topic,title,memory,sheet,kind:'formula',formula,parts,explanation,source:'ML lectures.pdf / ml recitation.pdf',priority:memory==='MUST_RECALL'?3:memory==='MUST_RECONSTRUCT'?2:1,...extra});
const D=(id,topic,title,memory,sheet,definitionParts,explanation,extra={})=>upsert({id,topic,title,memory,sheet,kind:'definition',definitionParts,explanation,source:'ML lectures.pdf / ml recitation.pdf',priority:memory==='MUST_RECALL'?3:2,...extra});

F('est_beta_post','Parameter Estimation','Beta–Bernoulli posterior','MUST_RECALL','NOT_GIVEN',
  String.raw`\theta\mid S_n\sim\operatorname{Beta}\!\left(\alpha+k,\;\beta+n-k\right)`,
  [String.raw`\theta\mid S_n\sim`,String.raw`\operatorname{Beta}\!\left(\alpha+k,\;\beta+n-k\right)`],
  'k successes and n−k failures are added to the Beta pseudo-counts.',
  {family:'conjugate',fullContext:{intro:'Bernoulli likelihood with a Beta prior is conjugate.',steps:[
    {label:'Likelihood',tex:String.raw`p(S_n\mid\theta)=\theta^k(1-\theta)^{n-k}`},
    {label:'Prior',tex:String.raw`p(\theta)\propto\theta^{\alpha-1}(1-\theta)^{\beta-1}`},
    {label:'Posterior kernel',tex:String.raw`p(\theta\mid S_n)\propto\theta^{\alpha+k-1}(1-\theta)^{\beta+n-k-1}`},
    {label:'Identify family',tex:String.raw`\theta\mid S_n\sim\operatorname{Beta}(\alpha+k,\beta+n-k)`}
  ]}});

F('est_gamma_post','Parameter Estimation','Gamma–Exponential posterior (shape-rate)','MUST_RECONSTRUCT','NOT_GIVEN',
  String.raw`\theta\mid S_n\sim\operatorname{Gamma}\!\left(\alpha+n,\;\beta+\sum_{i=1}^n x_i\right)`,
  [String.raw`\theta\mid S_n\sim`,String.raw`\operatorname{Gamma}\!\left(\alpha+n,\;\beta+\sum_{i=1}^n x_i\right)`],
  'In the shape-rate convention, every observation adds 1 to shape and the waiting-time sum is added to rate.',
  {family:'conjugate',fullContext:{intro:'For x_i|θ ~ Exp(θ), θ is the rate. The course/book use Gamma(shape α, rate β).',steps:[
    {label:'Exponential density',tex:String.raw`p(x_i\mid\theta)=\theta e^{-\theta x_i},\qquad \theta>0`},
    {label:'i.i.d. likelihood',tex:String.raw`p(S_n\mid\theta)=\theta^n\exp\!\left(-\theta\sum_{i=1}^n x_i\right)`},
    {label:'Gamma prior kernel',tex:String.raw`p(\theta)\propto\theta^{\alpha-1}e^{-\beta\theta}`},
    {label:'Multiply and collect terms',tex:String.raw`p(\theta\mid S_n)\propto\theta^{n+\alpha-1}e^{-\theta(\beta+\sum_i x_i)}`},
    {label:'Posterior',tex:String.raw`\theta\mid S_n\sim\operatorname{Gamma}\!\left(\alpha+n,\beta+\sum_i x_i\right)`}
  ]}});

F('est_beta_density','Parameter Estimation','Beta density','MUST_RECALL','NOT_GIVEN',String.raw`p(\theta)=\frac{1}{B(\alpha,\beta)}\theta^{\alpha-1}(1-\theta)^{\beta-1},\quad0<\theta<1`,[String.raw`\frac{1}{B(\alpha,\beta)}`,String.raw`\theta^{\alpha-1}(1-\theta)^{\beta-1}`],'Beta is a distribution over probabilities and is used as a prior for Bernoulli.',{family:'conjugate'});
F('est_beta_norm','Parameter Estimation','Beta normalization constant','MUST_RECONSTRUCT','NOT_GIVEN',String.raw`B(\alpha,\beta)=\int_0^1u^{\alpha-1}(1-u)^{\beta-1}du=\frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)}`,[String.raw`B(\alpha,\beta)=`,String.raw`\int_0^1u^{\alpha-1}(1-u)^{\beta-1}du`,String.raw`=\frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)}`],'The normalization makes the Beta density integrate to one.',{family:'conjugate'});
F('est_beta_mean','Parameter Estimation','Beta mean','MUST_RECALL','NOT_GIVEN',String.raw`\mathbb E[\theta]=\frac{\alpha}{\alpha+\beta}`,[String.raw`\frac{\alpha}{\alpha+\beta}`],'Posterior mean under a Beta distribution.',{family:'conjugate'});
F('est_beta_var','Parameter Estimation','Beta variance','MUST_RECONSTRUCT','NOT_GIVEN',String.raw`\operatorname{Var}(\theta)=\frac{\alpha\beta}{(\alpha+\beta)^2(\alpha+\beta+1)}`,[String.raw`\alpha\beta`,String.raw`/(\alpha+\beta)^2(\alpha+\beta+1)`],'Variance of Beta(shape α,β).',{family:'conjugate'});
F('est_beta_mode','Parameter Estimation','Beta mode / MAP','MUST_RECALL','NOT_GIVEN',String.raw`\theta_{mode}=\frac{\alpha-1}{\alpha+\beta-2}\qquad(\alpha,\beta>1)`,[String.raw`\frac{\alpha-1}{\alpha+\beta-2}`],'The Beta mode equals MAP when the Beta is the posterior and α,β>1.',{family:'conjugate'});
F('est_bernoulli_like','Parameter Estimation','Bernoulli likelihood','MUST_RECONSTRUCT','PARTIAL',String.raw`p(S_n\mid\theta)=\prod_{i=1}^n\theta^{x_i}(1-\theta)^{1-x_i}=\theta^k(1-\theta)^{n-k}`,[String.raw`\prod_i\theta^{x_i}(1-\theta)^{1-x_i}`,String.raw`=\theta^k(1-\theta)^{n-k}`],'The Bernoulli PMF is given on the sheet; the i.i.d. likelihood and sufficient-count form are not.',{family:'conjugate'});
F('est_bernoulli_mle','Parameter Estimation','Bernoulli MLE','MUST_RECALL','NOT_GIVEN',String.raw`\hat\theta_{MLE}=\frac{k}{n},\qquad k=\sum_{i=1}^n x_i`,[String.raw`\hat\theta_{MLE}=\frac{k}{n}`,String.raw`k=\sum_i x_i`],'The MLE is the empirical success rate.',{family:'conjugate'});
F('est_gamma_density','Parameter Estimation','Gamma density (shape-rate)','MUST_RECALL','NOT_GIVEN',String.raw`p(\theta)=\frac{\beta^\alpha}{\Gamma(\alpha)}\theta^{\alpha-1}e^{-\beta\theta},\quad\theta>0`,[String.raw`\frac{\beta^\alpha}{\Gamma(\alpha)}`,String.raw`\theta^{\alpha-1}e^{-\beta\theta}`],'Course convention: α=shape, β=rate.',{family:'conjugate'});
F('est_gamma_mean_var','Parameter Estimation','Gamma mean and variance (shape-rate)','MUST_RECALL','NOT_GIVEN',String.raw`\mathbb E[\theta]=\frac{\alpha}{\beta},\qquad\operatorname{Var}(\theta)=\frac{\alpha}{\beta^2}`,[String.raw`\mathbb E[\theta]=\frac{\alpha}{\beta}`,String.raw`\operatorname{Var}(\theta)=\frac{\alpha}{\beta^2}`],'In shape-rate form the rate appears in the denominator.',{family:'conjugate'});
F('est_exp_like','Parameter Estimation','Exponential likelihood for n i.i.d. samples','MUST_RECONSTRUCT','NOT_GIVEN',String.raw`p(S_n\mid\theta)=\theta^n\exp\!\left(-\theta\sum_{i=1}^n x_i\right)`,[String.raw`\theta^n`,String.raw`\exp\!\left(-\theta\sum_i x_i\right)`],'Multiply the n exponential densities.',{family:'conjugate'});
F('est_exp_mle','Parameter Estimation','Exponential rate MLE','MUST_RECALL','NOT_GIVEN',String.raw`\hat\theta_{MLE}=\frac{n}{\sum_{i=1}^n x_i}=\frac1{\bar x}`,[String.raw`\frac{n}{\sum_i x_i}`,String.raw`=\frac1{\bar x}`],'For an exponential rate, MLE is the reciprocal sample mean.',{family:'conjugate'});
F('est_leibniz','Parameter Estimation','Leibniz integral rule','MUST_RECONSTRUCT','NOT_GIVEN',String.raw`\frac{d}{da}\int_{u(a)}^{v(a)}f(a,\theta)d\theta=f(a,v(a))v'(a)-f(a,u(a))u'(a)+\int_{u(a)}^{v(a)}\frac{\partial f(a,\theta)}{\partial a}d\theta`,[String.raw`f(a,v(a))v'(a)`,String.raw`-f(a,u(a))u'(a)`,String.raw`+\int_{u(a)}^{v(a)}\frac{\partial f}{\partial a}d\theta`],'Used when deriving the posterior median under absolute loss.',{family:'estimation'});

D('pac_realizable','PAC Learning','Realizability assumption','MUST_RECALL','NOT_GIVEN',
 [String.raw`\exists h^*\in\mathcal H`,String.raw`\operatorname{Err}_{\mathcal D}(h^*)=0`],
 'Realizable means the chosen hypothesis class contains a ground-truth hypothesis with zero true error.',
 {formula:String.raw`\exists h^*\in\mathcal H:\operatorname{Err}_{\mathcal D}(h^*)=0`,family:'pac-realizable-proof',fullContext:{intro:'Realizability is an assumption on D together with H. Version Space is a sample-dependent set; they are not the same definition.',steps:[
  {label:'Realizability',tex:String.raw`\exists h^*\in\mathcal H:\operatorname{Err}_{\mathcal D}(h^*)=0`},
  {label:'ERM',tex:String.raw`\hat h\in\arg\min_{h\in\mathcal H}\operatorname{Err}_{S_n}(h)`},
  {label:'Version Space',tex:String.raw`V(S_n)=\{h\in\mathcal H:\operatorname{Err}_{S_n}(h)=0\}`},
  {label:'Bad hypotheses',tex:String.raw`\mathcal H_{bad}(\mathcal D,\varepsilon)=\{h\in\mathcal H:\operatorname{Err}_{\mathcal D}(h)>\varepsilon\}`},
  {label:'Finite-realizable failure bound',tex:String.raw`P(\operatorname{Err}_{\mathcal D}(ERM(S_n))>\varepsilon)\le|\mathcal H|e^{-n\varepsilon}`}
 ]}});
const vs=B.items.find(x=>x.id==='pac_version_space');if(vs){vs.explanation='Version Space הוא אוסף ההשערות העקביות עם המדגם: שגיאת אימון אפס. זו אינה הגדרת realizability.';vs.fullContext=B.items.find(x=>x.id==='pac_realizable')?.fullContext;}
F('pac_agnostic_best','PAC Learning','Best-in-class hypothesis (agnostic)','MUST_RECALL','NOT_GIVEN',String.raw`h^*=\arg\min_{h\in\mathcal H}\operatorname{Err}_{\mathcal D}(h)`,[String.raw`\arg\min_{h\in\mathcal H}`,String.raw`\operatorname{Err}_{\mathcal D}(h)`],'In the agnostic case we compare to the best hypothesis available inside H.',{family:'pac-agnostic'});
F('pac_agnostic_req','PAC Learning','Agnostic PAC requirement','MUST_RECONSTRUCT','NOT_GIVEN',String.raw`P\!\left(\operatorname{Err}_{\mathcal D}(A(S_n))\le\operatorname{Err}_{\mathcal D}(h^*)+\varepsilon\right)\ge1-\delta`,[String.raw`\operatorname{Err}_{\mathcal D}(A(S_n))`,String.raw`\le\operatorname{Err}_{\mathcal D}(h^*)+\varepsilon`,String.raw`\ge1-\delta`],'No zero-error hypothesis is assumed in the agnostic setting.',{family:'pac-agnostic'});

F('reg_prediction','Regression','Linear prediction with intercept trick','MUST_RECALL','NOT_GIVEN',String.raw`\hat y=Xw`,[String.raw`\hat y=`,String.raw`Xw`],'After adding a constant 1 feature, the intercept is absorbed into w.',{family:'regression'});
F('lin_logistic_like','Linear Classifiers','Logistic/Bernoulli likelihood','MUST_RECONSTRUCT','PARTIAL',String.raw`p(y_i\mid x_i;w)=p_i^{y_i}(1-p_i)^{1-y_i},\qquad p_i=\sigma(w^Tx_i+b)`,[String.raw`p_i^{y_i}(1-p_i)^{1-y_i}`,String.raw`p_i=\sigma(w^Tx_i+b)`],'The Bernoulli and sigmoid ingredients are on the sheet; the supervised likelihood construction is not.',{family:'logistic'});
F('lin_logistic_ll','Linear Classifiers','Logistic log-likelihood','MUST_RECONSTRUCT','PARTIAL',String.raw`\log L(w)=\sum_i\left[y_i\log p_i+(1-y_i)\log(1-p_i)\right]`,[String.raw`\sum_i`,String.raw`y_i\log p_i+(1-y_i)\log(1-p_i)`],'Negative average log-likelihood is BCE.',{family:'logistic'});
F('softmax_logits','Softmax','Multiclass linear logits','MUST_RECALL','NOT_GIVEN',String.raw`z_k=w_k^Tx+b_k`,[String.raw`w_k^Tx`,String.raw`+b_k`],'Softmax regression is still linear in x before softmax.',{family:'softmax'});

F('svm_margin','SVM & Kernels','Hard-SVM margin width','MUST_RECALL','NOT_GIVEN',String.raw`\text{margin width}=\frac{2}{\|w\|_2}`,[String.raw`2`,String.raw`/\|w\|_2`],'Canonical constraints place support hyperplanes at ±1.',{family:'svm'});
F('svm_lagrangian','SVM & Kernels','Hard-margin SVM Lagrangian','MUST_RECALL','NOT_GIVEN',String.raw`\mathcal L(w,b,\alpha)=\frac12\|w\|_2^2-\sum_{i=1}^n\alpha_i\left[y_i(w^Tx_i-b)-1\right],\quad\alpha_i\ge0`,[String.raw`\frac12\|w\|_2^2`,String.raw`-\sum_i\alpha_i[y_i(w^Tx_i-b)-1]`,String.raw`\alpha_i\ge0`],'Lagrange multipliers correspond to inequality constraints.',{family:'svm'});
F('svm_stationarity_w','SVM & Kernels','SVM stationarity w','MUST_RECONSTRUCT','NOT_GIVEN',String.raw`\nabla_w\mathcal L=0\quad\Longrightarrow\quad w=\sum_i\alpha_i y_i x_i`,[String.raw`\nabla_w\mathcal L=0`,String.raw`\Longrightarrow`,String.raw`w=\sum_i\alpha_i y_i x_i`],'Stationarity expresses w as a combination of training points.',{family:'svm'});
F('svm_stationarity_b','SVM & Kernels','SVM stationarity b','MUST_RECONSTRUCT','NOT_GIVEN',String.raw`\frac{\partial\mathcal L}{\partial b}=0\quad\Longrightarrow\quad\sum_i\alpha_i y_i=0`,[String.raw`\frac{\partial\mathcal L}{\partial b}=0`,String.raw`\Longrightarrow`,String.raw`\sum_i\alpha_i y_i=0`],'This becomes the equality constraint in the dual.',{family:'svm'});
const kkt=B.items.find(x=>x.id==='svm_kkt');if(kkt){kkt.fullContext={intro:'Complementary slackness is one KKT condition. Read it together with the hard-margin primal, Lagrangian and stationarity conditions.',steps:[
 {label:'Hard-margin primal',tex:String.raw`\min_{w,b}\frac12\|w\|_2^2\quad\text{s.t.}\quad y_i(w^Tx_i-b)\ge1`},
 {label:'Constraint',tex:String.raw`g_i(w,b)=y_i(w^Tx_i-b)-1\ge0`},
 {label:'Lagrangian',tex:String.raw`\mathcal L=\frac12\|w\|_2^2-\sum_i\alpha_i g_i(w,b),\qquad\alpha_i\ge0`},
 {label:'Stationarity',tex:String.raw`w=\sum_i\alpha_i y_i x_i,\qquad\sum_i\alpha_i y_i=0`},
 {label:'Complementary slackness',tex:String.raw`\alpha_i\,[y_i(w^Tx_i-b)-1]=0`},
 {label:'Interpretation',text:'If α_i>0, the bracket must be 0, so the point lies exactly on the margin and is a support vector. If the constraint is strict, α_i=0.'},
 {label:'Dual',tex:String.raw`\max_{\alpha\ge0}\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jK(x_i,x_j),\quad\sum_i\alpha_i y_i=0`}
]};kkt.why='Complementary slackness follows from KKT for the inequality constraints. It links nonzero dual coefficients to active margin constraints.';}
F('svm_decision','SVM & Kernels','Kernel-SVM decision function','MUST_RECALL','NOT_GIVEN',String.raw`f(x)=\sum_i\alpha_i y_iK(x_i,x)-b,\qquad\hat y=\operatorname{sign}(f(x))`,[String.raw`\sum_i\alpha_i y_iK(x_i,x)`,String.raw`-b`,String.raw`\operatorname{sign}(f(x))`],'Only support vectors with nonzero α_i contribute.',{family:'svm'});

F('adaboost_final','Trees & Boosting','AdaBoost final classifier','MUST_RECALL','NOT_GIVEN',String.raw`H(x)=\operatorname{sign}\!\left(\sum_{t=1}^T\alpha_t h_t(x)\right)`,[String.raw`\operatorname{sign}`,String.raw`\sum_t\alpha_t h_t(x)`],'Weak learners are combined with learned weights α_t.',{family:'adaboost'});
F('mlp_gradb','MLP / Backpropagation','Bias gradient in a dense layer','MUST_RECALL','NOT_GIVEN',String.raw`\frac{\partial L}{\partial b^{(l)}}=\delta^{(l)}`,[String.raw`\delta^{(l)}`],'The bias enters z additively, so its Jacobian is identity.',{family:'backprop'});
F('cnn_operation','CNN','2D convolution/cross-correlation operation','MUST_RECONSTRUCT','NOT_GIVEN',String.raw`Y_{i,j,c_o}=b_{c_o}+\sum_{u=0}^{K-1}\sum_{v=0}^{K-1}\sum_{c=1}^{C_{in}}W_{u,v,c,c_o}X_{iS+u-P,jS+v-P,c}`,[String.raw`b_{c_o}`,String.raw`+\sum_u\sum_v\sum_c`,String.raw`W_{u,v,c,c_o}X_{iS+u-P,jS+v-P,c}`],'The same kernel weights are shared across spatial positions.',{family:'cnn'});
F('deep_xavier','Deep Training & Optimizers','Xavier/Glorot variance','MUST_RECALL','NOT_GIVEN',String.raw`\operatorname{Var}(W_{ij})=\frac{2}{n_{in}+n_{out}}`,[String.raw`2`,String.raw`/(n_{in}+n_{out})`],'Used to preserve signal scale for symmetric activations.',{family:'initialization'});
F('deep_he','Deep Training & Optimizers','He/Kaiming variance','MUST_RECALL','NOT_GIVEN',String.raw`\operatorname{Var}(W_{ij})=\frac{2}{n_{in}}`,[String.raw`2/n_{in}`],'Designed for ReLU-like activations.',{family:'initialization'});
F('deep_adam_hat','Deep Training & Optimizers','Adam bias correction and update','MUST_RECONSTRUCT','NOT_GIVEN',String.raw`\hat m_t=\frac{m_t}{1-\beta_1^t},\quad\hat v_t=\frac{v_t}{1-\beta_2^t},\quad\theta_{t+1}=\theta_t-\eta\frac{\hat m_t}{\sqrt{\hat v_t}+\varepsilon}`,[String.raw`\hat m_t=\frac{m_t}{1-\beta_1^t}`,String.raw`\hat v_t=\frac{v_t}{1-\beta_2^t}`,String.raw`\theta_{t+1}=\theta_t-\eta\frac{\hat m_t}{\sqrt{\hat v_t}+\varepsilon}`],'Bias correction compensates for zero initialization of the moving averages.',{family:'optimizers'});

F('pca_variance','PCA','Variance captured by a PCA direction','MUST_RECONSTRUCT','NOT_GIVEN',String.raw`\operatorname{Var}(Xv)=v^TCv\qquad(\|v\|_2=1)`,[String.raw`v^T`,String.raw`C`,String.raw`v`],'Maximizing projected variance gives the top eigenvector.',{family:'pca'});
F('pca_rayleigh','PCA','PCA eigenvalue optimization','MUST_RECONSTRUCT','NOT_GIVEN',String.raw`v_1=\arg\max_{\|v\|_2=1}v^TCv,\qquad Cv_1=\lambda_1v_1`,[String.raw`\arg\max_{\|v\|_2=1}v^TCv`,String.raw`Cv_1=\lambda_1v_1`],'The optimum is the eigenvector with the largest covariance eigenvalue.',{family:'pca'});
F('gmm_loglike','Clustering / GMM / EM','GMM marginal log-likelihood','MUST_RECALL','NOT_GIVEN',String.raw`\ell(\theta)=\sum_{i=1}^n\log\left(\sum_{k=1}^K\pi_k\mathcal N(x_i\mid\mu_k,\Sigma_k)\right)`,[String.raw`\sum_i\log`,String.raw`\left(\sum_k\pi_k\mathcal N(x_i\mid\mu_k,\Sigma_k)\right)`],'EM seeks to increase this non-convex marginal log-likelihood.',{family:'gmm'});
F('gmm_m_cov','Clustering / GMM / EM','GMM M-step covariance','MUST_RECALL','NOT_GIVEN',String.raw`\Sigma_k\leftarrow\frac{\sum_i\gamma_{ik}(x_i-\mu_k)(x_i-\mu_k)^T}{\sum_i\gamma_{ik}}`,[String.raw`\sum_i\gamma_{ik}(x_i-\mu_k)(x_i-\mu_k)^T`,String.raw`/\sum_i\gamma_{ik}`],'Responsibility-weighted covariance around the updated component mean.',{family:'gmm'});

B.topics.splice(0,B.topics.length,...new Set(B.items.map(x=>x.topic)));
window.ML_BUILD='v13';
})();
