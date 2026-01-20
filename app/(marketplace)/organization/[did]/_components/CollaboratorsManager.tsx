'use client'

import { useState } from 'react'
import { CollaboratorsSection } from './CollaboratorsSection'
import { AddCollaboratorForm } from './AddCollaboratorForm'

interface CollaboratorsManagerProps {
  orgDid: string
  isOwner?: boolean
}

export function CollaboratorsManager({ orgDid, isOwner = false }: CollaboratorsManagerProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  function handleCollaboratorAdded() {
    // Force re-render of collaborators list
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {isOwner && (
        <AddCollaboratorForm 
          orgDid={orgDid} 
          onSuccess={handleCollaboratorAdded} 
        />
      )}
      
      <CollaboratorsSection 
        key={refreshKey} 
        orgDid={orgDid} 
        isOwner={isOwner} 
      />
    </div>
  )
}
