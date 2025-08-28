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
import { forumPageQuery } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"
import { useSanityQuery, queryKeys } from "@/hooks/useSanityQuery"
import { Skeleton } from "@/components/ui/skeleton"

export default function ForumPage() {
  const { openSignupModal } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { data, isLoading, error } = useSanityQuery(
    queryKeys.forumPage,
    forumPageQuery
  )

  if (isLoading) {
    return <ForumPageSkeleton />
  }

  if (error || !data) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
        <p className="text-muted-foreground">Failed to load page content. Please try again later.</p>
      </div>
    )
  }

  // Type assertion to fix TypeScript errors
  const pageData = data as any

  // Filter discussions based on search query
  const filteredDiscussions = pageData?.popularDiscussions?.discussions?.filter((discussion: any) => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    const title = discussion.title?.toLowerCase() || ''
    const description = discussion.description?.toLowerCase() || ''
    const tags = discussion.tags?.map((tag: string) => tag.toLowerCase()) || []
    const authorName = discussion.author?.name?.toLowerCase() || ''
    
    return title.includes(query) || 
           description.includes(query) || 
           tags.some((tag: string) => tag.includes(query)) ||
           authorName.includes(query)
  }) || []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is now handled by the filteredDiscussions state
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const handleButtonClick = (button: any) => {
    if (button.action === 'signup') {
      openSignupModal()
    } else if (button.action === 'navigate' && button.targetPage) {
      router.push(button.targetPage)
    } else if (button.action === 'contact') {
      router.push('/contact')
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-muted py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-fade-in-scale delay-100" />
        <div className="container relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight transition-all duration-500 hover:text-primary hover:scale-105 animate-fade-in-up">
              {pageData.hero?.title?.split('').map((letter: string, index: number) => (
                <span
                  key={index}
                  className="inline-block transition-all duration-300 hover:scale-125 hover:rotate-12 hover:text-primary animate-bounce-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              )) || 'Discussion Forum'}
            </h1>
            <p className="text-xl text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-105 animate-fade-in-up delay-300">
              {pageData.hero?.subtitle || 'Engage in meaningful dialogue with researchers, experts, and stakeholders from across the Nile Basin region.'}
            </p>
            <div className="pt-4">
              <Button 
                size="lg" 
                className="transition-all duration-500 hover:scale-110 hover:shadow-lg animate-fade-in-up delay-500" 
                onClick={() => pageData.hero?.ctaButton ? handleButtonClick(pageData.hero.ctaButton) : openSignupModal()}
              >
                {pageData.hero?.ctaButton?.text || 'Join the Conversation'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Discussions Section */}
      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search discussions, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </form>
          </div>

          {/* Discussions Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-500 hover:text-primary hover:scale-105 animate-fade-in-left">
              {pageData.popularDiscussions?.title || 'Popular Discussions'}
            </h2>
          </div>

          {/* Discussions List */}
          <div className="space-y-6">
            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map((discussion: any, index: number) => (
                <div key={index} className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-700 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-primary/25 hover:border-primary/50 hover:-translate-y-2 animate-bounce-in" style={{ animationDelay: `${1600 + (index * 150)}ms` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 transition-all duration-500 group-hover:text-primary">{discussion.title}</h3>
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
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  {searchQuery ? 'No discussions found' : 'No discussions yet'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? `No discussions match "${searchQuery}". Try different keywords.`
                    : 'Be the first to start a meaningful discussion in the FRIENDS Forum.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Discussion Categories */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {pageData.discussionCategories?.title || 'Discussion Categories'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {pageData.discussionCategories?.subtitle || 'Explore different topics and areas of interest within the FRIENDS Forum community.'}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pageData.discussionCategories?.categories?.map((category: any, index: number) => (
              <div key={index} className="group bg-background rounded-lg border p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 cursor-pointer">
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
            )) || Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-background rounded-lg border p-6 text-center">
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

function ForumPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-12 w-80 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
            <Skeleton className="h-12 w-48 mx-auto" />
          </div>
        </div>
      </section>

      {/* Search and Discussions Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-background rounded-lg border p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discussion Categories Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-background rounded-lg border p-6 text-center">
                <Skeleton className="h-12 w-12 mx-auto mb-4" />
                <Skeleton className="h-5 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

