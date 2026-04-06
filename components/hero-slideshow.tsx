"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

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
  index: controlledIndex,
  onIndexChange,
}: {
  slides: HeroSlide[]
  intervalMs?: number
  /** When set with `onIndexChange`, slideshow is controlled (e.g. for external dot indicators). */
  index?: number
  onIndexChange?: (index: number) => void
}) {
  const [internalIndex, setInternalIndex] = useState(0)
  const controlled =
    typeof controlledIndex === "number" && typeof onIndexChange === "function"
  const index = controlled ? controlledIndex : internalIndex
  const setIndex = controlled ? onIndexChange! : setInternalIndex

  const indexRef = useRef(index)
  indexRef.current = index

  const count = slides.length

  useEffect(() => {
    if (count <= 1) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) return
    const id = window.setInterval(() => {
      const next = (indexRef.current + 1) % count
      setIndex(next)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [count, intervalMs, setIndex])

  useEffect(() => {
    if (controlledIndex !== undefined && controlledIndex >= count) {
      onIndexChange?.(0)
    }
  }, [count, controlledIndex, onIndexChange])

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

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={aspectStyle}
    >
      {slides.map((slide, i) => {
        const isActive = i === index
        const showImage = shouldRenderSlideImage(i)
        return (
          <div
            key={`${slide.src}-${i}`}
            className="absolute inset-0 overflow-hidden transition-opacity duration-hero-crossfade ease-in-out"
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
                sizes="100vw"
                className="object-cover object-center [transform:translateZ(0)]"
                priority={i === 0 && index === 0}
                loading={i === 0 && index === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 && index === 0 ? "high" : "low"}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
