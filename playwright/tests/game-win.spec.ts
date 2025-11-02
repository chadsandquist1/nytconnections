import { test, expect } from '@playwright/test';

test.describe('NYT Connections Game - Winning Scenario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the game to load
    await page.waitForSelector('.word-cell');
  });

  test('should solve a category correctly and show it as solved', async ({ page }) => {
    // Correct answer for "Gold" category: Nugget, Rush, Medal, Bullion
    const correctWords = ['NUGGET', 'RUSH', 'MEDAL', 'BULLION'];

    // Select all correct words
    for (const word of correctWords) {
      await page.locator('.word-cell', { hasText: word }).click();
    }

    // Submit the answer
    await page.locator('.submit-btn').click();

    // Should show positive feedback
    await expect(page.locator('.feedback')).toContainText('Correct');

    // Wait for feedback to disappear
    await page.waitForTimeout(2500);

    // Check that a solved category row appears
    const solvedCategories = page.locator('.category-row');
    await expect(solvedCategories).toHaveCount(1);

    // The category name should be visible
    await expect(page.locator('.category-name')).toContainText('Gold');

    // The words should be displayed in the category
    await expect(page.locator('.category-words')).toContainText('NUGGET');

    // Word grid should now have 12 words (16 - 4)
    const remainingWords = page.locator('.word-cell');
    await expect(remainingWords).toHaveCount(12);
  });

  test('should win the game by solving all categories', async ({ page }) => {
    // Category 1: Gold
    await selectAndSubmit(page, ['NUGGET', 'RUSH', 'MEDAL', 'BULLION']);
    await page.waitForTimeout(2500);

    // Category 2: Maroon
    await selectAndSubmit(page, ['BURGUNDY', 'STRANDED', 'CASTAWAY', 'ISOLATED']);
    await page.waitForTimeout(2500);

    // Category 3: Gopher
    await selectAndSubmit(page, ['RODENT', 'GNAW', 'BURROW', 'PRAIRIE']);
    await page.waitForTimeout(2500);

    // Category 4: College
    await selectAndSubmit(page, ['DORM', 'MAJOR', 'TUITION', 'SEMESTER']);
    await page.waitForTimeout(2500);

    // Check that all 4 categories are displayed
    await expect(page.locator('.category-row')).toHaveCount(4);

    // Game won message should appear
    const gameWon = page.locator('.game-won');
    await expect(gameWon).toBeVisible();
    await expect(gameWon.locator('h2')).toContainText('Minnesota');

    // Word grid should not be visible
    await expect(page.locator('.word-grid')).not.toBeVisible();

    // Play Again button should be visible
    await expect(page.getByRole('button', { name: /play again/i })).toBeVisible();
  });

  test('should show celebration overlay when game is won', async ({ page }) => {
    // Solve all categories
    await selectAndSubmit(page, ['NUGGET', 'RUSH', 'MEDAL', 'BULLION']);
    await page.waitForTimeout(2500);

    await selectAndSubmit(page, ['BURGUNDY', 'STRANDED', 'CASTAWAY', 'ISOLATED']);
    await page.waitForTimeout(2500);

    await selectAndSubmit(page, ['RODENT', 'GNAW', 'BURROW', 'PRAIRIE']);
    await page.waitForTimeout(2500);

    await selectAndSubmit(page, ['DORM', 'MAJOR', 'TUITION', 'SEMESTER']);

    // Wait for celebration overlay to appear
    await page.waitForSelector('.celebration-overlay', { timeout: 5000 });

    // Celebration overlay should be visible
    await expect(page.locator('.celebration-overlay')).toBeVisible();

    // Should have celebration GIFs (count is 8 according to config)
    const celebrationGifs = page.locator('.celebration-gif');
    await expect(celebrationGifs).toHaveCount(8);

    // Wait for celebration to complete (25 seconds according to theme.json)
    // For testing, we'll just wait 2 seconds to verify it's showing
    await page.waitForTimeout(2000);
    await expect(page.locator('.celebration-overlay')).toBeVisible();
  });

  test('should reset the game after winning', async ({ page }) => {
    // Win the game
    await selectAndSubmit(page, ['NUGGET', 'RUSH', 'MEDAL', 'BULLION']);
    await page.waitForTimeout(2500);
    await selectAndSubmit(page, ['BURGUNDY', 'STRANDED', 'CASTAWAY', 'ISOLATED']);
    await page.waitForTimeout(2500);
    await selectAndSubmit(page, ['RODENT', 'GNAW', 'BURROW', 'PRAIRIE']);
    await page.waitForTimeout(2500);
    await selectAndSubmit(page, ['DORM', 'MAJOR', 'TUITION', 'SEMESTER']);

    // Click Play Again
    await page.getByRole('button', { name: /play again/i }).click();

    // Game should reset
    await expect(page.locator('.word-cell')).toHaveCount(16);
    await expect(page.locator('.category-row')).toHaveCount(0);
    await expect(page.locator('.mistake-dot.remaining')).toHaveCount(4);
  });

  test('should lose the game after 4 mistakes', async ({ page }) => {
    // Make 4 incorrect guesses
    for (let i = 0; i < 4; i++) {
      // Select 4 random words that won't match any category
      const wordCells = page.locator('.word-cell');
      await wordCells.nth(0).click();
      await wordCells.nth(1).click();
      await wordCells.nth(2).click();
      await wordCells.nth(3).click();

      await page.locator('.submit-btn').click();
      await page.waitForTimeout(2500);
    }

    // Game over message should appear
    const gameOver = page.locator('.game-over');
    await expect(gameOver).toBeVisible();
    await expect(gameOver.locator('h2')).toContainText('Game Over');

    // Word grid should not be visible
    await expect(page.locator('.word-grid')).not.toBeVisible();

    // All mistakes should be used
    await expect(page.locator('.mistake-dot.used')).toHaveCount(4);
  });
});

// Helper function to select and submit words
async function selectAndSubmit(page: any, words: string[]) {
  for (const word of words) {
    const cell = page.locator('.word-cell', { hasText: word });
    await cell.click();
  }
  await page.locator('.submit-btn').click();
}
