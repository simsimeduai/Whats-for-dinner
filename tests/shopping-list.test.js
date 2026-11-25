const { setupDomEnv, teardownDomEnv } = require('./helpers/dom-env');
const ShoppingList = require('../js/shopping-list');

describe('ShoppingList', () => {
  let dom;

  beforeEach(() => {
    dom = setupDomEnv();
    ShoppingList.items = [];
    ShoppingList.isOpen = false;
    ShoppingList._panel = null;
    ShoppingList._overlay = null;
    ShoppingList._fab = null;
    ShoppingList.init();
  });

  afterEach(() => {
    teardownDomEnv(dom);
  });

  test('adds items with category lookup, deduplicates, and merges recipe sources', () => {
    ShoppingList.addItem('Chicken', 'Butter Chicken');
    ShoppingList.addItem('chicken', 'Chicken Tikka Masala');
    ShoppingList.addItem('tomato', 'Butter Chicken');

    expect(ShoppingList.getTotalCount()).toBe(2);
    expect(ShoppingList.getCount()).toBe(2);
    expect(ShoppingList.hasItem('CHICKEN')).toBe(true);

    const chicken = ShoppingList.items.find(i => i.name === 'chicken');
    expect(chicken.category).toBe('Proteins');
    expect(chicken.fromRecipes).toEqual(['Butter Chicken', 'Chicken Tikka Masala']);

    const tomato = ShoppingList.items.find(i => i.name === 'tomato');
    expect(tomato.category).toBe('Produce');
  });

  test('persists to localStorage and reloads cleanly', () => {
    ShoppingList.addItem('garlic', 'Dal Rice');
    ShoppingList.items = [];
    ShoppingList._loadFromStorage();

    expect(ShoppingList.items).toHaveLength(1);
    expect(ShoppingList.items[0].name).toBe('garlic');
  });

  test('toggles checked state and updates unchecked count', () => {
    ShoppingList.addItem('spinach', 'Palak Paneer');
    ShoppingList.open();

    const checkbox = document.querySelector('.shopping-item-check');
    expect(checkbox).not.toBeNull();
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(ShoppingList.getCount()).toBe(0);
    expect(ShoppingList.getTotalCount()).toBe(1);
  });

  test('removes individual items and clears all items', () => {
    ShoppingList.addItems([
      { name: 'onion', fromRecipe: 'Dal Rice' },
      { name: 'rice', fromRecipe: 'Dal Rice' },
    ]);
    ShoppingList.removeItem('onion');
    expect(ShoppingList.getTotalCount()).toBe(1);
    expect(ShoppingList.hasItem('onion')).toBe(false);

    ShoppingList.clearAll();
    expect(ShoppingList.getTotalCount()).toBe(0);
  });

  test('escapes HTML in item and recipe names', () => {
    ShoppingList.addItem('<img src=x onerror=alert(1)>', '<b>Bad Recipe</b>');
    ShoppingList.open();

    const body = document.getElementById('panel-body');
    expect(body.querySelector('img')).toBeNull();
    expect(body.querySelector('b')).toBeNull();
    expect(body.textContent).toContain('<img src=x onerror=alert(1)>');
  });
});
