"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { urlFor } from "@/lib/sanity"
import { eventsPageQuery } from "@/lib/sanity"
import { useSanityQuery, queryKeys } from "@/hooks/useSanityQuery"
import { Skeleton } from "@/components/ui/skeleton"

// Icon mapping for objectives
const iconMap: Record<string, any> = {
  BookOpen: Calendar,
  Users,
  Droplet: MapPin,
  Lightbulb: Clock,
}



export default function EventsPage() {
  const { openSignupModal } = useAuth()
  const router = useRouter()
  const [showAllEvents, setShowAllEvents] = useState(false)
  const { data, isLoading, error } = useSanityQuery(
    queryKeys.eventsPage,
    eventsPageQuery
  )

  if (isLoading) {
    return <EventsPageSkeleton />
  }

  if (error || !data) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
        <p className="text-muted-foreground">Failed to load page content. Please try again later.</p>
      </div>
    )
  }

  // Type assertion to fix TypeScript errors
  const pageData = data as any

  const handleButtonClick = (button: any) => {
    if (button.action === 'signup') {
      openSignupModal()
    } else if (button.action === 'navigate' && button.targetPage) {
      router.push(button.targetPage)
    } else if (button.action === 'contact') {
      router.push('/contact')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start.toDateString() === end.toDateString()) {
      return formatDate(startDate)
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-muted py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-fade-in-scale delay-100" />
        <div className="container relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight transition-all duration-500 hover:text-primary hover:scale-105 animate-fade-in-up">
              {pageData.hero.title.split('').map((letter: string, index: number) => (
                <span
                  key={index}
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

      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-in-bottom delay-400">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-500 hover:text-primary hover:scale-105 animate-fade-in-left">{pageData.upcomingEvents.title}</h2>
            {pageData.upcomingEvents?.events && pageData.upcomingEvents.events.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Showing {showAllEvents ? pageData.upcomingEvents.events.length : Math.min(9, pageData.upcomingEvents.events.length)} of {pageData.upcomingEvents.events.length} events
              </div>
            )}
          </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(showAllEvents 
                ? pageData.upcomingEvents?.events 
                : pageData.upcomingEvents?.events?.slice(0, 9)
              )?.map((event: any, index: number) => (
                <div key={index} className={`group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-500 hover:scale-110 hover:rotate-1 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-2 animate-bounce-in delay-${600 + (index * 150)}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <Calendar className="h-5 w-5 text-primary transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:text-primary" />
                      <span className="text-sm font-medium transition-all duration-500 group-hover:text-primary group-hover:font-bold">
                        {formatDateRange(event.startDate, event.endDate)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 transition-all duration-500 group-hover:text-primary group-hover:scale-105">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 transition-all duration-500 group-hover:text-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                        <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12" />
                        <span>{event.startTime} - {event.endTime} {event.timeZone}</span>
                      </div>
                    </div>
                    {event.registrationRequired && (
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          className="w-full transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-primary/25 hover:bg-primary hover:text-primary-foreground transform" 
                          onClick={() => event.registrationLink ? window.open(event.registrationLink, '_blank') : openSignupModal()}
                        >
                          Register Now
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          {(!pageData.upcomingEvents?.events || pageData.upcomingEvents.events.length === 0) && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground">
                Check back soon for new events and meetings.
              </p>
            </div>
          )}

          {pageData.upcomingEvents?.events && pageData.upcomingEvents.events.length >= 10 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  if (showAllEvents) {
                    setShowAllEvents(false)
                  } else {
                    setShowAllEvents(true)
                  }
                }}
                className="transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                {showAllEvents ? 'Show Less Events' : 'Load More Events'}
              </Button>
            </div>
          )}
        </div>
      </section>

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
              <div key={index} className={`group bg-background rounded-lg overflow-hidden transition-all duration-700 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-4 animate-fade-in-${index % 2 === 0 ? 'left' : 'right'} delay-${1200 + (index * 200)}`}>
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
                <div className="p-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 transition-all duration-500 group-hover:text-foreground">
                      <Calendar className="h-4 w-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                      <span>{formatDateRange(event.startDate, event.endDate)}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 transition-all duration-500 group-hover:text-primary group-hover:scale-105">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                      {event.description}
                    </p>
                    <div className="flex gap-2">
                      {event.summaryLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-primary/25"
                          onClick={() => window.open(event.summaryLink, '_blank')}
                        >
                          View Summary
                        </Button>
                      )}
                      {event.materialsLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="transition-all duration-500 hover:scale-110 hover:-rotate-3 hover:shadow-lg hover:shadow-secondary/25"
                          onClick={() => window.open(event.materialsLink, '_blank')}
                        >
                          Download Materials
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
          {pageData.pastEvents?.events && pageData.pastEvents.events.length >= 10 && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  // In a real app, this would navigate to past events page
                  alert("Viewing all past events...")
                }}
              >
                View All Past Events
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="container py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 animate-fade-in-scale delay-1600" />
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center relative z-10">
          <div className="space-y-4 animate-slide-in-bottom delay-1600">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-700 hover:text-primary hover:scale-110 hover:rotate-1">{pageData.hostEvent.title}</h2>
            <p className="text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-105">
              {pageData.hostEvent.description}
            </p>
            <div className="pt-4">
              <Button className="transition-all duration-700 hover:scale-125 hover:rotate-3 hover:shadow-2xl hover:shadow-primary/30 animate-bounce-in delay-1800" onClick={() => handleButtonClick(pageData.hostEvent.ctaButton)}>
                {pageData.hostEvent.ctaButton.text}
              </Button>
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

function EventsPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-12 w-80 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      </section>

      {/* Upcoming Events Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-background rounded-lg border p-6">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-16 w-full mb-4" />
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>

      {/* Past Events Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-background rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </section>

      {/* Host Event Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </section>
    </div>
  )
}

