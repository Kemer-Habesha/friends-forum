"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { urlFor } from "@/lib/sanity"

interface SanityImageProps {
  src: any
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fallbackSrc?: string
}

export function SanityImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  priority = false,
  fallbackSrc = "/placeholder.svg"
}: SanityImageProps) {
  const [imgSrc, setImgSrc] = useState<string>("")
  const [hasError, setHasError] = useState(false)

  // Generate Sanity URL
  const generateSanityUrl = () => {
    try {
      if (!src) return fallbackSrc
      return urlFor(src).url()
    } catch (error) {
      console.warn('Failed to generate Sanity image URL:', error)
      return fallbackSrc
    }
  }

  // Handle image load error
  const handleError = () => {
    setHasError(true)
    setImgSrc(fallbackSrc)
  }

  // Set initial image source
  useEffect(() => {
    if (src && !hasError) {
      setImgSrc(generateSanityUrl())
    } else {
      setImgSrc(fallbackSrc)
    }
  }, [src, hasError, fallbackSrc])

  // If no dimensions provided and not using fill, use default
  const imageProps = fill ? {} : {
    width: width || 400,
    height: height || 300
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      {...imageProps}
      className={className}
      priority={priority}
      onError={handleError}
      onLoad={() => setHasError(false)}
      sizes={fill ? "100vw" : undefined}
    />
  )
}
