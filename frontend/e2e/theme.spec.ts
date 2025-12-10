import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have light mode by default', async ({ page }) => {
    // Check that dark class is not present
    const htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);

    // Check that background is light
    const backgroundColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Light mode should have a white or light background
    expect(backgroundColor).toMatch(/rgb\(255,\s*255,\s*255\)|rgb\(249,\s*250,\s*251\)/);
  });

  test('should switch to dark mode when dark button is clicked', async ({ page }) => {
    // Find and click the dark mode button
    const darkButton = page.getByTestId('dark-mode-button');
    await darkButton.click();

    // Wait for the theme to be applied
    await page.waitForTimeout(100);

    // Check that dark class is present
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);

    // Verify dark mode is persisted in localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('dark');
  });

  test('should switch back to light mode', async ({ page }) => {
    // First switch to dark mode
    const darkButton = page.getByTestId('dark-mode-button');
    await darkButton.click();
    await page.waitForTimeout(100);

    // Then switch back to light mode
    const lightButton = page.getByTestId('light-mode-button');
    await lightButton.click();
    await page.waitForTimeout(100);

    // Check that dark class is not present
    const htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);

    // Verify light mode is persisted in localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('light');
  });

  test('should respect system preference when system mode is selected', async ({ page, context }) => {
    // Set system preference to dark mode
    await context.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
      });
    });

    // Reload the page with the new matchMedia mock
    await page.reload();

    // Click system mode button
    const systemButton = page.getByTestId('system-mode-button');
    await systemButton.click();
    await page.waitForTimeout(100);

    // Should apply dark mode based on system preference
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);

    // Verify system mode is persisted in localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('system');
  });

  test('should persist theme preference across page reloads', async ({ page }) => {
    // Switch to dark mode
    const darkButton = page.getByTestId('dark-mode-button');
    await darkButton.click();
    await page.waitForTimeout(100);

    // Reload the page
    await page.reload();
    await page.waitForTimeout(100);

    // Dark mode should still be active
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);
  });

  test('should have accessible theme toggle buttons', async ({ page }) => {
    const lightButton = page.getByTestId('light-mode-button');
    const darkButton = page.getByTestId('dark-mode-button');
    const systemButton = page.getByTestId('system-mode-button');

    // Check that all buttons have aria-labels
    await expect(lightButton).toHaveAttribute('aria-label', 'Switch to light mode');
    await expect(darkButton).toHaveAttribute('aria-label', 'Switch to dark mode');
    await expect(systemButton).toHaveAttribute('aria-label', 'Use system theme preference');
  });

  test('should apply different colors in light and dark modes', async ({ page }) => {
    // Get text color in light mode
    const lightTextColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).color;
    });

    // Switch to dark mode
    const darkButton = page.getByTestId('dark-mode-button');
    await darkButton.click();
    await page.waitForTimeout(100);

    // Get text color in dark mode
    const darkTextColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).color;
    });

    // Colors should be different
    expect(lightTextColor).not.toBe(darkTextColor);
  });
});
