/**
 * MealPlanner — Step 3 of the wizard
 * 
 * Core algorithm that matches available groceries × selected cuisines
 * to generate a 7-day breakfast/lunch/dinner meal plan, plus the
 * rendering logic for the weekly grid UI.
 */
const MealPlanner = {
  /** @type {Object|null} The generated meal plan */
  currentPlan: null,

  /** @type {string[]} Available grocery items */
  groceries: [],

  /** @type {string[]} Selected cuisine IDs */
  cuisines: [],

  /** Day names for the weekly grid */
  DAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

  /** Short day names for mobile */
  DAYS_SHORT: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

  /** Meal types with display metadata */
  MEAL_TYPES: [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'hsl(40, 90%, 55%)' },
    { id: 'lunch', label: 'Lunch', icon: '☀️', color: 'hsl(160, 70%, 45%)' },
    { id: 'dinner', label: 'Dinner', icon: '🌙', color: 'hsl(270, 65%, 55%)' }
  ],

  /**
   * Generate a weekly meal plan.
   * @param {string[]} groceries - Available grocery items (lowercase)
   * @param {string[]} selectedCuisines - Selected cuisine IDs
   * @returns {Object} The meal plan: { monday: { breakfast: Recipe, ... }, ... }
   */
  generatePlan(groceries, selectedCuisines) {
    this.groceries = groceries.map(g => g.toLowerCase().trim());
    this.cuisines = selectedCuisines;

    // Get all recipes, filtered by selected cuisines
    const allRecipes = typeof RECIPES !== 'undefined' ? RECIPES : [];
    const cuisineNames = this._getCuisineNames(selectedCuisines);
    const filteredRecipes = allRecipes.filter(r =>
      cuisineNames.includes(r.cuisine)
    );

    // Score each recipe by ingredient match
    const scoredRecipes = filteredRecipes.map(recipe => ({
      ...recipe,
      score: this._scoreRecipe(recipe),
      matchedIngredients: recipe.ingredients.filter(i => this.groceries.includes(i.toLowerCase())),
      missingIngredients: recipe.ingredients.filter(i => !this.groceries.includes(i.toLowerCase()))
    }));

    // Sort by score descending
    scoredRecipes.sort((a, b) => b.score - a.score);

    // Separate by meal type
    const byMealType = {
      breakfast: scoredRecipes.filter(r => r.mealType.includes('breakfast')),
      lunch: scoredRecipes.filter(r => r.mealType.includes('lunch')),
      dinner: scoredRecipes.filter(r => r.mealType.includes('dinner'))
    };

    // Build the weekly plan
    const plan = {};
    const usedRecipeIds = new Set();

    this.DAYS.forEach((day, dayIndex) => {
      const dayKey = day.toLowerCase();
      plan[dayKey] = {};

      this.MEAL_TYPES.forEach(({ id: mealType }) => {
        const candidates = byMealType[mealType].filter(r => !usedRecipeIds.has(r.id));

        // Try to distribute cuisines evenly
        const targetCuisine = this._getCuisineForSlot(dayIndex, mealType, plan, cuisineNames);
        let selected = null;

        // First, try to find a recipe from the target cuisine
        if (targetCuisine) {
          selected = candidates.find(r => r.cuisine === targetCuisine);
        }

        // Fallback: pick the best-scoring candidate from any selected cuisine
        if (!selected && candidates.length > 0) {
          selected = candidates[0];
        }

        // If we've exhausted unique recipes, allow repeats
        if (!selected) {
          const allCandidates = byMealType[mealType];
          if (allCandidates.length > 0) {
            // Pick a random one to avoid the same repeat pattern
            selected = allCandidates[Math.floor(Math.random() * allCandidates.length)];
          }
        }

        // Last resort: create a placeholder
        if (!selected) {
          selected = {
            id: `placeholder-${dayKey}-${mealType}`,
            name: 'Chef\'s Choice',
            cuisine: cuisineNames[0] || 'American',
            mealType: [mealType],
            ingredients: [],
            prepTime: 30,
            difficulty: 'easy',
            description: 'A delicious meal with your available ingredients',
            score: 0,
            matchedIngredients: [],
            missingIngredients: []
          };
        }

        plan[dayKey][mealType] = selected;
        usedRecipeIds.add(selected.id);
      });
    });

    this.currentPlan = plan;
    return plan;
  },

  /**
   * Score a recipe based on ingredient availability.
   * @param {Object} recipe
   * @returns {number} Score between 0 and 1
   */
  _scoreRecipe(recipe) {
    if (!recipe.ingredients || recipe.ingredients.length === 0) return 0;
    const matched = recipe.ingredients.filter(i =>
      this.groceries.includes(i.toLowerCase())
    ).length;
    return matched / recipe.ingredients.length;
  },

  /**
   * Map cuisine IDs to display names.
   * @param {string[]} cuisineIds
   * @returns {string[]}
   */
  _getCuisineNames(cuisineIds) {
    const map = {
      'indian': 'Indian',
      'italian': 'Italian',
      'mexican': 'Mexican',
      'chinese': 'Chinese',
      'japanese': 'Japanese',
      'thai': 'Thai',
      'mediterranean': 'Mediterranean',
      'american': 'American',
      'korean': 'Korean',
      'middle-eastern': 'Middle Eastern',
      'french': 'French',
      'southern-soul': 'Southern/Soul'
    };
    return cuisineIds.map(id => map[id] || id);
  },

  /**
   * Determine the target cuisine for a given day/meal slot to ensure variety.
   * @param {number} dayIndex
   * @param {string} mealType
   * @param {Object} currentPlan
   * @param {string[]} cuisineNames
   * @returns {string|null}
   */
  _getCuisineForSlot(dayIndex, mealType, currentPlan, cuisineNames) {
    if (cuisineNames.length === 0) return null;

    // Count cuisines already used today
    const dayKey = this.DAYS[dayIndex].toLowerCase();
    const todaysCuisines = Object.values(currentPlan[dayKey] || {}).map(r => r?.cuisine).filter(Boolean);

    // Try to pick a cuisine not yet used today
    const unused = cuisineNames.filter(c => !todaysCuisines.includes(c));
    if (unused.length > 0) {
      // Rotate through cuisines based on slot index
      const slotIndex = (dayIndex * 3 + this.MEAL_TYPES.findIndex(m => m.id === mealType));
      return unused[slotIndex % unused.length];
    }

    // All cuisines used today — rotate through all
    const slotIndex = (dayIndex * 3 + this.MEAL_TYPES.findIndex(m => m.id === mealType));
    return cuisineNames[slotIndex % cuisineNames.length];
  },

  /**
   * Render the meal plan screen.
   * @param {HTMLElement} container - DOM element to render into
   * @param {string[]} groceries - Available groceries
   * @param {string[]} selectedCuisines - Selected cuisine IDs
   */
  render(container, groceries, selectedCuisines) {
    container.innerHTML = '';

    // Generate the plan
    const plan = this.generatePlan(groceries, selectedCuisines);

    // ── Screen Header ──
    const header = document.createElement('div');
    header.className = 'screen-header';
    header.innerHTML = `
      <h2 class="screen-title">Your Weekly Meal Plan</h2>
      <p class="screen-subtitle">Personalized meals matched to your groceries and taste</p>
    `;
    container.appendChild(header);

    // ── Action Bar ──
    const actionBar = document.createElement('div');
    actionBar.className = 'plan-action-bar';
    actionBar.innerHTML = `
      <div class="plan-stats">
        <span class="stat-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          ${groceries.length} groceries
        </span>
        <span class="stat-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
          ${selectedCuisines.length} cuisine${selectedCuisines.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div class="plan-actions">
        <button class="btn btn-secondary btn-sm" id="btn-regenerate" aria-label="Regenerate meal plan">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="regenerate-icon">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Regenerate
        </button>
        <button class="btn btn-secondary btn-sm" id="btn-print" aria-label="Print meal plan">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print
        </button>
      </div>
    `;
    container.appendChild(actionBar);

    // ── Meal Plan Grid ──
    const grid = document.createElement('div');
    grid.className = 'meal-plan-grid';
    grid.id = 'meal-plan-grid';

    this.DAYS.forEach((day, dayIndex) => {
      const dayKey = day.toLowerCase();
      const dayColumn = document.createElement('div');
      dayColumn.className = 'day-column';

      // Day Header
      const dayHeader = document.createElement('div');
      dayHeader.className = 'day-header';
      dayHeader.innerHTML = `
        <span class="day-name">${day}</span>
        <span class="day-short">${this.DAYS_SHORT[dayIndex]}</span>
      `;
      dayColumn.appendChild(dayHeader);

      // Meal Cards
      this.MEAL_TYPES.forEach(mealMeta => {
        const recipe = plan[dayKey][mealMeta.id];
        const card = this._createMealCard(recipe, mealMeta);
        dayColumn.appendChild(card);
      });

      grid.appendChild(dayColumn);
    });

    container.appendChild(grid);

    // ── Legend ──
    const legend = document.createElement('div');
    legend.className = 'plan-legend';
    legend.innerHTML = `
      <div class="legend-item">
        <span class="legend-dot" style="background: hsl(160, 70%, 45%)"></span>
        <span>Ingredients you have</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot" style="background: hsl(0, 60%, 55%)"></span>
        <span>Ingredients to buy</span>
      </div>
    `;
    container.appendChild(legend);

    // ── Event Listeners ──
    document.getElementById('btn-regenerate')?.addEventListener('click', () => {
      // Spin the icon
      const icon = document.querySelector('.regenerate-icon');
      if (icon) {
        icon.classList.add('spinning');
        setTimeout(() => icon.classList.remove('spinning'), 600);
      }

      // Re-render with new plan
      setTimeout(() => {
        this.render(container, groceries, selectedCuisines);
      }, 300);
    });

    document.getElementById('btn-print')?.addEventListener('click', () => {
      window.print();
    });

    // Grocery list listener
    document.querySelectorAll('.btn-add-missing').forEach(btn => {
        btn.addEventListener('click', (e) => {
            try {
                const missing = JSON.parse(e.currentTarget.dataset.missing);
                if (Array.isArray(missing) && typeof GroceryInput !== 'undefined') {
                    missing.forEach(item => {
                        GroceryInput._addGrocery(item);
                    });
                }
            } catch (err) {
                console.error('Failed to add missing ingredients', err);
            }
        });
    });
  },

  /**
   * Create a single meal card element.
   * @param {Object} recipe - The recipe data
   * @param {Object} mealMeta - Meal type metadata (id, label, icon, color)
   * @returns {HTMLElement}
   */
  _createMealCard(recipe, mealMeta) {
    const card = document.createElement('div');
    card.className = 'meal-card';
    card.style.setProperty('--meal-color', mealMeta.color);

    // Matched / missing ingredients display
    const matchedHTML = (recipe.matchedIngredients || [])
      .map(i => `<span class="ingredient matched">${i}</span>`)
      .join('');
    const missingHTML = (recipe.missingIngredients || [])
      .map(i => `<span class="ingredient missing">${i}</span>`)
      .join('');

    // Match percentage
    const totalIngredients = (recipe.matchedIngredients?.length || 0) + (recipe.missingIngredients?.length || 0);
    const matchPercent = totalIngredients > 0
      ? Math.round(((recipe.matchedIngredients?.length || 0) / totalIngredients) * 100)
      : 0;

    card.innerHTML = `
      <div class="meal-type-badge" style="background: ${mealMeta.color}">
        <span class="meal-icon">${mealMeta.icon}</span>
        <span class="meal-label">${mealMeta.label}</span>
      </div>
      <div class="meal-content">
        <h4 class="meal-name">${recipe.name}</h4>
        <div class="meal-meta">
          <span class="meal-cuisine">${recipe.cuisine}</span>
          <span class="meal-time">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${recipe.prepTime || '?'} min
          </span>
        </div>
        <p class="meal-description">${recipe.description || ''}</p>
        <div class="meal-match-bar">
          <div class="match-fill" style="width: ${matchPercent}%"></div>
        </div>
        <p class="match-text">${matchPercent}% ingredient match</p>
        <div class="meal-ingredients">
          ${matchedHTML}${missingHTML}
        </div>
        ${recipe.missingIngredients && recipe.missingIngredients.length > 0 ? `<button class="btn btn-sm btn-add-missing" data-missing='${JSON.stringify(recipe.missingIngredients)}'>Add missing</button>` : ''}
      </div>
    `;

    return card;
  }
};
