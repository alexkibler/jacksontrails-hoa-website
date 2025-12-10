import { getPocketBase, Announcement } from '@/lib/pocketbase'

function escapeXml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

async function generateRssFeed(): Promise<string> {
  const pb = getPocketBase()
  const siteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteName = process.env.PUBLIC_SITE_NAME || 'Jackson Trails HOA'

  // Fetch announcements
  const announcements = await pb
    .collection('announcements')
    .getList<Announcement>(1, 50, {
      sort: '-published_date',
    })

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Community announcements and updates from ${escapeXml(siteName)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>
    ${announcements.items
      .map((announcement) => {
        const url = `${siteUrl}/announcements/${announcement.slug}`
        const pubDate = new Date(announcement.published_date).toUTCString()
        const description = stripHtml(announcement.content).substring(0, 300)

        return `
    <item>
      <title>${escapeXml(announcement.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}...</description>
    </item>`
      })
      .join('')}
  </channel>
</rss>`

  return rssFeed
}

export async function GET() {
  try {
    const feed = await generateRssFeed()

    return new Response(feed, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Failed to generate RSS feed:', error)
    return new Response('Failed to generate RSS feed', { status: 500 })
  }
}
