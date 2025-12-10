import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    const user = userEvent.setup()
    render(<ContactForm />)

    // Fill out the form
    await user.type(screen.getByTestId('name-input'), 'John Doe')
    await user.type(screen.getByTestId('email-input'), 'john@example.com')
    await user.type(screen.getByTestId('subject-input'), 'Test Subject')
    await user.type(screen.getByTestId('message-input'), 'Test message')

    // Submit the form
    await user.click(screen.getByTestId('submit-button'))

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
    const user = userEvent.setup()
    render(<ContactForm />)

    // Fill out the form
    await user.type(screen.getByTestId('name-input'), 'John Doe')
    await user.type(screen.getByTestId('email-input'), 'john@example.com')
    await user.type(screen.getByTestId('subject-input'), 'Test Subject')
    await user.type(screen.getByTestId('message-input'), 'Test message')

    // Submit the form
    await user.click(screen.getByTestId('submit-button'))

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })

    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Failed to send email'
    )
  })

  it('should disable form fields and show sending text while submitting', async () => {
    const user = userEvent.setup()

    let resolve: (value: { success: boolean }) => void
    const promise = new Promise<{ success: boolean }>((res) => {
      resolve = res
    })

    mockSubmitContactForm.mockReturnValue(promise)

    render(<ContactForm />)

    // Fill out and submit the form
    await user.type(screen.getByTestId('name-input'), 'John Doe')
    await user.type(screen.getByTestId('email-input'), 'john@example.com')
    await user.type(screen.getByTestId('subject-input'), 'Test Subject')
    await user.type(screen.getByTestId('message-input'), 'Test message')

    await user.click(screen.getByTestId('submit-button'))

    // Check that fields are disabled and button text is updated
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toBeDisabled()
      expect(screen.getByTestId('email-input')).toBeDisabled()
      expect(screen.getByTestId('subject-input')).toBeDisabled()
      expect(screen.getByTestId('message-input')).toBeDisabled()
      expect(screen.getByTestId('submit-button')).toBeDisabled()
      expect(screen.getByTestId('submit-button')).toHaveTextContent(
        'Sending...'
      )
    })

    await act(async () => {
      resolve({ success: true })
      await promise
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
