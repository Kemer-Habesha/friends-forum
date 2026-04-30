import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { urlFor, sanityFetch, eventsPageQuery } from "@/lib/sanity"
import UpcomingEvents from "@/components/ui/upcoming-events"
import ActionButton from "@/components/ui/action-button"
import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { buildTitle, eventSchema, SITE_URL } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>(eventsPageQuery)

  const ogImage = data?.seo?.ogImage
    ? urlFor(data.seo.ogImage).width(1200).height(630).url()
    : undefined

  const title = buildTitle(
    data?.seo?.metaTitle,
    data?.hero?.title || "Events & Meetings"
  )
  const description =
    data?.seo?.metaDescription ||
    "Upcoming and past events from FRIENDS Forum: webinars, conferences, and dialogues focused on the Nile Basin and beyond."

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/events" },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/events`,
      type: "website",
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (start.toDateString() === end.toDateString()) return formatDate(startDate)
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

export default async function EventsPage() {
  const pageData = await sanityFetch<any>(eventsPageQuery)

  if (!pageData) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
        <p className="text-muted-foreground">Failed to load page content. Please try again later.</p>
      </div>
    )
  }

  /*
   * Emit a Schema.org Event graph for each upcoming event so Google can
   * surface them in the rich Events carousel. We only include events that
   * have at least a title and start date — the validator rejects partial
   * records.
   */
  const upcomingEventSchemas = (pageData.upcomingEvents?.events || [])
    .filter((e: any) => e?.title && e?.startDate)
    .map((e: any) =>
      eventSchema({
        title: e.title,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate,
        location: e.location,
        isVirtual: e.isVirtual,
        registrationLink: e.registrationLink,
        image: e.image ? urlFor(e.image).width(1200).height(630).url() : undefined,
      })
    )

  return (
    <>
      {upcomingEventSchemas.length > 0 ? (
        <JsonLd id="ld-events" schema={upcomingEventSchemas} />
      ) : null}

      {/* Hero Section */}
      <section className="bg-muted py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-fade-in-scale delay-100" />
        <div className="container relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            {/*
              Per-letter <span>s drive the staggered bounce-in. Screen readers
              and search crawlers should see the title as a single string —
              aria-label provides that, and aria-hidden on each letter prevents
              double-announcement.
            */}
            <h1
              aria-label={pageData.hero.title}
              className="text-4xl font-bold tracking-tight transition-all duration-500 hover:text-primary hover:scale-105 animate-fade-in-up"
            >
              {pageData.hero.title.split('').map((letter: string, index: number) => (
                <span
                  key={index}
                  aria-hidden="true"
                  className="inline-block transition-all duration-300 hover:scale-125 hover:rotate-12 hover:text-primary animate-bounce-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </h1>
            <p className="text-xl text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-105 animate-fade-in-up delay-300">
              {pageData.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events - Client component for show more/less + registration */}
      <section className="container py-12 md:py-24">
        <UpcomingEvents
          title={pageData.upcomingEvents.title}
          events={pageData.upcomingEvents?.events}
        />
      </section>

      {/* Past Events Section */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in-scale delay-1000">
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-500 hover:text-primary hover:scale-110 animate-slide-in-bottom">{pageData.pastEvents.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto transition-all duration-500 hover:text-foreground hover:scale-105 animate-fade-in-up delay-200">
              {pageData.pastEvents.subtitle}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {pageData.pastEvents?.events?.map((event: any, index: number) => (
              <div
                key={index}
                className={`group bg-background rounded-lg overflow-hidden transition-all duration-700 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-4 animate-fade-in-${index % 2 === 0 ? "left" : "right"} delay-${1200 + index * 200}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
                  {event.image ? (
                    <Image
                      src={urlFor(event.image).url()}
                      alt={event.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
                    />
                  ) : (
                    <Image
                      src="/placeholder.svg"
                      alt={event.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
                    />
                  )}
                </div>
                <div className="p-6 relative flex flex-col h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 transition-all duration-500 group-hover:text-foreground">
                      <Calendar className="h-4 w-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                      <span>{formatDateRange(event.startDate, event.endDate)}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 transition-all duration-500 group-hover:text-primary group-hover:scale-105">
                      {event.title}
                    </h3>
                    <p
                      className="text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground line-clamp-3 group-hover:line-clamp-none cursor-default"
                    >
                      {event.description}
                    </p>
                    <div className="mt-auto flex gap-2">
                      {event.summaryLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-primary/25"
                          asChild
                        >
                          <a href={event.summaryLink} target="_blank" rel="noopener noreferrer">
                            View Summary
                          </a>
                        </Button>
                      )}
                      {event.materialsLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="transition-all duration-500 hover:scale-110 hover:-rotate-3 hover:shadow-lg hover:shadow-secondary/25"
                          asChild
                        >
                          <a href={event.materialsLink} target="_blank" rel="noopener noreferrer">
                            Download Materials
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {(!pageData.pastEvents?.events || pageData.pastEvents.events.length === 0) && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No Past Events</h3>
              <p className="text-muted-foreground">
                Past events will appear here once they are completed.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Host Event Section */}
      <section className="container py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 animate-fade-in-scale delay-1600" />
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center relative z-10">
          <div className="space-y-4 animate-slide-in-bottom delay-1600">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-700 hover:text-primary hover:scale-110 hover:rotate-1">{pageData.hostEvent.title}</h2>
            <p className="text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-105">
              {pageData.hostEvent.description}
            </p>
            <div className="pt-4">
              <ActionButton
                text={pageData.hostEvent.ctaButton.text}
                action={pageData.hostEvent.ctaButton.action}
                targetPage={pageData.hostEvent.ctaButton.targetPage}
                className="transition-all duration-700 hover:scale-125 hover:rotate-3 hover:shadow-2xl hover:shadow-primary/30 animate-bounce-in delay-1800"
              />
            </div>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden transition-all duration-700 hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:shadow-primary/25 animate-fade-in-scale delay-1600 group">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
            {pageData.hostEvent.image ? (
              <Image
                src={urlFor(pageData.hostEvent.image).url()}
                alt="Event Collaboration"
                fill
                className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3"
              />
            ) : (
              <Image
                src="/placeholder.svg"
                alt="Event Collaboration"
                fill
                className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3"
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
