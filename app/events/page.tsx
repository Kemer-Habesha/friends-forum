import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

export default function EventsPage() {
  return (
    <>
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">Events & Meetings</h1>
            <p className="text-xl text-muted-foreground">
              Join our virtual and in-person meetings to connect with researchers, technical experts, and professionals
              from across the Nile Basin region.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar View
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                My Events
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg border bg-background p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">June 15-17, 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Annual Nile Basin Research Conference</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A three-day virtual conference bringing together researchers and practitioners to discuss the latest
                  findings and innovations in water resource management.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Virtual Event</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>9:00 AM - 5:00 PM EAT</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Register Now
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline">Load More Events</Button>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Past Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore highlights and resources from our previous events and meetings.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-background rounded-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Water Resource Management Workshop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>March 10-12, 2024</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Water Resource Management Workshop</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A hands-on workshop focused on innovative approaches to water resource management in the Nile Basin
                  region.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Summary
                  </Button>
                  <Button variant="outline" size="sm">
                    Download Materials
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Nile Basin Development Forum"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>November 5-7, 2023</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Nile Basin Development Forum</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A high-level forum bringing together policymakers, researchers, and practitioners to discuss
                  development challenges and opportunities in the Nile Basin.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Summary
                  </Button>
                  <Button variant="outline" size="sm">
                    Download Materials
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Button variant="outline">View All Past Events</Button>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Host an Event</h2>
            <p className="text-muted-foreground">
              We welcome proposals for events and meetings that align with our mission and objectives. If you are
              interested in hosting an event in collaboration with the FRIENDS Forum, please contact us.
            </p>
            <div className="pt-4">
              <Button>Submit a Proposal</Button>
            </div>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=300&width=600"
              alt="Event Collaboration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  )
}

