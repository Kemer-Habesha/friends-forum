"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { urlFor } from "@/lib/sanity"
import { Skeleton } from "@/components/ui/skeleton"

export default function Footer() {
  const { data, loading, error } = useSiteSettings()

  return (
    <footer className="border-t py-6 md:py-12">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
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
            </div>
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <Skeleton className="h-4 w-64" />
              ) : error ? (
                'Forum for Research Initiatives, Exchange of Knowledge and Development Support in the Nile Basin region.'
              ) : (
                data?.footer?.description || 'Forum for Research Initiatives, Exchange of Knowledge and Development Support in the Nile Basin region.'
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">
              {loading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                data?.footer?.quickLinks?.title || 'Quick Links'
              )}
            </h3>
            <ul className="space-y-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <li key={index}>
                    <Skeleton className="h-4 w-16" />
                  </li>
                ))
              ) : error || !data?.footer?.quickLinks?.links ? (
                // Fallback quick links
                <>
                  <li>
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" className="text-sm text-muted-foreground hover:text-primary">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" className="text-sm text-muted-foreground hover:text-primary">
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link href="/forum" className="text-sm text-muted-foreground hover:text-primary">
                      Forum
                    </Link>
                  </li>
                </>
              ) : (
                // Dynamic quick links from Sanity
                data.footer.quickLinks.links.map((link, index) => (
                  <li key={index}>
                    <Link href={link.link} className="text-sm text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">
              {loading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                data?.footer?.contactInfo?.title || 'Contact'
              )}
            </h3>
            <ul className="space-y-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </li>
                ))
              ) : error || !data?.footer?.contactInfo ? (
                // Fallback contact info
                <>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>info@friendsforum.org</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>+1 (123) 456-7890</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Addis Ababa, Ethiopia</span>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-primary hover:underline">
                      Contact Form
                    </Link>
                  </li>
                </>
              ) : (
                // Dynamic contact info from Sanity
                <>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{data.footer.contactInfo.email}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{data.footer.contactInfo.phone}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{data.footer.contactInfo.address}</span>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-primary hover:underline">
                      Contact Form
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">
              {loading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                data?.footer?.socialMedia?.title || 'Follow Us'
              )}
            </h3>
            <div className="flex gap-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-5 w-5 rounded" />
                ))
              ) : error || !data?.footer?.socialMedia?.platforms ? (
                // Fallback social media icons
                <>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </>
              ) : (
                // Dynamic social media from Sanity
                data.footer.socialMedia.platforms
                  .filter(platform => platform.enabled && platform.url)
                  .map((platform, index) => {
                    const getSocialIcon = (platformName: string) => {
                      switch (platformName) {
                        case 'facebook':
                          return (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                          )
                        case 'twitter':
                          return (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                            </svg>
                          )
                        case 'instagram':
                          return (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                          )
                        case 'linkedin':
                          return (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                              <rect width="4" height="12" x="2" y="9" />
                              <circle cx="4" cy="4" r="2" />
                            </svg>
                          )
                        case 'youtube':
                          return (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                              <line x1="12" x2="12" y1="9" y2="13" />
                              <line x1="15" x2="9" y1="11" y2="11" />
                            </svg>
                          )
                        default:
                          return null
                      }
                    }

                    return (
                      <a
                        key={index}
                        href={platform.url}
                        className="text-muted-foreground hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {getSocialIcon(platform.platform)}
                      </a>
                    )
                  })
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {loading ? (
              <Skeleton className="inline-block h-4 w-32" />
            ) : (
              data?.footer?.copyright || 'FRIENDS Forum. All rights reserved.'
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

