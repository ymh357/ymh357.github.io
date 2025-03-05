import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Great_Vibes, Cormorant_Garamond, Montserrat } from "next/font/google"

// 优雅的手写体用于标题
const greatVibes = Great_Vibes({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
})

// 优雅的衬线体用于副标题
const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
})

// 现代无衬线体用于正文
const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sarah & Michael | Wedding Invitation",
  description: "We invite you to celebrate our special day with us",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${greatVibes.variable} ${cormorant.variable} ${montserrat.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}



import './globals.css'