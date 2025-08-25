import { useEffect, useState } from 'react'
import { client, contactPageQuery } from '@/lib/sanity'

export interface ContactPageData {
  title: string
  hero: {
    title: string
    subtitle: string
  }
  contactForm: {
    title: string
    description: string
    successMessage: {
      title: string
      description: string
    }
    formFields: {
      firstName: {
        label: string
        placeholder: string
        required: boolean
      }
      lastName: {
        label: string
        placeholder: string
        required: boolean
      }
      email: {
        label: string
        placeholder: string
        required: boolean
      }
      subject: {
        label: string
        placeholder: string
        required: boolean
      }
      message: {
        label: string
        placeholder: string
        required: boolean
        minHeight: string
      }
    }
    submitButton: {
      text: string
      loadingText: string
    }
  }
  contactInformation: {
    title: string
    description: string
    contactMethods: Array<{
      type: string
      icon: string
      title: string
      details: string[]
      link?: string
    }>
    mapImage: any
  }
  faq: {
    title: string
    subtitle: string
    questions: Array<{
      question: string
      answer: string
      category: string
      featured: boolean
    }>
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: any
  }
}

export function useContactPage() {
  const [data, setData] = useState<ContactPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await client.fetch(contactPageQuery)
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
