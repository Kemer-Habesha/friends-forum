import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import QueryProvider from "@/contexts/query-provider"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import CacheStatus from "@/components/cache-status"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
})

export const metadata = {
  title: "FRIENDS Forum - Nile Basin Research & Collaboration",
  description:
    "An international platform for research, knowledge exchange, and development support in the Nile Basin region.",
  keywords: ["Nile Basin", "Research", "Collaboration", "Development", "Forum"],
  authors: [{ name: "FRIENDS Forum" }],
  creator: "FRIENDS Forum",
  publisher: "FRIENDS Forum",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://friendsforum.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FRIENDS Forum - Nile Basin Research & Collaboration",
    description: "An international platform for research, knowledge exchange, and development support in the Nile Basin region.",
    url: "https://friendsforum.org",
    siteName: "FRIENDS Forum",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FRIENDS Forum - Nile Basin Research & Collaboration",
    description: "An international platform for research, knowledge exchange, and development support in the Nile Basin region.",
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
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.png", rel: "shortcut icon" },
    ],
    apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ServiceWorkerRegister />
          {process.env.NODE_ENV === 'development' && <CacheStatus />}
        </QueryProvider>
      </body>
    </html>
  )
}

