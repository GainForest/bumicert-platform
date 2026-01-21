'use client'

import { useEffect } from 'react'
import { useAtprotoStore } from '@/components/stores/atproto'

/**
 * Client component that initializes authentication state on mount
 * Must be included in the root layout after other providers
 */
export function AuthInitializer() {
  const refreshAuth = useAtprotoStore((state) => state.refreshAuth)
  const isReady = useAtprotoStore((state) => state.isReady)
  
  useEffect(() => {
    // Only run once on mount, and only if not already ready
    if (!isReady) {
      refreshAuth()
    }
  }, []) // Empty deps - only run once on mount
  
  return null
}
