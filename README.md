# SmartBite – Final Web Development Project

SmartBite is a smart weekly meal planning website for gluten-intolerant people.
It generates a personalized menu based on the user's schedule, budget, and dietary preferences.

## Live Website
https://verialix996.github.io/web-course-final-project-expansion/


## Project Structure

```
index.html          – Entry point (redirects to HomePage)
CSS/                – Stylesheets (one per page + shared main.css)
JS/                 – JavaScript files (one per page)
Images/             – Image assets
Includes/           – HTML pages + PHP backend files
```

## Screens

| # | File | Description |
|---|------|-------------|
| 1 | `Includes/HomePage.html` | Home page – hero section, quick actions, returning user login |
| 2 | `Includes/CreateMenu.html` | Create weekly menu – form with validations, saves to DB |
| 3 | `Includes/ViewMenu.html` | View weekly menu – 7-day view with load level selector |
| 4 | `Includes/Recipe.html` | Full recipe detail – ingredients, steps, nutrition |
| 5 | `Includes/SmartCart.html` | Smart shopping list – categorized, jQuery animated |
| 6 | `Includes/NutritionDashboard.html` | Nutrition dashboard – weekly averages, progress bars, tips |
| 7 | `Includes/WeeklyChallenges.html` | Weekly challenges – nutrition & cooking goals with progress |

## User Scenarios

**Scenario 1 – Creating a weekly menu:**
Home → CreateMenu → ViewMenu → Recipe

**Scenario 2 – Building a shopping cart:**
Home → ViewMenu → Recipe → SmartCart

## JavaScript Features

| Feature | Screens |
|---------|---------|
| Event listeners | 2, 3, 4, 5 |
| Write to element | 2, 3, 4, 5 |
| Dynamic CSS classes | 2, 3, 4, 5 |
| Read user input | 2 |
| Data passing between screens (localStorage) | 3 → 4 → 5 |
| jQuery | 5 |

## Form & Database
- Screen 2 (CreateMenu) saves to MySQL via PHP (`Includes/save_menu.php`)
- Table: `menu_preferences` in database `ronsi_smartbite`
- Run `Includes/setup.php` once to create the table

## Validations (CreateMenu form)
1. **JS** – Name: min 2 characters, letters only
2. **JS** – Budget: must be between 50–5000
3. **JS** – Dietary preferences: at least one checkbox selected
4. **HTML** – Prep time: required select field

## Animation
- CSS `fadeSlideIn` animation on the Recipe page
- jQuery `slideDown` animation on SmartCart items

## Technologies
- HTML5 (semantic tags)
- CSS3 (responsive, Flexbox, Grid, CSS variables)
- JavaScript (ES6)
- jQuery 3.7.1
- PHP 8 + MySQL (PDO)

## Persona
**Dina, 25** – Psychology student, busy schedule, gluten intolerant.
Needs quick, cheap, healthy meals without planning effort.
