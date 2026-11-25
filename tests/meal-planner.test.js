const { setupDomEnv, teardownDomEnv } = require('./helpers/dom-env');
const MealPlanner = require('../js/meal-planner');
const ShoppingList = require('../js/shopping-list');

describe('MealPlanner', () => {
  let dom;
  let container;

  beforeEach(() => {
    jest.useFakeTimers();
    dom = setupDomEnv();
    global.ShoppingList = ShoppingList;
    ShoppingList.items = [];
    ShoppingList.init();
    container = document.getElementById('app-main');
    MealPlanner.currentPlan = null;
    MealPlanner.swapMemory = {};
    MealPlanner.personalSwaps = {};
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    delete global.ShoppingList;
    teardownDomEnv(dom);
  });

  test('normalizes ingredients across synonyms, modifiers, and plurals', () => {
    expect(MealPlanner._normalizeIngredient('Fresh Bhindi')).toBe('okra');
    expect(MealPlanner._normalizeIngredient('chopped coriander leaves')).toBe('cilantro');
    expect(MealPlanner._normalizeIngredient('organic tomatoes')).toBe('tomato');
    expect(MealPlanner._normalizeIngredient('diced chicken breast')).toBe('chicken');
  });

  test('generates a complete 7-day x 3-meal plan for selected cuisines', () => {
    const plan = MealPlanner.generatePlan(
      ['chicken', 'rice', 'tomato', 'onion', 'garlic', 'egg'],
      ['indian', 'italian'],
      [],
      ['salt', 'oil']
    );

    expect(Object.keys(plan)).toEqual([
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    ]);

    Object.values(plan).forEach(dayPlan => {
      expect(dayPlan.breakfast).toBeDefined();
      expect(dayPlan.lunch).toBeDefined();
      expect(dayPlan.dinner).toBeDefined();
      expect(['Indian', 'Italian']).toContain(dayPlan.dinner.cuisine);
    });
  });

  test('hard-filters allergies including substring matches and allergen groups (regression)', () => {
    // Peanut allergy should exclude both "peanut" and "peanut butter"
    const peanutPlan = MealPlanner.generatePlan(
      ['rice', 'noodle', 'chicken'],
      ['thai', 'indian', 'chinese'],
      [{ name: 'Sam', dietaryFlags: [], allergies: ['peanut'] }],
      ['salt', 'oil']
    );

    Object.values(peanutPlan).forEach(day => {
      Object.values(day).forEach(recipe => {
        const hasPeanut = (recipe.ingredients || []).some(i => i.toLowerCase().includes('peanut'));
        expect(hasPeanut).toBe(false);
      });
    });

    // Dairy allergen group should exclude butter, cream, cheese, paneer, milk, yogurt, ghee
    const dairyPlan = MealPlanner.generatePlan(
      ['chicken', 'rice', 'tomato', 'onion'],
      ['indian', 'italian', 'mexican'],
      [{ name: 'Alex', dietaryFlags: [], allergies: ['dairy'] }],
      ['salt', 'oil']
    );

    const dairyTerms = ['milk', 'butter', 'cream', 'cheese', 'paneer', 'yogurt', 'ghee', 'mozzarella', 'parmesan'];
    Object.values(dairyPlan).forEach(day => {
      Object.values(day).forEach(recipe => {
        const hasDairy = (recipe.ingredients || []).some(i =>
          dairyTerms.some(d => i.toLowerCase().includes(d))
        );
        expect(hasDairy).toBe(false);
      });
    });
  });

  test('shuffle option produces varied plans across regenerations (regression)', () => {
    const base = MealPlanner.generatePlan(
      ['chicken', 'rice', 'tomato', 'onion', 'garlic', 'pasta'],
      ['indian', 'italian', 'mexican', 'chinese'],
      [],
      ['salt', 'oil']
    );
    const baseSignature = JSON.stringify(
      Object.values(base).map(d => [d.breakfast.id, d.lunch.id, d.dinner.id])
    );

    let foundDifferent = false;
    for (let attempt = 0; attempt < 8; attempt++) {
      const next = MealPlanner.generatePlan(
        ['chicken', 'rice', 'tomato', 'onion', 'garlic', 'pasta'],
        ['indian', 'italian', 'mexican', 'chinese'],
        [],
        ['salt', 'oil'],
        { shuffle: true }
      );
      const sig = JSON.stringify(
        Object.values(next).map(d => [d.breakfast.id, d.lunch.id, d.dinner.id])
      );
      if (sig !== baseSignature) {
        foundDifferent = true;
        break;
      }
    }

    expect(foundDifferent).toBe(true);
  });

  test('resolves swap options for both ingredient arrays and protein objects (regression)', () => {
    // Standard array entry
    const creamSwaps = MealPlanner._getSwapOptions('heavy cream');
    expect(creamSwaps).toEqual(['coconut cream', 'yogurt', 'evaporated milk']);

    // Protein object entry (excludes original protein "chicken")
    const chickenSwaps = MealPlanner._getSwapOptions('chicken');
    expect(chickenSwaps).toEqual(['tofu', 'paneer', 'shrimp']);
    expect(chickenSwaps).not.toContain('chicken');

    // Unknown ingredient returns empty array
    expect(MealPlanner._getSwapOptions('unobtanium')).toEqual([]);
  });

  test('opens swap popover for missing proteins and detects normalized pantry matches (regression)', () => {
    MealPlanner.groceries = ['fresh tofu', 'tomato'];
    MealPlanner.pantryStaples = ['salt'];

    const wrapper = document.createElement('span');
    const chip = document.createElement('span');
    wrapper.appendChild(chip);
    document.body.appendChild(wrapper);

    MealPlanner._openSwapPopover('chicken', 'Butter Chicken', chip, wrapper);

    const popover = wrapper.querySelector('.swap-popover');
    expect(popover).not.toBeNull();
    const optionNames = Array.from(popover.querySelectorAll('.swap-option-name')).map(el => el.textContent);
    expect(optionNames).toEqual(['tofu', 'paneer', 'shrimp']);

    // "fresh tofu" normalized to "tofu" should trigger "in your pantry" badge
    const rows = popover.querySelectorAll('.swap-option-row');
    expect(rows[0].querySelector('.swap-option-tag')).not.toBeNull();
    expect(rows[1].querySelector('.swap-option-tag')).toBeNull();
  });

  test('computes swap-adjusted day missing counts and updates day badge on personal swaps (regression)', () => {
    const profiles = [{ name: 'Maya', dietaryFlags: ['vegan'], allergies: [] }];
    MealPlanner.render(
      container,
      ['tofu', 'tomato', 'onion', 'garlic', 'ginger', 'garam masala'],
      ['indian'],
      profiles,
      ['salt', 'oil', 'butter']
    );

    const mondayBlock = document.getElementById('day-block-monday');
    expect(mondayBlock).not.toBeNull();

    // Expected total missing for Monday uses swap-adjusted counts
    const expectedMondayMissing = Object.values(MealPlanner.currentPlan.monday).reduce(
      (sum, r) => sum + MealPlanner._getRecipeServingsAndIngredients(r).missing.length,
      0
    );
    const badgeText = mondayBlock.querySelector('.day-missing-badge').textContent;
    if (expectedMondayMissing > 0) {
      expect(badgeText).toBe(`${expectedMondayMissing} missing`);
    } else {
      expect(badgeText).toBe('✓ All covered');
    }
  });

  test('builds valid iCalendar (.ics) content with 21 weekly events', () => {
    MealPlanner.generatePlan(
      ['chicken', 'rice', 'tomato', 'egg'],
      ['indian', 'italian'],
      [],
      ['salt', 'oil']
    );

    const ics = MealPlanner._buildCalendarICS();
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR')).toBe(true);

    const events = ics.match(/BEGIN:VEVENT/g) || [];
    expect(events).toHaveLength(21);
  });
});
