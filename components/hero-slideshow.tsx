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

  if (count === 0) {
    return null
  }

  const active = slides[index]!
  const aspectStyle = { aspectRatio: `${active.width} / ${active.height}` }

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={aspectStyle}
    >
      {slides.map((slide, i) => {
        const isActive = i === index
        return (
          <div
            key={`${slide.src}-${i}`}
            className="absolute inset-0 overflow-hidden transition-opacity duration-[1100ms] ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
            }}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.src}
              alt={isActive ? slide.alt : ""}
              fill
              sizes="100vw"
              className="object-cover object-center [transform:translateZ(0)]"
              priority={i === 0}
            />
          </div>
        )
      })}
    </div>
  )
}
