/**
 * StorageAdapter — Cross-platform persistent storage for "What's for Dinner"
 *
 * Uses an in-memory synchronous cache backed by:
 *  - @capacitor/preferences on native iOS & Android (immune to WKWebView localStorage eviction)
 *  - window.localStorage on Web / PWA
 *
 * Call `await StorageAdapter.init()` once before booting App so all persisted keys
 * are hydrated into the synchronous cache.
 */
const STORAGE_KEYS = [
  'wfd_pantry_staples',
  'wfd_custom_recipes',
  'wfd_profiles',
  'wfd_swaps',
  'wfd_recipe_subs',
  'wfd_personal_swaps',
  'wfd_shopping_list',
  'wfd_session_state'
];

const StorageAdapter = {
  /** @type {Map<string, string>} Synchronous read cache */
  _cache: new Map(),

  /** @type {boolean} */
  _initialized: false,

  /** @type {Object|null} Optional Capacitor Preferences plugin */
  _preferences: null,

  /**
   * Hydrate storage cache from native Preferences (if available) or localStorage.
   * @param {Object|null} [preferencesPlugin] - Optional @capacitor/preferences instance
   * @returns {Promise<void>}
   */
  async init(preferencesPlugin = null) {
    if (preferencesPlugin) {
      this._preferences = preferencesPlugin;
    }

    for (const key of STORAGE_KEYS) {
      let value = null;

      // 1. Prefer native Preferences when running inside Capacitor
      if (this._preferences) {
        try {
          const res = await this._preferences.get({ key });
          if (res && typeof res.value === 'string') {
            value = res.value;
          }
        } catch (err) {
          console.warn(`[StorageAdapter] Native get failed for ${key}:`, err);
        }
      }

      // 2. Fallback / migrate from localStorage if native value wasn't stored yet
      if (value === null && typeof localStorage !== 'undefined') {
        try {
          const lsVal = localStorage.getItem(key);
          if (lsVal !== null) {
            value = lsVal;
            if (this._preferences) {
              this._preferences.set({ key, value: lsVal }).catch(() => {});
            }
          }
        } catch {
          // Ignore storage access errors (e.g. private browsing)
        }
      }

      if (value !== null) {
        this._cache.set(key, value);
      }
    }

    this._initialized = true;
  },

  /**
   * Synchronously retrieve a raw string value.
   * @param {string} key
   * @returns {string|null}
   */
  getItem(key) {
    if (this._cache.has(key)) {
      return this._cache.get(key);
    }
    if (typeof localStorage !== 'undefined') {
      try {
        const val = localStorage.getItem(key);
        if (val !== null) {
          this._cache.set(key, val);
          return val;
        }
      } catch {
        // Ignore
      }
    }
    return null;
  },

  /**
   * Synchronously update cache and persist to localStorage + native Preferences.
   * @param {string} key
   * @param {string} value
   */
  setItem(key, value) {
    const strVal = String(value);
    this._cache.set(key, strVal);

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, strVal);
      } catch {
        // Ignore quota / private browsing errors
      }
    }

    if (this._preferences) {
      this._preferences.set({ key, value: strVal }).catch((err) => {
        console.warn(`[StorageAdapter] Native set failed for ${key}:`, err);
      });
    }
  },

  /**
   * Remove a key from cache, localStorage, and native Preferences.
   * @param {string} key
   */
  removeItem(key) {
    this._cache.delete(key);

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore
      }
    }

    if (this._preferences) {
      this._preferences.remove({ key }).catch(() => {});
    }
  },

  /**
   * Retrieve and JSON-parse a key with a safe fallback.
   * @template T
   * @param {string} key
   * @param {T} fallback
   * @returns {T}
   */
  getJSON(key, fallback) {
    try {
      const raw = this.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  /**
   * JSON-stringify and persist a value.
   * @param {string} key
   * @param {*} value
   */
  setJSON(key, value) {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[StorageAdapter] Failed to serialize ${key}:`, err);
    }
  }
};

if (typeof window !== 'undefined') {
  window.StorageAdapter = StorageAdapter;
}

if (typeof module !== 'undefined') {
  module.exports = StorageAdapter;
}
