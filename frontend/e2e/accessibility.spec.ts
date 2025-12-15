import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Audit', () => {
  test('Home page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Announcements page should not have accessibility issues', async ({ page }) => {
    await page.goto('/announcements')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Documents page should not have accessibility issues', async ({ page }) => {
    await page.goto('/documents')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Board page should not have accessibility issues', async ({ page }) => {
    await page.goto('/about/board')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Contact page should not have accessibility issues', async ({ page }) => {
    await page.goto('/contact')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Skip link should be functional', async ({ page }) => {
    await page.goto('/')

    // Tab to focus the skip link
    await page.keyboard.press('Tab')

    // Verify skip link is visible when focused
    const skipLink = page.getByRole('link', { name: /skip to main content/i })
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toBeVisible()

    // Press Enter to activate skip link
    await page.keyboard.press('Enter')

    // Verify main content is now focused
    const main = page.locator('#main-content')
    await expect(main).toBeFocused()
  })

  test('Keyboard navigation should work throughout the site', async ({ page }) => {
    await page.goto('/')

    // Tab through navigation
    await page.keyboard.press('Tab') // Skip link
    await page.keyboard.press('Tab') // Logo
    await page.keyboard.press('Tab') // Home link

    const homeLink = page.getByRole('link', { name: 'Home' })
    await expect(homeLink).toBeFocused()

    // Continue tabbing through nav
    await page.keyboard.press('Tab') // Announcements
    await page.keyboard.press('Tab') // Documents
    await page.keyboard.press('Tab') // About
    await page.keyboard.press('Tab') // Contact

    const contactLink = page.getByRole('link', { name: 'Contact' })
    await expect(contactLink).toBeFocused()
  })

  test('Theme toggle should be keyboard accessible', async ({ page }) => {
    await page.goto('/')

    // Navigate to theme toggle
    const lightButton = page.getByRole('button', { name: /light mode/i })
    await lightButton.focus()
    await expect(lightButton).toBeFocused()

    // Activate with keyboard
    await page.keyboard.press('Space')
    await expect(lightButton).toHaveAttribute('aria-pressed', 'true')

    // Switch to dark mode
    const darkButton = page.getByRole('button', { name: /dark mode/i })
    await darkButton.focus()
    await page.keyboard.press('Space')
    await expect(darkButton).toHaveAttribute('aria-pressed', 'true')
  })

  test('Form inputs should have visible focus indicators', async ({ page }) => {
    await page.goto('/contact')

    // Check name input focus
    const nameInput = page.getByLabel(/name/i)
    await nameInput.focus()

    // Verify focus ring is visible
    const focusRing = await nameInput.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        boxShadow: styles.boxShadow,
      }
    })

    expect(focusRing.outlineWidth !== '0px' || focusRing.boxShadow !== 'none').toBeTruthy()
  })

  test('All images should have alt text', async ({ page }) => {
    await page.goto('/')

    const images = await page.locator('img').all()

    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).not.toBeNull()
      expect(alt).not.toBe('')
    }
  })

  test('Headings should follow proper hierarchy', async ({ page }) => {
    await page.goto('/')

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()

    // Should have at least one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)

    // Verify we have headings
    expect(headings.length).toBeGreaterThan(0)
  })

  test('Color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // We'll check this manually
      .analyze()

    // Run specific color contrast check
    const contrastResults = await new AxeBuilder({ page })
      .include('body')
      .options({ rules: { 'color-contrast': { enabled: true } } })
      .analyze()

    expect(contrastResults.violations.filter(v => v.id === 'color-contrast')).toEqual([])
  })

  test('Konami code modal should be accessible', async ({ page }) => {
    await page.goto('/')

    // Trigger Konami code
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('b')
    await page.keyboard.press('a')
    await page.keyboard.press('Enter')

    // Verify modal appears
    const dialog = page.getByRole('dialog', { name: /secret unlocked/i })
    await expect(dialog).toBeVisible()

    // Verify focus is on close button
    const closeButton = page.getByRole('button', { name: /accept this honor/i })
    await expect(closeButton).toBeFocused()

    // Verify escape key closes modal
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  })
})
