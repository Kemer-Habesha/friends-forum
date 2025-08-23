import { useEffect, useState } from 'react'
import { client, resourcesPageQuery } from '@/lib/sanity'

export interface ResourcesPageData {
  title: string
  hero: {
    title: string
    subtitle: string
  }
  searchSection: {
    placeholder: string
  }
  featuredResources: {
    title: string
    resources: Array<{
      title: string
      description: string
      type: string
      authors: string[]
      publicationDate: string
      tags: string[]
      readLink?: string
      downloadLink?: string
      fileSize?: string
      fileFormat?: string
      featured: boolean
      thumbnail: any
    }>
  }
  resourceCategories: {
    title: string
    subtitle: string
    categories: Array<{
      title: string
      description: string
      icon: string
      buttonText: string
      resourceCount: number
      action: string
      targetPage?: string
    }>
  }
  submitResource: {
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

export function useResourcesPage() {
  const [data, setData] = useState<ResourcesPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await client.fetch(resourcesPageQuery)
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
