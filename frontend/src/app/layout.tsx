import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navigation } from '@/components/Navigation'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

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
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <ThemeProvider>
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
                    <p className="text-sm text-jt-stone-600 dark:text-jt-stone-400">
                      This is an open-source community website.
                    </p>
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
