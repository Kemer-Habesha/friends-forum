import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  BookOpen,
  Droplets,
  Leaf,
  MessageSquare,
  Users,
} from "lucide-react"
import { buildTitle, SITE_URL } from "@/lib/seo"
import { currentTopicsPageQuery, sanityFetch } from "@/lib/sanity"

type Topic = {
  title: string
  description: string
  categories: string[]
  status: string
  updated: string
  icon: string
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>(currentTopicsPageQuery)

  const title = buildTitle(data?.seo?.metaTitle, data?.hero?.title)
  const description = data?.seo?.metaDescription || data?.hero?.subtitle

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/current-topics" },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/current-topics`,
      type: "website",
    },
  }
}

const topicIcons = { Users, Droplets, Leaf, BookOpen }

export default async function CurrentTopicsPage() {
  const pageData = await sanityFetch<any>(currentTopicsPageQuery)
  const topics: Topic[] = pageData?.topics || []

  return (
    <>
      <section className="relative overflow-hidden bg-muted py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {pageData?.hero?.title}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground md:text-xl">
              {pageData?.hero?.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {pageData?.topicsSection?.title}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {pageData?.topicsSection?.subtitle}
            </p>
          </div>
          <Link
            href="/forum"
            className="inline-flex shrink-0 items-center gap-2 font-medium text-primary hover:underline"
          >
            Join the forum <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {topics.map((topic) => {
            const Icon = topicIcons[topic.icon as keyof typeof topicIcons] || MessageSquare

            return (
              <article
                key={topic.title}
                className="group flex flex-col rounded-xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {topic.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary">{topic.title}</h3>
                <p className="mt-3 flex-1 text-muted-foreground">{topic.description}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <div className="flex flex-wrap gap-2">
                    {topic.categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{topic.updated}</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-y bg-muted/50 py-12 md:py-16">
        <div className="container flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold">
              {pageData?.cta?.title}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {pageData?.cta?.description}
            </p>
          </div>
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <MessageSquare className="h-4 w-4" /> {pageData?.cta?.buttonText}
          </Link>
        </div>
      </section>
    </>
  )
}
