import Link from 'next/link'
import { getPocketBase, Announcement } from '@/lib/pocketbase'

async function getAllAnnouncements(): Promise<Announcement[]> {
  try {
    const pb = getPocketBase()
    const records = await pb.collection('announcements').getFullList<Announcement>({
      sort: '-published_date',
    })
    return records
  } catch (error) {
    console.error('Failed to fetch announcements:', error)
    return []
  }
}

export const metadata = {
  title: 'Announcements | Jackson Trails HOA',
  description: 'Community announcements and updates from Jackson Trails HOA',
}

export default async function AnnouncementsPage() {
  const announcements = await getAllAnnouncements()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Announcements
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Stay up to date with community news and updates
          </p>
        </div>

        {announcements.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No announcements yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/announcements/${announcement.slug}`}
                        className="group"
                      >
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-jt-blue-700 dark:group-hover:text-jt-sunset-400 transition-colors">
                          {announcement.title}
                        </h2>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                      <Link
                        href={`/announcements/${announcement.slug}`}
                        className="inline-flex items-center text-jt-blue-700 dark:text-jt-sunset-400 hover:underline font-medium"
                      >
                        Read full announcement →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
