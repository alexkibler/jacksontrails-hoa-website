import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPocketBase, Announcement } from '@/lib/pocketbase'

async function getAnnouncement(slug: string): Promise<Announcement | null> {
  try {
    const pb = getPocketBase()
    const records = await pb.collection('announcements').getFullList<Announcement>({
      filter: `slug = "${slug}"`,
    })
    return records[0] || null
  } catch (error) {
    console.error('Failed to fetch announcement:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const announcement = await getAnnouncement(params.slug)

  if (!announcement) {
    return {
      title: 'Announcement Not Found | Jackson Trails HOA',
    }
  }

  return {
    title: `${announcement.title} | Jackson Trails HOA`,
    description: announcement.title,
  }
}

export default async function AnnouncementPage({
  params,
}: {
  params: { slug: string }
}) {
  const announcement = await getAnnouncement(params.slug)

  if (!announcement) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/announcements"
          className="inline-flex items-center text-jt-blue-700 dark:text-jt-sunset-400 hover:underline mb-8"
        >
          ← Back to announcements
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {announcement.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <time dateTime={announcement.published_date}>
              {new Date(announcement.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {announcement.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-sunset text-white">
                Featured
              </span>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300
            prose-a:text-jt-blue-700 dark:prose-a:text-jt-sunset-400
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-ul:text-gray-700 dark:prose-ul:text-gray-300
            prose-ol:text-gray-700 dark:prose-ol:text-gray-300"
          dangerouslySetInnerHTML={{ __html: announcement.content }}
        />

        {/* Share / Actions */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/announcements"
            className="inline-flex items-center text-jt-blue-700 dark:text-jt-sunset-400 hover:underline"
          >
            ← Back to all announcements
          </Link>
        </div>
      </article>
    </div>
  )
}
