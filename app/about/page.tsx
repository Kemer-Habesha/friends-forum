"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, Droplet, Lightbulb } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useAboutPage } from "@/hooks/useAboutPage"
import { urlFor } from "@/lib/sanity"
import { Skeleton } from "@/components/ui/skeleton"

// Icon mapping for objectives
const iconMap: Record<string, any> = {
  BookOpen,
  Users,
  Droplet,
  Lightbulb,
}

export default function AboutPage() {
  const { openSignupModal } = useAuth()
  const router = useRouter()
  const { data, loading, error } = useAboutPage()

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

  const handleButtonClick = (button: any) => {
    if (button.action === 'signup') {
      openSignupModal()
    } else if (button.action === 'navigate' && button.targetPage) {
      router.push(button.targetPage)
    }
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
            {data.history.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.objectives.title}</h2>
            <ul className="space-y-4">
              {data.objectives.objectives.map((objective, index) => {
                const IconComponent = iconMap[objective.icon]
                return (
                  <li key={index} className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary mt-1">
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{objective.title}</h3>
                      <p className="text-muted-foreground">
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
              {data.principles.principles.map((principle, index) => (
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
            {data.team.members.map((member, index) => (
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
            <Button size="lg" onClick={() => handleButtonClick(data.cta.primaryButton)}>
              {data.cta.primaryButton.text}
            </Button>
            <Button size="lg" variant="outline" onClick={() => handleButtonClick(data.cta.secondaryButton)}>
              {data.cta.secondaryButton.text}
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
      {/* Hero Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <Skeleton className="h-12 w-80" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-32 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background rounded-lg p-6 text-center">
                <Skeleton className="h-32 w-32 mx-auto mb-4 rounded-full" />
                <Skeleton className="h-5 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
          <div className="flex gap-4 justify-center pt-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </section>
    </div>
  )
}

