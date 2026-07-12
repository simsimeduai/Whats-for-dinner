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

*Mark each item as you verify it.*
