const { setupDomEnv, teardownDomEnv } = require('./helpers/dom-env');
const CuisinePicker = require('../js/cuisine-picker');

describe('CuisinePicker', () => {
  let dom;
  let container;

  beforeEach(() => {
    jest.useFakeTimers();
    dom = setupDomEnv();
    container = document.getElementById('app-main');
    CuisinePicker._profiles = [];
    CuisinePicker._expandedProfileIdx = null;
    CuisinePicker.render(container, []);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    teardownDomEnv(dom);
  });

  test('renders all 12 cuisines and validates non-empty selection', () => {
    const cards = container.querySelectorAll('.cuisine-card');
    expect(cards.length).toBe(12);
    expect(CuisinePicker.validate()).toBe(false);

    cards[0].click();
    expect(CuisinePicker.validate()).toBe(true);
    expect(CuisinePicker.getSelected()).toEqual(['indian']);
    expect(cards[0].getAttribute('aria-checked')).toBe('true');

    // Persists selection to localStorage
    expect(JSON.parse(localStorage.getItem('wfd_selected_cuisines'))).toEqual(['indian']);
  });

  test('Select All / Deselect All updates aria-checked on every card (regression)', () => {
    const toggleBtn = container.querySelector('.cuisine-toggle-all');
    const cards = Array.from(container.querySelectorAll('.cuisine-card'));

    toggleBtn.click();
    expect(CuisinePicker.getSelected()).toHaveLength(12);
    expect(cards.every(c => c.getAttribute('aria-checked') === 'true')).toBe(true);
    expect(toggleBtn.textContent).toBe('Deselect All');

    toggleBtn.click();
    expect(CuisinePicker.getSelected()).toHaveLength(0);
    expect(cards.every(c => c.getAttribute('aria-checked') === 'false')).toBe(true);
    expect(toggleBtn.textContent).toBe('Select All');
  });

  test('manages household dietary profiles, allergies, and escapes HTML', () => {
    document.getElementById('btn-add-person').click();
    expect(CuisinePicker.getProfiles()).toHaveLength(1);

    const nameInput = document.querySelector('.profile-name-input');
    nameInput.value = '<script>alert(1)</script>';
    nameInput.dispatchEvent(new Event('input'));

    const veganChip = document.querySelector('.diet-chip[data-flag="vegan"]');
    veganChip.click();

    const allergyInput = document.getElementById('allergy-input-0');
    allergyInput.value = '<b>peanut</b>';
    document.getElementById('btn-add-allergy-0').click();

    // Collapse to capsule view and verify escaping
    document.querySelector('.btn-profile-done').click();
    const list = document.getElementById('profiles-list');
    expect(list.querySelector('script')).toBeNull();
    expect(list.querySelector('b')).toBeNull();

    const restrictions = CuisinePicker.getHouseholdRestrictions();
    expect(restrictions.flags).toContain('vegan');
    expect(restrictions.allergies).toContain('<b>peanut</b>');
  });
});
