'use server'

import { sendContactEmail, validateContactFormData, ContactFormData } from '@/lib/email'

export interface ContactFormResult {
  success: boolean
  error?: string
}

export async function submitContactForm(
  formData: FormData
): Promise<ContactFormResult> {
  // Extract form data
  const data: ContactFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
  }

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

  return {
    success: true,
  }
}
