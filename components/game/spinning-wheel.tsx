"use client"

import { useGame, type FruitSymbol } from "@/lib/game-context"
import { useEffect, useRef, useState } from "react"

const SEGMENTS: { symbol: FruitSymbol; color1: string; color2: string }[] = [
  { symbol: "watermelon", color1: "#2979FF", color2: "#1565C0" },
  { symbol: "plum",       color1: "#1A237E", color2: "#0D1642" },
  { symbol: "seven",      color1: "#E91E8C", color2: "#AD1457" },
  { symbol: "watermelon", color1: "#42A5F5", color2: "#1E88E5" },
  { symbol: "plum",       color1: "#1A237E", color2: "#0D1642" },
  { symbol: "watermelon", color1: "#2979FF", color2: "#1565C0" },
  { symbol: "plum",       color1: "#1A237E", color2: "#0D1642" },
  { symbol: "seven",      color1: "#E91E8C", color2: "#AD1457" },
]

const SEGMENT_COUNT = SEGMENTS.length
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT

function drawFruitOnSegment(symbol: FruitSymbol, midAngle: number, radius: number, cx: number, cy: number) {
  const labelX = cx + radius * Math.cos(midAngle)
  const labelY = cy + radius * Math.sin(midAngle)
  const deg = (midAngle * 180) / Math.PI + 90

  if (symbol === "watermelon") {
    return (
      <g transform={`translate(${labelX}, ${labelY}) rotate(${deg})`}>
        <path d="M-9,4 A11,11 0 0,1 9,4 L0,-8 Z" fill="#2e7d32" />
        <path d="M-7,3 A9,9 0 0,1 7,3 L0,-5.5 Z" fill="#e53935" />
        <circle r="0.9" cx="-3" cy="1" fill="#1b5e20" />
        <circle r="0.9" cx="0" cy="-1" fill="#1b5e20" />
        <circle r="0.9" cx="3" cy="1" fill="#1b5e20" />
      </g>
    )
  }
  if (symbol === "plum") {
    return (
      <g transform={`translate(${labelX}, ${labelY}) rotate(${deg})`}>
        <ellipse rx="8" ry="10" cy="1" fill="#6a1b9a" />
        <ellipse rx="3" ry="4.5" cx="-2.5" cy="-1.5" fill="rgba(255,255,255,0.08)" />
        <path d="M0,-10 Q2,-14 3,-12" stroke="#4caf50" strokeWidth="1.5" fill="none" />
        <ellipse rx="3" ry="1.5" cx="2.5" cy="-12" fill="#66bb6a" />
      </g>
    )
  }
  // seven
  return (
    <g transform={`translate(${labelX}, ${labelY}) rotate(${deg})`}>
      <rect x="-10" y="-8" width="20" height="16" rx="3" fill="rgba(0,0,0,0.25)" />
      <text textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="900" fill="#f0d060" fontFamily="sans-serif">
        77
      </text>
    </g>
  )
}

export function SpinningWheel() {
  const { isSpinning, currentResult } = useGame()
  const [rotation, setRotation] = useState(0)
  const prevSpinRef = useRef(false)
  const [bulbPhase, setBulbPhase] = useState(0)

  // Bulb animation
  useEffect(() => {
    const interval = setInterval(() => setBulbPhase((p) => (p + 1) % 2), 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isSpinning && !prevSpinRef.current) {
      let targetIndex = 0
      if (currentResult) {
        const matches = SEGMENTS.map((s, i) => (s.symbol === currentResult ? i : -1)).filter((i) => i >= 0)
        targetIndex = matches[Math.floor(Math.random() * matches.length)]
      }
      const segCenter = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
      const targetAngle = 360 - segCenter
      const spins = 7 + Math.floor(Math.random() * 3)
      const newRotation = rotation + spins * 360 + targetAngle - (rotation % 360)
      setRotation(newRotation)
    }
    prevSpinRef.current = isSpinning
  }, [isSpinning]) // eslint-disable-line react-hooks/exhaustive-deps

  const wheelSize = 280
  const outerFrameSize = wheelSize + 56

  return (
    <div className="relative flex flex-col items-center game-no-select" style={{ animation: "float 4s ease-in-out infinite" }}>
      {/* Glow behind wheel */}
      <div
        className="absolute rounded-full"
        style={{
          width: outerFrameSize + 40,
          height: outerFrameSize + 40,
          top: -20,
          left: "50%",
          transform: "translateX(-50%)",
          background: isSpinning
            ? "radial-gradient(circle, rgba(233,30,140,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 70%)",
          transition: "background 0.5s",
        }}
      />

      <div className="relative" style={{ width: outerFrameSize, height: outerFrameSize }}>
        {/* Outer decorative frame with bulbs */}
        <svg
          viewBox={`0 0 ${outerFrameSize} ${outerFrameSize}`}
          className="absolute inset-0 w-full h-full"
          style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))" }}
        >
          <defs>
            <linearGradient id="frame-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0d060" />
              <stop offset="30%" stopColor="#d4a017" />
              <stop offset="60%" stopColor="#b8860b" />
              <stop offset="100%" stopColor="#d4a017" />
            </linearGradient>
            <linearGradient id="frame-gold-dark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b8860b" />
              <stop offset="100%" stopColor="#7a5a0a" />
            </linearGradient>
            <filter id="bulb-glow">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Outer thick gold ring */}
          <circle
            cx={outerFrameSize / 2}
            cy={outerFrameSize / 2}
            r={outerFrameSize / 2 - 4}
            fill="none"
            stroke="url(#frame-gold)"
            strokeWidth="10"
          />
          {/* Inner bevel ring */}
          <circle
            cx={outerFrameSize / 2}
            cy={outerFrameSize / 2}
            r={outerFrameSize / 2 - 14}
            fill="none"
            stroke="url(#frame-gold-dark)"
            strokeWidth="3"
          />
          {/* Outer bevel */}
          <circle
            cx={outerFrameSize / 2}
            cy={outerFrameSize / 2}
            r={outerFrameSize / 2 - 1}
            fill="none"
            stroke="#f0d060"
            strokeWidth="0.5"
            opacity="0.4"
          />
          {/* Light bulbs */}
          {Array.from({ length: 28 }).map((_, i) => {
            const angle = (i * 360 / 28 - 90) * Math.PI / 180
            const r = outerFrameSize / 2 - 9
            const x = outerFrameSize / 2 + r * Math.cos(angle)
            const y = outerFrameSize / 2 + r * Math.sin(angle)
            const lit = (i + bulbPhase) % 2 === 0
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3.5"
                fill={lit ? "#fef08a" : "#6b5a0a"}
                filter={lit ? "url(#bulb-glow)" : undefined}
                opacity={lit ? 1 : 0.5}
              />
            )
          })}
        </svg>

        {/* The spinning wheel */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            top: 28,
            left: 28,
            width: wheelSize,
            height: wheelSize,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 4.5s cubic-bezier(0.12, 0.65, 0.05, 1.0)" : "none",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              {SEGMENTS.map((seg, i) => (
                <linearGradient key={i} id={`sg-${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={seg.color1} />
                  <stop offset="100%" stopColor={seg.color2} />
                </linearGradient>
              ))}
              <radialGradient id="wheel-center-grad">
                <stop offset="0%" stopColor="#2a1060" />
                <stop offset="100%" stopColor="#0c0416" />
              </radialGradient>
              <filter id="inner-shadow">
                <feFlood floodColor="rgba(0,0,0,0.3)" />
                <feComposite operator="out" in2="SourceGraphic" />
                <feGaussianBlur stdDeviation="3" />
                <feComposite operator="atop" in2="SourceGraphic" />
              </filter>
            </defs>

            {/* Segments */}
            {SEGMENTS.map((seg, i) => {
              const startA = (i * SEGMENT_ANGLE * Math.PI) / 180
              const endA = ((i + 1) * SEGMENT_ANGLE * Math.PI) / 180
              const x1 = 100 + 98 * Math.cos(startA)
              const y1 = 100 + 98 * Math.sin(startA)
              const x2 = 100 + 98 * Math.cos(endA)
              const y2 = 100 + 98 * Math.sin(endA)
              const midA = (startA + endA) / 2

              return (
                <g key={i}>
                  <path
                    d={`M100,100 L${x1},${y1} A98,98 0 0,1 ${x2},${y2} Z`}
                    fill={`url(#sg-${i})`}
                    stroke="rgba(212,160,23,0.35)"
                    strokeWidth="0.8"
                  />
                  {/* Segment divider line */}
                  <line
                    x1="100" y1="100"
                    x2={x1} y2={y1}
                    stroke="rgba(240,208,96,0.15)"
                    strokeWidth="1.5"
                  />
                  {/* Fruit icon */}
                  {drawFruitOnSegment(seg.symbol, midA, 68, 100, 100)}
                </g>
              )
            })}

            {/* Inner ring */}
            <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(212,160,23,0.2)" strokeWidth="1" />

            {/* Center hub */}
            <circle cx="100" cy="100" r="26" fill="url(#wheel-center-grad)" stroke="#d4a017" strokeWidth="3" />
            <circle cx="100" cy="100" r="22" fill="#0c0416" stroke="#b8860b" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="18" fill="#1e0a3a" stroke="rgba(212,160,23,0.3)" strokeWidth="0.8" />

            {/* Center gem */}
            <circle cx="100" cy="100" r="8" fill="#d4a017" opacity="0.9" />
            <circle cx="100" cy="100" r="5" fill="#f0d060" />
            <circle cx="98" cy="98" r="2" fill="rgba(255,255,255,0.5)" />
          </svg>
        </div>

        {/* Top pointer */}
        <div className="absolute z-30" style={{ top: 6, left: "50%", transform: "translateX(-50%)" }}>
          <svg width="40" height="44" viewBox="0 0 40 44">
            <defs>
              <linearGradient id="ptr-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f0d060" />
                <stop offset="50%" stopColor="#d4a017" />
                <stop offset="100%" stopColor="#8b6914" />
              </linearGradient>
              <filter id="ptr-s">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
              </filter>
            </defs>
            <path
              d="M20,44 L6,14 Q2,4 10,6 L20,10 L30,6 Q38,4 34,14 Z"
              fill="url(#ptr-g)"
              stroke="#b8860b"
              strokeWidth="1"
              filter="url(#ptr-s)"
            />
            {/* Gem on pointer */}
            <circle cx="20" cy="16" r="5" fill="#e91e8c" />
            <circle cx="20" cy="16" r="3" fill="#ff6090" />
            <circle cx="19" cy="15" r="1.2" fill="rgba(255,255,255,0.6)" />
          </svg>
        </div>
      </div>

      {/* Stand / Base */}
      <div className="relative -mt-5 z-10">
        <svg width="220" height="55" viewBox="0 0 220 55">
          <defs>
            <linearGradient id="base-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0d060" />
              <stop offset="50%" stopColor="#d4a017" />
              <stop offset="100%" stopColor="#8b6914" />
            </linearGradient>
            <linearGradient id="base-bot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b6914" />
              <stop offset="100%" stopColor="#5a400a" />
            </linearGradient>
          </defs>
          {/* Top plate */}
          <path d="M40,8 Q110,-6 180,8 L190,22 Q110,32 30,22 Z" fill="url(#base-top)" />
          {/* Front face */}
          <path d="M30,22 Q110,32 190,22 L185,38 Q110,46 35,38 Z" fill="url(#base-bot)" />
          {/* Bottom edge */}
          <path d="M35,38 Q110,46 185,38 L182,43 Q110,50 38,43 Z" fill="#3a2505" />
          {/* Decorative gems */}
          <circle cx="70" cy="18" r="4" fill="#e91e8c" opacity="0.85" />
          <circle cx="70" cy="18" r="2.5" fill="#ff6090" opacity="0.7" />
          <circle cx="110" cy="14" r="5" fill="#d4a017" />
          <circle cx="110" cy="14" r="3" fill="#f0d060" />
          <circle cx="150" cy="18" r="4" fill="#e91e8c" opacity="0.85" />
          <circle cx="150" cy="18" r="2.5" fill="#ff6090" opacity="0.7" />
          {/* Engravings */}
          <path d="M60,28 Q110,34 160,28" fill="none" stroke="rgba(240,208,96,0.3)" strokeWidth="0.8" />
        </svg>
      </div>
    </div>
  )
}
