import './globals.css';

import type React from 'react';

import type { Metadata } from 'next';
import {
  Cormorant_Garamond,
  Great_Vibes,
  Montserrat,
} from 'next/font/google';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${greatVibes.variable} ${cormorant.variable} ${montserrat.variable} font-sans`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
