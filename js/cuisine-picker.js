/**
 * CuisinePicker — Step 2 of the "What's for Dinner" wizard.
 *
 * Renders an interactive cuisine-preference grid and exposes helpers
 * to query / validate the current selection.
 *
 * @global
 */
const CuisinePicker = {
  /* ------------------------------------------------------------------ */
  /*  Cuisine metadata                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * The 12 supported cuisines.
   * Each entry carries an id, display name, emoji, short description,
   * and a unique HSL accent colour used for card highlights.
   *
   * @type {Array<{id: string, name: string, emoji: string, description: string, color: string}>}
   */
  cuisines: [
    {
      id: "indian",
      name: "Indian",
      emoji: "🍛",
      description: "Spicy curries, aromatic dals, biryanis & dosas",
      color: "hsl(30, 85%, 50%)"
    },
    {
      id: "italian",
      name: "Italian",
      emoji: "🍝",
      description: "Classic pasta, creamy risottos & fresh bruschetta",
      color: "hsl(10, 75%, 50%)"
    },
    {
      id: "mexican",
      name: "Mexican",
      emoji: "🌮",
      description: "Bold tacos, hearty burritos & zesty enchiladas",
      color: "hsl(45, 90%, 50%)"
    },
    {
      id: "chinese",
      name: "Chinese",
      emoji: "🥡",
      description: "Savory stir-fries, fried rice & steamed dumplings",
      color: "hsl(0, 75%, 45%)"
    },
    {
      id: "japanese",
      name: "Japanese",
      emoji: "🍱",
      description: "Elegant sushi bowls, rich ramen & sweet teriyaki",
      color: "hsl(210, 60%, 50%)"
    },
    {
      id: "thai",
      name: "Thai",
      emoji: "🍜",
      description: "Fragrant pad thai, green curry & spicy tom yum",
      color: "hsl(140, 65%, 40%)"
    },
    {
      id: "mediterranean",
      name: "Mediterranean",
      emoji: "🥙",
      description: "Fresh falafel, creamy hummus & grilled kebabs",
      color: "hsl(195, 70%, 45%)"
    },
    {
      id: "american",
      name: "American",
      emoji: "🍔",
      description: "Classic burgers, smoky BBQ & loaded mac & cheese",
      color: "hsl(220, 60%, 45%)"
    },
    {
      id: "korean",
      name: "Korean",
      emoji: "🥘",
      description: "Vibrant bibimbap, tangy kimchi jjigae & bulgogi",
      color: "hsl(350, 70%, 50%)"
    },
    {
      id: "middle-eastern",
      name: "Middle Eastern",
      emoji: "🧆",
      description: "Aromatic shawarma, fresh tabbouleh & crispy fattoush",
      color: "hsl(55, 70%, 45%)"
    },
    {
      id: "french",
      name: "French",
      emoji: "🥐",
      description: "Elegant crêpes, savory quiche & rustic ratatouille",
      color: "hsl(240, 50%, 50%)"
    },
    {
      id: "southern-soul",
      name: "Southern / Soul",
      emoji: "🍗",
      description: "Crispy fried chicken, creamy grits & buttery cornbread",
      color: "hsl(25, 80%, 45%)"
    }
  ],

  /* ------------------------------------------------------------------ */
  /*  Internal references (set during render)                            */
  /* ------------------------------------------------------------------ */

  /** @private */
  _grid: null,

  /** @private */
  _countIndicator: null,

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Render the cuisine picker into the given container.
   *
   * @param {HTMLElement}  container        — DOM element to render into.
   * @param {string[]}     selectedCuisines — IDs of cuisines that should
   *                                          be pre-selected (supports
   *                                          back-navigation persistence).
   */
  render(container, selectedCuisines = []) {
    // Start fresh
    container.innerHTML = "";

    /* ---------- Header ---------- */
    const header = document.createElement("div");
    header.classList.add("cuisine-header");

    const title = document.createElement("h2");
    title.classList.add("cuisine-title");
    title.textContent = "What are you in the mood for?";

    const subtitle = document.createElement("p");
    subtitle.classList.add("cuisine-subtitle");
    subtitle.textContent =
      "Select your preferred cuisines — we'll match recipes to your groceries";

    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);

    /* ---------- Select All / Deselect All toggle ---------- */
    const toggleBtn = document.createElement("button");
    toggleBtn.classList.add("cuisine-toggle-all");
    toggleBtn.type = "button";
    toggleBtn.textContent = "Select All";

    toggleBtn.addEventListener("click", () => {
      const cards = this._grid.querySelectorAll(".cuisine-card");
      const allSelected =
        this._grid.querySelectorAll(".cuisine-card.selected").length ===
        cards.length;

      cards.forEach((card) => {
        if (allSelected) {
          card.classList.remove("selected");
        } else {
          card.classList.add("selected");
        }
      });

      toggleBtn.textContent = allSelected ? "Select All" : "Deselect All";
      this._updateCount();
    });

    container.appendChild(toggleBtn);

    /* ---------- Cuisine grid ---------- */
    const grid = document.createElement("div");
    grid.classList.add("cuisine-grid");
    this._grid = grid;

    this.cuisines.forEach((cuisine) => {
      const card = this._createCard(cuisine, selectedCuisines);
      grid.appendChild(card);
    });

    container.appendChild(grid);

    /* ---------- Count indicator ---------- */
    const count = document.createElement("p");
    count.classList.add("cuisine-count");
    this._countIndicator = count;
    container.appendChild(count);

    // Set initial counts & toggle label
    this._updateCount();
    this._syncToggleLabel(toggleBtn);
  },

  /**
   * Return the IDs of every currently-selected cuisine.
   *
   * @returns {string[]}
   */
  getSelected() {
    if (!this._grid) return [];

    const selectedCards = this._grid.querySelectorAll(".cuisine-card.selected");
    return Array.from(selectedCards).map((card) => card.dataset.cuisineId);
  },

  /**
   * Validate the current selection.
   *
   * At least one cuisine must be selected.  If the selection is empty a
   * brief shake animation is applied to the grid and a warning is shown.
   *
   * @returns {boolean} `true` when valid.
   */
  validate() {
    if (this.getSelected().length >= 1) return true;

    // --- Invalid: shake the grid ---
    if (this._grid) {
      this._grid.classList.add("shake");
      this._grid.addEventListener(
        "animationend",
        () => this._grid.classList.remove("shake"),
        { once: true }
      );
    }

    // --- Show a brief warning ---
    this._flashWarning("Please select at least one cuisine to continue.");

    return false;
  },

  /* ------------------------------------------------------------------ */
  /*  Private helpers                                                    */
  /* ------------------------------------------------------------------ */

  /**
   * Build a single cuisine card element.
   *
   * @private
   * @param   {Object}   cuisine           — Cuisine metadata object.
   * @param   {string[]} selectedCuisines  — Pre-selected IDs.
   * @returns {HTMLElement}
   */
  _createCard(cuisine, selectedCuisines) {
    const card = document.createElement("div");
    card.classList.add("cuisine-card");
    card.dataset.cuisineId = cuisine.id;
    card.style.setProperty("--cuisine-color", cuisine.color);
    card.setAttribute("role", "checkbox");
    card.setAttribute("aria-checked", "false");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", cuisine.name);

    // Pre-select if needed
    if (selectedCuisines.includes(cuisine.id)) {
      card.classList.add("selected");
      card.setAttribute("aria-checked", "true");
    }

    /* Emoji */
    const emoji = document.createElement("span");
    emoji.classList.add("cuisine-emoji");
    emoji.textContent = cuisine.emoji;
    emoji.setAttribute("aria-hidden", "true");

    /* Name */
    const name = document.createElement("span");
    name.classList.add("cuisine-name");
    name.textContent = cuisine.name;

    /* Description */
    const desc = document.createElement("span");
    desc.classList.add("cuisine-description");
    desc.textContent = cuisine.description;

    /* Checkmark overlay */
    const check = document.createElement("span");
    check.classList.add("cuisine-check");
    check.setAttribute("aria-hidden", "true");
    check.textContent = "✓";

    card.appendChild(emoji);
    card.appendChild(name);
    card.appendChild(desc);
    card.appendChild(check);

    /* Click handler — toggle selection */
    card.addEventListener("click", () => {
      card.classList.toggle("selected");
      const isSelected = card.classList.contains("selected");
      card.setAttribute("aria-checked", String(isSelected));
      this._updateCount();
      this._syncToggleLabel();
    });

    /* Keyboard support (Enter / Space) */
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });

    return card;
  },

  /**
   * Refresh the "X cuisines selected" counter text.
   *
   * @private
   */
  _updateCount() {
    if (!this._countIndicator) return;

    const count = this.getSelected().length;
    this._countIndicator.textContent =
      count === 1 ? "1 cuisine selected" : `${count} cuisines selected`;
  },

  /**
   * Keep the Select All / Deselect All button label in sync.
   *
   * @private
   * @param {HTMLButtonElement} [btn] — Optionally pass the button directly;
   *   otherwise it is looked up via the grid's parent container.
   */
  _syncToggleLabel(btn) {
    const toggleBtn =
      btn ||
      (this._grid &&
        this._grid.parentElement &&
        this._grid.parentElement.querySelector(".cuisine-toggle-all"));
    if (!toggleBtn) return;

    const total = this.cuisines.length;
    const selected = this.getSelected().length;
    toggleBtn.textContent = selected === total ? "Deselect All" : "Select All";
  },

  /**
   * Display a temporary warning message below the grid.
   *
   * The message auto-removes after 3 seconds.
   *
   * @private
   * @param {string} message — Warning text to display.
   */
  _flashWarning(message) {
    if (!this._grid) return;

    // Avoid stacking multiple warnings
    const existing = this._grid.parentElement.querySelector(".cuisine-warning");
    if (existing) existing.remove();

    const warning = document.createElement("p");
    warning.classList.add("cuisine-warning");
    warning.textContent = message;

    // Insert after the count indicator (or after the grid)
    if (this._countIndicator && this._countIndicator.parentElement) {
      this._countIndicator.parentElement.insertBefore(
        warning,
        this._countIndicator.nextSibling
      );
    } else {
      this._grid.parentElement.appendChild(warning);
    }

    setTimeout(() => warning.remove(), 3000);
  }
};
