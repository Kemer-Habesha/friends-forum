import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, Users, Clock, ArrowRight } from "lucide-react"

export default function ForumPage() {
  return (
    <>
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">Discussion Forum</h1>
            <p className="text-xl text-muted-foreground">
              Engage in meaningful dialogue with researchers, experts, and stakeholders from across the Nile Basin
              region.
            </p>
            <div className="pt-4 flex justify-center">
              <Button size="lg">Join the Conversation</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search discussions..." className="pl-10" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Popular Discussions</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Latest
              </Button>
              <Button variant="outline" size="sm">
                Most Active
              </Button>
              <Button variant="outline" size="sm">
                Unanswered
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg border bg-background p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Sustainable Water Management Practices in the Nile Basin</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      What are some innovative approaches to sustainable water management that could be applied in the
                      Nile Basin region?
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        Water Management
                      </span>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        Sustainability
                      </span>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        Innovation
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>24 replies</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>12 participants</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>2 days ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative h-10 w-10">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="User Avatar"
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dr. Sarah Kimani</p>
                    <p className="text-xs text-muted-foreground">Research Coordinator</p>
                  </div>
                  <div className="ml-auto">
                    <Button>View Discussion</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline">Load More Discussions</Button>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Discussion Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse discussions by category to find topics that interest you.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-background rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Research & Knowledge Exchange</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discussions on research findings, methodologies, and knowledge sharing related to the Nile Basin.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">42 discussions</span>
                <Link href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                  Browse <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="bg-background rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Development Projects</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discussions on infrastructure development, project planning, and implementation in the Nile Basin.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">36 discussions</span>
                <Link href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                  Browse <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="bg-background rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Nile Basin Water Use</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discussions on water allocation, usage patterns, and equitable distribution of water resources.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">58 discussions</span>
                <Link href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                  Browse <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="bg-background rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Cultural Understanding</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discussions on cultural exchange, cross-border cooperation, and building trust among Nile Basin
                countries.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">29 discussions</span>
                <Link href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                  Browse <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Start a New Discussion</h2>
            <p className="text-muted-foreground">
              Have a question or topic you'd like to discuss with the FRIENDS Forum community? Start a new discussion to
              engage with researchers, experts, and stakeholders from across the Nile Basin region.
            </p>
            <div className="pt-4">
              <Button>Create New Topic</Button>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=400&width=600" alt="Forum Discussion" fill className="object-cover" />
          </div>
        </div>
      </section>
    </>
  )
}

