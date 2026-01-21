import { hypercertsSdk } from '@/lib/hypercerts/sdk.server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const handle = body.handle

    if (!handle) {
      return NextResponse.json(
        { error: 'Handle is required' },
        { status: 400 }
      )
    }
    const authUrl = await hypercertsSdk.authorize(handle)
    
    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Failed to initiate login:', error)
    return NextResponse.json(
      { error: 'Failed to initiate login process' },
      { status: 500 }
    )
  }
}
