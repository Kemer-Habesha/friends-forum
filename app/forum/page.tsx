"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, Users, Clock, ArrowRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { enhancedCachedClient, forumPageQuery } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"




export default function ForumPage() {
  const { openSignupModal } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"latest" | "active" | "unanswered">("latest")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await enhancedCachedClient.fetch(forumPageQuery)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`)
    }
  }

  if (loading) {
    return (
      <div className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="h-12 bg-muted rounded animate-pulse"></div>
            <div className="h-6 bg-muted rounded animate-pulse max-w-2xl mx-auto"></div>
            <div className="h-12 bg-muted rounded animate-pulse w-48 mx-auto"></div>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="h-12 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-48 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Forum</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Forum Content Found</h1>
          <p className="text-muted-foreground">Please check back later or contact support.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="bg-muted py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-fade-in-scale" />
        <div className="container relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight transition-all duration-700 hover:text-primary hover:scale-110 hover:rotate-1 animate-bounce-in">
              {(data.hero?.title || 'Discussion Forum').split(' ').map((word: string, index: number) => (
                <span
                  key={index}
                  className="inline-block transition-all duration-500 hover:scale-125 hover:rotate-3 hover:text-primary animate-fade-in-up mr-2"
                  style={{
                    animationDelay: `${index * 200}ms`,
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>
            <p className="text-xl text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-105 animate-fade-in-up delay-600">
              {data.hero?.subtitle || 'Engage in meaningful dialogue with researchers, experts, and stakeholders from across the Nile Basin region.'}
            </p>
            <div className="pt-4 flex justify-center animate-fade-in-scale delay-800">
              {data.hero?.ctaButton?.action === 'signup' ? (
                <Button size="lg" className="transition-all duration-700 hover:scale-125 hover:rotate-3 hover:shadow-2xl hover:shadow-primary/30" onClick={openSignupModal}>
                  {data.hero.ctaButton.text || 'Join the Conversation'}
                </Button>
              ) : data.hero?.ctaButton?.action === 'navigate' && data.hero.ctaButton.targetPage ? (
                <Button size="lg" className="transition-all duration-700 hover:scale-125 hover:rotate-3 hover:shadow-2xl hover:shadow-primary/30" onClick={() => router.push(data.hero.ctaButton.targetPage!)}>
                  {data.hero.ctaButton.text || 'Join the Conversation'}
                </Button>
              ) : (
                <Button size="lg" className="transition-all duration-700 hover:scale-125 hover:rotate-3 hover:shadow-2xl hover:shadow-primary/30" onClick={openSignupModal}>
                  Join the Conversation
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="max-w-3xl mx-auto animate-slide-in-bottom delay-1000">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:text-primary" />
              <Input
                placeholder={data.searchSection?.placeholder || "Search discussions..."}
                className="pl-10 transition-all duration-500 hover:border-primary focus:border-primary hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-left delay-1200">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-700 hover:text-primary hover:scale-110 hover:rotate-1">{data.popularDiscussions?.title || 'Popular Discussions'}</h2>
            <div className="flex gap-2 animate-fade-in-right delay-1400">
              <Button
                variant={activeFilter === "latest" ? "default" : "outline"}
                size="sm"
                className="transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-lg"
                onClick={() => setActiveFilter("latest")}
              >
                Latest
              </Button>
              <Button
                variant={activeFilter === "active" ? "default" : "outline"}
                size="sm"
                className="transition-all duration-500 hover:scale-110 hover:-rotate-3 hover:shadow-lg"
                onClick={() => setActiveFilter("active")}
              >
                Most Active
              </Button>
              <Button
                variant={activeFilter === "unanswered" ? "default" : "outline"}
                size="sm"
                className="transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-lg"
                onClick={() => setActiveFilter("unanswered")}
              >
                Unanswered
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {data.popularDiscussions?.discussions && data.popularDiscussions.discussions.length > 0 ? (
              data.popularDiscussions.discussions.map((discussion: any, index: number) => (
                <div key={index} className={`group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-700 hover:scale-110 hover:rotate-1 hover:shadow-2xl hover:shadow-primary/25 hover:border-primary/50 hover:-translate-y-3 animate-bounce-in delay-${1600 + (index * 150)}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 transition-all duration-500 group-hover:text-primary group-hover:scale-105">{discussion.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                          {discussion.description}
                        </p>
                        {discussion.tags && discussion.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {discussion.tags.map((tag: string, tagIndex: number) => (
                              <span key={tagIndex} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-500 hover:border-primary hover:text-primary hover:scale-110 hover:rotate-3">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-500 group-hover:text-foreground">
                          <MessageSquare className="h-4 w-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                          <span>{discussion.replyCount} replies</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-500 group-hover:text-foreground">
                          <Users className="h-4 w-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                          <span>{discussion.participantCount} participants</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-500 group-hover:text-foreground">
                          <Clock className="h-4 w-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6">
                        {discussion.author?.avatar ? (
                          <Image
                            src={urlFor(discussion.author.avatar).url()}
                            alt={`${discussion.author.name} Avatar`}
                            fill
                            className="object-cover rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                          />
                        ) : (
                          <Image
                            src="/placeholder.svg"
                            alt={`${discussion.author?.name || 'User'} Avatar`}
                            fill
                            className="object-cover rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium transition-all duration-500 group-hover:text-primary group-hover:scale-105">{discussion.author?.name || 'Anonymous User'}</p>
                        <p className="text-xs text-muted-foreground transition-all duration-500 group-hover:text-foreground">{discussion.author?.title || 'Member'}</p>
                      </div>
                      <div className="ml-auto">
                        <Button
                          className="transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-primary/25"
                          onClick={() => {
                            // In a real app, this would navigate to the discussion
                            alert("Viewing discussion...")
                          }}
                        >
                          View Discussion
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback content when no discussions are available
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 animate-fade-in-up delay-${400 + (i * 150)}`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 transition-all duration-300 group-hover:text-primary">Sustainable Water Management Practices in the Nile Basin</h3>
                      <p className="text-sm text-muted-foreground mb-4 transition-all duration-300 group-hover:text-foreground">
                        What are some innovative approaches to sustainable water management that could be applied in the
                        Nile Basin region?
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 hover:border-primary hover:text-primary">
                          Water Management
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 hover:border-primary hover:text-primary">
                          Sustainability
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 hover:border-primary hover:text-primary">
                          Innovation
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                        <MessageSquare className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                        <span>24 replies</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                        <Users className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                        <span>12 participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                        <Clock className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                        <span>2 days ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10 transition-all duration-300 group-hover:scale-110">
                      <Image
                        src="/placeholder-user.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover rounded-full transition-all duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium transition-all duration-300 group-hover:text-primary">Dr. Sarah Kimani</p>
                      <p className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground">Research Coordinator</p>
                    </div>
                    <div className="ml-auto">
                      <Button
                        className="transition-all duration-300 hover:scale-105 hover:shadow-md"
                        onClick={() => {
                          alert("Viewing discussion...")
                        }}
                      >
                        View Discussion
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center animate-fade-in-up delay-1200">
            <Button
              variant="outline"
              className="transition-all duration-300 hover:scale-105 hover:shadow-md"
              onClick={() => {
                alert("Loading more discussions...")
              }}
            >
              Load More Discussions
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in-up delay-1300">
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-primary">{data.discussionCategories?.title || 'Discussion Categories'}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto transition-all duration-300 hover:text-foreground">
              {data.discussionCategories?.subtitle || 'Browse discussions by category to find topics that interest you.'}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.discussionCategories?.categories && data.discussionCategories.categories.length > 0 ? (
              data.discussionCategories.categories.map((category: any, index: number) => (
                <div key={index} className={`bg-background rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up delay-${1400 + (index * 100)}`}>
                  <h3 className="font-bold text-lg mb-2 transition-all duration-300 hover:text-primary">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 transition-all duration-300 hover:text-foreground">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground transition-all duration-300 hover:text-foreground">{category.discussionCount} discussions</span>
                    {category.action === 'navigate' && category.targetPage ? (
                      <Link href={category.targetPage} className="text-sm text-primary hover:underline inline-flex items-center gap-1 transition-all duration-300 hover:scale-105">
                        Browse <ArrowRight className="h-3 w-3 transition-transform duration-300 hover:translate-x-1" />
                      </Link>
                    ) : (
                      <Link href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1 transition-all duration-300 hover:scale-105">
                        Browse <ArrowRight className="h-3 w-3 transition-transform duration-300 hover:translate-x-1" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Fallback categories when none are available
              [
                {
                  title: 'Research & Knowledge Exchange',
                  description: 'Discussions on research findings, methodologies, and knowledge sharing related to the Nile Basin.',
                  discussionCount: 42,
                },
                {
                  title: 'Development Projects',
                  description: 'Discussions on infrastructure development, project planning, and implementation in the Nile Basin.',
                  discussionCount: 36,
                },
                {
                  title: 'Nile Basin Water Use',
                  description: 'Discussions on water allocation, usage patterns, and equitable distribution of water resources.',
                  discussionCount: 58,
                },
                {
                  title: 'Cultural Understanding',
                  description: 'Discussions on cultural exchange, cross-border cooperation, and building trust among Nile Basin countries.',
                  discussionCount: 29,
                },
              ].map((category, index) => (
                <div key={index} className={`bg-background rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up delay-${1400 + (index * 100)}`}>
                  <h3 className="font-bold text-lg mb-2 transition-all duration-300 hover:text-primary">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 transition-all duration-300 hover:text-foreground">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground transition-all duration-300 hover:text-foreground">{category.discussionCount} discussions</span>
                    <Link href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1 transition-all duration-300 hover:scale-105">
                      Browse <ArrowRight className="h-3 w-3 transition-transform duration-300 hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4 animate-fade-in-left delay-1800">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-300 hover:text-primary">{data.startDiscussion?.title || 'Start a New Discussion'}</h2>
            <p className="text-muted-foreground transition-all duration-300 hover:text-foreground">
              {data.startDiscussion?.description || 'Have a question or topic you\'d like to discuss with the FRIENDS Forum community? Start a new discussion to engage with researchers, experts, and stakeholders from across the Nile Basin region.'}
            </p>
            <div className="pt-4">
              {data.startDiscussion?.ctaButton?.action === 'signup' ? (
                <Button className="transition-all duration-300 hover:scale-110 hover:shadow-lg" onClick={openSignupModal}>
                  {data.startDiscussion.ctaButton.text || 'Create New Topic'}
                </Button>
              ) : data.startDiscussion?.ctaButton?.action === 'navigate' && data.startDiscussion.ctaButton.targetPage ? (
                <Button className="transition-all duration-300 hover:scale-110 hover:shadow-lg" onClick={() => router.push(data.startDiscussion.ctaButton.targetPage!)}>
                  {data.startDiscussion.ctaButton.text || 'Create New Topic'}
                </Button>
              ) : (
                <Button className="transition-all duration-300 hover:scale-110 hover:shadow-lg" onClick={openSignupModal}>
                  Create New Topic
                </Button>
              )}
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 animate-fade-in-right delay-1800">
            {data.startDiscussion?.image ? (
              <Image 
                src={urlFor(data.startDiscussion.image).url()} 
                alt="Forum Discussion" 
                fill 
                className="object-cover transition-all duration-300 hover:scale-110" 
              />
            ) : (
              <Image 
                src="/placeholder.svg?height=400&width=600" 
                alt="Forum Discussion" 
                fill 
                className="object-cover transition-all duration-300 hover:scale-110" 
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}

