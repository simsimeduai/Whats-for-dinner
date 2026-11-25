const { setupDomEnv, teardownDomEnv } = require('./helpers/dom-env');
const GroceryInput = require('../js/grocery-input');
const CuisinePicker = require('../js/cuisine-picker');
const MealPlanner = require('../js/meal-planner');
const ShoppingList = require('../js/shopping-list');
const App = require('../js/app');

describe('App 3-step wizard integration', () => {
  let dom;

  beforeEach(() => {
    jest.useFakeTimers();
    dom = setupDomEnv({ loadIndexHtml: true });

    global.GroceryInput = GroceryInput;
    global.CuisinePicker = CuisinePicker;
    global.MealPlanner = MealPlanner;
    global.ShoppingList = ShoppingList;
    global.App = App;

    // Reset module state
    App.currentStep = 1;
    App.groceries = [];
    App.selectedCuisines = [];
    App.profiles = [];
    App.pantryStaples = [];
    App.mealPlan = null;
    GroceryInput.groceries = [];
    CuisinePicker._profiles = [];
    ShoppingList.items = [];
  });

  afterEach(() => {
    jest.useRealTimers();
    delete global.GroceryInput;
    delete global.CuisinePicker;
    delete global.MealPlanner;
    delete global.ShoppingList;
    delete global.App;
    teardownDomEnv(dom);
  });

  test('restores persisted groceries and selected cuisines on init (regression)', () => {
    localStorage.setItem('wfd_groceries', JSON.stringify(['chicken', 'rice']));
    localStorage.setItem('wfd_selected_cuisines', JSON.stringify(['indian', 'italian']));

    App.init();

    expect(App.groceries).toEqual(['chicken', 'rice']);
    expect(App.selectedCuisines).toEqual(['indian', 'italian']);
    expect(GroceryInput.getGroceries()).toEqual(['chicken', 'rice']);
  });

  test('preserves Step 2 cuisine selections when navigating Back to Step 1 (regression)', () => {
    App.init();

    // Step 1: add grocery & move to Step 2
    GroceryInput._addGrocery('chicken');
    document.getElementById('btn-next').click();
    jest.advanceTimersByTime(300);
    expect(App.currentStep).toBe(2);

    // Step 2: select cuisines, then go Back to Step 1
    const mexicanCard = document.querySelector('.cuisine-card[data-cuisine-id="mexican"]');
    mexicanCard.click();
    document.getElementById('btn-back').click();
    jest.advanceTimersByTime(300);

    expect(App.currentStep).toBe(1);
    expect(App.selectedCuisines).toEqual(['mexican']);

    // Return to Step 2 and verify Mexican is still selected
    document.getElementById('btn-next').click();
    jest.advanceTimersByTime(300);
    expect(App.currentStep).toBe(2);
    expect(CuisinePicker.getSelected()).toEqual(['mexican']);
  });

  test('hides stepper and shows ShoppingList FAB on Step 3', () => {
    App.init();
    GroceryInput._addGrocery('chicken');

    // Step 1 -> Step 2
    document.getElementById('btn-next').click();
    jest.advanceTimersByTime(300);
    expect(document.getElementById('stepper').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('shopping-fab').classList.contains('hidden')).toBe(true);

    // Step 2 -> Step 3
    document.querySelector('.cuisine-card[data-cuisine-id="indian"]').click();
    document.getElementById('btn-next').click();
    jest.advanceTimersByTime(300);

    expect(App.currentStep).toBe(3);
    expect(document.getElementById('stepper').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('shopping-fab').classList.contains('hidden')).toBe(false);
    expect(document.querySelectorAll('.day-block')).toHaveLength(7);
  });

  test('renders stepper inside compact top header and navigates home when clicking logo', () => {
    App.init();
    const header = document.getElementById('app-header');
    const stepper = document.getElementById('stepper');
    expect(header.contains(stepper)).toBe(true);

    // Move to Step 2 then click logo to return to Step 1
    GroceryInput._addGrocery('chicken');
    document.getElementById('btn-next').click();
    jest.advanceTimersByTime(300);
    expect(App.currentStep).toBe(2);

    document.getElementById('app-logo').click();
    jest.advanceTimersByTime(300);
    expect(App.currentStep).toBe(1);
  });
});

