import { getPocketBase, BoardMember } from '@/lib/pocketbase'
import { BoardMemberCard } from '@/components/BoardMemberCard'

export const dynamic = 'force-dynamic'

async function getAllBoardMembers(): Promise<BoardMember[]> {
  const url = process.env.POCKETBASE_URL || 'http://hoa-backend:8090'
  console.log(`[DEBUG] Fetching board members from ${url}...`)
  try {
    const pb = getPocketBase()
    const records = await pb.collection('board_members').getFullList<BoardMember>({
      sort: 'order',
    })
    console.log(`[DEBUG] Fetched ${records.length} board members`)
    return records
  } catch (error) {
    console.error('[DEBUG] Failed to fetch board members:', error)
    return []
  }
}

export const metadata = {
  title: 'About The Board | Jackson Trails HOA',
  description: 'Meet the board members of Jackson Trails HOA',
}

export default async function BoardPage() {
  const boardMembers = await getAllBoardMembers()

  return (
    <div className="min-h-screen bg-jt-stone-50 dark:bg-jt-stone-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-jt-stone-900 dark:text-jt-stone-50 mb-4">
            About The Board
          </h1>
          <p className="text-lg text-jt-stone-600 dark:text-jt-stone-400 max-w-3xl mx-auto">
            Meet the dedicated volunteers who serve on the Jackson Trails HOA Board of Directors.
            Our board members work together to maintain and enhance our community.
          </p>
        </div>

        {boardMembers.length === 0 ? (
          <div className="bg-white dark:bg-jt-stone-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-jt-stone-600 dark:text-jt-stone-400 text-lg">
              No board members information available at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boardMembers.map((member) => (
              <BoardMemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
