import Link from 'next/link'
import { getPocketBase, Announcement } from '@/lib/pocketbase'

export const dynamic = 'force-dynamic'

async function getAllAnnouncements(): Promise<Announcement[]> {
  const url = process.env.POCKETBASE_URL || 'http://hoa-backend:8090'
  console.log(`[DEBUG] Fetching announcements from ${url}...`)
  
  // Test raw fetch
  try {
    const testUrl = `${url}/api/collections/announcements/records`
    console.log(`[DEBUG] Testing raw fetch to ${testUrl}`)
    const res = await fetch(testUrl)
    console.log(`[DEBUG] Raw fetch status: ${res.status}`)
    const data = await res.json()
    console.log(`[DEBUG] Raw fetch data items: ${data.items?.length}`)
  } catch (e) {
    console.error('[DEBUG] Raw fetch failed:', e)
  }

  try {
    const pb = getPocketBase()
    const records = await pb.collection('announcements').getFullList<Announcement>({
      sort: '-published_date',
    })
    console.log(`[DEBUG] Fetched ${records.length} announcements`)
    return records
  } catch (error) {
    console.error('Failed to fetch announcements:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
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
    <div className="min-h-screen bg-jt-stone-50 dark:bg-jt-stone-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-jt-stone-900 dark:text-jt-stone-50 mb-4">
            Announcements
          </h1>
          <p className="text-lg text-jt-stone-600 dark:text-jt-stone-400">
            Stay up to date with community news and updates
          </p>
        </div>

        {announcements.length === 0 ? (
          <div className="bg-white dark:bg-jt-stone-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-jt-stone-600 dark:text-jt-stone-400 text-lg">
              No announcements yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="bg-white dark:bg-jt-stone-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/announcements/${announcement.slug}`}
                        className="group"
                      >
                        <h2 className="text-2xl font-semibold text-jt-stone-900 dark:text-jt-stone-50 mb-2 group-hover:text-jt-emerald-600 dark:group-hover:text-jt-emerald-400 transition-colors">
                          {announcement.title}
                        </h2>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-jt-stone-500 dark:text-jt-stone-400 mb-4">
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
                      <Link
                        href={`/announcements/${announcement.slug}`}
                        className="inline-flex items-center text-jt-emerald-600 dark:text-jt-emerald-400 hover:underline font-medium"
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
