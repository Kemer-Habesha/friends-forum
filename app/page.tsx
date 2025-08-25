"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, BookOpen, ArrowRight } from "lucide-react"
import NewsletterForm from "@/components/ui/newsletter-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useHomePage } from "@/hooks/useHomePage"
import { urlFor } from "@/lib/sanity"
import { Skeleton } from "@/components/ui/skeleton"

// Icon mapping for focus areas
const iconMap: Record<string, any> = {
  BookOpen,
  Users,
  MapPin,
}

export default function Home() {
  const { openSignupModal } = useAuth()
  const router = useRouter()
  const { data, loading, error } = useHomePage()

  if (loading) {
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

  const handleButtonClick = (button: any) => {
    if (button.action === 'signup') {
      openSignupModal()
    } else if (button.action === 'navigate' && button.targetPage) {
      router.push(button.targetPage)
    }
  }

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


      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/20 z-10" />
        <div className="relative h-[500px] w-full">
          <Image
            src={urlFor(data.hero.backgroundImage).url()}
            alt={data.hero.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-md">
                {data.hero.title}
              </h1>
              <p className="text-xl text-white/90 drop-shadow">
                {data.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto" 
                  onClick={() => handleButtonClick(data.hero.primaryButton)}
                >
                  {data.hero.primaryButton.text}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/90 hover:bg-white"
                  onClick={() => handleButtonClick(data.hero.secondaryButton)}
                >
                  {data.hero.secondaryButton.text}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Focus Section */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.mission?.title || 'Our Mission'}</h2>
            <p className="text-muted-foreground">
              {data.mission?.content || 'Mission content loading...'}
            </p>
            {data.mission?.learnMoreLink && (
              <div className="flex items-center gap-4 pt-4">
                <Link href={data.mission.learnMoreLink.url} className="inline-flex items-center gap-2 text-primary hover:underline">
                  {data.mission.learnMoreLink.text} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.focusAreas?.title || 'Our Focus'}</h2>
            <p className="text-muted-foreground">{data.focusAreas?.subtitle || 'Focus areas description...'}</p>
            <ul className="grid gap-4">
              {data.focusAreas?.focusAreas?.map((area, index) => {
                const IconComponent = iconMap[area.icon]
                return (
                  <li key={index} className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold">{area.title}</h3>
                      <p className="text-sm text-muted-foreground">
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

      {/* Events Section */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{data.events?.title || 'Upcoming Events'}</h2>
            <p className="text-muted-foreground max-w-3xl">
              {data.events?.subtitle || 'Join our virtual and in-person meetings to connect with researchers, technical experts, and professionals from across the Nile Basin region.'}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.events?.events?.map((event, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg border bg-background p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">
                    {formatDate(event.date)}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {event.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location || 'Location TBD'}</span>
                </div>
                {event.registrationLink && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(event.registrationLink, '_blank')}
                    >
                      Register Now
                    </Button>
                  </div>
                )}
              </div>
            )) || (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No events available at the moment.</p>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/events" className="inline-flex items-center gap-2 text-primary hover:underline">
              View all events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Forum Section */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            {data.forum?.backgroundImage ? (
              <Image 
                src={urlFor(data.forum.backgroundImage).url()} 
                alt="Forum Discussion" 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Forum image not available</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.forum?.title || 'Join Our Forum'}</h2>
            <p className="text-muted-foreground">
              {data.forum?.description || 'Connect with other members and participate in discussions about the Nile Basin region.'}
            </p>
            {data.forum?.ctaButton && (
              <div className="pt-4">
                <Button onClick={() => handleButtonClick(data.forum.ctaButton)}>
                  {data.forum.ctaButton.text}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{data.newsletter?.title || 'Stay Updated'}</h2>
            <p className="max-w-2xl text-primary-foreground/90">
              {data.newsletter?.description || 'Subscribe to our newsletter for the latest updates and insights.'}
            </p>
          </div>
          <NewsletterForm 
            placeholder={data.newsletter?.placeholderText || 'Enter your email address'}
            buttonText={data.newsletter?.buttonText || 'Subscribe'}
          />
        </div>
      </section>
    </>
  )
}

function HomePageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <section className="relative h-[500px] bg-muted">
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-2xl space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Focus Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background p-6 rounded-lg border">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forum Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>

      {/* Newsletter Skeleton */}
      <section className="bg-primary py-12 md:py-24">
        <div className="container text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-8" />
          <Skeleton className="h-12 w-80 mx-auto" />
        </div>
      </section>
    </div>
  )
}

