import { put, list, del, get } from '@vercel/blob'
import type { StorageAdapter, InboxFile } from './index'

export class VercelBlobAdapter implements StorageAdapter {
  async save(filename: string, content: string, userId: string): Promise<string> {
    const key = `${userId}/phone-inbox/${filename}`
    const blob = await put(key, content, {
      access: 'private',
      contentType: 'text/markdown',
      addRandomSuffix: false,
    })
    return blob.url
  }

  async list(userId: string): Promise<InboxFile[]> {
    const prefix = `${userId}/phone-inbox/`
    const { blobs } = await list({ prefix })
    const files: InboxFile[] = []
    for (const blob of blobs) {
      const blobData = await get(blob.url, { access: 'private' })
      const content = blobData?.statusCode === 200
        ? await new Response(blobData.stream).text()
        : ''
      files.push({
        filename: blob.pathname.replace(prefix, ''),
        content,
        savedAt: blob.uploadedAt.toISOString(),
      })
    }
    return files
  }

  async delete(filename: string, userId: string): Promise<void> {
    const key = `${userId}/phone-inbox/${filename}`
    const { blobs } = await list({ prefix: key })
    if (blobs.length > 0) {
      await del(blobs[0].url)
    }
  }
}
