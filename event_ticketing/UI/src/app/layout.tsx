import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../index.css'
import { AuthProvider } from '../contexts/AuthContext'
import { Toaster } from '../components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tixaro Event Ticketing System',
  description: 'Modern event ticketing platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

