"use client"

import { useSanityQuery, queryKeys } from './useSanityQuery'
import { siteSettingsQuery } from '@/lib/sanity'

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
  return useSanityQuery<SiteSettingsData>(
    queryKeys.siteSettings,
    siteSettingsQuery,
    undefined,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes - site settings don't change often
      gcTime: 30 * 60 * 1000, // 30 minutes
    }
  )
}
