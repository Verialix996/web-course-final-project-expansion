/* ===== Nutrition Dashboard – JavaScript ===== */
/* MEALS, scaleDay – loaded from menuData.js    */

// ── Build nutrition data from MEALS (single source of truth) ──────────────
let NUTRITION_DATA = [];

function mealToNutrition(meal, mealType) {
  return {
    name:      meal.name,
    mealType,
    cal:       meal.cal,
    protein:   Math.round(meal.cal * 0.25 / 4),
    carbs:     Math.round(meal.cal * 0.45 / 4),
    fat:       Math.round(meal.cal * 0.30 / 9),
    glutenFree: true
  };
}

function buildNutritionData(loadLevel) {
  if (typeof MEALS === 'undefined') return [];
  const level = MEALS[loadLevel] || MEALS.normal;
  return level.map(day => ({
    day:       day.day,
    breakfast: mealToNutrition(day.breakfast, 'ארוחת בוקר'),
    lunch:     mealToNutrition(day.lunch,     'ארוחת צהריים'),
    dinner:    mealToNutrition(day.dinner,    'ארוחת ערב')
  }));
}

// ── Daily recommendations (reference values) ──────────────────────────────
const DAILY_REF = { cal: 2000, protein: 55, carbs: 260, fat: 70 };

// ── Nutrient tips ─────────────────────────────────────────────────────────
const TIPS = {
  calories: {
    icon: '🔥',
    title: 'קלוריות יומיות',
    text: 'ממוצע הקלוריות השבועי שלך קרוב ל-1,900 קק"ל – מעט מתחת להמלצה. כדאי להוסיף חטיף בריא בין ארוחות כמו בננה או חופן אגוזים.'
  },
  protein: {
    icon: '💪',
    title: 'חלבון',
    text: 'צריכת החלבון שלך טובה! ימי הסלמון והעוף תורמים משמעותית. נסה להוסיף קטניות כמו עדשים לימי הטבעונות.'
  },
  carbs: {
    icon: '🌾',
    title: 'פחמימות',
    text: 'פחמימות מהוות כ-50% מהקלוריות שלך – בטווח הבריא. העדף פחמימות מורכבות כמו קינואה, אורז מלא ובטטה.'
  },
  fat: {
    icon: '🥑',
    title: 'שומן',
    text: 'רמת השומן בתפריט שלך נמוכה מהממוצע. שומנים בריאים חיוניים – הוסף אבוקדו, שמן זית וצנוברים לארוחות.'
  }
};

// ── Computed averages ─────────────────────────────────────────────────────
function computeAverages() {
  let totals = { cal: 0, protein: 0, carbs: 0, fat: 0 };
  NUTRITION_DATA.forEach(d => {
    ['breakfast', 'lunch', 'dinner'].forEach(m => {
      totals.cal     += d[m].cal;
      totals.protein += d[m].protein;
      totals.carbs   += d[m].carbs;
      totals.fat     += d[m].fat;
    });
  });
  const n = NUTRITION_DATA.length;
  return {
    cal:     Math.round(totals.cal     / n),
    protein: Math.round(totals.protein / n),
    carbs:   Math.round(totals.carbs   / n),
    fat:     Math.round(totals.fat     / n)
  };
}

// ── Render stat cards ─────────────────────────────────────────────────────
function renderStatCards(avg) {
  document.getElementById('avg-cal').textContent     = avg.cal.toLocaleString('he-IL');
  document.getElementById('avg-protein').textContent = avg.protein;
  document.getElementById('avg-carbs').textContent   = avg.carbs;
  document.getElementById('avg-fat').textContent     = avg.fat;
}

// ── Animate progress bars ─────────────────────────────────────────────────
function animateBars(avg) {
  const bars = [
    { id: 'bar-cal',   value: avg.cal,     ref: DAILY_REF.cal,     label: `${avg.cal.toLocaleString()} / ${DAILY_REF.cal.toLocaleString()} קק"ל` },
    { id: 'bar-prot',  value: avg.protein, ref: DAILY_REF.protein, label: `${avg.protein} / ${DAILY_REF.protein} גרם`  },
    { id: 'bar-carbs', value: avg.carbs,   ref: DAILY_REF.carbs,   label: `${avg.carbs} / ${DAILY_REF.carbs} גרם`      },
    { id: 'bar-fat',   value: avg.fat,     ref: DAILY_REF.fat,     label: `${avg.fat} / ${DAILY_REF.fat} גרם`           }
  ];

  bars.forEach(b => {
    const el    = document.getElementById(b.id);
    const numEl = el.closest('.progress-item').querySelector('.prog-nums');
    if (numEl) numEl.textContent = b.label;
    const pct = Math.min((b.value / b.ref) * 100, 100);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { el.style.width = pct + '%'; });
    });
  });
}

// ── Build meal detail HTML for expandable row ─────────────────────────────
function buildMealDetail(dayData) {
  const meals = ['breakfast', 'lunch', 'dinner'];
  const inner = meals.map(m => {
    const meal = dayData[m];
    return `
      <div class="detail-meal">
        <strong>${meal.mealType}</strong>
        <div style="font-weight:600;color:var(--dark);margin-bottom:4px;font-size:0.85rem">${meal.name}</div>
        <div class="meal-macros">
          <span>🔥 ${meal.cal} קק"ל</span>
          <span>💪 ${meal.protein}ג' חלבון</span>
          <span>🌾 ${meal.carbs}ג' פחמימות</span>
          <span>🥑 ${meal.fat}ג' שומן</span>
        </div>
      </div>`;
  }).join('');
  return `<div class="detail-meals">${inner}</div>`;
}

// ── Build day-by-day table ────────────────────────────────────────────────
function buildTable() {
  const tbody = document.getElementById('day-tbody');
  NUTRITION_DATA.forEach((d, i) => {
    const dayTotal = d.breakfast.cal + d.lunch.cal + d.dinner.cal;
    const dayProt  = d.breakfast.protein + d.lunch.protein + d.dinner.protein;
    const dayCarbs = d.breakfast.carbs   + d.lunch.carbs   + d.dinner.carbs;
    const dayFat   = d.breakfast.fat     + d.lunch.fat     + d.dinner.fat;

    const row = document.createElement('tr');
    row.className = 'day-row';
    row.dataset.index = i;
    row.innerHTML = `
      <td>${d.day} <i class="expand-icon">▼</i></td>
      <td>${dayTotal.toLocaleString('he-IL')}</td>
      <td>${dayProt}ג'</td>
      <td>${dayCarbs}ג'</td>
      <td>${dayFat}ג'</td>`;
    tbody.appendChild(row);

    const detailRow = document.createElement('tr');
    detailRow.className = 'detail-row';
    const detailTd = document.createElement('td');
    detailTd.colSpan = 5;
    const detailInner = document.createElement('div');
    detailInner.className = 'detail-inner';
    detailTd.appendChild(detailInner);
    detailRow.appendChild(detailTd);
    tbody.appendChild(detailRow);

    row.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');
      document.querySelectorAll('.day-row.open').forEach(r => {
        r.classList.remove('open');
        r.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        row.classList.add('open');
        detailRow.classList.add('open');
        detailInner.innerHTML = buildMealDetail(d);
      }
    });
  });
}

// ── Nutrient tips init ────────────────────────────────────────────────────
function initTips() {
  const btns   = document.querySelectorAll('.nutrient-btn');
  const tipBox = document.getElementById('tip-box');

  function showTip(key) {
    const tip = TIPS[key];
    tipBox.classList.add('fading');
    setTimeout(() => {
      tipBox.innerHTML = `
        <span class="tip-icon">${tip.icon}</span>
        <div class="tip-title">${tip.title}</div>
        <div class="tip-text">${tip.text}</div>`;
      tipBox.classList.remove('fading');
    }, 200);
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showTip(btn.dataset.nutrient);
    });
  });

  if (btns.length) {
    btns[0].classList.add('active');
    showTip(btns[0].dataset.nutrient);
  }
}

// ── Render GF meal cards ──────────────────────────────────────────────────
function renderGFCards() {
  const container = document.getElementById('gf-grid');
  NUTRITION_DATA.forEach(d => {
    ['breakfast', 'lunch', 'dinner'].forEach(m => {
      const meal = d[m];
      const badge = meal.glutenFree
        ? `<span class="gf-badge">✓ ללא גלוטן</span>`
        : `<span class="gf-badge-no">מכיל גלוטן</span>`;
      const card = document.createElement('article');
      card.className = 'gf-card';
      card.innerHTML = `
        <p class="gf-day">${d.day}</p>
        <p class="gf-meal-type">${meal.mealType}</p>
        <h3>${meal.name}</h3>
        ${badge}
        <p class="gf-cal">🔥 ${meal.cal} קק"ל</p>`;
      container.appendChild(card);
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const prefs = JSON.parse(localStorage.getItem('menuPrefs') || 'null');

  if (!prefs) return; // no session – noMenuState stays visible

  NUTRITION_DATA = buildNutritionData(prefs.load_level || 'normal');

  document.getElementById('noMenuState').style.display  = 'none';
  document.getElementById('dashContent').style.display  = 'block';

  const avg = computeAverages();
  renderStatCards(avg);
  animateBars(avg);
  buildTable();
  initTips();
  renderGFCards();
});
