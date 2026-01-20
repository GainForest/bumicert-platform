'use server'

import { revalidatePath } from 'next/cache'
import { getHypercertsRepoContext } from './repo-context'

/**
 * Organization Actions
 */

export interface CreateOrganizationParams {
  handlePrefix: string
  name: string
  description?: string
}

export async function createOrganization(params: CreateOrganizationParams) {
  const ctx = await getHypercertsRepoContext({ serverOverride: 'sds' })
  if (!ctx) {
    throw new Error('Not authenticated. Please login first.')
  }

  try {
    const result = await ctx.repository.organizations.create({
      handlePrefix: params.handlePrefix,
      name: params.name,
      description: params.description,
    })

    revalidatePath('/organization')
    
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to create organization:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create organization'
    )
  }
}

export async function getOrganization(did: string) {
  const ctx = await getHypercertsRepoContext({ 
    serverOverride: 'sds',
    targetDid: did 
  })
  
  if (!ctx) {
    throw new Error('Not authenticated. Please login first.')
  }

  try {
    const org = await ctx.repository.organizations.get(did)
    return { success: true, data: org }
  } catch (error) {
    console.error('Failed to get organization:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to get organization'
    )
  }
}

export async function listMyOrganizations() {
  const ctx = await getHypercertsRepoContext({ serverOverride: 'sds' })
  
  if (!ctx) {
    throw new Error('Not authenticated. Please login first.')
  }

  try {
    const orgs = await ctx.repository.organizations.list()
    return { success: true, data: orgs }
  } catch (error) {
    console.error('Failed to list organizations:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to list organizations'
    )
  }
}

// Note: Organization update is not directly supported by the SDK.
// You may need to use the ATProto API directly or wait for SDK support.
// For now, this function is commented out.
// 
// export async function updateOrganization(
//   orgDid: string, 
//   updates: { name?: string; description?: string }
// ) {
//   const ctx = await getHypercertsRepoContext({ 
//     serverOverride: 'sds',
//     targetDid: orgDid 
//   })
//   
//   if (!ctx) {
//     throw new Error('Not authenticated. Please login first.')
//   }
//
//   try {
//     // SDK does not expose update method yet
//     
//     revalidatePath(`/organization/${orgDid}`)
//     
//     return { success: true }
//   } catch (error) {
//     console.error('Failed to update organization:', error)
//     throw new Error(
//       error instanceof Error ? error.message : 'Failed to update organization'
//     )
//   }
// }

/**
 * Collaborator Actions
 */

export type CollaboratorRole = 'viewer' | 'editor' | 'admin' | 'owner'

export interface GrantCollaboratorParams {
  orgDid: string
  userDid: string
  role: CollaboratorRole
}

export async function grantCollaborator(params: GrantCollaboratorParams) {
  const ctx = await getHypercertsRepoContext({ 
    serverOverride: 'sds',
    targetDid: params.orgDid 
  })
  
  if (!ctx) {
    throw new Error('Not authenticated. Please login first.')
  }

  try {
    await ctx.scopedRepo.collaborators.grant({
      userDid: params.userDid,
      role: params.role,
    })
    
    revalidatePath(`/organization/${params.orgDid}`)
    
    return { success: true }
  } catch (error) {
    console.error('Failed to grant collaborator access:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to add collaborator'
    )
  }
}

export async function revokeCollaborator(orgDid: string, userDid: string) {
  const ctx = await getHypercertsRepoContext({ 
    serverOverride: 'sds',
    targetDid: orgDid 
  })
  
  if (!ctx) {
    throw new Error('Not authenticated. Please login first.')
  }

  try {
    await ctx.scopedRepo.collaborators.revoke({ userDid })
    
    revalidatePath(`/organization/${orgDid}`)
    
    return { success: true }
  } catch (error) {
    console.error('Failed to revoke collaborator access:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to remove collaborator'
    )
  }
}

export async function listCollaborators(orgDid: string) {
  const ctx = await getHypercertsRepoContext({ 
    serverOverride: 'sds',
    targetDid: orgDid 
  })
  
  if (!ctx) {
    throw new Error('Not authenticated. Please login first.')
  }

  try {
    const collaborators = await ctx.scopedRepo.collaborators.list()
    return { success: true, data: collaborators }
  } catch (error) {
    console.error('Failed to list collaborators:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to list collaborators'
    )
  }
}

export async function updateCollaboratorRole(
  orgDid: string, 
  userDid: string, 
  role: CollaboratorRole
) {
  const ctx = await getHypercertsRepoContext({ 
    serverOverride: 'sds',
    targetDid: orgDid 
  })
  
  if (!ctx) {
    throw new Error('Not authenticated. Please login first.')
  }

  try {
    // Revoke and re-grant with new role
    await ctx.scopedRepo.collaborators.revoke({ userDid })
    await ctx.scopedRepo.collaborators.grant({
      userDid,
      role,
    })
    
    revalidatePath(`/organization/${orgDid}`)
    
    return { success: true }
  } catch (error) {
    console.error('Failed to update collaborator role:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update collaborator role'
    )
  }
}
