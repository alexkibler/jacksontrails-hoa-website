import { render, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ContactForm } from '../ContactForm'
import userEvent from '@testing-library/user-event'

// Mock the server action
jest.mock('@/app/contact/actions', () => ({
  submitContactForm: jest.fn(() => Promise.resolve({ success: true })),
}))

describe('ContactForm Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<ContactForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have properly labeled form fields', () => {
    const { getByLabelText } = render(<ContactForm />)

    expect(getByLabelText(/name/i)).toBeInTheDocument()
    expect(getByLabelText(/email/i)).toBeInTheDocument()
    expect(getByLabelText(/subject/i)).toBeInTheDocument()
    expect(getByLabelText(/message/i)).toBeInTheDocument()
    expect(getByLabelText(/subscribe to newsletter/i)).toBeInTheDocument()
  })

  it('should have required fields marked with asterisks', () => {
    const { container } = render(<ContactForm />)
    const labels = container.querySelectorAll('label')
    const requiredLabels = Array.from(labels).filter(label =>
      label.textContent?.includes('*')
    )

    expect(requiredLabels.length).toBeGreaterThan(0)
  })

  it('should announce status messages with aria-live', async () => {
    const { getByTestId, findByRole } = render(<ContactForm />)
    const submitButton = getByTestId('submit-button')

    await userEvent.click(submitButton)

    await waitFor(async () => {
      const alert = await findByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'polite')
    })
  })

  it('should have honeypot field hidden from screen readers', () => {
    const { container } = render(<ContactForm />)
    const honeypot = container.querySelector('[name="website"]')

    expect(honeypot).toHaveAttribute('aria-hidden', 'true')
    expect(honeypot).toHaveAttribute('tabIndex', '-1')
  })
})
