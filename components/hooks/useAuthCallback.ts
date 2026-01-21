'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAtprotoStore } from '@/components/stores/atproto'

/**
 * Hook to handle OAuth callback after successful authentication
 * 
 * Detects ?auth=success or ?auth=failed query params and:
 * 1. Refreshes the auth state
 * 2. Stores the handle in previous sessions (if available)
 * 3. Cleans up the URL
 */
export function useAuthCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const refreshAuth = useAtprotoStore((state) => state.refreshAuth)
  
  useEffect(() => {
    const authStatus = searchParams.get('auth')
    
    if (authStatus === 'success') {
      // Refresh auth state after successful OAuth callback
      refreshAuth().then(() => {
        // Add handle to previous sessions if stored
        const pendingHandle = localStorage.getItem('pending-login-handle')
        if (pendingHandle) {
          const stored = localStorage.getItem('previous-sessions')
          const sessions = stored ? JSON.parse(stored) : []
          if (!sessions.find((s: { handle: string }) => s.handle === pendingHandle)) {
            sessions.push({ handle: pendingHandle })
            localStorage.setItem('previous-sessions', JSON.stringify(sessions))
          }
          localStorage.removeItem('pending-login-handle')
        }
        
        // Clean up URL
        router.replace(window.location.pathname)
      })
    } else if (authStatus === 'failed') {
      // Could show a toast/notification here
      const errorMsg = searchParams.get('error')
      console.error('Authentication failed:', errorMsg)
      router.replace(window.location.pathname)
    }
  }, [searchParams, refreshAuth, router])
}
