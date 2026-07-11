# 🍽️ What's for Dinner — Weekly Meal Planner

A premium, client-side web app that turns your available groceries into a personalized 7-day meal plan based on your favorite cuisines.

## ✨ Features

- **3 ways to add groceries:**
  - ✏️ Type manually with autocomplete suggestions
  - 📸 Scan a grocery receipt photo (OCR powered by Tesseract.js)
  - 📄 Upload a .txt, .csv, or .json file

- **12 world cuisines** — Indian, Italian, Mexican, Chinese, Japanese, Thai, Mediterranean, American, Korean, Middle Eastern, French, Southern/Soul

- **Smart meal planning** — Algorithm matches your available ingredients to 130+ curated recipes and distributes them across a 7-day × 3-meal (breakfast/lunch/dinner) grid

- **Beautiful dark-mode UI** — Glassmorphism, gradient accents, smooth animations, fully responsive

- **100% client-side** — No backend, no API keys, no data leaves your browser

## 🚀 Getting Started

### Option 1: Open directly
Simply open `index.html` in your browser:
```bash
open index.html
```

### Option 2: Use a local server (recommended for OCR)
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
```

Then visit `http://localhost:8000`

## 🏗️ Project Structure

```
├── index.html            # Single-page shell
├── css/
│   └── style.css         # Design system + responsive layout
├── js/
│   ├── app.js            # Main controller — wizard flow
│   ├── grocery-input.js  # Step 1: grocery input UI
│   ├── ocr-engine.js     # Tesseract.js OCR wrapper
│   ├── cuisine-picker.js # Step 2: cuisine selection UI
│   ├── meal-planner.js   # Step 3: planning algorithm + grid
│   └── recipe-data.js    # 130+ curated recipes
└── README.md
```

## 📝 Adding Recipes

Edit `js/recipe-data.js` and add entries to the `RECIPES` array:

```javascript
{
  id: "cuisine-dish-name",
  name: "Dish Display Name",
  cuisine: "Italian",
  mealType: ["lunch", "dinner"],
  ingredients: ["pasta", "tomato", "garlic", "olive oil", "basil"],
  prepTime: 25,
  difficulty: "easy",
  description: "A classic Italian pasta dish"
}
```

## 🛠️ Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — No framework dependencies
- **Tesseract.js v5** — Client-side OCR engine (loaded via CDN)
- **Google Fonts (Outfit)** — Modern typography
