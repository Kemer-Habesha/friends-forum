"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, BookOpen, ArrowRight } from "lucide-react"
import NewsletterForm from "@/components/ui/newsletter-form"
import { urlFor } from "@/lib/sanity"
import { homePageQuery } from "@/lib/sanity"
import { useSanityQuery, queryKeys } from "@/hooks/useSanityQuery"
import { Skeleton } from "@/components/ui/skeleton"


// Icon mapping for focus areas
const iconMap: Record<string, any> = {
  BookOpen,
  Users,
  MapPin,
}

export default function Home() {
  const { data, isLoading, error } = useSanityQuery(
    queryKeys.homePage,
    homePageQuery
  )

  if (isLoading) {
    return <HomePageSkeleton />
  }

  if (error || !data) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
        <p className="text-muted-foreground">Failed to load page content. Please try again later.</p>
      </div>
    )
  }

  // Type assertion to fix TypeScript errors
  const pageData = data as any

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <>
      {/* Hero Section - Immediate animations on page load */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/20 z-10 animate-fade-in-up" />
        <div className="relative h-[500px] w-full animate-fade-in-scale delay-200">
          <Image
            src={urlFor(pageData.hero.backgroundImage).url()}
            alt={pageData.hero.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-md animate-fade-in-up delay-300">
                {pageData.hero.title.split('').map((letter: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block transition-all duration-300 hover:scale-110 hover:rotate-3 hover:text-transparent hover:bg-clip-text letter-hover"
                    style={{
                      '--hover-bg': `linear-gradient(45deg, hsl(${35 + index * 15}, 60%, ${50 + index * 5}%), hsl(${35 + index * 15 + 20}, 70%, ${60 + index * 5}%))`,
                    } as React.CSSProperties}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </h1>
              <p className="text-xl text-white/90 drop-shadow transition-all duration-300 animate-fade-in-up delay-400">
                {pageData.hero.subtitle}
              </p>
              <div className="flex justify-start pt-4 animate-fade-in-up delay-500">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto transition-all duration-300 hover:scale-110 hover:shadow-lg" 
                  asChild
                >
                  <Link href={pageData.hero.primaryButton.action === 'signup' ? '#signup' : pageData.hero.primaryButton.targetPage || '/'}>
                    {pageData.hero.primaryButton.text}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Focus Section - Scroll triggered */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-300 hover:text-primary">{pageData.mission?.title || 'Our Mission'}</h2>
            <p className="text-muted-foreground transition-all duration-300 hover:text-foreground">
              {pageData.mission?.content || 'Mission content loading...'}
            </p>
            {pageData.mission?.learnMoreLink && (
              <div className="flex items-center gap-4 pt-4">
                <Link href={pageData.mission.learnMoreLink.url} className="inline-flex items-center gap-2 text-primary hover:underline transition-all duration-300 hover:scale-105 hover:text-primary/80">
                  {pageData.mission.learnMoreLink.text} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-300 hover:text-primary">{pageData.focusAreas?.title || 'Our Focus'}</h2>
            <p className="text-muted-foreground transition-all duration-300 hover:text-foreground">{pageData.focusAreas?.subtitle || 'Focus areas description...'}</p>
            <ul className="grid gap-4">
              {pageData.focusAreas?.focusAreas?.map((area: any, index: number) => {
                const IconComponent = iconMap[area.icon]
                return (
                  <li key={index} className="flex items-start gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-muted/50 hover:scale-105">
                    <div className="rounded-full bg-primary/10 p-2 text-primary transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold transition-all duration-300 hover:text-primary">{area.title}</h3>
                      <p className="text-sm text-muted-foreground transition-all duration-300 hover:text-foreground">
                        {area.description}
                      </p>
                    </div>
                  </li>
                )
              }) || (
                <li className="text-muted-foreground">No focus areas available</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Events Section - Scroll triggered */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-primary">{pageData.events?.title || 'Upcoming Events'}</h2>
            <p className="text-muted-foreground max-w-3xl transition-all duration-300 hover:text-foreground">
              {pageData.events?.subtitle || 'Join our virtual and in-person meetings to connect with researchers, technical experts, and professionals from across the Nile Basin region.'}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pageData.events?.events?.map((event: any, index: number) => (
              <div key={index}>
                <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50">
                  <div className="flex items-center gap-4 mb-4">
                    <Calendar className="h-5 w-5 text-primary transition-all duration-300 group-hover:scale-110" />
                    <span className="text-sm font-medium transition-all duration-300 group-hover:text-primary">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 transition-all duration-300 group-hover:text-primary">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 transition-all duration-300 group-hover:text-foreground">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                    <MapPin className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                    <span>{event.location || 'Location TBD'}</span>
                  </div>
                  {event.registrationLink && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full transition-all duration-300 hover:scale-105 hover:shadow-md"
                        asChild
                      >
                        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                          Register Now
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )) || (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No events available at the moment.</p>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/events" className="inline-flex items-center gap-2 text-primary hover:underline transition-all duration-300 hover:scale-105 hover:text-primary/80">
              View all events <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Forum Section - Scroll triggered */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                    <div className="relative h-[400px] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105">
            {pageData.forum?.backgroundImage ? (
              <Image 
                src={urlFor(pageData.forum.backgroundImage).url()}
                alt="Forum Discussion" 
                fill 
                className="object-cover transition-all duration-300 hover:scale-110" 
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Forum image not available</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-300 hover:text-primary">{pageData.forum?.title || 'Join Our Forum'}</h2>
            <p className="text-muted-foreground transition-all duration-300 hover:text-foreground">
              {pageData.forum?.description || 'Connect with other members and participate in discussions about the Nile Basin region.'}
            </p>
            {pageData.forum?.ctaButton && (
              <div className="pt-4">
                <Button asChild className="transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <Link href={pageData.forum.ctaButton.action === 'signup' ? '#signup' : pageData.forum.ctaButton.targetPage || '/forum'}>
                    {pageData.forum.ctaButton.text}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Scroll triggered */}
      <section className="bg-primary text-primary-foreground py-12 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-yellow-200">{pageData.newsletter?.title || 'Stay Updated'}</h2>
            <p className="max-w-2xl text-primary-foreground/90 transition-all duration-300 hover:text-primary-foreground">
              {pageData.newsletter?.description || 'Subscribe to our newsletter for the latest updates and insights.'}
            </p>
          </div>
          <NewsletterForm 
            placeholder={pageData.newsletter?.placeholderText || 'Enter your email address'}
            buttonText={pageData.newsletter?.buttonText || 'Subscribe'}
          />
        </div>
      </section>
    </>
  )
}

function HomePageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Section Skeleton */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/20 z-10" />
        <div className="relative h-[500px] w-full bg-muted">
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container">
              <div className="max-w-2xl space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-md">
                  <Skeleton className="h-16 w-3/4" />
                </h1>
                <div className="text-xl text-white/90 drop-shadow">
                  <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="flex justify-start pt-4">
                  <Skeleton className="h-12 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Focus Section Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-full" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Section Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-6 w-3xl" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg border bg-background p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forum Section Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>

      {/* Newsletter Section Skeleton */}
      <section className="bg-primary text-primary-foreground py-12 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-6 w-2xl" />
          </div>
          <div className="max-w-md mx-auto">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </section>
    </div>
  )
}

