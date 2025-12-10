'use client'

import { useState } from 'react'
import { submitContactForm } from '@/app/contact/actions'

export function ContactForm() {
  const [isPending, setIsPending] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus({ type: null, message: '' })
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    const result = await submitContactForm(formData)

    if (result.success) {
      setStatus({
        type: 'success',
        message: "Message sent successfully! We'll get back to you soon.",
      })
      // Reset form
      ;(event.target as HTMLFormElement).reset()
    } else {
      setStatus({
        type: 'error',
        message: result.error || 'Failed to send message. Please try again.',
      })
    }
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={isPending}
          data-testid="name-input"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-jt-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Your name"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={isPending}
          data-testid="email-input"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-jt-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="your.email@example.com"
        />
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          disabled={isPending}
          data-testid="subject-input"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-jt-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="What is this about?"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          disabled={isPending}
          data-testid="message-input"
          rows={6}
          maxLength={5000}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-jt-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            custom-scrollbar"
          placeholder="Your message..."
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Maximum 5000 characters
        </p>
      </div>

      {/* Status Message */}
      {status.type && (
        <div
          className={`p-4 rounded-md ${
            status.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}
          data-testid={`${status.type}-message`}
        >
          {status.message}
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isPending}
          data-testid="submit-button"
          className="w-full px-6 py-3 bg-jt-blue-900 text-white rounded-md font-semibold
            hover:bg-jt-blue-800 dark:bg-jt-blue-700 dark:hover:bg-jt-blue-600
            focus:outline-none focus:ring-2 focus:ring-jt-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
        >
          {isPending ? 'Sending...' : 'Send Message'}
        </button>
      </div>

      {/* Privacy Notice */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Your message will be sent directly to the HOA board. We do not store your information.
      </p>
    </form>
  )
}
