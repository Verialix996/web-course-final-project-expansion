/* ===== userSession.js – shared header user greeting ===== */

document.addEventListener('DOMContentLoaded', () => {
    const prefs = JSON.parse(localStorage.getItem('menuPrefs') || 'null');
    const el = document.getElementById('headerUser');
    if (!el) return;
    if (prefs && prefs.user_name) {
        el.innerHTML = `שלום, <strong>${prefs.user_name}</strong> · <a href="#" onclick="logoutUser(event)" class="header-logout">יציאה</a>`;
        el.style.display = 'inline-flex';
    }
});

function logoutUser(e) {
    e.preventDefault();
    localStorage.removeItem('menuPrefs');
    window.location.href = 'HomePage.html';
}
