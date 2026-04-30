import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText, BookOpen } from "lucide-react"
import { urlFor, sanityFetch, resourcesPageQuery } from "@/lib/sanity"
import FeaturedResources from "@/components/ui/featured-resources"
import VideoGallery from "@/components/ui/video-gallery"
import type { Metadata } from "next"
import { buildTitle, SITE_URL } from "@/lib/seo"

const iconMap: Record<string, any> = {
  FileText,
  BookOpen,
  Report: FileText,
  Presentation: BookOpen,
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>(resourcesPageQuery)

  const ogImage = data?.seo?.ogImage
    ? urlFor(data.seo.ogImage).width(1200).height(630).url()
    : undefined

  /*
   * The current Sanity content for /resources has a description-length
   * string saved in seo.metaTitle. buildTitle() rejects titles outside
   * the 5–80 char range so we fall back to the hero title (or the doc
   * title) and auto-suffix the brand. Editors can fix the metaTitle in
   * Sanity Studio at any time and this page will pick it up automatically.
   */
  const title = buildTitle(
    data?.seo?.metaTitle,
    data?.hero?.title || "Resources"
  )
  const description =
    data?.seo?.metaDescription ||
    "Research papers, case studies, reports, and videos covering water resources, climate, and development in the Nile Basin."

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/resources" },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/resources`,
      type: "website",
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

export default async function ResourcesPage() {
  const pageData = await sanityFetch<any>(resourcesPageQuery)

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
      {/* Hero Section */}
      <section className="bg-muted py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-fade-in-scale" />
        <div className="container relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            {/*
              See note in app/events/page.tsx — aria-label provides the flat
              title to assistive tech and search crawlers; per-letter spans
              are decorative only.
            */}
            <h1
              aria-label={pageData?.hero?.title || "Resources"}
              className="text-4xl font-bold tracking-tight transition-all duration-700 hover:text-primary hover:scale-110 hover:rotate-1 animate-bounce-in"
            >
              {(pageData?.hero?.title || 'Resources').split('').map((letter: string, index: number) => (
                <span
                  key={index}
                  aria-hidden="true"
                  className="inline-block transition-all duration-500 hover:scale-125 hover:rotate-12 hover:text-primary animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </h1>
            <p className="text-xl text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-105 animate-fade-in-up delay-800">
              {pageData?.hero?.subtitle || 'Access research papers, case studies, and reports related to the Nile Basin region.'}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Resources - Client component for show more/less + download */}
      <section className="container py-12 md:py-24">
        <FeaturedResources
          title={pageData?.featuredResources?.title || 'Featured Resources'}
          subtitle={pageData?.featuredResources?.subtitle || 'Access our curated collection of research papers, case studies, and reports.'}
          resources={pageData?.featuredResources?.resources}
        />
      </section>

      {/* Video Gallery - Client component for video playback */}
      {pageData?.videos?.videoList && pageData.videos.videoList.length > 0 && (
        <section className="container py-12 md:py-24">
          <VideoGallery
            title={pageData.videos.title || 'Featured Videos'}
            subtitle={pageData.videos.subtitle || 'Watch informative videos, presentations, and documentaries related to the Nile Basin region and water resources management.'}
            videos={pageData.videos.videoList}
          />
        </section>
      )}

      {/* Resource Categories - Static */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in-up delay-1100">
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-primary">{pageData?.resourceCategories?.title || 'Resource Categories'}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto transition-all duration-300 hover:text-foreground">
              {pageData?.resourceCategories?.subtitle || 'Browse resources by category to find the information you need.'}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pageData?.resourceCategories?.categories && pageData.resourceCategories.categories.length > 0 ? (
              pageData.resourceCategories.categories.map((category: any, index: number) => {
                const IconComponent = iconMap[category.icon] || FileText
                return (
                  <div key={index} className={`bg-background rounded-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up delay-${1200 + (index * 100)}`}>
                    <div className="rounded-full bg-primary/10 p-3 inline-flex mx-auto mb-4 transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                      <IconComponent className="h-6 w-6 text-primary transition-all duration-300 hover:scale-110" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 transition-all duration-300 hover:text-primary">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 transition-all duration-300 hover:text-foreground">
                      {category.description}
                    </p>
                  </div>
                )
              })
            ) : (
              [{title: 'Research Papers', description: 'Academic research on water resources, climate change, and development in the Nile Basin.', icon: 'FileText'},
               {title: 'Case Studies', description: 'Detailed examinations of specific projects and initiatives in the Nile Basin region.', icon: 'BookOpen'},
               {title: 'Reports', description: 'Comprehensive reports on the state of water resources, development, and cooperation in the Nile Basin.', icon: 'FileText'},
               {title: 'Presentations', description: 'Slides and materials from past events and conferences hosted by the FRIENDS Forum.', icon: 'BookOpen'}
              ].map((category, index) => {
                const IconComponent = iconMap[category.icon] || FileText
                return (
                  <div key={index} className={`bg-background rounded-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up delay-${1200 + (index * 100)}`}>
                    <div className="bg-primary/10 p-3 inline-flex mx-auto mb-4 transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                      <IconComponent className="h-6 w-6 text-primary transition-all duration-300 hover:scale-110" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 transition-all duration-300 hover:text-primary">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 transition-all duration-300 hover:text-foreground">
                      {category.description}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Submit Resource - Static */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 animate-fade-in-left delay-1600">
            {pageData?.submitResource?.image ? (
              <Image 
                src={urlFor(pageData.submitResource.image).url()} 
                alt="Submit Resource" 
                fill 
                className="object-cover transition-all duration-300 hover:scale-110" 
              />
            ) : (
              <Image 
                src="/placeholder.svg" 
                alt="Submit Resource" 
                fill 
                className="object-cover transition-all duration-300 hover:scale-110" 
              />
            )}
          </div>
          <div className="space-y-4 animate-fade-in-right delay-1600">
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-primary">{pageData?.submitResource?.title || 'Submit a Resource'}</h2>
            <p className="text-muted-foreground max-w-2xl transition-all duration-300 hover:text-foreground">
              {pageData?.submitResource?.description || 'We welcome submissions of research papers, case studies, and other resources related to the Nile Basin region. If you have a resource that you would like to share with the FRIENDS Forum community, please submit it for review.'}
            </p>
            <div className="pt-4">
              <Button className="transition-all duration-300 hover:scale-110 hover:shadow-lg" asChild>
                <a href="/contact">
                  Submit a Resource
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
