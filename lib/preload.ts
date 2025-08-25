import { cachedClient } from './sanity'

// Preload critical data for better performance
export async function preloadHomePageData() {
  try {
    // Preload home page data
    const homePageData = await cachedClient.fetch(`*[_type == "homePage"][0] {
      title,
      hero {
        title,
        subtitle,
        backgroundImage
      }
    }`)
    
    return homePageData
  } catch (error) {
    console.error('Failed to preload home page data:', error)
    return null
  }
}

// Preload about page data
export async function preloadAboutPageData() {
  try {
    // Preload about page data
    const aboutPageData = await cachedClient.fetch(`*[_type == "aboutPage"][0] {
      title,
      hero {
        title,
        subtitle,
        image
      }
    }`)
    
    return aboutPageData
  } catch (error) {
    console.error('Failed to preload about page data:', error)
    return null
  }
}

// Preload events page data
export async function preloadEventsPageData() {
  try {
    // Preload events page data
    const eventsPageData = await cachedClient.fetch(`*[_type == "eventsPage"][0] {
      title,
      hero {
        title,
        subtitle
      },
      upcomingEvents {
        title,
        events[] {
          title,
          startDate,
          endDate
        }
      }
    }`)
    
    return eventsPageData
  } catch (error) {
    console.error('Failed to preload events page data:', error)
    return null
  }
}

// Preload forum page data
export async function preloadForumPageData() {
  try {
    // Preload forum page data
    const forumPageData = await cachedClient.fetch(`*[_type == "forumPage"][0] {
      title,
      hero {
        title,
        subtitle
      },
      popularDiscussions {
        title,
        discussions[] {
          title,
          replyCount,
          participantCount
        }
      }
    }`)
    
    return forumPageData
  } catch (error) {
    console.error('Failed to preload forum page data:', error)
    return null
  }
}

// Preload resources page data
export async function preloadResourcesPageData() {
  try {
    // Preload resources page data
    const resourcesPageData = await cachedClient.fetch(`*[_type == "resourcesPage"][0] {
      title,
      hero {
        title,
        subtitle
      },
      featuredResources {
        title,
        resources[] {
          title,
          type,
          description
        }
      }
    }`)
    
    return resourcesPageData
  } catch (error) {
    console.error('Failed to preload resources page data:', error)
    return null
  }
}

// Preload contact page data
export async function preloadContactPageData() {
  try {
    // Preload contact page data
    const contactPageData = await cachedClient.fetch(`*[_type == "contactPage"][0] {
      title,
      hero {
        title,
        subtitle
      },
      contactForm {
        title,
        description
      },
      contactInformation {
        title,
        description
      }
    }`)
    
    return contactPageData
  } catch (error) {
    console.error('Failed to preload contact page data:', error)
    return null
  }
}

// Preload navigation data
export async function preloadNavigationData() {
  try {
    const navigationData = await cachedClient.fetch(`*[_type in ["homePage", "aboutPage", "eventsPage", "forumPage", "resourcesPage", "contactPage"]] {
      _type,
      title,
      "slug": _type == "homePage" ? "/" : "/" + _type.replace("Page", "").toLowerCase()
    }`)
    
    return navigationData
  } catch (error) {
    console.error('Failed to preload navigation data:', error)
    return null
  }
}

// Preload critical images
export async function preloadCriticalImages() {
  try {
    const criticalImages = await cachedClient.fetch(`*[_type == "homePage"][0] {
      hero.backgroundImage,
      forum.backgroundImage
    }`)
    
    return criticalImages
  } catch (error) {
    console.error('Failed to preload critical images:', error)
    return null
  }
}
