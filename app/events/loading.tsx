import { Skeleton } from "@/components/ui/skeleton"

export default function EventsPageLoading() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-12 w-80 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      </section>

      {/* Upcoming Events Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-background rounded-lg border p-6">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-16 w-full mb-4" />
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>

      {/* Past Events Skeleton */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-background rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </section>

      {/* Host Event Skeleton */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </section>
    </div>
  )
}
