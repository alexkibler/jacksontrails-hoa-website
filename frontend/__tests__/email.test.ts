import { validateContactFormData, ContactFormData } from '@/lib/email'

describe('Email Utilities', () => {
  describe('validateContactFormData', () => {
    const validData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message content',
    }

    it('should pass validation with valid data', () => {
      const result = validateContactFormData(validData)
      expect(result).toBeNull()
    })

    it('should fail when name is missing', () => {
      const data = { ...validData, name: '' }
      const result = validateContactFormData(data)
      expect(result).toBe('Name is required')
    })

    it('should fail when name is only whitespace', () => {
      const data = { ...validData, name: '   ' }
      const result = validateContactFormData(data)
      expect(result).toBe('Name is required')
    })

    it('should fail when email is missing', () => {
      const data = { ...validData, email: '' }
      const result = validateContactFormData(data)
      expect(result).toBe('Email is required')
    })

    it('should fail when email is invalid', () => {
      const invalidEmails = [
        'notanemail',
        'missing@domain',
        '@nodomain.com',
        'spaces in@email.com',
        'double@@domain.com',
      ]

      invalidEmails.forEach((email) => {
        const data = { ...validData, email }
        const result = validateContactFormData(data)
        expect(result).toBe('Please enter a valid email address')
      })
    })

    it('should pass with valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'test123@sub.domain.com',
      ]

      validEmails.forEach((email) => {
        const data = { ...validData, email }
        const result = validateContactFormData(data)
        expect(result).toBeNull()
      })
    })

    it('should fail when subject is missing', () => {
      const data = { ...validData, subject: '' }
      const result = validateContactFormData(data)
      expect(result).toBe('Subject is required')
    })

    it('should fail when message is missing', () => {
      const data = { ...validData, message: '' }
      const result = validateContactFormData(data)
      expect(result).toBe('Message is required')
    })

    it('should fail when message is too long', () => {
      const data = { ...validData, message: 'a'.repeat(5001) }
      const result = validateContactFormData(data)
      expect(result).toBe('Message is too long (maximum 5000 characters)')
    })

    it('should pass when message is exactly 5000 characters', () => {
      const data = { ...validData, message: 'a'.repeat(5000) }
      const result = validateContactFormData(data)
      expect(result).toBeNull()
    })
  })
})
