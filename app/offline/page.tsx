"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="relative">
            <Wifi className="h-24 w-24 text-muted-foreground" />
            <WifiOff className="h-12 w-12 text-destructive absolute -bottom-2 -right-2" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">You're Offline</h1>
          <p className="text-xl text-muted-foreground max-w-md">
            It looks like you've lost your internet connection. Some content may still be available offline.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>If the problem persists, check your internet connection</p>
        </div>
      </div>
    </div>
  )
}
