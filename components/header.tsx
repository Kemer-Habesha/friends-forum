"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { urlFor } from "@/lib/sanity"
import { Skeleton } from "@/components/ui/skeleton"
import { prefetchPage } from "@/lib/prefetch"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data, isLoading: loading, error } = useSiteSettings()

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLinkHover = (pageKey: string) => {
    // Prefetch data when user hovers over navigation link
    prefetchPage(pageKey)
  }

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {loading ? (
              <>
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-6 w-32" />
              </>
            ) : error ? (
              <>
                <Image
                  src="/placeholder-logo.png"
                  alt="FRIENDS Forum Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold text-primary">FRIENDS Forum</span>
              </>
            ) : data?.logo ? (
              <>
                <Image
                  src={urlFor(data.logo).url()}
                  alt={`${data.title || 'FRIENDS Forum'} Logo`}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold text-primary">{data.title || 'FRIENDS Forum'}</span>
              </>
            ) : (
              <>
                <Image
                  src="/placeholder-logo.png"
                  alt="FRIENDS Forum Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold text-primary">FRIENDS Forum</span>
              </>
            )}
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {loading ? (
            // Loading skeleton for navigation
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-16" />
            ))
          ) : error ? (
            // Fallback navigation if there's an error
            <>
              <Link
                href="/"
                className={`text-sm font-medium relative ${
                  isActive("/")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium relative ${
                  isActive("/about")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                About
              </Link>
              <Link
                href="/events"
                className={`text-sm font-medium relative ${
                  isActive("/events")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Events
              </Link>
              <Link
                href="/resources"
                className={`text-sm font-medium relative ${
                  isActive("/resources")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Resources
              </Link>
              <Link
                href="/forum"
                className={`text-sm font-medium relative ${
                  isActive("/forum")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Forum
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium relative ${
                  isActive("/contact")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Contact
              </Link>
            </>
          ) : data?.navigation?.menuItems ? (
            // Dynamic navigation from Sanity - sort by order
            [...data.navigation.menuItems].sort((a, b) => a.order - b.order).map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className={`text-sm font-medium relative ${
                  isActive(item.link)
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onMouseEnter={() => {
                  // Map route to page key for prefetching
                  const pageKey = item.link === '/' ? 'homePage' : 
                    item.link.slice(1) + 'Page'
                  handleLinkHover(pageKey)
                }}
              >
                {item.label}
              </Link>
            ))
          ) : (
            // Fallback navigation if no menu items
            <>
              <Link
                href="/"
                className={`text-sm font-medium relative ${
                  isActive("/")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onMouseEnter={() => handleLinkHover('homePage')}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium relative ${
                  isActive("/about")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onMouseEnter={() => handleLinkHover('aboutPage')}
              >
                About
              </Link>
              <Link
                href="/events"
                className={`text-sm font-medium relative ${
                  isActive("/events")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onMouseEnter={() => handleLinkHover('eventsPage')}
              >
                Events
              </Link>
              <Link
                href="/resources"
                className={`text-sm font-medium relative ${
                  isActive("/resources")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onMouseEnter={() => handleLinkHover('resourcesPage')}
              >
                Resources
              </Link>
              <Link
                href="/forum"
                className={`text-sm font-medium relative ${
                  isActive("/forum")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onMouseEnter={() => handleLinkHover('forumPage')}
              >
                Forum
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium relative ${
                  isActive("/contact")
                    ? "text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onMouseEnter={() => handleLinkHover('contactPage')}
              >
                Contact
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              // strokeLinecap="round"
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
              {loading ? (
                // Loading skeleton for mobile navigation
                Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-4 w-20" />
                ))
              ) : error || !data?.navigation?.menuItems ? (
                // Fallback mobile navigation
                <>
                  <Link
                    href="/"
                    className={`text-sm font-medium ${
                      isActive("/") ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={() => handleLinkHover('homePage')}
                  >
                    {isActive("/") && <span className="inline-block w-1 h-1 bg-primary rounded-full mr-2"></span>}
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className={`text-sm font-medium ${
                      isActive("/about") ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={() => handleLinkHover('aboutPage')}
                  >
                    {isActive("/about") && <span className="inline-block w-1 h-1 bg-primary rounded-full mr-2"></span>}
                    About
                  </Link>
                  <Link
                    href="/events"
                    className={`text-sm font-medium ${
                      isActive("/events") ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={() => handleLinkHover('eventsPage')}
                  >
                    {isActive("/events") && <span className="inline-block w-1 h-1 bg-primary rounded-full mr-2"></span>}
                    Events
                  </Link>
                  <Link
                    href="/resources"
                    className={`text-sm font-medium ${
                      isActive("/resources") ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={() => handleLinkHover('resourcesPage')}
                  >
                    {isActive("/resources") && <span className="inline-block w-1 h-1 bg-primary rounded-full mr-2"></span>}
                    Resources
                  </Link>
                  <Link
                    href="/forum"
                    className={`text-sm font-medium ${
                      isActive("/forum") ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={() => handleLinkHover('forumPage')}
                  >
                    {isActive("/forum") && <span className="inline-block w-1 h-1 bg-primary rounded-full mr-2"></span>}
                    Forum
                  </Link>
                  <Link
                    href="/contact"
                    className={`text-sm font-medium ${
                      isActive("/contact") ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={() => handleLinkHover('contactPage')}
                  >
                    {isActive("/contact") && <span className="inline-block w-1 h-1 bg-primary rounded-full mr-2"></span>}
                    Contact
                  </Link>
                </>
              ) : (
                // Dynamic mobile navigation from Sanity
                data.navigation.menuItems.map((item) => (
                  <Link
                    key={item.link}
                    href={item.link}
                    className={`text-sm font-medium ${
                      isActive(item.link) ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {isActive(item.link) && <span className="inline-block w-1 h-1 bg-primary rounded-full mr-2"></span>}
                    {item.label}
                  </Link>
                ))
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

