import type React from "react"
import "@/app/globals.css"
import { Inter, Cormorant_Garamond } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ServiceWorkerRegister } from "@/components/service-worker-register"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
})

/*
 * Cormorant Garamond is only used for the hero headline (font-medium = 500, normal style)
 * and the italic "Nile Basin" emphasis (font-normal = 400, italic style). Loading just these
 * two weights × two styles ships 4 font files (~120 KB) instead of the previous 8 (~240 KB).
 * Add another weight here only if you start using Cormorant in 600/700 elsewhere.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
})

export const metadata = {
  /*
   * `title.template` lets sub-pages set a short title (e.g. "About") and
   * Next.js auto-suffixes the brand. Pages that prefer to keep the brand
   * inside their own title still work — they just need to use
   * `title: { absolute: '…' }` in their generateMetadata return value.
   */
  title: {
    default: "FRIENDS Forum - Nile Basin Research & Collaboration",
    /*
     * Brand-first format for consistency with editor-set titles in Sanity
     * (e.g. "FRIENDS Forum - Events"). Pages that already include the brand
     * inside their own title use `title: { absolute: '…' }` to bypass this
     * template entirely.
     */
    template: "FRIENDS Forum - %s",
  },
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
  /*
   * Layout-level canonical only acts as a default for pages that don't
   * provide their own. EVERY content page below sets its own
   * `alternates.canonical` in generateMetadata — without that, all sub-
   * pages would canonicalize to "/" and Google would deindex them as
   * duplicates. See app/{about,events,resources,forum,contact}/page.tsx.
   */
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FRIENDS Forum - Nile Basin Research & Collaboration",
    description: "An international platform for research, knowledge exchange, and development support in the Nile Basin region.",
    url: "https://friendsforum.org/",
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
    <html lang="en" className={cormorant.variable}>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}

