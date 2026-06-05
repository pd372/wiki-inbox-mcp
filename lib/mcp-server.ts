import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { VercelBlobAdapter } from './storage/vercel-blob'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function buildMarkdown(title: string, content: string, tags?: string[]): string {
  const date = new Date().toISOString().split('T')[0]
  const tagLine = tags && tags.length > 0 ? `\ntags: [${tags.join(', ')}]` : ''
  return `---
source: phone-claude
date: ${date}
title: ${title}${tagLine}
---

${content}`
}

export function createMcpServer(userId: string): McpServer {
  const storage = new VercelBlobAdapter()

  const server = new McpServer({
    name: 'wiki-inbox',
    version: '1.0.0',
  })

  server.registerTool(
    'save_to_wiki',
    {
      description: 'Save a note or summary to the wiki inbox for later review and ingest',
      inputSchema: {
        title: z.string().describe('Title for the note — becomes the filename'),
        content: z.string().describe('Markdown content to save'),
        tags: z.array(z.string()).optional().describe('Optional topic tags'),
      },
    },
    async ({ title, content, tags }) => {
      const date = new Date().toISOString().split('T')[0]
      const filename = `${date}-${slugify(title)}.md`
      const markdown = buildMarkdown(title, content, tags)
      await storage.save(filename, markdown, userId)
      return {
        content: [{ type: 'text', text: `Saved "${title}" to wiki inbox as \`${filename}\`` }],
      }
    }
  )

  server.registerTool(
    'list_inbox',
    {
      description: 'List pending items in the wiki inbox that have not yet been synced to the laptop',
      inputSchema: {},
    },
    async () => {
      const files = await storage.list(userId)
      if (files.length === 0) {
        return { content: [{ type: 'text', text: 'No items pending in the wiki inbox.' }] }
      }
      const lines = files.map((f) => `- **${f.filename}** (saved ${f.savedAt.split('T')[0]})`)
      return {
        content: [
          {
            type: 'text',
            text: `${files.length} item(s) pending in wiki inbox:\n\n${lines.join('\n')}`,
          },
        ],
      }
    }
  )

  return server
}
