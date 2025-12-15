'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/announcements', label: 'Announcements' },
    { href: '/documents', label: 'Documents' },
    { href: '/about/board', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="bg-white dark:bg-jt-stone-800 shadow-md transition-colors duration-200" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Site Name */}
          <Link
            href="/"
            className="flex items-center space-x-3 text-xl font-bold bg-gradient-forest bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            aria-label="Jackson Trails HOA home"
          >
            <span className="text-2xl" role="img" aria-label="Houses">🏘️</span>
            <span>Jackson Trails</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-jt-forest-900 dark:text-jt-emerald-400'
                      : 'text-jt-stone-700 dark:text-jt-stone-300 hover:text-jt-emerald-600 dark:hover:text-jt-emerald-300'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4" aria-label="Mobile navigation">
          <div className="flex flex-col space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-jt-forest-900 text-white dark:bg-jt-emerald-700'
                      : 'text-jt-stone-700 dark:text-jt-stone-300 hover:bg-jt-stone-100 dark:hover:bg-jt-stone-700'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
