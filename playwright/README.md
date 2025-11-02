# Playwright End-to-End Tests

This directory contains end-to-end tests for the NYT Connections game using [Playwright](https://playwright.dev/).

## Setup

### Install Playwright Browsers

Before running the tests for the first time, install the Playwright browsers:

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers needed for testing.

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

This runs all tests in headless mode across all configured browsers (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari).

### Run Tests with UI Mode

```bash
npm run test:e2e:ui
```

Opens the Playwright UI where you can:
- See all tests
- Run specific tests
- Watch tests run in real-time
- Time travel through test execution
- Debug failures

### Run Tests in Headed Mode

```bash
npm run test:e2e:headed
```

Runs tests with the browser window visible so you can watch the test execution.

### Debug Tests

```bash
npm run test:e2e:debug
```

Runs tests in debug mode with Playwright Inspector for step-by-step debugging.

### View Test Report

After running tests, view the HTML report:

```bash
npm run test:e2e:report
```

## Test Files

### `game-flow.spec.ts`
Tests the basic game flow and interactions:
- Game loading
- Word selection/deselection
- Shuffle functionality
- Submit button states
- Mistake tracking
- Feedback messages
- Reset functionality
- Responsive design

### `game-win.spec.ts`
Tests winning and losing scenarios:
- Solving individual categories
- Winning the full game
- Celebration overlay
- Game over (4 mistakes)
- Reset after win/loss

**Note:** These tests use the actual puzzle data from `public/puzzle.csv`:
- Gold: Nugget, Rush, Medal, Bullion
- Maroon: Burgundy, Stranded, Castaway, Isolated
- Gopher: Rodent, Gnaw, Burrow, Prairie
- College: Dorm, Major, Tuition, Semester

### `visual-accessibility.spec.ts`
Tests visual styling and accessibility:
- Theme colors (UMN maroon and gold)
- Heading structure
- Background images
- Button states and hover effects
- Keyboard accessibility
- Responsive layout

## Running Specific Tests

### Run a Single Test File

```bash
npx playwright test game-flow.spec.ts
```

### Run Tests Matching a Pattern

```bash
npx playwright test --grep "should select"
```

### Run Only on Specific Browser

```bash
npx playwright test --project=chromium
```

Available projects:
- `chromium` - Desktop Chrome
- `firefox` - Desktop Firefox
- `webkit` - Desktop Safari
- `Mobile Chrome` - Mobile viewport
- `Mobile Safari` - iPhone viewport

## Configuration

Test configuration is in `playwright.config.ts` at the project root:

- **Base URL:** `http://localhost:8000`
- **Test Directory:** `./playwright/tests`
- **Auto-start dev server:** Yes (runs `npm run dev` automatically)
- **Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries:** 2 on CI, 0 locally
- **Trace:** Captured on first retry

## Writing New Tests

Create new test files in `playwright/tests/`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Your test code here
    await expect(page.locator('.some-element')).toBeVisible();
  });
});
```

## Best Practices

1. **Use data-testid attributes** for stable selectors (when needed)
2. **Wait for elements** before interacting with them
3. **Use page.waitForTimeout() sparingly** - prefer waiting for specific conditions
4. **Test user flows** not implementation details
5. **Keep tests independent** - each test should be able to run in isolation
6. **Use descriptive test names** that explain what's being tested

## CI/CD Integration

Playwright tests can run in CI environments:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npm run test:e2e
```

## Debugging Failed Tests

When tests fail:

1. **Check the HTML report:** `npm run test:e2e:report`
2. **View traces** of failed tests in the report
3. **Run in headed mode** to see what's happening: `npm run test:e2e:headed`
4. **Use debug mode** for step-by-step execution: `npm run test:e2e:debug`
5. **Check screenshots** in the test output directory

## Troubleshooting

### Port 8000 Already in Use

If you have the dev server running manually, the tests will reuse it. If there's a port conflict:

```bash
# Kill any process on port 8000
lsof -ti:8000 | xargs kill -9
```

### Browser Installation Issues

If browsers fail to install:

```bash
# Install with dependencies (Linux)
npx playwright install --with-deps

# Or install system dependencies separately
npx playwright install-deps
```

### Tests Timeout

Increase timeout in `playwright.config.ts`:

```typescript
use: {
  actionTimeout: 10000, // 10 seconds
  navigationTimeout: 30000, // 30 seconds
}
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
