"use client"

import {
  type CSSProperties,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { cn } from "@/lib/utils"

const XL_QUERY = "(min-width: 1280px)"

function subscribeLargeScreen(cb: () => void) {
  const mq = window.matchMedia(XL_QUERY)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}

function getLargeScreenSnapshot() {
  return window.matchMedia(XL_QUERY).matches
}

function getLargeScreenServerSnapshot() {
  return false
}

/** Match rendered headline: flex row lines, tight leading */
const MEASURE_CLASS =
  "w-[42rem] max-w-none break-words text-left text-6xl font-bold leading-none tracking-tight [line-height:1]"

/**
 * Strip leading/trailing whitespace and collapse internal whitespace runs
 * (spaces, tabs, newlines, NBSPs) into a single space. Keeps the headline
 * measurement and letter animation from getting confused by stray spaces
 * coming out of the CMS.
 */
function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ")
}

function measureLines(title: string, container: HTMLDivElement): string[] {
  const segments = title.split(/(\s+)/)
  container.innerHTML = ""
  let lastTop: number | null = null
  const chunks: string[][] = [[]]

  for (const seg of segments) {
    if (seg === "") continue
    const span = document.createElement("span")
    span.textContent = seg
    container.appendChild(span)
    const top = span.offsetTop
    if (lastTop !== null && top > lastTop) {
      chunks.push([])
    }
    chunks[chunks.length - 1].push(seg)
    lastTop = top
  }

  const lines = chunks.map((parts) => parts.join("")).filter((l) => l.length > 0)
  return lines.length > 0 ? lines : [title]
}

function renderAnimatedLine(
  line: string,
  letterIndexStart: number
): { node: ReactNode; lettersUsed: number } {
  let letterIndex = letterIndexStart
  let lettersUsed = 0

  const row: ReactNode[] = []
  line.split(/(\s+)/).forEach((segment: string, segIndex: number) => {
    if (segment === "") return

    if (/^\s+$/.test(segment)) {
      row.push(
        <span key={`s-${segIndex}`} className="inline shrink-0 whitespace-pre">
          {segment}
        </span>
      )
      return
    }

    row.push(
      <span
        key={`w-${segIndex}`}
        className="inline-flex shrink-0 flex-row items-center gap-0"
      >
        {segment.split("").map((letter: string, li: number) => {
          const index = letterIndex++
          lettersUsed += 1
          return (
            <span
              key={li}
              className="inline-flex shrink-0 items-center justify-center leading-none transition-all duration-300 xl:hover:scale-110 xl:hover:rotate-3 xl:hover:text-transparent xl:hover:bg-clip-text letter-hover"
              style={
                {
                  "--hover-bg": `linear-gradient(45deg, hsl(${35 + index * 15}, 60%, ${50 + index * 5}%), hsl(${35 + index * 15 + 20}, 70%, ${60 + index * 5}%))`,
                } as CSSProperties
              }
            >
              {letter}
            </span>
          )
        })}
      </span>
    )
  })

  return {
    node: (
      <span className="flex min-h-0 min-w-0 w-full flex-nowrap items-center gap-0 leading-none [line-height:1]">
        {row}
      </span>
    ),
    lettersUsed,
  }
}

/**
 * Line breaks follow a one-time measurement at desktop width + largest type size.
 * Animated lines use flex rows (not inline-block) to avoid baseline struts and empty spans.
 */
export function HeroTitle({
  title,
  className,
}: {
  title: string
  className?: string
}) {
  const measureRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<string[] | null>(null)

  const normalizedTitle = normalizeWhitespace(title)

  const useAnimated = useSyncExternalStore(
    subscribeLargeScreen,
    getLargeScreenSnapshot,
    getLargeScreenServerSnapshot
  )

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el || !normalizedTitle) {
      setLines(normalizedTitle ? [normalizedTitle] : [])
      return
    }
    setLines(measureLines(normalizedTitle, el))
  }, [normalizedTitle])

  const displayLines = lines ?? (normalizedTitle ? [normalizedTitle] : [])

  const lineBlocks: ReactNode[] = []
  let letterOffset = 0
  for (let i = 0; i < displayLines.length; i++) {
    const line = displayLines[i]!
    if (useAnimated) {
      const { node, lettersUsed } = renderAnimatedLine(line, letterOffset)
      letterOffset += lettersUsed
      lineBlocks.push(
        <span key={i} className="block min-h-0 min-w-0 w-full">
          {node}
        </span>
      )
    } else {
      lineBlocks.push(
        <span
          key={i}
          className="block min-h-0 min-w-0 w-full leading-none [line-height:1]"
        >
          {line}
        </span>
      )
    }
  }

  return (
    <>
      <div
        ref={measureRef}
        aria-hidden
        className={`pointer-events-none absolute left-[-9999px] top-0 ${MEASURE_CLASS}`}
      />
      <h1
        className={cn(
          className,
          "flex flex-col items-start gap-y-0 leading-none [line-height:1]"
        )}
      >
        {lineBlocks}
      </h1>
    </>
  )
}
