import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { GrainOverlay } from "@/components/shared/grain-overlay";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Propsly — Open-Source Proposal Platform",
  description:
    "Create beautiful interactive proposals as web pages. Interactive pricing, view tracking, e-signatures. Self-hosted or cloud. Free and open-source.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://propsly.org"
  ),
  openGraph: {
    title: "Propsly — Open-Source Proposal Platform",
    description:
      "Create beautiful interactive proposals as web pages. Interactive pricing, view tracking, e-signatures.",
    siteName: "Propsly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Propsly — Open-Source Proposal Platform",
    description:
      "Create beautiful interactive proposals as web pages. Free and open-source.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        {children}
        <Toaster theme="dark" />
        <GrainOverlay />
      </body>
    </html>
  );
}
