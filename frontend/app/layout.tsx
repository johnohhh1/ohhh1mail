import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ohhh1Mail AI',
  description: 'AI-powered email client',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
