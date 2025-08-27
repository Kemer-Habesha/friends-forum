import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { apiVersion, dataset, projectId } from '@/sanity/env'

// Cache configuration
const CACHE_TIME = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>()

// Cache utility functions
function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

// Clear expired cache entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TIME) {
      cache.delete(key)
    }
  }
}, CACHE_TIME)

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Enable CDN in production for better performance
})

// Cached client for better performance
export const cachedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // Always use CDN for cached queries
  perspective: 'published',
})

// Enhanced cached client with memory caching
export const enhancedCachedClient = {
  ...cachedClient,
  async fetch<T>(query: string, params?: any): Promise<T> {
    const cacheKey = `${query}-${JSON.stringify(params || {})}`
    
    // Check memory cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }
    
    // Fetch from Sanity if not cached
    const data = await cachedClient.fetch<T>(query, params)
    
    // Store in cache
    setCachedData(cacheKey, data)
    
    return data
  }
}

const builder = imageUrlBuilder(cachedClient)

export function urlFor(source: any) {
  return builder.image(source)
}

// Optimized GROQ queries with specific field selection
export const homePageQuery = `*[_type == "homePage"][0] {
  title,
  hero {
    title,
    subtitle,
    backgroundImage,
    primaryButton,
    secondaryButton
  },
  mission {
    title,
    content,
    learnMoreLink
  },
  focusAreas {
    title,
    subtitle,
    focusAreas[] {
      title,
      description,
      icon,
      image
    }
  },
  events {
    title,
    subtitle,
    events[] {
      title,
      description,
      date,
      location,
      image,
      registrationLink
    }
  },
  forum {
    title,
    subtitle,
    description,
    ctaButton,
    backgroundImage
  },
  newsletter {
    title,
    subtitle,
    description,
    placeholderText,
    buttonText,
    backgroundImage
  },
  seo
}`

// GROQ query for the About page
export const aboutPageQuery = `*[_type == "aboutPage"][0] {
  title,
  hero {
    title,
    subtitle,
    image
  },
  history {
    title,
    content
  },
  objectives {
    title,
    objectives[] {
      title,
      description,
      icon
    }
  },
  principles {
    title,
    principles[] {
      title,
      description
    }
  },
  team {
    title,
    subtitle,
    members[] {
      name,
      position,
      bio,
      image
    }
  },
  cta {
    title,
    description,
    primaryButton,
    secondaryButton
  },
  seo
}`

// GROQ query for the Events page
export const eventsPageQuery = `*[_type == "eventsPage"][0] {
  title,
  hero {
    title,
    subtitle
  },
  upcomingEvents {
    title,
    events[] {
      title,
      description,
      startDate,
      endDate,
      location,
      isVirtual,
      timeZone,
      startTime,
      endTime,
      registrationRequired,
      registrationLink,
      image,
      featured
    }
  },
  pastEvents {
    title,
    subtitle,
    events[] {
      title,
      description,
      startDate,
      endDate,
      image,
      summaryLink,
      materialsLink,
      highlights
    }
  },
  hostEvent {
    title,
    description,
    ctaButton,
    image
  },
  seo
}`

// GROQ query for the Resources page
export const resourcesPageQuery = `*[_type == "resourcesPage"][0] {
  title,
  hero {
    title,
    subtitle
  },
  searchSection {
    placeholder
  },
  featuredResources {
    title,
    resources[] {
      title,
      description,
      type,
      authors,
      publicationDate,
      tags,
      readLink,
      downloadLink,
      fileSize,
      fileFormat,
      featured,
      thumbnail
    }
  },
  resourceCategories {
    title,
    subtitle,
    categories[] {
      title,
      description,
      icon,
      buttonText,
      resourceCount,
      action,
      targetPage
    }
  },
  submitResource {
    title,
    description,
    ctaButton,
    image
  },
  seo
}`

// GROQ query for the Forum page
export const forumPageQuery = `*[_type == "forumPage"][0] {
  title,
  hero {
    title,
    subtitle,
    ctaButton
  },
  searchSection {
    placeholder
  },
  popularDiscussions {
    title,
    discussions[] {
      title,
      description,
      tags,
      replyCount,
      participantCount,
      lastActivity,
      author {
        name,
        title,
        avatar
      },
      featured,
      category,
      status
    }
  },
  discussionCategories {
    title,
    subtitle,
    categories[] {
      title,
      description,
      discussionCount,
      action,
      targetPage,
      icon
    }
  },
  startDiscussion {
    title,
    description,
    ctaButton,
    image
  },
  seo
}`

// GROQ query for the Contact page
export const contactPageQuery = `*[_type == "contactPage"][0] {
  title,
  hero {
    title,
    subtitle
  },
  contactForm {
    title,
    description,
    successMessage {
      title,
      description
    },
    formFields {
      firstName {
        label,
        placeholder,
        required
      },
      lastName {
        label,
        placeholder,
        required
      },
      email {
        label,
        placeholder,
        required
      },
      subject {
        label,
        placeholder,
        required
      },
      message {
        label,
        placeholder,
        required,
        minHeight
      }
    },
    submitButton {
      text,
      loadingText
    }
  },
  contactInformation {
    title,
    description,
    contactMethods[] {
      type,
      icon,
      title,
      details,
      link
    },
    mapImage
  },
  faq {
    title,
    subtitle,
    questions[] {
      question,
      answer,
      category,
      featured
    }
  },
  seo
}`

export const eventsQuery = `*[_type == "homePage"][0].events.events[] {
  title,
  description,
  date,
  location,
  image,
  registrationLink
}`

export const focusAreasQuery = `*[_type == "homePage"][0].focusAreas.focusAreas[] {
  title,
  description,
  icon,
  image
}`
