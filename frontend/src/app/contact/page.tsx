import { ContactForm } from '@/components/ContactForm'

export const metadata = {
  title: 'Contact Us | Jackson Trails HOA',
  description: 'Get in touch with the Jackson Trails HOA board',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-jt-stone-50 dark:bg-jt-stone-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-jt-stone-900 dark:text-jt-stone-50 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-jt-stone-600 dark:text-jt-stone-400">
            Have a question or concern? Send us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-white dark:bg-jt-stone-800 rounded-lg shadow-md p-8">
          <ContactForm />
        </div>

        <div className="mt-8 bg-jt-emerald-50 dark:bg-jt-emerald-900/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-jt-stone-900 dark:text-jt-stone-50 mb-4">
            Privacy Notice
          </h2>
          <p className="text-sm text-jt-stone-700 dark:text-jt-stone-300">
            We respect your privacy. When you submit this form, your message is sent directly to our board members via email.
            We do not store any of your personal information in our database. Your email address is only used to respond to your inquiry.
          </p>
        </div>
      </div>
    </div>
  )
}
