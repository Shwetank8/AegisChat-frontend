interface Message {
  id: string
  text: string
  timestamp: Date
  isOwn: boolean
}

export default function ChatMessage({ message }: { message: Message }) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  return (
    <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs rounded-lg px-4 py-2 ${
          message.isOwn ? "bg-[color:var(--color-brand)]/20 text-foreground" : "bg-muted text-foreground"
        }`}
      >
        <p className="break-words text-sm">{message.text}</p>
        <p className="mt-1 text-xs text-muted-foreground">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  )
}
