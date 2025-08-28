import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './useSanityQuery'

export function useGlobalState() {
  const queryClient = useQueryClient()

  // Get cached data for a specific page
  const getCachedData = (pageKey: string) => {
    return queryClient.getQueryData([pageKey])
  }

  // Check if data exists in cache
  const hasCachedData = (pageKey: string) => {
    return queryClient.getQueryData([pageKey]) !== undefined
  }

  // Get all cached page data
  const getAllCachedData = () => {
    const allData: Record<string, any> = {}
    
    Object.values(queryKeys).forEach(key => {
      const data = queryClient.getQueryData([key])
      if (data) {
        allData[key] = data
      }
    })
    
    return allData
  }

  // Clear specific page cache
  const clearPageCache = (pageKey: string) => {
    queryClient.removeQueries({ queryKey: [pageKey] })
  }

  // Clear all page caches
  const clearAllCaches = () => {
    Object.values(queryKeys).forEach(key => {
      queryClient.removeQueries({ queryKey: [key] })
    })
  }

  // Prefetch data for a page if not already cached
  const ensurePageData = async (pageKey: string, queryFn: () => Promise<any>) => {
    if (!hasCachedData(pageKey)) {
      try {
        const data = await queryFn()
        queryClient.setQueryData([pageKey], data)
        return data
      } catch (error) {
        console.error(`Failed to ensure data for ${pageKey}:`, error)
        return null
      }
    }
    return getCachedData(pageKey)
  }

  return {
    getCachedData,
    hasCachedData,
    getAllCachedData,
    clearPageCache,
    clearAllCaches,
    ensurePageData,
  }
}
