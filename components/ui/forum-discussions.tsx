"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, Users, Clock } from "lucide-react"
import { urlFor } from "@/lib/sanity"

interface Discussion {
  title: string
  description: string
  tags?: string[]
  replyCount: number
  participantCount: number
  lastActivity: string
  link?: string
  author?: {
    name: string
    title?: string
    avatar?: any
  }
}

export default function ForumDiscussions({
  sectionTitle,
  discussions,
}: {
  sectionTitle: string
  discussions: Discussion[]
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = discussions.filter((discussion) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (discussion.title?.toLowerCase() || "").includes(q) ||
      (discussion.description?.toLowerCase() || "").includes(q) ||
      (discussion.tags || []).some((t) => t.toLowerCase().includes(q)) ||
      (discussion.author?.name?.toLowerCase() || "").includes(q)
    )
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-8">
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight transition-all duration-500 hover:text-primary hover:scale-105 animate-fade-in-left">
          {sectionTitle}
        </h2>
      </div>

      <div className="space-y-6">
        {filtered.length > 0 ? (
          filtered.map((discussion, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-700 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-primary/25 hover:border-primary/50 hover:-translate-y-2 animate-bounce-in"
              style={{ animationDelay: `${1600 + index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 transition-all duration-500 group-hover:text-primary">
                      {discussion.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                      {discussion.description}
                    </p>
                    {discussion.tags && discussion.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-500 hover:border-primary hover:text-primary hover:scale-110 hover:rotate-3"
                          >
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
                        alt={`${discussion.author?.name || "User"} Avatar`}
                        fill
                        className="object-cover rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium transition-all duration-500 group-hover:text-primary group-hover:scale-105">
                      {discussion.author?.name || "Anonymous User"}
                    </p>
                    <p className="text-xs text-muted-foreground transition-all duration-500 group-hover:text-foreground">
                      {discussion.author?.title || "Member"}
                    </p>
                  </div>
                  {discussion.link && (
                    <div className="ml-auto">
                      <Button
                        className="transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-primary/25"
                        asChild
                      >
                        <a
                          href={discussion.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Discussion
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {searchQuery ? "No discussions found" : "No discussions yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No discussions match "${searchQuery}". Try different keywords.`
                : "Be the first to start a meaningful discussion in the FRIENDS Forum."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
