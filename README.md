# SmartBite – Final Web Development Project (Expansion)

SmartBite is a smart weekly meal planning website for people with busy schedules.
It generates a personalized menu based on the user's schedule, budget, and dietary preferences,
tracks nutrition, and motivates healthy habits through weekly challenges.

---

## Live Website
https://verialix996.github.io/web-course-final-project-expansion/

---

## Persona

**Name:** Dina, 25
**Status:** First-year Psychology student
**Problem:** No time to cook, spends a lot of money on food outside — especially during exam periods.
**Goals:**
- Eat healthy on a budget
- Plan meals according to weekly workload
- Get a ready-made menu and a clear shopping list

---

## Screens

| # | Screen Name | Description | File | How to reach |
|---|-------------|-------------|------|--------------|
| 1 | דף הבית (Home) | Hero section, quick actions, demo menu, returning-user login box | `Includes/HomePage.html` | Entry point / direct URL |
| 2 | יצירת תפריט (Create Menu) | Form with 4 validations (name, budget, dietary prefs, prep time), saves to DB, shows login code | `Includes/CreateMenu.html` | Home → "צור תפריט עכשיו" |
| 3 | צפייה בתפריט (View Menu) | 7-day menu, load-level selector (easy/normal/intense), calorie bar | `Includes/ViewMenu.html` | Home nav / after CreateMenu success |
| 4 | מתכון מלא (Recipe) | Full ingredients list, step-by-step instructions, nutrition values, add to cart | `Includes/Recipe.html` | ViewMenu → click any meal card |
| 5 | סל קניות (Smart Cart) | Auto shopping list grouped by category, jQuery animated, print/clear | `Includes/SmartCart.html` | Recipe → "הוסף מרכיבים לסל" / nav |
| 6 | דשבורד תזונה (Nutrition Dashboard) | Weekly macro averages, progress bars vs. daily goals, daily breakdown table, GF meals, nutrition tips | `Includes/NutritionDashboard.html` | Nav → "דשבורד תזונה" |
| 7 | אתגרי שבוע (Weekly Challenges) | 8 nutrition & cooking challenges with filter tabs, progress counter, completion banner | `Includes/WeeklyChallenges.html` | Nav → "אתגרי שבוע" |

---

## User Scenarios

**Scenario 1 – Creating a personalized weekly menu:**
Goal: get a ready menu tailored to schedule and budget.
1 → 2 → 3 → 4

**Scenario 2 – Building a shopping cart:**
Goal: generate a categorized shopping list from selected recipes.
1 → 3 → 4 → 5

**Scenario 3 – Monitoring health & staying motivated:**
Goal: track weekly nutrition progress and complete healthy-eating challenges.
1 → 6 → 7

---

## Project Folder Structure

| Folder / File | Contents |
|---------------|----------|
| `index.html` | Entry point — auto-redirects to `Includes/HomePage.html` |
| `Includes/` | All HTML pages (screens 1–7) + PHP backend files (`save_menu.php`, `get_menu.php`, `db.php`, `setup.php`) |
| `CSS/` | Stylesheets — one per page (`HomePage.css`, `ViewMenu.css`, etc.) + shared `main.css` |
| `JS/` | JavaScript files — one per page + `menuData.js` (shared meal data) + `userSession.js` (header greeting/logout) |
| `Images/` | Image assets used across the site |

---

## JavaScript Features

| Feature | Screens |
|---------|---------|
| Event listeners | 2, 3, 4, 5, 6, 7 |
| Write to element (DOM manipulation) | 2, 3, 4, 5, 6, 7 |
| Dynamic CSS classes | 2, 3, 4, 5, 6, 7 |
| Read user input | 1, 2 |
| Data passing between screens (localStorage) | 2 → 3 → 4 → 5 → 6 |
| jQuery | 5 |

---

## Form & Database

- Screen 2 (CreateMenu) saves to MySQL via PHP (`Includes/save_menu.php`)
- Screen 1 (HomePage) loads a returning user's menu via `Includes/get_menu.php` (name + DB row ID)
- Table: `menu_preferences` in database `ronsi_smartbite`
- Run `Includes/setup.php` once to create the table

## Validations (CreateMenu form)

1. **JS** – Name: min 2 characters, letters only (no digits)
2. **JS** – Budget: must be between ₪50–₪5,000
3. **JS** – Dietary preferences: at least one checkbox selected
4. **HTML** – Prep time select: `required` attribute (browser-native validation)

---

## Animation

- CSS `fadeSlideIn` keyframe animation on Recipe page hero
- jQuery `slideDown` on SmartCart item reveal

---

## Technologies

- HTML5 (semantic tags)
- CSS3 (Flexbox, Grid, CSS variables, animations)
- JavaScript ES6
- jQuery 3.7.1
- PHP 8 + MySQL (PDO)
