import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, BookOpen, ArrowRight } from "lucide-react"
import NewsletterForm from "@/components/ui/newsletter-form"
import { urlFor } from "@/lib/sanity"
import { enhancedCachedClient, homePageQuery } from "@/lib/sanity"

// Icon mapping for focus areas
const iconMap: Record<string, any> = {
  BookOpen,
  Users,
  MapPin,
}

// Server-side data fetching
async function getHomePageData() {
  try {
    const data = await enhancedCachedClient.fetch<any>(homePageQuery)
    return data
  } catch (error) {
    console.error('Failed to fetch home page data:', error)
    return null
  }
}

export default async function Home() {
  const data = await getHomePageData()

  if (!data) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
        <p className="text-muted-foreground">Failed to load page content. Please try again later.</p>
      </div>
    )
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
                  asChild
                >
                  <Link href={data.hero.primaryButton.action === 'signup' ? '#signup' : data.hero.primaryButton.targetPage || '/'}>
                    {data.hero.primaryButton.text}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/90 hover:bg-white"
                  asChild
                >
                  <Link href={data.hero.secondaryButton.action === 'signup' ? '#signup' : data.hero.secondaryButton.targetPage || '/'}>
                    {data.hero.secondaryButton.text}
                  </Link>
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
              {data.focusAreas?.focusAreas?.map((area: any, index: number) => {
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
            {data.events?.events?.map((event: any, index: number) => (
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
                      asChild
                    >
                      <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                        Register Now
                      </a>
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
                <Button asChild>
                  <Link href={data.forum.ctaButton.action === 'signup' ? '#signup' : data.forum.ctaButton.targetPage || '/forum'}>
                    {data.forum.ctaButton.text}
                  </Link>
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

