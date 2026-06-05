export type AuthResult = { userId: string }

export function requireAuth(req: Request): AuthResult | Response {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '').trim()
  if (!token || token !== process.env.MCP_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  // Single user for now; swap for DB lookup when multi-user
  return { userId: 'pedro' }
}
