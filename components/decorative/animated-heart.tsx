"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface AnimatedHeartProps {
  count?: number
  size?: number
}

export default function AnimatedHearts({ count = 10, size = 20 }: AnimatedHeartProps) {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; delay: number; size: number }>>([])

  useEffect(() => {
    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random horizontal position (0-100%)
      delay: Math.random() * 5, // Random delay (0-5s)
      size: size * (0.5 + Math.random() * 0.5), // Random size (50-100% of base size)
    }))
    setHearts(newHearts)
  }, [count, size])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-0"
          style={{ left: `${heart.x}%` }}
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: [100, -100 - Math.random() * 400],
            opacity: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            delay: heart.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 5,
          }}
        >
          <Heart size={heart.size} className="text-rose-300 fill-rose-100 opacity-70" />
        </motion.div>
      ))}
    </div>
  )
}

