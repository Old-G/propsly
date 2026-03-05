import { GrainOverlay } from '@/components/shared/grain-overlay'
import { Analytics } from '@vercel/analytics/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const instrumentSerif = Instrument_Serif({
	variable: '--font-instrument-serif',
	subsets: ['latin'],
	weight: '400',
	style: ['normal', 'italic'],
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://propsly.org'

export const viewport: Viewport = {
	themeColor: '#34d399',
	width: 'device-width',
	initialScale: 1,
}

export const metadata: Metadata = {
	title: {
		default: 'Propsly — Open-Source Proposal Platform',
		template: '%s — Propsly',
	},
	description:
		'Create beautiful interactive proposals as web pages. Interactive pricing, view tracking, e-signatures. Self-hosted or cloud. Free and open-source.',
	metadataBase: new URL(BASE_URL),
	openGraph: {
		title: 'Propsly — Open-Source Proposal Platform',
		description:
			'Create beautiful interactive proposals as web pages. Interactive pricing, view tracking, e-signatures.',
		siteName: 'Propsly',
		type: 'website',
		locale: 'en_US',
		images: [
			{
				url: '/og',
				width: 1200,
				height: 630,
				alt: 'Propsly — Open-Source Proposal Platform',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Propsly — Open-Source Proposal Platform',
		description:
			'Create beautiful interactive proposals as web pages. Free and open-source.',
		site: '@oldg9516',
		creator: '@oldg9516',
		images: ['/og'],
	},
	alternates: {
		canonical: BASE_URL,
		types: {
			'application/rss+xml': '/feed.xml',
		},
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	icons: {
		icon: '/icon.svg',
		apple: '/apple-icon.png',
	},
	manifest: '/manifest.webmanifest',
	verification: {
		// google: "YOUR_GOOGLE_VERIFICATION_CODE",
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' className='dark' suppressHydrationWarning>
			<body
				className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} antialiased`}
			>
				{children}
				<GrainOverlay />
				<Toaster theme='dark' />
				<Analytics />
			</body>
		</html>
	)
}
