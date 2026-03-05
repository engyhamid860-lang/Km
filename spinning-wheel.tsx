"use client"

import { useGame, type FruitSymbol } from "@/lib/game-context"
import { useEffect, useRef, useState } from "react"

const SEGMENTS: { symbol: FruitSymbol; color1: string; color2: string }[] = [
  { symbol: "watermelon", color1: "#2979FF", color2: "#1565C0" },
  { symbol: "plum", color1: "#1A237E", color2: "#0D1642" },
  { symbol: "seven", color1: "#E91E8C", color2: "#AD1457" },
  { symbol: "watermelon", color1: "#42A5F5", color2: "#1E88E5" },
  { symbol: "plum", color1: "#1A237E", color2: "#0D1642" },
  { symbol: "watermelon", color1: "#2979FF", color2: "#1565C0" },
  { symbol: "plum", color1: "#1A237E", color2: "#0D1642" },
  { symbol: "seven", color1: "#E91E8C", color2: "#AD1457" },
]

const SEGMENT_COUNT = SEGMENTS.length
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT

export function SpinningWheel() {

  const { isSpinning, currentResult } = useGame()

  const [rotation, setRotation] = useState(0)
  const prevSpinRef = useRef(false)

  const [bulbPhase, setBulbPhase] = useState(0)

  const [wheelSize, setWheelSize] = useState(280)

  /* ===== Responsive wheel size ===== */

  useEffect(() => {

    function updateSize(){

      const w = window.innerWidth

      if(w < 380) setWheelSize(190)
else if(w < 420) setWheelSize(210)
else if(w < 500) setWheelSize(230)
else if(w < 700) setWheelSize(260)
else setWheelSize(300)

    }

    updateSize()

    window.addEventListener("resize",updateSize)

    return ()=>window.removeEventListener("resize",updateSize)

  },[])

  const outerFrameSize = wheelSize + 56

  /* ===== Bulb animation ===== */

  useEffect(()=>{

    const interval = setInterval(()=>{

      setBulbPhase(p=>(p+1)%2)

    },500)

    return ()=>clearInterval(interval)

  },[])

  /* ===== Spin logic ===== */

  useEffect(()=>{

    if(isSpinning && !prevSpinRef.current){

      let targetIndex = 0

      if(currentResult){

        const matches = SEGMENTS.map((s,i)=> s.symbol===currentResult ? i : -1).filter(i=>i>=0)

        targetIndex = matches[Math.floor(Math.random()*matches.length)]

      }

      const segCenter = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE/2

      const targetAngle = 360 - segCenter

      const spins = 7 + Math.floor(Math.random()*3)

      const newRotation = rotation + spins*360 + targetAngle - (rotation%360)

      setRotation(newRotation)

    }

    prevSpinRef.current = isSpinning

  },[isSpinning])

  return (

    <div className="relative flex flex-col items-center w-full max-w-[340px] mx-auto">

      {/* glow */}

      <div
      className="absolute rounded-full"
      style={{
        width:outerFrameSize+40,
        height:outerFrameSize+40,
        top:-20,
        left:"50%",
        transform:"translateX(-50%)",
        background:isSpinning
        ? "radial-gradient(circle, rgba(233,30,140,0.15) 0%, transparent 70%)"
        : "radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 70%)"
      }}
      />

      <div className="relative" style={{width:outerFrameSize,height:outerFrameSize}}>

        {/* frame */}

        <svg
        viewBox={`0 0 ${outerFrameSize} ${outerFrameSize}`}
        className="absolute inset-0 w-full h-full"
        >

          <circle
          cx={outerFrameSize/2}
          cy={outerFrameSize/2}
          r={outerFrameSize/2-4}
          fill="none"
          stroke="#d4a017"
          strokeWidth="10"
          />

          {/* bulbs */}

          {Array.from({length:28}).map((_,i)=>{

            const angle=(i*360/28-90)*Math.PI/180

            const r=outerFrameSize/2-9

            const x=outerFrameSize/2+r*Math.cos(angle)

            const y=outerFrameSize/2+r*Math.sin(angle)

            const lit=(i+bulbPhase)%2===0

            return(

              <circle
              key={i}
              cx={x}
              cy={y}
              r="3.5"
              fill={lit ? "#fef08a":"#6b5a0a"}
              opacity={lit?1:0.5}
              />

            )

          })}

        </svg>

        {/* wheel */}

        <div
        className="absolute rounded-full overflow-hidden"
        style={{
          top:28,
          left:28,
          width:wheelSize,
          height:wheelSize,
          transform:`rotate(${rotation}deg)`,
          transition:isSpinning
          ? "transform 4.5s cubic-bezier(0.12,0.65,0.05,1)"
          : "none"
        }}
        >

          <svg viewBox="0 0 200 200" className="w-full h-full">

            {SEGMENTS.map((seg,i)=>{

              const startA=(i*SEGMENT_ANGLE*Math.PI)/180
              const endA=((i+1)*SEGMENT_ANGLE*Math.PI)/180

              const x1=100+98*Math.cos(startA)
              const y1=100+98*Math.sin(startA)

              const x2=100+98*Math.cos(endA)
              const y2=100+98*Math.sin(endA)

              return(

                <path
                key={i}
                d={`M100,100 L${x1},${y1} A98,98 0 0,1 ${x2},${y2} Z`}
                fill={seg.color1}
                stroke="rgba(212,160,23,0.3)"
                strokeWidth="1"
                />

              )

            })}

          </svg>

        </div>

        {/* pointer */}

        <div
        className="absolute z-30"
        style={{top:6,left:"50%",transform:"translateX(-50%)"}}
        >

          <svg width="40" height="44" viewBox="0 0 40 44">

            <path
            d="M20,44 L6,14 Q2,4 10,6 L20,10 L30,6 Q38,4 34,14 Z"
            fill="#d4a017"
            stroke="#b8860b"
            />

          </svg>

        </div>

      </div>

    </div>

  )

}