const StorageAdapter = require('../js/storage-adapter');
const OCREngine = require('../js/ocr-engine');
const RecipeData = require('../js/recipe-data');
const MealPlanner = require('../js/meal-planner');

// Expose RecipeData globals for MealPlanner in Node test environment
global.RECIPES = RecipeData.RECIPES;
global.SWAP_REGISTRY = RecipeData.SWAP_REGISTRY;
global.INGREDIENT_CATEGORIES = RecipeData.INGREDIENT_CATEGORIES;
global.DEFAULT_PANTRY_STAPLES = RecipeData.DEFAULT_PANTRY_STAPLES;
global.StorageAdapter = StorageAdapter;

describe('StorageAdapter (Web + Native Preferences)', () => {
  beforeEach(() => {
    StorageAdapter._cache.clear();
    StorageAdapter._preferences = null;
    StorageAdapter._initialized = false;
  });

  test('hydrates from native Preferences plugin and syncs writes', async () => {
    const mockNativeStore = new Map([
      ['wfd_shopping_list', JSON.stringify([{ name: 'garlic', category: 'Produce', checked: false }])]
    ]);

    const mockPreferences = {
      get: jest.fn(async ({ key }) => ({ value: mockNativeStore.get(key) ?? null })),
      set: jest.fn(async ({ key, value }) => { mockNativeStore.set(key, value); }),
      remove: jest.fn(async ({ key }) => { mockNativeStore.delete(key); })
    };

    await StorageAdapter.init(mockPreferences);

    const list = StorageAdapter.getJSON('wfd_shopping_list', []);
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('garlic');

    StorageAdapter.setJSON('wfd_session_state', { currentStep: 2, groceries: ['chicken'] });
    expect(StorageAdapter.getJSON('wfd_session_state', null)).toEqual({
      currentStep: 2,
      groceries: ['chicken']
    });
    expect(mockPreferences.set).toHaveBeenCalledWith({
      key: 'wfd_session_state',
      value: JSON.stringify({ currentStep: 2, groceries: ['chicken'] })
    });

    StorageAdapter.removeItem('wfd_session_state');
    expect(StorageAdapter.getItem('wfd_session_state')).toBeNull();
    expect(mockPreferences.remove).toHaveBeenCalledWith({ key: 'wfd_session_state' });
  });
});

describe('OCREngine.parseReceiptText', () => {
  test('extracts clean grocery items while filtering receipt noise', () => {
    const sampleReceipt = `
      FRESH MARKET GROCERY INC
      123 MAIN ST
      (555) 123-4567
      04/12/2026 14:32
      2 x Chicken Breast 1.5 lb   $9.99 F
      Organic Spinach 500g        $3.49 T
      Roma Tomato                 $2.25
      SUBTOTAL                   $15.73
      TAX                         $0.95
      TOTAL                      $16.68
      VISA CARD APPROVED
    `;

    const items = OCREngine.parseReceiptText(sampleReceipt);
    expect(items).toContain('chicken breast');
    expect(items).toContain('organic spinach');
    expect(items).toContain('roma tomato');
    expect(items.some(i => i.includes('subtotal') || i.includes('total') || i.includes('visa'))).toBe(false);
  });
});

describe('MealPlanner.generatePlan', () => {
  test('generates a complete 7-day x 3-meal plan and enforces allergy hard filters', () => {
    const profiles = [
      { name: 'Alex', dietaryFlags: ['vegetarian'], allergies: ['peanut'] }
    ];
    const plan = MealPlanner.generatePlan(
      ['chicken', 'rice', 'tomato', 'onion', 'garlic', 'pasta'],
      ['indian', 'italian'],
      profiles,
      ['oil', 'salt', 'black pepper']
    );

    expect(Object.keys(plan)).toHaveLength(7);
    for (const day of MealPlanner.DAYS) {
      const dayPlan = plan[day.toLowerCase()];
      expect(dayPlan.breakfast).toBeDefined();
      expect(dayPlan.lunch).toBeDefined();
      expect(dayPlan.dinner).toBeDefined();

      // Verify allergy ingredient is completely excluded
      Object.values(dayPlan).forEach((recipe) => {
        const ingredients = (recipe.ingredients || []).map(i => i.toLowerCase());
        expect(ingredients).not.toContain('peanut');
      });
    }
  });

  test('normalizes regional synonyms and plurals accurately', () => {
    expect(MealPlanner._normalizeIngredient('Fresh Bhindi')).toBe('okra');
    expect(MealPlanner._normalizeIngredient('Organic Coriander Leaves')).toBe('cilantro');
    expect(MealPlanner._normalizeIngredient('chopped tomatoes')).toBe('tomato');
  });
});
