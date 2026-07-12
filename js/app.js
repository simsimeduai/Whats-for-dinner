/**
 * App — Main Controller for "What's for Dinner"
 *
 * Manages the 3-step wizard flow, shared application state,
 * screen transitions, progress stepper updates, and navigation.
 */
const App = {
  /* ══════════════════════════════════════════════════════════════════════
     State
     ══════════════════════════════════════════════════════════════════════ */

  /** @type {number} Current step (1, 2, or 3) */
  currentStep: 1,

  /** @type {string[]} User's grocery items */
  groceries: [],

  /** @type {string[]} Selected cuisine IDs */
  selectedCuisines: [],

  /** @type {Array} Household dietary profiles */
  profiles: [],

  /** @type {string[]} User's pantry staples */
  pantryStaples: [],

  /** @type {Object|null} Generated meal plan */
  mealPlan: null,

  /* ══════════════════════════════════════════════════════════════════════
     State Management (app initialization)
     ══════════════════════════════════════════════════════════════════════ */

  /** Boot the application. Called on DOMContentLoaded. */
  init() {
    this._bindNavigation();
    if (typeof ShoppingList !== 'undefined') {
      ShoppingList.init();
    }
    this._renderStep(1);
    this._updateStepper();
    this._updateNavButtons();
  },

  /* ══════════════════════════════════════════════════════════════════════
     Navigation
     ══════════════════════════════════════════════════════════════════════ */

  /** Bind click handlers for Back / Next buttons and stepper steps. */
  _bindNavigation() {
    const btnBack = document.getElementById('btn-back');
    const btnNext = document.getElementById('btn-next');

    btnBack?.addEventListener('click', () => this._goBack());
    btnNext?.addEventListener('click', () => this._goNext());

    // Stepper step clicks (only allow going to completed steps)
    document.querySelectorAll('.stepper-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step);
        if (step < this.currentStep) {
          this._goToStep(step);
        }
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && e.altKey) {
        e.preventDefault();
        this._goNext();
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        e.preventDefault();
        this._goBack();
      }
    });
  },

  /** Navigate to the previous step. */
  _goBack() {
    if (this.currentStep > 1) {
      this._goToStep(this.currentStep - 1);
    }
  },

  /** Validate current step and navigate to the next. */
  _goNext() {
    // Validate current step before proceeding
    if (!this._validateCurrentStep()) return;

    // Save state from current step
    this._saveCurrentStepState();

    if (this.currentStep < 3) {
      this._goToStep(this.currentStep + 1);
    }
  },

  /**
   * Navigate to a specific step.
   * @param {number} step - Target step (1, 2, or 3)
   */
  _goToStep(step) {
    if (step < 1 || step > 3) return;

    // Save state before leaving the current step
    if (step > this.currentStep) {
      this._saveCurrentStepState();
    }

    const main = document.getElementById('app-main');

    // Animate out
    main.classList.add('screen-exit');

    setTimeout(() => {
      this.currentStep = step;
      main.classList.remove('screen-exit');
      main.classList.add('screen-enter');

      this._renderStep(step);
      this._updateStepper();
      this._updateNavButtons();

      // Remove entrance animation class after it plays
      setTimeout(() => main.classList.remove('screen-enter'), 500);
    }, 250);
  },

  /* ══════════════════════════════════════════════════════════════════════
     Step Rendering
     ══════════════════════════════════════════════════════════════════════ */

  /**
   * Render the content for a given step.
   * @param {number} step
   */
  _renderStep(step) {
    const main = document.getElementById('app-main');

    if (typeof ShoppingList !== 'undefined') {
      ShoppingList.setFABVisible(step === 3);
    }

    switch (step) {
      case 1:
        GroceryInput.render(main, this.groceries);
        break;
      case 2:
        CuisinePicker.render(main, this.selectedCuisines);
        break;
      case 3:
        if (typeof CuisinePicker.getProfiles === 'function') {
          CuisinePicker._loadProfiles();
          this.profiles = CuisinePicker.getProfiles();
        }
        if (typeof GroceryInput.getPantryStaples === 'function') {
          GroceryInput._loadPantryStaples();
          this.pantryStaples = GroceryInput.getPantryStaples();
        }
        MealPlanner.render(main, this.groceries, this.selectedCuisines, this.profiles, this.pantryStaples);
        break;
    }
  },

  /* ══════════════════════════════════════════════════════════════════════
     State Management
     ══════════════════════════════════════════════════════════════════════ */

  /** Save the state from the current step before navigating away. */
  _saveCurrentStepState() {
    switch (this.currentStep) {
      case 1:
        this.groceries = GroceryInput.getGroceries();
        this.pantryStaples = GroceryInput.getPantryStaples();
        break;
      case 2:
        this.selectedCuisines = CuisinePicker.getSelected();
        this.profiles = CuisinePicker.getProfiles();
        break;
      case 3:
        this.mealPlan = MealPlanner.currentPlan;
        break;
    }
  },

  /**
   * Validate the current step.
   * @returns {boolean} True if valid
   */
  _validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        if (!GroceryInput.validate()) {
          this._showToast('Please add at least one grocery item to continue.', 'warning');
          return false;
        }
        return true;

      case 2:
        if (!CuisinePicker.validate()) {
          this._showToast('Please select at least one cuisine to continue.', 'warning');
          return false;
        }
        return true;

      case 3:
        // No validation needed on the last step
        return true;

      default:
        return true;
    }
  },

  /* ══════════════════════════════════════════════════════════════════════
     UI Updates
     ══════════════════════════════════════════════════════════════════════ */

  _updateStepper() {
    const steps = document.querySelectorAll('.stepper-step');
    const lineFill = document.getElementById('stepper-line-fill');
    const stepperEl = document.getElementById('stepper');

    if (stepperEl) {
      stepperEl.classList.toggle('hidden', this.currentStep === 3);
    }

    steps.forEach(stepEl => {
      const stepNum = parseInt(stepEl.dataset.step);
      stepEl.classList.remove('active', 'completed');
      stepEl.removeAttribute('aria-current');

      if (stepNum === this.currentStep) {
        stepEl.classList.add('active');
        stepEl.setAttribute('aria-current', 'step');
      } else if (stepNum < this.currentStep) {
        stepEl.classList.add('completed');
      }
    });

    // Update line fill (progress indicator between steps)
    if (lineFill) {
      const progress = ((this.currentStep - 1) / 2) * 100;
      lineFill.style.width = `${progress}%`;
    }
  },

  /** Update the Back / Next navigation buttons. */
  _updateNavButtons() {
    const btnBack = document.getElementById('btn-back');
    const btnNext = document.getElementById('btn-next');
    const navFooter = document.getElementById('app-nav');

    // Back button: hidden on step 1
    if (btnBack) {
      btnBack.classList.toggle('hidden', this.currentStep === 1);
    }

    // Next button: changes text on last step
    if (btnNext) {
      if (this.currentStep === 3) {
        // Hide next on the final step
        btnNext.classList.add('hidden');
      } else {
        btnNext.classList.remove('hidden');
        const label = this.currentStep === 2 ? 'Generate Plan' : 'Next';
        btnNext.innerHTML = `
          ${label}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        `;
      }
    }

    // Show/hide entire nav footer
    if (navFooter) {
      // Always show nav, let individual buttons handle visibility
      navFooter.classList.toggle('minimal', this.currentStep === 3);
    }
  },

  /* ══════════════════════════════════════════════════════════════════════
     Toast Notifications
     ══════════════════════════════════════════════════════════════════════ */

  /**
   * Show a brief toast notification.
   * @param {string} message
   * @param {'info'|'warning'|'success'|'error'} type
   */
  _showToast(message, type = 'info') {
    // Remove existing toast if present
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      success: '✅',
      error: '❌'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    // Auto-dismiss after 3s
    setTimeout(() => {
      toast.classList.remove('toast-visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

/* ════════════════════════════════════════════════════════════════════════
   Bootstrap
   ════════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
