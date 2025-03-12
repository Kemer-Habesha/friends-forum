"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Download, BookOpen, Filter } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

export default function ResourcesPage() {
  const { openSignupModal } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFiltering, setIsFiltering] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`)
    }
  }

  return (
    <>
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">Resources</h1>
            <p className="text-xl text-muted-foreground">
              Access research papers, case studies, and reports related to the Nile Basin region.
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
                placeholder="Search resources..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Featured Resources</h2>
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
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
                      // In a real app, this would open the resource to read
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
                      // In a real app, this would download the PDF
                      alert("Downloading PDF...")
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                // In a real app, this would load more resources
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
            <h2 className="text-3xl font-bold tracking-tight mb-4">Resource Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse resources by category to find the information you need.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-background rounded-lg p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 inline-flex mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Research Papers</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Academic research on water resources, climate change, and development in the Nile Basin.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // In a real app, this would navigate to research papers
                  alert("Browsing research papers...")
                }}
              >
                Browse Papers
              </Button>
            </div>
            <div className="bg-background rounded-lg p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 inline-flex mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Case Studies</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed examinations of specific projects and initiatives in the Nile Basin region.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // In a real app, this would navigate to case studies
                  alert("Browsing case studies...")
                }}
              >
                Browse Case Studies
              </Button>
            </div>
            <div className="bg-background rounded-lg p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 inline-flex mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Reports</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive reports on the state of water resources, development, and cooperation in the Nile Basin.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // In a real app, this would navigate to reports
                  alert("Browsing reports...")
                }}
              >
                Browse Reports
              </Button>
            </div>
            <div className="bg-background rounded-lg p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 inline-flex mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 2v8" />
                  <path d="m4.93 10.93 1.41 1.41" />
                  <path d="M2 18h2" />
                  <path d="M20 18h2" />
                  <path d="m19.07 10.93-1.41 1.41" />
                  <path d="M22 22H2" />
                  <path d="m8 22 4-10 4 10" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Presentations</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Slides and materials from past events and conferences hosted by the FRIENDS Forum.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // In a real app, this would navigate to presentations
                  alert("Browsing presentations...")
                }}
              >
                Browse Presentations
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=400&width=600" alt="Submit Resource" fill className="object-cover" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Submit a Resource</h2>
            <p className="text-muted-foreground">
              We welcome submissions of research papers, case studies, and other resources related to the Nile Basin
              region. If you have a resource that you would like to share with the FRIENDS Forum community, please
              submit it for review.
            </p>
            <div className="pt-4">
              <Button onClick={openSignupModal}>Submit a Resource</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

