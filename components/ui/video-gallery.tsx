"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { urlFor } from "@/lib/sanity"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Video {
  title: string
  description: string
  type?: string
  duration?: string
  speaker?: string
  date?: string
  thumbnail?: any
  videoUrl: string
  transcriptLink?: string
  tags?: string[]
}

function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.includes("youtube.com/watch?v=")
    ? url.split("v=")[1]?.split("&")[0]
    : url.includes("youtu.be/")
      ? url.split("youtu.be/")[1]?.split("?")[0]
      : null
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

function getVimeoEmbedUrl(url: string): string {
  const videoId = url.split("vimeo.com/")[1]?.split("?")[0]
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url
}

function getVideoThumbnail(videoUrl: string): string | null {
  if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
    const videoId = videoUrl.includes("youtube.com/watch?v=")
      ? videoUrl.split("v=")[1]?.split("&")[0]
      : videoUrl.includes("youtu.be/")
        ? videoUrl.split("youtu.be/")[1]?.split("?")[0]
        : null
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null
  }
  if (videoUrl.includes("vimeo.com")) {
    const videoId = videoUrl.split("vimeo.com/")[1]?.split("?")[0]
    return videoId ? `https://vumbnail.com/${videoId}.jpg` : null
  }
  return null
}

function getGoogleDriveEmbedUrl(url: string): string {
  const fileId =
    url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1] ||
    url.match(/id=([a-zA-Z0-9-_]+)/)?.[1]
  if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`
  return url
}

function isGoogleDriveUrl(url: string): boolean {
  return (
    url.includes("drive.google.com") &&
    (url.includes("/file/d/") || url.includes("id="))
  )
}

export default function VideoGallery({
  title,
  subtitle,
  videos,
}: {
  title: string
  subtitle?: string
  videos: Video[]
}) {
  const [showAll, setShowAll] = useState(false)
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({})
  const [videoRefs, setVideoRefs] = useState<
    Record<string, HTMLIFrameElement | HTMLVideoElement | null>
  >({})

  const toggleVideo = (videoId: string) => {
    setPlayingVideos((prev) => ({ ...prev, [videoId]: !prev[videoId] }))
  }

  const pauseVideo = (videoId: string) => {
    const el = videoRefs[videoId]
    if (!el) return
    if (el.tagName === "VIDEO") {
      const v = el as HTMLVideoElement
      v.paused ? v.play() : v.pause()
    } else if (el.tagName === "IFRAME") {
      const iframe = el as HTMLIFrameElement
      const src = iframe.src
      iframe.src = src.includes("autoplay=1")
        ? src.replace("autoplay=1", "autoplay=0")
        : src.replace("autoplay=0", "autoplay=1")
    }
  }

  const setVideoRef = useCallback(
    (videoId: string, element: HTMLIFrameElement | HTMLVideoElement | null) => {
      if (element && !videoRefs[videoId]) {
        setVideoRefs((prev) => ({ ...prev, [videoId]: element }))
      }
    },
    [videoRefs]
  )

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="text-center mb-12 animate-fade-in-up delay-1100">
          <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-300 hover:text-primary">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto transition-all duration-300 hover:text-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {(showAll ? videos : videos.slice(0, 6)).map((video, index) => {
            const key = `video-${index}`
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-lg border bg-background transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 hover:border-primary/50 hover:-translate-y-2 animate-bounce-in delay-${1600 + index * 150} flex flex-col h-full`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
                    {video.videoUrl && playingVideos[key] ? (
                      <div className="w-full h-full">
                        {video.videoUrl.includes("youtube.com") ||
                        video.videoUrl.includes("youtu.be") ? (
                          <iframe
                            ref={(el) => setVideoRef(key, el)}
                            src={`${getYouTubeEmbedUrl(video.videoUrl)}?autoplay=1&mute=1`}
                            title={video.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : video.videoUrl.includes("vimeo.com") ? (
                          <iframe
                            ref={(el) => setVideoRef(key, el)}
                            src={`${getVimeoEmbedUrl(video.videoUrl)}?autoplay=1&muted=1`}
                            title={video.title}
                            className="w-full h-48"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          />
                        ) : isGoogleDriveUrl(video.videoUrl) ? (
                          <div className="relative w-full h-full">
                            <iframe
                              ref={(el) => setVideoRef(key, el)}
                              src={getGoogleDriveEmbedUrl(video.videoUrl)}
                              title={video.title}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="autoplay; fullscreen"
                              allowFullScreen
                            />
                            <div className="absolute inset-0 bg-muted/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                              <div className="text-center p-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                  Video may require proper sharing permissions
                                </p>
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
                          <video
                            ref={(el) => setVideoRef(key, el)}
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
                        onClick={() => toggleVideo(key)}
                      >
                        <Image
                          src={urlFor(video.thumbnail).url()}
                          alt={video.title}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                            <svg
                              className="w-8 h-8 text-white ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : getVideoThumbnail(video.videoUrl) ? (
                      <div
                        className="relative w-full h-full cursor-pointer"
                        onClick={() => toggleVideo(key)}
                      >
                        <Image
                          src={getVideoThumbnail(video.videoUrl)!}
                          alt={video.title}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                            <svg
                              className="w-8 h-8 text-white ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-full h-full bg-muted flex items-center justify-center cursor-pointer"
                        onClick={() => toggleVideo(key)}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-primary"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Video Content
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="text-sm font-medium text-primary">
                        {video.type || "Video"}
                      </span>
                      {video.duration && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {video.duration}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold mb-2 transition-all duration-500 group-hover:text-primary group-hover:scale-105">
                      {video.title}
                    </h3>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p
                          className="text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground line-clamp-3 overflow-hidden cursor-help"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical" as const,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
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

                    {video.speaker && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                        <span>Speaker: {video.speaker}</span>
                      </div>
                    )}

                    {video.date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 transition-all duration-500 group-hover:text-foreground">
                        <span>
                          Date: {new Date(video.date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex-grow"></div>

                    <div className="flex justify-center mt-4">
                      {video.videoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-primary/25"
                          onClick={() => {
                            if (playingVideos[key]) {
                              pauseVideo(key)
                            } else {
                              toggleVideo(key)
                            }
                          }}
                        >
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          {playingVideos[key] ? "Pause Video" : "Play Video"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {videos.length > 6 && (
          <div className="flex justify-center animate-fade-in-up delay-1000">
            <Button
              variant="outline"
              className="transition-all duration-300 hover:scale-105 hover:shadow-md"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less Videos" : "Load More Videos"}
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
