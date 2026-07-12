/**
 * MealPlanner — Step 3 of the wizard
 *
 * Generates a 7-day meal plan filtered by dietary profiles,
 * renders expandable meal cards with inline ingredient panels,
 * swap popovers with swap memory, and a kitchen staples section.
 * Wires "Add to List" / "Add all missing" to the ShoppingList module.
 */
const MealPlanner = {
  /** @type {Object|null} The generated meal plan */
  currentPlan: null,

  /** @type {string[]} Available grocery items (lowercase) */
  groceries: [],

  /** @type {string[]} Pantry staples (lowercase) */
  pantryStaples: [],

  /** @type {string[]} Selected cuisine IDs */
  cuisines: [],

  /** @type {Array} Household dietary profiles */
  profiles: [],

  /** @type {Object} Remembered ingredient swaps — loaded from localStorage */
  swapMemory: {},

  /** @type {Object} Remembered recipe-level protein subs */
  recipeSubs: {},

  /** Day names for the weekly grid */
  DAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

  /** Short day names for mobile */
  DAYS_SHORT: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

  /** Meal types with display metadata */
  MEAL_TYPES: [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'hsl(40, 90%, 55%)' },
    { id: 'lunch',     label: 'Lunch',     icon: '☀️', color: 'hsl(160, 70%, 45%)' },
    { id: 'dinner',    label: 'Dinner',    icon: '🌙', color: 'hsl(270, 65%, 55%)' }
  ],

  /* ══════════════════════════════════════════════════════════════════════
     Plan Generation
     ══════════════════════════════════════════════════════════════════════ */

  /**
   * Generate a weekly meal plan filtered by dietary profiles.
   * @param {string[]} groceries - Available grocery items
   * @param {string[]} selectedCuisines - Selected cuisine IDs
   * @param {Array}    profiles - Household dietary profiles
   * @param {string[]} pantryStaples - User's pantry staples
   * @returns {Object} Plan: { monday: { breakfast: Recipe, ... }, ... }
   */
  generatePlan(groceries, selectedCuisines, profiles = [], pantryStaples = []) {
    this.groceries      = groceries.map(g => g.toLowerCase().trim());
    this.pantryStaples  = pantryStaples.map(s => s.toLowerCase().trim());
    this.cuisines       = selectedCuisines;
    this.profiles       = profiles;

    // Load swap memory & recipe subs from localStorage
    this._loadSwapMemory();
    this._loadRecipeSubs();

    // Merge all allergies across profiles (hard filter)
    const allAllergies = new Set();
    profiles.forEach(p => p.allergies?.forEach(a => allAllergies.add(a.toLowerCase())));

    // Merge all dietary flags across profiles (soft flag for substitution suggestions)
    const allFlags = new Set();
    profiles.forEach(p => p.dietaryFlags?.forEach(f => allFlags.add(f)));

    const allRecipes = typeof RECIPES !== 'undefined' ? RECIPES : [];
    const cuisineNames = this._getCuisineNames(selectedCuisines);

    // Filter by cuisine
    let filteredRecipes = allRecipes.filter(r => cuisineNames.includes(r.cuisine));

    // Hard filter: remove recipes containing any allergy ingredient
    if (allAllergies.size > 0) {
      filteredRecipes = filteredRecipes.filter(r =>
        !r.ingredients.some(i => allAllergies.has(i.toLowerCase()))
      );
    }

    // Build combined "have" set: groceries + pantry staples
    const haveSet = new Set([...this.groceries, ...this.pantryStaples]);

    // Score and annotate each recipe
    const scoredRecipes = filteredRecipes.map(recipe => {
      const ingredients = recipe.ingredients || [];
      const matched  = ingredients.filter(i => haveSet.has(i.toLowerCase()));
      const missing  = ingredients.filter(i => !haveSet.has(i.toLowerCase()));
      // Pantry staples used in this recipe (informational)
      const pantryUsed = ingredients.filter(i =>
        this.pantryStaples.includes(i.toLowerCase()) && !this.groceries.includes(i.toLowerCase())
      );

      // Dietary conflict: any ingredient is a protein with a matching swap?
      const dietarySwap = this._findDietarySwap(recipe, allFlags);

      return {
        ...recipe,
        score: matched.length / Math.max(ingredients.length, 1),
        matchedIngredients: matched,
        missingIngredients: missing,
        pantryIngredients: pantryUsed,
        dietarySwap // { protein, swapTo, forFlag } or null
      };
    });

    scoredRecipes.sort((a, b) => b.score - a.score);

    const byMealType = {
      breakfast: scoredRecipes.filter(r => r.mealType.includes('breakfast')),
      lunch:     scoredRecipes.filter(r => r.mealType.includes('lunch')),
      dinner:    scoredRecipes.filter(r => r.mealType.includes('dinner'))
    };

    const plan = {};
    const usedIds = new Set();

    this.DAYS.forEach((day, dayIndex) => {
      const dayKey = day.toLowerCase();
      plan[dayKey] = {};

      this.MEAL_TYPES.forEach(({ id: mealType }) => {
        const candidates = byMealType[mealType].filter(r => !usedIds.has(r.id));
        const targetCuisine = this._getCuisineForSlot(dayIndex, mealType, plan, cuisineNames);
        let selected = null;

        if (targetCuisine) selected = candidates.find(r => r.cuisine === targetCuisine);
        if (!selected && candidates.length > 0) selected = candidates[0];
        if (!selected) {
          const all = byMealType[mealType];
          if (all.length > 0) selected = all[Math.floor(Math.random() * all.length)];
        }
        if (!selected) {
          selected = {
            id: `placeholder-${dayKey}-${mealType}`,
            name: "Chef's Choice",
            cuisine: cuisineNames[0] || 'American',
            mealType: [mealType],
            ingredients: [], prepTime: 30, difficulty: 'easy',
            description: 'A delicious meal with your available ingredients',
            score: 0, matchedIngredients: [], missingIngredients: [],
            pantryIngredients: [], dietarySwap: null
          };
        }

        plan[dayKey][mealType] = selected;
        usedIds.add(selected.id);
      });
    });

    this.currentPlan = plan;
    return plan;
  },

  /**
   * Find a dietary-profile-driven protein substitution for a recipe.
   * @private
   */
  _findDietarySwap(recipe, allFlags) {
    if (!allFlags.size) return null;
    const swapReg = typeof SWAP_REGISTRY !== 'undefined' ? SWAP_REGISTRY : {};

    for (const ingredient of (recipe.ingredients || [])) {
      const key = ingredient.toLowerCase();
      const entry = swapReg[key];
      if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
        // Protein-level swap map
        for (const flag of allFlags) {
          if (entry[flag]) {
            return { protein: key, swapTo: entry[flag], forFlag: flag };
          }
        }
      }
    }
    return null;
  },

  /** @private Score a recipe by ingredient availability */
  _scoreRecipe(recipe) {
    if (!recipe.ingredients?.length) return 0;
    const haveSet = new Set([...this.groceries, ...this.pantryStaples]);
    return recipe.ingredients.filter(i => haveSet.has(i.toLowerCase())).length / recipe.ingredients.length;
  },

  /** @private Map cuisine IDs → display names */
  _getCuisineNames(cuisineIds) {
    const map = {
      'indian': 'Indian', 'italian': 'Italian', 'mexican': 'Mexican',
      'chinese': 'Chinese', 'japanese': 'Japanese', 'thai': 'Thai',
      'mediterranean': 'Mediterranean', 'american': 'American', 'korean': 'Korean',
      'middle-eastern': 'Middle Eastern', 'french': 'French', 'southern-soul': 'Southern/Soul'
    };
    return cuisineIds.map(id => map[id] || id);
  },

  /** @private Distribute cuisines evenly across day/meal slots */
  _getCuisineForSlot(dayIndex, mealType, currentPlan, cuisineNames) {
    if (!cuisineNames.length) return null;
    const dayKey = this.DAYS[dayIndex].toLowerCase();
    const todaysCuisines = Object.values(currentPlan[dayKey] || {}).map(r => r?.cuisine).filter(Boolean);
    const unused = cuisineNames.filter(c => !todaysCuisines.includes(c));
    const pool = unused.length > 0 ? unused : cuisineNames;
    const slotIndex = dayIndex * 3 + this.MEAL_TYPES.findIndex(m => m.id === mealType);
    return pool[slotIndex % pool.length];
  },

  /* ══════════════════════════════════════════════════════════════════════
     Swap Memory — localStorage
     ══════════════════════════════════════════════════════════════════════ */

  _loadSwapMemory() {
    try {
      const s = localStorage.getItem('wfd_swaps');
      this.swapMemory = s ? JSON.parse(s) : {};
    } catch { this.swapMemory = {}; }
  },

  _saveSwapMemory() {
    try { localStorage.setItem('wfd_swaps', JSON.stringify(this.swapMemory)); } catch {}
  },

  _loadRecipeSubs() {
    try {
      const s = localStorage.getItem('wfd_recipe_subs');
      this.recipeSubs = s ? JSON.parse(s) : {};
    } catch { this.recipeSubs = {}; }
  },

  _saveRecipeSubs() {
    try { localStorage.setItem('wfd_recipe_subs', JSON.stringify(this.recipeSubs)); } catch {}
  },

  /* ══════════════════════════════════════════════════════════════════════
     Rendering — Main
     ══════════════════════════════════════════════════════════════════════ */

  /**
   * Render the meal plan screen.
   * @param {HTMLElement} container
   * @param {string[]} groceries
   * @param {string[]} selectedCuisines
   * @param {Array}    profiles
   * @param {string[]} pantryStaples
   */
  render(container, groceries, selectedCuisines, profiles = [], pantryStaples = []) {
    container.innerHTML = '';

    const plan = this.generatePlan(groceries, selectedCuisines, profiles, pantryStaples);

    // Show/hide shopping FAB
    if (typeof ShoppingList !== 'undefined') {
      ShoppingList.setFABVisible(true);
    }

    // ── Screen Header ──
    const header = document.createElement('div');
    header.className = 'screen-header';
    header.innerHTML = `
      <h2 class="screen-title">Your Weekly Meal Plan</h2>
      <p class="screen-subtitle">Tap any meal to see ingredients, swaps, and add to your shopping list</p>
    `;
    container.appendChild(header);

    // ── Action Bar ──
    const actionBar = document.createElement('div');
    actionBar.className = 'plan-action-bar';
    actionBar.innerHTML = `
      <div class="plan-stats">
        <span class="stat-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          ${groceries.length} items
        </span>
        <span class="stat-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
          ${selectedCuisines.length} cuisine${selectedCuisines.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div class="plan-actions">
        <button class="btn btn-secondary btn-sm" id="btn-open-shopping-list" aria-label="Open shopping list">
          🛒 Shopping List
        </button>
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

    // ── Day Accordions ──
    const planList = document.createElement('div');
    planList.className = 'meal-plan-list';
    planList.id = 'meal-plan-list';

    this.DAYS.forEach((day, dayIndex) => {
      const dayKey = day.toLowerCase();
      const dayBlock = this._createDayBlock(day, dayIndex, plan[dayKey]);
      planList.appendChild(dayBlock);
    });

    container.appendChild(planList);

    // ── Legend ──
    const legend = document.createElement('div');
    legend.className = 'plan-legend';
    legend.innerHTML = `
      <div class="legend-item"><span class="legend-dot" style="background: hsl(160, 70%, 45%)"></span><span>You have</span></div>
      <div class="legend-item"><span class="legend-dot" style="background: hsl(0, 60%, 55%)"></span><span>Missing</span></div>
      <div class="legend-item"><span class="legend-dot" style="background: hsl(225, 12%, 30%)"></span><span>Pantry staple</span></div>
    `;
    container.appendChild(legend);

    // ── Event Listeners ──
    document.getElementById('btn-open-shopping-list')?.addEventListener('click', () => {
      if (typeof ShoppingList !== 'undefined') ShoppingList.open();
    });

    document.getElementById('btn-regenerate')?.addEventListener('click', () => {
      const icon = document.querySelector('.regenerate-icon');
      if (icon) {
        icon.classList.add('spinning');
        setTimeout(() => icon.classList.remove('spinning'), 600);
      }
      setTimeout(() => this.render(container, groceries, selectedCuisines, profiles, pantryStaples), 300);
    });

    document.getElementById('btn-print')?.addEventListener('click', () => window.print());
  },

  /* ══════════════════════════════════════════════════════════════════════
     Rendering — Day Blocks & Meal Cards
     ══════════════════════════════════════════════════════════════════════ */

  /**
   * Create a collapsible day block with meal cards.
   * @private
   */
  _createDayBlock(day, dayIndex, dayPlan) {
    const block = document.createElement('div');
    block.className = 'day-block';
    block.id = `day-block-${day.toLowerCase()}`;

    // Count total missing across the day
    let totalMissing = 0;
    Object.values(dayPlan).forEach(recipe => {
      totalMissing += (recipe.missingIngredients || []).length;
    });

    const missingBadge = totalMissing > 0
      ? `<span class="day-missing-badge">${totalMissing} missing</span>`
      : `<span class="day-missing-badge none">✓ All covered</span>`;

    const header = document.createElement('div');
    header.className = 'day-block-header';
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', dayIndex === 0 ? 'true' : 'false');
    header.innerHTML = `
      <div class="day-header-left">
        <span class="day-name-full">${day}</span>
        <span class="day-name-short">${this.DAYS_SHORT[dayIndex]}</span>
        ${missingBadge}
      </div>
      <svg class="day-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;

    const body = document.createElement('div');
    body.className = 'day-block-body' + (dayIndex === 0 ? ' open' : '');

    // Meal cards
    this.MEAL_TYPES.forEach(mealMeta => {
      const recipe = dayPlan[mealMeta.id];
      if (!recipe) return;
      const card = this._createMealCard(recipe, mealMeta, day);
      body.appendChild(card);
    });

    block.appendChild(header);
    block.appendChild(body);

    // Toggle accordion
    const toggle = () => {
      const isOpen = body.classList.toggle('open');
      header.setAttribute('aria-expanded', String(isOpen));
      header.querySelector('.day-chevron').style.transform = isOpen ? 'rotate(180deg)' : '';
    };
    header.addEventListener('click', toggle);
    header.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

    // Set initial chevron
    if (dayIndex === 0) header.querySelector('.day-chevron').style.transform = 'rotate(180deg)';

    return block;
  },

  /**
   * Create an expandable meal card with ingredient gap panel.
   * @private
   */
  _createMealCard(recipe, mealMeta, day) {
    const card = document.createElement('div');
    card.className = 'meal-card';
    card.style.setProperty('--meal-color', mealMeta.color);

    const missingCount = (recipe.missingIngredients || []).length;
    const recipeSubKey = `${recipe.id}`;
    const appliedSub = this.recipeSubs[recipeSubKey];

    const gapBadgeHTML = missingCount > 0
      ? `<span class="ingredient-gap-badge">🟡 ${missingCount} missing · tap to review</span>`
      : `<span class="ingredient-gap-badge none">✅ All ingredients available</span>`;

    const dietaryBannerHTML = (recipe.dietarySwap && !appliedSub)
      ? `<div class="dietary-swap-banner" id="swap-banner-${recipe.id}">
          🌱 Make it ${recipe.dietarySwap.forFlag}: swap <strong>${recipe.dietarySwap.protein}</strong> → <strong>${recipe.dietarySwap.swapTo}</strong>
          <button class="btn-apply-swap" data-recipe-id="${recipe.id}" data-protein="${recipe.dietarySwap.protein}" data-swap-to="${recipe.dietarySwap.swapTo}">Apply</button>
        </div>`
      : (appliedSub ? `<div class="swap-memory-chip">💾 Applied: ${appliedSub.protein} → ${appliedSub.swapTo}</div>` : '');

    // Collapsed card HTML
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
        ${gapBadgeHTML}
        <div class="ingredient-panel" id="panel-${recipe.id}" style="display:none">
          ${dietaryBannerHTML}
          <div id="ingredient-content-${recipe.id}"></div>
          <div class="kitchen-staples-area" id="staples-area-${recipe.id}"></div>
          <button class="meal-add-all-btn" id="add-all-${recipe.id}" ${missingCount === 0 ? 'disabled' : ''}>
            ${missingCount > 0 ? `Add all missing (${missingCount}) to Shopping List →` : '✅ Nothing missing for this meal'}
          </button>
        </div>
      </div>
    `;

    // ── Expand / Collapse ──
    const content = card.querySelector('.meal-content');
    const panel = card.querySelector(`#panel-${recipe.id}`);
    const badge = card.querySelector('.ingredient-gap-badge');

    const openCard = () => {
      if (card.classList.contains('expanded')) return;
      card.classList.add('expanded');
      panel.style.display = 'flex';
      panel.style.flexDirection = 'column';
      this._renderIngredientPanel(recipe, card);
    };

    content.addEventListener('click', (e) => {
      // Don't toggle when clicking buttons inside the panel
      if (e.target.closest('button') && card.classList.contains('expanded')) return;
      if (card.classList.contains('expanded')) {
        card.classList.remove('expanded');
        panel.style.display = 'none';
      } else {
        openCard();
      }
    });

    // Apply dietary swap
    card.querySelector('.btn-apply-swap')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const recipeId = e.target.dataset.recipeId;
      const protein = e.target.dataset.protein;
      const swapTo = e.target.dataset.swapTo;
      this.recipeSubs[recipeId] = { protein, swapTo };
      this._saveRecipeSubs();

      // Update recipe's ingredient lists
      recipe.missingIngredients = (recipe.missingIngredients || [])
        .map(i => i.toLowerCase() === protein ? swapTo : i);
      recipe.matchedIngredients = (recipe.matchedIngredients || [])
        .map(i => i.toLowerCase() === protein ? swapTo : i);
      recipe.dietarySwap = null;

      // Re-render card content
      this._renderIngredientPanel(recipe, card);
      const banner = card.querySelector(`#swap-banner-${recipeId}`);
      if (banner) banner.outerHTML = `<div class="swap-memory-chip">💾 Applied: ${protein} → ${swapTo}</div>`;

      if (typeof App !== 'undefined') App._showToast(`✅ Swapped ${protein} → ${swapTo}`, 'success');
    });

    return card;
  },

  /**
   * Render the ingredient panel content inside an expanded meal card.
   * @private
   */
  _renderIngredientPanel(recipe, card) {
    const contentEl = card.querySelector(`#ingredient-content-${recipe.id}`);
    const staplesArea = card.querySelector(`#staples-area-${recipe.id}`);
    const addAllBtn = card.querySelector(`#add-all-${recipe.id}`);
    if (!contentEl) return;

    contentEl.innerHTML = '';

    const matched = recipe.matchedIngredients || [];
    const missing = recipe.missingIngredients || [];
    const pantry  = recipe.pantryIngredients  || [];

    // ── Section: You Have ──
    if (matched.length > 0) {
      const haveGroup = document.createElement('div');
      haveGroup.className = 'ingredient-group';
      haveGroup.innerHTML = `<div class="ingredient-group-label">✅ You Have</div>`;
      const chips = document.createElement('div');
      chips.className = 'ingredient-chips';
      matched.forEach(ing => {
        const chip = document.createElement('span');
        chip.className = 'ingredient-chip have';
        chip.textContent = ing;
        chips.appendChild(chip);
      });
      haveGroup.appendChild(chips);
      contentEl.appendChild(haveGroup);
    }

    // ── Section: Missing ──
    if (missing.length > 0) {
      const missingGroup = document.createElement('div');
      missingGroup.className = 'ingredient-group';
      missingGroup.innerHTML = `<div class="ingredient-group-label">❌ Missing</div>`;
      const chips = document.createElement('div');
      chips.className = 'ingredient-chips';

      missing.forEach(ing => {
        const wrapper = document.createElement('span');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';

        const chip = document.createElement('span');
        chip.className = 'ingredient-chip missing';

        // Check if there's a remembered swap for this ingredient
        const remembered = this.swapMemory[ing.toLowerCase()];

        if (remembered) {
          chip.innerHTML = `<span style="text-decoration: line-through; opacity: 0.6">${ing}</span> → ${remembered} <span class="swap-memory-chip" style="display:inline;padding:0.1rem 0.3rem;font-size:0.65rem">💾</span>`;
          chip.classList.add('ingredient-chip', 'have');
          chip.style.background = 'hsl(160, 55%, 12%)';
          chip.style.borderColor = 'hsl(160, 55%, 24%)';
          chip.style.color = 'hsl(160, 75%, 60%)';
        } else {
          chip.innerHTML = `${ing} <button class="swap-btn" data-ing="${ing}">Swap ↔</button>`;

          // Swap popover
          chip.querySelector('.swap-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this._openSwapPopover(ing, recipe.name, chip, wrapper);
          });
        }

        // "Add to List" button
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-add-to-list' + (typeof ShoppingList !== 'undefined' && ShoppingList.hasItem(remembered || ing) ? ' added' : '');
        addBtn.textContent = typeof ShoppingList !== 'undefined' && ShoppingList.hasItem(remembered || ing) ? '✓ Added' : '+ List';
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const itemToAdd = remembered || ing;
          if (typeof ShoppingList !== 'undefined') {
            ShoppingList.addItem(itemToAdd, recipe.name);
            addBtn.textContent = '✓ Added';
            addBtn.classList.add('added');
            this._updateAddAllBtn(recipe, card);
          }
        });

        chip.appendChild(addBtn);
        wrapper.appendChild(chip);
        chips.appendChild(wrapper);
      });

      missingGroup.appendChild(chips);
      contentEl.appendChild(missingGroup);
    }

    // ── Section: Kitchen Staples (collapsible) ──
    if (staplesArea && pantry.length > 0) {
      staplesArea.innerHTML = '';
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'kitchen-staples-toggle';
      toggleBtn.innerHTML = `<span class="toggle-arrow">›</span> 🧂 Kitchen Staples used (${pantry.length}) · tap to see`;

      const body = document.createElement('div');
      body.className = 'kitchen-staples-body';
      pantry.forEach(s => {
        const chip = document.createElement('span');
        chip.className = 'kitchen-staple-chip';
        chip.textContent = s;
        body.appendChild(chip);
      });

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = body.classList.toggle('open');
        toggleBtn.classList.toggle('open', isOpen);
      });

      staplesArea.appendChild(toggleBtn);
      staplesArea.appendChild(body);
    }

    // ── Update Add All button ──
    this._updateAddAllBtn(recipe, card);

    if (addAllBtn) {
      addAllBtn.onclick = (e) => {
        e.stopPropagation();
        const toAdd = (recipe.missingIngredients || []).map(ing => ({
          name: this.swapMemory[ing.toLowerCase()] || ing,
          fromRecipe: recipe.name
        }));
        if (typeof ShoppingList !== 'undefined' && toAdd.length > 0) {
          ShoppingList.addItems(toAdd);
          addAllBtn.textContent = `✅ ${toAdd.length} item${toAdd.length !== 1 ? 's' : ''} added to list!`;
          addAllBtn.disabled = true;
          // Refresh + buttons
          this._renderIngredientPanel(recipe, card);
          if (typeof App !== 'undefined') App._showToast(`🛒 ${toAdd.length} items added to shopping list`, 'success');
        }
      };
    }
  },

  /** @private Update the "Add all" button text based on current shopping list state */
  _updateAddAllBtn(recipe, card) {
    const addAllBtn = card.querySelector(`#add-all-${recipe.id}`);
    if (!addAllBtn) return;
    const missing = recipe.missingIngredients || [];
    if (missing.length === 0) {
      addAllBtn.textContent = '✅ Nothing missing for this meal';
      addAllBtn.disabled = true;
      return;
    }
    const notYetAdded = missing.filter(ing => {
      const effective = this.swapMemory[ing.toLowerCase()] || ing;
      return typeof ShoppingList === 'undefined' || !ShoppingList.hasItem(effective);
    });
    if (notYetAdded.length === 0) {
      addAllBtn.textContent = '✅ All missing items added to list';
      addAllBtn.disabled = true;
    } else {
      addAllBtn.textContent = `Add all missing (${notYetAdded.length}) to Shopping List →`;
      addAllBtn.disabled = false;
    }
  },

  /**
   * Open a swap popover for a missing ingredient.
   * @private
   */
  _openSwapPopover(ingredient, recipeName, chipEl, wrapper) {
    // Close any existing popovers
    document.querySelectorAll('.swap-popover').forEach(p => p.remove());

    const swapReg = typeof SWAP_REGISTRY !== 'undefined' ? SWAP_REGISTRY : {};
    const options = swapReg[ingredient.toLowerCase()];

    if (!options || !Array.isArray(options) || options.length === 0) {
      if (typeof App !== 'undefined') App._showToast(`No known substitutes for "${ingredient}"`, 'info');
      return;
    }

    const haveSet = new Set([...this.groceries, ...this.pantryStaples]);

    const popover = document.createElement('div');
    popover.className = 'swap-popover';

    options.forEach(opt => {
      const inPantry = haveSet.has(opt.toLowerCase());
      const row = document.createElement('div');
      row.className = 'swap-option-row';

      const alreadyAdded = typeof ShoppingList !== 'undefined' && ShoppingList.hasItem(opt);

      row.innerHTML = `
        <span class="swap-option-name">${opt}</span>
        ${inPantry ? '<span class="swap-option-tag">✓ in your pantry</span>' : ''}
      `;

      const addBtn = document.createElement('button');
      addBtn.className = 'btn-add-to-list' + (alreadyAdded ? ' added' : '');
      addBtn.textContent = alreadyAdded ? '✓ Added' : '+ Add to List';

      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Remember the swap
        this.swapMemory[ingredient.toLowerCase()] = opt;
        this._saveSwapMemory();

        if (typeof ShoppingList !== 'undefined') {
          ShoppingList.addItem(opt, recipeName);
        }
        popover.remove();
        // Re-render the panel to show the remembered swap
        const card = chipEl.closest('.meal-card');
        if (card) {
          const recipe = this._findRecipeById(card);
          if (recipe) this._renderIngredientPanel(recipe, card);
        }
        if (typeof App !== 'undefined') App._showToast(`💾 Swap saved: ${ingredient} → ${opt}`, 'success');
      });

      row.appendChild(addBtn);
      popover.appendChild(row);
    });

    wrapper.appendChild(popover);

    // Close on outside click
    const closePopover = (e) => {
      if (!popover.contains(e.target)) {
        popover.remove();
        document.removeEventListener('click', closePopover);
      }
    };
    setTimeout(() => document.addEventListener('click', closePopover), 50);
  },

  /**
   * Find the recipe object for a given meal card DOM element.
   * @private
   */
  _findRecipeById(cardEl) {
    if (!this.currentPlan) return null;
    const panelEl = cardEl.querySelector('[id^="panel-"]');
    if (!panelEl) return null;
    const recipeId = panelEl.id.replace('panel-', '');
    for (const dayKey of Object.keys(this.currentPlan)) {
      for (const mealType of Object.keys(this.currentPlan[dayKey])) {
        const r = this.currentPlan[dayKey][mealType];
        if (r && r.id === recipeId) return r;
      }
    }
    return null;
  }
};
