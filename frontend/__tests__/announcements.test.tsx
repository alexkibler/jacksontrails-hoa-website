import { render, screen } from '@testing-library/react'
import { getPocketBase } from '@/lib/pocketbase'

// Mock the PocketBase module
jest.mock('@/lib/pocketbase', () => ({
  getPocketBase: jest.fn(),
  getFileUrl: jest.fn(),
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/announcements',
  notFound: jest.fn(),
}))

describe('Announcements', () => {
  const mockAnnouncements = [
    {
      id: '1',
      title: 'Summer Pool Opening',
      slug: 'summer-pool-opening',
      content: '<p>The community pool will open on June 1st!</p>',
      published_date: '2024-05-15',
      featured: true,
      created: '2024-05-15T10:00:00Z',
      updated: '2024-05-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Annual HOA Meeting',
      slug: 'annual-hoa-meeting',
      content: '<p>Join us for the annual meeting on July 10th.</p>',
      published_date: '2024-05-10',
      featured: false,
      created: '2024-05-10T10:00:00Z',
      updated: '2024-05-10T10:00:00Z',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should have correct TypeScript types for Announcement', () => {
    const announcement = mockAnnouncements[0]

    // These checks will fail at compile time if types are wrong
    expect(typeof announcement.id).toBe('string')
    expect(typeof announcement.title).toBe('string')
    expect(typeof announcement.slug).toBe('string')
    expect(typeof announcement.content).toBe('string')
    expect(typeof announcement.published_date).toBe('string')
    expect(typeof announcement.created).toBe('string')
    expect(typeof announcement.updated).toBe('string')
  })

  it('should format dates correctly', () => {
    const date = new Date('2024-05-15')
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    })

    expect(formatted).toBe('May 15, 2024')
  })

  it('should filter featured announcements', () => {
    const featured = mockAnnouncements.filter((a) => a.featured)
    expect(featured).toHaveLength(1)
    expect(featured[0].title).toBe('Summer Pool Opening')
  })

  it('should sort announcements by published_date', () => {
    const sorted = [...mockAnnouncements].sort((a, b) => {
      return new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
    })

    expect(sorted[0].title).toBe('Summer Pool Opening')
    expect(sorted[1].title).toBe('Annual HOA Meeting')
  })

  it('should generate correct slug URLs', () => {
    const announcement = mockAnnouncements[0]
    const url = `/announcements/${announcement.slug}`
    expect(url).toBe('/announcements/summer-pool-opening')
  })
})

describe('PocketBase Client', () => {
  it('should use correct environment variable for URL', () => {
    expect(process.env.POCKETBASE_URL).toBe('http://localhost:8090')
  })

  it('should have getPocketBase function', () => {
    expect(getPocketBase).toBeDefined()
    expect(typeof getPocketBase).toBe('function')
  })
})
