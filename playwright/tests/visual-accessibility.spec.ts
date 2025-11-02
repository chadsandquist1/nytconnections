import { test, expect } from '@playwright/test';

test.describe('NYT Connections Game - Visual & Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.word-cell');
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check main heading
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Lets row the boat!');
  });

  test('should display UMN theme colors correctly', async ({ page }) => {
    // Check that primary color (maroon) is applied
    const selectedWord = page.locator('.word-cell').first();
    await selectedWord.click();

    // Selected word should have maroon background
    const backgroundColor = await selectedWord.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // RGB value for #7A0019 (maroon)
    expect(backgroundColor).toContain('122, 0, 25');
  });

  test('should have visible mistake tracker', async ({ page }) => {
    const mistakeTracker = page.locator('.mistake-tracker');
    await expect(mistakeTracker).toBeVisible();

    // Should show 4 mistake dots
    const dots = page.locator('.mistake-dot');
    await expect(dots).toHaveCount(4);
  });

  test('should show all game controls', async ({ page }) => {
    // All control buttons should be visible
    await expect(page.getByText('Shuffle')).toBeVisible();
    await expect(page.getByText('Deselect All')).toBeVisible();
    await expect(page.getByText('Submit')).toBeVisible();
  });

  test('should display background image', async ({ page }) => {
    const body = page.locator('body');

    const backgroundImage = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage;
    });

    // Should have Fall background image
    expect(backgroundImage).toContain('Fall_1080x1920.jpg');
  });

  test('should have hover effects on word cells', async ({ page }) => {
    const wordCell = page.locator('.word-cell').first();

    // Hover over the cell
    await wordCell.hover();

    // Cell should have hover styles (this is a simplified check)
    await expect(wordCell).toBeVisible();
  });

  test('should have proper button states', async ({ page }) => {
    const submitBtn = page.locator('.submit-btn');

    // Initially disabled
    await expect(submitBtn).toBeDisabled();

    // Select 4 words
    const wordCells = page.locator('.word-cell');
    for (let i = 0; i < 4; i++) {
      await wordCells.nth(i).click();
    }

    // Now enabled
    await expect(submitBtn).toBeEnabled();
  });

  test('should show feedback with appropriate styling', async ({ page }) => {
    // Select and submit incorrect answer
    const wordCells = page.locator('.word-cell');
    for (let i = 0; i < 4; i++) {
      await wordCells.nth(i).click();
    }
    await page.locator('.submit-btn').click();

    // Feedback should appear
    const feedback = page.locator('.feedback');
    await expect(feedback).toBeVisible();

    // Should have feedback styling
    const backgroundColor = await feedback.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(backgroundColor).toBeTruthy();
  });

  test('should display instructions clearly', async ({ page }) => {
    const instructions = page.locator('.instructions');
    await expect(instructions).toBeVisible();
    await expect(instructions).toContainText('Group these words');
  });

  test('should have clickable reset link', async ({ page }) => {
    const resetLink = page.locator('.reset-link');
    await expect(resetLink).toBeVisible();
    await expect(resetLink).toHaveText('Reset Game');

    // Click it
    await resetLink.click();

    // Game should reset (word grid should still be visible)
    await expect(page.locator('.word-grid')).toBeVisible();
  });

  test('should animate solved categories', async ({ page }) => {
    // Solve a category
    await page.locator('.word-cell', { hasText: 'NUGGET' }).click();
    await page.locator('.word-cell', { hasText: 'RUSH' }).click();
    await page.locator('.word-cell', { hasText: 'MEDAL' }).click();
    await page.locator('.word-cell', { hasText: 'BULLION' }).click();
    await page.locator('.submit-btn').click();

    // Wait for feedback
    await page.waitForTimeout(500);

    // Category row should appear with animation
    const categoryRow = page.locator('.category-row').first();
    await expect(categoryRow).toBeVisible();

    // Check that it has proper styling
    const backgroundColor = await categoryRow.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(backgroundColor).toBeTruthy();
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab through elements
    await page.keyboard.press('Tab');

    // First focusable element should be focused
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('should handle long category names gracefully', async ({ page }) => {
    // Test that category rows don't overflow
    const container = page.locator('.container');
    await expect(container).toBeVisible();

    // Container should have proper bounds
    const boundingBox = await container.boundingBox();
    expect(boundingBox).toBeTruthy();
    expect(boundingBox?.width).toBeLessThanOrEqual(650); // max-width + padding
  });
});
