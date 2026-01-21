'use client'

import { useEffect } from 'react'
import { useAtprotoStore } from '@/components/stores/atproto'

/**
 * Client component that initializes authentication state on mount
 */
export function AuthInitializer() {
  const refreshAuth = useAtprotoStore((state) => state.refreshAuth)
  const isReady = useAtprotoStore((state) => state.isReady)
  
  useEffect(() => {
    if (!isReady) {
      refreshAuth()
    }
  }, []) 
  
  return null
}
