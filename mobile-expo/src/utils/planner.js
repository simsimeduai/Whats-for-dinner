import { RECIPES, SWAP_REGISTRY, INGREDIENT_CATEGORIES } from '../data/recipeData';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅', color: '#E59F22' },
  { id: 'lunch', label: 'Lunch', icon: '☀️', color: '#22A86B' },
  { id: 'dinner', label: 'Dinner', icon: '🌙', color: '#7D4CDB' }
];

export const CUISINES = [
  { id: 'indian', name: 'Indian', emoji: '🍛', description: 'Spicy curries, aromatic dals & biryanis', color: '#EB8C1E' },
  { id: 'italian', name: 'Italian', emoji: '🍝', description: 'Classic pasta, creamy risottos & bruschetta', color: '#DF4828' },
  { id: 'mexican', name: 'Mexican', emoji: '🌮', description: 'Bold tacos, burritos & zesty enchiladas', color: '#E8B315' },
  { id: 'chinese', name: 'Chinese', emoji: '🥡', description: 'Savory stir-fries, fried rice & dumplings', color: '#C91D1D' },
  { id: 'japanese', name: 'Japanese', emoji: '🍱', description: 'Sushi bowls, rich ramen & sweet teriyaki', color: '#3380CC' },
  { id: 'thai', name: 'Thai', emoji: '🍜', description: 'Pad thai, green curry & spicy tom yum', color: '#24A84D' },
  { id: 'mediterranean', name: 'Mediterranean', emoji: '🥙', description: 'Falafel, creamy hummus & grilled kebabs', color: '#2296C4' },
  { id: 'american', name: 'American', emoji: '🍔', description: 'Burgers, smoky BBQ & loaded mac & cheese', color: '#2E59B8' },
  { id: 'korean', name: 'Korean', emoji: '🥘', description: 'Bibimbap, kimchi jjigae & bulgogi', color: '#D92644' },
  { id: 'middle-eastern', name: 'Middle Eastern', emoji: '🧆', description: 'Shawarma, tabbouleh & crispy fattoush', color: '#C4B322' },
  { id: 'french', name: 'French', emoji: '🥐', description: 'Crêpes, savory quiche & ratatouille', color: '#4040BF' },
  { id: 'southern-soul', name: 'Southern / Soul', emoji: '🍗', description: 'Fried chicken, creamy grits & cornbread', color: '#CF6817' }
];

export const DIET_OPTIONS = [
  { id: 'no-restrictions', label: 'No Restrictions', emoji: '✅' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥦' },
  { id: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
  { id: 'keto', label: 'Keto', emoji: '🥑' },
  { id: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
  { id: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
  { id: 'nut-free', label: 'Nut-Free', emoji: '🥜' },
  { id: 'low-sodium', label: 'Low-Sodium', emoji: '🧂' },
  { id: 'heart-healthy', label: 'Heart Healthy', emoji: '❤️' }
];

const CUISINE_NAME_MAP = {
  indian: 'Indian',
  italian: 'Italian',
  mexican: 'Mexican',
  chinese: 'Chinese',
  japanese: 'Japanese',
  thai: 'Thai',
  mediterranean: 'Mediterranean',
  american: 'American',
  korean: 'Korean',
  'middle-eastern': 'Middle Eastern',
  french: 'French',
  'southern-soul': 'Southern/Soul'
};

export function normalizeIngredient(name) {
  if (!name) return '';
  let s = name.toLowerCase().trim();

  const synonyms = {
    bhindi: 'okra',
    "lady's finger": 'okra',
    ladyfinger: 'okra',
    coriander: 'cilantro',
    'coriander leaves': 'cilantro',
    'green onion': 'scallion',
    'spring onion': 'scallion',
    eggplant: 'aubergine',
    'bell pepper': 'pepper',
    'sweet potato': 'yam',
    chili: 'chili pepper',
    'chili powder': 'chili',
    'ground beef': 'beef',
    'ground pork': 'pork',
    'chicken breast': 'chicken',
    'chicken thigh': 'chicken',
    flour: 'all-purpose flour',
    sugar: 'white sugar'
  };

  const modifiers = [
    'fresh', 'organic', 'raw', 'chopped', 'diced', 'sliced', 'canned',
    'ground', 'powder', 'pods', 'dried', 'grated', 'shredded', 'pureed',
    'crushed', 'cooked', 'cloves of', 'heads of', 'cloves', 'whole'
  ];

  modifiers.forEach((mod) => {
    s = s.replace(new RegExp(`\\b${mod}\\b`, 'g'), '');
  });

  s = s.replace(/\s+/g, ' ').trim();
  if (synonyms[s]) s = synonyms[s];

  if (s.endsWith('ies')) {
    s = s.slice(0, -3) + 'y';
  } else if (s.endsWith('oes')) {
    s = s.slice(0, -2);
  } else if (s.endsWith('es') && !['cheese', 'chives'].includes(s)) {
    s = s.slice(0, -2);
  } else if (s.endsWith('s') && !['hummus', 'couscous', 'oats', 'grits', 'lentils'].includes(s)) {
    s = s.slice(0, -1);
  }

  return s.trim();
}

export function getIngredientSwaps(ingredient) {
  const key = (ingredient || '').toLowerCase().trim();
  const entry = SWAP_REGISTRY[key];
  if (Array.isArray(entry)) return entry;
  return [];
}

function findDietarySwap(recipe, allFlags) {
  if (!allFlags.size) return null;
  for (const ingredient of recipe.ingredients || []) {
    const key = ingredient.toLowerCase();
    const entry = SWAP_REGISTRY[key];
    if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
      for (const flag of allFlags) {
        if (entry[flag]) {
          return { protein: key, swapTo: entry[flag], forFlag: flag };
        }
      }
    }
  }
  return null;
}

export function generateMealPlan(
  groceries = [],
  selectedCuisines = [],
  profiles = [],
  pantryStaples = [],
  customRecipes = [],
  shuffleOffset = 0
) {
  const normGroceries = groceries.map((g) => g.toLowerCase().trim());
  const normStaples = pantryStaples.map((s) => s.toLowerCase().trim());

  const allAllergies = new Set();
  const allFlags = new Set();
  profiles.forEach((p) => {
    (p.allergies || []).forEach((a) => allAllergies.add(a.toLowerCase()));
    (p.dietaryFlags || []).forEach((f) => allFlags.add(f));
  });

  const allRecipes = [...RECIPES, ...customRecipes];
  const cuisineNames = selectedCuisines.map((id) => CUISINE_NAME_MAP[id] || id);

  let filtered = allRecipes.filter((r) => cuisineNames.includes(r.cuisine));
  if (allAllergies.size > 0) {
    filtered = filtered.filter(
      (r) => !(r.ingredients || []).some((i) => allAllergies.has(i.toLowerCase()))
    );
  }

  const groceryNormSet = new Set(normGroceries.map(normalizeIngredient));
  const stapleNormSet = new Set(normStaples.map(normalizeIngredient));
  const haveSet = new Set([...groceryNormSet, ...stapleNormSet]);

  const scored = filtered.map((recipe) => {
    const ingredients = recipe.ingredients || [];
    const matched = ingredients.filter((i) => haveSet.has(normalizeIngredient(i)));
    const missing = ingredients.filter((i) => !haveSet.has(normalizeIngredient(i)));
    const pantryUsed = ingredients.filter((i) => {
      const n = normalizeIngredient(i);
      return stapleNormSet.has(n) && !groceryNormSet.has(n);
    });

    return {
      ...recipe,
      score: matched.length / Math.max(ingredients.length, 1),
      matchedIngredients: matched,
      missingIngredients: missing,
      pantryIngredients: pantryUsed,
      dietarySwap: findDietarySwap(recipe, allFlags)
    };
  });

  // Sort by match score; apply small deterministic jitter on regenerate
  scored.sort((a, b) => {
    if (shuffleOffset > 0 && Math.abs(b.score - a.score) < 0.15) {
      return Math.random() - 0.5;
    }
    return b.score - a.score;
  });

  const byMealType = {
    breakfast: scored.filter((r) => r.mealType.includes('breakfast')),
    lunch: scored.filter((r) => r.mealType.includes('lunch')),
    dinner: scored.filter((r) => r.mealType.includes('dinner'))
  };

  const plan = {};
  const usedIds = new Set();

  DAYS.forEach((day, dayIndex) => {
    const dayKey = day.toLowerCase();
    plan[dayKey] = {};

    MEAL_TYPES.forEach(({ id: mealType }, mealIdx) => {
      const candidates = byMealType[mealType].filter((r) => !usedIds.has(r.id));
      const todaysCuisines = Object.values(plan[dayKey]).map((r) => r?.cuisine).filter(Boolean);
      const unused = cuisineNames.filter((c) => !todaysCuisines.includes(c));
      const pool = unused.length > 0 ? unused : cuisineNames;
      const targetCuisine = pool.length ? pool[(dayIndex * 3 + mealIdx + shuffleOffset) % pool.length] : null;

      let selected = targetCuisine ? candidates.find((r) => r.cuisine === targetCuisine) : null;
      if (!selected && candidates.length > 0) selected = candidates[0];
      if (!selected && byMealType[mealType].length > 0) {
        const list = byMealType[mealType];
        selected = list[Math.floor(Math.random() * list.length)];
      }
      if (!selected) {
        selected = {
          id: `placeholder-${dayKey}-${mealType}`,
          name: "Chef's Choice",
          cuisine: cuisineNames[0] || 'American',
          mealType: [mealType],
          ingredients: [],
          prepTime: 30,
          difficulty: 'easy',
          description: 'A flexible meal using your available ingredients.',
          score: 0,
          matchedIngredients: [],
          missingIngredients: [],
          pantryIngredients: [],
          dietarySwap: null
        };
      }

      plan[dayKey][mealType] = selected;
      usedIds.add(selected.id);
    });
  });

  return plan;
}

export function getIngredientCategory(name) {
  const key = (name || '').toLowerCase().trim();
  return INGREDIENT_CATEGORIES[key] || 'Other';
}

export function parseReceiptText(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];

  let lines = rawText.split(/\r?\n|,/).filter((l) => l.trim().length > 0);
  const headerWords = /\b(STORE|MART|WELCOME|THANK|RECEIPT|TRANSACTION|SUPERMARKET|GROCERY|INC|LLC|LTD)\b/i;
  const phonePattern = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const addressPattern = /\d+\s+[\w\s]+\b(ST|AVE|BLVD|RD|DR|LN|CT|WAY|PKWY|PL|HWY)\b/i;
  const datePattern = /^\s*\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\s*$/;
  const timePattern = /^\s*\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM)?\s*$/i;
  const dateTimeCombo = /^\s*\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\s+\d{1,2}:\d{2}/;
  const financialWords = /\b(TOTAL|SUBTOTAL|SUB\s*TOTAL|TAX|CHANGE|CASH|CREDIT|DEBIT|CARD|BALANCE|VISA|MASTERCARD|AMEX|PAYMENT|TENDER|DUE|SAVINGS|DISCOUNT)\b/i;
  const onlyPricePattern = /^\s*\$?\d+\.?\d*\s*$/;

  lines = lines.filter((line) => {
    const t = line.trim();
    if (t === t.toUpperCase() && headerWords.test(t)) return false;
    if (phonePattern.test(t) || addressPattern.test(t)) return false;
    if (datePattern.test(t) || timePattern.test(t) || dateTimeCombo.test(t)) return false;
    if (financialWords.test(t) || onlyPricePattern.test(t)) return false;
    return true;
  });

  lines = lines.map((line) => {
    let cleaned = line;
    cleaned = cleaned.replace(/\s+\$?\d+[\.\s]\d{2}\s*[a-zA-Z]*\s*[a-zA-Z]*\s*$/, '');
    cleaned = cleaned.replace(/\s+\$?\d+\s*[a-zA-Z]*\s*$/, '');
    cleaned = cleaned.replace(/^\s*\d+\s*[xX@]\s+/, '');
    cleaned = cleaned.replace(/^\s*\d+[xX]\s*/, '');
    cleaned = cleaned.replace(/\s+\d+(\.\d+)?\s*(kg|g|gm|lt|l|ml|oz|lb|lbs)\b/i, '');
    cleaned = cleaned.replace(/\s+[a-zA-Z]{1,3}\s*$/, '');
    cleaned = cleaned.replace(/^[^a-zA-Z]+/, '').replace(/[^a-zA-Z]+$/, '');
    return cleaned.trim().toLowerCase().replace(/\s{2,}/g, ' ');
  });

  return [...new Set(lines)].filter((l) => l.length >= 2 && l.length <= 50);
}

export async function searchWebRecipes(groceries = [], existingCustom = []) {
  if (!groceries.length) return [];
  const staples = new Set(['salt', 'pepper', 'oil', 'water', 'butter', 'flour', 'sugar', 'garlic', 'onion', 'ginger']);
  const primary = groceries.filter((g) => !staples.has(g.toLowerCase())).slice(0, 4);
  if (!primary.length) primary.push(groceries[0]);

  const existingIds = new Set(existingCustom.map((r) => r.id));
  const imported = [];

  await Promise.all(
    primary.map(async (ing) => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ing)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.meals) return;

        for (const meal of data.meals.slice(0, 2)) {
          const webId = `web-${meal.idMeal}`;
          if (existingIds.has(webId) || imported.some((r) => r.id === webId)) continue;
          const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
          if (!detailRes.ok) continue;
          const detail = await detailRes.json();
          const m = detail?.meals?.[0];
          if (!m) continue;

          const ingredients = [];
          for (let k = 1; k <= 20; k++) {
            const val = m[`strIngredient${k}`];
            if (val && val.trim()) ingredients.push(val.trim().toLowerCase());
          }
          const areaMap = {
            british: 'American', irish: 'American', canadian: 'American', american: 'American',
            french: 'French', italian: 'Italian', indian: 'Indian', mexican: 'Mexican',
            chinese: 'Chinese', japanese: 'Japanese', thai: 'Thai', vietnamese: 'Thai',
            moroccan: 'Mediterranean', greek: 'Mediterranean', turkish: 'Middle Eastern',
            egyptian: 'Middle Eastern', jamaican: 'Southern/Soul'
          };
          const cuisine = areaMap[(m.strArea || '').toLowerCase()] || m.strArea || 'American';
          const cat = (m.strCategory || '').toLowerCase();
          const mealType = cat === 'breakfast' ? ['breakfast'] : ['lunch', 'dinner'];

          imported.push({
            id: webId,
            name: m.strMeal,
            cuisine,
            mealType,
            ingredients,
            prepTime: 15 + ingredients.length * 2,
            difficulty: ingredients.length > 10 ? 'medium' : 'easy',
            description: m.strInstructions ? `${m.strInstructions.slice(0, 140)}...` : 'Imported web recipe.'
          });
        }
      } catch {
        // Ignore single-ingredient network failures
      }
    })
  );

  return imported;
}

export function formatShoppingListText(items) {
  const sections = ['Proteins', 'Produce', 'Dairy & Eggs', 'Pantry', 'Spices & Seasonings', 'Other'];
  const grouped = {};
  sections.forEach((s) => { grouped[s] = []; });
  items.forEach((item) => {
    const cat = sections.includes(item.category) ? item.category : 'Other';
    grouped[cat].push(item);
  });

  const lines = ["🛒 Shopping List — What's for Dinner", ''];
  sections.forEach((sec) => {
    if (!grouped[sec].length) return;
    lines.push(`${sec}:`);
    grouped[sec].forEach((i) => lines.push(`  ${i.checked ? '☑' : '☐'} ${i.name}`));
    lines.push('');
  });
  return lines.join('\n').trim();
}

export function formatMealPlanText(plan) {
  if (!plan) return '';
  const lines = ["🍽️ What's for Dinner — Weekly Meal Plan", ''];
  DAYS.forEach((day) => {
    const dp = plan[day.toLowerCase()];
    if (!dp) return;
    lines.push(`📅 ${day}`);
    MEAL_TYPES.forEach((m) => {
      const r = dp[m.id];
      if (r) lines.push(`  ${m.icon} ${m.label}: ${r.name} (${r.cuisine})`);
    });
    lines.push('');
  });
  return lines.join('\n').trim();
}
