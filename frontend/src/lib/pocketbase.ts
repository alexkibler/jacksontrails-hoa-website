import PocketBase from 'pocketbase'

// Server-side PocketBase client (uses internal Docker network URL)
export function getPocketBase() {
  const url = process.env.POCKETBASE_URL || 'http://hoa-backend:8090'
  const pb = new PocketBase(url)

  // Disable Next.js fetch cache for PocketBase requests
  pb.beforeSend = function (url, options) {
    // Force no-store cache to prevent Next.js from caching API responses
    options.cache = 'no-store'
    return { url, options }
  }

  return pb
}

// Client-side/Public PocketBase client
export function getPublicPocketBase() {
  // Use relative path '/pb' which is rewritten by Next.js to the backend
  // This avoids CORS issues and port mapping mismatches
  const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || '/pb'
  const pb = new PocketBase(url)

  // Disable cache for client-side requests as well
  pb.beforeSend = function (url, options) {
    options.cache = 'no-store'
    return { url, options }
  }

  return pb
}

// Types for our collections
export interface Announcement {
  id: string
  title: string
  slug: string
  content: string
  published_date: string
  featured?: boolean
  created: string
  updated: string
}

export interface Document {
  id: string
  title: string
  category: 'Meeting Minutes' | 'Bylaws' | 'Financial Reports' | 'Architectural Guidelines'
  year: number
  file: string
  description?: string
  created: string
  updated: string
}

export interface BoardMember {
  id: string
  firstname: string
  lastname: string
  email: string
  pronouns?: string
  position?: string
  bio?: string
  order?: number
  created: string
  updated: string
}

// Helper to get file URL
export function getFileUrl(record: any, filename: string): string {
  const pb = getPublicPocketBase()
  return pb.getFileUrl(record, filename)
}
