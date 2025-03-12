"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, BookOpen, ArrowRight } from "lucide-react"
import NewsletterForm from "@/components/ui/newsletter-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function Home() {
  const { openSignupModal } = useAuth()
  const router = useRouter()

  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/20 z-10" />
        <div className="relative h-[500px] w-full">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nile_basin-QijHQiQkRcIvYvqremYat78oE5DLuk.jpeg"
            alt="Nile Basin Development: Water, Energy, and Agriculture"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-md">
                Building Bridges Across the Nile Basin
              </h1>
              <p className="text-xl text-white/90 drop-shadow">
                An international platform for research, knowledge exchange, and development support
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="w-full sm:w-auto" onClick={openSignupModal}>
                  Get Involved
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/90 hover:bg-white"
                  onClick={() => router.push("/about")}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
            <p className="text-muted-foreground">
              The FRIENDS Forum promotes collaboration, trust-building, and cooperation across countries in the Nile
              Basin and beyond. We create a welcoming, open environment for individuals from diverse backgrounds to
              engage in discussions on the common good.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link href="/about" className="inline-flex items-center gap-2 text-primary hover:underline">
                Learn more about our mission <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Our Focus</h2>
            <ul className="grid gap-4">
              <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Research & Knowledge Exchange</h3>
                  <p className="text-sm text-muted-foreground">
                    Facilitating the sharing of scientific data and research to inform policy and practice
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Trust Building & Cooperation</h3>
                  <p className="text-sm text-muted-foreground">
                    Creating spaces for dialogue and understanding across cultures and borders
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Equitable Resource Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Promoting fair and sustainable use of Nile Basin water resources for all countries
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-3xl">
              Join our virtual and in-person meetings to connect with researchers, technical experts, and professionals
              from across the Nile Basin region.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Virtual Event</span>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      openSignupModal()
                    }}
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/events" className="inline-flex items-center gap-2 text-primary hover:underline">
              View all events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=400&width=600" alt="Forum Discussion" fill className="object-cover" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Join the Discussion</h2>
            <p className="text-muted-foreground">
              Our forum provides a space for experts, researchers, and stakeholders to engage in meaningful dialogue
              about the challenges and opportunities in the Nile Basin region.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Research & Knowledge Exchange</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Development Projects</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Nile Basin Water Use</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Cultural Understanding</span>
              </li>
            </ul>
            <div className="pt-4">
              <Button onClick={() => router.push("/forum")}>Join the Forum</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-12 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Stay Connected</h2>
            <p className="max-w-2xl text-primary-foreground/90">
              Subscribe to our newsletter to receive updates on upcoming events, new resources, and forum discussions
              related to the Nile Basin region.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}

