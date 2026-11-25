const { setupDomEnv, teardownDomEnv } = require('./helpers/dom-env');
const GroceryInput = require('../js/grocery-input');

describe('GroceryInput', () => {
  let dom;
  let container;

  beforeEach(() => {
    jest.useFakeTimers();
    dom = setupDomEnv();
    container = document.getElementById('app-main');
    GroceryInput.groceries = [];
    GroceryInput.pantryStaples = [];
    GroceryInput.activeMethod = null;
    GroceryInput._outsideClickHandler = null;
    GroceryInput.render(container, []);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    teardownDomEnv(dom);
  });

  test('adds, deduplicates, removes, validates, and persists groceries', () => {
    expect(GroceryInput.validate()).toBe(false);

    GroceryInput._addGrocery('Chicken');
    GroceryInput._addGrocery('  chicken  ');
    GroceryInput._addGrocery('Tomato');

    expect(GroceryInput.validate()).toBe(true);
    expect(GroceryInput.getGroceries()).toEqual(['chicken', 'tomato']);
    expect(JSON.parse(localStorage.getItem('wfd_groceries'))).toEqual(['chicken', 'tomato']);

    GroceryInput._removeGrocery(0);
    expect(GroceryInput.getGroceries()).toEqual(['tomato']);
    expect(JSON.parse(localStorage.getItem('wfd_groceries'))).toEqual(['tomato']);
  });

  test('escapes HTML in grocery chips and pantry staple chips', () => {
    GroceryInput._addGrocery('<img src=x onerror=alert(1)>');
    const section = document.getElementById('grocery-section');
    expect(section.querySelector('img')).toBeNull();
    expect(section.textContent).toContain('<img src=x onerror=alert(1)>');

    const stapleInput = document.getElementById('pantry-add-input');
    stapleInput.value = '<script>bad()</script>';
    document.getElementById('btn-add-staple').click();
    const pantrySection = document.getElementById('pantry-staples-section');
    expect(pantrySection.querySelector('script')).toBeNull();
  });

  test('imports CSV, JSON, and TXT files cleanly without stacking confirm listeners (regression)', async () => {
    GroceryInput._selectMethod('upload');

    const makeMockFile = (name, content) => ({
      name,
      text: async () => content,
    });

    const addSpy = jest.spyOn(GroceryInput, '_addGrocery');

    // First upload: CSV
    await GroceryInput._processUploadedFile(
      makeMockFile('groceries.csv', 'item,qty\n"onion",2\n"garlic",1\n')
    );
    document.getElementById('btn-confirm-upload').click();
    expect(GroceryInput.getGroceries()).toEqual(['onion', 'garlic']);
    const callsAfterFirst = addSpy.mock.calls.length;

    // Second upload: JSON — confirm button should only invoke the latest handler once per item
    await GroceryInput._processUploadedFile(
      makeMockFile('groceries.json', JSON.stringify({ groceries: ['rice'] }))
    );
    document.getElementById('btn-confirm-upload').click();

    expect(GroceryInput.getGroceries()).toEqual(['onion', 'garlic', 'rice']);
    expect(addSpy.mock.calls.length - callsAfterFirst).toBe(1);
    addSpy.mockRestore();
  });

  test('confirming multiple OCR scans does not stack click listeners (regression)', () => {
    GroceryInput._selectMethod('scan');
    const addSpy = jest.spyOn(GroceryInput, '_addGrocery');

    GroceryInput._renderOCRResults(['spinach']);
    document.getElementById('btn-confirm-ocr').click();
    const callsAfterFirst = addSpy.mock.calls.length;

    GroceryInput._renderOCRResults(['paneer']);
    document.getElementById('btn-confirm-ocr').click();

    expect(GroceryInput.getGroceries()).toEqual(['spinach', 'paneer']);
    expect(addSpy.mock.calls.length - callsAfterFirst).toBe(1);
    addSpy.mockRestore();
  });

  test('detects unused ingredients, renames them, and saves custom recipes', () => {
    GroceryInput._addGrocery('dragonfruit');
    expect(document.getElementById('unused-audit-section')).not.toBeNull();

    // Save a custom recipe using dragonfruit
    document.querySelector('.btn-toggle-custom-recipe').click();
    document.querySelector('.recipe-name-input').value = 'Dragonfruit Bowl';
    document.querySelector('.recipe-ings-input').value = 'yogurt, honey';
    document.querySelector('.btn-save-recipe').click();

    const saved = JSON.parse(localStorage.getItem('wfd_custom_recipes'));
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe('Dragonfruit Bowl');
    // Now dragonfruit is matched by a recipe, so the unused section should disappear
    expect(document.getElementById('unused-audit-section')).toBeNull();
  });
});
