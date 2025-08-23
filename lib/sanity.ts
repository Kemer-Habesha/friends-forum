import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false for development, true for production
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ queries for the home page - updated for new schema structure
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
