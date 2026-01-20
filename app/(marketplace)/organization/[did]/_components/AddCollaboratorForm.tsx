'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { grantCollaborator, type CollaboratorRole } from '@/lib/hypercerts/actions'
import { UserPlus, ChevronDown } from 'lucide-react'

interface AddCollaboratorFormProps {
  orgDid: string
  onSuccess?: () => void
}

export function AddCollaboratorForm({ orgDid, onSuccess }: AddCollaboratorFormProps) {
  const [userDid, setUserDid] = useState('')
  const [role, setRole] = useState<CollaboratorRole>('viewer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!userDid.trim()) {
      setError('Please enter a valid DID')
      return
    }

    try {
      setLoading(true)
      setError(null)

      await grantCollaborator({
        orgDid,
        userDid: userDid.trim(),
        role,
      })

      // Reset form
      setUserDid('')
      setRole('viewer')
      
      // Call success callback
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add collaborator')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Collaborator</CardTitle>
        <CardDescription>
          Grant access to other users to collaborate on this organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userDid">User DID</Label>
            <Input
              id="userDid"
              placeholder="did:plc:abc123..."
              value={userDid}
              onChange={(e) => setUserDid(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Enter the ATProto DID of the user you want to add
            </p>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between" disabled={loading}>
                  <span className="capitalize">{role}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onClick={() => setRole('viewer')}>
                  <div>
                    <p className="font-medium">Viewer</p>
                    <p className="text-xs text-muted-foreground">Can view organization data</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole('editor')}>
                  <div>
                    <p className="font-medium">Editor</p>
                    <p className="text-xs text-muted-foreground">Can edit organization data</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole('admin')}>
                  <div>
                    <p className="font-medium">Admin</p>
                    <p className="text-xs text-muted-foreground">Can manage collaborators</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            {loading ? 'Adding...' : 'Add Collaborator'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
