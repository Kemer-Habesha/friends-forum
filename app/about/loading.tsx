import { Skeleton } from "@/components/ui/skeleton"

export default function AboutPageLoading() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <Skeleton className="h-12 w-80" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-32 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background rounded-lg p-6 text-center">
                <Skeleton className="h-32 w-32 mx-auto mb-4 rounded-full" />
                <Skeleton className="h-5 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
          <div className="flex gap-4 justify-center pt-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </section>
    </div>
  )
}
