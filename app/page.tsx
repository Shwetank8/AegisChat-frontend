import MatrixBg from "@/components/matrix-bg"
import LandingHero from "@/components/landing-hero"

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden flex flex-col items-center justify-center">
      <MatrixBg />
      <div className="relative w-full">
        <header className="sr-only">
          <h1>AegisChat</h1>
        </header>

        {/* Tagline */}
        <div className="mx-auto w-full max-w-5xl px-6 pt-10">
          <div className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-brand)]/20 bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-brand)] shadow-[0_0_8px_var(--color-brand)]" />
            Live, private rooms
          </div>
        </div>

        {/* Hero Section */}
        <div className="mt-6">
          <LandingHero />
        </div>

        {/* About Section (Now closer to Hero) */}
        <section className="mx-auto w-full max-w-4xl px-6 mt-8 text-center mb-4">
          <div className="rounded-xl border border-[color:var(--color-brand)]/20 bg-background/50 backdrop-blur-sm p-6 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
            <h2 className="mb-3 text-lg font-mono text-[color:var(--color-brand)]">
              The Legend Behind AegisChat
            </h2>
            <p className="text-muted-foreground font-mono leading-relaxed text-sm md:text-base">
              Forged in ancient myth, the Aegis
              was the impenetrable shield of Zeus and Athena — a symbol of ultimate protection and power. 
              Just like the legendary Aegis, AegisChat 
              shields your conversations, keeping every message secure, private, and untouchable.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
