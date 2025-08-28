"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGlobalState } from '@/hooks/useGlobalState'
import { queryKeys } from '@/hooks/useSanityQuery'
import { 
  Database, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Info
} from 'lucide-react'

export default function CacheStatus() {
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const [isOpen, setIsOpen] = useState(false)
  const { 
    hasCachedData, 
    getAllCachedData, 
    clearPageCache, 
    clearAllCaches 
  } = useGlobalState()

  const cachedPages = Object.values(queryKeys).filter(key => hasCachedData(key))
  const totalPages = Object.keys(queryKeys).length

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className="flex items-center gap-2 shadow-lg"
        >
          <Database className="h-4 w-4" />
          <Badge variant="secondary" className="text-xs">
            {cachedPages.length}/{totalPages}
          </Badge>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-background border rounded-lg shadow-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Database className="h-4 w-4" />
          Cache Status
        </h3>
        <Button
          onClick={() => setIsOpen(false)}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>Pages Cached:</span>
          <Badge variant={cachedPages.length === totalPages ? "default" : "secondary"}>
            {cachedPages.length}/{totalPages}
          </Badge>
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {Object.values(queryKeys).map(key => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="capitalize">{key.replace('Page', '')}</span>
              <div className="flex items-center gap-1">
                {hasCachedData(key) ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
                {hasCachedData(key) && (
                  <Button
                    onClick={() => clearPageCache(key)}
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button
            onClick={clearAllCaches}
            size="sm"
            variant="destructive"
            className="flex-1 text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
          <Button
            onClick={() => window.location.reload()}
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          Hover over navigation links to prefetch data
        </div>
      </div>
    </div>
  )
}
