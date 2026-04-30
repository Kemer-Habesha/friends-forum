"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"

interface MenuItem {
  label: string
  link: string
  order: number
}

const fallbackItems: MenuItem[] = [
  { label: "Home", link: "/", order: 0 },
  { label: "About", link: "/about", order: 1 },
  { label: "Events", link: "/events", order: 2 },
  { label: "Resources", link: "/resources", order: 3 },
  { label: "Forum", link: "/forum", order: 4 },
  { label: "Contact", link: "/contact", order: 5 },
]

export default function HeaderNav({
  logoUrl,
  siteTitle,
  menuItems,
}: {
  logoUrl: string
  siteTitle: string
  menuItems: MenuItem[] | null
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const items = menuItems
    ? [...menuItems].sort((a, b) => a.order - b.order)
    : fallbackItems

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoUrl}
              alt={`${siteTitle} Logo`}
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-primary">{siteTitle}</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {items.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className={`text-sm font-medium relative ${
                isActive(item.link)
                  ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {items.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className={`text-sm font-medium ${
                    isActive(item.link)
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {isActive(item.link) && (
                    <span className="inline-block w-1 h-1 bg-primary rounded-full mr-2"></span>
                  )}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
