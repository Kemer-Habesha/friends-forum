import { useEffect, useState } from 'react'
import { client, homePageQuery } from '@/lib/sanity'

export interface HomePageData {
  title: string
  hero: {
    title: string
    subtitle: string
    backgroundImage: any
    primaryButton: {
      text: string
      action: string
      targetPage?: string
    }
    secondaryButton: {
      text: string
      action: string
      targetPage?: string
    }
  }
  mission: {
    title: string
    content: string
    learnMoreLink: {
      text: string
      url: string
    }
  }
  focusAreas: {
    title: string
    subtitle: string
    focusAreas: Array<{
      title: string
      description: string
      icon: string
      image: any
    }>
  }
  events: {
    title: string
    subtitle: string
    events: Array<{
      title: string
      description: string
      date: string
      location: string
      image: any
      registrationLink?: string
    }>
  }
  forum: {
    title: string
    subtitle: string
    description: string
    ctaButton: {
      text: string
      action: string
      targetPage?: string
    }
    backgroundImage: any
  }
  newsletter: {
    title: string
    subtitle: string
    description: string
    placeholderText: string
    buttonText: string
    backgroundImage: any
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: any
  }
}

export function useHomePage() {
  const [data, setData] = useState<HomePageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await client.fetch(homePageQuery)
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
