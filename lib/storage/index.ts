export interface InboxFile {
  filename: string
  content: string
  savedAt: string
}

export interface StorageAdapter {
  save(filename: string, content: string, userId: string): Promise<string>
  list(userId: string): Promise<InboxFile[]>
  delete(filename: string, userId: string): Promise<void>
}
