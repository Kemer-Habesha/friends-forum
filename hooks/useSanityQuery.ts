import { useQuery } from '@tanstack/react-query'
import { enhancedCachedClient } from '@/lib/sanity'

export function useSanityQuery<T>(
  queryKey: string,
  query: string,
  params?: any,
  options?: {
    enabled?: boolean
    staleTime?: number
    gcTime?: number
  }
) {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      return await enhancedCachedClient.fetch<T>(query, params)
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled ?? true,
  })
}

// Predefined query keys for better cache management
export const queryKeys = {
  homePage: 'homePage',
  aboutPage: 'aboutPage',
  eventsPage: 'eventsPage',
  forumPage: 'forumPage',
  resourcesPage: 'resourcesPage',
  contactPage: 'contactPage',
  siteSettings: 'siteSettings',
} as const
