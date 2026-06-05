import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { requireAuth } from '@/lib/auth'
import { createMcpServer } from '@/lib/mcp-server'

export const maxDuration = 60

async function handleMcp(req: Request): Promise<Response> {
  const auth = requireAuth(req)
  if (auth instanceof Response) return auth

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — new transport per request
  })

  const server = createMcpServer(auth.userId)
  await server.connect(transport)

  return transport.handleRequest(req)
}

export { handleMcp as GET, handleMcp as POST, handleMcp as DELETE }
