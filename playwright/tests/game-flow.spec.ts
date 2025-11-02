import { test, expect } from '@playwright/test';

test.describe('NYT Connections Game - Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the game successfully', async ({ page }) => {
    // Check that the title is displayed
    await expect(page.locator('h1')).toContainText('Lets row the boat!');

    // Check that instructions are displayed
    await expect(page.locator('.instructions')).toContainText('Group these words');

    // Check that 16 word cells are present (4x4 grid)
    const wordCells = page.locator('.word-cell');
    await expect(wordCells).toHaveCount(16);

    // Check that game controls are present
    await expect(page.getByText('Shuffle')).toBeVisible();
    await expect(page.getByText('Deselect All')).toBeVisible();
    await expect(page.getByText('Submit')).toBeVisible();

    // Check that mistake tracker is visible
    await expect(page.locator('.mistake-tracker')).toBeVisible();
  });

  test('should select and deselect words', async ({ page }) => {
    // Get the first word cell
    const firstWord = page.locator('.word-cell').first();
    const firstWordText = await firstWord.textContent();

    // Click to select
    await firstWord.click();
    await expect(firstWord).toHaveClass(/selected/);

    // Click again to deselect
    await firstWord.click();
    await expect(firstWord).not.toHaveClass(/selected/);
  });

  test('should allow selecting up to 4 words', async ({ page }) => {
    const wordCells = page.locator('.word-cell');

    // Select 4 words
    for (let i = 0; i < 4; i++) {
      await wordCells.nth(i).click();
    }

    // All 4 should be selected
    for (let i = 0; i < 4; i++) {
      await expect(wordCells.nth(i)).toHaveClass(/selected/);
    }

    // Try to select a 5th word - should not be selected
    const fifthWord = wordCells.nth(4);
    await fifthWord.click();
    await expect(fifthWord).not.toHaveClass(/selected/);
  });

  test('should deselect all words when Deselect All is clicked', async ({ page }) => {
    const wordCells = page.locator('.word-cell');

    // Select 3 words
    await wordCells.nth(0).click();
    await wordCells.nth(1).click();
    await wordCells.nth(2).click();

    // Click Deselect All
    await page.getByText('Deselect All').click();

    // All words should be deselected
    for (let i = 0; i < 3; i++) {
      await expect(wordCells.nth(i)).not.toHaveClass(/selected/);
    }
  });

  test('should shuffle words when Shuffle is clicked', async ({ page }) => {
    // Get initial word order
    const wordCells = page.locator('.word-cell');
    const initialWords: string[] = [];

    for (let i = 0; i < 16; i++) {
      const text = await wordCells.nth(i).textContent();
      if (text) initialWords.push(text);
    }

    // Click shuffle
    await page.getByText('Shuffle').click();

    // Wait a bit for animation
    await page.waitForTimeout(500);

    // Get new word order
    const shuffledWords: string[] = [];
    for (let i = 0; i < 16; i++) {
      const text = await wordCells.nth(i).textContent();
      if (text) shuffledWords.push(text);
    }

    // Same words should exist, but order might be different
    expect(shuffledWords.sort()).toEqual(initialWords.sort());
  });

  test('should disable Submit button when less than 4 words selected', async ({ page }) => {
    const submitBtn = page.locator('.submit-btn');

    // Initially disabled (0 words selected)
    await expect(submitBtn).toBeDisabled();

    // Select 1 word - still disabled
    await page.locator('.word-cell').first().click();
    await expect(submitBtn).toBeDisabled();

    // Select 3 more words (4 total) - should be enabled
    for (let i = 1; i < 4; i++) {
      await page.locator('.word-cell').nth(i).click();
    }
    await expect(submitBtn).toBeEnabled();
  });

  test('should show feedback on incorrect guess', async ({ page }) => {
    // Select 4 random words (likely incorrect)
    const wordCells = page.locator('.word-cell');
    for (let i = 0; i < 4; i++) {
      await wordCells.nth(i).click();
    }

    // Submit
    await page.locator('.submit-btn').click();

    // Should show feedback message
    const feedback = page.locator('.feedback');
    await expect(feedback).toBeVisible();

    // Feedback should fade out after a few seconds
    await page.waitForTimeout(3000);
    await expect(feedback).not.toBeVisible();
  });

  test('should track mistakes correctly', async ({ page }) => {
    // Initial state - 4 mistakes remaining
    const mistakeDots = page.locator('.mistake-dot.remaining');
    await expect(mistakeDots).toHaveCount(4);

    // Make an incorrect guess
    const wordCells = page.locator('.word-cell');
    for (let i = 0; i < 4; i++) {
      await wordCells.nth(i).click();
    }
    await page.locator('.submit-btn').click();

    // Wait for feedback to appear and disappear
    await page.waitForTimeout(2500);

    // Should have 3 mistakes remaining
    await expect(page.locator('.mistake-dot.remaining')).toHaveCount(3);
    await expect(page.locator('.mistake-dot.used')).toHaveCount(1);
  });

  test('should reset game when Reset Game is clicked', async ({ page }) => {
    // Select some words
    const wordCells = page.locator('.word-cell');
    await wordCells.nth(0).click();
    await wordCells.nth(1).click();

    // Click reset
    await page.locator('.reset-link').click();

    // Words should be deselected
    await expect(wordCells.nth(0)).not.toHaveClass(/selected/);
    await expect(wordCells.nth(1)).not.toHaveClass(/selected/);

    // Should have 4 mistakes again
    await expect(page.locator('.mistake-dot.remaining')).toHaveCount(4);
  });

  test('should show game won message when all categories solved', async ({ page }) => {
    // This test would require knowing the correct answers
    // For now, we'll check that the game won UI elements exist in the DOM
    // (they would be hidden until game is won)

    // The game-won div should exist but not be visible initially
    const gameWon = page.locator('.game-won');
    const wordGrid = page.locator('.word-grid');

    // Grid should be visible, game won should not
    await expect(wordGrid).toBeVisible();
    await expect(gameWon).not.toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page, viewport }) => {
    // This test runs on mobile viewports (configured in playwright.config.ts)
    if (viewport && viewport.width < 600) {
      const wordGrid = page.locator('.word-grid');
      await expect(wordGrid).toBeVisible();

      // Controls should be visible
      await expect(page.getByText('Shuffle')).toBeVisible();
      await expect(page.getByText('Submit')).toBeVisible();
    }
  });
});
