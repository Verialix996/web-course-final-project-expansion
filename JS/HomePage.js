/* ===== HomePage.js ===== */

document.addEventListener('DOMContentLoaded', () => {
    const prefs = JSON.parse(localStorage.getItem('menuPrefs') || 'null');

    if (prefs && prefs.user_name) {
        showLoggedIn(prefs.user_name);
        return;
    }

    document.getElementById('welcomeBack').style.display = 'block';
});

async function loadUserMenu() {
    const name = document.getElementById('welcomeName').value.trim();
    const id   = parseInt(document.getElementById('welcomeId').value.trim(), 10);

    if (name.length < 2) {
        showResult('error', 'אנא הזן שם של לפחות 2 תווים');
        return;
    }
    if (!id || id < 1) {
        showResult('error', 'אנא הזן קוד כניסה תקין');
        return;
    }

    showResult('loading', '...מאמת פרטים');

    try {
        const res  = await fetch(`get_menu.php?name=${encodeURIComponent(name)}&id=${id}`);
        const data = await res.json();

        if (data.success && data.prefs) {
            localStorage.setItem('menuPrefs', JSON.stringify(data.prefs));
            showLoggedIn(data.prefs.user_name);
            const headerUser = document.getElementById('headerUser');
            if (headerUser) {
                headerUser.innerHTML = `שלום, <strong>${data.prefs.user_name}</strong> · <a href="#" onclick="logoutUser(event)" class="header-logout">יציאה</a>`;
                headerUser.style.display = 'inline-flex';
            }
        } else {
            showResult('error', 'שם או קוד ID שגויים. <a href="CreateMenu.html">צור תפריט חדש →</a>');
        }
    } catch (e) {
        showResult('error', 'שגיאת חיבור לשרת. נסה שנית.');
    }
}

function showLoggedIn(name) {
    const box = document.getElementById('welcomeBack');
    box.innerHTML = `
        <div class="welcome-box welcome-found">
            <span class="welcome-check">✅</span>
            <h2>ברוך הבא, <strong>${name}</strong>!</h2>
            <p>התפריט השבועי שלך נטען בהצלחה</p>
            <div class="welcome-links">
                <a href="ViewMenu.html" class="btn btn-primary">צפייה בתפריט →</a>
                <a href="NutritionDashboard.html" class="btn btn-secondary">דשבורד תזונה →</a>
            </div>
            <a href="#" onclick="logoutUser(event)" class="welcome-logout">התנתק</a>
        </div>`;
    box.style.display = 'block';
}

function showResult(type, html) {
    const result = document.getElementById('welcomeResult');
    if (!result) return;
    result.style.display = 'block';
    result.className = `welcome-result welcome-result-${type}`;
    result.innerHTML = html;
}
