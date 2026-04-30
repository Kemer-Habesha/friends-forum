"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type HeroSlide = {
  src: string
  alt: string
  /** Intrinsic pixels from Sanity; used so the hero height matches the photo (no letterboxing). */
  width: number
  height: number
}

const DEFAULT_INTERVAL_MS = 6500

export function HeroSlideshow({
  slides,
  intervalMs = DEFAULT_INTERVAL_MS,
  fill = false,
  imageClassName,
  sizes = "100vw",
  showDots = false,
  dotsClassName,
  pauseOnHover = true,
  objectFit = "cover",
}: {
  slides: HeroSlide[]
  intervalMs?: number
  /** Fill the nearest positioned ancestor instead of sizing by the active slide's aspect ratio. */
  fill?: boolean
  /** Extra classes applied to each foreground <Image>; used for effects like desaturation. */
  imageClassName?: string
  /** Passed through to next/image sizes prop for the foreground image. */
  sizes?: string
  /** Render built-in indicator dots when there is more than one slide. */
  showDots?: boolean
  /** Extra positioning classes for the dots container. */
  dotsClassName?: string
  /** Pause autoplay while the slideshow is hovered. */
  pauseOnHover?: boolean
  /**
   * `cover` (default): images fill the panel and crop overflow.
   * `contain`: images are shown in their entirety; leftover space falls back to whatever the
   * panel's background colour is (clean magazine-style letterbox).
   * `auto`: decides per-slide based on its aspect ratio — landscape-ish photos use `cover`
   * (fill the panel, no top/bottom gaps), portrait/odd-ratio photos use `contain`.
   */
  objectFit?: "cover" | "contain" | "auto"
}) {
  const [index, setIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const indexRef = useRef(index)
  indexRef.current = index

  const count = slides.length

  // Pause autoplay when the tab is hidden — saves CPU and avoids skipping ahead on tab return.
  useEffect(() => {
    if (typeof document === "undefined") return
    const handle = () => setIsVisible(!document.hidden)
    handle()
    document.addEventListener("visibilitychange", handle)
    return () => document.removeEventListener("visibilitychange", handle)
  }, [])

  useEffect(() => {
    if (count <= 1 || !isVisible) return
    if (pauseOnHover && isHovered) return
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [count, intervalMs, isHovered, isVisible, pauseOnHover])

  // Clamp index if slides shrink at runtime.
  useEffect(() => {
    if (index >= count && count > 0) setIndex(0)
  }, [count, index])

  /**
   * LCP: only the first hero image should compete for bandwidth on first paint. All slides were
   * previously mounted at once (same viewport box), so non-priority images still loaded early.
   * After idle (or single slide), mount the rest for smooth autoplay/crossfade.
   */
  const [mountAllSlideImages, setMountAllSlideImages] = useState(count <= 1)
  useEffect(() => {
    if (count <= 1) return
    let cancelled = false
    const done = () => {
      if (!cancelled) setMountAllSlideImages(true)
    }
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(done, { timeout: 2500 })
      return () => {
        cancelled = true
        window.cancelIdleCallback(id)
      }
    }
    const t = window.setTimeout(done, 200)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [count])

  if (count === 0) {
    return null
  }

  const active = slides[index]!
  const aspectStyle = { aspectRatio: `${active.width} / ${active.height}` }

  const shouldRenderSlideImage = (i: number) =>
    mountAllSlideImages || i === index || i === 0

  const rootClass = fill
    ? "absolute inset-0 overflow-hidden"
    : "relative w-full overflow-hidden bg-black"

  return (
    <div
      className={rootClass}
      style={fill ? undefined : aspectStyle}
      onMouseEnter={pauseOnHover ? () => setIsHovered(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setIsHovered(false) : undefined}
    >
      {slides.map((slide, i) => {
        const isActive = i === index
        const showImage = shouldRenderSlideImage(i)
        const slideFit = resolveSlideFit(slide, objectFit)
        return (
          <div
            key={`${slide.src}-${i}`}
            className="absolute inset-0 overflow-hidden transition-opacity duration-700 ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
            }}
            aria-hidden={!isActive}
          >
            {showImage ? (
              <Image
                src={slide.src}
                alt={isActive ? slide.alt : ""}
                fill
                sizes={sizes}
                className={cn(
                  slideFit === "contain"
                    ? "object-contain object-center"
                    : "object-cover object-center",
                  imageClassName
                )}
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
              />
            ) : null}
          </div>
        )
      })}

      {showDots && count > 1 ? (
        /*
          Dots live inside a soft dark "pill" so they remain legible regardless of what
          colour the underlying image is. The pill uses backdrop-blur so it gracefully
          adapts to bright or busy backgrounds without darkening the photo itself.
        */
        <div
          className={cn(
            "absolute z-20 flex items-center gap-1.5 rounded-full bg-black/25 px-1.5 py-1 backdrop-blur-md ring-1 ring-white/10",
            dotsClassName ?? "bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8"
          )}
          role="tablist"
          aria-label="Hero image slides"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1} of ${count}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full transition-colors touch-manipulation",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                i === index
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Decide how a single slide should be fit into the panel.
 *
 * In `auto` mode, photos with a landscape-ish aspect ratio (≥ ~1.2) use `cover` so they fill
 * the panel without leaving top/bottom gaps. Portraits and roughly-square photos use
 * `contain` so they aren't cropped — the panel's background colour fills the leftover side
 * space (clean magazine letterbox).
 *
 * The 1.2 threshold is intentionally a touch below 4:3 (1.33) so that 4:3 photos still get
 * `cover` treatment — anything narrower than that is treated as portrait/odd-shape.
 */
function resolveSlideFit(
  slide: HeroSlide,
  mode: "cover" | "contain" | "auto"
): "cover" | "contain" {
  if (mode !== "auto") return mode
  if (!slide.width || !slide.height) return "cover"
  const ratio = slide.width / slide.height
  return ratio >= 1.2 ? "cover" : "contain"
}
