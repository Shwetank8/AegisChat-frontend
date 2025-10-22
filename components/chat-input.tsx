"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip } from "lucide-react"
import { uploadFile } from "../utils/fileUpload"

interface ChatInputProps {
  onSendMessage: (text: string) => void
  onFileUpload: (file: File) => Promise<void>
  roomId: string
}

export default function ChatInput({ onSendMessage, onFileUpload, roomId }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSend = () => {
    onSendMessage(input)
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await onFileUpload(file);
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className={`flex items-center justify-between flex-row gap-3 rounded-lg border transition-all ${
        isFocused
          ? "border-[color:var(--color-brand)]/40 bg-background/50 shadow-[0_0_20px_var(--color-brand)]/10"
          : "border-[color:var(--color-brand)]/10 bg-background/30"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,application/pdf,.doc,.docx,.txt"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="mb-3 ml-3 mt-3 inline-flex items-center justify-center rounded-lg bg-[color:var(--color-brand)]/20 p-2 transition-all hover:bg-[color:var(--color-brand)]/30 disabled:opacity-50"
        aria-label="Attach file"
      >
        <Paperclip className="h-4 w-4 text-[color:var(--color-brand)]" />
      </button>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Type your message... (Shift+Enter for new line)"
        className="flex-1 resize-none bg-transparent px-4 py-3 text-sm placeholder-muted-foreground outline-none"
        rows={1}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || isUploading}
        className="mb-3 mr-3 mt-3 inline-flex items-center justify-center rounded-lg bg-[color:var(--color-brand)]/20 p-2 transition-all hover:bg-[color:var(--color-brand)]/30 disabled:opacity-50 disabled:hover:bg-[color:var(--color-brand)]/20"
        aria-label="Send message"
      >
        <Send className="h-4 w-4 text-[color:var(--color-brand)]" />
      </button>
    </div>
  )
}
