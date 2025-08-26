import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Download, BookOpen, Filter } from "lucide-react"
import { enhancedCachedClient, resourcesPageQuery } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"

// Server-side data fetching
async function getResourcesPageData() {
  try {
    const data = await enhancedCachedClient.fetch<any>(resourcesPageQuery)
    return data
  } catch (error) {
    console.error('Failed to fetch resources page data:', error)
    return null
  }
}

export default async function ResourcesPage() {
  const data = await getResourcesPageData()

  if (!data) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
        <p className="text-muted-foreground">Failed to load page content. Please try again later.</p>
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
              {(data?.hero?.title || 'Resources').split('').map((letter: string, index: number) => (
                <span
                  key={index}
                  className="inline-block transition-all duration-500 hover:scale-125 hover:rotate-12 hover:text-primary animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </h1>
            <p className="text-xl text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-105 animate-fade-in-up delay-800">
              {data?.hero?.subtitle || 'Access research papers, case studies, and reports related to the Nile Basin region.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="max-w-3xl mx-auto animate-slide-in-bottom delay-1000">
            <form className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:text-primary" />
              <Input
                placeholder={data?.searchSection?.placeholder || "Search resources..."}
                className="pl-10 transition-all duration-500 hover:border-primary focus:border-primary hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                readOnly
              />
            </form>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-left delay-1200">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-700 hover:text-primary hover:scale-110 hover:rotate-1">{data?.featuredResources?.title || 'Featured Resources'}</h2>
            <Button variant="outline" size="sm" className="transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-primary/25 animate-fade-in-right delay-1400">
              <Filter className="h-4 w-4 mr-2 transition-all duration-500 hover:scale-125 hover:rotate-12" />
              Filter Resources
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.featuredResources?.resources && data.featuredResources.resources.length > 0 ? (
              data.featuredResources.resources.map((resource: any, index: number) => (
                <div key={index} className={`group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-700 hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:shadow-primary/25 hover:border-primary/50 hover:-translate-y-3 animate-bounce-in delay-${1600 + (index * 150)}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <FileText className="h-5 w-5 text-primary transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                      <span className="text-sm font-medium transition-all duration-500 group-hover:text-primary group-hover:font-bold">{resource.type || 'Resource'}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 transition-all duration-500 group-hover:text-primary group-hover:scale-105">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                      {resource.description}
                    </p>
                    {resource.authors && resource.authors.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                        <span>Authors: {resource.authors.join(', ')}</span>
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
                          <a href={resource.readLink} target="_blank" rel="noopener noreferrer">
                            <BookOpen className="h-4 w-4 mr-2 transition-all duration-500 hover:scale-125 hover:rotate-12" />
                            Read
                          </a>
                        </Button>
                      )}
                      {resource.downloadLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="transition-all duration-500 hover:scale-110 hover:-rotate-3 hover:shadow-lg hover:shadow-secondary/25"
                          asChild
                        >
                          <a href={resource.downloadLink} target="_blank" rel="noopener noreferrer" download>
                            <Download className="h-4 w-4 mr-2 transition-all duration-500 hover:scale-125 hover:-rotate-12" />
                            Download {resource.fileFormat || 'PDF'}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback content when no resources are available
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-700 hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:shadow-primary/25 hover:border-primary/50 hover:-translate-y-3 animate-bounce-in delay-${1600 + (i * 150)}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <FileText className="h-5 w-5 text-primary transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                      <span className="text-sm font-medium transition-all duration-500 group-hover:text-primary group-hover:font-bold">Research Paper</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 transition-all duration-500 group-hover:text-primary group-hover:scale-105">
                      Water Resource Management in the Nile Basin: Challenges and Opportunities
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                      This paper examines the current state of water resource management in the Nile Basin and identifies
                      key challenges and opportunities for sustainable development.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                      <span>Authors: Dr. Abate Tadesse, Dr. Sarah Kimani</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm" className="transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-primary/25" asChild>
                        <a href="/resources/read" target="_blank">
                          <BookOpen className="h-4 w-4 mr-2 transition-all duration-500 hover:scale-125 hover:rotate-12" />
                          Read
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="transition-all duration-500 hover:scale-110 hover:-rotate-3 hover:shadow-lg hover:shadow-secondary/25" asChild>
                        <a href="/sample-resource.pdf" download>
                          <Download className="h-4 w-4 mr-2 transition-all duration-500 hover:scale-125 hover:-rotate-12" />
                          Download PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center animate-fade-in-up delay-1000">
            <Button variant="outline" className="transition-all duration-300 hover:scale-105 hover:shadow-md" disabled>
              Load More Resources
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in-up delay-1100">
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-primary">{data?.resourceCategories?.title || 'Resource Categories'}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto transition-all duration-300 hover:text-foreground">
              {data?.resourceCategories?.subtitle || 'Browse resources by category to find the information you need.'}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data?.resourceCategories?.categories && data.resourceCategories.categories.length > 0 ? (
              data.resourceCategories.categories.map((category: any, index: number) => {
                const IconComponent = iconMap[category.icon] || FileText
                return (
                  <div key={index} className={`bg-background rounded-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up delay-${1200 + (index * 100)}`}>
                    <div className="rounded-full bg-primary/10 p-3 inline-flex mx-auto mb-4 transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                      <IconComponent className="h-6 w-6 text-primary transition-all duration-300 hover:scale-110" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 transition-all duration-300 hover:text-primary">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 transition-all duration-300 hover:text-foreground">
                      {category.description}
                    </p>
                    <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-md" disabled>
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
                  <div key={index} className={`bg-background rounded-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up delay-${1200 + (index * 100)}`}>
                    <div className="bg-primary/10 p-3 inline-flex mx-auto mb-4 transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                      <IconComponent className="h-6 w-6 text-primary transition-all duration-300 hover:scale-110" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 transition-all duration-300 hover:text-primary">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 transition-all duration-300 hover:text-foreground">
                      {category.description}
                    </p>
                    <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-md" disabled>
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
          <div className="relative h-[400px] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 animate-fade-in-left delay-1600">
            {data?.submitResource?.image ? (
              <Image 
                src={urlFor(data.submitResource.image).url()} 
                alt="Submit Resource" 
                fill 
                className="object-cover transition-all duration-300 hover:scale-110" 
              />
            ) : (
              <Image 
                src="/placeholder.svg?height=400&width=600" 
                alt="Submit Resource" 
                fill 
                className="object-cover transition-all duration-300 hover:scale-110" 
              />
            )}
          </div>
          <div className="space-y-4 animate-fade-in-right delay-1600">
            <h2 className="text-3xl font-bold tracking-tight transition-all duration-300 hover:text-primary">{data?.submitResource?.title || 'Submit a Resource'}</h2>
            <p className="text-muted-foreground transition-all duration-300 hover:text-foreground">
              {data?.submitResource?.description || 'We welcome submissions of research papers, case studies, and other resources related to the Nile Basin region. If you have a resource that you would like to share with the FRIENDS Forum community, please submit it for review.'}
            </p>
            <div className="pt-4">
              <Button className="transition-all duration-300 hover:scale-110 hover:shadow-lg" asChild>
                <a href="/contact">
                  Submit a Resource
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Icon mapping for resource categories
const iconMap: Record<string, React.ComponentType<any>> = {
  FileText,
  BookOpen,
  Report: FileText, // Using FileText as fallback for Report
  Presentation: BookOpen, // Using BookOpen as fallback for Presentation
}

