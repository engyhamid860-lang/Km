"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"

export type FruitSymbol = "watermelon" | "plum" | "seven"

export interface BetSlot {
  symbol: FruitSymbol
  amount: number
  multiplier: number
}

export interface HistoryEntry {
  round: number
  result: FruitSymbol
}

export interface MyBetEntry {
  time: string
  bets: { symbol: FruitSymbol; amount: number }[]
  result: FruitSymbol
  win: number
}

export interface LeaderboardEntry {
  rank: number
  username: string
  points: number
  rewards: number
}

const SYMBOLS: FruitSymbol[] = ["watermelon", "plum", "seven"]
const MULTIPLIERS: Record<FruitSymbol, number> = {
  watermelon: 2,
  plum: 2,
  seven: 8,
}

const WEIGHTS: Record<FruitSymbol, number> = {
  watermelon: 40,
  plum: 40,
  seven: 20,
}

function getRandomSymbol(): FruitSymbol {
  const totalWeight = Object.values(WEIGHTS).reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight
  for (const symbol of SYMBOLS) {
    random -= WEIGHTS[symbol]
    if (random <= 0) return symbol
  }
  return "watermelon"
}

interface GameContextType {
  balance: number
  round: number
  isSpinning: boolean
  currentResult: FruitSymbol | null
  betSlots: BetSlot[]
  selectedChip: number
  history: HistoryEntry[]
  myBets: MyBetEntry[]
  leaderboard: LeaderboardEntry[]
  lastWin: number
  countdown: number
  setSelectedChip: (chip: number) => void
  placeBet: (slotIndex: number) => void
  removeBet: (slotIndex: number) => void
  spin: () => void
  resultStrip: FruitSymbol[]
  mounted: boolean
}

const GameContext = createContext<GameContextType | null>(null)

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be used inside GameProvider")
  return ctx
}

const FAKE_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: "Star Player", points: 49376140, rewards: 139063 },
  { rank: 2, username: "Lucky Ahmed", points: 40317500, rewards: 61806 },
  { rank: 3, username: "Golden Hand", points: 32457440, rewards: 40173 },
  { rank: 4, username: "Dragon Fire", points: 24372240, rewards: 24722 },
  { rank: 5, username: "Moon Light", points: 17619820, rewards: 15451 },
  { rank: 6, username: "Royal King", points: 14998730, rewards: 9270 },
  { rank: 7, username: "Diamond", points: 14618020, rewards: 6180 },
  { rank: 8, username: "Thunder", points: 12424180, rewards: 6180 },
  { rank: 9, username: "Phoenix", points: 11291440, rewards: 3090 },
  { rank: 10, username: "Silver Fox", points: 10535590, rewards: 3090 },
]

const COUNTDOWN_SECONDS = 10
const SPIN_DURATION = 4500

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(10000)
  const [round, setRound] = useState(2009)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentResult, setCurrentResult] = useState<FruitSymbol | null>(null)
  const [selectedChip, setSelectedChip] = useState(500)
  const [lastWin, setLastWin] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [betSlots, setBetSlots] = useState<BetSlot[]>([
    { symbol: "watermelon", amount: 0, multiplier: MULTIPLIERS.watermelon },
    { symbol: "seven", amount: 0, multiplier: MULTIPLIERS.seven },
    { symbol: "plum", amount: 0, multiplier: MULTIPLIERS.plum },
  ])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [myBets, setMyBets] = useState<MyBetEntry[]>([])
  const [resultStrip, setResultStrip] = useState<FruitSymbol[]>([])
  const [mounted, setMounted] = useState(false)
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  const pendingResultRef = useRef<FruitSymbol | null>(null)

  // Initialize on mount
  useEffect(() => {
    const h: HistoryEntry[] = []
    for (let i = 0; i < 48; i++) {
      h.push({ round: 2009 - 48 + i, result: getRandomSymbol() })
    }
    setHistory(h)
    setResultStrip(Array.from({ length: 15 }, () => getRandomSymbol()))
    setMounted(true)
  }, [])

  // Auto-spin countdown system
  useEffect(() => {
    if (!mounted) return

    function startCountdown() {
      setCountdown(COUNTDOWN_SECONDS)
      let count = COUNTDOWN_SECONDS

      countdownRef.current = setInterval(() => {
        count -= 1
        setCountdown(count)
        if (count <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          // Auto-trigger spin
          triggerSpin()
        }
      }, 1000)
    }

    // Start the first countdown after a short delay
    const initTimer = setTimeout(() => {
      startCountdown()
    }, 1500)

    return () => {
      clearTimeout(initTimer)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [mounted]) // eslint-disable-line react-hooks/exhaustive-deps

  const triggerSpin = useCallback(() => {
    if (isSpinning) return

    const result = getRandomSymbol()
    pendingResultRef.current = result

    setIsSpinning(true)
    setCurrentResult(result)
    setLastWin(0)

    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false)
      setRound((r) => r + 1)

      // Calculate winnings
      let winAmount = 0
      const betsForRecord: { symbol: FruitSymbol; amount: number }[] = []

      setBetSlots((currentSlots) => {
        currentSlots.forEach((slot) => {
          if (slot.amount > 0) {
            betsForRecord.push({ symbol: slot.symbol, amount: slot.amount })
            if (slot.symbol === result) {
              winAmount += slot.amount * slot.multiplier
            }
          }
        })
        return currentSlots.map((s) => ({ ...s, amount: 0 }))
      })

      // Use a micro-delay to ensure betsForRecord is populated from the callback
      setTimeout(() => {
        if (winAmount > 0) {
          setBalance((prev) => prev + winAmount)
          setLastWin(winAmount)
        }

        setHistory((prev) => [...prev, { round: round + 1, result }])
        setResultStrip((prev) => [...prev.slice(1), result])

        const now = new Date()
        const timeStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

        if (betsForRecord.length > 0) {
          setMyBets((prev) =>
            [
              {
                time: timeStr,
                bets: betsForRecord,
                result,
                win: winAmount,
              },
              ...prev,
            ].slice(0, 50)
          )
        }

        // Restart countdown for next round
        setCountdown(COUNTDOWN_SECONDS)
        let count = COUNTDOWN_SECONDS
        countdownRef.current = setInterval(() => {
          count -= 1
          setCountdown(count)
          if (count <= 0) {
            if (countdownRef.current) clearInterval(countdownRef.current)
            triggerSpin()
          }
        }, 1000)
      }, 50)
    }, SPIN_DURATION)
  }, [isSpinning, round]) // eslint-disable-line react-hooks/exhaustive-deps

  const spin = useCallback(() => {
    // Manual spin - just let auto-spin handle it
  }, [])

  const placeBet = useCallback(
    (slotIndex: number) => {
      if (isSpinning) return
      setBalance((prev) => {
        if (prev < selectedChip) return prev
        setBetSlots((slots) => {
          const updated = [...slots]
          updated[slotIndex] = {
            ...updated[slotIndex],
            amount: updated[slotIndex].amount + selectedChip,
          }
          return updated
        })
        return prev - selectedChip
      })
    },
    [isSpinning, selectedChip]
  )

  const removeBet = useCallback(
    (slotIndex: number) => {
      if (isSpinning) return
      setBetSlots((slots) => {
        const updated = [...slots]
        const refund = updated[slotIndex].amount
        if (refund > 0) {
          setBalance((prev) => prev + refund)
          updated[slotIndex] = { ...updated[slotIndex], amount: 0 }
        }
        return updated
      })
    },
    [isSpinning]
  )

  return (
    <GameContext.Provider
      value={{
        balance,
        round,
        isSpinning,
        currentResult,
        betSlots,
        selectedChip,
        history,
        myBets,
        leaderboard: FAKE_LEADERBOARD,
        lastWin,
        countdown,
        setSelectedChip,
        placeBet,
        removeBet,
        spin,
        resultStrip,
        mounted,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
