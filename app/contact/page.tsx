"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Globe, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { enhancedCachedClient, contactPageQuery } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"

export default function ContactPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await enhancedCachedClient.fetch(contactPageQuery)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

  // Icon mapping for contact methods
  const iconMap: Record<string, React.ComponentType<any>> = {
    Mail,
    Phone,
    MapPin,
    Globe,
    MessageCircle,
  }

  if (loading) {
    return (
      <div className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="h-12 bg-muted rounded animate-pulse"></div>
            <div className="h-6 bg-muted rounded animate-pulse max-w-2xl mx-auto"></div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse max-w-md"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse max-w-md"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Contact Page</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Contact Content Found</h1>
          <p className="text-muted-foreground">Please check back later or contact support.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">{data.hero?.title || 'Contact Us'}</h1>
            <p className="text-xl text-muted-foreground">
              {data.hero?.subtitle || 'Get in touch with the FRIENDS Forum team for inquiries, collaboration opportunities, or to learn more about our work.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{data.contactForm?.title || 'Get in Touch'}</h2>
              <p className="text-muted-foreground mt-2">
                {data.contactForm?.description || 'We\'d love to hear from you. Fill out the form below and we\'ll get back to you as soon as possible.'}
              </p>
            </div>
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
                <p className="font-medium">{data.contactForm?.successMessage?.title || 'Thank you for your message!'}</p>
                <p className="text-sm">{data.contactForm?.successMessage?.description || 'We\'ll get back to you as soon as possible.'}</p>
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {data.contactForm?.formFields?.firstName?.label || 'First Name'}
                  </label>
                  <Input
                    id="firstName"
                    placeholder={data.contactForm?.formFields?.firstName?.placeholder || "Enter your first name"}
                    value={formData.firstName}
                    onChange={handleChange}
                    required={data.contactForm?.formFields?.firstName?.required ?? true}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {data.contactForm?.formFields?.lastName?.label || 'Last Name'}
                  </label>
                  <Input
                    id="lastName"
                    placeholder={data.contactForm?.formFields?.lastName?.placeholder || "Enter your last name"}
                    value={formData.lastName}
                    onChange={handleChange}
                    required={data.contactForm?.formFields?.lastName?.required ?? true}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {data.contactForm?.formFields?.email?.label || 'Email'}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={data.contactForm?.formFields?.email?.placeholder || "Enter your email"}
                  value={formData.email}
                  onChange={handleChange}
                  required={data.contactForm?.formFields?.email?.required ?? true}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {data.contactForm?.formFields?.subject?.label || 'Subject'}
                </label>
                <Input
                  id="subject"
                  placeholder={data.contactForm?.formFields?.subject?.placeholder || "Enter the subject"}
                  value={formData.subject}
                  onChange={handleChange}
                  required={data.contactForm?.formFields?.subject?.required ?? true}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {data.contactForm?.formFields?.message?.label || 'Message'}
                </label>
                <Textarea
                  id="message"
                  placeholder={data.contactForm?.formFields?.message?.placeholder || "Enter your message"}
                  className={data.contactForm?.formFields?.message?.minHeight || "min-h-32"}
                  value={formData.message}
                  onChange={handleChange}
                  required={data.contactForm?.formFields?.message?.required ?? true}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (data.contactForm?.submitButton?.loadingText || "Sending...") : (data.contactForm?.submitButton?.text || "Send Message")}
              </Button>
            </form>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{data.contactInformation?.title || 'Contact Information'}</h2>
              <p className="text-muted-foreground mt-2">
                {data.contactInformation?.description || 'You can reach us through the following channels or visit our office.'}
              </p>
            </div>
            <div className="space-y-4">
              {data.contactInformation?.contactMethods && data.contactInformation.contactMethods.length > 0 ? (
                data.contactInformation.contactMethods.map((method: any, index: number) => {
                  const IconComponent = iconMap[method.icon] || Mail
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold">{method.title}</h3>
                        {method.details && method.details.map((detail: string, detailIndex: number) => (
                          <p key={detailIndex} className="text-sm text-muted-foreground">
                            {method.link ? (
                              <a 
                                href={method.link} 
                                className="hover:text-primary transition-colors"
                                target={method.link.startsWith('mailto:') || method.link.startsWith('tel:') ? undefined : '_blank'}
                                rel={method.link.startsWith('mailto:') || method.link.startsWith('tel:') ? undefined : 'noopener noreferrer'}
                              >
                                {detail}
                              </a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  )
                })
              ) : (
                // Fallback contact methods when none are available
                [
                  {
                    icon: 'Mail',
                    title: 'Email',
                    details: ['info@friendsforum.org', 'support@friendsforum.org'],
                    link: 'mailto:info@friendsforum.org',
                  },
                  {
                    icon: 'Phone',
                    title: 'Phone',
                    details: ['+1 (123) 456-7890', '+1 (123) 456-7891'],
                    link: 'tel:+11234567890',
                  },
                  {
                    icon: 'MapPin',
                    title: 'Office',
                    details: ['123 Nile Avenue', 'Addis Ababa, Ethiopia'],
                  },
                ].map((method, index) => {
                  const IconComponent = iconMap[method.icon] || Mail
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold">{method.title}</h3>
                        {method.details && method.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-sm text-muted-foreground">
                            {method.link ? (
                              <a 
                                href={method.link} 
                                className="hover:text-primary transition-colors"
                                target={method.link.startsWith('mailto:') || method.link.startsWith('tel:') ? undefined : '_blank'}
                                rel={method.link.startsWith('mailto:') || method.link.startsWith('tel:') ? undefined : 'noopener noreferrer'}
                              >
                                {detail}
                              </a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              {data.contactInformation?.mapImage ? (
                <Image
                  src={urlFor(data.contactInformation.mapImage).url()}
                  alt="Office Location Map"
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/placeholder.svg?height=300&width=600"
                  alt="Office Location Map"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{data.faq?.title || 'Frequently Asked Questions'}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {data.faq?.subtitle || 'Find answers to common questions about the FRIENDS Forum and our work.'}
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {data.faq?.questions && data.faq.questions.length > 0 ? (
              data.faq.questions.map((faq: any, index: number) => (
                <div key={index} className="rounded-lg border bg-background p-6">
                  <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))
            ) : (
              // Fallback FAQ when none are available
              [
                {
                  question: 'How can I join the FRIENDS Forum?',
                  answer: 'You can join the FRIENDS Forum by completing the membership application form on our website. Membership is open to researchers, practitioners, policymakers, and other stakeholders interested in the Nile Basin region.',
                },
                {
                  question: 'Are there membership fees?',
                  answer: 'Basic membership to the FRIENDS Forum is free. However, there may be fees for certain events, workshops, or premium resources. Members receive discounted rates for these activities.',
                },
                {
                  question: 'How can I contribute to the forum?',
                  answer: 'There are many ways to contribute to the FRIENDS Forum, including submitting research papers, participating in discussions, attending events, and collaborating on projects. Contact us to learn more about specific opportunities.',
                },
                {
                  question: 'Can I propose a collaboration or partnership?',
                  answer: 'Yes, we welcome collaboration and partnership proposals from organizations and individuals whose work aligns with our mission. Please use the contact form to submit your proposal or reach out to us directly.',
                },
              ].map((faq, index) => (
                <div key={index} className="rounded-lg border bg-background p-6">
                  <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )
}

