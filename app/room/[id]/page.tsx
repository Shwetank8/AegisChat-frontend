import ChatRoom from "../../../components/chat-room";


export default function RoomPage({ params }: { params: { id: string } }) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      <ChatRoom roomId={params.id} />
    </main>
  )
}
