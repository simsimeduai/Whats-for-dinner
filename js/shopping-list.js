/**
 * ShoppingList — Slide-up panel module for "What's for Dinner"
 *
 * Not a wizard step. A persistent bottom-sheet drawer accessible
 * from Step 3 that accumulates missing ingredients from meal cards.
 * Grouped by store section, checkable, printable.
 */
const ShoppingList = {
  /** @type {Array<{name: string, category: string, fromRecipe: string, checked: boolean}>} */
  items: [],

  /** @type {boolean} Whether the panel is currently open */
  isOpen: false,

  /** @type {HTMLElement|null} Panel DOM element */
  _panel: null,

  /** @type {HTMLElement|null} Overlay DOM element */
  _overlay: null,

  /** @type {HTMLElement|null} FAB button */
  _fab: null,

  /* ══════════════════════════════════════════════════════════════════════
     Initialization
     ══════════════════════════════════════════════════════════════════════ */

  /** Initialize the shopping list — load from localStorage and create DOM elements. */
  init() {
    this._loadFromStorage();
    this._createPanel();
    this._createFAB();
  },

  /* ══════════════════════════════════════════════════════════════════════
     Public API
     ══════════════════════════════════════════════════════════════════════ */

  /**
   * Add an ingredient to the shopping list.
   * Deduplicates by ingredient name.
   * @param {string} name - Ingredient name
   * @param {string} fromRecipe - Recipe name this came from
   */
  addItem(name, fromRecipe = '') {
    const normalized = name.toLowerCase().trim();
    if (!normalized) return;

    // Check for existing item — if already there, just append recipe reference
    const existing = this.items.find(i => i.name === normalized);
    if (existing) {
      if (fromRecipe && !existing.fromRecipes.includes(fromRecipe)) {
        existing.fromRecipes.push(fromRecipe);
        this._saveToStorage();
        this._updatePanel();
        this._updateFAB();
      }
      return;
    }

    const category = this._getCategory(normalized);
    this.items.push({
      name: normalized,
      category,
      fromRecipes: fromRecipe ? [fromRecipe] : [],
      checked: false
    });

    this._saveToStorage();
    this._updatePanel();
    this._updateFAB();
  },

  /**
   * Add multiple items at once.
   * @param {Array<{name: string, fromRecipe: string}>} items
   */
  addItems(items) {
    items.forEach(({ name, fromRecipe }) => this.addItem(name, fromRecipe));
  },

  /**
   * Remove an item from the list.
   * @param {string} name
   */
  removeItem(name) {
    this.items = this.items.filter(i => i.name !== name.toLowerCase().trim());
    this._saveToStorage();
    this._updatePanel();
    this._updateFAB();
  },

  /**
   * Clear all items from the list.
   */
  clearAll() {
    this.items = [];
    this._saveToStorage();
    this._updatePanel();
    this._updateFAB();
  },

  /**
   * Get unchecked item count.
   * @returns {number}
   */
  getCount() {
    return this.items.filter(i => !i.checked).length;
  },

  /**
   * Get total item count.
   * @returns {number}
   */
  getTotalCount() {
    return this.items.length;
  },

  /**
   * Check if an ingredient is already in the list.
   * @param {string} name
   * @returns {boolean}
   */
  hasItem(name) {
    return this.items.some(i => i.name === name.toLowerCase().trim());
  },

  /**
   * Open the shopping list panel.
   */
  open() {
    if (!this._panel) this._createPanel();
    this._overlay.classList.add('active');
    this._panel.classList.add('open');
    this.isOpen = true;
    this._updatePanel();
    document.body.style.overflow = 'hidden';
  },

  /**
   * Close the shopping list panel.
   */
  close() {
    this._panel?.classList.remove('open');
    this._overlay?.classList.remove('active');
    this.isOpen = false;
    document.body.style.overflow = '';
  },

  /**
   * Show or hide the FAB based on current step.
   * @param {boolean} visible
   */
  setFABVisible(visible) {
    if (this._fab) {
      this._fab.classList.toggle('hidden', !visible);
    }
  },

  /* ══════════════════════════════════════════════════════════════════════
     Private — DOM Creation
     ══════════════════════════════════════════════════════════════════════ */

  /** Create the overlay backdrop. */
  _createPanel() {
    // Remove existing if present
    document.getElementById('shopping-panel-overlay')?.remove();
    document.getElementById('shopping-panel')?.remove();

    // Overlay
    this._overlay = document.createElement('div');
    this._overlay.className = 'shopping-panel-overlay';
    this._overlay.id = 'shopping-panel-overlay';
    this._overlay.addEventListener('click', () => this.close());
    document.body.appendChild(this._overlay);

    // Panel
    this._panel = document.createElement('div');
    this._panel.className = 'shopping-panel';
    this._panel.id = 'shopping-panel';
    this._panel.setAttribute('role', 'dialog');
    this._panel.setAttribute('aria-label', 'Shopping List');
    this._panel.innerHTML = `
      <div class="panel-drag-handle" id="panel-drag-handle"></div>
      <div class="panel-header">
        <div class="panel-title-row">
          <span class="panel-title">🛒 Shopping List</span>
          <span class="panel-count-badge" id="panel-count-badge">0 items</span>
        </div>
        <p class="panel-subtitle">Collected from your weekly meal plan</p>
      </div>
      <div class="panel-body" id="panel-body">
        <!-- List content rendered dynamically -->
      </div>
      <div class="panel-actions">
        <button class="btn btn-secondary btn-panel" id="btn-print-list" aria-label="Print shopping list">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print List
        </button>
        <button class="btn btn-instacart btn-panel" id="btn-instacart" aria-label="Order via Instacart (coming soon)" disabled>
          🥕 Order via Instacart
          <span class="coming-soon-badge">Coming Soon</span>
        </button>
      </div>
    `;
    document.body.appendChild(this._panel);

    // Event listeners
    document.getElementById('btn-print-list')?.addEventListener('click', () => this._printList());
    document.getElementById('btn-instacart')?.addEventListener('click', () => {
      App._showToast('Instacart integration coming soon! 🥕', 'info');
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  },

  /** Create the floating action button. */
  _createFAB() {
    document.getElementById('shopping-fab')?.remove();
    this._fab = document.createElement('button');
    this._fab.className = 'shopping-fab hidden';
    this._fab.id = 'shopping-fab';
    this._fab.setAttribute('aria-label', 'Open shopping list');
    this._fab.innerHTML = `
      🛒 <span class="fab-count" id="fab-count">0</span>
    `;
    this._fab.addEventListener('click', () => this.open());
    document.body.appendChild(this._fab);
  },

  /* ══════════════════════════════════════════════════════════════════════
     Private — Rendering
     ══════════════════════════════════════════════════════════════════════ */

  /** Refresh the panel body content. */
  _updatePanel() {
    const body = document.getElementById('panel-body');
    const countBadge = document.getElementById('panel-count-badge');
    if (!body) return;

    const total = this.items.length;
    const unchecked = this.getCount();
    if (countBadge) {
      countBadge.textContent = `${total} item${total !== 1 ? 's' : ''}`;
    }

    if (total === 0) {
      body.innerHTML = `
        <div class="panel-empty">
          <span class="panel-empty-icon">🛒</span>
          <p class="panel-empty-text">No items yet</p>
          <p class="panel-empty-hint">Open a meal card and tap "Add to List" or "Add all missing"</p>
        </div>
      `;
      return;
    }

    // Group by category
    const SECTION_ORDER = ['Proteins', 'Produce', 'Dairy & Eggs', 'Pantry', 'Spices & Seasonings', 'Other'];
    const grouped = {};
    SECTION_ORDER.forEach(s => { grouped[s] = []; });
    this.items.forEach(item => {
      const cat = SECTION_ORDER.includes(item.category) ? item.category : 'Other';
      grouped[cat].push(item);
    });

    const SECTION_ICONS = {
      'Proteins': '🥩',
      'Produce': '🥦',
      'Dairy & Eggs': '🧀',
      'Pantry': '🫙',
      'Spices & Seasonings': '🧂',
      'Other': '📦'
    };

    body.innerHTML = '';

    // Clear all button
    const clearRow = document.createElement('div');
    clearRow.className = 'panel-clear-row';
    clearRow.innerHTML = `
      <span class="panel-progress-text">${unchecked} remaining · ${total - unchecked} in cart</span>
      <button class="btn-clear-list" id="btn-clear-list">Clear all</button>
    `;
    body.appendChild(clearRow);
    document.getElementById('btn-clear-list')?.addEventListener('click', () => {
      if (confirm('Clear your entire shopping list?')) this.clearAll();
    });

    // Sections
    SECTION_ORDER.forEach(section => {
      const sectionItems = grouped[section];
      if (sectionItems.length === 0) return;

      const sectionEl = document.createElement('div');
      sectionEl.className = 'shopping-section';
      sectionEl.innerHTML = `
        <div class="shopping-section-header">
          <span>${SECTION_ICONS[section]} ${section}</span>
          <span class="section-count">${sectionItems.length}</span>
        </div>
      `;

      sectionItems.forEach(item => {
        const row = document.createElement('label');
        row.className = 'shopping-item-row' + (item.checked ? ' checked' : '');
        const recipeText = item.fromRecipes.length > 0
          ? `<span class="item-recipe-tag">from ${item.fromRecipes.join(', ')}</span>`
          : '';
        row.innerHTML = `
          <input type="checkbox" class="shopping-item-check" ${item.checked ? 'checked' : ''}
            aria-label="Mark ${item.name} as in cart" />
          <span class="item-name">${item.name}</span>
          ${recipeText}
        `;
        row.querySelector('.shopping-item-check').addEventListener('change', (e) => {
          item.checked = e.target.checked;
          row.classList.toggle('checked', item.checked);
          this._saveToStorage();
          this._updateFAB();
          // Update progress text
          const progressEl = body.querySelector('.panel-progress-text');
          if (progressEl) {
            const unc = this.getCount();
            progressEl.textContent = `${unc} remaining · ${this.items.length - unc} in cart`;
          }
        });
        sectionEl.appendChild(row);
      });

      body.appendChild(sectionEl);
    });
  },

  /** Update the FAB badge count. */
  _updateFAB() {
    const fabCount = document.getElementById('fab-count');
    if (fabCount) fabCount.textContent = this.getTotalCount();
    // Show FAB if there are items
    if (this._fab) {
      this._fab.classList.toggle('has-items', this.getTotalCount() > 0);
    }
  },

  /** Open print dialog with a clean list. */
  _printList() {
    const printArea = document.getElementById('print-shopping-list');
    if (printArea) printArea.remove();

    const SECTION_ORDER = ['Proteins', 'Produce', 'Dairy & Eggs', 'Pantry', 'Spices & Seasonings', 'Other'];
    const grouped = {};
    SECTION_ORDER.forEach(s => { grouped[s] = []; });
    this.items.forEach(item => {
      const cat = SECTION_ORDER.includes(item.category) ? item.category : 'Other';
      grouped[cat].push(item);
    });

    let html = `<div id="print-shopping-list" style="display:none">`;
    html += `<h2>🛒 Shopping List — What's for Dinner</h2>`;
    SECTION_ORDER.forEach(section => {
      const sectionItems = grouped[section];
      if (sectionItems.length === 0) return;
      html += `<h3>${section}</h3><ul>`;
      sectionItems.forEach(item => {
        html += `<li>${item.name}</li>`;
      });
      html += `</ul>`;
    });
    html += `</div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    document.body.classList.add('print-mode-shopping-list');

    const cleanUpPrint = () => {
      document.body.classList.remove('print-mode-shopping-list');
      const cleanArea = document.getElementById('print-shopping-list');
      if (cleanArea) cleanArea.remove();
    };

    window.addEventListener('afterprint', cleanUpPrint, { once: true });
    window.print();
    // Fallback for non-standard environment behaviors
    setTimeout(cleanUpPrint, 1000);
  },

  /* ══════════════════════════════════════════════════════════════════════
     Private — Helpers
     ══════════════════════════════════════════════════════════════════════ */

  /**
   * Get the store category for an ingredient.
   * @param {string} name
   * @returns {string}
   */
  _getCategory(name) {
    if (typeof INGREDIENT_CATEGORIES !== 'undefined' && INGREDIENT_CATEGORIES[name]) {
      return INGREDIENT_CATEGORIES[name];
    }
    return 'Other';
  },

  /** Load shopping list from localStorage. */
  _loadFromStorage() {
    try {
      const stored = localStorage.getItem('wfd_shopping_list');
      this.items = stored ? JSON.parse(stored) : [];
      // Migrate old format if needed
      this.items = this.items.map(item => ({
        name: item.name || '',
        category: item.category || 'Other',
        fromRecipes: item.fromRecipes || (item.fromRecipe ? [item.fromRecipe] : []),
        checked: item.checked || false
      }));
    } catch (e) {
      this.items = [];
    }
  },

  /** Save shopping list to localStorage (compact format). */
  _saveToStorage() {
    try {
      localStorage.setItem('wfd_shopping_list', JSON.stringify(this.items));
    } catch (e) {
      console.warn('Could not save shopping list:', e);
    }
  }
};
