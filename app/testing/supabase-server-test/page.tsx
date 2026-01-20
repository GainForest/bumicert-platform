import { createClient } from '@/lib/supabase/server'

export default async function SupabaseServerTestPage() {
  const supabase = await createClient()
  
  let result: {
    success: boolean
    message: string
    sessionCount?: number
    error?: string
  }

  try {
    const { data, error } = await supabase
      .from('oauth_sessions')
      .select('did')
      .limit(5)
    
    if (error) throw error
    
    result = {
      success: true,
      message: 'Supabase server client connected successfully!',
      sessionCount: data?.length || 0,
    }
  } catch (error) {
    result = {
      success: false,
      message: 'Failed to connect to Supabase',
      error: (error as Error).message,
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Supabase Server Client Test</h1>
      
      <div className={`p-6 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-2xl ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.success ? '✓' : '✗'}
          </span>
          <h2 className={`text-xl font-semibold ${result.success ? 'text-green-900' : 'text-red-900'}`}>
            {result.message}
          </h2>
        </div>
        
        <div className="mt-4 space-y-2 text-sm">
          <p><strong>Status:</strong> {result.success ? 'Connected' : 'Failed'}</p>
          {result.success && (
            <p><strong>OAuth Sessions Found:</strong> {result.sessionCount}</p>
          )}
          {result.error && (
            <p className="text-red-700"><strong>Error:</strong> {result.error}</p>
          )}
        </div>
        
        <div className="mt-4 p-4 bg-white rounded border">
          <pre className="text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Test Details:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Testing Server Component with Supabase client</li>
          <li>Querying <code className="bg-gray-100 px-1 rounded">oauth_sessions</code> table</li>
          <li>Using <code className="bg-gray-100 px-1 rounded">lib/supabase/server.ts</code></li>
        </ul>
      </div>
    </div>
  )
}
