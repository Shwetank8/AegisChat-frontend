// /app/types.ts
export interface Message {
  id: string
  text: string
  username: string
  timestamp: string
  isOwn: boolean
  userId: string
  type?: 'text' | 'file'
  fileData?: {
    id: number
    filename: string
    mimetype: string
    timestamp: string
  }
}
