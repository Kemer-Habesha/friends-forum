import { useEffect, useState } from 'react'
import { client, forumPageQuery } from '@/lib/sanity'

export interface ForumPageData {
  title: string
  hero: {
    title: string
    subtitle: string
    ctaButton: {
      text: string
      action: string
      targetPage?: string
    }
  }
  searchSection: {
    placeholder: string
  }
  popularDiscussions: {
    title: string
    discussions: Array<{
      title: string
      description: string
      tags: string[]
      replyCount: number
      participantCount: number
      lastActivity: string
      author: {
        name: string
        title: string
        avatar: any
      }
      featured: boolean
      category: string
      status: string
    }>
  }
  discussionCategories: {
    title: string
    subtitle: string
    categories: Array<{
      title: string
      description: string
      discussionCount: number
      action: string
      targetPage?: string
      icon: string
    }>
  }
  startDiscussion: {
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

export function useForumPage() {
  const [data, setData] = useState<ForumPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await client.fetch(forumPageQuery)
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
