const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const recipeData = require('../../js/recipe-data');

/**
 * Create a fresh JSDOM browser-like global environment for unit and integration tests.
 * @param {Object} [options]
 * @param {boolean} [options.loadIndexHtml=false] - Load full index.html shell into the DOM
 */
function setupDomEnv({ loadIndexHtml = false } = {}) {
  const html = loadIndexHtml
    ? fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8')
        // Strip external CDN/script tags so JSDOM doesn't attempt network loads
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<link[^>]*>/gi, '')
    : '<!DOCTYPE html><html><body><main id="app-main"></main></body></html>';

  const dom = new JSDOM(html, {
    url: 'http://localhost:5000/',
    pretendToBeVisual: true,
  });

  const { window } = dom;

  global.window = window;
  global.document = window.document;
  global.localStorage = window.localStorage;
  global.HTMLElement = window.HTMLElement;
  global.Node = window.Node;
  global.Event = window.Event;
  global.KeyboardEvent = window.KeyboardEvent;
  global.MouseEvent = window.MouseEvent;
  global.Blob = window.Blob;
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  global.confirm = jest.fn(() => true);
  global.alert = jest.fn();

  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  }
  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = jest.fn();
  }
  global.URL = window.URL;
  window.print = jest.fn();
  window.scrollTo = jest.fn();

  // Attach recipe data globals just like browser <script src="js/recipe-data.js">
  global.RECIPES = recipeData.RECIPES;
  global.COMMON_GROCERIES = recipeData.COMMON_GROCERIES;
  global.INGREDIENT_CATEGORIES = recipeData.INGREDIENT_CATEGORIES;
  global.SWAP_REGISTRY = recipeData.SWAP_REGISTRY;
  global.DEFAULT_PANTRY_STAPLES = recipeData.DEFAULT_PANTRY_STAPLES;

  return dom;
}

function teardownDomEnv(dom) {
  if (dom && dom.window) {
    dom.window.close();
  }
}

module.exports = { setupDomEnv, teardownDomEnv };
