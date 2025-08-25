'use client'

import { useEffect } from 'react'

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      let lcpObserver: PerformanceObserver | undefined
      let fidObserver: PerformanceObserver | undefined
      let clsObserver: PerformanceObserver | undefined
      let resourceObserver: PerformanceObserver | undefined

      // Monitor Largest Contentful Paint (LCP)
      try {
        lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as PerformanceEntry
          
          // Report to analytics if needed
          if (lastEntry.startTime > 2500) {
            console.warn('LCP is above 2.5s threshold:', lastEntry.startTime)
          }
        })
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.warn('LCP observer not supported')
      }

      // Monitor First Input Delay (FID)
      try {
        fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            const inputEntry = entry as PerformanceEventTiming
            if (inputEntry.processingStart && inputEntry.startTime) {
              const delay = inputEntry.processingStart - inputEntry.startTime
              if (delay > 100) {
                console.warn('FID is above 100ms threshold:', delay)
              }
            }
          })
        })
        
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        console.warn('FID observer not supported')
      }

      // Monitor Cumulative Layout Shift (CLS)
      let clsValue = 0
      try {
        clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as LayoutShift
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value
            }
          }
          
          if (clsValue > 0.1) {
            console.warn('CLS is above 0.1 threshold:', clsValue)
          }
        })
        
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('CLS observer not supported')
      }

      // Monitor Time to First Byte (TTFB)
      try {
        const navigationEntries = performance.getEntriesByType('navigation')
        if (navigationEntries.length > 0) {
          const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming
          if (navigationEntry.responseStart && navigationEntry.requestStart) {
            const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
            
            if (ttfb > 600) {
              console.warn('TTFB is above 600ms threshold:', ttfb)
            }
          }
        }
      } catch (e) {
        console.warn('TTFB monitoring not supported')
      }

      // Monitor resource loading
      try {
        resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming
              if (resourceEntry.duration > 1000) {
                console.warn('Slow resource load:', resourceEntry.name, resourceEntry.duration)
              }
            }
          })
        })
        
        resourceObserver.observe({ entryTypes: ['resource'] })
      } catch (e) {
        console.warn('Resource observer not supported')
      }

      return () => {
        lcpObserver?.disconnect()
        fidObserver?.disconnect()
        clsObserver?.disconnect()
        resourceObserver?.disconnect()
      }
    }
  }, [])

  return null // This component doesn't render anything
}

// Type definitions for better TypeScript support
interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number
  startTime: number
}
