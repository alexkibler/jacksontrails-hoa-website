import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  try {
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_TOKEN || '',
    })

    const sentFrom = new Sender(
      process.env.MAILERSEND_FROM_EMAIL || '',
      process.env.MAILERSEND_FROM_NAME || 'Jackson Trails HOA'
    )

    const recipients = [
      new Recipient(process.env.BOARD_EMAIL || '', 'HOA Board')
    ]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo({ email: data.email, name: data.name })
      .setSubject(`[HOA Contact Form] ${data.subject}`)
      .setHtml(`
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <hr>
        <h3>Message:</h3>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
      `)
      .setText(`
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
      `.trim())

    await mailerSend.email.send(emailParams)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

// Simple HTML escape to prevent XSS in email content
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// Validation functions
export function validateContactFormData(data: ContactFormData): string | null {
  if (!data.name || data.name.trim().length === 0) {
    return 'Name is required'
  }

  if (!data.email || data.email.trim().length === 0) {
    return 'Email is required'
  }

  if (!isValidEmail(data.email)) {
    return 'Please enter a valid email address'
  }

  if (!data.subject || data.subject.trim().length === 0) {
    return 'Subject is required'
  }

  if (!data.message || data.message.trim().length === 0) {
    return 'Message is required'
  }

  if (data.message.length > 5000) {
    return 'Message is too long (maximum 5000 characters)'
  }

  return null
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
