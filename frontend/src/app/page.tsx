import Link from 'next/link'
import { getPocketBase, Announcement } from '@/lib/pocketbase'
import { NewsletterSignup } from '@/components/NewsletterSignup'

export const dynamic = 'force-dynamic'

async function getFeaturedAnnouncements(): Promise<Announcement[]> {
  try {
    const pb = getPocketBase()
    const records = await pb.collection('announcements').getList<Announcement>(1, 3, {
      sort: '-published_date',
      filter: 'featured = true',
    })
    return records.items
  } catch (error) {
    console.error('Failed to fetch featured announcements:', error)
    return []
  }
}

export default async function Home() {
  const featuredAnnouncements = await getFeaturedAnnouncements()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-forest text-white py-20" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Jackson Trails
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Your Community, Your Home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/announcements"
              className="px-8 py-3 bg-white text-jt-forest-900 rounded-lg font-semibold hover:bg-jt-stone-100 transition-colors"
            >
              View Announcements
            </Link>
            <Link
              href="/documents"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Documents
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Announcements */}
      {featuredAnnouncements.length > 0 && (
        <section className="py-16 bg-jt-stone-50 dark:bg-jt-stone-900" aria-labelledby="recent-updates-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="recent-updates-heading" className="text-3xl font-bold mb-8 text-jt-stone-900 dark:text-jt-stone-50">
              Recent Updates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredAnnouncements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="bg-white dark:bg-jt-stone-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-3 text-jt-stone-900 dark:text-jt-stone-50">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-jt-stone-500 dark:text-jt-stone-400 mb-4">
                    <time dateTime={announcement.published_date}>
                      {new Date(announcement.published_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </p>
                  <Link
                    href={`/announcements/${announcement.slug}`}
                    className="text-jt-emerald-600 dark:text-jt-emerald-400 hover:underline font-medium"
                    aria-label={`Read more about ${announcement.title}`}
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/announcements"
                className="text-jt-emerald-600 dark:text-jt-emerald-400 hover:underline font-medium"
              >
                View all announcements →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-16 bg-jt-stone-50 dark:bg-jt-stone-900" aria-labelledby="newsletter-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white dark:bg-jt-stone-800" aria-labelledby="quick-access-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="quick-access-heading" className="text-3xl font-bold mb-8 text-center text-jt-stone-900 dark:text-jt-stone-50">
            Quick Access
          </h2>
          <nav aria-label="Document categories">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Meeting Minutes', icon: '📋', iconLabel: 'Clipboard', href: '/documents?category=Meeting Minutes' },
                { title: 'Bylaws', icon: '📜', iconLabel: 'Scroll', href: '/documents?category=Bylaws' },
                { title: 'Financial Reports', icon: '💰', iconLabel: 'Money bag', href: '/documents?category=Financial Reports' },
                { title: 'Architectural Guidelines', icon: '🏗️', iconLabel: 'Building construction', href: '/documents?category=Architectural Guidelines' },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="bg-jt-stone-50 dark:bg-jt-stone-700 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                  aria-label={`View ${item.title}`}
                >
                  <div className="text-4xl mb-3" role="img" aria-label={item.iconLabel}>{item.icon}</div>
                  <h3 className="text-lg font-semibold text-jt-stone-900 dark:text-jt-stone-50">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-jt-forest-900 text-white" aria-labelledby="contact-cta-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="contact-cta-heading" className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-xl mb-8 text-white/90">
            Our board members are here to help
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-jt-forest-900 rounded-lg font-semibold hover:bg-jt-stone-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
