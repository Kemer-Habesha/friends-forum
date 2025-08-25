import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <section className="relative h-[500px] bg-muted">
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-2xl space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Focus Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background p-6 rounded-lg border">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forum Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>

      {/* Newsletter Skeleton */}
      <section className="bg-primary py-12 md:py-24">
        <div className="container text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-8" />
          <Skeleton className="h-12 w-80 mx-auto" />
        </div>
      </section>
    </div>
  )
}
