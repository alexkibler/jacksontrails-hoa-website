'use server'

import { subscribeToNewsletter, validateEmail } from '@/lib/newsletter'
import { validateSpamPrevention } from '@/lib/honeypot'

export interface NewsletterResult {
  success: boolean
  error?: string
}

export async function subscribeToNewsletterAction(
  formData: FormData
): Promise<NewsletterResult> {
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

  const email = formData.get('email') as string
  const consent = formData.get('consent') === 'on'

  // Validate email
  const validationError = validateEmail(email)
  if (validationError) {
    return {
      success: false,
      error: validationError,
    }
  }

  // Check consent
  if (!consent) {
    return {
      success: false,
      error: 'Please agree to receive email updates',
    }
  }

  // Subscribe to newsletter
  const result = await subscribeToNewsletter({ email })

  return result
}
