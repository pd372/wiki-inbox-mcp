import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { VercelBlobAdapter } from '@/lib/storage/vercel-blob'

const storage = new VercelBlobAdapter()

export async function GET(req: Request) {
  const auth = requireAuth(req)
  if (auth instanceof Response) return auth

  const files = await storage.list(auth.userId)
  return Response.json({ files })
}

export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof Response) return auth

  const filename = req.nextUrl.searchParams.get('filename')
  if (!filename) {
    return Response.json({ error: 'filename query param required' }, { status: 400 })
  }

  await storage.delete(filename, auth.userId)
  return Response.json({ ok: true })
}
