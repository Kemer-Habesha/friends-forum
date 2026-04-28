"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroSlideshow, type HeroSlide } from "@/components/hero-slideshow"
import { cn } from "@/lib/utils"

type HeroCta = {
  text?: string
  action?: string
  targetPage?: string
}

/**
 * Split-layout hero: text panel (left) + image panel (right) share equal-but-distinct territory.
 * - Left panel: white background with serif headline; italic on "Nile Basin" for character.
 * - Right panel: image is lightly desaturated, fades at its left edge into the text panel, and
 *   eases into a slow zoom on hover.
 */
export function HomeHeroSplit({
  title,
  subtitle,
  slides,
  cta,
}: {
  title: string
  subtitle: string
  slides: HeroSlide[]
  cta?: HeroCta | null
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [slideIndex, setSlideIndex] = useState(0)

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

  const href =
    cta?.action === "signup"
      ? "#signup"
      : cta?.targetPage || "/"

  const cleanTitle = normalizeWhitespace(title)
  const cleanSubtitle = normalizeWhitespace(subtitle)

  const showDots = slides.length > 1

  const content = (
    <div className="grid w-full grid-cols-1 lg:grid-cols-[5fr_7fr] lg:min-h-[420px] xl:min-h-[500px] 2xl:min-h-[600px] 3xl:min-h-[760px] 4xl:min-h-[920px]">
      {/* LEFT — text panel (appears below the image on mobile/tablet) */}
      <div className="relative isolate order-2 flex items-center bg-white py-10 sm:py-14 md:py-16 lg:order-1 lg:py-14 xl:py-20 2xl:py-24 3xl:py-28 4xl:py-32">
        {/* thin vertical accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-amber-500/70 to-transparent"
        />

        {/*
          Align the hero text with the site .container's content-left at every
          breakpoint. The site container is FLUID below 2xl (width: 100%,
          padding: 2rem), then caps at 1400 / 1720 / 2200 at 2xl / 3xl / 4xl.
          Below 2xl a flat px-8 mirrors the container's padding; from 2xl up
          we switch to asymmetric padding that grows with the viewport so the
          headline stays in the same vertical column as sections beneath it.
        */}
        <div className="relative z-10 w-full px-8 2xl:pl-[calc((100vw-1400px)/2+2rem)] 2xl:pr-16 3xl:pl-[calc((100vw-1720px)/2+2rem)] 3xl:pr-20 4xl:pl-[calc((100vw-2200px)/2+2rem)] 4xl:pr-24">
          <div className="w-full max-w-xl space-y-4 text-left animate-fade-in-up sm:space-y-5 md:space-y-6">
            <h1 className="font-serif text-[clamp(2rem,1.5rem+2vw,4rem)] font-medium leading-[1.08] tracking-tight text-neutral-900 sm:leading-[1.05]">
              {renderHeadline(cleanTitle)}
            </h1>

            {cleanSubtitle ? (
              <p className="max-w-lg text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg md:text-[1.125rem]">
                {cleanSubtitle}
              </p>
            ) : null}

            {cta?.text ? (
              <div className="pt-1 sm:pt-2">
                <Button
                  asChild
                  size="lg"
                  className="group h-11 px-6 text-sm font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 sm:h-12 sm:px-7"
                >
                  <Link href={href}>
                    {cta.text}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/*
        RIGHT — image panel. On mobile it appears FIRST (order-1) as the
        visual hook and stays contained (mx-8) so it doesn't feel claustrophobic
        on narrow screens. From sm up the image bleeds full-width to both
        viewport edges for a dramatic, uninterrupted look — the text panel
        below (or beside, at lg+) still stays on the container rails.
      */}
      <div className="group relative order-1 overflow-hidden bg-neutral-100 aspect-[16/9] lg:aspect-auto lg:order-2 lg:min-h-0 mt-6 mx-8 sm:mt-8 sm:mx-0 lg:mt-0">
        {slides.length > 0 ? (
          <HeroSlideshow
            slides={slides}
            intervalMs={6500}
            index={slideIndex}
            onIndexChange={setSlideIndex}
            fill
            sizes="(min-width: 1024px) 58vw, (min-width: 640px) 100vw, 100vw"
            imageClassName={cn(
              "saturate-[0.88] transition-transform ease-out will-change-transform",
              "[transition-duration:7000ms] group-hover:scale-[1.06]"
            )}
          />
        ) : null}

        {showDots ? (
          <div
            className="absolute bottom-5 right-5 z-20 flex gap-2 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10"
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
        ) : null}
      </div>
    </div>
  )

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white"
    >
      {reduceMotion ? (
        <div className="relative w-full">{content}</div>
      ) : (
        <motion.div className="relative w-full" style={{ opacity }}>
          {content}
        </motion.div>
      )}
    </section>
  )
}

/**
 * Trim leading/trailing whitespace and collapse any internal runs (spaces,
 * tabs, newlines, NBSPs) into a single space so stray CMS whitespace never
 * reaches the DOM.
 */
function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ")
}

/**
 * Italicize the phrase "Nile Basin" (case-insensitive, first match) inside the headline — the
 * Cormorant italic has genuine character and gives the title a quiet flourish.
 */
function renderHeadline(title: string): ReactNode {
  if (!title) return null
  const re = /nile basin/i
  const match = title.match(re)
  if (!match || match.index === undefined) return title

  const start = match.index
  const end = start + match[0].length
  const before = title.slice(0, start)
  const hit = title.slice(start, end)
  const after = title.slice(end)

  return (
    <>
      {before}
      <em className="font-serif italic font-normal text-neutral-900">{hit}</em>
      {after}
    </>
  )
}
