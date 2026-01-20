import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getHypercertsRepoContext } from '@/lib/hypercerts/repo-context'
import LoginForm from './_components/LoginForm'
import SessionInfo from './_components/SessionInfo'

export default async function HypercertsAuthTestPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const context = await getHypercertsRepoContext()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Hypercerts SDK Authentication Test
          </h1>
          <Badge variant={context ? "default" : "outline"}>
            {context ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          Test the Hypercerts SDK OAuth authentication flow with ATProto
        </p>
      </div>

      {/* Auth Section */}
      {!context ? (
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your ATProto handle to authenticate with the Hypercerts SDK
            </CardDescription>
          </CardHeader>
          <CardContent>
            {params.error === 'auth_failed' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                Authentication failed. Please try again.
              </div>
            )}
            <LoginForm />
          </CardContent>
        </Card>
      ) : (
        <SessionInfo 
          userDid={context.userDid}
          server={context.server}
        />
      )}

      <Separator />

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>How This Works</CardTitle>
          <CardDescription>
            Testing the Hypercerts SDK OAuth integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="space-y-2">
            <p className="font-medium">1. Dynamic OAuth Endpoints</p>
            <p className="text-muted-foreground">
              The <code className="bg-muted px-1 rounded">/client-metadata.json</code> and{' '}
              <code className="bg-muted px-1 rounded">/jwks.json</code> endpoints automatically 
              detect the base URL from request headers - no manual configuration needed.
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">2. OAuth Flow</p>
            <p className="text-muted-foreground">
              Login → ATProto OAuth → Callback → Session stored in Supabase
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">3. Session Storage</p>
            <p className="text-muted-foreground">
              Sessions are stored in Supabase <code className="bg-muted px-1 rounded">oauth_sessions</code> table,
              OAuth states in <code className="bg-muted px-1 rounded">oauth_states</code> table (auto-expire after 10 min)
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">4. Repository Access</p>
            <p className="text-muted-foreground">
              Once authenticated, you can access your PDS (personal data) or SDS (organization data)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Links */}
      <Card>
        <CardHeader>
          <CardTitle>Test OAuth Endpoints</CardTitle>
          <CardDescription>
            Verify the dynamic endpoints are working correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <a 
              href="/client-metadata.json" 
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              /client-metadata.json
            </a>
            <p className="text-muted-foreground text-xs">
              Should show dynamic client_id matching current domain
            </p>
          </div>
          <div>
            <a 
              href="/jwks.json" 
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              /jwks.json
            </a>
            <p className="text-muted-foreground text-xs">
              Should show public key derived from private JWK
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
