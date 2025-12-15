'use client'

import { useState, useEffect } from 'react'
import { subscribeToNewsletterAction } from '@/app/newsletter/actions'
import { generateFormTimestamp } from '@/lib/honeypot'

export function NewsletterSignup() {
  const [isPending, setIsPending] = useState(false)
  const [formStartTime, setFormStartTime] = useState<string>('')
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  // Generate timestamp when component mounts
  useEffect(() => {
    setFormStartTime(generateFormTimestamp())
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus({ type: null, message: '' })
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    const result = await subscribeToNewsletterAction(formData)

    if (result.success) {
      setStatus({
        type: 'success',
        message: 'Successfully subscribed to the newsletter!',
      })
      // Reset form
      ;(event.target as HTMLFormElement).reset()
      // Generate new timestamp for next submission
      setFormStartTime(generateFormTimestamp())
    } else {
      setStatus({
        type: 'error',
        message: result.error || 'Failed to subscribe. Please try again.',
      })
    }
    setIsPending(false)
  }

  return (
    <div className="bg-white dark:bg-jt-stone-800 rounded-lg shadow-md p-8">
      <h3 className="text-2xl font-bold text-jt-stone-900 dark:text-jt-stone-50 mb-4">
        Stay Informed
      </h3>
      <p className="text-jt-stone-600 dark:text-jt-stone-400 mb-6">
        Subscribe to our newsletter for community updates and important announcements
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field - hidden from users, but bots will fill it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            opacity: 0,
          }}
          aria-hidden="true"
        />

        {/* Form start timestamp for time-based validation */}
        <input
          type="hidden"
          name="formStartTime"
          value={formStartTime}
        />

        {/* Email Input */}
        <div>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            required
            disabled={isPending}
            data-testid="newsletter-email-input"
            className="w-full px-4 py-3 border border-jt-stone-300 dark:border-jt-stone-600 rounded-md
              bg-white dark:bg-jt-stone-700 text-jt-stone-900 dark:text-white
              focus:ring-2 focus:ring-jt-emerald-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your email"
          />
        </div>

        {/* Opt-in Checkbox */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="newsletter-consent"
              name="consent"
              type="checkbox"
              required
              disabled={isPending}
              data-testid="newsletter-consent-checkbox"
              className="w-4 h-4 border border-jt-stone-300 dark:border-jt-stone-600 rounded
                bg-white dark:bg-jt-stone-700 text-jt-emerald-600
                focus:ring-2 focus:ring-jt-emerald-500
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="newsletter-consent"
              className="text-jt-stone-700 dark:text-jt-stone-300"
            >
              I agree to receive email updates from Jackson Trails HOA *
            </label>
          </div>
        </div>

        {/* Status Message */}
        {status.type && (
          <div
            className={`p-3 rounded-md text-sm ${
              status.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}
            data-testid={`newsletter-${status.type}-message`}
          >
            {status.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          data-testid="newsletter-submit-button"
          className="w-full px-6 py-3 bg-jt-emerald-600 text-white rounded-md font-semibold
            hover:bg-jt-emerald-700 dark:bg-jt-emerald-600 dark:hover:bg-jt-emerald-700
            focus:outline-none focus:ring-2 focus:ring-jt-emerald-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
        >
          {isPending ? 'Subscribing...' : 'Subscribe'}
        </button>

        {/* Privacy Notice */}
        <p className="text-xs text-jt-stone-500 dark:text-jt-stone-400 text-center">
          Your email will be stored by our newsletter service. See our{' '}
          <a href="/privacy" className="text-jt-emerald-600 hover:text-jt-emerald-700 underline">
            privacy policy
          </a>{' '}
          for details.
        </p>
      </form>
    </div>
  )
}
