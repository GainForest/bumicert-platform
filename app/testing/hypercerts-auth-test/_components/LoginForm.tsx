'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, FormEvent } from 'react'
import { Loader2 } from 'lucide-react'

export default function LoginForm() {
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pdsUrl = process.env.NEXT_PUBLIC_PDS_URL || 'https://climateai.org'
  const hostname = new URL(pdsUrl).hostname

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Auto-append domain if user only entered handle
      let finalHandle = handle.trim()
      if (!finalHandle.includes('.')) {
        finalHandle = `${finalHandle}.${hostname}`
      }

      const response = await fetch('/api/hypercerts/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: finalHandle }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to initiate login')
      }

      const { authUrl } = await response.json()
      
      // Redirect to OAuth provider
      window.location.href = authUrl
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="handle">ATProto Handle</Label>
        <Input
          id="handle"
          type="text"
          placeholder="your-handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          disabled={loading}
          required
        />
        <p className="text-sm text-muted-foreground">
          Will authenticate as: <code className="bg-muted px-1 rounded">
            {handle || 'your-handle'}.{hostname}
          </code>
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Redirecting to ATProto...' : 'Sign In with ATProto'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        You'll be redirected to ATProto OAuth for authentication
      </p>
    </form>
  )
}
