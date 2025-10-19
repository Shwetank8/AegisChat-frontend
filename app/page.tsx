import MatrixBg from "@/components/matrix-bg"
import LandingHero from "@/components/landing-hero"

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <MatrixBg />
      <div className="relative">
        <header className="sr-only">
          <h1>CipherChat</h1>
        </header>

        <div className="mx-auto w-full max-w-6xl px-6 pt-20">
          <div className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-brand)]/20 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-brand)] shadow-[0_0_12px_var(--color-brand)]" />
            Live, private rooms
          </div>
        </div>

        <LandingHero />

        <footer className="mx-auto w-full max-w-6xl px-6 pb-10">
          <p className="text-xs text-muted-foreground">Built with Next.js, Node.js, Socket.io, and Redis.</p>
        </footer>
      </div>
    </main>
  )
}
