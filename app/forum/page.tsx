"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, Users, Clock, ArrowRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForumPage } from "@/hooks/useForumPage"
import { urlFor } from "@/lib/sanity"

export default function ForumPage() {
  const { openSignupModal } = useAuth()
  const router = useRouter()
  const { data, loading, error } = useForumPage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"latest" | "active" | "unanswered">("latest")

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
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">{data.hero?.title || 'Discussion Forum'}</h1>
            <p className="text-xl text-muted-foreground">
              {data.hero?.subtitle || 'Engage in meaningful dialogue with researchers, experts, and stakeholders from across the Nile Basin region.'}
            </p>
            <div className="pt-4 flex justify-center">
              {data.hero?.ctaButton?.action === 'signup' ? (
                <Button size="lg" onClick={openSignupModal}>
                  {data.hero.ctaButton.text || 'Join the Conversation'}
                </Button>
              ) : data.hero?.ctaButton?.action === 'navigate' && data.hero.ctaButton.targetPage ? (
                <Button size="lg" onClick={() => router.push(data.hero.ctaButton.targetPage!)}>
                  {data.hero.ctaButton.text || 'Join the Conversation'}
                </Button>
              ) : (
                <Button size="lg" onClick={openSignupModal}>
                  Join the Conversation
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={data.searchSection?.placeholder || "Search discussions..."}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.popularDiscussions?.title || 'Popular Discussions'}</h2>
            <div className="flex gap-2">
              <Button
                variant={activeFilter === "latest" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("latest")}
              >
                Latest
              </Button>
              <Button
                variant={activeFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("active")}
              >
                Most Active
              </Button>
              <Button
                variant={activeFilter === "unanswered" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("unanswered")}
              >
                Unanswered
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {data.popularDiscussions?.discussions && data.popularDiscussions.discussions.length > 0 ? (
              data.popularDiscussions.discussions.map((discussion, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg border bg-background p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {discussion.description}
                      </p>
                      {discussion.tags && discussion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {discussion.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{discussion.replyCount} replies</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{discussion.participantCount} participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{discussion.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10">
                      {discussion.author?.avatar ? (
                        <Image
                          src={urlFor(discussion.author.avatar).url()}
                          alt={`${discussion.author.name} Avatar`}
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <Image
                          src="/placeholder.svg"
                          alt={`${discussion.author?.name || 'User'} Avatar`}
                          fill
                          className="object-cover rounded-full"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{discussion.author?.name || 'Anonymous User'}</p>
                      <p className="text-xs text-muted-foreground">{discussion.author?.title || 'Member'}</p>
                    </div>
                    <div className="ml-auto">
                      <Button
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
              ))
            ) : (
              // Fallback content when no discussions are available
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg border bg-background p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">Sustainable Water Management Practices in the Nile Basin</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        What are some innovative approaches to sustainable water management that could be applied in the
                        Nile Basin region?
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          Water Management
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          Sustainability
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          Innovation
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>24 replies</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>12 participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>2 days ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10">
                      <Image
                        src="/placeholder-user.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dr. Sarah Kimani</p>
                      <p className="text-xs text-muted-foreground">Research Coordinator</p>
                    </div>
                    <div className="ml-auto">
                      <Button
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

          <div className="flex justify-center">
            <Button
              variant="outline"
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{data.discussionCategories?.title || 'Discussion Categories'}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {data.discussionCategories?.subtitle || 'Browse discussions by category to find topics that interest you.'}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.discussionCategories?.categories && data.discussionCategories.categories.length > 0 ? (
              data.discussionCategories.categories.map((category, index) => (
                <div key={index} className="bg-background rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{category.discussionCount} discussions</span>
                    {category.action === 'navigate' && category.targetPage ? (
                      <Link href={category.targetPage} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                        Browse <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <Link href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                        Browse <ArrowRight className="h-3 w-3" />
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
                <div key={index} className="bg-background rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{category.discussionCount} discussions</span>
                    <Link href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      Browse <ArrowRight className="h-3 w-3" />
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
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.startDiscussion?.title || 'Start a New Discussion'}</h2>
            <p className="text-muted-foreground">
              {data.startDiscussion?.description || 'Have a question or topic you\'d like to discuss with the FRIENDS Forum community? Start a new discussion to engage with researchers, experts, and stakeholders from across the Nile Basin region.'}
            </p>
            <div className="pt-4">
              {data.startDiscussion?.ctaButton?.action === 'signup' ? (
                <Button onClick={openSignupModal}>
                  {data.startDiscussion.ctaButton.text || 'Create New Topic'}
                </Button>
              ) : data.startDiscussion?.ctaButton?.action === 'navigate' && data.startDiscussion.ctaButton.targetPage ? (
                <Button onClick={() => router.push(data.startDiscussion.ctaButton.targetPage!)}>
                  {data.startDiscussion.ctaButton.text || 'Create New Topic'}
                </Button>
              ) : (
                <Button onClick={openSignupModal}>
                  Create New Topic
                </Button>
              )}
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            {data.startDiscussion?.image ? (
              <Image 
                src={urlFor(data.startDiscussion.image).url()} 
                alt="Forum Discussion" 
                fill 
                className="object-cover" 
              />
            ) : (
              <Image 
                src="/placeholder.svg?height=400&width=600" 
                alt="Forum Discussion" 
                fill 
                className="object-cover" 
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}

