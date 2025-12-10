import { getPocketBase, Document } from '@/lib/pocketbase'
import { DocumentsFilter } from '@/components/DocumentsFilter'

async function getAllDocuments(): Promise<Document[]> {
  try {
    const pb = getPocketBase()
    const records = await pb.collection('documents').getFullList<Document>({
      sort: '-year,-created',
    })
    return records
  } catch (error) {
    console.error('Failed to fetch documents:', error)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Documents
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Access important HOA documents, meeting minutes, bylaws, and financial reports
          </p>
        </div>

        <DocumentsFilter documents={documents} />
      </div>
    </div>
  )
}
