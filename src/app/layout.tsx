import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FinBoard - Finance Dashboard',
  description: 'Customizable Finance Dashboard with real-time data visualization',
  keywords: ['finance', 'dashboard', 'stocks', 'crypto', 'trading'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="min-h-screen w-full relative">
            {/* Background with gradient glow */}
            <div
              className="fixed inset-0 z-0 transition-colors duration-300"
              style={{
                background: 'var(--background)',
              }}
            />
            <div
              className="fixed inset-0 z-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 185, 129, 0.15), transparent 50%)',
              }}
            />
            {/* Content */}
            <div className="relative z-10">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
