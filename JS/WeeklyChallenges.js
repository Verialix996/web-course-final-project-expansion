/* ===== Weekly Challenges – JavaScript ===== */

const CHALLENGES = [
  {
    id: 0,
    category: 'תזונה',
    icon: '🥦',
    title: 'ירקות ×5 ביום',
    desc: 'אכול לפחות 5 מנות ירקות במהלך יום אחד השבוע.'
  },
  {
    id: 1,
    category: 'תזונה',
    icon: '💧',
    title: '8 כוסות מים',
    desc: 'שתה 8 כוסות מים ביום אחד לפחות – שמור על הגוף מאוזן.'
  },
  {
    id: 2,
    category: 'תזונה',
    icon: '🥗',
    title: 'ארוחה ללא גלוטן',
    desc: 'נסה ארוחה אחת מלאה שמוגדרת ללא גלוטן מהתפריט שלך.'
  },
  {
    id: 3,
    category: 'תזונה',
    icon: '🫀',
    title: 'מתחת ל-2,000 קק"ל',
    desc: 'הישאר מתחת ל-2,000 קלוריות לאורך יום אחד שלם.'
  },
  {
    id: 4,
    category: 'בישול',
    icon: '🍳',
    title: 'ארוחת בוקר ב-15 דק\'',
    desc: 'בשל ארוחת בוקר מלאה בתוך 15 דקות בלבד – מהירות זה אמנות.'
  },
  {
    id: 5,
    category: 'בישול',
    icon: '📋',
    title: '7 ימי תפריט',
    desc: 'השלם את כל 7 הימים בתפריט השבועי שלך – ללא הזמנות חיצוניות.'
  },
  {
    id: 6,
    category: 'בישול',
    icon: '🛒',
    title: 'סל קניות מלא',
    desc: 'קנה את כל הפריטים ברשימת הקניות שלך לפני סוף השבוע.'
  },
  {
    id: 7,
    category: 'בישול',
    icon: '⭐',
    title: 'מתכון חדש',
    desc: 'נסה מתכון שלא בישלת בו לפני כן – תצא מאזור הנוחות.'
  }
];

const TOTAL = CHALLENGES.length;

// ── State ─────────────────────────────────────────────────────────────────
function loadChecked() {
  try {
    const saved = localStorage.getItem('weekChallenges');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveChecked(arr) {
  localStorage.setItem('weekChallenges', JSON.stringify(arr));
}

// ── Render cards ──────────────────────────────────────────────────────────
function renderCards(checkedIds) {
  const grid = document.getElementById('challenges-grid');
  grid.innerHTML = '';

  CHALLENGES.forEach(ch => {
    const isChecked = checkedIds.includes(ch.id);
    const card = document.createElement('article');
    card.className = 'challenge-card' + (isChecked ? ' completed' : '');
    card.dataset.id       = ch.id;
    card.dataset.category = ch.category;
    card.innerHTML = `
      <span class="challenge-icon" aria-hidden="true">${ch.icon}</span>
      <div class="challenge-body">
        <p class="challenge-category">${ch.category}</p>
        <h3 class="challenge-title">${ch.title}</h3>
        <p class="challenge-desc">${ch.desc}</p>
      </div>`;
    card.addEventListener('click', () => toggleCard(ch.id));
    grid.appendChild(card);
  });
}

// ── Toggle card ───────────────────────────────────────────────────────────
function toggleCard(id) {
  const checked = loadChecked();
  const idx = checked.indexOf(id);
  if (idx === -1) checked.push(id);
  else checked.splice(idx, 1);
  saveChecked(checked);

  // Update card class without full re-render
  const card = document.querySelector(`.challenge-card[data-id="${id}"]`);
  if (card) card.classList.toggle('completed', checked.includes(id));

  updateProgress(checked);
}

// ── Update progress bar + counter ─────────────────────────────────────────
function updateProgress(checkedIds) {
  const count   = checkedIds.length;
  const bar     = document.getElementById('challenges-progress-bar');
  const counter = document.getElementById('progress-count');
  const banner  = document.getElementById('completion-banner');

  counter.textContent = count;
  bar.style.width     = (count / TOTAL * 100) + '%';

  if (count === TOTAL) {
    banner.classList.add('visible');
  } else {
    banner.classList.remove('visible');
  }
}

// ── Filter tabs ───────────────────────────────────────────────────────────
function initFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      document.querySelectorAll('.challenge-card').forEach(card => {
        if (filter === 'הכל' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const checked = loadChecked();
  renderCards(checked);
  updateProgress(checked);
  initFilters();
});
