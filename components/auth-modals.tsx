"use client"

import { useAuth } from "@/contexts/auth-context"
import LoginModal from "@/components/ui/auth/login-modal"
import SignupModal from "@/components/ui/auth/signup-modal"

export default function AuthModals() {
  const { isLoginModalOpen, isSignupModalOpen, openLoginModal, openSignupModal, closeModals } = useAuth()

  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeModals} onOpenSignup={openSignupModal} />

      <SignupModal isOpen={isSignupModalOpen} onClose={closeModals} onOpenLogin={openLoginModal} />
    </>
  )
}

