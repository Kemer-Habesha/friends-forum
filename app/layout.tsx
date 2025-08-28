import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import QueryProvider from "@/contexts/query-provider"
import AuthModals from "@/components/auth-modals"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import CacheStatus from "@/components/cache-status"

const inter = Inter({ subsets: ["latin"] })

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
  metadataBase: new URL('https://friends-forum.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "FRIENDS Forum - Nile Basin Research & Collaboration",
    description: "An international platform for research, knowledge exchange, and development support in the Nile Basin region.",
    url: 'https://friends-forum.vercel.app',
    siteName: 'FRIENDS Forum',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
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
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-16x16-09cgaQ7Ek2B64KsuZRWeAaMzDZjJ74.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-32x32-P50wgDLnaMay5RwmPtecsIvUBSaLZA.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apple-touch-icon-PpbxZSBRA6IJgGWUMzb63zwXhj6cbj.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/android-chrome-512x512-UA5G2v63FETvpsLwOFHIcRYh9tb2NK.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        rel: "android-chrome",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/android-chrome-192x192-xgpkE8itzByXoY1jTYFauJWxWidg4p.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
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
        <AuthProvider>
          <QueryProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <AuthModals />
            <PerformanceMonitor />
            <ServiceWorkerRegister />
            {process.env.NODE_ENV === 'development' && <CacheStatus />}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

