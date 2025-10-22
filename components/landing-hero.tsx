"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import socket from "../utils/socket"

export default function LandingHero() {
  const router = useRouter()
  const [showJoin, setShowJoin] = useState(false)
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")

  const canJoin = useMemo(() => roomId.trim().length > 0, [roomId])
  const canCreate = useMemo(() => username.trim().length > 0, [username])

  const createRoom = () => {
    if (!canCreate) return alert("Enter your name first!")
    socket.emit("create_room", (response: any) => {
      if (response.success && response.roomKey) {
        // Store the room key in session storage temporarily
        sessionStorage.setItem(`room_${response.roomId}_key`, response.roomKey)
        router.push(`/room/${response.roomId}?username=${encodeURIComponent(username)}`)
      } else {
        alert("Failed to create room.")
      }
    })
  }

  const joinRoom = () => {
    const id = roomId.trim()
    if (!id) return alert("Enter a valid room ID!")
    if (!canCreate) return alert("Enter your name first!")
    router.push(`/room/${id}?username=${encodeURIComponent(username)}`)
  }

  return (
    <section className="flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6 w-full max-w-4xl">
        <span className="inline-block rounded-full border border-[color:var(--color-brand)]/30 px-3 py-1 text-xs tracking-wider text-[color:var(--color-brand)]">
          AegisChat
        </span>

        <h1
          className={cn(
            "text-pretty font-mono text-3xl md:text-4xl lg:text-5xl",
            "leading-tight drop-shadow-[0_0_15px_var(--color-brand)]"
          )}
        >
          Secure. Private. Encrypted.
        </h1>

        <p className="text-pretty mx-auto max-w-2xl text-sm md:text-base text-muted-foreground">
          Create or join a private chat room. No servers read your messages.
        </p>

        {/* Username Input */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full max-w-sm font-mono bg-transparent border border-[color:var(--color-accent-2)]/70 focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-2)] placeholder:text-muted-foreground"
          />
        </div>

        {/* Join Panel */}
        {showJoin && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <Input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="w-full max-w-sm font-mono bg-transparent border border-[color:var(--color-accent-2)]/70 focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-2)] placeholder:text-muted-foreground"
            />
            <Button
              size="lg"
              onClick={joinRoom}
              disabled={!canJoin}
              className={cn(
                "w-full max-w-sm font-mono bg-transparent text-foreground border border-[color:var(--color-brand)] hover:bg-[color:var(--color-brand)]/10 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              Join
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
          <Button
            size="lg"
            onClick={createRoom}
            className={cn(
              "w-full md:w-auto font-mono bg-transparent text-foreground border border-[color:var(--color-brand)] hover:bg-[color:var(--color-brand)]/10 shadow-[0_0_0_0_transparent] hover:shadow-[0_0_20px_var(--color-brand)]"
            )}
          >
            Create Room
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowJoin((s) => !s)}
            className={cn(
              "w-full md:w-auto font-mono bg-transparent text-foreground border border-[color:var(--color-accent-2)] hover:bg-[color:var(--color-accent-2)]/10 shadow-[0_0_0_0_transparent] hover:shadow-[0_0_20px_var(--color-accent-2)]"
            )}
          >
            Join Room
          </Button>
        </div>
      </div>
    </section>
  )
}
