(() => {
  'use strict';

  const BANK = window.ML_BANK;
  if (!BANK || !Array.isArray(BANK.items)) return;

  const originalItems = [...BANK.items];
  const originalPriority = new Map(originalItems.map(it => [it.id, it.priority]));
  let mathActive = false;

  function hasMathText(v) {
    const s = String(v || '');
    return /[=<>]|\\(?:frac|sum|prod|arg|max|min|mathbb|mathcal|epsilon|delta|lambda|theta|mu|sigma|nabla|ell|hat|Vert|lVert|begin)/.test(s);
  }

  function isMathItem(it) {
    if (it.kind === 'formula') return true;
    if (it.kind === 'theorem') return true;
    if (it.kind === 'algorithm' && it.isProof) return true;
    if (it.kind === 'definition' && (it.definitionParts || []).some(hasMathText)) return true;
    return false;
  }

  function boostedPriority(it) {
    let p = Number(originalPriority.get(it.id) || 1);
    if (it.memory === 'MUST_RECALL') p *= 3;
    else if (it.memory === 'MUST_RECONSTRUCT') p *= 2.2;
    else p *= 1.15;

    if (it.sheet === 'NOT_GIVEN') p *= 2.2;
    else if (it.sheet === 'PARTIAL') p *= 1.5;

    if (it.kind === 'formula') p *= 1.6;
    if (it.isProof) p *= 1.35;
    return p;
  }

  function activateMathMode() {
    if (mathActive) return;
    mathActive = true;
    const filtered = originalItems.filter(isMathItem);
    filtered.forEach(it => { it.priority = boostedPriority(it); });
    BANK.items = filtered;
    sessionStorage.setItem('ml-math-memory-active', '1');
  }

  function restoreBank() {
    if (!mathActive) return;
    originalItems.forEach(it => {
      const old = originalPriority.get(it.id);
      if (old === undefined) delete it.priority;
      else it.priority = old;
    });
    BANK.items = originalItems;
    mathActive = false;
    sessionStorage.removeItem('ml-math-memory-active');
  }

  function injectButton() {
    const grid = document.querySelector('section.grid');
    const continueBtn = document.getElementById('continue');
    if (!grid || !continueBtn || document.getElementById('mathMemoryAddon')) return;

    const btn = document.createElement('button');
    btn.className = 'home-btn';
    btn.id = 'mathMemoryAddon';
    btn.innerHTML = '<span class="emoji">🧮</span><strong>Math Memory</strong><small>אופציונלי: שינון מדויק של נוסחאות, משפטים ושלבי הוכחה — בלי לוותר על מצבי התרגול הקיימים</small>';
    btn.onclick = () => {
      activateMathMode();
      const c = document.getElementById('continue');
      if (c) c.click();
    };

    continueBtn.insertAdjacentElement('afterend', btn);
  }

  function decorateMathSession() {
    if (!mathActive) return;
    const title = document.querySelector('.topbar .title');
    if (title && !title.dataset.mathDecorated) {
      title.dataset.mathDecorated = '1';
      title.textContent = '🧮 MATH MEMORY';
    }
    const card = document.querySelector('.question-card');
    if (card && !card.querySelector('.math-memory-note')) {
      const note = document.createElement('div');
      note.className = 'q-context math-memory-note';
      note.dir = 'rtl';
      note.textContent = 'במצב הזה המטרה היא לזכור את המבנה המתמטי המדויק: סימנים, גורמים, תנאים, סדר צעדים והקשרים בין נוסחאות.';
      const badges = card.querySelector('.badges');
      if (badges) badges.insertAdjacentElement('afterend', note);
    }
  }

  function sync() {
    const hash = location.hash || '#home';
    if (hash === '#home') {
      restoreBank();
      injectButton();
    } else if (mathActive) {
      decorateMathSession();
    }
  }

  const observer = new MutationObserver(sync);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('hashchange', sync);
  window.addEventListener('load', sync);
  sync();
})();
