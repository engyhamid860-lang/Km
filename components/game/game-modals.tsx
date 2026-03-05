"use client"

import { useGame, type FruitSymbol } from "@/lib/game-context"
import { FruitIcon } from "./result-strip"
import { X, Trophy, History, HelpCircle, ScrollText } from "lucide-react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md max-h-[80vh] rounded-2xl border-2 border-gold/60 bg-card overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 0 30px rgba(212,160,23,0.2)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-l from-gold/20 to-gold/5 border-b border-gold/30">
          <h2 className="text-foreground font-bold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-accent/80 flex items-center justify-center text-accent-foreground hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-60px)] p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// History Modal
export function HistoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { history } = useGame()
  const recentHistory = history.slice(-48)

  return (
    <Modal open={open} onClose={onClose} title={"سجل اللعبة"}>
      <div className="grid grid-cols-8 gap-1.5">
        {recentHistory.map((entry, i) => (
          <div
            key={i}
            className={`w-full aspect-square rounded-lg flex items-center justify-center ${
              i === recentHistory.length - 1 ? "ring-2 ring-gold" : ""
            } bg-secondary/50`}
          >
            <FruitIcon symbol={entry.result} size="sm" />
          </div>
        ))}
      </div>
    </Modal>
  )
}

// How To Play Modal
export function HowToPlayModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title={"كيف ألعب"}>
      <div className="text-foreground text-sm leading-relaxed space-y-3 text-right">
        <p>{"يمكن للاعبين المراهنة على الفاكهة أو 77 التي يتوقعون أن تتوقف العجلة عندها أجل كسب المكافآت؛"}</p>
        <p>{"يحتاج اللاعبون إلى تحديد مبلغ الرهان قبل بدء اللعبة؛"}</p>
        <p>{"ممكن للاعبين اختيار البطيخ أو المشمش على العجلة؛"}</p>
        <p>{"اتفقت النتيجة مع رهان اللاعب، فسوف يحصل على مكافآت بناء على لاحتمالات؛"}</p>
        <p>{"الخيارات المختلفة لها احتمالات مختلفة ويمكن للاعبين تحليل احتمالية الخيارات من خلال مراقبة تاريخ اللعبة؛"}</p>
        <p className="text-gold font-bold">{"عندما يحدث الحظ 77، هناك فرصة للحصول على جوائز متعددة في نفس الوقت"}</p>
        
        <div className="mt-4 p-3 rounded-xl bg-secondary/30 border border-gold/20">
          <h3 className="text-gold font-bold mb-2">{"المضاعفات:"}</h3>
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center gap-1">
              <FruitIcon symbol="watermelon" size="md" />
              <span className="text-gold font-bold">x2</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <FruitIcon symbol="plum" size="md" />
              <span className="text-gold font-bold">x2</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <FruitIcon symbol="seven" size="md" />
              <span className="text-gold font-bold">x8</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// My Bets Modal
export function MyBetsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { myBets } = useGame()

  return (
    <Modal open={open} onClose={onClose} title={"رهاني"}>
      {myBets.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">{"لا توجد رهانات بعد"}</div>
      ) : (
        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-4 text-xs text-muted-foreground font-bold border-b border-border pb-2">
            <span className="text-center">{"فوز"}</span>
            <span className="text-center">{"نتيجة"}</span>
            <span className="text-center">{"الرهان"}</span>
            <span className="text-center">{"وقت"}</span>
          </div>
          
          {myBets.slice(0, 20).map((bet, i) => (
            <div key={i} className="grid grid-cols-4 items-center text-xs py-2 border-b border-border/50 bg-secondary/20 rounded-lg px-2">
              <span className="text-center text-gold font-bold">
                {bet.win > 0 ? bet.win.toLocaleString() : "0"}
              </span>
              <div className="flex justify-center">
                <FruitIcon symbol={bet.result} size="sm" />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                {bet.bets.map((b, j) => (
                  <div key={j} className="flex items-center gap-1">
                    <FruitIcon symbol={b.symbol} size="sm" />
                    <span className="text-foreground">{b.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <span className="text-center text-muted-foreground text-[10px]">{bet.time}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

// Leaderboard Modal
export function LeaderboardModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { leaderboard } = useGame()

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-l from-yellow-600/30 to-yellow-800/10 text-yellow-400"
    if (rank === 2) return "bg-gradient-to-l from-gray-400/20 to-gray-600/10 text-gray-300"
    if (rank === 3) return "bg-gradient-to-l from-amber-700/20 to-amber-900/10 text-amber-600"
    return "bg-secondary/20"
  }

  const getRankLabel = (rank: number) => {
    if (rank === 1) return "1st"
    if (rank === 2) return "2nd"
    if (rank === 3) return "3rd"
    return rank.toString()
  }

  return (
    <Modal open={open} onClose={onClose} title={"لوحة المتصدرين"}>
      {/* Period tabs */}
      <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
        {["I", "II", "III", "IV", "V", "VI"].map((tab, i) => (
          <button
            key={tab}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
              i === 0 ? "border-gold bg-gold/20 text-gold" : "border-border bg-card text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-xs border border-accent bg-accent/20 text-accent">
          {"🔥"}
        </button>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-4 text-xs text-muted-foreground font-bold border-b border-border pb-2 mb-2 px-2">
        <span>{"الترتيب"}</span>
        <span>{"اسم المستخدم"}</span>
        <span className="text-center">{"النقاط"}</span>
        <span className="text-center">{"مكافآت"}</span>
      </div>

      {/* Rows */}
      <div className="space-y-1.5">
        {leaderboard.map((entry) => (
          <div key={entry.rank} className={`grid grid-cols-4 items-center text-xs py-2 px-2 rounded-lg ${getRankStyle(entry.rank)}`}>
            <span className="font-bold text-sm">{getRankLabel(entry.rank)}</span>
            <span className="text-foreground font-medium truncate">{entry.username}</span>
            <span className="text-center text-foreground">{entry.points.toLocaleString()}</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-gold text-xs">{"●"}</span>
              <span className="text-gold font-bold">{entry.rewards.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

// Winner Announcement Modal
export function WinnerModal({ open, onClose, winAmount }: { open: boolean; onClose: () => void; winAmount: number }) {
  return (
    <Modal open={open} onClose={onClose} title={"حظا سعيدا"}>
      <div className="flex flex-col items-center py-6 gap-4">
        <div className="text-foreground text-lg font-bold">{"تهانينا!"}</div>
        
        {/* Crown icon */}
        <div className="text-5xl">{"👑"}</div>
        
        {/* Player avatar */}
        <div className="w-20 h-20 rounded-full bg-secondary border-2 border-gold flex items-center justify-center text-3xl font-bold text-foreground">
          P
        </div>
        
        <div className="text-center space-y-2">
          <div className="text-foreground">
            <span className="text-muted-foreground ml-2">{"الرهان"}</span>
            <span className="text-gold font-bold text-xl">{winAmount.toLocaleString()}</span>
          </div>
          <div className="text-foreground">
            <span className="text-muted-foreground ml-2">{"فوز"}</span>
            <span className="text-accent font-bold text-2xl">{winAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// Sidebar buttons
export function GameSideButtons({
  onHistory,
  onHowToPlay,
  onMyBets,
  onLeaderboard,
}: {
  onHistory: () => void
  onHowToPlay: () => void
  onMyBets: () => void
  onLeaderboard: () => void
}) {
  const buttons = [
    { icon: <Trophy className="w-5 h-5" />, label: "Leaderboard", onClick: onLeaderboard },
    { icon: <HelpCircle className="w-5 h-5" />, label: "How to Play", onClick: onHowToPlay },
    { icon: <History className="w-5 h-5" />, label: "History", onClick: onHistory },
    { icon: <ScrollText className="w-5 h-5" />, label: "My Bets", onClick: onMyBets },
  ]

  return (
    <>
      {/* Right side buttons */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-10">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className="w-11 h-11 rounded-full bg-card/60 backdrop-blur-md border border-gold/20 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-card/80 transition-all shadow-lg"
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
            aria-label={btn.label}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </>
  )
}
