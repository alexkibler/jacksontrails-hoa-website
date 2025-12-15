import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ThemeToggle } from '../ThemeToggle'
import { ThemeProvider } from '../ThemeProvider'

describe('ThemeToggle Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have a group role with proper label', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    const group = getByRole('group', { name: /theme selection/i })
    expect(group).toBeInTheDocument()
  })

  it('should have buttons with aria-pressed states', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    const lightButton = getByRole('button', { name: /light mode/i })
    const darkButton = getByRole('button', { name: /dark mode/i })
    const systemButton = getByRole('button', { name: /system theme/i })

    expect(lightButton).toHaveAttribute('aria-pressed')
    expect(darkButton).toHaveAttribute('aria-pressed')
    expect(systemButton).toHaveAttribute('aria-pressed')
  })

  it('should have accessible emojis with proper roles', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    const sunEmoji = container.querySelector('[role="img"][aria-label="Sun"]')
    const moonEmoji = container.querySelector('[role="img"][aria-label="Moon"]')
    const computerEmoji = container.querySelector('[role="img"][aria-label="Computer"]')

    expect(sunEmoji).toBeInTheDocument()
    expect(moonEmoji).toBeInTheDocument()
    expect(computerEmoji).toBeInTheDocument()
  })
})
