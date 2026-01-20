import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('index.html loads with 200 status', async ({ page }) => {
    const response = await page.goto('/');

    // Verify 200 status code
    expect(response?.status()).toBe(200);

    // Verify page title
    await expect(page).toHaveTitle(/Chad's Apps/);

    // Verify the welcome heading is visible
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('all app cards are present', async ({ page }) => {
    await page.goto('/');

    // Verify all app cards are present
    const appCards = page.locator('.app-card');
    await expect(appCards).toHaveCount(6);

    // Verify specific apps are listed
    await expect(page.locator('.app-card.game')).toBeVisible();
    await expect(page.locator('.app-card.strands')).toBeVisible();
    await expect(page.locator('.app-card.jeopardy')).toBeVisible();
    await expect(page.locator('.app-card.petapup')).toBeVisible();
    await expect(page.locator('.app-card.workout')).toBeVisible();
    await expect(page.locator('.app-card.thanksgiving')).toBeVisible();
  });

  test('Connections Game loads correctly', async ({ page }) => {
    const response = await page.goto('/game.html');
    expect(response?.status()).toBe(200);

    // Wait for the app to render
    await page.waitForSelector('#root');

    // Verify game content is present (check for common connections game elements)
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('Strands loads correctly', async ({ page }) => {
    const response = await page.goto('/strands/');
    expect(response?.status()).toBe(200);

    // Wait for the app to render
    await page.waitForSelector('#root');

    // Verify content is present
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('Jeopardy loads correctly', async ({ page }) => {
    const response = await page.goto('/jeopardy/');
    expect(response?.status()).toBe(200);

    // Wait for the app to render
    await page.waitForSelector('#root');

    // Verify content is present
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('Pet-a-Pup loads correctly', async ({ page }) => {
    const response = await page.goto('/whack-a-mole/dist/');
    expect(response?.status()).toBe(200);

    // Wait for the app to render
    await page.waitForSelector('#root');

    // Verify the start game button or game content is present
    await expect(page.locator('#root')).not.toBeEmpty();

    // Check for Pet-a-Pup specific content
    await expect(page.locator('text=Pet-a-Pup')).toBeVisible();
  });

  test('Workouts loads correctly', async ({ page }) => {
    const response = await page.goto('/workouts/');
    expect(response?.status()).toBe(200);

    // Verify page has content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('Thanksgiving loads correctly', async ({ page }) => {
    const response = await page.goto('/thanksgiving_interactive.html');
    expect(response?.status()).toBe(200);

    // Verify page has content
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
