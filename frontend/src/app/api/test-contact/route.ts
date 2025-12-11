import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail, validateContactFormData, ContactFormData } from '@/lib/email'
import { subscribeToNewsletter } from '@/lib/newsletter'
import { validateSpamPrevention } from '@/lib/honeypot'

/**
 * Test endpoint for contact form submissions
 * This allows external testing tools to submit forms without Server Action headers
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Validate spam prevention (honeypot + timing)
    const honeypot = formData.get('website') as string
    const formStartTime = formData.get('formStartTime') as string

    const spamCheck = validateSpamPrevention(honeypot, formStartTime)
    if (!spamCheck.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: spamCheck.error,
        },
        { status: 400 }
      )
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
      return NextResponse.json(
        {
          success: false,
          error: validationError,
        },
        { status: 400 }
      )
    }

    // Send email
    const emailSent = await sendContactEmail(data)

    if (!emailSent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send message. Please try again later.',
        },
        { status: 500 }
      )
    }

    // Subscribe to newsletter if requested
    if (subscribeToNewsletter_) {
      await subscribeToNewsletter({
        email: data.email,
        name: data.name,
      })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Test contact form error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
