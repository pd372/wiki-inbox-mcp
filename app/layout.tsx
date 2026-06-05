import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wiki Inbox MCP',
  description: 'MCP server for saving Claude session notes to a personal wiki inbox',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
