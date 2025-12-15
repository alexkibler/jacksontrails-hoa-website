import nodemailer from 'nodemailer'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  try {
    // Create Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.GMAIL_USER || '',
        pass: process.env.GMAIL_APP_PASSWORD || '',
      },
    })

    // Send email
    await transporter.sendMail({
      from: `"${process.env.GMAIL_FROM_NAME || 'Jackson Trails HOA'}" <${process.env.GMAIL_USER}>`,
      to: process.env.BOARD_EMAIL || '',
      replyTo: `"${data.name}" <${data.email}>`,
      subject: `[HOA Contact Form] ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <hr>
        <h3>Message:</h3>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
      `,
      text: `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
      `.trim(),
    })

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
