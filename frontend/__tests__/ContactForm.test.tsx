import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContactForm } from '@/components/ContactForm'
import { submitContactForm } from '@/app/contact/actions'

// Mock the server action
jest.mock('@/app/contact/actions', () => ({
  submitContactForm: jest.fn(),
}))

const mockSubmitContactForm = submitContactForm as jest.MockedFunction<
  typeof submitContactForm
>

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all form fields', () => {
    render(<ContactForm />)

    expect(screen.getByTestId('name-input')).toBeInTheDocument()
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByTestId('subject-input')).toBeInTheDocument()
    expect(screen.getByTestId('message-input')).toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).toBeInTheDocument()
  })

  it('should have required attributes on form fields', () => {
    render(<ContactForm />)

    expect(screen.getByTestId('name-input')).toBeRequired()
    expect(screen.getByTestId('email-input')).toBeRequired()
    expect(screen.getByTestId('subject-input')).toBeRequired()
    expect(screen.getByTestId('message-input')).toBeRequired()
  })

  it('should have correct input types', () => {
    render(<ContactForm />)

    expect(screen.getByTestId('name-input')).toHaveAttribute('type', 'text')
    expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email')
    expect(screen.getByTestId('subject-input')).toHaveAttribute('type', 'text')
  })

  it('should show success message when form is submitted successfully', async () => {
    mockSubmitContactForm.mockResolvedValue({ success: true })

    render(<ContactForm />)

    // Fill out the form
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByTestId('subject-input'), {
      target: { value: 'Test Subject' },
    })
    fireEvent.change(screen.getByTestId('message-input'), {
      target: { value: 'Test message' },
    })

    // Submit the form
    const form = screen.getByTestId('contact-form')
    fireEvent.submit(form)

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
    })

    expect(screen.getByTestId('success-message')).toHaveTextContent(
      /Message sent successfully/i
    )
  })

  it('should show error message when form submission fails', async () => {
    mockSubmitContactForm.mockResolvedValue({
      success: false,
      error: 'Failed to send email',
    })

    render(<ContactForm />)

    // Fill out the form
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByTestId('subject-input'), {
      target: { value: 'Test Subject' },
    })
    fireEvent.change(screen.getByTestId('message-input'), {
      target: { value: 'Test message' },
    })

    // Submit the form
    const form = screen.getByTestId('contact-form')
    fireEvent.submit(form)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })

    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Failed to send email'
    )
  })

  it('should disable form fields while submitting', async () => {
    mockSubmitContactForm.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true }), 100)
        })
    )

    render(<ContactForm />)

    // Fill out and submit the form
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByTestId('subject-input'), {
      target: { value: 'Test Subject' },
    })
    fireEvent.change(screen.getByTestId('message-input'), {
      target: { value: 'Test message' },
    })

    const form = screen.getByTestId('contact-form')
    fireEvent.submit(form)

    // Check that fields are disabled while pending
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toBeDisabled()
      expect(screen.getByTestId('email-input')).toBeDisabled()
      expect(screen.getByTestId('subject-input')).toBeDisabled()
      expect(screen.getByTestId('message-input')).toBeDisabled()
      expect(screen.getByTestId('submit-button')).toBeDisabled()
    })
  })

  it('should show "Sending..." text on submit button while submitting', async () => {
    mockSubmitContactForm.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true }), 100)
        })
    )

    render(<ContactForm />)

    // Fill out and submit the form
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByTestId('subject-input'), {
      target: { value: 'Test Subject' },
    })
    fireEvent.change(screen.getByTestId('message-input'), {
      target: { value: 'Test message' },
    })

    const form = screen.getByTestId('contact-form')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Sending...')
    })
  })

  it('should have maxLength attribute on message textarea', () => {
    render(<ContactForm />)

    expect(screen.getByTestId('message-input')).toHaveAttribute(
      'maxLength',
      '5000'
    )
  })

  it('should display privacy notice', () => {
    render(<ContactForm />)

    expect(
      screen.getByText(/Your message will be sent directly to the HOA board/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/We do not store your information/i)
    ).toBeInTheDocument()
  })
})
