import { BoardMember } from '@/lib/pocketbase'

interface BoardMemberCardProps {
  member: BoardMember
}

export function BoardMemberCard({ member }: BoardMemberCardProps) {
  const fullName = `${member.firstname} ${member.lastname}`
  const displayName = member.pronouns
    ? `${fullName} (${member.pronouns})`
    : fullName

  return (
    <div className="bg-white dark:bg-jt-stone-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        {/* Name and Position */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-jt-stone-900 dark:text-jt-stone-50 mb-1">
            {displayName}
          </h3>
          {member.position && (
            <p className="text-sm font-medium text-jt-emerald-600 dark:text-jt-emerald-400">
              {member.position}
            </p>
          )}
        </div>

        {/* Bio */}
        {member.bio && (
          <div className="mb-4 flex-1">
            <p className="text-sm text-jt-stone-600 dark:text-jt-stone-400 leading-relaxed">
              {member.bio}
            </p>
          </div>
        )}

        {/* Contact */}
        <div className="mt-auto pt-4 border-t border-jt-stone-200 dark:border-jt-stone-700">
          <a
            href={`mailto:${member.email}`}
            className="inline-flex items-center text-sm text-jt-emerald-600 dark:text-jt-emerald-400 hover:underline font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {member.email}
          </a>
        </div>
      </div>
    </div>
  )
}
