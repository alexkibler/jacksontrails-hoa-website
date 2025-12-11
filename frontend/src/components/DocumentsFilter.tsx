'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Document, getFileUrl } from '@/lib/pocketbase'

interface DocumentsFilterProps {
  documents: Document[]
}

const categories = [
  'All',
  'Meeting Minutes',
  'Bylaws',
  'Financial Reports',
  'Architectural Guidelines',
] as const

export function DocumentsFilter({ documents }: DocumentsFilterProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  // Initialize category from URL parameter if valid
  const initialCategory = categoryParam && categories.includes(categoryParam as any)
    ? categoryParam
    : 'All'

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [selectedYear, setSelectedYear] = useState<string>('All')

  // Update selected category when URL parameter changes
  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam as any)) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  // Get unique years from documents
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(documents.map((doc) => doc.year)))
    return ['All', ...uniqueYears.sort((a, b) => b - a)]
  }, [documents])

  // Filter documents based on search term, category, and year
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === 'All' || doc.category === selectedCategory
      const matchesYear =
        selectedYear === 'All' || doc.year.toString() === selectedYear

      return matchesSearch && matchesCategory && matchesYear
    })
  }, [documents, searchTerm, selectedCategory, selectedYear])

  return (
    <div>
      {/* Filters */}
      <div className="bg-white dark:bg-jt-stone-800 rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-jt-stone-700 dark:text-jt-stone-300 mb-2"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              data-testid="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents..."
              className="w-full px-4 py-2 border border-jt-stone-300 dark:border-jt-stone-600 rounded-md
                bg-white dark:bg-jt-stone-700 text-jt-stone-900 dark:text-white
                focus:ring-2 focus:ring-jt-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-jt-stone-700 dark:text-jt-stone-300 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              data-testid="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-jt-stone-300 dark:border-jt-stone-600 rounded-md
                bg-white dark:bg-jt-stone-700 text-jt-stone-900 dark:text-white
                focus:ring-2 focus:ring-jt-emerald-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-jt-stone-700 dark:text-jt-stone-300 mb-2"
            >
              Year
            </label>
            <select
              id="year"
              data-testid="year-filter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-jt-stone-300 dark:border-jt-stone-600 rounded-md
                bg-white dark:bg-jt-stone-700 text-jt-stone-900 dark:text-white
                focus:ring-2 focus:ring-jt-emerald-500 focus:border-transparent"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-jt-stone-600 dark:text-jt-stone-400">
          Showing {filteredDocuments.length} of {documents.length} documents
        </div>
      </div>

      {/* Documents Table */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white dark:bg-jt-stone-800 rounded-lg shadow-md p-12 text-center">
          <p className="text-jt-stone-600 dark:text-jt-stone-400 text-lg">
            No documents found matching your filters.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-jt-stone-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="documents-table">
              <thead className="bg-jt-stone-50 dark:bg-jt-stone-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-jt-stone-500 dark:text-jt-stone-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-jt-stone-500 dark:text-jt-stone-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-jt-stone-500 dark:text-jt-stone-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-jt-stone-500 dark:text-jt-stone-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jt-stone-200 dark:divide-jt-stone-700">
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-jt-stone-50 dark:hover:bg-jt-stone-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-jt-stone-900 dark:text-white">
                        {doc.title}
                      </div>
                      {doc.description && (
                        <div className="text-sm text-jt-stone-500 dark:text-jt-stone-400">
                          {doc.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-jt-emerald-100 dark:bg-jt-emerald-900 text-jt-emerald-800 dark:text-jt-emerald-200">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-jt-stone-500 dark:text-jt-stone-400">
                      {doc.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={getFileUrl(doc, doc.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-jt-emerald-600 dark:text-jt-emerald-400 hover:underline font-medium"
                      >
                        Download PDF →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
