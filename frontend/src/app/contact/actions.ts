'use server'

import { sendContactEmail, validateContactFormData, ContactFormData } from '@/lib/email'
import { subscribeToNewsletter } from '@/lib/newsletter'
import { validateSpamPrevention } from '@/lib/honeypot'

export interface ContactFormResult {
  success: boolean
  error?: string
}

export async function submitContactForm(
  formData: FormData
): Promise<ContactFormResult> {
  // Validate spam prevention (honeypot + timing)
  const honeypot = formData.get('website') as string
  const formStartTime = formData.get('formStartTime') as string

  const spamCheck = validateSpamPrevention(honeypot, formStartTime)
  if (!spamCheck.isValid) {
    return {
      success: false,
      error: spamCheck.error,
    }
  }

  // Extract form data
  const data: ContactFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
  }

  const subscribeToNewsletter_ = formData.get('subscribeToNewsletter') === 'on'

  // Validate data
  const validationError = validateContactFormData(data)
  if (validationError) {
    return {
      success: false,
      error: validationError,
    }
  }

  // Send email
  const emailSent = await sendContactEmail(data)

  if (!emailSent) {
    return {
      success: false,
      error: 'Failed to send message. Please try again later.',
    }
  }

  // Subscribe to newsletter if requested
  if (subscribeToNewsletter_) {
    await subscribeToNewsletter({
      email: data.email,
      name: data.name,
    })
  }

  return {
    success: true,
  }
}
