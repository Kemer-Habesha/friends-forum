"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { openLoginModal, openSignupModal } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IDtYOf2a5lepaR7rWw8YuXmaRBVsSP.png"
              alt="FRIENDS Forum Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-primary">FRIENDS Forum</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
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
              <Link
                href="/"
                className={`text-sm font-medium ${
                  isActive("/") ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
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
              >
                {isActive("/contact") && <span className="inline-block w-1 h-1 bg-primary rounded-full mr-2"></span>}
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

