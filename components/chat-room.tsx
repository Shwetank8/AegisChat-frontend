"use client"

import { useState, useRef, useEffect } from "react"
import { Copy, ArrowLeft } from "lucide-react"
import Link from "next/link"
import ChatMessage from "./chat-message"
import ChatInput from "./chat-input"

interface Message {
  id: string
  text: string
  timestamp: Date
  isOwn: boolean
}

export default function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [copied, setCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      timestamp: new Date(),
      isOwn: true,
    }

    setMessages((prev) => [...prev, newMessage])
  }

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl rounded-xl border border-[color:var(--color-brand)]/30 bg-background/50 shadow-lg shadow-[color:var(--color-brand)]/10 backdrop-blur-sm flex flex-col h-dvh md:h-[90vh]">
        {/* Header */}
        <header className="border-b border-[color:var(--color-brand)]/10 bg-background/80 backdrop-blur-sm rounded-t-xl">
          <div className="flex w-full items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-muted"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div>
                <p className="text-xs text-muted-foreground">Room ID</p>
                <p className="font-mono text-sm text-foreground">{roomId}</p>
              </div>
            </div>

            <button
              onClick={handleCopyRoomId}
              className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-brand)]/20 bg-[color:var(--color-brand)]/5 px-3 py-2 text-xs transition-all hover:border-[color:var(--color-brand)]/40 hover:bg-[color:var(--color-brand)]/10"
              aria-label="Copy room ID"
            >
              <Copy className="h-4 w-4" />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-6 py-6">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-[color:var(--color-brand)]/20 bg-[color:var(--color-brand)]/5">
                    <span className="text-lg">🔐</span>
                  </div>
                  <p className="text-sm text-muted-foreground">No messages yet. Start the conversation.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-[color:var(--color-brand)]/10 bg-background/80 backdrop-blur-sm rounded-b-xl">
          <div className="w-full px-6 py-4">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  )
}
