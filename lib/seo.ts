/**
 * Small SEO helpers used by per-page `generateMetadata` functions and
 * structured-data builders.
 *
 * Everything here is pure / framework-agnostic; no Sanity-specific logic.
 */

export const SITE_URL = "https://friendsforum.org" as const
export const SITE_NAME = "FRIENDS Forum" as const

/**
 * Pick the best title to render for a page.
 *
 * Why: editors occasionally paste descriptions into the `seo.metaTitle`
 * field in Sanity (the live `/resources` page is currently doing exactly
 * that). When that happens we'd rather fall back to a short, branded
 * title than show a 100-char description in the browser tab and SERP.
 *
 * Rules (first match wins):
 *   1. `seoTitle` if present AND length is reasonable (5–80 chars).
 *   2. `${SITE_NAME}${separator}${heading}` if a heading is provided. Brand
 *      goes first to match the format that editors use in Sanity for the
 *      other pages (e.g. "FRIENDS Forum - Events"). Keeps every tab and
 *      SERP entry visually consistent.
 *   3. `SITE_NAME` as a final safety net.
 */
export function buildTitle(
  seoTitle: string | undefined | null,
  heading?: string | null,
  separator = " - "
): string {
  const t = seoTitle?.trim()
  if (t && t.length >= 5 && t.length <= 80) return t

  const h = heading?.trim()
  if (h) return `${SITE_NAME}${separator}${h}`

  return SITE_NAME
}

/**
 * Build a Schema.org Organization graph for the homepage.
 *
 * Includes basic identity fields (name, url, logo) plus an optional
 * sameAs list of social profile URLs. This is what powers the right-rail
 * "knowledge panel" Google sometimes shows for the brand name.
 */
export function organizationSchema({
  logoUrl,
  sameAs,
  description,
}: {
  logoUrl?: string
  sameAs?: string[]
  description?: string
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(description ? { description } : {}),
    ...(sameAs && sameAs.length > 0 ? { sameAs } : {}),
  }
}

/**
 * Build a Schema.org WebSite graph. Including a `potentialAction` /
 * `SearchAction` here makes the site eligible for the sitelinks search
 * box in SERPs (Google ignores it if the URL pattern doesn't actually
 * support search — harmless either way).
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
  }
}

/**
 * Build a Schema.org Event graph from a Sanity event document.
 *
 * Only emits fields when we have real data — Google's structured-data
 * validator rejects events with empty/null required fields.
 *
 * `eventStatus` defaults to "Scheduled"; pass "Postponed" / "Cancelled"
 * if your CMS exposes status. Virtual events use the
 * `OnlineEventAttendanceMode` modifier so they're eligible for the
 * dedicated "Online" badge in event-rich-results.
 */
export function eventSchema(event: {
  title: string
  description?: string
  startDate: string
  endDate?: string
  location?: string
  isVirtual?: boolean
  registrationLink?: string
  image?: string
}) {
  const isVirtual = !!event.isVirtual
  const locationBlock = isVirtual
    ? {
        "@type": "VirtualLocation",
        url: event.registrationLink || SITE_URL,
      }
    : event.location
      ? {
          "@type": "Place",
          name: event.location,
          address: event.location,
        }
      : undefined

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    ...(event.description ? { description: event.description } : {}),
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: isVirtual
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    ...(locationBlock ? { location: locationBlock } : {}),
    ...(event.image ? { image: [event.image] } : {}),
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(event.registrationLink
      ? {
          offers: {
            "@type": "Offer",
            url: event.registrationLink,
            availability: "https://schema.org/InStock",
            validFrom: event.startDate,
            price: "0",
            priceCurrency: "USD",
          },
        }
      : {}),
  }
}
