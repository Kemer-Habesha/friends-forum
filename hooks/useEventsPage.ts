import { useEffect, useState } from 'react'
import { client, eventsPageQuery } from '@/lib/sanity'

export interface EventsPageData {
  title: string
  hero: {
    title: string
    subtitle: string
  }
  upcomingEvents: {
    title: string
    events: Array<{
      title: string
      description: string
      startDate: string
      endDate: string
      location: string
      isVirtual: boolean
      timeZone: string
      startTime: string
      endTime: string
      registrationRequired: boolean
      registrationLink?: string
      image: any
      featured: boolean
    }>
  }
  pastEvents: {
    title: string
    subtitle: string
    events: Array<{
      title: string
      description: string
      startDate: string
      endDate: string
      image: any
      summaryLink?: string
      materialsLink?: string
      highlights: string[]
    }>
  }
  hostEvent: {
    title: string
    description: string
    ctaButton: {
      text: string
      action: string
      targetPage?: string
    }
    image: any
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: any
  }
}

export function useEventsPage() {
  const [data, setData] = useState<EventsPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await client.fetch(eventsPageQuery)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
