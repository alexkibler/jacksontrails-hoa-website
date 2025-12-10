import { test, expect } from '@playwright/test'

test.describe('Forest Color Scheme', () => {
  test('homepage should use forest color scheme', async ({ page }) => {
    await page.goto('/')

    // Check hero section has forest gradient background
    const heroSection = page.locator('section').first()
    await expect(heroSection).toHaveClass(/bg-gradient-forest/)

    // Check primary button uses forest-900 text color
    const primaryButton = page.getByRole('link', { name: 'View Announcements' })
    await expect(primaryButton).toHaveClass(/text-jt-forest-900/)

    // Check body background is stone-50
    const body = page.locator('body')
    await expect(body).toHaveClass(/bg-jt-stone-50/)
  })

  test('navigation should use forest colors', async ({ page }) => {
    await page.goto('/')

    // Check navigation background
    const nav = page.locator('nav')
    await expect(nav).toHaveClass(/bg-white/)

    // Check logo has forest gradient
    const logo = page.getByRole('link', { name: /Jackson Trails/i }).first()
    await expect(logo).toHaveClass(/bg-gradient-forest/)
  })

  test('contact form should use emerald accent color', async ({ page }) => {
    await page.goto('/contact')

    // Check submit button uses emerald color
    const submitButton = page.getByTestId('submit-button')
    await expect(submitButton).toHaveClass(/bg-jt-emerald-600/)

    // Check form inputs have emerald focus ring
    const nameInput = page.getByTestId('name-input')
    await expect(nameInput).toHaveClass(/focus:ring-jt-emerald-500/)
  })

  test('announcements page should use stone text colors', async ({ page }) => {
    await page.goto('/announcements')

    // Check page title uses stone-900
    const title = page.getByRole('heading', { name: 'Announcements' })
    await expect(title).toHaveClass(/text-jt-stone-900/)

    // Check page background is stone-50
    const container = page.locator('div.min-h-screen').first()
    await expect(container).toHaveClass(/bg-jt-stone-50/)
  })

  test('documents page should use emerald accents', async ({ page }) => {
    await page.goto('/documents')

    // Check page title uses stone colors
    const title = page.getByRole('heading', { name: 'Documents' })
    await expect(title).toHaveClass(/text-jt-stone-900/)

    // Check search input has emerald focus ring
    const searchInput = page.getByTestId('search-input')
    await expect(searchInput).toHaveClass(/focus:ring-jt-emerald-500/)
  })

  test('dark mode should use stone-900 background', async ({ page }) => {
    await page.goto('/')

    // Enable dark mode by adding class to html element
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })

    // Check body background is stone-900 in dark mode
    const body = page.locator('body')
    await expect(body).toHaveClass(/dark:bg-jt-stone-900/)
  })

  test('buttons should use emerald-600 for accents', async ({ page }) => {
    await page.goto('/contact')

    // Check submit button color
    const submitButton = page.getByTestId('submit-button')
    const bgColor = await submitButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })

    // emerald-600 is rgb(5, 150, 105)
    expect(bgColor).toBe('rgb(5, 150, 105)')
  })

  test('hero section should have forest gradient', async ({ page }) => {
    await page.goto('/')

    const heroSection = page.locator('section').first()
    const bgImage = await heroSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage
    })

    // Check that it's a gradient (contains 'gradient')
    expect(bgImage).toContain('gradient')
  })

  test('text should use stone-700 for body text', async ({ page }) => {
    await page.goto('/')

    const body = page.locator('body')
    await expect(body).toHaveClass(/text-jt-stone-700/)
  })
})
