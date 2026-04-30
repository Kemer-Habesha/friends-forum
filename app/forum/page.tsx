import { MessageSquare } from "lucide-react"
import { sanityFetch, forumPageQuery, urlFor } from "@/lib/sanity"
import ActionButton from "@/components/ui/action-button"
import ForumDiscussions from "@/components/ui/forum-discussions"
import type { Metadata } from "next"
import { buildTitle, SITE_URL } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>(forumPageQuery)

  const ogImage = data?.seo?.ogImage
    ? urlFor(data.seo.ogImage).width(1200).height(630).url()
    : undefined

  const title = buildTitle(
    data?.seo?.metaTitle,
    data?.hero?.title || "Discussion Forum"
  )
  const description =
    data?.seo?.metaDescription ||
    "Join researchers, experts, and stakeholders in discussions about the Nile Basin, water resources, and development."

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/forum" },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/forum`,
      type: "website",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

export default async function ForumPage() {
  const pageData = await sanityFetch<any>(forumPageQuery)

  if (!pageData) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Page
        </h1>
        <p className="text-muted-foreground">
          Failed to load page content. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-muted py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-fade-in-scale delay-100" />
        <div className="container relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            {/*
              aria-label exposes the flat title to assistive tech / Googlebot;
              per-letter spans below are decorative only.
            */}
            <h1
              aria-label={pageData.hero?.title || "Discussion Forum"}
              className="text-4xl font-bold tracking-tight transition-all duration-500 hover:text-primary hover:scale-105 animate-fade-in-up"
            >
              {(pageData.hero?.title || "Discussion Forum")
                .split("")
                .map((letter: string, index: number) => (
                  <span
                    key={index}
                    aria-hidden="true"
                    className="inline-block transition-all duration-300 hover:scale-125 hover:rotate-12 hover:text-primary animate-bounce-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
            </h1>
            <p className="text-xl text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-105 animate-fade-in-up delay-300">
              {pageData.hero?.subtitle ||
                "Engage in meaningful dialogue with researchers, experts, and stakeholders from across the Nile Basin region."}
            </p>
            <div className="pt-4">
              <ActionButton
                text={pageData.hero?.ctaButton?.text || "Join the Conversation"}
                action={pageData.hero?.ctaButton?.action || "signup"}
                targetPage={pageData.hero?.ctaButton?.targetPage}
                size="lg"
                className="transition-all duration-500 hover:scale-110 hover:shadow-lg animate-fade-in-up delay-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Discussions - Client component */}
      <section className="container py-12 md:py-24">
        <ForumDiscussions
          sectionTitle={
            pageData.popularDiscussions?.title || "Popular Discussions"
          }
          discussions={pageData.popularDiscussions?.discussions || []}
        />
      </section>

      {/* Discussion Categories - Static */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {pageData.discussionCategories?.title || "Discussion Categories"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {pageData.discussionCategories?.subtitle ||
                "Explore different topics and areas of interest within the FRIENDS Forum community."}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pageData.discussionCategories?.categories?.map(
              (category: any, index: number) => (
                <div
                  key={index}
                  className="group bg-background rounded-lg border p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 cursor-pointer"
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {category.description}
                  </p>
                </div>
              )
            ) ||
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg border p-6 text-center"
                >
                  <div className="h-12 w-12 bg-muted rounded-lg mx-auto mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded" />
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
