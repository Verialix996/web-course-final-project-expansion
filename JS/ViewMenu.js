/* ===== ViewMenu.js ===== */
/* MEALS, QUICK_ALTS, PREP_MAX, scaleDay loaded from menuData.js */

/* ===== מצב הדף ===== */
let currentLoad    = 'normal';
let currentDayIdx  = 0;
let currentPrepMax = 999; // דקות מקסימום להכנה

/* ===== אתחול ===== */
function init() {
    const prefs = JSON.parse(localStorage.getItem('menuPrefs') || 'null');

    if (!prefs) return; // no session – emptyMenuState stays visible

    document.getElementById('emptyMenuState').style.display = 'none';
    document.getElementById('menuContent').style.display    = 'block';

    if (prefs.load_level) currentLoad = prefs.load_level;

    // קרא העדפת זמן הכנה
    if (prefs.prep_time) currentPrepMax = PREP_MAX[prefs.prep_time] ?? 999;

    // הצג שם משתמש
    if (prefs.user_name) {
        const greeting = document.getElementById('userGreeting');
        if (greeting) greeting.textContent = `שלום ${prefs.user_name}! (העדפת הכנה: עד ${currentPrepMax === 999 ? 'ללא הגבלה' : currentPrepMax + ' דק\''})`;
    }

    renderLoadButtons();
    renderDaysTabs();
    renderMeals();
}

/* ===== כפתורי עצימות (עיצוב דינמי) ===== */
function renderLoadButtons() {
    document.querySelectorAll('.load-btn').forEach(btn => {
        const level = btn.dataset.level;
        btn.className = 'load-btn' + (level === currentLoad ? ` active-${level}` : '');
    });

    // עדכון המחלקה של לוח הארוחות
    const panel = document.getElementById('mealsPanel');
    if (panel) panel.className = `meals-panel load-${currentLoad}`;
}

document.querySelectorAll('.load-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        currentLoad = this.dataset.level;
        renderLoadButtons();
        renderMeals();
    });
});

/* ===== טאבים של ימים ===== */
function renderDaysTabs() {
    const tabs = document.getElementById('daysTabs');
    if (!tabs) return;
    tabs.innerHTML = '';

    MEALS.easy.forEach((d, i) => {
        const btn = document.createElement('button');
        btn.className = 'day-tab' + (i === currentDayIdx ? ' active' : '');
        btn.textContent = d.day;
        btn.addEventListener('click', () => selectDay(i));
        tabs.appendChild(btn);
    });
}

/* --- 1. אירוע: לחיצה על יום --- */
function selectDay(idx) {
    currentDayIdx = idx;

    // עדכון טאבים (עיצוב דינמי עם מחלקות)
    document.querySelectorAll('.day-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === idx);
    });

    renderMeals();
}

/* ===== הצגת ארוחות ===== */
function renderMeals() {
    const data = MEALS[currentLoad][currentDayIdx];
    const panel = document.getElementById('mealsPanel');
    if (!panel) return;

    // כתיבה לאלמנט: כותרת יום ועצימות
    const badge     = document.getElementById('loadBadge');
    const calValue  = document.getElementById('calValue');
    const calBarFill = document.getElementById('calBarFill');

    if (badge) {
        const labels = { easy: 'יום קל', normal: 'יום רגיל', intense: 'יום אינטנסיבי' };
        badge.textContent = labels[currentLoad];
        badge.className = `load-badge ${currentLoad}`;
    }

    // כתיבה לאלמנט: קלוריות יומיות
    if (calValue) calValue.textContent = `${data.calories} קק"ל`;
    if (calBarFill) {
        const pct = Math.min((data.calories / 2500) * 100, 100);
        calBarFill.style.width = pct + '%';
        calBarFill.style.background = currentLoad === 'intense' ? '#e74c3c'
                                    : currentLoad === 'normal'  ? '#f39c12'
                                    : '#2ecc71';
    }

    // בניית כרטיסי הארוחות – החלף ארוחה שחורגת מזמן ההכנה המועדף
    const grid = document.getElementById('mealsGrid');
    if (!grid) return;

    const meals = [
        { type: 'ארוחת בוקר',   emoji: '🌅', data: data.breakfast, slot: 'breakfast' },
        { type: 'ארוחת צהריים', emoji: '☀️', data: data.lunch,     slot: 'lunch' },
        { type: 'ארוחת ערב',    emoji: '🌙', data: data.dinner,    slot: 'dinner' }
    ];

    // החלף ארוחות שחורגות מהגבלת הזמן
    const resolvedMeals = meals.map(m => {
        if (m.data.mins > currentPrepMax && QUICK_ALTS[m.slot]) {
            return { ...m, data: QUICK_ALTS[m.slot], swapped: true };
        }
        return { ...m, swapped: false };
    });

    grid.innerHTML = resolvedMeals.map((m, i) => `
        <article class="meal-card" onclick="goToRecipe(${currentDayIdx},${i},${m.swapped})">
            <span class="meal-type">${m.emoji} ${m.type}</span>
            ${m.swapped ? '<span style="font-size:0.75rem;color:var(--primary);font-weight:bold">⚡ הותאם לזמן הכנה שלך</span>' : ''}
            <h3>${m.data.name}</h3>
            <p>${m.data.desc}</p>
            <div class="meal-meta">
                <span>⏱ ${m.data.time}</span>
                <span>🔥 ${m.data.cal} קק"ל</span>
            </div>
            <span class="click-hint">לחץ לצפייה במתכון המלא ←</span>
        </article>
    `).join('');
}

/* ===== העברת נתונים בין מסכים (localStorage) ===== */
function goToRecipe(dayIdx, mealIdx, swapped) {
    const data   = MEALS[currentLoad][dayIdx];
    const slots  = ['breakfast', 'lunch', 'dinner'];
    const types  = ['ארוחת בוקר', 'ארוחת צהריים', 'ארוחת ערב'];
    const orig   = [data.breakfast, data.lunch, data.dinner][mealIdx];
    const meal   = (swapped && QUICK_ALTS[slots[mealIdx]]) ? QUICK_ALTS[slots[mealIdx]] : orig;

    localStorage.setItem('currentRecipe', JSON.stringify({
        ...meal,
        mealType: types[mealIdx],
        day:      data.day
    }));

    window.location.href = 'Recipe.html';
}

/* ===== הפעלה ===== */
init();
