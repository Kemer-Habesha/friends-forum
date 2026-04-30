'use client'

import { useEffect } from 'react'

/**
 * Registers the service worker in production after the browser is idle, so the SW request
 * doesn't compete with the page's critical rendering path (LCP, hydration). In dev we
 * actively unregister any old SW so it cannot intercept Next dev server requests.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    if (process.env.NODE_ENV === 'development') {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => void r.unregister()))
        .catch(() => {})
      return
    }

    let cancelled = false
    const register = () => {
      if (cancelled) return
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (!newWorker) return
            newWorker.addEventListener('statechange', () => {
              // New content available; deliberately silent — UX hook can be added later if needed.
            })
          })
        })
        .catch(() => {})

      // Auto-reload once a new worker takes control so users see fresh content without a hard refresh.
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        window.location.reload()
      })
    }

    /*
     * Delay registration until the main thread is idle (or page has been interactive for a moment)
     * so the SW network/parse work doesn't push out LCP. Falls back to a small timeout in browsers
     * without requestIdleCallback (Safari).
     */
    const ric = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined
    let idleId: number | undefined
    let timeoutId: number | undefined

    if (ric) {
      idleId = ric(register, { timeout: 4000 })
    } else {
      timeoutId = window.setTimeout(register, 2500)
    }

    return () => {
      cancelled = true
      const cic = (window as any).cancelIdleCallback as
        | ((id: number) => void)
        | undefined
      if (idleId !== undefined && cic) cic(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [])

  return null
}
