export type AuthResult = { userId: string }

export function requireAuth(req: Request): AuthResult | Response {
  // Accept token from Authorization header or ?token= query param (for MCP connectors)
  const headerToken = req.headers.get('Authorization')?.replace('Bearer ', '').trim()
  const urlToken = new URL(req.url).searchParams.get('token') ?? undefined
  const token = headerToken || urlToken

  if (!token || token !== process.env.MCP_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  // Single user for now; swap for DB lookup when multi-user
  return { userId: 'pedro' }
}
