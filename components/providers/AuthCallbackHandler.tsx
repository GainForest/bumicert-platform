'use client'

import { useAuthCallback } from '@/components/hooks/useAuthCallback'

/**
 * Client component that handles OAuth callback detection
 * Should be included in the root layout
 */
export function AuthCallbackHandler() {
  useAuthCallback()
  return null
}
