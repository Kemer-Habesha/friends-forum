"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ArrowRight } from "lucide-react"

interface HomeEvent {
  title: string
  description: string
  date: string
  location?: string
  registrationLink?: string
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function HomeEvents({
  events,
}: {
  events: HomeEvent[] | undefined
}) {
  const [showAll, setShowAll] = useState(false)

  if (!events || events.length === 0) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-muted-foreground">No events available at the moment.</p>
      </div>
    )
  }

  const visibleEvents = showAll ? events : events.slice(0, 9)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleEvents.map((event, index) => (
          <div key={index} className="h-full">
            <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-background p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50">
              <div className="flex items-center gap-4 mb-4">
                <Calendar className="h-5 w-5 text-primary transition-all duration-300 group-hover:scale-110" />
                <span className="text-sm font-medium transition-all duration-300 group-hover:text-primary">
                  {formatDate(event.date)}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 transition-all duration-300 group-hover:text-primary">
                {event.title}
              </h3>
              <p
                className="text-sm text-muted-foreground mb-4 transition-all duration-300 group-hover:text-foreground line-clamp-3 group-hover:line-clamp-none cursor-default"
              >
                {event.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                <MapPin className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                <span>{event.location || "Location TBD"}</span>
              </div>
              <div className="mt-4 flex-1" />
              {event.registrationLink && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full transition-all duration-300 hover:scale-105 hover:shadow-md"
                    asChild
                  >
                    <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                      Register Now
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {events.length > 9 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less Events" : "Load More Events"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  )
}

