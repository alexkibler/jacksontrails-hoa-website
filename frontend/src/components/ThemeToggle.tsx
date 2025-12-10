'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2" data-testid="theme-toggle">
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          theme === 'light'
            ? 'bg-jt-forest-900 text-white dark:bg-jt-emerald-600 dark:text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        aria-label="Switch to light mode"
        data-testid="light-mode-button"
      >
        ☀️ Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          theme === 'dark'
            ? 'bg-jt-forest-900 text-white dark:bg-jt-emerald-600 dark:text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        aria-label="Switch to dark mode"
        data-testid="dark-mode-button"
      >
        🌙 Dark
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          theme === 'system'
            ? 'bg-jt-forest-900 text-white dark:bg-jt-emerald-600 dark:text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        aria-label="Use system theme preference"
        data-testid="system-mode-button"
      >
        💻 System
      </button>
    </div>
  )
}
