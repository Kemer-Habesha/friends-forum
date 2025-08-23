import { useEffect, useState } from 'react'
import { client, aboutPageQuery } from '@/lib/sanity'

export interface AboutPageData {
  title: string
  hero: {
    title: string
    subtitle: string
    image: any
  }
  history: {
    title: string
    content: string[]
  }
  objectives: {
    title: string
    objectives: Array<{
      title: string
      description: string
      icon: string
    }>
  }
  principles: {
    title: string
    principles: Array<{
      title: string
      description: string
    }>
  }
  team: {
    title: string
    subtitle: string
    members: Array<{
      name: string
      position: string
      bio: string
      image: any
    }>
  }
  cta: {
    title: string
    description: string
    primaryButton: {
      text: string
      action: string
    }
    secondaryButton: {
      text: string
      action: string
      targetPage?: string
    }
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: any
  }
}

export function useAboutPage() {
  const [data, setData] = useState<AboutPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await client.fetch(aboutPageQuery)
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
