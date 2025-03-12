"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onBackToLogin: () => void
}

export default function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // In a real app, you would handle password reset request here
      console.log("Password reset requested for:", email)
      setIsSuccess(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setEmail("")
    setIsSuccess(false)
    setError("")
    onBackToLogin()
  }

  const resetForm = () => {
    setEmail("")
    setIsSuccess(false)
    setError("")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Reset Password</DialogTitle>
          <DialogDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 space-y-4">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg">Check your email</h3>
              <p className="text-sm text-muted-foreground">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleBackToLogin}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Didn't receive the email? Check your spam folder or{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs"
                  onClick={() => {
                    setIsSuccess(false)
                  }}
                >
                  try again
                </Button>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <Button type="button" variant="ghost" className="w-full" onClick={handleBackToLogin}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

