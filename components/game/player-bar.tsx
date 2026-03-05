"use client"

import { useGame } from "@/lib/game-context"
import { Coins } from "lucide-react"

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + "M"
  if (n >= 1000) return (n / 1000).toFixed(1) + "K"
  return n.toLocaleString()
}

export function PlayerBar() {
  const { balance } = useGame()

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card/50 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold border border-gold/40">
          P
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-medium">{"Guest"}</span>
          <div className="flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-bold">{formatNumber(balance)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
