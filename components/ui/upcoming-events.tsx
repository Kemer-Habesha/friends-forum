"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Event {
  title: string
  description: string
  startDate: string
  endDate: string
  location?: string
  isVirtual?: boolean
  startTime?: string
  endTime?: string
  timeZone?: string
  registrationRequired?: boolean
  registrationLink?: string
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

export default function UpcomingEvents({
  title,
  events,
}: {
  title: string
  events: Event[] | undefined
}) {
  const [showAll, setShowAll] = useState(false)
  const { openSignupModal } = useAuth()

  const visibleEvents = showAll ? events : events?.slice(0, 9)

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-in-bottom delay-400">
        <h2 className="text-3xl font-bold tracking-tight transition-all duration-500 hover:text-primary hover:scale-105 animate-fade-in-left">
          {title}
        </h2>
        {events && events.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {showAll ? events.length : Math.min(9, events.length)} of{" "}
            {events.length} events
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleEvents?.map((event, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-500 hover:scale-110 hover:rotate-1 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-2 animate-bounce-in delay-${600 + index * 150}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <Calendar className="h-5 w-5 text-primary transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:text-primary" />
                <span className="text-sm font-medium transition-all duration-500 group-hover:text-primary group-hover:font-bold">
                  {formatDateRange(event.startDate, event.endDate)}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 transition-all duration-500 group-hover:text-primary group-hover:scale-105">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                {event.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 transition-all duration-500 group-hover:text-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                  <span>
                    {event.isVirtual ? "Virtual Event" : event.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12" />
                  <span>
                    {event.startTime} - {event.endTime} {event.timeZone}
                  </span>
                </div>
              </div>
              {event.registrationRequired && (
                <div className="mt-4">
                  {event.registrationLink ? (
                    <Button
                      variant="outline"
                      className="w-full transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-primary/25 hover:bg-primary hover:text-primary-foreground transform"
                      asChild
                    >
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Register Now
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-primary/25 hover:bg-primary hover:text-primary-foreground transform"
                      onClick={() => openSignupModal()}
                    >
                      Register Now
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(!events || events.length === 0) && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold mb-2">No Upcoming Events</h3>
          <p className="text-muted-foreground">
            Check back soon for new events and meetings.
          </p>
        </div>
      )}

      {events && events.length >= 10 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            {showAll ? "Show Less Events" : "Load More Events"}
          </Button>
        </div>
      )}
    </div>
  )
}
