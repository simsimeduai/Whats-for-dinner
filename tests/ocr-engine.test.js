const OCREngine = require('../js/ocr-engine');

describe('OCREngine.parseReceiptText', () => {
  test('returns empty array for empty or non-string input', () => {
    expect(OCREngine.parseReceiptText('')).toEqual([]);
    expect(OCREngine.parseReceiptText(null)).toEqual([]);
    expect(OCREngine.parseReceiptText(undefined)).toEqual([]);
  });

  test('strips headers, addresses, phone numbers, dates, and financial lines', () => {
    const raw = `
      FRESH MARKET GROCERY INC
      123 MAIN ST
      (555) 123-4567
      07/12/2026 14:32
      TRANS #99812
      Organic Chicken Breast $8.99 F
      2 x Roma Tomatoes 3.49 T
      SUBTOTAL 12.48
      TAX 0.99
      TOTAL 13.47
      VISA 13.47
      THANK YOU FOR SHOPPING
    `;

    const items = OCREngine.parseReceiptText(raw);
    expect(items).toEqual(['organic chicken breast', 'roma tomatoes']);
  });

  test('strips weight suffixes and known receipt tax/noise codes', () => {
    const raw = `
      ONIONS 1 kg 2.99 F
      POTATOES 500gm 1.50
      BANANAS F
      MILK TX
      APPLES ER
      TOMATOES RIG
      CARROTS PY
    `;

    const items = OCREngine.parseReceiptText(raw);
    expect(items).toEqual([
      'onions',
      'potatoes',
      'bananas',
      'milk',
      'apples',
      'tomatoes',
      'carrots',
    ]);
  });

  test('preserves valid 2-3 letter trailing food words (regression)', () => {
    const raw = `
      OLIVE OIL 7.99 F
      GREEN TEA 4.49 T
      SWEET PEA 2.29
      APPLE PIE 6.99
      RED YAM 1.99
      SMOKED HAM 5.49
      FRESH EGG 3.99
    `;

    const items = OCREngine.parseReceiptText(raw);
    expect(items).toEqual([
      'olive oil',
      'green tea',
      'sweet pea',
      'apple pie',
      'red yam',
      'smoked ham',
      'fresh egg',
    ]);
  });

  test('deduplicates items and filters junk receipt words', () => {
    const raw = `
      Avocado 1.50
      AVOCADO 1.50
      QTY
      UPC
      COUPON
      APPROVED
    `;

    expect(OCREngine.parseReceiptText(raw)).toEqual(['avocado']);
  });
});
