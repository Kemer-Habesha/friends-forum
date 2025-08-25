"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NewsletterFormProps {
  placeholder?: string
  buttonText?: string
}

export default function NewsletterForm({ 
  placeholder = "Enter your email", 
  buttonText = "Subscribe" 
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setEmail("")

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="mx-auto max-w-md">
      {isSuccess ? (
        <div className="bg-white/90 rounded-md p-4 text-center text-primary">
          <p className="font-medium">Thank you for subscribing!</p>
          <p className="text-sm mt-1">You'll receive our latest updates in your inbox.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/90 text-foreground border-primary/20"
            aria-label="Email address"
          />
          <Button type="submit" disabled={isSubmitting} className="transition-all duration-200 ease-in-out">
            {isSubmitting ? "Subscribing..." : buttonText}
          </Button>
        </form>
      )}
    </div>
  )
}

