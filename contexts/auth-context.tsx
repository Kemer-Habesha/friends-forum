"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type AuthContextType = {
  openLoginModal: () => void
  openSignupModal: () => void
  closeModals: () => void
  isLoginModalOpen: boolean
  isSignupModalOpen: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  const openLoginModal = () => {
    setIsSignupModalOpen(false)
    setIsLoginModalOpen(true)
  }

  const openSignupModal = () => {
    setIsLoginModalOpen(false)
    setIsSignupModalOpen(true)
  }

  const closeModals = () => {
    setIsLoginModalOpen(false)
    setIsSignupModalOpen(false)
  }

  return (
    <AuthContext.Provider
      value={{
        openLoginModal,
        openSignupModal,
        closeModals,
        isLoginModalOpen,
        isSignupModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

