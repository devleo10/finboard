import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Finance Dashboard',
  description: 'Customizable Finance Dashboard with real-time data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen w-full relative bg-black">
          {/* X Organizations Black Background with Top Glow */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000',
            }}
          />
          {/* Your Content/Components */}
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  )
}


