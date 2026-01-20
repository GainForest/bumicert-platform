'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { listCollaborators, revokeCollaborator, updateCollaboratorRole, type CollaboratorRole } from '@/lib/hypercerts/actions'
import { UserMinus, UserCog } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Collaborator {
  userDid: string
  role: CollaboratorRole
  grantedAt: string
  grantedBy: string
}

interface CollaboratorsSectionProps {
  orgDid: string
  isOwner?: boolean
}

export function CollaboratorsSection({ orgDid, isOwner = false }: CollaboratorsSectionProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCollaborators()
  }, [orgDid])

  async function loadCollaborators() {
    try {
      setLoading(true)
      setError(null)
      const result = await listCollaborators(orgDid)
      
      if (result.success && result.data) {
        setCollaborators(result.data.collaborators as Collaborator[])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collaborators')
    } finally {
      setLoading(false)
    }
  }

  async function handleRemoveCollaborator(userDid: string) {
    if (!confirm('Are you sure you want to remove this collaborator?')) return

    try {
      await revokeCollaborator(orgDid, userDid)
      await loadCollaborators()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove collaborator')
    }
  }

  async function handleChangeRole(userDid: string, newRole: CollaboratorRole) {
    try {
      await updateCollaboratorRole(orgDid, userDid, newRole)
      await loadCollaborators()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update role')
    }
  }

  function getRoleBadgeColor(role: CollaboratorRole) {
    switch (role) {
      case 'owner': return 'bg-purple-500'
      case 'admin': return 'bg-red-500'
      case 'editor': return 'bg-blue-500'
      case 'viewer': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  function getInitials(did: string) {
    // Extract a couple letters from the DID for avatar
    const parts = did.split(':')
    const lastPart = parts[parts.length - 1]
    return lastPart.slice(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collaborators</CardTitle>
          <CardDescription>Loading collaborators...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collaborators</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaborators</CardTitle>
        <CardDescription>
          {collaborators.length === 0 
            ? 'No collaborators yet' 
            : `${collaborators.length} collaborator${collaborators.length !== 1 ? 's' : ''}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.userDid}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(collaborator.userDid)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{collaborator.userDid}</p>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(collaborator.grantedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getRoleBadgeColor(collaborator.role)}>
                  {collaborator.role}
                </Badge>

                {isOwner && collaborator.role !== 'owner' && (
                  <div className="flex gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleChangeRole(collaborator.userDid, 'admin')}>
                          Change to Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(collaborator.userDid, 'editor')}>
                          Change to Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(collaborator.userDid, 'viewer')}>
                          Change to Viewer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveCollaborator(collaborator.userDid)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
