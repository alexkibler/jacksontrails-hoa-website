import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navigation } from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 bg-gradient-sunset bg-clip-text text-transparent">
                      Jackson Trails HOA
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Building a stronger community together.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Quick Links
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/announcements" className="text-gray-600 dark:text-gray-400 hover:text-jt-blue-700 dark:hover:text-jt-sunset-400">
                          Announcements
                        </a>
                      </li>
                      <li>
                        <a href="/documents" className="text-gray-600 dark:text-gray-400 hover:text-jt-blue-700 dark:hover:text-jt-sunset-400">
                          Documents
                        </a>
                      </li>
                      <li>
                        <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-jt-blue-700 dark:hover:text-jt-sunset-400">
                          Contact Us
                        </a>
                      </li>
                      <li>
                        <a href="/feed.xml" className="text-gray-600 dark:text-gray-400 hover:text-jt-blue-700 dark:hover:text-jt-sunset-400">
                          RSS Feed
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Resources
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This is an open-source community website.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
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
