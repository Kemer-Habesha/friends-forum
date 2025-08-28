"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText, Download, BookOpen } from "lucide-react"
import { resourcesPageQuery } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"
import { useState, useCallback } from "react"
import { useSanityQuery, queryKeys } from "@/hooks/useSanityQuery"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Helper functions for video embedding
function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.includes('youtube.com/watch?v=') 
    ? url.split('v=')[1]?.split('&')[0]
    : url.includes('youtu.be/') 
    ? url.split('youtu.be/')[1]?.split('?')[0]
    : null
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

function getVimeoEmbedUrl(url: string): string {
  const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url
}

function getVideoThumbnail(videoUrl: string): string | null {
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    const videoId = videoUrl.includes('youtube.com/watch?v=') 
      ? videoUrl.split('v=')[1]?.split('&')[0]
      : videoUrl.includes('youtu.be/') 
      ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
      : null
    
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }
  
  if (videoUrl.includes('vimeo.com')) {
    const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0]
    return videoId ? `https://vumbnail.com/${videoId}.jpg` : null
  }
  
  return null
}

// Helper function to get Google Drive embed URL
function getGoogleDriveEmbedUrl(url: string): string {
  // Extract file ID from Google Drive URL
  const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1] || 
                 url.match(/id=([a-zA-Z0-9-_]+)/)?.[1]
  
  if (fileId) {
    // Return the embed URL format
    return `https://drive.google.com/file/d/${fileId}/preview`
  }
  return url
}

// Helper function to check if URL is Google Drive
function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com') && (url.includes('/file/d/') || url.includes('id='))
}

export default function ResourcesPage() {
  const [showAllResources, setShowAllResources] = useState(false)
  const [playingVideos, setPlayingVideos] = useState<{ [key: string]: boolean }>({})
  const [videoRefs, setVideoRefs] = useState<{ [key: string]: HTMLIFrameElement | HTMLVideoElement | null }>({})
  const { data, isLoading, error } = useSanityQuery(
    queryKeys.resourcesPage,
    resourcesPageQuery
  )

  const toggleVideo = (videoId: string) => {
    setPlayingVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }))
  }

  const pauseVideo = (videoId: string) => {
    const videoElement = videoRefs[videoId]
    if (videoElement) {
      if (videoElement.tagName === 'VIDEO') {
        const video = videoElement as HTMLVideoElement
        if (video.paused) {
          video.play()
        } else {
          video.pause()
        }
      } else if (videoElement.tagName === 'IFRAME') {
        // For iframes, we can't directly control play/pause, so we'll reload to pause
        const iframe = videoElement as HTMLIFrameElement
        const currentSrc = iframe.src
        if (currentSrc.includes('autoplay=1')) {
          // Remove autoplay to pause
          iframe.src = currentSrc.replace('autoplay=1', 'autoplay=0')
        } else {
          // Add autoplay to play
          iframe.src = currentSrc.replace('autoplay=0', 'autoplay=1')
        }
      }
    }
  }

  // Memoized ref callback to prevent infinite loops
  const setVideoRef = useCallback((videoId: string, element: HTMLIFrameElement | HTMLVideoElement | null) => {
    if (element && !videoRefs[videoId]) {
      setVideoRefs(prev => ({ ...prev, [videoId]: element }))
    }
  }, [videoRefs])

  // Function to force download of files
  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback to regular download if fetch fails
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
    }
  }

  if (isLoading) {
    return <ResourcesPageSkeleton />
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

  return (
    <>
      <section className="bg-muted py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-fade-in-scale" />
        <div className="container relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight transition-all duration-700 hover:text-primary hover:scale-110 hover:rotate-1 animate-bounce-in">
              {(pageData?.hero?.title || 'Resources').split('').map((letter: string, index: number) => (
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
              {pageData?.hero?.subtitle || 'Access research papers, case studies, and reports related to the Nile Basin region.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="text-center mb-12 animate-fade-in-up delay-1200">
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-700 hover:text-primary hover:scale-110 hover:rotate-1">{pageData?.featuredResources?.title || 'Featured Resources'}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4 transition-all duration-300 hover:text-foreground">
              {pageData?.featuredResources?.subtitle || 'Access our curated collection of research papers, case studies, and reports.'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pageData?.featuredResources?.resources && pageData.featuredResources.resources.length > 0 ? (
              (showAllResources 
                ? pageData.featuredResources.resources 
                : pageData.featuredResources.resources.slice(0, 9)
              ).map((resource: any, index: number) => (
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
                          onClick={() => {
                            const filename = resource.title ? `${resource.title}.${resource.fileFormat?.toLowerCase() || 'pdf'}` : `resource.${resource.fileFormat?.toLowerCase() || 'pdf'}`
                            downloadFile(resource.downloadLink, filename)
                          }}
                        >
                          <Download className="h-4 w-4 mr-2 transition-all duration-500 hover:scale-125 hover:-rotate-12" />
                          Download {resource.fileFormat || 'PDF'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // No resources message
              <div className="col-span-full text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No Resources Available</h3>
                <p className="text-muted-foreground">
                  Check back soon for new resources and materials.
                </p>
              </div>
            )}
          </div>

          {pageData?.featuredResources?.resources && pageData.featuredResources.resources.length >= 10 && (
            <div className="flex justify-center animate-fade-in-up delay-1000">
              <Button 
                variant="outline" 
                className="transition-all duration-300 hover:scale-105 hover:shadow-md"
                onClick={() => {
                  if (showAllResources) {
                    setShowAllResources(false)
                  } else {
                    setShowAllResources(true)
                  }
                }}
              >
                {showAllResources ? 'Show Less Resources' : 'Load More Resources'}
              </Button>
            </div>
          )}
        </div>
      </section>

      {pageData?.videos?.videoList && pageData.videos.videoList.length > 0 && (
        <TooltipProvider>
          <section className="container py-12 md:py-24">
            <div className="space-y-8">
              <div className="text-center mb-12 animate-fade-in-up delay-1100">
                <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-primary">
                  {pageData.videos.title || 'Featured Videos'}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto transition-all duration-300 hover:text-foreground">
                  {pageData.videos.subtitle || 'Watch informative videos, presentations, and documentaries related to the Nile Basin region and water resources management.'}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {pageData.videos.videoList.map((video: any, index: number) => (
                <div key={index} className={`group relative overflow-hidden rounded-lg border bg-background transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 hover:border-primary/50 hover:-translate-y-2 animate-bounce-in delay-${1600 + (index * 150)} flex flex-col h-full`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Video Thumbnail/Embed */}
                    <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
                      {video.videoUrl && playingVideos[`video-${index}`] ? (
                        <div className="w-full h-full">
                          {/* YouTube Embed */}
                          {video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
                            <iframe
                              ref={(el) => setVideoRef(`video-${index}`, el)}
                              src={`${getYouTubeEmbedUrl(video.videoUrl)}?autoplay=1&mute=1`}
                              title={video.title}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : video.videoUrl.includes('vimeo.com') ? (
                            <iframe
                              ref={(el) => setVideoRef(`video-${index}`, el)}
                              src={`${getVimeoEmbedUrl(video.videoUrl)}?autoplay=1&muted=1`}
                              title={video.title}
                              className="w-full h-48"
                              frameBorder="0"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                            />
                          ) : isGoogleDriveUrl(video.videoUrl) ? (
                            /* Google Drive Embed with Fallback */
                            <div className="relative w-full h-full">
                              <iframe
                                ref={(el) => setVideoRef(`video-${index}`, el)}
                                src={getGoogleDriveEmbedUrl(video.videoUrl)}
                                title={video.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                onError={() => {
                                  console.error('Google Drive video failed to load. Check sharing permissions.')
                                }}
                              />
                              {/* Fallback message if iframe fails */}
                              <div className="absolute inset-0 bg-muted/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <div className="text-center p-4">
                                  <p className="text-sm text-muted-foreground mb-2">Video may require proper sharing permissions</p>
                                  <a 
                                    href={video.videoUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline"
                                  >
                                    Open in Google Drive
                                  </a>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Direct video file */
                            <video
                              ref={(el) => setVideoRef(`video-${index}`, el)}
                              className="w-full h-full object-cover"
                              controls
                              autoPlay
                              muted
                              preload="metadata"
                            >
                              <source src={video.videoUrl} type="video/mp4" />
                              <source src={video.videoUrl} type="video/webm" />
                              <source src={video.videoUrl} type="video/ogg" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      ) : video.thumbnail ? (
                        <div 
                          className="relative w-full h-full cursor-pointer"
                          onClick={() => toggleVideo(`video-${index}`)}
                        >
                          <Image
                            src={urlFor(video.thumbnail).url()}
                            alt={video.title}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-110"
                          />
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : getVideoThumbnail(video.videoUrl) ? (
                        <div 
                          className="relative w-full h-full cursor-pointer"
                          onClick={() => toggleVideo(`video-${index}`)}
                        >
                          <Image
                            src={getVideoThumbnail(video.videoUrl)!}
                            alt={video.title}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-110"
                          />
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-full bg-muted flex items-center justify-center cursor-pointer"
                          onClick={() => toggleVideo(`video-${index}`)}
                        >
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                            <p className="text-sm text-muted-foreground">Video Content</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        <span className="text-sm font-medium text-primary">{video.type || 'Video'}</span>
                        {video.duration && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {video.duration}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 transition-all duration-500 group-hover:text-primary group-hover:scale-105">
                        {video.title}
                      </h3>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground line-clamp-3 overflow-hidden cursor-help" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical' as const,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {video.description}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                            className="max-w-xs p-3 text-sm leading-relaxed"
                            sideOffset={8}
                          >
                            <p>{video.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {video.speaker && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                          <span>Speaker: {video.speaker}</span>
                        </div>
                      )}
                      
                      {video.date && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                          <span>Date: {new Date(video.date).toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Spacer to push button to bottom */}
                      <div className="flex-grow"></div>

                      <div className="flex justify-center mt-4">
                        {video.videoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-primary/25"
                            onClick={() => {
                              if (playingVideos[`video-${index}`]) {
                                pauseVideo(`video-${index}`)
                              } else {
                                toggleVideo(`video-${index}`)
                              }
                            }}
                          >
                            <svg className="h-4 w-4 mr-2 transition-all duration-500 hover:scale-125 hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                            {playingVideos[`video-${index}`] ? 'Pause Video' : 'Play Video'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
          </TooltipProvider>
      )}

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in-up delay-1100">
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-primary">{pageData?.resourceCategories?.title || 'Resource Categories'}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto transition-all duration-300 hover:text-foreground">
              {pageData?.resourceCategories?.subtitle || 'Browse resources by category to find the information you need.'}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pageData?.resourceCategories?.categories && pageData.resourceCategories.categories.length > 0 ? (
              pageData.resourceCategories.categories.map((category: any, index: number) => {
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
                },
                {
                  title: 'Case Studies',
                  description: 'Detailed examinations of specific projects and initiatives in the Nile Basin region.',
                  icon: 'BookOpen',
                },
                {
                  title: 'Reports',
                  description: 'Comprehensive reports on the state of water resources, development, and cooperation in the Nile Basin.',
                  icon: 'FileText',
                },
                {
                  title: 'Presentations',
                  description: 'Slides and materials from past events and conferences hosted by the FRIENDS Forum.',
                  icon: 'BookOpen',
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
            {pageData?.submitResource?.image ? (
              <Image 
                src={urlFor(pageData.submitResource.image).url()} 
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-primary">{pageData?.submitResource?.title || 'Submit a Resource'}</h2>
            <p className="text-muted-foreground max-w-2xl transition-all duration-300 hover:text-foreground">
              {pageData?.submitResource?.description || 'We welcome submissions of research papers, case studies, and other resources related to the Nile Basin region. If you have a resource that you would like to share with the FRIENDS Forum community, please submit it for review.'}
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

function ResourcesPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Section Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-9 w-24" />
            </div>
            <Skeleton className="h-6 w-96" />
          </div>
        </div>
      </section>

      {/* Resources Section Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Skeleton className="h-8 w-48" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg border bg-background p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </section>

      {/* Videos Section Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-2xl mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg border bg-background">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-4 w-24 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories Section Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-2xl mx-auto" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-background rounded-lg p-6 text-center">
                <Skeleton className="h-12 w-12 mx-auto mb-4 rounded-full" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-16 w-full mx-auto mb-4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Resource Section Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>
    </div>
  )
}

