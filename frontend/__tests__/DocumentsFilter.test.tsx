import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DocumentsFilter } from '@/components/DocumentsFilter'
import { Document } from '@/lib/pocketbase'

// Mock next/navigation
const mockSearchParams = new URLSearchParams()
const mockUseSearchParams = jest.fn(() => mockSearchParams)

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}))

// Mock the getFileUrl function
jest.mock('@/lib/pocketbase', () => ({
  getFileUrl: (record: any, filename: string) =>
    `http://localhost:8090/api/files/${record.id}/${filename}`,
}))

describe('DocumentsFilter', () => {
  const mockDocuments: Document[] = [
    {
      id: '1',
      title: 'January 2024 Meeting Minutes',
      category: 'Meeting Minutes',
      year: 2024,
      file: 'jan-2024.pdf',
      description: 'Monthly board meeting',
      created: '2024-01-15T10:00:00Z',
      updated: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'HOA Bylaws',
      category: 'Bylaws',
      year: 2023,
      file: 'bylaws.pdf',
      created: '2023-01-01T10:00:00Z',
      updated: '2023-01-01T10:00:00Z',
    },
    {
      id: '3',
      title: 'Q4 2023 Financial Report',
      category: 'Financial Reports',
      year: 2023,
      file: 'q4-2023.pdf',
      description: 'Quarterly financials',
      created: '2023-12-31T10:00:00Z',
      updated: '2023-12-31T10:00:00Z',
    },
    {
      id: '4',
      title: 'Architectural Guidelines',
      category: 'Architectural Guidelines',
      year: 2024,
      file: 'arch-guide.pdf',
      created: '2024-01-01T10:00:00Z',
      updated: '2024-01-01T10:00:00Z',
    },
  ]

  beforeEach(() => {
    mockSearchParams.delete('category')
    mockUseSearchParams.mockClear()
  })

  it('should render all documents by default', () => {
    render(<DocumentsFilter documents={mockDocuments} />)
    const table = screen.getByTestId('documents-table')

    expect(within(table).getByText('January 2024 Meeting Minutes')).toBeInTheDocument()
    expect(within(table).getByText('HOA Bylaws')).toBeInTheDocument()
    expect(within(table).getByText('Q4 2023 Financial Report')).toBeInTheDocument()
    expect(within(table).getByText('Architectural Guidelines', { selector: 'div' })).toBeInTheDocument()
  })

  it('should show correct document count', () => {
    render(<DocumentsFilter documents={mockDocuments} />)

    expect(screen.getByText(`Showing 4 of 4 documents`)).toBeInTheDocument()
  })

  it('should filter documents by search term', async () => {
    const user = userEvent.setup()
    render(<DocumentsFilter documents={mockDocuments} />)

    const searchInput = screen.getByTestId('search-input')
    await user.type(searchInput, 'Financial')

    expect(screen.getByText('Q4 2023 Financial Report')).toBeInTheDocument()
    expect(screen.queryByText('HOA Bylaws')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 4 documents')).toBeInTheDocument()
  })

  it('should filter documents by category', async () => {
    const user = userEvent.setup()
    render(<DocumentsFilter documents={mockDocuments} />)

    const categoryFilter = screen.getByTestId('category-filter')
    await user.selectOptions(categoryFilter, 'Meeting Minutes')

    expect(screen.getByText('January 2024 Meeting Minutes')).toBeInTheDocument()
    expect(screen.queryByText('HOA Bylaws')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 4 documents')).toBeInTheDocument()
  })

  it('should filter documents by year', async () => {
    const user = userEvent.setup()
    render(<DocumentsFilter documents={mockDocuments} />)

    const yearFilter = screen.getByTestId('year-filter')
    await user.selectOptions(yearFilter, '2024')

    const table = screen.getByTestId('documents-table')
    expect(within(table).getByText('January 2024 Meeting Minutes')).toBeInTheDocument()
    expect(within(table).getByText('Architectural Guidelines', { selector: 'div' })).toBeInTheDocument()
    expect(within(table).queryByText('HOA Bylaws')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 2 of 4 documents')).toBeInTheDocument()
  })

  it('should combine multiple filters', async () => {
    const user = userEvent.setup()
    render(<DocumentsFilter documents={mockDocuments} />)

    const searchInput = screen.getByTestId('search-input')
    const yearFilter = screen.getByTestId('year-filter')

    await user.selectOptions(yearFilter, '2024')
    await user.type(searchInput, 'Meeting')

    const table = screen.getByTestId('documents-table')
    expect(within(table).getByText('January 2024 Meeting Minutes')).toBeInTheDocument()
    expect(within(table).queryByText('Architectural Guidelines')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 4 documents')).toBeInTheDocument()
  })

  it('should show "no documents" message when no matches', async () => {
    const user = userEvent.setup()
    render(<DocumentsFilter documents={mockDocuments} />)

    const searchInput = screen.getByTestId('search-input')
    await user.type(searchInput, 'nonexistent')

    expect(
      screen.getByText('No documents found matching your filters.')
    ).toBeInTheDocument()
    expect(screen.queryByTestId('documents-table')).not.toBeInTheDocument()
  })

  it('should render download links with correct URLs', () => {
    render(<DocumentsFilter documents={mockDocuments} />)

    const links = screen.getAllByText(/Download PDF/)
    expect(links).toHaveLength(4)

    const firstLink = links[0].closest('a')
    expect(firstLink).toHaveAttribute(
      'href',
      'http://localhost:8090/api/files/1/jan-2024.pdf'
    )
    expect(firstLink).toHaveAttribute('target', '_blank')
    expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should display category badges', () => {
    render(<DocumentsFilter documents={mockDocuments} />)
    const table = screen.getByTestId('documents-table')

    expect(within(table).getByText('Meeting Minutes', { selector: 'span' })).toBeInTheDocument()
    expect(within(table).getByText('Bylaws', { selector: 'span' })).toBeInTheDocument()
    expect(within(table).getByText('Financial Reports', { selector: 'span' })).toBeInTheDocument()
    expect(within(table).getByText('Architectural Guidelines', { selector: 'span' })).toBeInTheDocument()
  })

  it('should show document descriptions when available', () => {
    render(<DocumentsFilter documents={mockDocuments} />)

    expect(screen.getByText('Monthly board meeting')).toBeInTheDocument()
    expect(screen.getByText('Quarterly financials')).toBeInTheDocument()
  })

  it('should have all category options in filter', () => {
    render(<DocumentsFilter documents={mockDocuments} />)

    const categoryFilter = screen.getByTestId('category-filter')
    const options = within(categoryFilter).getAllByRole('option')

    expect(options).toHaveLength(5) // All + 4 categories
    expect(options[0]).toHaveTextContent('All')
    expect(options[1]).toHaveTextContent('Meeting Minutes')
    expect(options[2]).toHaveTextContent('Bylaws')
    expect(options[3]).toHaveTextContent('Financial Reports')
    expect(options[4]).toHaveTextContent('Architectural Guidelines')
  })

  it('should have years sorted in descending order', () => {
    render(<DocumentsFilter documents={mockDocuments} />)

    const yearFilter = screen.getByTestId('year-filter')
    const options = within(yearFilter).getAllByRole('option')

    expect(options[0]).toHaveTextContent('All')
    expect(options[1]).toHaveTextContent('2024')
    expect(options[2]).toHaveTextContent('2023')
  })

  it('should reset filters to show all documents', async () => {
    const user = userEvent.setup()
    render(<DocumentsFilter documents={mockDocuments} />)

    // Apply filters
    const searchInput = screen.getByTestId('search-input')
    const categoryFilter = screen.getByTestId('category-filter')

    await user.type(searchInput, 'Financial')
    await user.selectOptions(categoryFilter, 'Financial Reports')

    expect(screen.getByText('Showing 1 of 4 documents')).toBeInTheDocument()

    // Reset filters
    await user.clear(searchInput)
    await user.selectOptions(categoryFilter, 'All')

    expect(screen.getByText('Showing 4 of 4 documents')).toBeInTheDocument()
  })

  it('should initialize with category from URL parameter', () => {
    mockSearchParams.set('category', 'Bylaws')

    render(<DocumentsFilter documents={mockDocuments} />)

    const categoryFilter = screen.getByTestId('category-filter') as HTMLSelectElement
    expect(categoryFilter.value).toBe('Bylaws')

    // Should only show Bylaws documents
    expect(screen.getByText('HOA Bylaws')).toBeInTheDocument()
    expect(screen.queryByText('January 2024 Meeting Minutes')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 4 documents')).toBeInTheDocument()
  })

  it('should handle invalid category URL parameter', () => {
    mockSearchParams.set('category', 'InvalidCategory')

    render(<DocumentsFilter documents={mockDocuments} />)

    const categoryFilter = screen.getByTestId('category-filter') as HTMLSelectElement
    expect(categoryFilter.value).toBe('All')

    // Should show all documents when category is invalid
    expect(screen.getByText('Showing 4 of 4 documents')).toBeInTheDocument()
  })

  it('should handle multiple valid category URL parameters', () => {
    mockSearchParams.set('category', 'Meeting Minutes')

    render(<DocumentsFilter documents={mockDocuments} />)

    const categoryFilter = screen.getByTestId('category-filter') as HTMLSelectElement
    expect(categoryFilter.value).toBe('Meeting Minutes')

    expect(screen.getByText('January 2024 Meeting Minutes')).toBeInTheDocument()
    expect(screen.queryByText('HOA Bylaws')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 4 documents')).toBeInTheDocument()
  })
})
