"use client"

import { useGame } from "@/lib/game-context"
import { cn } from "@/lib/utils"

const CHIPS = [
  { value: 500, label: "500", bg: "#92400e", border: "#d97706", text: "#fbbf24" },
  { value: 1000, label: "1K", bg: "#065f46", border: "#10b981", text: "#6ee7b7" },
  { value: 10000, label: "10K", bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" },
  { value: 100000, label: "100K", bg: "#7f1d1d", border: "#ef4444", text: "#fca5a5" },
]

export function ChipSelector() {
  const { selectedChip, setSelectedChip, isSpinning } = useGame()

  return (
    <div className="flex items-center justify-center gap-3 px-4">
      {CHIPS.map((chip) => {
        const isSelected = selectedChip === chip.value
        return (
          <button
            key={chip.value}
            onClick={() => setSelectedChip(chip.value)}
            disabled={isSpinning}
            className={cn(
              "relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-xs transition-all",
              "disabled:cursor-not-allowed",
              isSelected ? "scale-110 shadow-lg" : "opacity-60 hover:opacity-90 hover:scale-105"
            )}
            style={{
              background: `radial-gradient(circle at 35% 35%, ${chip.border}, ${chip.bg})`,
              boxShadow: isSelected
                ? `0 0 20px ${chip.border}60, 0 4px 15px rgba(0,0,0,0.4)`
                : "0 2px 8px rgba(0,0,0,0.3)",
              border: `3px solid ${isSelected ? chip.border : chip.bg}`,
            }}
          >
            {/* Inner ring */}
            <div
              className="absolute inset-1.5 rounded-full pointer-events-none"
              style={{
                border: `1.5px dashed ${chip.border}80`,
              }}
            />
            {/* Inner ring 2 */}
            <div
              className="absolute inset-2.5 rounded-full pointer-events-none"
              style={{
                border: `1px solid ${chip.border}40`,
              }}
            />
            <span style={{ color: chip.text }} className="relative z-10 drop-shadow-md text-sm font-bold">
              {chip.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
