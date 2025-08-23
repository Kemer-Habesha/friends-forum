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
