"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, Droplet, Lightbulb } from "lucide-react"
import { urlFor } from "@/lib/sanity"
import { enhancedCachedClient, aboutPageQuery } from "@/lib/sanity"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Icon mapping for objectives
const iconMap: Record<string, any> = {
  BookOpen,
  Users,
  Droplet,
  Lightbulb,
}

export default function AboutPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await enhancedCachedClient.fetch<any>(aboutPageQuery)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <AboutPageSkeleton />
  }

  if (error || !data) {
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
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">{data.hero.title}</h1>
              <p className="text-xl text-muted-foreground">
                {data.hero.subtitle}
              </p>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              {data.hero.image ? (
                <Image
                  src={urlFor(data.hero.image).url()}
                  alt={data.hero.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <Image
                  src="/placeholder.svg"
                  alt="About FRIENDS Forum - Placeholder"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.history.title}</h2>
            {data.history.content.map((paragraph: string, index: number) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.objectives.title}</h2>
            <ul className="space-y-4">
              {data.objectives.objectives.map((objective: any, index: number) => {
                const IconComponent = iconMap[objective.icon]
                return (
                  <li key={index} className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary mt-1">
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{objective.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {objective.description}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.principles.title}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {data.principles.principles.map((principle: any, index: number) => (
                <div key={index} className="rounded-lg border p-6">
                  <h3 className="font-bold text-lg mb-2">{principle.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{data.team.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {data.team.subtitle}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.team.members.map((member: any, index: number) => (
              <div key={index} className="bg-background rounded-lg p-6 text-center">
                <div className="relative h-32 w-32 mx-auto mb-4">
                  {member.image ? (
                    <Image
                      src={urlFor(member.image).url()}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <Image
                      src="/placeholder.svg"
                      alt={`${member.name} - Placeholder`}
                      fill
                      className="object-cover rounded-full"
                    />
                  )}
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{member.position}</p>
                <p className="text-sm text-muted-foreground">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">{data.cta.title}</h2>
          <p className="text-muted-foreground">
            {data.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <a href={data.cta.primaryButton.action === 'signup' ? '#signup' : data.cta.primaryButton.targetPage || '/'}>
                {data.cta.primaryButton.text}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={data.cta.secondaryButton.action === 'signup' ? '#signup' : data.cta.secondaryButton.targetPage || '/'}>
                {data.cta.secondaryButton.text}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function AboutPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Section Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-9 w-24" />
              </div>
              <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg border p-6">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-2xl mx-auto" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background rounded-lg p-6 text-center">
                <Skeleton className="h-32 w-32 mx-auto mb-4 rounded-full" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-16 w-full mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-6 w-full mx-auto" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </section>
    </div>
  )
}

