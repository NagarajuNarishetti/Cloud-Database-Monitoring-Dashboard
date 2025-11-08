import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/globals.css'
import ThemeProvider from './providers/ThemeProvider'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cloud Database Monitoring Dashboard',
  description: 'Professional database performance monitoring dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}

