/**
 * Application entry point for Vite + PWA + Capacitor mobile builds.
 * Loads self-hosted fonts, styles, bundled Tesseract.js, platform adapters,
 * and all core modules in order, then hydrates storage before booting App.
 */
import '@fontsource/outfit/300.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/800.css';

import '../css/style.css';

import Tesseract from 'tesseract.js';
import NativeBridge from './native-bridge.js';
import './storage-adapter.js';
import './recipe-data.js';
import './ocr-engine.js';
import './grocery-input.js';
import './cuisine-picker.js';
import './meal-planner.js';
import './shopping-list.js';
import './app.js';

if (typeof window !== 'undefined') {
  window.Tesseract = Tesseract;
  window.NativeBridge = NativeBridge;
}

async function bootstrap() {
  // Hydrate persistent storage before rendering any screen
  if (window.StorageAdapter) {
    await window.StorageAdapter.init(NativeBridge.getPreferencesPlugin());
  }

  // Boot the application controller
  if (window.App && typeof window.App.init === 'function') {
    window.App.init();
  }

  // Wire native lifecycle, status bar, keyboard, and Android back button
  await NativeBridge.init({
    onBackButton: () => {
      if (window.App && typeof window.App.handleHardwareBack === 'function') {
        return window.App.handleHardwareBack();
      }
      return false;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
