import { NextRequest, NextResponse } from 'next/server'
import { subscribeToNewsletter, validateEmail } from '@/lib/newsletter'
import { validateSpamPrevention } from '@/lib/honeypot'

/**
 * Test endpoint for newsletter subscriptions
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

    const email = formData.get('email') as string
    const consent = formData.get('consent') === 'on'

    // Validate email
    const validationError = validateEmail(email)
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: validationError,
        },
        { status: 400 }
      )
    }

    // Check consent
    if (!consent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please agree to receive email updates',
        },
        { status: 400 }
      )
    }

    // Subscribe to newsletter
    const result = await subscribeToNewsletter({ email })

    if (result.success) {
      return NextResponse.json({
        success: true,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Test newsletter signup error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
