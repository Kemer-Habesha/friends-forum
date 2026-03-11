"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ActionButtonProps {
  text: string
  action: string
  targetPage?: string
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function ActionButton({
  text,
  action,
  targetPage,
  variant = "default",
  size = "default",
  className,
}: ActionButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (action === "navigate" && targetPage) {
      router.push(targetPage)
    } else if (action === "contact" || action === "signup") {
      // Treat legacy \"signup\" action as contact now that auth is removed
      router.push("/contact")
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleClick}>
      {text}
    </Button>
  )
}
