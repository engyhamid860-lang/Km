"use client"

import { useState, useEffect, useCallback } from "react"
import { GameProvider, useGame } from "@/lib/game-context"
import { SpinningWheel } from "@/components/game/spinning-wheel"
import { BetSlots } from "@/components/game/bet-slots"
import { ChipSelector } from "@/components/game/chip-selector"
import { ResultStrip } from "@/components/game/result-strip"
import { PlayerBar } from "@/components/game/player-bar"
import { SplashScreen } from "@/components/game/splash-screen"
import {
  HistoryModal,
  HowToPlayModal,
  MyBetsModal,
  LeaderboardModal,
  WinnerModal,
  GameSideButtons,
} from "@/components/game/game-modals"
import { Coins } from "lucide-react"

function GameContent() {
  const { round, isSpinning, lastWin, balance, countdown } = useGame()
  const [showHistory, setShowHistory] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showMyBets, setShowMyBets] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showWinner, setShowWinner] = useState(false)

  useEffect(() => {
    if (lastWin > 0 && !isSpinning) {
      setShowWinner(true)
      const timer = setTimeout(() => setShowWinner(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [lastWin, isSpinning])

  return (
    <div className="min-h-screen flex flex-col items-center overflow-hidden relative">
      {/* Casino background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/casino-bg.jpg')" }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-casino-bg/60" />

      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px]" />
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-pink/5 blur-[80px]" />
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col min-h-screen relative z-10">
        {/* Top header bar */}
        <header className="flex items-center justify-between px-4 py-3 bg-card/30 backdrop-blur-md border-b border-gold/15">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center overflow-hidden shadow-md">
              <span className="text-gold font-bold text-sm">FW</span>
            </div>
            <div>
              <div className="text-foreground text-xs font-semibold">{"عجلة الحظ"}</div>
              <div className="text-muted-foreground text-[10px]">ID:777888</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-card/50 rounded-full px-3.5 py-1.5 border border-gold/30 shadow-inner">
            <Coins className="w-4 h-4 text-gold" />
            <span className="text-gold font-bold text-sm tabular-nums">
              {balance >= 1000000
                ? (balance / 1000000).toFixed(2) + "M"
                : balance.toLocaleString()}
            </span>
          </div>
        </header>

        {/* Main game area */}
        <div className="flex-1 flex flex-col items-center justify-center relative px-4 py-4 gap-2">
          {/* Round counter with countdown */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-muted-foreground text-sm font-medium tabular-nums">
              Round:{round}
            </span>
            {countdown > 0 && !isSpinning && (
              <div className="flex items-center gap-1.5 bg-card/60 backdrop-blur-sm px-3 py-1 rounded-full border border-gold/30">
                <div className={`w-2 h-2 rounded-full ${countdown <= 3 ? "bg-accent animate-pulse" : "bg-gold animate-pulse"}`} />
                <span className={`font-bold text-sm tabular-nums ${countdown <= 3 ? "text-accent" : "text-gold"}`}>
                  {countdown}
                </span>
              </div>
            )}
            {isSpinning && (
              <div className="flex items-center gap-1.5 bg-accent/20 backdrop-blur-sm px-3 py-1 rounded-full border border-accent/40">
                <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span className="text-accent font-bold text-xs">{"جاري الدوران"}</span>
              </div>
            )}
          </div>

          {/* Side buttons */}
          <GameSideButtons
            onHistory={() => setShowHistory(true)}
            onHowToPlay={() => setShowHowToPlay(true)}
            onMyBets={() => setShowMyBets(true)}
            onLeaderboard={() => setShowLeaderboard(true)}
          />

          {/* Spinning wheel */}
          <SpinningWheel />
        </div>

        {/* Result strip */}
        <ResultStrip />

        {/* Bet slots */}
        <div className="py-3 bg-gradient-to-b from-card/20 to-card/40 backdrop-blur-sm">
          <BetSlots />
        </div>

        {/* Player bar + Chip selector */}
        <div className="bg-card/40 backdrop-blur-md border-t border-gold/15 pb-4">
          <PlayerBar />
          <div className="mt-2">
            <ChipSelector />
          </div>
        </div>
      </div>

      {/* Modals */}
      <HistoryModal open={showHistory} onClose={() => setShowHistory(false)} />
      <HowToPlayModal open={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
      <MyBetsModal open={showMyBets} onClose={() => setShowMyBets(false)} />
      <LeaderboardModal open={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      <WinnerModal open={showWinner} onClose={() => setShowWinner(false)} winAmount={lastWin} />

      {/* Win animation overlay */}
      {lastWin > 0 && !isSpinning && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <div
            className="bg-gradient-to-b from-gold to-gold-light text-primary-foreground px-8 py-4 rounded-2xl font-bold text-2xl shadow-2xl animate-bounce"
            style={{ boxShadow: "0 0 50px rgba(212,160,23,0.6), 0 0 100px rgba(212,160,23,0.3)" }}
          >
            +{lastWin.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [gameReady, setGameReady] = useState(false)

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false)
    setGameReady(true)
  }, [])

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {gameReady && (
        <GameProvider>
          <GameContent />
        </GameProvider>
      )}
    </>
  )
}
