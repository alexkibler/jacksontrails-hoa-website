import { Suspense } from 'react'
import { getPocketBase, Document } from '@/lib/pocketbase'
import { DocumentsFilter } from '@/components/DocumentsFilter'

export const dynamic = 'force-dynamic'

async function getAllDocuments(): Promise<Document[]> {
  const url = process.env.POCKETBASE_URL || 'http://hoa-backend:8090'
  console.log(`[DEBUG] Fetching documents from ${url}...`)
  try {
    const pb = getPocketBase()
    const records = await pb.collection('documents').getFullList<Document>({
      sort: '-year,-created',
    })
    console.log(`[DEBUG] Fetched ${records.length} documents`)
    return records
  } catch (error) {
    console.error('[DEBUG] Failed to fetch documents:', error)
    return []
  }
}

export const metadata = {
  title: 'Documents | Jackson Trails HOA',
  description: 'Access important HOA documents, meeting minutes, bylaws, and financial reports',
}

export default async function DocumentsPage() {
  const documents = await getAllDocuments()

  return (
    <div className="min-h-screen bg-jt-stone-50 dark:bg-jt-stone-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-jt-stone-900 dark:text-jt-stone-50 mb-4">
            Documents
          </h1>
          <p className="text-lg text-jt-stone-600 dark:text-jt-stone-400">
            Access important HOA documents, meeting minutes, bylaws, and financial reports
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-8">Loading filters...</div>}>
          <DocumentsFilter documents={documents} />
        </Suspense>
      </div>
    </div>
  )
}
