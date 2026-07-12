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

  /** @type {Array} Household dietary profiles */
  _profiles: [],

  /** @type {number|null} Index of the currently expanded profile editor */
  _expandedProfileIdx: null,

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
      "Pick cuisines and set dietary preferences — we'll do the rest";

    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);

    // Load profiles from localStorage
    this._loadProfiles();
    // Render dietary profiles section on top
    this._renderDietarySection(container);

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
  },

  /**
   * Load dietary profiles from localStorage.
   * @private
   */
  _loadProfiles() {
    try {
      const stored = localStorage.getItem('wfd_profiles');
      this._profiles = stored ? JSON.parse(stored) : [];
    } catch (e) {
      this._profiles = [];
    }
  },

  /**
   * Save profiles to localStorage.
   * @private
   */
  _saveProfiles() {
    try {
      localStorage.setItem('wfd_profiles', JSON.stringify(this._profiles));
    } catch (e) {
      console.warn('Could not save profiles:', e);
    }
  },

  /**
   * Render the full dietary preferences section below the cuisine grid.
   * @private
   * @param {HTMLElement} container
   */
  _renderDietarySection(container) {
    const section = document.createElement('div');
    section.className = 'dietary-section';
    section.id = 'dietary-section';

    section.innerHTML = `
      <div class="dietary-header">
        <h3 class="dietary-title">🍽️ Personal Preferences</h3>
        <p class="dietary-subtitle">Add dietary needs for yourself or household members</p>
      </div>
      <div class="profiles-list" id="profiles-list"></div>
      <button class="btn-add-person" id="btn-add-person" aria-label="Add dietary profile">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Add Dietary Profile
      </button>
    `;
    container.appendChild(section);

    this._renderProfiles();

    document.getElementById('btn-add-person')?.addEventListener('click', () => {
      const name = `Person ${this._profiles.length + 1}`;
      this._profiles.push({ name, dietaryFlags: [], allergies: [] });
      this._saveProfiles();
      // Auto-expand the newly created profile
      this._expandedProfileIdx = this._profiles.length - 1;
      this._renderProfiles();
    });
  },

  /**
   * Render all profile cards in the profiles list.
   * @private
   */
  _renderProfiles() {
    const list = document.getElementById('profiles-list');
    if (!list) return;
    list.innerHTML = '';

    const DIET_OPTIONS = [
      { id: 'no-restrictions', label: 'No Restrictions', emoji: '✅' },
      { id: 'vegan', label: 'Vegan', emoji: '🌱' },
      { id: 'vegetarian', label: 'Vegetarian', emoji: '🥦' },
      { id: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
      { id: 'keto', label: 'Keto', emoji: '🥑' },
      { id: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
      { id: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
      { id: 'nut-free', label: 'Nut-Free', emoji: '🥜' },
      { id: 'low-sodium', label: 'Low-Sodium', emoji: '🧂' },
      { id: 'heart-healthy', label: 'Heart Healthy', emoji: '❤️' },
    ];

    if (this._profiles.length === 0) {
      list.innerHTML = `
        <p class="no-profiles-hint">No dietary restrictions? No worries — we'll show all recipes.<br>
        <button class="btn-add-person-inline" id="btn-add-person-inline">+ Add a person with dietary needs</button></p>
      `;
      document.getElementById('btn-add-person-inline')?.addEventListener('click', () => {
        document.getElementById('btn-add-person')?.click();
      });
      return;
    }

    this._profiles.forEach((profile, profileIdx) => {
      // Check if this profile index is currently expanded
      if (profileIdx === this._expandedProfileIdx) {
        const card = document.createElement('div');
        card.className = 'profile-card expanded';
        card.dataset.profileIdx = profileIdx;

        // Name row
        const nameRow = document.createElement('div');
        nameRow.className = 'profile-name-row';
        nameRow.innerHTML = `
          <span class="profile-avatar">${profile.name.charAt(0).toUpperCase()}</span>
          <input type="text" class="profile-name-input" value="${profile.name}" placeholder="Name" aria-label="Person name" />
          <button class="profile-remove-btn" aria-label="Remove ${profile.name}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        `;
        card.appendChild(nameRow);

        // Name input listener
        nameRow.querySelector('.profile-name-input').addEventListener('input', (e) => {
          this._profiles[profileIdx].name = e.target.value || `Person ${profileIdx + 1}`;
          this._saveProfiles();
        });

        // Remove button listener
        nameRow.querySelector('.profile-remove-btn').addEventListener('click', () => {
          this._profiles.splice(profileIdx, 1);
          this._expandedProfileIdx = null;
          this._saveProfiles();
          this._renderProfiles();
        });

        // Diet chips
        const chipsRow = document.createElement('div');
        chipsRow.className = 'diet-chips-row';
        DIET_OPTIONS.forEach(opt => {
          const chip = document.createElement('button');
          chip.className = 'diet-chip' + (profile.dietaryFlags.includes(opt.id) ? ' selected' : '');
          chip.type = 'button';
          chip.dataset.flag = opt.id;
          chip.innerHTML = `<span class="diet-emoji">${opt.emoji}</span> ${opt.label}`;
          chip.setAttribute('aria-pressed', String(profile.dietaryFlags.includes(opt.id)));
          chip.addEventListener('click', () => {
            if (opt.id === 'no-restrictions') {
              this._profiles[profileIdx].dietaryFlags = [];
            } else {
              const idx = this._profiles[profileIdx].dietaryFlags.indexOf(opt.id);
              if (idx >= 0) {
                this._profiles[profileIdx].dietaryFlags.splice(idx, 1);
              } else {
                this._profiles[profileIdx].dietaryFlags.push(opt.id);
              }
            }
            this._saveProfiles();
            this._renderProfiles();
          });
          chipsRow.appendChild(chip);
        });
        card.appendChild(chipsRow);

        // Allergies section
        const allergySection = document.createElement('div');
        allergySection.className = 'allergy-section';
        allergySection.innerHTML = `
          <details class="allergy-details" open>
            <summary class="allergy-summary">🚫 Allergies & Intolerances ${profile.allergies.length > 0 ? '<span class="allergy-count">' + profile.allergies.length + '</span>' : ''}</summary>
            <div class="allergy-body">
              <div class="allergy-tags" id="allergy-tags-${profileIdx}"></div>
              <div class="allergy-add-row">
                <input type="text" class="allergy-input" id="allergy-input-${profileIdx}" placeholder="e.g. shellfish, tree nuts..." />
                <button class="btn-add-allergy" id="btn-add-allergy-${profileIdx}">Add</button>
              </div>
            </div>
          </details>
        `;
        card.appendChild(allergySection);

        // Done button row
        const doneRow = document.createElement('div');
        doneRow.className = 'profile-done-row';
        doneRow.style.display = 'flex';
        doneRow.style.marginTop = '0.5rem';
        doneRow.innerHTML = `<button class="btn btn-primary btn-profile-done" style="margin-left: auto; padding: 0.4rem 1rem; font-size: 0.8rem;">Done ✓</button>`;
        doneRow.querySelector('.btn-profile-done').addEventListener('click', () => {
          this._expandedProfileIdx = null;
          this._renderProfiles();
        });
        card.appendChild(doneRow);

        list.appendChild(card);

        // Render allergy tags
        this._renderAllergyTags(profileIdx);

        // Allergy add listeners
        document.getElementById(`btn-add-allergy-${profileIdx}`)?.addEventListener('click', () => {
          const input = document.getElementById(`allergy-input-${profileIdx}`);
          const val = input?.value.trim().toLowerCase();
          if (val && !this._profiles[profileIdx].allergies.includes(val)) {
            this._profiles[profileIdx].allergies.push(val);
            this._saveProfiles();
            this._renderProfiles();
          } else if (input) {
            input.value = '';
          }
        });

        document.getElementById(`allergy-input-${profileIdx}`)?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById(`btn-add-allergy-${profileIdx}`)?.click();
          }
        });
      } else {
        // Collapsed capsule view
        const capsule = document.createElement('div');
        capsule.className = 'profile-capsule';
        capsule.setAttribute('role', 'button');
        capsule.setAttribute('tabindex', '0');
        capsule.setAttribute('aria-label', `Edit profile for ${profile.name}`);

        // Build summary text
        const dietsText = profile.dietaryFlags.map(f => {
          const option = DIET_OPTIONS.find(o => o.id === f);
          return option ? option.label : f;
        });
        const allergiesText = profile.allergies.map(a => `no ${a}`);
        const mergedSummary = [...dietsText, ...allergiesText].join(', ');
        const summaryText = mergedSummary || 'No Restrictions';

        capsule.innerHTML = `
          <div class="capsule-avatar">${profile.name.charAt(0).toUpperCase()}</div>
          <div class="capsule-details">
            <span class="capsule-name">${profile.name}</span>
            <span class="capsule-divider">:</span>
            <span class="capsule-summary">${summaryText}</span>
          </div>
          <span class="capsule-edit-icon">✎</span>
        `;

        capsule.addEventListener('click', () => {
          this._expandedProfileIdx = profileIdx;
          this._renderProfiles();
        });

        capsule.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._expandedProfileIdx = profileIdx;
            this._renderProfiles();
          }
        });

        list.appendChild(capsule);
      }
    });
  },

  /**
   * Render allergy tags for a profile.
   * @private
   * @param {number} profileIdx
   */
  _renderAllergyTags(profileIdx) {
    const container = document.getElementById(`allergy-tags-${profileIdx}`);
    if (!container) return;
    const profile = this._profiles[profileIdx];
    container.innerHTML = '';
    profile.allergies.forEach(allergy => {
      const tag = document.createElement('span');
      tag.className = 'allergy-tag';
      tag.innerHTML = `
        ${allergy}
        <button class="allergy-tag-remove" aria-label="Remove ${allergy} allergy">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;
      tag.querySelector('.allergy-tag-remove').addEventListener('click', () => {
        this._profiles[profileIdx].allergies = this._profiles[profileIdx].allergies.filter(a => a !== allergy);
        this._saveProfiles();
        this._renderProfiles();
      });
      container.appendChild(tag);
    });
  },

  /**
   * Get all household profiles.
   * @returns {Array<{name: string, dietaryFlags: string[], allergies: string[]}>}
   */
  getProfiles() {
    return this._profiles.map(p => ({ ...p }));
  },

  /**
   * Get the merged set of all dietary restrictions across all profiles.
   * Used for hard-filtering recipes.
   * @returns {Object} { flags: string[], allergies: string[] }
   */
  getHouseholdRestrictions() {
    const flags = new Set();
    const allergies = new Set();
    this._profiles.forEach(p => {
      p.dietaryFlags.forEach(f => flags.add(f));
      p.allergies.forEach(a => allergies.add(a));
    });
    return { flags: [...flags], allergies: [...allergies] };
  }
};
