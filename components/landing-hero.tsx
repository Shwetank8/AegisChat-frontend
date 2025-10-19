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

  // Create a new room
  const createRoom = () => {
    if (!canCreate) return alert("Enter your name first!")

    // Emit to backend and get roomId
    socket.emit("create_room", (response: any) => {
      if (response.success) {
        // Redirect to dynamic room page with username
        router.push(`/room/${response.roomId}?username=${encodeURIComponent(username)}`)
      } else {
        alert("Failed to create room.")
      }
    })
  }

  // Join an existing room
  const joinRoom = () => {
    const id = roomId.trim()
    if (!id) return alert("Enter a valid room ID!")
    if (!canCreate) return alert("Enter your name first!")

    // Redirect to the room page with username
    router.push(`/room/${id}?username=${encodeURIComponent(username)}`)
  }

  return (
    <section className="relative mx-auto w-full max-w-4xl px-6 py-24 md:py-28">
      <div className="text-center space-y-6">
        <span className="inline-block rounded-full border border-[color:var(--color-brand)]/30 px-3 py-1 text-xs tracking-wider text-[color:var(--color-brand)]">
          CipherChat
        </span>

        <h1
          className={cn(
            "text-pretty font-mono text-4xl leading-tight md:text-5xl lg:text-6xl",
            "drop-shadow-[0_0_20px_var(--color-brand)]"
          )}
        >
          Secure. Private. Encrypted.
        </h1>

        <p className="text-pretty mx-auto max-w-2xl text-sm md:text-base text-muted-foreground">
          Create or join a private chat room. No servers read your messages.
        </p>

        {/* Username Input */}
        <div className="mt-6 flex justify-center">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full max-w-sm font-mono bg-transparent border border-[color:var(--color-accent-2)]/70 focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-2)] placeholder:text-muted-foreground"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
          <Button
            size="lg"
            onClick={createRoom}
            className={cn(
              "w-full md:w-auto font-mono",
              "bg-transparent text-foreground",
              "border border-[color:var(--color-brand)]",
              "ring-0 hover:bg-[color:var(--color-brand)]/10",
              "shadow-[0_0_0_0_transparent] hover:shadow-[0_0_24px_var(--color-brand)]"
            )}
          >
            Create Room
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowJoin((s) => !s)}
            aria-expanded={showJoin}
            aria-controls="join-panel"
            className={cn(
              "w-full md:w-auto font-mono",
              "bg-transparent text-foreground",
              "border border-[color:var(--color-accent-2)]",
              "hover:bg-[color:var(--color-accent-2)]/10",
              "shadow-[0_0_0_0_transparent] hover:shadow-[0_0_24px_var(--color-accent-2)]"
            )}
          >
            Join Room
          </Button>
        </div>

        {/* Join Panel */}
        <div
          id="join-panel"
          className={cn(
            "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out",
            showJoin && "grid-rows-[1fr]"
          )}
        >
          <div className="overflow-hidden">
            <div
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2",
                showJoin ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
                "transition-all duration-300 ease-out"
              )}
            >
              <Input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="w-full max-w-md font-mono bg-transparent border border-[color:var(--color-accent-2)]/70 focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-2)] placeholder:text-muted-foreground"
              />
              <Button
                size="lg"
                onClick={joinRoom}
                disabled={!canJoin}
                className={cn(
                  "font-mono",
                  "bg-transparent text-foreground",
                  "border border-[color:var(--color-brand)]",
                  "hover:bg-[color:var(--color-brand)]/10",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
