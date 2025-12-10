import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should provide default light theme', () => {
    const TestComponent = () => {
      const { resolvedTheme } = useTheme()
      return <div data-testid="theme">{resolvedTheme}</div>
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('should load theme from localStorage', () => {
    localStorageMock.setItem('theme', 'dark')

    const TestComponent = () => {
      const { theme } = useTheme()
      return <div data-testid="theme">{theme}</div>
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('should update theme when setTheme is called', async () => {
    const TestComponent = () => {
      const { theme, setTheme } = useTheme()
      return (
        <div>
          <div data-testid="theme">{theme}</div>
          <button onClick={() => setTheme('dark')}>Set Dark</button>
        </div>
      )
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const button = screen.getByText('Set Dark')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent('dark')
      expect(localStorageMock.getItem('theme')).toBe('dark')
    })
  })

  it('should apply dark class to document when theme is dark', async () => {
    const TestComponent = () => {
      const { setTheme } = useTheme()
      return <button onClick={() => setTheme('dark')}>Set Dark</button>
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const button = screen.getByText('Set Dark')
    fireEvent.click(button)

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  it('should remove dark class when theme is light', async () => {
    document.documentElement.classList.add('dark')

    const TestComponent = () => {
      const { setTheme } = useTheme()
      return <button onClick={() => setTheme('light')}>Set Light</button>
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const button = screen.getByText('Set Light')
    fireEvent.click(button)

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })
})

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should render all theme buttons', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    expect(screen.getByTestId('light-mode-button')).toBeInTheDocument()
    expect(screen.getByTestId('dark-mode-button')).toBeInTheDocument()
    expect(screen.getByTestId('system-mode-button')).toBeInTheDocument()
  })

  it('should switch to dark mode when dark button is clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const darkButton = screen.getByTestId('dark-mode-button')
    fireEvent.click(darkButton)

    await waitFor(() => {
      expect(localStorageMock.getItem('theme')).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  it('should switch to light mode when light button is clicked', async () => {
    document.documentElement.classList.add('dark')

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const lightButton = screen.getByTestId('light-mode-button')
    fireEvent.click(lightButton)

    await waitFor(() => {
      expect(localStorageMock.getItem('theme')).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  it('should switch to system mode when system button is clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const systemButton = screen.getByTestId('system-mode-button')
    fireEvent.click(systemButton)

    await waitFor(() => {
      expect(localStorageMock.getItem('theme')).toBe('system')
    })
  })
})
