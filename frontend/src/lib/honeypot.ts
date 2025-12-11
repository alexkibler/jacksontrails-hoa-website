/**
 * Privacy-friendly spam prevention utilities
 *
 * This implementation uses honeypot fields and time-based validation
 * to prevent spam without any cookies, tracking, or external services.
 *
 * Zero user data is collected or stored.
 */

/**
 * Validates spam prevention measures
 *
 * @param honeypot - The honeypot field value (should be empty for legitimate users)
 * @param timestamp - The form start timestamp (should indicate reasonable fill time)
 * @returns Object with isValid boolean and optional error message
 */
export function validateSpamPrevention(
  honeypot: string,
  timestamp: string
): { isValid: boolean; error?: string } {
  // Check honeypot field - should be empty for legitimate users
  if (honeypot && honeypot.trim().length > 0) {
    console.warn('Spam detected: honeypot field was filled')
    return {
      isValid: false,
      error: 'Form validation failed. Please try again.',
    }
  }

  // Check submission timing
  const startTime = parseInt(timestamp, 10)
  if (isNaN(startTime)) {
    console.warn('Spam detected: invalid timestamp')
    return {
      isValid: false,
      error: 'Form validation failed. Please try again.',
    }
  }

  const currentTime = Date.now()
  const timeDiff = currentTime - startTime

  // Form filled too quickly (less than 2 seconds) - likely a bot
  if (timeDiff < 2000) {
    console.warn('Spam detected: form filled too quickly', { timeDiff })
    return {
      isValid: false,
      error: 'Please take your time filling out the form.',
    }
  }

  // Form took unreasonably long (more than 1 hour) - possible tampering
  if (timeDiff > 3600000) {
    console.warn('Spam detected: form session expired', { timeDiff })
    return {
      isValid: false,
      error: 'Form session expired. Please refresh and try again.',
    }
  }

  return { isValid: true }
}

/**
 * Generate a timestamp for the form start time
 * This should be called when the form component mounts
 */
export function generateFormTimestamp(): string {
  return Date.now().toString()
}
