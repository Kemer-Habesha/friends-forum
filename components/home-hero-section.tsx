"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { HeroSlideshow, type HeroSlide } from "@/components/hero-slideshow"
import { cn } from "@/lib/utils"

/**
 * Hero height follows each slide’s intrinsic aspect ratio. Dots sit above the text layer so they
 * stay tappable; the text wrapper uses pointer-events-none with pointer-events-auto on children.
 */
export function HomeHeroSection({
  slides,
  children,
}: {
  slides: HeroSlide[]
  children: ReactNode
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    setSlideIndex((i) => {
      if (slides.length === 0) return 0
      return i >= slides.length ? 0 : i
    })
  }, [slides.length])
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const showDots = slides.length > 1

  const stack = (
    <>
      <HeroSlideshow
        slides={slides}
        intervalMs={6000}
        index={slideIndex}
        onIndexChange={setSlideIndex}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-primary/40 to-primary/20"
        aria-hidden
      />
    </>
  )

  const slideDots = showDots ? (
    <div
      className="absolute left-1/2 z-[20] flex -translate-x-1/2 gap-2 sm:bottom-5 sm:gap-2.5 bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
      role="tablist"
      aria-label="Hero image slides"
    >
      {slides.map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === slideIndex}
          aria-label={`Show slide ${i + 1} of ${slides.length}`}
          onClick={() => setSlideIndex(i)}
          className={cn(
            "h-2 w-2 shrink-0 rounded-full border border-white/70 transition-all touch-manipulation sm:h-2.5 sm:w-2.5",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            i === slideIndex
              ? "scale-110 bg-white shadow-sm"
              : "bg-white/35 hover:bg-white/60"
          )}
        />
      ))}
    </div>
  ) : null

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
      <div className="relative w-full">
        {reduceMotion ? (
          <div className="relative z-0 w-full overflow-hidden">{stack}</div>
        ) : (
          <motion.div
            className="relative z-0 w-full overflow-hidden"
            style={{ opacity }}
          >
            {stack}
          </motion.div>
        )}

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center py-[clamp(0.375rem,1.5vw,0.75rem)] sm:py-8 md:py-10">
          <div className="pointer-events-auto w-full min-h-0">{children}</div>
        </div>
        {slideDots}
      </div>
    </section>
  )
}
