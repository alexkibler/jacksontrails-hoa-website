import MailerLite from '@mailerlite/mailerlite-nodejs'

export interface NewsletterSubscription {
  email: string
  name?: string
}

export async function subscribeToNewsletter(
  data: NewsletterSubscription
): Promise<{ success: boolean; error?: string }> {
  try {
    const mailerlite = new MailerLite({
      api_key: process.env.MAILERLITE_API_TOKEN || '',
    })

    const params = {
      email: data.email,
      fields: data.name ? { name: data.name } : undefined,
      groups: [process.env.MAILERLITE_GROUP_ID || ''],
    }

    await mailerlite.subscribers.createOrUpdate(params)

    return { success: true }
  } catch (error) {
    console.error('Failed to subscribe to newsletter:', error)
    return {
      success: false,
      error: 'Failed to subscribe to newsletter. Please try again later.',
    }
  }
}

export function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) {
    return 'Email is required'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }

  return null
}
