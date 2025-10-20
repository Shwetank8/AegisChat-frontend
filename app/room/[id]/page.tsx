"use client"

import { useParams, useSearchParams } from "next/navigation"
import ChatRoom from "../../../components/chat-room"

export default function RoomPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const username = searchParams.get("username") || "Anonymous"
  const roomId = params?.id as string

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      <ChatRoom roomId={roomId} username={username} />
    </main>
  )
}
