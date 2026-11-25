/**
 * NativeBridge — Capacitor native hardware & platform integration layer
 *
 * Detects whether the app is running inside a native Capacitor shell (iOS/Android)
 * or a standard web browser, and exposes unified APIs for:
 *  - Camera & photo gallery receipt capture
 *  - Native Share Sheet (shopping list & meal plan)
 *  - Native Calendar .ics file export via Filesystem + Share
 *  - Haptic feedback
 *  - Network connectivity detection
 *  - StatusBar, SplashScreen, Keyboard, and Android hardware Back button
 */
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';
import { Share } from '@capacitor/share';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

const NativeBridge = {
  /** @type {boolean} */
  isNative: Capacitor.isNativePlatform(),

  /** @type {string} 'ios' | 'android' | 'web' */
  platform: Capacitor.getPlatform(),

  /** @type {boolean} */
  _isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,

  /**
   * Return the Capacitor Preferences plugin only on native platforms.
   */
  getPreferencesPlugin() {
    return this.isNative ? Preferences : null;
  },

  /**
   * Initialize native UI chrome, keyboard listeners, network status, and back button.
   * @param {Object} handlers
   * @param {function(): boolean} [handlers.onBackButton] - Return true if handled internally
   */
  async init(handlers = {}) {
    // Track network status on both web and native
    try {
      const status = await Network.getStatus();
      this._isOnline = status.connected;
      Network.addListener('networkStatusChange', (s) => {
        this._isOnline = s.connected;
        document.body.classList.toggle('app-offline', !s.connected);
      });
    } catch {
      if (typeof window !== 'undefined') {
        window.addEventListener('online', () => {
          this._isOnline = true;
          document.body.classList.remove('app-offline');
        });
        window.addEventListener('offline', () => {
          this._isOnline = false;
          document.body.classList.add('app-offline');
        });
      }
    }

    if (!this.isNative) return;

    document.body.classList.add('platform-native', `platform-${this.platform}`);

    // Configure native status bar
    try {
      await StatusBar.setStyle({ style: Style.Light });
      if (this.platform === 'android') {
        await StatusBar.setBackgroundColor({ color: '#F3F4F6' });
      }
    } catch (err) {
      console.warn('[NativeBridge] StatusBar setup skipped:', err);
    }

    // Keyboard visibility class so sticky footer hides while typing on mobile
    try {
      Keyboard.addListener('keyboardWillShow', () => {
        document.body.classList.add('keyboard-open');
      });
      Keyboard.addListener('keyboardWillHide', () => {
        document.body.classList.remove('keyboard-open');
      });
    } catch (err) {
      console.warn('[NativeBridge] Keyboard listeners skipped:', err);
    }

    // Android hardware back button handling
    if (typeof handlers.onBackButton === 'function') {
      try {
        CapApp.addListener('backButton', ({ canGoBack }) => {
          const handled = handlers.onBackButton();
          if (!handled && !canGoBack) {
            CapApp.exitApp();
          }
        });
      } catch (err) {
        console.warn('[NativeBridge] BackButton listener skipped:', err);
      }
    }

    // Hide splash screen after hydration and initial render
    try {
      await SplashScreen.hide();
    } catch {
      // Ignore if not configured
    }
  },

  /**
   * Check whether the device currently has network connectivity.
   * @returns {Promise<boolean>}
   */
  async isOnline() {
    try {
      const status = await Network.getStatus();
      this._isOnline = status.connected;
      return status.connected;
    } catch {
      return typeof navigator !== 'undefined' ? navigator.onLine : true;
    }
  },

  /**
   * Capture or pick a receipt image using the native Camera plugin.
   * Returns a standard Blob/File compatible with OCREngine.scanReceipt().
   * @param {'camera'|'photos'|'prompt'} [source='prompt']
   * @returns {Promise<File|null>}
   */
  async captureReceiptPhoto(source = 'prompt') {
    if (!this.isNative) return null;

    const sourceMap = {
      camera: CameraSource.Camera,
      photos: CameraSource.Photos,
      prompt: CameraSource.Prompt
    };

    try {
      const photo = await Camera.getPhoto({
        quality: 85,
        width: 1600,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: sourceMap[source] || CameraSource.Prompt
      });

      if (!photo || !photo.webPath) return null;

      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return new File([blob], `receipt-${Date.now()}.${photo.format || 'jpg'}`, {
        type: blob.type || 'image/jpeg'
      });
    } catch (err) {
      // User cancelled camera/picker
      if (err && /cancel/i.test(String(err.message || err))) {
        return null;
      }
      throw err;
    }
  },

  /**
   * Share plain text (e.g., categorized shopping list or weekly meal plan summary).
   * Falls back to Web Share API when available; returns false if caller should fall back to print.
   * @param {{ title: string, text: string, dialogTitle?: string }} payload
   * @returns {Promise<boolean>} True if shared via native/Web Share sheet
   */
  async shareText({ title, text, dialogTitle }) {
    if (this.isNative) {
      try {
        await Share.share({
          title,
          text,
          dialogTitle: dialogTitle || title
        });
        return true;
      } catch (err) {
        if (err && /cancel/i.test(String(err.message || err))) return true;
        console.warn('[NativeBridge] Native share failed:', err);
      }
    }

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text });
        return true;
      } catch (err) {
        if (err && err.name === 'AbortError') return true;
      }
    }

    return false;
  },

  /**
   * Export an .ics calendar file natively on iOS/Android via Filesystem + Share.
   * Returns false on web so the caller can use standard anchor download.
   * @param {string} icsContent
   * @param {string} [filename='whats-for-dinner-meal-plan.ics']
   * @returns {Promise<boolean>}
   */
  async exportCalendarFile(icsContent, filename = 'whats-for-dinner-meal-plan.ics') {
    if (!this.isNative) return false;

    try {
      const written = await Filesystem.writeFile({
        path: filename,
        data: icsContent,
        directory: Directory.Cache,
        encoding: Encoding.UTF8
      });

      await Share.share({
        title: "What's for Dinner — Weekly Meal Plan",
        text: 'Import your weekly meal plan into your calendar.',
        url: written.uri,
        dialogTitle: 'Add Meal Plan to Calendar'
      });
      return true;
    } catch (err) {
      if (err && /cancel/i.test(String(err.message || err))) return true;
      console.warn('[NativeBridge] Native ICS export failed:', err);
      return false;
    }
  },

  /**
   * Trigger subtle haptic feedback on native devices (no-op on web).
   * @param {'light'|'medium'|'success'|'warning'} [type='light']
   */
  async haptic(type = 'light') {
    if (!this.isNative) return;
    try {
      if (type === 'success') {
        await Haptics.notification({ type: NotificationType.Success });
      } else if (type === 'warning') {
        await Haptics.notification({ type: NotificationType.Warning });
      } else if (type === 'medium') {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } else {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
    } catch {
      // Ignore haptics errors on unsupported devices
    }
  }
};

if (typeof window !== 'undefined') {
  window.NativeBridge = NativeBridge;
}

export default NativeBridge;
