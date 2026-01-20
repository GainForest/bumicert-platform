import 'server-only'
import { cookies } from 'next/headers'
import { hypercertsSdk } from './sdk.server'
import type { Repository } from '@hypercerts-org/sdk-core'

export type RepoServer = 'pds' | 'sds'

export interface RepoContext {
  userDid: string
  activeDid: string
  targetDid: string
  server: RepoServer
  repository: Repository
  scopedRepo: ReturnType<Repository['repo']>
}

export async function getHypercertsRepoContext(options?: {
  targetDid?: string
  serverOverride?: RepoServer
}): Promise<RepoContext | null> {
  const cookieStore = await cookies()
  const userDid = cookieStore.get('hypercerts-user-did')?.value
  
  if (!userDid) return null
  
  const activeDid = cookieStore.get('hypercerts-active-did')?.value || userDid
  const targetDid = options?.targetDid || activeDid
  const server: RepoServer = options?.serverOverride ?? (targetDid === userDid ? 'pds' : 'sds')
  
  try {
    const session = await hypercertsSdk.restoreSession(userDid)
    if (!session) return null
    
    const repository = hypercertsSdk.repository(session, { server })
    const scopedRepo = repository.repo(targetDid)
    
    return { userDid, activeDid, targetDid, server, repository, scopedRepo }
  } catch (error) {
    console.error('Failed to get repo context:', error)
    return null
  }
}
