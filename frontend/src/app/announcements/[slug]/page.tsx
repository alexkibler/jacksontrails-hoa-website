import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPocketBase, Announcement } from '@/lib/pocketbase'

export const dynamic = 'force-dynamic'

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
    <div className="min-h-screen bg-jt-stone-50 dark:bg-jt-stone-900 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/announcements"
          className="inline-flex items-center text-jt-emerald-600 dark:text-jt-emerald-400 hover:underline mb-8"
        >
          ← Back to announcements
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-jt-stone-900 dark:text-jt-stone-50 mb-4">
            {announcement.title}
          </h1>
          <div className="flex items-center gap-4 text-jt-stone-500 dark:text-jt-stone-400">
            <time dateTime={announcement.published_date}>
              {new Date(announcement.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {announcement.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-jt-emerald-600 text-white">
                Featured
              </span>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-jt-stone-900 dark:prose-headings:text-jt-stone-50
            prose-p:text-jt-stone-700 dark:prose-p:text-jt-stone-300
            prose-a:text-jt-emerald-600 dark:prose-a:text-jt-emerald-400
            prose-strong:text-jt-stone-900 dark:prose-strong:text-white
            prose-ul:text-jt-stone-700 dark:prose-ul:text-jt-stone-300
            prose-ol:text-jt-stone-700 dark:prose-ol:text-jt-stone-300"
          dangerouslySetInnerHTML={{ __html: announcement.content }}
        />

        {/* Share / Actions */}
        <div className="mt-12 pt-8 border-t border-jt-stone-200 dark:border-jt-stone-700">
          <Link
            href="/announcements"
            className="inline-flex items-center text-jt-emerald-600 dark:text-jt-emerald-400 hover:underline"
          >
            ← Back to all announcements
          </Link>
        </div>
      </article>
    </div>
  )
}
