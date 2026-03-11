import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3002'

export const viewport: Viewport = {
  themeColor: '#34d399',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Propsly',
    template: '%s — Propsly',
  },
  description: 'Create beautiful interactive proposals as web pages.',
  metadataBase: new URL(BASE_URL),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster theme="dark" />
      </body>
    </html>
  )
}
