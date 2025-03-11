"use client"

import {
  useEffect,
  useState,
} from 'react';

import { motion } from 'framer-motion';

interface AnimatedParticlesProps {
    count?: number
    type: "redEnvelope" | "petalRed" | "petalWhite"
}

export default function AnimatedParticles({ count = 10, type }: AnimatedParticlesProps) {
    const [particles, setParticles] = useState<
        Array<{ id: number; x: number; delay: number; size: number; rotation: number }>
    >([])

    useEffect(() => {
        const newParticles = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 3,
            size: 16 + Math.random() * 16,
            rotation: Math.random() * 360,
        }))
        setParticles(newParticles)
    }, [count, type])

    const getParticleContent = (particleType: string) => {
        switch (particleType) {
            case "redEnvelope":
                return "🧧"
            case "petalRed":
                return "🌺"
            case "petalWhite":
                return "🌸"
            default:
                return "🌸"
        }
    }

    return (
        <>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute pointer-events-none will-change-transform"
                    style={{
                        left: `${particle.x}%`,
                        fontSize: `${particle.size}px`,
                        transform: 'translateZ(0)',
                    }}
                    initial={{ y: -50, opacity: 0, rotate: particle.rotation }}
                    animate={{
                        y: ['-5vh', '105vh'],
                        opacity: [0, 1, 1, 0],
                        rotate: [particle.rotation, particle.rotation + 360],
                    }}
                    transition={{
                        duration: 10 + Math.random() * 5,
                        delay: particle.delay,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: Math.random() * 3,
                        ease: "linear",
                    }}
                >
                    {getParticleContent(type)}
                </motion.div>
            ))}
        </>
    )
}

