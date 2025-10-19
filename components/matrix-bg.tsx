"use client"

import { useEffect, useRef } from "react"

/**
 * Subtle matrix-style rain animation background.
 * Renders a canvas behind content; pointer-events disabled.
 */
export default function MatrixBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      init()
    }
    window.addEventListener("resize", onResize)

    // Characters and columns
    const chars = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const charArray = chars.split("")

    let columnCount = Math.floor(width / 16)
    let drops: number[] = []

    function init() {
      columnCount = Math.floor(width / 16)
      drops = Array.from({ length: columnCount }, () => Math.random() * -height)
    }

    function draw() {
      if (!ctx) return;
      // fade trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)"
      ctx.fillRect(0, 0, width, height)

      // glow color using CSS vars (teal primary with a hint of purple)
      const teal = getComputedStyle(document.documentElement).getPropertyValue("--brand") || "oklch(0.8 0.15 180)"
      const purple = getComputedStyle(document.documentElement).getPropertyValue("--accent-2") || "oklch(0.78 0.2 300)"

      ctx.font =
        '14px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[(Math.random() * charArray.length) | 0]
        // alternating hues for subtle variance
        ctx.fillStyle =
          i % 7 === 0 ? `color-mix(in oklch, ${teal} 80%, ${purple})` : `color-mix(in oklch, ${teal}, black 10%)`
        ctx.shadowColor = `color-mix(in oklch, ${teal}, black 20%)`
        ctx.shadowBlur = 8

        const x = i * 16
        const y = drops[i] * 16
        ctx.fillText(text, x, y)

        if (y > height && Math.random() > 0.975) {
          drops[i] = Math.random() * -height
        } else {
          drops[i] += 0.9 + Math.random() * 0.75
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    init()
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 -z-10 h-full w-full pointer-events-none" />
}
