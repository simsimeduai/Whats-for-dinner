// Manual Test Checklist for What\'s for Dinner

- [ ] Load the app in a browser (http://localhost:5000) and verify dark mode and glassmorphism styling.
- [ ] Step 1: Add groceries manually – ensure chips appear and can be removed.
- [ ] Step 1: Upload a receipt image – OCR runs, progress bar updates, and grocery items are parsed correctly.
- [ ] Step 1: Upload a CSV file – items are parsed and displayed as chips.
- [ ] Step 2: Select one or more cuisines – selected count updates, and cards show checkmarks.
- [ ] Step 3: Generate week plan – meal cards appear for each day, with correct cuisine tags.
- [ ] Verify missing ingredients are highlighted in red and available ones in green.
- [ ] Resize the browser to test responsive breakpoints (desktop, tablet, mobile).
- [ ] Test navigation back and forth – state persists across steps.
- [ ] Test on a mobile device (or emulator) – touch targets are at least 48 dp.
- [ ] Verify that the app works offline after a page reload (no network required for core features).
- [ ] Verify printing the Meal Plan (via the "Print" button on Step 3) renders only the 7-day meal plan list layout, hiding navigation buttons, header, stepper, legend, and action buttons.
- [ ] Verify printing the Shopping List (via the "Print List" button inside the Shopping List sliding panel) renders only the clean shopping list categorized by store sections, hiding the rest of the application layout.
- [ ] Verify that the "Add to calendar" button is visible on Step 3 above Print/Regenerate.
- [ ] Verify clicking "Add to calendar" downloads a valid `whats-for-dinner-meal-plan.ics` calendar file with events for the upcoming week.
- [ ] Verify that the top stepper header (In My Pantry, Cuisines & Diet) is completely hidden on Step 3 (Meal Plan page).
- [ ] Verify that the GitHub Pages URL loads the app correctly.

## Mobile App QA (PWA, iOS & Android)
- [ ] Install as a PWA from mobile Safari / Chrome ("Add to Home Screen") and verify standalone launch and offline mode (Airplane Mode).
- [ ] Safe Areas: Verify header, stepper, bottom navigation, and Shopping List FAB do not collide with iOS notch / Dynamic Island or Android gesture bar.
- [ ] Session Persistence: Add groceries, select cuisines, generate a plan, force-quit the app, and relaunch — verify state restores cleanly.
- [ ] Receipt Scanner: Tap **Take Receipt Photo** and **Photo Library** on device; verify permission prompts, downscaled OCR scan, and item checklist import.
- [ ] Day Pill Bar: On Step 3, tap `Mon`–`Sun` and `All` pills to filter days smoothly on narrow screens.
- [ ] Shopping List Bottom Sheet: Swipe down on the drag handle/header to dismiss; tap **Share List** on mobile to open native Share Sheet.
- [ ] Calendar Export: Tap **Add to Calendar** on iOS/Android and verify native share/import of `whats-for-dinner-meal-plan.ics`.
- [ ] Android Hardware Back Button: Verify Back closes swap popovers → closes Shopping List drawer → steps back in wizard → exits only on Step 1.
- [ ] Offline Web Recipe Search: Turn on Airplane Mode and tap **Search Web Recipes** — verify clean offline toast while built-in recipes continue working.

*Mark each item as you verify it.*
