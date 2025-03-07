import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, Droplet, Lightbulb } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">About FRIENDS Forum</h1>
              <p className="text-xl text-muted-foreground">
                Building trust and cooperation through research, knowledge exchange, and cultural understanding.
              </p>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=600"
                alt="FRIENDS Forum Meeting"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Our History</h2>
            <p className="text-muted-foreground">
              The FRIENDS Forum was established in 2015 as a response to the growing need for collaborative approaches
              to address the complex challenges facing the Nile Basin region. Founded by Dr. Abate Tadesse and a group
              of dedicated researchers and practitioners, the forum has grown into an international platform that brings
              together diverse stakeholders from across the region and beyond.
            </p>
            <p className="text-muted-foreground">
              Over the years, we have facilitated numerous virtual and in-person meetings, research collaborations, and
              knowledge exchange initiatives that have contributed to greater understanding and cooperation among Nile
              Basin countries.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Our Objectives</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary mt-1">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Promote Research and Knowledge Exchange</h3>
                  <p className="text-muted-foreground">
                    Facilitate the sharing of scientific data, research findings, and best practices to inform policy
                    and decision-making processes related to Nile Basin water resources and development.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary mt-1">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Build Trust and Foster Cooperation</h3>
                  <p className="text-muted-foreground">
                    Create spaces for dialogue and understanding across cultures, disciplines, and borders to build
                    trust and promote cooperation among Nile Basin countries and stakeholders.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary mt-1">
                  <Droplet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Support Equitable Water Resource Management</h3>
                  <p className="text-muted-foreground">
                    Advocate for the equitable and sustainable use of Nile River water resources to meet the needs of
                    all countries in the basin while preserving the ecological integrity of the river system.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary mt-1">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Promote Infrastructure Development</h3>
                  <p className="text-muted-foreground">
                    Support the development of infrastructure projects that contribute to water, food, and energy
                    security in the Nile Basin region, with a focus on collaborative approaches and shared benefits.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Our Principles</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border p-6">
                <h3 className="font-bold text-lg mb-2">Inclusivity</h3>
                <p className="text-sm text-muted-foreground">
                  We welcome individuals from diverse backgrounds, disciplines, and perspectives to contribute to our
                  discussions and activities.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="font-bold text-lg mb-2">Scientific Rigor</h3>
                <p className="text-sm text-muted-foreground">
                  We are committed to promoting research and knowledge exchange based on sound scientific principles and
                  evidence.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="font-bold text-lg mb-2">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  We operate with openness and transparency in all our activities and decision-making processes.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="font-bold text-lg mb-2">Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  We believe in the power of collaborative approaches to address complex challenges and achieve shared
                  goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The FRIENDS Forum is led by a dedicated team of professionals with expertise in water resource management,
              international development, and regional cooperation.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-background rounded-lg p-6 text-center">
              <div className="relative h-32 w-32 mx-auto mb-4">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="Dr. Abate Tadesse"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="font-bold text-lg">Dr. Abate Tadesse</h3>
              <p className="text-sm text-muted-foreground mb-2">Founder & Director</p>
              <p className="text-sm text-muted-foreground">
                Dr. Tadesse has over 20 years of experience in water resource management and international development.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 text-center">
              <div className="relative h-32 w-32 mx-auto mb-4">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="Dr. Sarah Kimani"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="font-bold text-lg">Dr. Sarah Kimani</h3>
              <p className="text-sm text-muted-foreground mb-2">Research Coordinator</p>
              <p className="text-sm text-muted-foreground">
                Dr. Kimani leads our research initiatives and coordinates knowledge exchange activities.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 text-center">
              <div className="relative h-32 w-32 mx-auto mb-4">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="Mr. Ahmed Hassan"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="font-bold text-lg">Mr. Ahmed Hassan</h3>
              <p className="text-sm text-muted-foreground mb-2">Community Engagement Officer</p>
              <p className="text-sm text-muted-foreground">
                Mr. Hassan oversees our outreach efforts and builds partnerships with communities across the Nile Basin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Join Our Mission</h2>
          <p className="text-muted-foreground">
            We invite researchers, practitioners, policymakers, and other stakeholders to join us in our mission to
            promote collaboration, trust-building, and cooperation in the Nile Basin region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg">Become a Member</Button>
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

