import type React from "react"
import { Heart } from "lucide-react"

interface FloralDividerProps {
  icon?: React.ReactNode
  className?: string
}

export default function FloralDivider({
  icon = <Heart className="text-rose-400 fill-rose-200" size={20} />,
  className = "",
}: FloralDividerProps) {
  return <div className={`divider ${className}`}>{icon}</div>
}

