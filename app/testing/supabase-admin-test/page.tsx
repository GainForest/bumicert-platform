import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function SupabaseAdminTestPage() {
  const results: {
    test: string
    status: 'success' | 'error'
    message: string
    details?: string
  }[] = []

  // Test 1: Admin client creation
  try {
    const supabase = createAdminClient()
    results.push({
      test: 'Admin Client Creation',
      status: 'success',
      message: 'Admin client created successfully',
      details: 'Service role key loaded and client initialized'
    })

    // Test 2: Write to oauth_sessions (bypassing RLS)
    const testDid = `did:test:${Date.now()}`
    const testSession = {
      accessToken: 'test-token',
      refreshToken: 'test-refresh',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    }

    const { error: writeError } = await supabase
      .from('oauth_sessions')
      .insert({
        did: testDid,
        session_data: testSession,
      })

    if (writeError) {
      results.push({
        test: 'Write Session (Bypass RLS)',
        status: 'error',
        message: 'Failed to write session',
        details: writeError.message
      })
    } else {
      results.push({
        test: 'Write Session (Bypass RLS)',
        status: 'success',
        message: 'Session written successfully',
        details: `Inserted session for ${testDid}`
      })
    }

    // Test 3: Read from oauth_sessions
    const { data: readData, error: readError } = await supabase
      .from('oauth_sessions')
      .select('*')
      .eq('did', testDid)
      .single()

    if (readError) {
      results.push({
        test: 'Read Session (Bypass RLS)',
        status: 'error',
        message: 'Failed to read session',
        details: readError.message
      })
    } else {
      results.push({
        test: 'Read Session (Bypass RLS)',
        status: 'success',
        message: 'Session read successfully',
        details: `Retrieved session for ${testDid}`
      })
    }

    // Test 4: Delete from oauth_sessions
    const { error: deleteError } = await supabase
      .from('oauth_sessions')
      .delete()
      .eq('did', testDid)

    if (deleteError) {
      results.push({
        test: 'Delete Session (Cleanup)',
        status: 'error',
        message: 'Failed to delete session',
        details: deleteError.message
      })
    } else {
      results.push({
        test: 'Delete Session (Cleanup)',
        status: 'success',
        message: 'Session deleted successfully',
        details: `Cleaned up test session for ${testDid}`
      })
    }

    // Test 5: Write to oauth_states
    const testState = `state-${Date.now()}`
    const testStateData = {
      redirectUri: 'http://localhost:3000/callback',
      pkceChallenge: 'test-challenge',
    }

    const { error: stateWriteError } = await supabase
      .from('oauth_states')
      .insert({
        state: testState,
        state_data: testStateData,
        expires_at: new Date(Date.now() + 600000).toISOString(),
      })

    if (stateWriteError) {
      results.push({
        test: 'Write State (Bypass RLS)',
        status: 'error',
        message: 'Failed to write state',
        details: stateWriteError.message
      })
    } else {
      results.push({
        test: 'Write State (Bypass RLS)',
        status: 'success',
        message: 'State written successfully',
        details: `Inserted state ${testState}`
      })
    }

    // Test 6: Read from oauth_states
    const { data: stateReadData, error: stateReadError } = await supabase
      .from('oauth_states')
      .select('*')
      .eq('state', testState)
      .single()

    if (stateReadError) {
      results.push({
        test: 'Read State (Bypass RLS)',
        status: 'error',
        message: 'Failed to read state',
        details: stateReadError.message
      })
    } else {
      results.push({
        test: 'Read State (Bypass RLS)',
        status: 'success',
        message: 'State read successfully',
        details: `Retrieved state ${testState}`
      })
    }

    // Test 7: Delete from oauth_states
    const { error: stateDeleteError } = await supabase
      .from('oauth_states')
      .delete()
      .eq('state', testState)

    if (stateDeleteError) {
      results.push({
        test: 'Delete State (Cleanup)',
        status: 'error',
        message: 'Failed to delete state',
        details: stateDeleteError.message
      })
    } else {
      results.push({
        test: 'Delete State (Cleanup)',
        status: 'success',
        message: 'State deleted successfully',
        details: `Cleaned up test state ${testState}`
      })
    }

  } catch (error) {
    results.push({
      test: 'Overall Test Execution',
      status: 'error',
      message: 'Critical error during testing',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length
  const allPassed = errorCount === 0

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Supabase Admin Client Test</h1>
        <p className="text-muted-foreground">
          Testing service role key with RLS bypass for oauth_sessions and oauth_states tables
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
          <CardDescription>
            {allPassed ? 'All tests passed!' : 'Some tests failed'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <span className="text-2xl font-bold text-green-600">{successCount}</span>
              <p className="text-sm text-muted-foreground">Passed</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-red-600">{errorCount}</span>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
            <div>
              <span className="text-2xl font-bold">{results.length}</span>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{result.test}</CardTitle>
                <Badge 
                  variant={result.status === 'success' ? 'default' : 'destructive'}
                  className={result.status === 'success' ? 'bg-green-500' : 'bg-red-500'}
                >
                  {result.status === 'success' ? '✓ Pass' : '✗ Fail'}
                </Badge>
              </div>
              <CardDescription>{result.message}</CardDescription>
            </CardHeader>
            {result.details && (
              <CardContent>
                <code className="text-sm bg-muted p-2 rounded block">
                  {result.details}
                </code>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>What This Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Service role key is properly configured in environment</li>
            <li>Admin client can bypass RLS policies on oauth_sessions table</li>
            <li>Admin client can bypass RLS policies on oauth_states table</li>
            <li>Full CRUD operations work (Create, Read, Delete)</li>
            <li>Session and state storage will work during OAuth flows</li>
          </ul>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Security Note:</strong> This page uses the service role key which bypasses RLS. 
          The admin client should only be used in server-side code (Server Components, Server Actions, Route Handlers).
          The <code className="bg-yellow-100 px-1 rounded">server-only</code> import in <code className="bg-yellow-100 px-1 rounded">lib/supabase/admin.ts</code> prevents accidental client-side usage.
        </p>
      </div>
    </div>
  )
}
