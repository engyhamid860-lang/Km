"use client"

import { useGame, type FruitSymbol } from "@/lib/game-context"
import { FruitIcon } from "./result-strip"

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M"
  if (n >= 1000) return (n / 1000).toFixed(0) + "K"
  return n.toString()
}

const SLOT_LABELS: Record<FruitSymbol, string> = {
  watermelon: "بطيخ",
  seven: "77",
  plum: "برقوق",
}

export function BetSlots() {
  const { betSlots, placeBet, removeBet, isSpinning } = useGame()

  return (
    <div className="flex gap-1 sm:gap-2 px-2 sm:px-3 w-full max-w-md mx-auto">
      {betSlots.map((slot, index) => (
        <button
          key={index}
          onClick={() => placeBet(index)}
          onContextMenu={(e) => {
            e.preventDefault()
            removeBet(index)
          }}
          disabled={isSpinning}
          className="flex-1 min-w-[80px] sm:min-w-[100px] relative rounded-xl overflow-hidden border-2 border-gold/40 bg-gradient-to-b from-card/90 to-card/60 backdrop-blur-sm p-2 sm:p-3 flex flex-col items-center gap-1 transition-all hover:border-gold hover:shadow-[0_0_20px_rgba(212,160,23,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          
          {/* Bet amount badge */}
          {slot.amount > 0 && (
            <div className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg shadow-md">
              {formatNumber(slot.amount)}
            </div>
          )}

          {/* Multiplier badge */}
          <div className="absolute -top-0.5 -left-0.5 bg-gold/90 text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg rounded-tl-lg">
            x{slot.multiplier}
          </div>

          {/* Amount display top */}
          <div className="text-gold font-bold text-xs sm:text-sm mt-2">
            {slot.amount > 0 ? formatNumber(slot.amount) : "0"}
          </div>

          {/* Fruit icon */}
          <div className="my-1 group-hover:scale-110 transition-transform">
            <FruitIcon symbol={slot.symbol} size="md" />
          </div>

          {/* Label */}
          <div className="text-muted-foreground text-[9px] sm:text-[10px]">
            {SLOT_LABELS[slot.symbol]}
          </div>

          {/* Bottom bet display */}
          <div className="text-accent font-bold text-xs">
            {slot.amount > 0 ? formatNumber(slot.amount) : "0"}
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        </button>
      ))}
    </div>
  )
}