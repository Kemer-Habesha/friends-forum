"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormFields {
  firstName?: { label?: string; placeholder?: string; required?: boolean }
  lastName?: { label?: string; placeholder?: string; required?: boolean }
  email?: { label?: string; placeholder?: string; required?: boolean }
  subject?: { label?: string; placeholder?: string; required?: boolean }
  message?: { label?: string; placeholder?: string; required?: boolean; minHeight?: string }
}

interface SuccessMessage {
  title?: string
  description?: string
}

interface SubmitButton {
  text?: string
  loadingText?: string
}

export default function ContactForm({
  title,
  description,
  formFields,
  successMessage,
  submitButton,
}: {
  title: string
  description: string
  formFields?: FormFields
  successMessage?: SuccessMessage
  submitButton?: SubmitButton
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form")
      }

      setIsSuccess(true)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      })

      setTimeout(() => setIsSuccess(false), 5000)
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to submit form"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 rounded-md p-4">
          <p className="font-medium">
            {successMessage?.title || "Thank you for your message!"}
          </p>
          <p className="text-sm">
            {successMessage?.description ||
              "We'll get back to you as soon as possible."}
          </p>
        </div>
      )}

      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 rounded-md p-4">
          <p className="font-medium">Error</p>
          <p className="text-sm">{formError}</p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {formFields?.firstName?.label || "First Name"}
            </label>
            <Input
              id="firstName"
              placeholder={
                formFields?.firstName?.placeholder || "Enter your first name"
              }
              value={formData.firstName}
              onChange={handleChange}
              required={formFields?.firstName?.required ?? true}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {formFields?.lastName?.label || "Last Name"}
            </label>
            <Input
              id="lastName"
              placeholder={
                formFields?.lastName?.placeholder || "Enter your last name"
              }
              value={formData.lastName}
              onChange={handleChange}
              required={formFields?.lastName?.required ?? true}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {formFields?.email?.label || "Email"}
          </label>
          <Input
            id="email"
            type="email"
            placeholder={
              formFields?.email?.placeholder || "Enter your email"
            }
            value={formData.email}
            onChange={handleChange}
            required={formFields?.email?.required ?? true}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="subject"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {formFields?.subject?.label || "Subject"}
          </label>
          <Input
            id="subject"
            placeholder={
              formFields?.subject?.placeholder || "Enter the subject"
            }
            value={formData.subject}
            onChange={handleChange}
            required={formFields?.subject?.required ?? true}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {formFields?.message?.label || "Message"}
          </label>
          <Textarea
            id="message"
            placeholder={
              formFields?.message?.placeholder || "Enter your message"
            }
            className={formFields?.message?.minHeight || "min-h-32"}
            value={formData.message}
            onChange={handleChange}
            required={formFields?.message?.required ?? true}
          />
        </div>
        <Button
          type="submit"
          className="w-full transition-all duration-200 ease-in-out hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? submitButton?.loadingText || "Sending..."
            : submitButton?.text || "Send Message"}
        </Button>
      </form>
    </div>
  )
}
