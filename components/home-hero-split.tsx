import Link from "next/link"
import { type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroSlideshow, type HeroSlide } from "@/components/hero-slideshow"

type HeroCta = {
  text?: string
  action?: string
  targetPage?: string
}

/**
 * Split-layout hero: text panel (left) + image panel (right) share equal-but-distinct territory.
 * - Left panel: white background with serif headline; italic on "Nile Basin" for character.
 * - Right panel: image is rendered by a small client-only slideshow.
 *
 * This is a Server Component — only `HeroSlideshow` is shipped to the client. The text panel,
 * CTA, and layout are all static HTML, so the hero contributes zero JavaScript on its own.
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
  const href =
    cta?.action === "signup"
      ? "#signup"
      : cta?.targetPage || "/"

  const cleanTitle = normalizeWhitespace(title)
  const cleanSubtitle = normalizeWhitespace(subtitle)

  /*
   * lg:pt-* adds editorial breathing space above the hero from desktop up. The section bg
   * is white, so this shows as a clean white margin between the header and both panels
   * (text + image). Mobile already gets enough space from the image panel's own mt-6/mt-8.
   */
  return (
    <section className="relative w-full overflow-hidden bg-white lg:pt-4 xl:pt-6 2xl:pt-8 3xl:pt-10 4xl:pt-12">
      <div className="grid w-full grid-cols-1 lg:grid-cols-[5fr_7fr] lg:min-h-[420px] xl:min-h-[500px] 2xl:min-h-[600px] 3xl:min-h-[760px] 4xl:min-h-[920px]">
        {/* LEFT — text panel (appears below the image on mobile/tablet) */}
        <div className="relative isolate order-2 flex items-center bg-white py-10 sm:py-14 md:py-16 lg:order-1 lg:py-14 xl:py-20 2xl:py-24 3xl:py-28 4xl:py-32">
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
                /*
                  leading-[1.75] gives a touch more breathing room than `leading-relaxed`
                  (1.625) — the editorial reviewer asked for slightly looser line-height for
                  better readability, especially on mobile. text-pretty handles widow-balance.
                */
                <p className="max-w-lg text-pretty text-base leading-[1.75] text-neutral-600 sm:text-lg md:text-[1.125rem]">
                  {cleanSubtitle}
                </p>
              ) : null}

              {cta?.text ? (
                <div className="pt-1 sm:pt-2">
                  {/*
                    CTA pop:
                    - font-semibold + slightly larger tracking → reads more confidently.
                    - amber-tinted shadow + lift on hover → distinct hover state without
                      changing the brand colour.
                    - active:translate-y-0 returns the button to baseline on click for a
                      tactile press feel.
                  */}
                  <Button
                    asChild
                    size="lg"
                    className="group h-11 px-6 text-sm font-semibold tracking-wide shadow-md shadow-amber-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-700/30 active:translate-y-0 active:shadow-md sm:h-12 sm:px-7"
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
          RIGHT — image panel.
          - On mobile (<sm) the image is contained on both sides (mx-8) so it doesn't feel
            claustrophobic on narrow screens.
          - From sm up the image bleeds left to the viewport edge (where the text panel's
            white bg meets it at lg+) but its RIGHT edge aligns with the site .container's
            content-right rail, matching every other section below the hero.
            Below 2xl the container has flat 2rem padding (mr-8); from 2xl up the container
            caps at 1400 / 1720 / 2200, so the right offset is computed dynamically with the
            same math used by the text panel's pl-* values.
          - bg-stone-100 = soft warm neutral, only visible behind portrait photos (object-contain).
        */}
        <div className="relative order-1 overflow-hidden bg-stone-100 aspect-[16/9] lg:aspect-auto lg:order-2 lg:min-h-0 mt-6 mx-8 sm:mt-8 sm:ml-0 sm:mr-8 lg:mt-0 2xl:mr-[calc((100vw-1400px)/2+2rem)] 3xl:mr-[calc((100vw-1720px)/2+2rem)] 4xl:mr-[calc((100vw-2200px)/2+2rem)]">
          {slides.length > 0 ? (
            <HeroSlideshow
              slides={slides}
              intervalMs={6500}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              imageClassName="saturate-[0.92]"
              showDots
              /*
                `auto` decides per-slide based on aspect ratio:
                - Landscape-ish photos use `cover` → fill the panel exactly, no top/bottom gaps.
                - Portrait/odd-ratio photos (e.g. book covers) use `contain` → shown intact,
                  leftover space falls back to the panel's white background for a clean
                  magazine-style letterbox.
              */
              objectFit="auto"
            />
          ) : null}
        </div>
      </div>
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
