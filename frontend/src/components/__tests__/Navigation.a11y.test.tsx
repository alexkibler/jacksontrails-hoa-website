import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Navigation } from '../Navigation'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Navigation Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<Navigation />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper ARIA labels on navigation elements', () => {
    const { getByRole } = render(<Navigation />)
    const nav = getByRole('navigation', { name: /main navigation/i })
    expect(nav).toBeInTheDocument()
  })

  it('should indicate current page with aria-current', () => {
    const { getByRole } = render(<Navigation />)
    const homeLink = getByRole('link', { name: /home/i })
    expect(homeLink).toHaveAttribute('aria-current', 'page')
  })

  it('should have accessible emoji with proper role', () => {
    const { container } = render(<Navigation />)
    const emoji = container.querySelector('[role="img"][aria-label="Houses"]')
    expect(emoji).toBeInTheDocument()
  })
})
