"use client"

import { useState, useEffect } from 'react'
import { siteSettingsQuery, enhancedCachedClient } from '@/lib/sanity'

export interface SiteSettingsData {
  title: string
  logo: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  navigation: {
    menuItems: Array<{
      label: string
      link: string
      order: number
    }>
  }
  footer: {
    description: string
    quickLinks: {
      title: string
      links: Array<{
        label: string
        link: string
      }>
    }
    contactInfo: {
      title: string
      email: string
      phone: string
      address: string
    }
    socialMedia: {
      title: string
      platforms: Array<{
        platform: string
        url: string
        enabled: boolean
      }>
    }
    copyright: string
  }
  ctaButtons: {
    signInButton: {
      text: string
      variant: string
    }
    joinUsButton: {
      text: string
      variant: string
    }
  }
}

export function useSiteSettings() {
  const [data, setData] = useState<SiteSettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSiteSettings() {
      try {
        setLoading(true)
        setError(null)
        
        const result = await enhancedCachedClient.fetch<SiteSettingsData>(siteSettingsQuery)
        
        if (result) {
          // Sort menu items by order
          if (result.navigation?.menuItems) {
            result.navigation.menuItems.sort((a, b) => a.order - b.order)
          }
          
          setData(result)
        } else {
          setError('No site settings found')
        }
      } catch (err) {
        console.error('Error fetching site settings:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch site settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSiteSettings()
  }, [])

  return { data, loading, error }
}
