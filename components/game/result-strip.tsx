"use client"

import { useGame, type FruitSymbol } from "@/lib/game-context"

export function FruitIcon({ symbol, size = "sm" }: { symbol: FruitSymbol; size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? 22 : size === "md" ? 32 : 44

  return (
    <svg width={s} height={s} viewBox="0 0 40 40" className="flex-shrink-0">
      {symbol === "watermelon" && (
        <>
          <defs>
            <radialGradient id={`wm-g-${s}`} cx="40%" cy="40%">
              <stop offset="0%" stopColor="#4caf50" />
              <stop offset="100%" stopColor="#1b5e20" />
            </radialGradient>
            <radialGradient id={`wm-r-${s}`} cx="45%" cy="40%">
              <stop offset="0%" stopColor="#ff5252" />
              <stop offset="100%" stopColor="#c62828" />
            </radialGradient>
          </defs>
          {/* Outer rind */}
          <path d="M6,28 A16,16 0 0,1 34,28 L20,6 Z" fill={`url(#wm-g-${s})`} />
          <path d="M6,28 A16,16 0 0,1 34,28 L20,6 Z" fill="none" stroke="#2e7d32" strokeWidth="1.5" />
          {/* Red flesh */}
          <path d="M9,27 A13,13 0 0,1 31,27 L20,10 Z" fill={`url(#wm-r-${s})`} />
          {/* Seeds */}
          <ellipse cx="15" cy="22" rx="1.2" ry="1.8" fill="#1b5e20" transform="rotate(-15,15,22)" />
          <ellipse cx="20" cy="20" rx="1.2" ry="1.8" fill="#1b5e20" />
          <ellipse cx="25" cy="22" rx="1.2" ry="1.8" fill="#1b5e20" transform="rotate(15,25,22)" />
          <ellipse cx="17.5" cy="25" rx="1" ry="1.5" fill="#1b5e20" transform="rotate(-10,17.5,25)" />
          <ellipse cx="22.5" cy="25" rx="1" ry="1.5" fill="#1b5e20" transform="rotate(10,22.5,25)" />
          {/* Highlight */}
          <path d="M12,22 Q16,14 20,12" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {symbol === "plum" && (
        <>
          <defs>
            <radialGradient id={`pl-g-${s}`} cx="35%" cy="35%">
              <stop offset="0%" stopColor="#9c27b0" />
              <stop offset="70%" stopColor="#6a1b9a" />
              <stop offset="100%" stopColor="#4a148c" />
            </radialGradient>
          </defs>
          {/* Stem */}
          <path d="M20,8 Q22,3 24,5" stroke="#5d4037" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Leaf */}
          <ellipse cx="24" cy="6" rx="4" ry="2.5" fill="#66bb6a" transform="rotate(20,24,6)" />
          <path d="M22,6 L26,5.5" stroke="#2e7d32" strokeWidth="0.6" fill="none" />
          {/* Main body */}
          <ellipse cx="20" cy="22" rx="12" ry="14" fill={`url(#pl-g-${s})`} />
          {/* Cleft line */}
          <path d="M20,9 Q19,22 20,35" stroke="#4a148c" strokeWidth="0.8" fill="none" opacity="0.5" />
          {/* Highlight */}
          <ellipse cx="15" cy="18" rx="4" ry="6" fill="rgba(255,255,255,0.12)" transform="rotate(-10,15,18)" />
          {/* Bottom shadow */}
          <ellipse cx="20" cy="34" rx="8" ry="2" fill="rgba(0,0,0,0.15)" />
        </>
      )}
      {symbol === "seven" && (
        <>
          <defs>
            <linearGradient id={`sv-g-${s}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6090" />
              <stop offset="50%" stopColor="#e91e8c" />
              <stop offset="100%" stopColor="#ad1457" />
            </linearGradient>
          </defs>
          {/* Background badge */}
          <rect x="3" y="5" width="34" height="30" rx="6" fill={`url(#sv-g-${s})`} />
          <rect x="5" y="7" width="30" height="26" rx="4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* 77 text */}
          <text
            x="20"
            y="23"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="18"
            fontWeight="900"
            fill="#f0d060"
            fontFamily="sans-serif"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" } as React.CSSProperties}
          >
            77
          </text>
          {/* Shine */}
          <rect x="3" y="5" width="34" height="14" rx="6" fill="rgba(255,255,255,0.08)" />
        </>
      )}
    </svg>
  )
}

export function ResultStrip() {
  const { resultStrip, mounted } = useGame()

  if (!mounted || resultStrip.length === 0) {
    return (
      <div className="w-full h-12 bg-gradient-to-b from-deep-purple/80 to-card/60 border-y border-gold/10" />
    )
  }

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-deep-purple/80 to-card/60 border-y border-gold/15 py-1.5">
      <div className="flex items-center justify-center gap-1 px-2">
        {resultStrip.map((symbol, i) => {
          const isLast = i === resultStrip.length - 1
          return (
            <div
              key={i}
              className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-300 ${
                isLast
                  ? "bg-gold/15 border-2 border-gold/60 scale-110"
                  : "bg-card/30 border border-border/20"
              }`}
              style={isLast ? { boxShadow: "0 0 12px rgba(212,160,23,0.3)" } : undefined}
            >
              <FruitIcon symbol={symbol} size="sm" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
