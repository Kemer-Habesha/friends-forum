"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Download, BookOpen } from "lucide-react"

interface Resource {
  title: string
  description: string
  type?: string
  authors?: string[]
  readLink?: string
  downloadLink?: string
  fileFormat?: string
}

async function downloadFile(url: string, filename: string) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
  }
}

export default function FeaturedResources({
  title,
  subtitle,
  resources,
}: {
  title: string
  subtitle?: string
  resources: Resource[] | undefined
}) {
  const [showAll, setShowAll] = useState(false)

  const visibleResources = showAll ? resources : resources?.slice(0, 9)

  return (
    <div className="space-y-8">
      <div className="text-center mb-12 animate-fade-in-up delay-1200">
        <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-700 hover:text-primary hover:scale-110 hover:rotate-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4 transition-all duration-300 hover:text-foreground">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleResources && visibleResources.length > 0 ? (
          visibleResources.map((resource, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-700 hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:shadow-primary/25 hover:border-primary/50 hover:-translate-y-3 animate-bounce-in delay-${1600 + index * 150}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <FileText className="h-5 w-5 text-primary transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                  <span className="text-sm font-medium transition-all duration-500 group-hover:text-primary group-hover:font-bold">
                    {resource.type || "Resource"}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 transition-all duration-500 group-hover:text-primary group-hover:scale-105">
                  {resource.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                  {resource.description}
                </p>
                {resource.authors && resource.authors.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                    <span>Authors: {resource.authors.join(", ")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  {resource.readLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-primary/25"
                      asChild
                    >
                      <a
                        href={resource.readLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Read
                      </a>
                    </Button>
                  )}
                  {resource.downloadLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-all duration-500 hover:scale-110 hover:-rotate-3 hover:shadow-lg hover:shadow-secondary/25"
                      onClick={() => {
                        const filename = resource.title
                          ? `${resource.title}.${resource.fileFormat?.toLowerCase() || "pdf"}`
                          : `resource.${resource.fileFormat?.toLowerCase() || "pdf"}`
                        downloadFile(resource.downloadLink!, filename)
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download {resource.fileFormat || "PDF"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No Resources Available</h3>
            <p className="text-muted-foreground">
              Check back soon for new resources and materials.
            </p>
          </div>
        )}
      </div>

      {resources && resources.length >= 10 && (
        <div className="flex justify-center animate-fade-in-up delay-1000">
          <Button
            variant="outline"
            className="transition-all duration-300 hover:scale-105 hover:shadow-md"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less Resources" : "Load More Resources"}
          </Button>
        </div>
      )}
    </div>
  )
}
