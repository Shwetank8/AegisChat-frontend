"use client"

import { useState, useRef, useEffect } from "react"
import { Copy, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import ChatMessage from "./chat-message"
import FileMessage from "./file-message"
import ChatInput from "./chat-input"
import socket from "../utils/socket"
import { Message } from "../utils/types"
import { encryptMessage, decryptMessage } from "../utils/encryption"
import { uploadFile, FileMetadata } from "../utils/fileUpload"

interface ChatRoomProps {
  roomId: string
  username: string
}

export default function ChatRoom({ roomId, username }: ChatRoomProps) {
  
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<Array<{ id: string; username: string }>>([
    { id: `${username}-${Date.now()}`, username },
  ])
  const [roomKey, setRoomKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Join room & listen for events
  useEffect(() => {
    // Check if we have a stored key for this room (for room creator)
    const storedKey = sessionStorage.getItem(`room_${roomId}_key`)
    if (storedKey) {
      setRoomKey(storedKey)
      sessionStorage.removeItem(`room_${roomId}_key`) // Clear it after use
    }

    socket.emit("join_room", { roomId, username }, (response: any) => {
      if (response.success) {
        // Store the encryption key if we don't already have it
        if (!storedKey && response.roomKey) {
          setRoomKey(response.roomKey)
        }
        // Decrypt and set messages using the appropriate key
        const key = storedKey || response.roomKey
        if (key) {
          setMessages(
            response.messages.map((msg: any) => ({
              id: msg.id.toString(),
              text: decryptMessage(msg.message, key),
              username: msg.username,
              timestamp: msg.timestamp,
              isOwn: msg.userId === socket.id,
              userId: msg.userId,
            }))
          )
        }
      } else {
        alert(response.error || "Failed to join room")
      }
    })

    socket.on("new_message", (msg: any) => {
      if (!roomKey) return;
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id.toString(),
          text: msg.type === 'text' ? decryptMessage(msg.message, roomKey) : '',
          username: msg.username,
          timestamp: msg.timestamp,
          isOwn: msg.userId === socket.id,
          userId: msg.userId,
          type: msg.type || 'text',
          fileData: msg.fileData
        },
      ])
    })

    socket.on("user_joined", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.message,
          username: "System",
          timestamp: new Date().toISOString(),
          isOwn: false,
          userId: data.userId || "",
        },
      ])
      setUsers((prev) => {
        const newUserId = `${data.username}-${data.userId || Date.now()}`
        if (!prev.some((u) => u.id === newUserId))
          return [...prev, { id: newUserId, username: data.username }]
        return prev
      })
    })

    socket.on("user_left", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.message,
          username: "System",
          timestamp: new Date().toISOString(),
          isOwn: false,
          userId: data.userId || "",
        },
      ])
      setUsers((prev) =>
        prev.filter((u) => u.id !== `${data.username}-${data.userId || ""}`)
      )
    })

    return () => {
      socket.off("new_message")
      socket.off("user_joined")
      socket.off("user_left")
    }
  }, [roomId, username, roomKey])

  useEffect(scrollToBottom, [messages])

  // encrypt and send message
  const handleSendMessage = (text: string) => {
    if (!text.trim() || !roomKey) return;
    const encryptedMessage = encryptMessage(text.trim(), roomKey);
    socket.emit("send_message", { 
      roomId, 
      encryptedMessage, 
      username,
      type: 'text'
    });
  }

  const handleFileUpload = async (file: File) => {
    if (!roomKey) return;
    try {
      const { fileId } = await uploadFile(file, roomId);
      // Notify other users about the file
      socket.emit("file_message", {
        roomId,
        fileData: {
          id: fileId,
          filename: file.name,
          mimetype: file.type
        },
        username
      });
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-background p-2 sm:p-4">
      <div className="relative w-full max-w-6xl rounded-xl border border-[color:var(--color-brand)]/30 bg-background/50 shadow-lg shadow-[color:var(--color-brand)]/10 backdrop-blur-sm flex flex-col h-dvh md:h-[90vh]">
        
        {/* Header */}
        <header className="border-b border-[color:var(--color-brand)]/10 bg-background/80 backdrop-blur-sm rounded-t-xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Room ID</p>
            <p className="font-mono text-xs sm:text-sm text-foreground break-all">{roomId}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg border border-[color:var(--color-brand)]/20 hover:bg-[color:var(--color-brand)]/10 transition"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar (mobile overlay + desktop static) */}
          <aside
            className={`absolute md:static z-20 w-full md:w-48 bg-background/95 backdrop-blur-sm border-r border-[color:var(--color-brand)]/10 transform transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            } flex flex-col`}
          >
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-[color:var(--color-brand)]/10">
                <p className="text-xs text-muted-foreground mb-2">Your Username</p>
                <p className="font-mono text-sm text-[color:var(--color-brand)] truncate">{username}</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-3">Users in Room</p>
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[color:var(--color-brand)]" />
                      <span className="text-xs text-foreground truncate">{user.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[color:var(--color-brand)]/10 p-4 space-y-2">
              <button
                onClick={handleCopyRoomId}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[color:var(--color-brand)]/20 bg-[color:var(--color-brand)]/5 px-3 py-2 text-xs transition-all hover:border-[color:var(--color-brand)]/40 hover:bg-[color:var(--color-brand)]/10"
              >
                <Copy className="h-4 w-4" />
                <span>{copied ? "Copied!" : "Copy ID"}</span>
              </button>

              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs font-medium text-red-400 transition-all hover:border-red-500/60 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Exit</span>
              </Link>
            </div>
          </aside>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mb-3 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg border border-[color:var(--color-brand)]/20 bg-[color:var(--color-brand)]/5">
                      <span className="text-lg">🔐</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {roomKey ? "No messages yet. Start the conversation." : "Establishing secure connection..."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {messages.map((msg, index) => (
                    msg.type === 'file' && msg.fileData ? (
                      <FileMessage
                        key={`${msg.id}-${msg.timestamp}-${index}-file`}
                        file={msg.fileData}
                        roomId={roomId}
                        isOwn={msg.isOwn}
                        username={msg.username}
                      />
                    ) : (
                      <ChatMessage 
                        key={`${msg.id}-${msg.timestamp}-${index}-msg`} 
                        message={msg} 
                      />
                    )
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="border-t border-[color:var(--color-brand)]/10 bg-background/80 backdrop-blur-sm px-3 sm:px-6 py-3 sm:py-4">
              <ChatInput 
                onSendMessage={handleSendMessage}
                onFileUpload={handleFileUpload}
                roomId={roomId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
