/**
 * OCR Engine Module
 *
 * Wraps Tesseract.js v6 (loaded via CDN) to provide receipt scanning
 * functionality for the meal planning app. Handles image preprocessing,
 * text recognition, and receipt text parsing into grocery item names.
 *
 * @global
 */
const OCREngine = {
  /** @type {Tesseract.Worker|null} */
  worker: null,

  /**
   * Initialize the Tesseract.js worker.
   * Creates a new worker configured for English language recognition.
   *
   * @returns {Promise<void>}
   * @throws {Error} If Tesseract global is not available or worker creation fails.
   */
  async init() {
    try {
      if (typeof Tesseract === 'undefined') {
        throw new Error(
          'Tesseract.js is not loaded. Ensure the CDN script is included in the HTML.'
        );
      }

      this.worker = await Tesseract.createWorker('eng');
    } catch (error) {
      console.error('[OCREngine] Failed to initialize Tesseract worker:', error);
      this.worker = null;
      throw error;
    }
  },

  /**
   * Preprocess an image file for better OCR accuracy.
   *
   * Applies the following transformations on an off-screen canvas:
   *  1. Grayscale conversion (average of RGB channels)
   *  2. Contrast enhancement (~50% increase)
   *
   * @param {File} file - The image file to preprocess.
   * @returns {Promise<Blob>} A PNG Blob of the processed image.
   * @throws {Error} If the file cannot be loaded or processed.
   */
  async preprocessImage(file) {
    try {
      const imageBitmap = await createImageBitmap(file);

      // Create an off-screen canvas matching the image dimensions
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext('2d');

      // Draw the original image
      ctx.drawImage(imageBitmap, 0, 0);
      imageBitmap.close();

      // Get pixel data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // --- Step 1: Grayscale conversion ---
      for (let i = 0; i < pixels.length; i += 4) {
        const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        pixels[i] = gray;       // R
        pixels[i + 1] = gray;   // G
        pixels[i + 2] = gray;   // B
        // Alpha (pixels[i + 3]) remains unchanged
      }

      // --- Step 2: Contrast enhancement (~50% increase) ---
      const contrastFactor = 1.5; // 50% increase
      const intercept = 128 * (1 - contrastFactor);

      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = Math.max(0, Math.min(255, contrastFactor * pixels[i] + intercept));
        pixels[i + 1] = Math.max(0, Math.min(255, contrastFactor * pixels[i + 1] + intercept));
        pixels[i + 2] = Math.max(0, Math.min(255, contrastFactor * pixels[i + 2] + intercept));
      }

      // Write processed data back to canvas
      ctx.putImageData(imageData, 0, 0);

      // Convert canvas to Blob
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert processed canvas to Blob.'));
            }
          },
          'image/png'
        );
      });
    } catch (error) {
      console.error('[OCREngine] Image preprocessing failed:', error);
      throw error;
    }
  },

  /**
   * Run OCR on an image file using Tesseract.js.
   *
   * Automatically initializes the worker if it hasn't been created yet.
   * The image is preprocessed before recognition for better accuracy.
   *
   * @param {File} file - The image file to recognize text from.
   * @param {function(number): void} [onProgress] - Optional progress callback
   *   receiving a percentage value from 0 to 100.
   * @returns {Promise<string>} The recognized raw text string.
   * @throws {Error} If recognition fails.
   */
  async recognizeText(file, onProgress) {
    try {
      // Preprocess the image for better OCR results
      const processedBlob = await this.preprocessImage(file);

      // Terminate any existing worker before creating a new one with logger
      if (this.worker) {
        try { await this.worker.terminate(); } catch (_) { /* ignore */ }
        this.worker = null;
      }

      // Create worker with optional progress logger
      const workerOptions = { logger: undefined };
      if (typeof onProgress === 'function') {
        workerOptions.logger = (info) => {
          if (info && typeof info.progress === 'number') {
            onProgress(Math.round(info.progress * 100));
          }
        };
      }

      this.worker = await Tesseract.createWorker('eng', 1, workerOptions);

      // Run recognition
      const result = await this.worker.recognize(processedBlob);

      return result.data.text;
    } catch (error) {
      console.error('[OCREngine] Text recognition failed:', error);
      throw error;
    }
  },

  /**
   * Parse raw receipt text into an array of cleaned grocery item names.
   *
   * Applies a multi-step cleaning pipeline to strip noise, prices,
   * transaction metadata, and other non-item text commonly found on
   * grocery store receipts.
   *
   * @param {string} rawText - The raw OCR text from a receipt image.
   * @returns {string[]} An array of cleaned, lowercase grocery item names.
   */
  parseReceiptText(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      return [];
    }

    // Step 1: Split text into lines
    let lines = rawText.split('\n');

    // Step 2: Remove empty lines and lines that are just whitespace
    lines = lines.filter((line) => line.trim().length > 0);

    // Step 3: Remove store header lines
    // Matches lines that are all caps AND contain common header words,
    // or lines that look like phone numbers / addresses
    const headerWords =
      /\b(STORE|MART|WELCOME|THANK|RECEIPT|TRANSACTION|SUPERMARKET|GROCERY|INC|LLC|LTD)\b/i;
    const phonePattern = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const addressPattern = /\d+\s+[\w\s]+(ST|AVE|BLVD|RD|DR|LN|CT|WAY|PKWY|PL|HWY)\b/i;

    lines = lines.filter((line) => {
      const trimmed = line.trim();
      // All-caps line containing header words
      if (trimmed === trimmed.toUpperCase() && headerWords.test(trimmed)) {
        return false;
      }
      // Phone number lines
      if (phonePattern.test(trimmed)) {
        return false;
      }
      // Address lines
      if (addressPattern.test(trimmed)) {
        return false;
      }
      return true;
    });

    // Step 4: Remove date, time, and transaction ID lines
    const datePattern = /^\s*\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\s*$/;
    const timePattern = /^\s*\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM)?\s*$/i;
    const dateTimeCombo =
      /^\s*\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\s+\d{1,2}:\d{2}/;
    const transactionIdPattern = /^\s*(TRANS|TXN|REF|AUTH|APPR|#)\s*[:#]?\s*[\dA-Z\-]+\s*$/i;

    lines = lines.filter((line) => {
      const trimmed = line.trim();
      if (datePattern.test(trimmed)) return false;
      if (timePattern.test(trimmed)) return false;
      if (dateTimeCombo.test(trimmed)) return false;
      if (transactionIdPattern.test(trimmed)) return false;
      return true;
    });

    // Step 5: Remove financial summary lines
    const financialWords =
      /\b(TOTAL|SUBTOTAL|SUB\s*TOTAL|TAX|CHANGE|CASH|CREDIT|DEBIT|CARD|BALANCE|VISA|MASTERCARD|AMEX|PAYMENT|TENDER|DUE|SAVINGS|DISCOUNT)\b/i;

    lines = lines.filter((line) => !financialWords.test(line));

    // Step 6: Remove lines that are ONLY numbers/prices
    const onlyPricePattern = /^\s*\$?\d+\.?\d*\s*$/;

    lines = lines.filter((line) => !onlyPricePattern.test(line.trim()));

    // Step 7: Strip trailing prices and quantity prefixes from remaining lines
    lines = lines.map((line) => {
      let cleaned = line;

      // Remove trailing price patterns like "$12.99", "12.99", "$1.99 F", "1.99 T"
      cleaned = cleaned.replace(/\s+\$?\d+\.\d{2}\s*[A-Z]?\s*$/, '');
      // Also handle prices without decimal
      cleaned = cleaned.replace(/\s+\$\d+\s*$/, '');

      // Remove leading quantity prefixes like "2 x ", "2x ", "3 X ", "1 @ "
      cleaned = cleaned.replace(/^\s*\d+\s*[xX@]\s+/, '');
      // Also handle "2x" directly attached
      cleaned = cleaned.replace(/^\s*\d+[xX]\s*/, '');

      return cleaned;
    });

    // Step 8: Strip non-alpha characters from start and end of each line
    lines = lines.map((line) => line.replace(/^[^a-zA-Z]+/, '').replace(/[^a-zA-Z]+$/, ''));

    // Step 9: Normalize — trim, lowercase, collapse multiple spaces
    lines = lines.map((line) => line.trim().toLowerCase().replace(/\s{2,}/g, ' '));

    // Step 10: Remove duplicates
    lines = [...new Set(lines)];

    // Step 11: Filter out items that are too short (< 2 chars) or too long (> 50 chars)
    lines = lines.filter((line) => line.length >= 2 && line.length <= 50);

    // Step 12: Filter out remaining junk
    const junkWords = new Set([
      'qty', 'upc', 'sku', 'item', 'price', 'each', 'ea', 'lb', 'oz',
      'ct', 'pk', 'reg', 'sale', 'void', 'return', 'refund', 'coupon',
      'member', 'loyalty', 'points', 'rewards', 'barcode', 'scan',
      'cashier', 'clerk', 'register', 'lane', 'sequence', 'check',
      'approved', 'declined', 'chip', 'swipe', 'pin', 'signature',
    ]);
    const onlyNumbersPattern = /^\d+$/;
    const singleCharPattern = /^.$/;

    lines = lines.filter((line) => {
      if (onlyNumbersPattern.test(line)) return false;
      if (singleCharPattern.test(line)) return false;
      if (junkWords.has(line)) return false;
      return true;
    });

    return lines;
  },

  /**
   * Full receipt scanning pipeline: preprocess → recognize → parse.
   *
   * This is the primary entry point for scanning a receipt image.
   * It preprocesses the image, runs OCR, and parses the text into
   * grocery item names.
   *
   * @param {File} file - The receipt image file to scan.
   * @param {function(number): void} [onProgress] - Optional progress callback
   *   receiving a percentage value from 0 to 100.
   * @returns {Promise<{rawText: string, items: string[]}>} An object containing
   *   the raw OCR text and an array of parsed grocery item names.
   * @throws {Error} If any step of the pipeline fails.
   */
  async scanReceipt(file, onProgress) {
    try {
      const rawText = await this.recognizeText(file, onProgress);
      const items = this.parseReceiptText(rawText);

      return { rawText, items };
    } catch (error) {
      console.error('[OCREngine] Receipt scanning pipeline failed:', error);
      throw error;
    }
  },

  /**
   * Clean up and terminate the Tesseract worker.
   * Frees resources. The worker must be re-initialized via init()
   * before performing any further recognition.
   *
   * @returns {Promise<void>}
   */
  async terminate() {
    try {
      if (this.worker) {
        await this.worker.terminate();
        this.worker = null;
      }
    } catch (error) {
      console.error('[OCREngine] Failed to terminate worker:', error);
      this.worker = null;
      throw error;
    }
  },
};
