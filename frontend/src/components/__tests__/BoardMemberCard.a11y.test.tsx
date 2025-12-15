import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { BoardMemberCard } from '../BoardMemberCard'

const mockMember = {
  id: '1',
  firstname: 'Jane',
  lastname: 'Doe',
  email: 'jane@example.com',
  position: 'President',
  bio: 'Community leader and long-time resident',
  pronouns: 'she/her',
  headshot: null,
  created: '2024-01-01',
  updated: '2024-01-01',
}

describe('BoardMemberCard Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<BoardMemberCard member={mockMember} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have accessible placeholder image', () => {
    const { container } = render(<BoardMemberCard member={mockMember} />)
    const svg = container.querySelector('svg[role="img"]')

    expect(svg).toHaveAttribute('aria-label', 'Default profile picture')
    expect(svg?.querySelector('title')).toBeInTheDocument()
  })

  it('should have accessible email link with descriptive label', () => {
    const { getByRole } = render(<BoardMemberCard member={mockMember} />)
    const emailLink = getByRole('link', { name: /send email to jane doe/i })

    expect(emailLink).toHaveAttribute('href', 'mailto:jane@example.com')
  })

  it('should hide decorative email icon from screen readers', () => {
    const { container } = render(<BoardMemberCard member={mockMember} />)
    const emailIcon = container.querySelector('a svg[aria-hidden="true"]')

    expect(emailIcon).toBeInTheDocument()
  })

  it('should have proper heading structure', () => {
    const { getByRole } = render(<BoardMemberCard member={mockMember} />)
    const heading = getByRole('heading', { name: /jane doe/i })

    expect(heading.tagName).toBe('H3')
  })
})
