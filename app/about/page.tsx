import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, Droplet, Lightbulb } from "lucide-react"
import { urlFor } from "@/lib/sanity"
import { enhancedCachedClient, aboutPageQuery } from "@/lib/sanity"

// Icon mapping for objectives
const iconMap: Record<string, any> = {
  BookOpen,
  Users,
  Droplet,
  Lightbulb,
}

export default async function AboutPage() {
  let data: any = null
  let error: string | null = null

  try {
    data = await enhancedCachedClient.fetch<any>(aboutPageQuery)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch data'
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
      <section className="bg-muted py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-fade-in-scale" />
        <div className="container relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 animate-slide-in-bottom">
              <h1 className="text-4xl font-bold tracking-tight transition-all duration-700 hover:text-primary hover:scale-105 hover:rotate-1">
                {data.hero.title.split(' ').map((word: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block transition-all duration-500 hover:scale-110 hover:rotate-3 hover:text-primary animate-bounce-in mr-2"
                    style={{
                      animationDelay: `${index * 200}ms`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </h1>
              <p className="text-xl text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-105 animate-fade-in-up delay-500">
                {data.hero.subtitle}
              </p>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden transition-all duration-700 hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:shadow-primary/25 animate-fade-in-scale delay-300 group">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
              {data.hero.image ? (
                <Image
                  src={urlFor(data.hero.image).url()}
                  alt={data.hero.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3"
                  priority
                />
              ) : (
                <Image
                  src="/placeholder.svg"
                  alt="About FRIENDS Forum - Placeholder"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4 animate-fade-in-up delay-300">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-300 hover:text-primary">{data.history.title}</h2>
            {data.history.content.map((paragraph: string, index: number) => (
              <p key={index} className="text-muted-foreground transition-all duration-300 hover:text-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="space-y-4 animate-fade-in-left delay-800">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-500 hover:text-primary hover:scale-110 hover:rotate-1">{data.objectives.title}</h2>
            <ul className="space-y-4">
              {data.objectives.objectives.map((objective: any, index: number) => {
                const IconComponent = iconMap[objective.icon]
                return (
                  <li key={index} className={`flex items-start gap-4 p-3 rounded-lg transition-all duration-500 hover:bg-muted/50 hover:scale-110 hover:rotate-1 hover:shadow-lg hover:-translate-y-1 animate-fade-in-right delay-${1000 + (index * 150)}`}>
                    <div className="rounded-full bg-primary/10 p-2 text-primary mt-1 transition-all duration-500 hover:bg-primary/20 hover:scale-125 hover:rotate-12">
                      {IconComponent && <IconComponent className="h-5 w-5 transition-all duration-300 hover:scale-110" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg transition-all duration-500 hover:text-primary hover:scale-105">{objective.title}</h3>
                      <p className="text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-105">
                        {objective.description}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="space-y-4 animate-fade-in-scale delay-1200">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-500 hover:text-primary hover:scale-110 hover:rotate-1">{data.principles.title}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {data.principles.principles.map((principle: any, index: number) => (
                <div key={index} className={`group rounded-lg border p-6 transition-all duration-700 hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-2 animate-bounce-in delay-${1400 + (index * 200)}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg" />
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2 transition-all duration-500 group-hover:text-primary group-hover:scale-105">{principle.title}</h3>
                    <p className="text-sm text-muted-foreground transition-all duration-500 group-hover:text-foreground">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in-up delay-600">
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-primary">{data.team.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto transition-all duration-300 hover:text-foreground">
              {data.team.subtitle}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.team.members.map((member: any, index: number) => (
              <div key={index} className={`group bg-background rounded-lg p-6 text-center transition-all duration-700 hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-4 animate-bounce-in delay-${1800 + (index * 150)}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg" />
                <div className="relative z-10">
                  <div className="relative h-32 w-32 mx-auto mb-4 transition-all duration-700 group-hover:scale-125 group-hover:rotate-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    {member.image ? (
                      <Image
                        src={urlFor(member.image).url()}
                        alt={member.name}
                        fill
                        className="object-cover rounded-full transition-all duration-700 group-hover:scale-110 group-hover:rotate-3"
                      />
                    ) : (
                      <Image
                        src="/placeholder.svg"
                        alt={`${member.name} - Placeholder`}
                        fill
                        className="object-cover rounded-full transition-all duration-700 group-hover:scale-110 group-hover:rotate-3"
                      />
                    )}
                  </div>
                  <h3 className="font-bold text-lg transition-all duration-500 group-hover:text-primary group-hover:scale-105">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2 transition-all duration-500 group-hover:text-foreground">{member.position}</p>
                  <p className="text-sm text-muted-foreground transition-all duration-500 group-hover:text-foreground">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 animate-fade-in-scale delay-2400" />
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight transition-all duration-700 hover:text-primary hover:scale-110 hover:rotate-1 animate-slide-in-bottom delay-2400">{data.cta.title}</h2>
          <p className="text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-105 animate-fade-in-up delay-2600">
            {data.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-scale delay-2800">
            <Button size="lg" className="transition-all duration-700 hover:scale-125 hover:rotate-3 hover:shadow-2xl hover:shadow-primary/30" asChild>
              <a href={data.cta.primaryButton.action === 'signup' ? '#signup' : data.cta.primaryButton.targetPage || '/'}>
                {data.cta.primaryButton.text}
              </a>
            </Button>
            <Button size="lg" variant="outline" className="transition-all duration-700 hover:scale-125 hover:-rotate-3 hover:shadow-2xl hover:shadow-secondary/30" asChild>
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

