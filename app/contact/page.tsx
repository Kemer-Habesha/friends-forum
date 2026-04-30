import Image from "next/image"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { sanityFetch, contactPageQuery, urlFor } from "@/lib/sanity"
import ContactForm from "@/components/ui/contact-form"
import type { Metadata } from "next"
import { buildTitle, SITE_URL } from "@/lib/seo"

const iconMap: Record<string, React.ComponentType<any>> = {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>(contactPageQuery)

  const ogImage = data?.seo?.ogImage
    ? urlFor(data.seo.ogImage).width(1200).height(630).url()
    : undefined

  const title = buildTitle(
    data?.seo?.metaTitle,
    data?.hero?.title || "Contact"
  )
  const description =
    data?.seo?.metaDescription ||
    "Get in touch with FRIENDS Forum for inquiries, collaboration opportunities, or to learn more about our work."

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/contact" },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/contact`,
      type: "website",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

export default async function ContactPage() {
  const pageData = await sanityFetch<any>(contactPageQuery)

  if (!pageData) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Page
        </h1>
        <p className="text-muted-foreground">
          Failed to load page content. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">
              {pageData.hero?.title || "Contact Us"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {pageData.hero?.subtitle ||
                "Get in touch with the FRIENDS Forum team for inquiries, collaboration opportunities, or to learn more about our work."}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Contact Info */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          {/* Contact Form - Client component */}
          <ContactForm
            title={pageData.contactForm?.title || "Get in Touch"}
            description={
              pageData.contactForm?.description ||
              "We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible."
            }
            formFields={pageData.contactForm?.formFields}
            successMessage={pageData.contactForm?.successMessage}
            submitButton={pageData.contactForm?.submitButton}
          />

          {/* Contact Information - Static */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {pageData.contactInformation?.title || "Contact Information"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {pageData.contactInformation?.description ||
                  "You can reach us through the following channels or visit our office."}
              </p>
            </div>
            <div className="space-y-4">
              {pageData.contactInformation?.contactMethods &&
              pageData.contactInformation.contactMethods.length > 0
                ? pageData.contactInformation.contactMethods.map(
                    (method: any, index: number) => {
                      const IconComponent = iconMap[method.icon] || Mail
                      return (
                        <div key={index} className="flex items-start gap-4">
                          <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold">{method.title}</h3>
                            {method.details?.map(
                              (detail: string, detailIndex: number) => (
                                <p
                                  key={detailIndex}
                                  className="text-sm text-muted-foreground"
                                >
                                  {method.link ? (
                                    <a
                                      href={method.link}
                                      className="hover:text-primary transition-colors"
                                      target={
                                        method.link.startsWith("mailto:") ||
                                        method.link.startsWith("tel:")
                                          ? undefined
                                          : "_blank"
                                      }
                                      rel={
                                        method.link.startsWith("mailto:") ||
                                        method.link.startsWith("tel:")
                                          ? undefined
                                          : "noopener noreferrer"
                                      }
                                    >
                                      {detail}
                                    </a>
                                  ) : (
                                    detail
                                  )}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      )
                    }
                  )
                : [
                    {
                      icon: "Mail",
                      title: "Email",
                      details: [
                        "info@friendsforum.org",
                        "support@friendsforum.org",
                      ],
                      link: "mailto:info@friendsforum.org",
                    },
                    {
                      icon: "Phone",
                      title: "Phone",
                      details: ["+1 (123) 456-7890", "+1 (123) 456-7891"],
                      link: "tel:+11234567890",
                    },
                    {
                      icon: "MapPin",
                      title: "Office",
                      details: ["123 Nile Avenue", "Addis Ababa, Ethiopia"],
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
                          {method.details.map((detail, detailIndex) => (
                            <p
                              key={detailIndex}
                              className="text-sm text-muted-foreground"
                            >
                              {method.link ? (
                                <a
                                  href={method.link}
                                  className="hover:text-primary transition-colors"
                                  target={
                                    method.link.startsWith("mailto:") ||
                                    method.link.startsWith("tel:")
                                      ? undefined
                                      : "_blank"
                                  }
                                  rel={
                                    method.link.startsWith("mailto:") ||
                                    method.link.startsWith("tel:")
                                      ? undefined
                                      : "noopener noreferrer"
                                  }
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
                  })}
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              {pageData.contactInformation?.mapImage ? (
                <Image
                  src={urlFor(pageData.contactInformation.mapImage).url()}
                  alt="Office Location Map"
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/placeholder.svg"
                  alt="Office Location Map"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Static */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {pageData.faq?.title || "Frequently Asked Questions"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {pageData.faq?.subtitle ||
                "Find answers to common questions about the FRIENDS Forum and our work."}
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {pageData.faq?.questions && pageData.faq.questions.length > 0
              ? pageData.faq.questions.map((faq: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-background p-6"
                  >
                    <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))
              : [
                  {
                    question: "How can I join the FRIENDS Forum?",
                    answer:
                      "You can join the FRIENDS Forum by completing the membership application form on our website. Membership is open to researchers, practitioners, policymakers, and other stakeholders interested in the Nile Basin region.",
                  },
                  {
                    question: "Are there membership fees?",
                    answer:
                      "Basic membership to the FRIENDS Forum is free. However, there may be fees for certain events, workshops, or premium resources. Members receive discounted rates for these activities.",
                  },
                  {
                    question: "How can I contribute to the forum?",
                    answer:
                      "There are many ways to contribute to the FRIENDS Forum, including submitting research papers, participating in discussions, attending events, and collaborating on projects. Contact us to learn more about specific opportunities.",
                  },
                  {
                    question:
                      "Can I propose a collaboration or partnership?",
                    answer:
                      "Yes, we welcome collaboration and partnership proposals from organizations and individuals whose work aligns with our mission. Please use the contact form to submit your proposal or reach out to us directly.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-background p-6"
                  >
                    <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </>
  )
}
