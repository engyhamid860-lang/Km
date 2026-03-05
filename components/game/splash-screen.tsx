"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface SplashScreenProps {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 300)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setFadeOut(true)
          setTimeout(onFinish, 800)
          return 100
        }
        const increment = prev < 30 ? 3 : prev < 70 ? 2 : prev < 90 ? 1.5 : 1
        return Math.min(prev + increment, 100)
      })
    }, 50)
    return () => {
      clearInterval(interval)
      clearTimeout(titleTimer)
    }
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 ${
        fadeOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #2a1060 0%, #0c0416 70%)",
      }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 31 + 7) % 100}%`,
              top: `${(i * 47 + 13) % 100}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: i % 3 === 0 ? "#d4a017" : i % 3 === 1 ? "#e91e8c" : "#f0d060",
              opacity: 0.15 + (i % 5) * 0.1,
              animation: `sparkle-drift ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Light rays behind logo */}
      <div
        className="absolute w-[500px] h-[500px] opacity-20"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, #d4a017 5%, transparent 10%, transparent 20%, #e91e8c 25%, transparent 30%, transparent 40%, #d4a017 45%, transparent 50%, transparent 60%, #e91e8c 65%, transparent 70%, transparent 80%, #d4a017 85%, transparent 90%)",
          animation: "spin 15s linear infinite",
        }}
      />

      {/* Logo container */}
      <div
        className="relative mb-8"
        style={{
          animation: showTitle ? "none" : "scale-in 0.6s ease-out",
        }}
      >
        <div
          className="w-36 h-36 rounded-full overflow-hidden shadow-2xl relative"
          style={{
            border: "4px solid transparent",
            backgroundImage: "linear-gradient(#0c0416, #0c0416), linear-gradient(135deg, #f0d060, #d4a017, #b8860b, #d4a017)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            boxShadow: "0 0 40px rgba(212,160,23,0.35), 0 0 80px rgba(212,160,23,0.1), inset 0 0 30px rgba(0,0,0,0.3)",
          }}
        >
          <Image
            src="/images/game-logo.jpg"
            alt="Lucky Wheel"
            width={144}
            height={144}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        {/* Pulsing ring */}
        <div
          className="absolute -inset-3 rounded-full border border-gold/30"
          style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
        />
        <div
          className="absolute -inset-6 rounded-full border border-gold/10"
          style={{ animation: "glow-pulse 2s ease-in-out infinite 0.5s" }}
        />
      </div>

      {/* Title */}
      <div
        className={`text-center transition-all duration-700 ${
          showTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1
          className="text-5xl font-bold mb-2"
          style={{
            background: "linear-gradient(180deg, #f0d060 0%, #d4a017 60%, #b8860b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 4px rgba(212,160,23,0.4))",
          }}
        >
          {"عجلة الحظ"}
        </h1>
        <p className="text-muted-foreground text-sm tracking-wide">{"ادر العجلة واربح الجوائز الكبرى"}</p>
      </div>

      {/* Progress bar */}
      <div className="w-56 mt-12 relative">
        <div className="h-2 rounded-full bg-muted/30 overflow-hidden backdrop-blur-sm border border-border/30">
          <div
            className="h-full rounded-full relative overflow-hidden transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #b8860b, #d4a017, #f0d060, #d4a017)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                animation: "shimmer 1.2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-muted-foreground text-[10px]">{"جاري التحميل..."}</span>
          <span className="text-gold font-bold text-xs tabular-nums">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  )
}
