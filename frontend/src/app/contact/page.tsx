import { ContactForm } from '@/components/ContactForm'

export const metadata = {
  title: 'Contact Us | Jackson Trails HOA',
  description: 'Get in touch with the Jackson Trails HOA board',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Have a question or concern? Send us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <ContactForm />
        </div>

        <div className="mt-8 bg-jt-blue-50 dark:bg-jt-blue-900/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Privacy Notice
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            We respect your privacy. When you submit this form, your message is sent directly to our board members via email.
            We do not store any of your personal information in our database. Your email address is only used to respond to your inquiry.
          </p>
        </div>
      </div>
    </div>
  )
}
