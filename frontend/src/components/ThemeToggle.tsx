'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Theme selection"
      className="flex items-center gap-2"
      data-testid="theme-toggle"
    >
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          theme === 'light'
            ? 'bg-jt-forest-900 text-white dark:bg-jt-emerald-600 dark:text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        aria-label="Light mode"
        aria-pressed={theme === 'light'}
        data-testid="light-mode-button"
      >
        <span role="img" aria-label="Sun">☀️</span> Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          theme === 'dark'
            ? 'bg-jt-forest-900 text-white dark:bg-jt-emerald-600 dark:text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        aria-label="Dark mode"
        aria-pressed={theme === 'dark'}
        data-testid="dark-mode-button"
      >
        <span role="img" aria-label="Moon">🌙</span> Dark
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          theme === 'system'
            ? 'bg-jt-forest-900 text-white dark:bg-jt-emerald-600 dark:text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        aria-label="System theme"
        aria-pressed={theme === 'system'}
        data-testid="system-mode-button"
      >
        <span role="img" aria-label="Computer">💻</span> System
      </button>
    </div>
  )
}
