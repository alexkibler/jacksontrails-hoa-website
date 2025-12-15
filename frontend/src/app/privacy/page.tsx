import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Jackson Trails HOA',
  description: 'Privacy policy for the Jackson Trails HOA website',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-jt-stone-50 to-jt-emerald-50/30 dark:from-jt-stone-900 dark:to-jt-stone-800 py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 dark:bg-jt-stone-800/80 backdrop-blur-sm rounded-lg shadow-lg p-8 space-y-8">
          <div>
            <h1 className="text-4xl font-serif font-bold bg-gradient-forest bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-jt-stone-500 dark:text-jt-stone-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-jt-stone-900 dark:text-jt-stone-50">
              Our Commitment to Privacy
            </h2>
            <p className="text-jt-stone-700 dark:text-jt-stone-300">
              The Jackson Trails HOA website is designed with privacy in mind. We do not store any resident data on our servers or in our database. All content on this site (announcements, documents, board information) is public information intended for community access.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-jt-stone-900 dark:text-jt-stone-50">
              What We Don&apos;t Collect
            </h2>
            <ul className="list-disc list-inside space-y-2 text-jt-stone-700 dark:text-jt-stone-300">
              <li>We do not use cookies for tracking</li>
              <li>We do not use analytics or tracking scripts (no Google Analytics, Facebook Pixel, etc.)</li>
              <li>We do not store user accounts or login information</li>
              <li>We do not collect browsing history or behavioral data</li>
              <li>We do not store IP addresses in our application</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-jt-stone-900 dark:text-jt-stone-50">
              Optional Forms & Third-Party Services
            </h2>
            <p className="text-jt-stone-700 dark:text-jt-stone-300">
              This website offers two <strong>optional</strong> forms that you may choose to use. When you submit these forms, your information is sent directly to third-party services and is <strong>not stored on our servers</strong>.
            </p>

            <div className="bg-jt-stone-50 dark:bg-jt-stone-900/50 p-6 rounded-lg space-y-6 mt-4">
              <div>
                <h3 className="text-xl font-semibold text-jt-stone-900 dark:text-jt-stone-50 mb-3">
                  1. Contact Form
                </h3>
                <p className="text-jt-stone-700 dark:text-jt-stone-300 mb-3">
                  When you submit the contact form, the following information is collected:
                </p>
                <ul className="list-disc list-inside space-y-1 text-jt-stone-700 dark:text-jt-stone-300 mb-3">
                  <li>Your name</li>
                  <li>Your email address</li>
                  <li>Subject and message content</li>
                  <li>Optional newsletter subscription preference</li>
                </ul>
                <p className="text-jt-stone-700 dark:text-jt-stone-300 mb-3">
                  <strong>Where your data goes:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-jt-stone-700 dark:text-jt-stone-300">
                  <li><strong>Gmail (Google)</strong> - Your message is sent directly via Gmail to the HOA board&apos;s email address (jacksontrailshoa@gmail.com). Google stores the email according to their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-jt-emerald-600 hover:text-jt-emerald-700 underline">privacy policy</a>. The email remains in the board&apos;s Gmail inbox and sent folder.</li>
                  <li><strong>No third-party email services</strong> - We send emails directly through Gmail SMTP. Your message is only stored by Google/Gmail, not by any additional email delivery services.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-jt-stone-900 dark:text-jt-stone-50 mb-3">
                  2. Newsletter Signup
                </h3>
                <p className="text-jt-stone-700 dark:text-jt-stone-300 mb-3">
                  When you subscribe to the newsletter, the following information is collected:
                </p>
                <ul className="list-disc list-inside space-y-1 text-jt-stone-700 dark:text-jt-stone-300 mb-3">
                  <li>Your email address (required)</li>
                  <li>Your name (optional, if provided via contact form)</li>
                </ul>
                <p className="text-jt-stone-700 dark:text-jt-stone-300 mb-3">
                  <strong>Why we collect this and where it goes:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-jt-stone-700 dark:text-jt-stone-300 mb-3">
                  <li><strong>Purpose:</strong> To send you periodic community announcements, HOA updates, and newsletters about neighborhood events and important information.</li>
                  <li><strong>MailerLite</strong> - Email marketing platform that stores your email address and subscription status. MailerLite is used specifically to manage newsletter subscriptions and send bulk announcements to community members who opt in.</li>
                  <li><strong>Data collected by MailerLite:</strong> Email address, subscription date, email open/click statistics (for newsletter analytics only), and optional name if provided.</li>
                  <li><strong>Your control:</strong> You can unsubscribe at any time using the link in any newsletter email. View MailerLite&apos;s <a href="https://www.mailerlite.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-jt-emerald-600 hover:text-jt-emerald-700 underline">privacy policy</a>.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-jt-stone-900 dark:text-jt-stone-50">
              Local Storage
            </h2>
            <p className="text-jt-stone-700 dark:text-jt-stone-300">
              We use browser local storage only to remember your light/dark theme preference. This data never leaves your device and contains no personal information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-jt-stone-900 dark:text-jt-stone-50">
              Server Logs
            </h2>
            <p className="text-jt-stone-700 dark:text-jt-stone-300">
              Like most websites, our web server may collect standard technical information such as IP addresses and browser types in temporary server logs for security and troubleshooting purposes. These logs are not used for tracking and are automatically deleted on a regular basis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-jt-stone-900 dark:text-jt-stone-50">
              Your Rights
            </h2>
            <p className="text-jt-stone-700 dark:text-jt-stone-300 mb-3">
              Because we do not store your data on our servers, there is no data for us to access, modify, or delete. However, you have rights regarding data held by third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-jt-stone-700 dark:text-jt-stone-300">
              <li><strong>Newsletter Unsubscribe:</strong> Click the unsubscribe link in any newsletter email from MailerLite, or contact the HOA board to manually remove you from the list</li>
              <li><strong>Contact Form Submissions:</strong> Your messages are stored in the board&apos;s Gmail account. Contact the HOA board directly to request deletion</li>
              <li><strong>Third-Party Data Rights:</strong> Contact MailerLite or Google directly to exercise your data rights under GDPR, CCPA, or other privacy laws</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-jt-stone-900 dark:text-jt-stone-50">
              Children&apos;s Privacy
            </h2>
            <p className="text-jt-stone-700 dark:text-jt-stone-300">
              This website is not directed at children under the age of 13. We do not knowingly collect information from children.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-jt-stone-900 dark:text-jt-stone-50">
              Changes to This Policy
            </h2>
            <p className="text-jt-stone-700 dark:text-jt-stone-300">
              We may update this privacy policy from time to time. The &quot;Last updated&quot; date at the top of this page indicates when the policy was last revised. Continued use of the website after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-jt-stone-900 dark:text-jt-stone-50">
              Contact Us
            </h2>
            <p className="text-jt-stone-700 dark:text-jt-stone-300">
              If you have questions about this privacy policy, please contact the HOA board using the <a href="/contact" className="text-jt-emerald-600 hover:text-jt-emerald-700 underline">contact form</a>.
            </p>
          </section>

          <section className="border-t border-jt-stone-200 dark:border-jt-stone-700 pt-6">
            <p className="text-sm text-jt-stone-500 dark:text-jt-stone-400 italic">
              This website is open source. You can review our code and data practices on <a href="https://github.com/alexkibler/jacksontrails-hoa-website" target="_blank" rel="noopener noreferrer" className="text-jt-emerald-600 hover:text-jt-emerald-700 underline">GitHub</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
