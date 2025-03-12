"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

export default function ContactPage() {
  const { openSignupModal } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData)
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      })

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <>
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with the FRIENDS Forum team for inquiries, collaboration opportunities, or to learn more
              about our work.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Get in Touch</h2>
              <p className="text-muted-foreground mt-2">
                We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
                <p className="font-medium">Thank you for your message!</p>
                <p className="text-sm">We'll get back to you as soon as possible.</p>
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Enter the subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  className="min-h-32"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Contact Information</h2>
              <p className="text-muted-foreground mt-2">
                You can reach us through the following channels or visit our office.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-sm text-muted-foreground">info@friendsforum.org</p>
                  <p className="text-sm text-muted-foreground">support@friendsforum.org</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Phone</h3>
                  <p className="text-sm text-muted-foreground">+1 (123) 456-7890</p>
                  <p className="text-sm text-muted-foreground">+1 (123) 456-7891</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Office</h3>
                  <p className="text-sm text-muted-foreground">123 Nile Avenue</p>
                  <p className="text-sm text-muted-foreground">Addis Ababa, Ethiopia</p>
                </div>
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=600"
                alt="Office Location Map"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about the FRIENDS Forum and our work.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="rounded-lg border bg-background p-6">
              <h3 className="font-bold text-lg mb-2">How can I join the FRIENDS Forum?</h3>
              <p className="text-muted-foreground">
                You can join the FRIENDS Forum by completing the membership application form on our website. Membership
                is open to researchers, practitioners, policymakers, and other stakeholders interested in the Nile Basin
                region.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="font-bold text-lg mb-2">Are there membership fees?</h3>
              <p className="text-muted-foreground">
                Basic membership to the FRIENDS Forum is free. However, there may be fees for certain events, workshops,
                or premium resources. Members receive discounted rates for these activities.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="font-bold text-lg mb-2">How can I contribute to the forum?</h3>
              <p className="text-muted-foreground">
                There are many ways to contribute to the FRIENDS Forum, including submitting research papers,
                participating in discussions, attending events, and collaborating on projects. Contact us to learn more
                about specific opportunities.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="font-bold text-lg mb-2">Can I propose a collaboration or partnership?</h3>
              <p className="text-muted-foreground">
                Yes, we welcome collaboration and partnership proposals from organizations and individuals whose work
                aligns with our mission. Please use the contact form to submit your proposal or reach out to us
                directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

