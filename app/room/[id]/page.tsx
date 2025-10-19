"use client"

import { useSearchParams } from "next/navigation"
import ChatRoom from "../../../components/chat-room"

interface RoomPageProps {
  params: { id: string }
}

export default function RoomPage({ params }: RoomPageProps) {
  const searchParams = useSearchParams()
  const username = searchParams.get("username") || "Anonymous"

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      <ChatRoom roomId={params.id} username={username} />
    </main>
  )
}
