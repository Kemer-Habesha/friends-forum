"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Download, BookOpen, Filter } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { enhancedCachedClient, resourcesPageQuery } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"

export default function ResourcesPage() {
  const { openSignupModal } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFiltering, setIsFiltering] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await enhancedCachedClient.fetch(resourcesPageQuery)
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

  // Icon mapping for resource categories
  const iconMap: Record<string, React.ComponentType<any>> = {
    FileText,
    BookOpen,
    Report: FileText, // Using FileText as fallback for Report
    Presentation: BookOpen, // Using BookOpen as fallback for Presentation
  }

  if (loading) {
    return (
      <div className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="h-12 bg-muted rounded animate-pulse"></div>
            <div className="h-6 bg-muted rounded animate-pulse max-w-2xl mx-auto"></div>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="h-12 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
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
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Resources</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Resources Found</h1>
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
            <h1 className="text-4xl font-bold tracking-tight">{data.hero?.title || 'Resources'}</h1>
            <p className="text-xl text-muted-foreground">
              {data.hero?.subtitle || 'Access research papers, case studies, and reports related to the Nile Basin region.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={data.searchSection?.placeholder || "Search resources..."}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.featuredResources?.title || 'Featured Resources'}</h2>
            <Button
              variant={isFiltering ? "default" : "outline"}
              size="sm"
              onClick={() => setIsFiltering(!isFiltering)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter Resources
            </Button>
          </div>

          {isFiltering && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Filter Options</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  Research Papers
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  Case Studies
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  Reports
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  Presentations
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.featuredResources?.resources && data.featuredResources.resources.length > 0 ? (
              data.featuredResources.resources.map((resource: any, index: number) => (
                <div key={index} className="group relative overflow-hidden rounded-lg border bg-background p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{resource.type || 'Resource'}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                  {resource.authors && resource.authors.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <span>Authors: {resource.authors.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    {resource.readLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.open(resource.readLink, '_blank')
                        }}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Read
                      </Button>
                    )}
                    {resource.downloadLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.open(resource.downloadLink, '_blank')
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download {resource.fileFormat || 'PDF'}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Fallback content when no resources are available
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg border bg-background p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Research Paper</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Water Resource Management in the Nile Basin: Challenges and Opportunities
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This paper examines the current state of water resource management in the Nile Basin and identifies
                    key challenges and opportunities for sustainable development.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span>Authors: Dr. Abate Tadesse, Dr. Sarah Kimani</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert("Opening resource to read...")
                      }}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert("Downloading PDF...")
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                alert("Loading more resources...")
              }}
            >
              Load More Resources
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{data.resourceCategories?.title || 'Resource Categories'}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {data.resourceCategories?.subtitle || 'Browse resources by category to find the information you need.'}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.resourceCategories?.categories && data.resourceCategories.categories.length > 0 ? (
              data.resourceCategories.categories.map((category: any, index: number) => {
                const IconComponent = iconMap[category.icon] || FileText
                return (
                  <div key={index} className="bg-background rounded-lg p-6 text-center">
                    <div className="rounded-full bg-primary/10 p-3 inline-flex mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (category.action === 'navigate' && category.targetPage) {
                          // Navigate to target page
                          window.location.href = category.targetPage
                        } else if (category.action === 'filter') {
                          // Open filter for this category
                          setIsFiltering(true)
                        } else {
                          // Default action
                          alert(`Browsing ${category.title.toLowerCase()}...`)
                        }
                      }}
                    >
                      {category.buttonText}
                    </Button>
                  </div>
                )
              })
            ) : (
              // Fallback categories when none are available
              [
                {
                  title: 'Research Papers',
                  description: 'Academic research on water resources, climate change, and development in the Nile Basin.',
                  icon: 'FileText',
                  buttonText: 'Browse Papers',
                },
                {
                  title: 'Case Studies',
                  description: 'Detailed examinations of specific projects and initiatives in the Nile Basin region.',
                  icon: 'BookOpen',
                  buttonText: 'Browse Case Studies',
                },
                {
                  title: 'Reports',
                  description: 'Comprehensive reports on the state of water resources, development, and cooperation in the Nile Basin.',
                  icon: 'FileText',
                  buttonText: 'Browse Reports',
                },
                {
                  title: 'Presentations',
                  description: 'Slides and materials from past events and conferences hosted by the FRIENDS Forum.',
                  icon: 'BookOpen',
                  buttonText: 'Browse Presentations',
                },
              ].map((category, index) => {
                const IconComponent = iconMap[category.icon] || FileText
                return (
                  <div key={index} className="bg-background rounded-lg p-6 text-center">
                    <div className="rounded-full bg-primary/10 p-3 inline-flex mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert(`Browsing ${category.title.toLowerCase()}...`)
                      }}
                    >
                      {category.buttonText}
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            {data.submitResource?.image ? (
              <Image 
                src={urlFor(data.submitResource.image).url()} 
                alt="Submit Resource" 
                fill 
                className="object-cover" 
              />
            ) : (
              <Image 
                src="/placeholder.svg?height=400&width=600" 
                alt="Submit Resource" 
                fill 
                className="object-cover" 
              />
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.submitResource?.title || 'Submit a Resource'}</h2>
            <p className="text-muted-foreground">
              {data.submitResource?.description || 'We welcome submissions of research papers, case studies, and other resources related to the Nile Basin region. If you have a resource that you would like to share with the FRIENDS Forum community, please submit it for review.'}
            </p>
            <div className="pt-4">
              {data.submitResource?.ctaButton?.action === 'signup' ? (
                <Button onClick={openSignupModal}>
                  {data.submitResource.ctaButton.text || 'Submit a Resource'}
                </Button>
              ) : data.submitResource?.ctaButton?.action === 'navigate' && data.submitResource.ctaButton.targetPage ? (
                <Button onClick={() => window.location.href = data.submitResource.ctaButton.targetPage!}>
                  {data.submitResource.ctaButton.text || 'Submit a Resource'}
                </Button>
              ) : (
                <Button onClick={openSignupModal}>
                  Submit a Resource
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

