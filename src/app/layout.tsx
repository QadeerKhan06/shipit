
import type { Metadata } from 'next'
import '@fontsource/jetbrains-mono'
import '@fontsource/inter'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShipIt - Cursor for Startups',
  description: 'AI-powered startup idea validation grounded in real market data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
