import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

interface SessionInfoProps {
  userDid: string
  server: 'pds' | 'sds'
}

export default function SessionInfo({ userDid, server }: SessionInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <CardTitle>Authentication Successful</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">DID</p>
          <code className="text-sm bg-muted px-2 py-1 rounded block mt-1 break-all">
            {userDid}
          </code>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Server Type</p>
          <p className="text-sm mt-1">
            <span className="font-mono bg-muted px-2 py-0.5 rounded">
              {server.toUpperCase()}
            </span>
            {' - '}
            {server === 'pds' ? 'Personal Data Server' : 'Shared Data Server'}
          </p>
        </div>

        <div className="pt-4 border-t space-y-1">
          <div className="flex items-center gap-2 text-xs text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            <span>Authenticated with Hypercerts SDK</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            <span>Session stored in Supabase</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            <span>Ready to access {server.toUpperCase()} repository</span>
          </div>
        </div>

        <div className="pt-4 text-xs text-muted-foreground">
          <p>💡 Session will persist for 7 days or until browser cookies are cleared</p>
        </div>
      </CardContent>
    </Card>
  )
}
