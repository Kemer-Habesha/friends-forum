import { enhancedCachedClient } from './sanity'
import { 
  homePageQuery, 
  aboutPageQuery, 
  eventsPageQuery, 
  forumPageQuery, 
  resourcesPageQuery, 
  contactPageQuery,
  siteSettingsQuery
} from './sanity'

// Prefetch data for all pages to improve navigation performance
export async function prefetchAllPages() {
  try {
    const queries = [
      { key: 'homePage', query: homePageQuery },
      { key: 'aboutPage', query: aboutPageQuery },
      { key: 'eventsPage', query: eventsPageQuery },
      { key: 'forumPage', query: forumPageQuery },
      { key: 'resourcesPage', query: resourcesPageQuery },
      { key: 'contactPage', query: contactPageQuery },
    ]

    // Fetch all data in parallel
    const promises = queries.map(async ({ key, query }) => {
      try {
        return await enhancedCachedClient.fetch(query)
      } catch (error) {
        console.warn(`Failed to prefetch ${key}:`, error)
        return null
      }
    })

    await Promise.allSettled(promises)
    console.log('All pages prefetched successfully')
  } catch (error) {
    console.error('Failed to prefetch pages:', error)
  }
}

// Prefetch specific page data
export async function prefetchPage(pageKey: string) {
  try {
    let query: string
    
    switch (pageKey) {
      case 'homePage':
        query = homePageQuery
        break
      case 'aboutPage':
        query = aboutPageQuery
        break
      case 'eventsPage':
        query = eventsPageQuery
        break
      case 'forumPage':
        query = forumPageQuery
        break
      case 'resourcesPage':
        query = resourcesPageQuery
        break
      case 'contactPage':
        query = contactPageQuery
        break
      case 'siteSettings':
        query = siteSettingsQuery
        break
      default:
        console.warn(`Unknown page key: ${pageKey}`)
        return
    }

    await enhancedCachedClient.fetch(query)
    console.log(`${pageKey} prefetched successfully`)
  } catch (error) {
    console.error(`Failed to prefetch ${pageKey}:`, error)
  }
}
