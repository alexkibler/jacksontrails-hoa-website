import type { Metadata } from 'next'
import './fonts.css'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navigation } from '@/components/Navigation'
import { KonamiCode } from '@/components/KonamiCode'

export const metadata: Metadata = {
  title: 'Jackson Trails HOA',
  description: 'Official website of the Jackson Trails Homeowners Association',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <KonamiCode />
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-jt-stone-100 dark:bg-jt-stone-800 border-t border-jt-stone-200 dark:border-jt-stone-700 transition-colors duration-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-4 bg-gradient-forest bg-clip-text text-transparent">
                      Jackson Trails HOA
                    </h3>
                    <p className="text-sm text-jt-stone-600 dark:text-jt-stone-400">
                      Building a stronger community together.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-4 text-jt-stone-900 dark:text-jt-stone-50">
                      Quick Links
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/announcements" className="text-jt-stone-600 dark:text-jt-stone-400 hover:text-jt-emerald-600 dark:hover:text-jt-emerald-400">
                          Announcements
                        </a>
                      </li>
                      <li>
                        <a href="/documents" className="text-jt-stone-600 dark:text-jt-stone-400 hover:text-jt-emerald-600 dark:hover:text-jt-emerald-400">
                          Documents
                        </a>
                      </li>
                      <li>
                        <a href="/about/board" className="text-jt-stone-600 dark:text-jt-stone-400 hover:text-jt-emerald-600 dark:hover:text-jt-emerald-400">
                          About The Board
                        </a>
                      </li>
                      <li>
                        <a href="/contact" className="text-jt-stone-600 dark:text-jt-stone-400 hover:text-jt-emerald-600 dark:hover:text-jt-emerald-400">
                          Contact Us
                        </a>
                      </li>
                      <li>
                        <a href="/feed.xml" className="text-jt-stone-600 dark:text-jt-stone-400 hover:text-jt-emerald-600 dark:hover:text-jt-emerald-400">
                          RSS Feed
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-4 text-jt-stone-900 dark:text-jt-stone-50">
                      Resources
                    </h3>
                    <p className="text-sm text-jt-stone-600 dark:text-jt-stone-400 mb-3">
                      This is an open-source community website.
                    </p>
                    <a
                      href="https://github.com/alexkibler/jacksontrails-hoa-website"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-jt-stone-600 dark:text-jt-stone-400 hover:text-jt-emerald-600 dark:hover:text-jt-emerald-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      View on GitHub
                    </a>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-jt-stone-200 dark:border-jt-stone-700">
                  <p className="text-sm text-center text-jt-stone-500 dark:text-jt-stone-400">
                    © {new Date().getFullYear()} Jackson Trails HOA. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
