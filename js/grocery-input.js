/**
 * GroceryInput — Step 1 of the wizard
 * 
 * Renders three input method cards (Manual, Scan Receipt, Upload File)
 * and manages the grocery items list. All three methods feed into
 * the same shared groceries array.
 */
const GroceryInput = {
  /** @type {string[]} Current list of grocery items */
  groceries: [],

  /** @type {string|null} Currently active input method: 'manual' | 'scan' | 'upload' | null */
  activeMethod: null,

  /** @type {string[]} User-managed pantry staples list */
  pantryStaples: [],

  /** @type {HTMLElement|null} Reference to the main container */
  container: null,

  /**
   * Render the grocery input screen into the given container.
   * @param {HTMLElement} container - DOM element to render into
   * @param {string[]} existingGroceries - Previously added groceries (for back-navigation)
   */
  render(container, existingGroceries = []) {
    this.container = container;
    this.groceries = [...existingGroceries];
    container.innerHTML = '';

    // ── Screen Header ──
    const header = document.createElement('div');
    header.className = 'screen-header';
    header.innerHTML = `
      <h2 class="screen-title">What's in My Pantry?</h2>
      <p class="screen-subtitle">Add what you've got — we'll handle the rest 🧡</p>
    `;
    container.appendChild(header);

    // ── Input Method Selector ──
    const methodGrid = document.createElement('div');
    methodGrid.className = 'input-method-grid';
    methodGrid.innerHTML = `
      <button class="input-method-card" id="method-manual" data-method="manual" aria-label="Type items manually">
        <div class="method-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </div>
        <h3 class="method-title">Type Manually</h3>
        <p class="method-desc">Search and add items one by one</p>
      </button>
      <button class="input-method-card" id="method-scan" data-method="scan" aria-label="Scan a receipt with OCR">
        <div class="method-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </div>
        <h3 class="method-title">Scan Receipt</h3>
        <p class="method-desc">Upload a photo of your grocery bill</p>
      </button>
      <button class="input-method-card" id="method-upload" data-method="upload" aria-label="Upload a grocery list file">
        <div class="method-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <h3 class="method-title">Upload List</h3>
        <p class="method-desc">Import a .txt, .csv, or .json file</p>
      </button>
    `;
    container.appendChild(methodGrid);

    // ── Dynamic Input Area (changes based on selected method) ──
    const inputArea = document.createElement('div');
    inputArea.className = 'input-area';
    inputArea.id = 'input-area';
    container.appendChild(inputArea);

    // ── Grocery Items Display ──
    const grocerySection = document.createElement('div');
    grocerySection.className = 'grocery-section';
    grocerySection.id = 'grocery-section';
    container.appendChild(grocerySection);

    // ── Event Listeners for Method Cards ──
    methodGrid.querySelectorAll('.input-method-card').forEach(card => {
      card.addEventListener('click', () => {
        this._selectMethod(card.dataset.method);
      });
    });

    // Load pantry staples from localStorage
    this._loadPantryStaples();

    // Default to manual input
    this._selectMethod('manual');

    // Render existing groceries if any
    this._renderGroceryList();

    // Render pantry staples section
    this._renderPantryStaples();
  },

  /**
   * Select an input method and render its specific UI.
   * @param {string} method - 'manual' | 'scan' | 'upload'
   */
  _selectMethod(method) {
    this.activeMethod = method;
    const inputArea = document.getElementById('input-area');

    // Update card selection state
    document.querySelectorAll('.input-method-card').forEach(card => {
      card.classList.toggle('active', card.dataset.method === method);
    });

    // Render the appropriate input UI
    switch (method) {
      case 'manual':
        this._renderManualInput(inputArea);
        break;
      case 'scan':
        this._renderScanInput(inputArea);
        break;
      case 'upload':
        this._renderUploadInput(inputArea);
        break;
    }
  },

  /**
   * Render the manual text input with autocomplete suggestions.
   * @param {HTMLElement} container
   */
  _renderManualInput(container) {
    container.innerHTML = '';
    container.className = 'input-area fade-slide-in';

    const wrapper = document.createElement('div');
    wrapper.className = 'manual-input-wrapper';

    // Search input
    const inputGroup = document.createElement('div');
    inputGroup.className = 'search-input-group';
    inputGroup.innerHTML = `
      <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input type="text" class="search-input" id="grocery-search" placeholder="Type a grocery item..." autocomplete="off" aria-label="Search grocery items">
      <button class="btn btn-primary btn-add" id="btn-add-grocery" aria-label="Add item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add
      </button>
    `;
    wrapper.appendChild(inputGroup);

    // Autocomplete dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown hidden';
    dropdown.id = 'autocomplete-dropdown';
    wrapper.appendChild(dropdown);

    // Quick-add suggestions
    const suggestions = document.createElement('div');
    suggestions.className = 'quick-suggestions';
    suggestions.innerHTML = '<p class="suggestion-label">Common items:</p>';
    const chipContainer = document.createElement('div');
    chipContainer.className = 'suggestion-chips';

    const commonItems = ['chicken', 'rice', 'onion', 'tomato', 'garlic', 'egg', 'milk', 'bread',
      'butter', 'cheese', 'potato', 'bell pepper', 'carrot', 'pasta', 'olive oil', 'salt'];
    commonItems.forEach(item => {
      const chip = document.createElement('button');
      chip.className = 'suggestion-chip';
      chip.textContent = item;
      chip.addEventListener('click', () => this._addGrocery(item));
      chipContainer.appendChild(chip);
    });
    suggestions.appendChild(chipContainer);
    wrapper.appendChild(suggestions);

    container.appendChild(wrapper);

    // ── Event Listeners ──
    const searchInput = document.getElementById('grocery-search');
    const addBtn = document.getElementById('btn-add-grocery');

    // Add on button click
    addBtn.addEventListener('click', () => {
      const value = searchInput.value.trim();
      if (value) {
        this._addGrocery(value);
        searchInput.value = '';
        this._hideAutocomplete();
        searchInput.focus();
      }
    });

    // Add on Enter key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = searchInput.value.trim();
        if (value) {
          this._addGrocery(value);
          searchInput.value = '';
          this._hideAutocomplete();
        }
      } else if (e.key === 'Escape') {
        this._hideAutocomplete();
      }
    });

    // Autocomplete on typing
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query.length < 1) {
        this._hideAutocomplete();
        return;
      }
      this._showAutocomplete(query);
    });

    // Close autocomplete on outside click
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        this._hideAutocomplete();
      }
    });

    searchInput.focus();
  },

  /**
   * Show autocomplete suggestions based on query.
   * @param {string} query
   */
  _showAutocomplete(query) {
    const dropdown = document.getElementById('autocomplete-dropdown');
    if (!dropdown) return;

    // Filter from COMMON_GROCERIES (defined in recipe-data.js)
    const suggestions = (typeof COMMON_GROCERIES !== 'undefined' ? COMMON_GROCERIES : [])
      .filter(item =>
        item.toLowerCase().includes(query) &&
        !this.groceries.includes(item.toLowerCase())
      )
      .slice(0, 8);

    if (suggestions.length === 0) {
      this._hideAutocomplete();
      return;
    }

    dropdown.innerHTML = '';
    suggestions.forEach(item => {
      const option = document.createElement('button');
      option.className = 'autocomplete-option';
      option.textContent = item;
      option.addEventListener('click', () => {
        this._addGrocery(item);
        document.getElementById('grocery-search').value = '';
        this._hideAutocomplete();
        document.getElementById('grocery-search').focus();
      });
      dropdown.appendChild(option);
    });

    dropdown.classList.remove('hidden');
  },

  /** Hide the autocomplete dropdown. */
  _hideAutocomplete() {
    const dropdown = document.getElementById('autocomplete-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
  },

  /**
   * Render the receipt scanning input.
   * @param {HTMLElement} container
   */
  _renderScanInput(container) {
    container.innerHTML = '';
    container.className = 'input-area fade-slide-in';

    const wrapper = document.createElement('div');
    wrapper.className = 'scan-input-wrapper';

    // Dropzone
    wrapper.innerHTML = `
      <div class="dropzone" id="scan-dropzone">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="dropzone-icon">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
        <p class="dropzone-text">Drop a receipt image here or click to browse</p>
        <p class="dropzone-hint">Supports JPG, PNG, WEBP</p>
        <input type="file" id="scan-file-input" accept="image/*" class="hidden" aria-label="Upload receipt image">
      </div>
      <div class="ocr-progress hidden" id="ocr-progress">
        <div class="progress-bar-track">
          <div class="progress-bar-fill" id="ocr-progress-fill"></div>
        </div>
        <p class="progress-text" id="ocr-progress-text">Initializing scanner...</p>
      </div>
      <div class="ocr-results hidden" id="ocr-results">
        <h4 class="results-title">Detected Items</h4>
        <p class="results-hint">Uncheck items you don't want, or edit names by clicking them</p>
        <div class="results-list" id="ocr-results-list"></div>
        <button class="btn btn-primary" id="btn-confirm-ocr">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Add Selected Items
        </button>
      </div>
    `;
    container.appendChild(wrapper);

    // ── Dropzone Events ──
    const dropzone = document.getElementById('scan-dropzone');
    const fileInput = document.getElementById('scan-file-input');

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this._processReceiptImage(file);
      }
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        this._processReceiptImage(file);
      }
    });
  },

  /**
   * Process a receipt image through OCR.
   * @param {File} file - The image file to process
   */
  async _processReceiptImage(file) {
    const dropzone = document.getElementById('scan-dropzone');
    const progress = document.getElementById('ocr-progress');
    const progressFill = document.getElementById('ocr-progress-fill');
    const progressText = document.getElementById('ocr-progress-text');
    const results = document.getElementById('ocr-results');

    // Show progress, hide dropzone
    dropzone.classList.add('hidden');
    progress.classList.remove('hidden');
    results.classList.add('hidden');

    try {
      const result = await OCREngine.scanReceipt(file, (percent) => {
        progressFill.style.width = `${percent}%`;
        progressText.textContent = percent < 100
          ? `Scanning receipt... ${Math.round(percent)}%`
          : 'Processing results...';
      });

      // Show results
      progress.classList.add('hidden');
      results.classList.remove('hidden');
      this._renderOCRResults(result.items);

    } catch (error) {
      progressText.textContent = `Error: ${error.message}. Please try again.`;
      progressFill.style.width = '100%';
      progressFill.style.background = 'hsl(0, 70%, 50%)';

      setTimeout(() => {
        progress.classList.add('hidden');
        dropzone.classList.remove('hidden');
      }, 3000);
    }
  },

  /**
   * Render OCR results as an editable checklist.
   * @param {string[]} items - Detected item names
   */
  _renderOCRResults(items) {
    const list = document.getElementById('ocr-results-list');
    list.innerHTML = '';

    if (items.length === 0) {
      list.innerHTML = '<p class="no-results">No grocery items detected. Try a clearer image or use manual input.</p>';
      return;
    }

    items.forEach((item, index) => {
      const row = document.createElement('label');
      row.className = 'ocr-item';
      row.innerHTML = `
        <input type="checkbox" checked data-index="${index}" class="ocr-checkbox">
        <span class="ocr-item-name" contenteditable="true" data-index="${index}">${item}</span>
      `;
      list.appendChild(row);
    });

    // Confirm button
    const confirmBtn = document.getElementById('btn-confirm-ocr');
    confirmBtn.addEventListener('click', () => {
      const checkedItems = list.querySelectorAll('.ocr-item');
      checkedItems.forEach(row => {
        const checkbox = row.querySelector('.ocr-checkbox');
        const name = row.querySelector('.ocr-item-name');
        if (checkbox.checked) {
          this._addGrocery(name.textContent.trim());
        }
      });

      // Reset scan area
      document.getElementById('ocr-results').classList.add('hidden');
      document.getElementById('scan-dropzone').classList.remove('hidden');
    });
  },

  /**
   * Render the file upload input.
   * @param {HTMLElement} container
   */
  _renderUploadInput(container) {
    container.innerHTML = '';
    container.className = 'input-area fade-slide-in';

    const wrapper = document.createElement('div');
    wrapper.className = 'upload-input-wrapper';

    wrapper.innerHTML = `
      <div class="dropzone" id="upload-dropzone">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="dropzone-icon">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <p class="dropzone-text">Drop a file here or click to browse</p>
        <p class="dropzone-hint">Supports .txt (one item per line), .csv, or .json</p>
        <input type="file" id="upload-file-input" accept=".txt,.csv,.json,text/plain,text/csv,application/json" class="hidden" aria-label="Upload grocery list file">
      </div>
      <div class="upload-results hidden" id="upload-results">
        <h4 class="results-title">Imported Items</h4>
        <p class="results-hint">Uncheck items you don't want</p>
        <div class="results-list" id="upload-results-list"></div>
        <button class="btn btn-primary" id="btn-confirm-upload">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Add Selected Items
        </button>
      </div>
    `;
    container.appendChild(wrapper);

    // ── Upload Events ──
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('upload-file-input');

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) this._processUploadedFile(file);
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) this._processUploadedFile(file);
    });
  },

  /**
   * Process an uploaded file (.txt, .csv, .json).
   * @param {File} file
   */
  async _processUploadedFile(file) {
    const text = await file.text();
    let items = [];

    const ext = file.name.split('.').pop().toLowerCase();

    try {
      switch (ext) {
        case 'json':
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            items = parsed.map(i => typeof i === 'string' ? i.trim() : (i.name || i.item || '').trim());
          } else if (parsed.items && Array.isArray(parsed.items)) {
            items = parsed.items.map(i => typeof i === 'string' ? i.trim() : (i.name || i.item || '').trim());
          } else if (parsed.groceries && Array.isArray(parsed.groceries)) {
            items = parsed.groceries.map(i => typeof i === 'string' ? i.trim() : (i.name || i.item || '').trim());
          }
          break;

        case 'csv':
          // Parse CSV — take first column if multi-column, skip header if it looks like one
          const lines = text.split(/\r?\n/).filter(l => l.trim());
          const firstLine = lines[0]?.toLowerCase();
          const startIdx = (firstLine && (firstLine.includes('item') || firstLine.includes('name') || firstLine.includes('grocery'))) ? 1 : 0;
          for (let i = startIdx; i < lines.length; i++) {
            const cols = lines[i].split(',');
            const item = cols[0].trim().replace(/^["']|["']$/g, '');
            if (item) items.push(item);
          }
          break;

        case 'txt':
        default:
          items = text.split(/\r?\n/)
            .map(l => l.trim())
            .filter(l => l.length > 0 && l.length < 100);
          break;
      }
    } catch (e) {
      // Fallback: treat as plain text
      items = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    }

    // Clean items
    items = items
      .map(i => i.toLowerCase().trim())
      .filter(i => i.length >= 2 && i.length <= 50);

    // Remove duplicates
    items = [...new Set(items)];

    // Show results
    const dropzone = document.getElementById('upload-dropzone');
    const results = document.getElementById('upload-results');
    const list = document.getElementById('upload-results-list');

    dropzone.classList.add('hidden');
    results.classList.remove('hidden');
    list.innerHTML = '';

    if (items.length === 0) {
      list.innerHTML = '<p class="no-results">No items found in the file. Please check the format and try again.</p>';
      return;
    }

    items.forEach((item, index) => {
      const row = document.createElement('label');
      row.className = 'ocr-item';
      row.innerHTML = `
        <input type="checkbox" checked data-index="${index}" class="ocr-checkbox">
        <span class="ocr-item-name">${item}</span>
      `;
      list.appendChild(row);
    });

    // Confirm button
    const confirmBtn = document.getElementById('btn-confirm-upload');
    confirmBtn.addEventListener('click', () => {
      const checkedItems = list.querySelectorAll('.ocr-item');
      checkedItems.forEach(row => {
        const checkbox = row.querySelector('.ocr-checkbox');
        const name = row.querySelector('.ocr-item-name');
        if (checkbox.checked) {
          this._addGrocery(name.textContent.trim());
        }
      });

      // Reset upload area
      results.classList.add('hidden');
      dropzone.classList.remove('hidden');
    });
  },

  /**
   * Add a grocery item to the list (deduplicated).
   * @param {string} item
   */
  _addGrocery(item) {
    const normalized = item.toLowerCase().trim();
    if (!normalized || normalized.length < 1) return;

    // Deduplicate
    if (this.groceries.includes(normalized)) return;

    this.groceries.push(normalized);
    this._renderGroceryList();
    this._updateSuggestionChips();
  },

  /**
   * Remove a grocery item from the list.
   * @param {number} index
   */
  _removeGrocery(index) {
    this.groceries.splice(index, 1);
    this._renderGroceryList();
    this._updateSuggestionChips();
  },

  /** Render the grocery items as removable chips. */
  _renderGroceryList() {
    const section = document.getElementById('grocery-section');
    if (!section) return;

    section.innerHTML = '';

    if (this.groceries.length === 0) {
      section.innerHTML = `
        <div class="grocery-empty">
          <p class="empty-text">No items added yet</p>
        </div>
      `;
      return;
    }

    const header = document.createElement('div');
    header.className = 'grocery-list-header';
    header.innerHTML = `
      <h3 class="grocery-count">${this.groceries.length} item${this.groceries.length !== 1 ? 's' : ''} in your list</h3>
      <button class="btn btn-secondary btn-sm" id="btn-clear-all" aria-label="Clear all items">Clear All</button>
    `;
    section.appendChild(header);

    const chipContainer = document.createElement('div');
    chipContainer.className = 'grocery-chips';

    this.groceries.forEach((item, index) => {
      const chip = document.createElement('span');
      chip.className = 'grocery-chip';
      chip.innerHTML = `
        ${item}
        <button class="chip-remove" data-index="${index}" aria-label="Remove ${item}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      chipContainer.appendChild(chip);
    });

    section.appendChild(chipContainer);

    // ── Event Listeners ──
    chipContainer.querySelectorAll('.chip-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._removeGrocery(parseInt(btn.dataset.index));
      });
    });

    document.getElementById('btn-clear-all')?.addEventListener('click', () => {
      this.groceries = [];
      this._renderGroceryList();
      this._updateSuggestionChips();
    });
  },

  /** Update suggestion chips to grey-out already-added items. */
  _updateSuggestionChips() {
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
      const isAdded = this.groceries.includes(chip.textContent.toLowerCase().trim());
      chip.classList.toggle('added', isAdded);
      chip.disabled = isAdded;
    });
  },

  /**
   * Get the current grocery list.
   * @returns {string[]}
   */
  getGroceries() {
    return [...this.groceries];
  },

  /**
   * Validate that at least one grocery item has been added.
   * @returns {boolean}
   */
  validate() {
    if (this.groceries.length > 0) return true;

    // Shake animation on the empty state
    const section = document.getElementById('grocery-section');
    if (section) {
      section.classList.add('shake');
      setTimeout(() => section.classList.remove('shake'), 500);
    }
    return false;
  },

  /**
   * Load pantry staples from localStorage, falling back to defaults.
   * @private
   */
  _loadPantryStaples() {
    try {
      const stored = localStorage.getItem('wfd_pantry_staples');
      if (stored) {
        this.pantryStaples = JSON.parse(stored);
      } else {
        this.pantryStaples = typeof DEFAULT_PANTRY_STAPLES !== 'undefined'
          ? [...DEFAULT_PANTRY_STAPLES]
          : ['oil', 'olive oil', 'butter', 'salt', 'black pepper', 'sugar', 'flour', 'water', 'vinegar', 'garlic powder', 'onion powder'];
        this._savePantryStaples();
      }
    } catch (e) {
      this.pantryStaples = ['oil', 'salt', 'black pepper', 'butter', 'flour', 'sugar'];
    }
  },

  /**
   * Save pantry staples to localStorage.
   * @private
   */
  _savePantryStaples() {
    try {
      localStorage.setItem('wfd_pantry_staples', JSON.stringify(this.pantryStaples));
    } catch (e) {
      console.warn('Could not save pantry staples:', e);
    }
  },

  /**
   * Render the "My Pantry Staples" section below the grocery list.
   * @private
   */
  _renderPantryStaples() {
    // Remove existing section if present
    const existing = document.getElementById('pantry-staples-section');
    if (existing) existing.remove();

    const section = document.createElement('div');
    section.className = 'pantry-staples-section';
    section.id = 'pantry-staples-section';

    section.innerHTML = `
      <div class="pantry-staples-header">
        <div class="pantry-staples-title-row">
          <span class="pantry-icon">🧂</span>
          <h3 class="pantry-staples-title">My Pantry Staples</h3>
          <span class="pantry-staples-hint">Always on hand — won't show as missing</span>
        </div>
        <button class="btn-reset-staples" id="btn-reset-staples" aria-label="Reset to defaults">Reset to defaults</button>
      </div>
      <div class="pantry-chips-container" id="pantry-chips-container"></div>
      <div class="pantry-add-row">
        <input type="text" class="pantry-add-input" id="pantry-add-input"
          placeholder="Add your staple (e.g. peri peri sauce, ghee...)" autocomplete="off"
          aria-label="Add custom pantry staple" />
        <button class="btn-add-staple" id="btn-add-staple" aria-label="Add staple">+ Add</button>
      </div>
    `;

    // Append after grocery-section
    const grocerySection = document.getElementById('grocery-section');
    if (grocerySection && grocerySection.parentNode) {
      grocerySection.parentNode.insertBefore(section, grocerySection.nextSibling);
    } else if (this.container) {
      this.container.appendChild(section);
    }

    this._renderPantryChips();

    // Add staple button
    document.getElementById('btn-add-staple')?.addEventListener('click', () => {
      this._addPantryStaple();
    });

    // Add on Enter key
    document.getElementById('pantry-add-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this._addPantryStaple();
      }
    });

    // Reset to defaults
    document.getElementById('btn-reset-staples')?.addEventListener('click', () => {
      this.pantryStaples = typeof DEFAULT_PANTRY_STAPLES !== 'undefined'
        ? [...DEFAULT_PANTRY_STAPLES]
        : ['oil', 'salt', 'black pepper', 'butter', 'flour', 'sugar'];
      this._savePantryStaples();
      this._renderPantryChips();
    });
  },

  /**
   * Render the pantry staple chips inside the container.
   * @private
   */
  _renderPantryChips() {
    const container = document.getElementById('pantry-chips-container');
    if (!container) return;
    container.innerHTML = '';

    this.pantryStaples.forEach((staple) => {
      const chip = document.createElement('span');
      chip.className = 'pantry-chip';
      chip.innerHTML = `
        <span class="pantry-chip-label">${staple}</span>
        <button class="pantry-chip-remove" aria-label="Remove ${staple} from pantry staples">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      chip.querySelector('.pantry-chip-remove').addEventListener('click', () => {
        this.pantryStaples = this.pantryStaples.filter(s => s !== staple);
        this._savePantryStaples();
        this._renderPantryChips();
      });
      container.appendChild(chip);
    });
  },

  /**
   * Add a new custom pantry staple.
   * @private
   */
  _addPantryStaple() {
    const input = document.getElementById('pantry-add-input');
    if (!input) return;
    const val = input.value.trim().toLowerCase();
    if (!val || this.pantryStaples.includes(val)) {
      input.value = '';
      return;
    }
    this.pantryStaples.push(val);
    this._savePantryStaples();
    this._renderPantryChips();
    input.value = '';
    input.focus();
  },

  /**
   * Get the current pantry staples list.
   * @returns {string[]}
   */
  getPantryStaples() {
    return [...this.pantryStaples];
  },
};
