import { test, expect } from '@playwright/test';
import { apps } from '../utils/apps';

/**
 * Smoke tests for Chad's Apps
 *
 * Local: npm run test:smoke
 * S3:    BASE_URL=http://mojodojocasahouse-of-apps-67ba00d8ab4c-bucket.s3-website-us-east-1.amazonaws.com npm run test:smoke
 */

// Detect if running against remote (S3) or local
const isRemote = !!process.env.BASE_URL;

test.describe('Smoke Tests', () => {
  test('index.html loads with 200 status', async ({ page }) => {
    const response = await page.goto('/');

    // Verify 200 status code
    expect(response?.status()).toBe(200);

    // Verify page title
    await expect(page).toHaveTitle(/Chad's Apps/);

    // Verify the welcome heading is visible
    await expect(page.locator('h1')).toContainText('Welcome');

    // Verify the purple gradient background is applied
    const body = page.locator('body');
    await expect(body).toHaveCSS('background-image', /linear-gradient/);

    // Verify subtitle is present
    await expect(page.locator('.subtitle')).toContainText('Choose an app');
  });

  test('all app cards are present and styled', async ({ page }) => {
    await page.goto('/');

    // Verify all app cards are present
    const appCards = page.locator('.app-card');
    await expect(appCards).toHaveCount(apps.length);

    // Verify each app card is visible and has proper structure
    for (const app of apps) {
      const card = page.locator(`.app-card.${app.cardClass}`);
      await expect(card).toBeVisible();

      // Verify card has icon, title, and description
      await expect(card.locator('.app-icon')).toBeVisible();
      await expect(card.locator('.app-title')).toBeVisible();
      await expect(card.locator('.app-description')).toBeVisible();

      // Verify card has border styling
      await expect(card).toHaveCSS('border-style', 'solid');
    }
  });

  test('app cards are clickable links', async ({ page }) => {
    await page.goto('/');

    // Verify each app card is a link with href
    for (const app of apps) {
      const card = page.locator(`.app-card.${app.cardClass}`);
      const href = await card.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  // Generate individual tests for each app with visual assertions
  for (const app of apps) {
    test(`${app.name} loads with visual elements`, async ({ page }) => {
      const path = isRemote ? app.remotePath : app.localPath;
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      if (app.hasRoot) {
        await expect(page.locator('#root')).toBeAttached();
      }

      // Run visual assertions for this app
      if (app.visualAssertions) {
        for (const assertion of app.visualAssertions) {
          const locator = page.locator(assertion.selector).first();

          if (assertion.checkVisible) {
            await expect(locator, `${assertion.description} should be visible`).toBeVisible({ timeout: 5000 });
          }

          if (assertion.checkText) {
            await expect(locator, `${assertion.description} should contain text`).toContainText(assertion.checkText);
          }

          if (assertion.checkCount !== undefined) {
            const allLocators = page.locator(assertion.selector);
            await expect(allLocators, `${assertion.description} should have count ${assertion.checkCount}`).toHaveCount(assertion.checkCount);
          }
        }
      }
    });
  }

  // Test that no console errors occur on page load
  for (const app of apps) {
    test(`${app.name} has no critical console errors`, async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Ignore known non-critical errors
          if (!text.includes('favicon') && !text.includes('404')) {
            errors.push(text);
          }
        }
      });

      const path = isRemote ? app.remotePath : app.localPath;
      await page.goto(path);

      // Wait for page to stabilize
      await page.waitForLoadState('networkidle');

      // Allow some React hydration errors and known non-critical errors
      const criticalErrors = errors.filter(
        (e) =>
          !e.includes('hydrat') &&
          !e.includes('Warning:') &&
          !e.includes('<svg>') &&
          !e.includes('fit-content')
      );

      expect(criticalErrors, 'Should have no critical console errors').toHaveLength(0);
    });
  }
});
