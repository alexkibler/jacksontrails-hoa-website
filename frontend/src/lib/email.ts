import nodemailer from 'nodemailer'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.BOARD_EMAIL,
      subject: `[HOA Contact Form] ${data.subject}`,
      replyTo: data.email,
      text: `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
      `.trim(),
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <hr>
        <h3>Message:</h3>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)
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
