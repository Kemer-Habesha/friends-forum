"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NewsletterFormProps {
  placeholder?: string
  buttonText?: string
  source?: string
}

export default function NewsletterForm({ 
  placeholder = "Enter your email", 
  buttonText = "Subscribe",
  source = "homepage"
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setIsSuccess(true)
      setEmail("")

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-3">
      {isSuccess ? (
        <div className="bg-green-100 border border-green-400 text-green-700 rounded-md p-4 text-center">
          <p className="font-medium">🎉 Thank you for subscribing!</p>
          <p className="text-sm mt-1">You'll receive our latest updates and insights in your inbox.</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 rounded-md p-3 text-center text-sm">
              {error}
            </div>
          )}
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
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="transition-all duration-200 ease-in-out hover:scale-105"
            >
              {isSubmitting ? "Subscribing..." : buttonText}
            </Button>
          </form>
        </>
      )}
    </div>
  )
}

