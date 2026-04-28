import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Users, BookOpen, ArrowRight } from "lucide-react"
import NewsletterForm from "@/components/ui/newsletter-form"
import HomeEvents from "@/components/ui/home-events"
import { HomeHeroSplit } from "@/components/home-hero-split"
import type { HeroSlide } from "@/components/hero-slideshow"
import { urlFor, sanityFetch, homePageQuery } from "@/lib/sanity"
import type { Metadata } from "next"

const iconMap: Record<string, any> = {
  BookOpen,
  Users,
  MapPin,
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>(homePageQuery)

  if (!data?.seo) return {}

  const ogImage = data.seo.ogImage ? urlFor(data.seo.ogImage).width(1200).height(630).url() : undefined

  return {
    title: data.seo.metaTitle ?? data.title,
    description: data.seo.metaDescription,
    openGraph: {
      title: data.seo.metaTitle ?? data.title,
      description: data.seo.metaDescription,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

const DEFAULT_HERO_W = 1920
const DEFAULT_HERO_H = 1080

function heroDimensionsFromSanity(img: {
  dimensions?: { width?: number; height?: number } | null
} | null | undefined) {
  const w = img?.dimensions?.width
  const h = img?.dimensions?.height
  if (typeof w === "number" && typeof h === "number" && w > 0 && h > 0) {
    return { width: w, height: h }
  }
  return { width: DEFAULT_HERO_W, height: DEFAULT_HERO_H }
}

function heroSlidesFromSanity(hero: {
  title?: string
  backgroundImage?: unknown
  backgroundImages?: unknown[] | null
}): HeroSlide[] {
  const alt = hero?.title?.trim() || "Hero"
  const fromArray = (hero?.backgroundImages ?? []).filter(Boolean) as Array<{
    dimensions?: { width?: number; height?: number }
  }>
  if (fromArray.length > 0) {
    return fromArray.map((img) => ({
      src: urlFor(img).url(),
      alt,
      ...heroDimensionsFromSanity(img),
    }))
  }
  if (hero?.backgroundImage) {
    const img = hero.backgroundImage as { dimensions?: { width?: number; height?: number } }
    return [
      {
        src: urlFor(hero.backgroundImage).url(),
        alt,
        ...heroDimensionsFromSanity(img),
      },
    ]
  }
  return []
}

export default async function Home() {
  const pageData = await sanityFetch<any>(homePageQuery)

  if (!pageData) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
        <p className="text-muted-foreground">Failed to load page content. Please try again later.</p>
      </div>
    )
  }

  return (
    <>
      {/* Split hero: text panel left, image panel right — equal-but-distinct territory. */}
      <HomeHeroSplit
        title={pageData.hero.title}
        subtitle={pageData.hero.subtitle}
        slides={heroSlidesFromSanity(pageData.hero)}
        cta={pageData.hero.primaryButton}
      />

      {/* Mission & Focus Section */}
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

      {/* Events Section */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-primary">{pageData.events?.title || 'Upcoming Events'}</h2>
            <p className="text-muted-foreground max-w-3xl transition-all duration-300 hover:text-foreground">
              {pageData.events?.subtitle || 'Join our virtual and in-person meetings to connect with researchers, technical experts, and professionals from across the Nile Basin region.'}
            </p>
          </div>
          <HomeEvents events={pageData.events?.events} />
          <div className="flex justify-center mt-8">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-primary hover:underline transition-all duration-300 hover:scale-105 hover:text-primary/80"
            >
              View all events{" "}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Forum Section */}
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

      {/* Newsletter Section */}
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
            source="homepage"
          />
        </div>
      </section>
    </>
  )
}
