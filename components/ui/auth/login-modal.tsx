"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock } from "lucide-react"
import ForgotPasswordModal from "./forgot-password-modal"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenSignup: () => void
}

export default function LoginModal({ isOpen, onClose, onOpenSignup }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // In a real app, you would handle authentication here
      console.log("Login attempt with:", { email, rememberMe })
      onClose()
    } catch (err) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchToSignup = () => {
    onClose()
    onOpenSignup()
  }

  const handleForgotPassword = () => {
    setIsForgotPasswordOpen(true)
  }

  const handleBackToLogin = () => {
    setIsForgotPasswordOpen(false)
  }

  return (
    <>
      <Dialog
        open={isOpen && !isForgotPasswordOpen}
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
            <DialogDescription className="text-center">Sign in to your FRIENDS Forum account</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="p-0 h-auto text-xs" type="button" onClick={handleForgotPassword}>
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <DialogFooter className="flex flex-col sm:flex-col gap-2">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={handleSwitchToSignup}>
                Sign up
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onBackToLogin={handleBackToLogin}
      />
    </>
  )
}

