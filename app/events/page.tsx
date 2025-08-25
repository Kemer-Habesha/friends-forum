"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { urlFor } from "@/lib/sanity"
import { enhancedCachedClient, eventsPageQuery } from "@/lib/sanity"
import { useEffect } from "react"
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
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [filterMyEvents, setFilterMyEvents] = useState(false)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await enhancedCachedClient.fetch(eventsPageQuery)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
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
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">{data.hero.title}</h1>
            <p className="text-xl text-muted-foreground">
              {data.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.upcomingEvents.title}</h2>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar View
              </Button>
              <Button
                variant={filterMyEvents ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMyEvents(!filterMyEvents)}
              >
                <Users className="h-4 w-4 mr-2" />
                My Events
              </Button>
            </div>
          </div>

          {viewMode === "calendar" ? (
            <div className="bg-background rounded-lg border p-6">
              <div className="text-center p-8">
                <Calendar className="h-16 w-16 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Calendar View Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  We're working on a calendar view to help you better plan your participation in our events.
                </p>
                <Button onClick={() => setViewMode("list")}>Return to List View</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.upcomingEvents?.events?.map((event: any, index: number) => (
                <div key={index} className="group relative overflow-hidden rounded-lg border bg-background p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">
                      {formatDateRange(event.startDate, event.endDate)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.startTime} - {event.endTime} {event.timeZone}</span>
                    </div>
                  </div>
                  {event.registrationRequired && (
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => event.registrationLink ? window.open(event.registrationLink, '_blank') : openSignupModal()}
                      >
                        Register Now
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {(!data.upcomingEvents?.events || data.upcomingEvents.events.length === 0) && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground">
                Check back soon for new events and meetings.
              </p>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                // In a real app, this would load more events
                alert("Loading more events...")
              }}
            >
              Load More Events
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{data.pastEvents.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {data.pastEvents.subtitle}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {data.pastEvents?.events?.map((event: any, index: number) => (
              <div key={index} className="bg-background rounded-lg overflow-hidden">
                <div className="relative h-48">
                  {event.image ? (
                    <Image
                      src={urlFor(event.image).url()}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/placeholder.svg"
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateRange(event.startDate, event.endDate)}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {event.description}
                  </p>
                  <div className="flex gap-2">
                    {event.summaryLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(event.summaryLink, '_blank')}
                      >
                        View Summary
                      </Button>
                    )}
                    {event.materialsLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(event.materialsLink, '_blank')}
                      >
                        Download Materials
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {(!data.pastEvents?.events || data.pastEvents.events.length === 0) && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No Past Events</h3>
              <p className="text-muted-foreground">
                Past events will appear here once they are completed.
              </p>
            </div>
          )}
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
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.hostEvent.title}</h2>
            <p className="text-muted-foreground">
              {data.hostEvent.description}
            </p>
            <div className="pt-4">
              <Button onClick={() => handleButtonClick(data.hostEvent.ctaButton)}>
                {data.hostEvent.ctaButton.text}
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            {data.hostEvent.image ? (
              <Image
                src={urlFor(data.hostEvent.image).url()}
                alt="Event Collaboration"
                fill
                className="object-cover"
              />
            ) : (
              <Image
                src="/placeholder.svg"
                alt="Event Collaboration"
                fill
                className="object-cover"
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
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
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

