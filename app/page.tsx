"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, MapPin, Calendar, Clock, Phone, Mail, Check, X, AlertCircle, Heart } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useInView } from "react-intersection-observer"
import { db, initAnalytics } from "@/lib/firebase"
import { ref, push, serverTimestamp } from "firebase/database"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MapDirectionsButton from "@/components/map-directions-button"
import EnhancedGlobeGallery from "@/components/enhanced-globe-gallery"
import FloralDivider from "@/components/decorative/floral-divider"
import AnimatedHearts from "@/components/decorative/animated-heart"
import CountdownTimer from "@/components/decorative/countdown-timer"

export default function Invitation() {
  const [currentSection, setCurrentSection] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [attending, setAttending] = useState<boolean | null>(null)
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 婚礼日期 - 2025年6月15日
  const weddingDate = new Date(2025, 5, 15) // 月份是从0开始的，所以5代表6月

  const [coverRef, coverInView] = useInView({ threshold: 0.5 })
  const [detailsRef, detailsInView] = useInView({ threshold: 0.5 })
  const [galleryRef, galleryInView] = useInView({ threshold: 0.5 })
  const [rsvpRef, rsvpInView] = useInView({ threshold: 0.5 })

  // Initialize Firebase Analytics on client side
  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    if (coverInView) setCurrentSection(0)
    else if (detailsInView) setCurrentSection(1)
    else if (galleryInView) setCurrentSection(2)
    else if (rsvpInView) setCurrentSection(3)
  }, [coverInView, detailsInView, galleryInView, rsvpInView])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Create a reference to the 'rsvps' collection
      const rsvpsRef = ref(db, "rsvps")

      // Create a new RSVP entry with the form data
      await push(rsvpsRef, {
        name,
        email,
        attending,
        message: message || null,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
      })

      // Set submitted state to true to show success message
      setSubmitted(true)
    } catch (err) {
      console.error("Error submitting RSVP:", err)
      setError("提交失败，请稍后再试。")
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToSection = (index: number) => {
    const sections = [
      document.getElementById("cover"),
      document.getElementById("details"),
      document.getElementById("gallery"),
      document.getElementById("rsvp"),
    ]
    sections[index]?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative bg-wedding min-h-screen text-gray-800 overflow-hidden">
      {/* 背景装饰 */}
      <AnimatedHearts count={15} />

      {/* Navigation dots */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSection === index ? "bg-rose-500 scale-125" : "bg-gray-300"
              }`}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Cover Section */}
      <section
        id="cover"
        ref={coverRef}
        className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-md glass p-8 rounded-2xl"
        >
          <div className="mb-6 relative w-32 h-32 mx-auto">
            <Image src="/placeholder.svg?height=128&width=128" alt="Wedding monogram" fill className="object-contain" />
          </div>
          <h1 className="font-script text-5xl mb-4 text-rose-700">Sarah & Michael</h1>
          <h2 className="font-serif text-2xl font-light mb-8 text-rose-600">诚挚邀请您参加我们的婚礼</h2>

          <FloralDivider />

          <p className="font-serif text-xl mb-4">2025年6月15日</p>
          <p className="font-serif text-lg mb-8">纽约 · 大花园</p>

          <CountdownTimer targetDate={weddingDate} />

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="text-rose-500 w-8 h-8" />
          </motion.div>
        </motion.div>
      </section>

      {/* Details Section */}
      <section id="details" ref={detailsRef} className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 floral-border"
        >
          <h2 className="font-script text-4xl mb-2 text-center text-rose-700">婚礼详情</h2>
          <p className="text-center text-rose-500 mb-6 font-serif">Wedding Details</p>

          <FloralDivider icon={<Heart className="text-rose-400 fill-rose-200" size={16} />} />

          <div className="space-y-6">
            <div className="flex items-start">
              <Calendar className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">日期</h3>
                <p>2025年6月15日 星期六</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">时间</h3>
                <p>婚礼仪式: 下午 3:00</p>
                <p>婚宴招待: 下午 5:00</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">地点</h3>
                <p>The Grand Garden</p>
                <p>123 Blossom Street</p>
                <p>New York, NY 10001</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">联系方式</h3>
                <p>events@example.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">电话</h3>
                <p>(123) 456-7890</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" ref={galleryRef} className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-md w-full"
        >
          <h2 className="font-script text-4xl mb-2 text-center text-rose-700">我们的故事</h2>
          <p className="text-center text-rose-500 mb-6 font-serif">Our Story</p>

          <FloralDivider />

          <div className="flex justify-center mb-8">
            <EnhancedGlobeGallery
              images={[
                "/placeholder.svg?height=400&width=400&text=Photo 1",
                "/placeholder.svg?height=400&width=400&text=Photo 2",
                "/placeholder.svg?height=400&width=400&text=Photo 3",
                "/placeholder.svg?height=400&width=400&text=Photo 4",
                "/placeholder.svg?height=400&width=400&text=Photo 5",
                "/placeholder.svg?height=400&width=400&text=Photo 6",
                "/placeholder.svg?height=400&width=400&text=Photo 7",
                "/placeholder.svg?height=400&width=400&text=Photo 8",
              ]}
              size={380} // 从320增加到380
            />
          </div>

          <div className="text-center mt-6 text-sm text-rose-500 font-serif italic">
            <p>拖动旋转 • 点击图片查看</p>
          </div>

          <div className="mt-8 text-center">
            <p className="font-serif text-lg text-gray-700 mb-4">"爱情是灵魂的相遇，心灵的共鸣"</p>
            <p className="text-gray-600">
              我们相遇于2020年的春天，一路相伴走过风雨，如今终于迎来人生新的篇章。
              感谢您能在这特别的日子与我们共同见证这美好的时刻。
            </p>
          </div>
        </motion.div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" ref={rsvpRef} className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="font-script text-4xl mb-2 text-center text-rose-700">回复邀请</h2>
          <p className="text-center text-rose-500 mb-6 font-serif">RSVP</p>

          <FloralDivider />

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  您的姓名
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  电子邮箱
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                />
              </div>

              <div>
                <p className="block text-sm font-medium mb-2">您是否参加？</p>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={attending === true ? "default" : "outline"}
                    onClick={() => setAttending(true)}
                    className={
                      attending === true
                        ? "bg-rose-500 hover:bg-rose-600"
                        : "border-rose-300 text-rose-600 hover:bg-rose-50"
                    }
                  >
                    <Check className="w-4 h-4 mr-2" /> 是，我会参加
                  </Button>
                  <Button
                    type="button"
                    variant={attending === false ? "default" : "outline"}
                    onClick={() => setAttending(false)}
                    className={
                      attending === false
                        ? "bg-rose-500 hover:bg-rose-600"
                        : "border-rose-300 text-rose-600 hover:bg-rose-50"
                    }
                  >
                    <X className="w-4 h-4 mr-2" /> 抱歉，我不能参加
                  </Button>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  留言（可选）
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600"
                disabled={!name || !email || attending === null || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">提交中</span>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  "提交回复"
                )}
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-600 fill-rose-200" />
              </div>
              <h3 className="text-xl font-serif font-medium mb-2">谢谢您！</h3>
              <p className="text-gray-600">您的回复已提交。{attending ? "期待与您相见！" : "感谢您的回复！"}</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-md mx-auto">
          <h2 className="font-script text-4xl mb-2 text-center text-rose-700">婚礼地点</h2>
          <p className="text-center text-rose-500 mb-6 font-serif">Location</p>

          <FloralDivider />

          <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg border-4 border-white">
            <Image
              src="/placeholder.svg?height=300&width=500&text=Map"
              alt="Event location map"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-6 text-center">
            <p className="font-serif font-medium text-lg">The Grand Garden</p>
            <p>123 Blossom Street, New York, NY 10001</p>
            <MapDirectionsButton
              address="123 Blossom Street, New York, NY 10001"
              latitude={40.7128}
              longitude={-74.006}
              venueName="The Grand Garden"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-rose-600 bg-rose-50">
        <div className="max-w-md mx-auto px-6">
          <FloralDivider className="mb-6" />
          <p className="font-serif text-lg mb-2">我们期待与您共度美好时光！</p>
          <p className="font-script text-2xl mb-4">Sarah & Michael</p>
          <p className="text-rose-400">© 2025</p>
        </div>
      </footer>
    </div>
  )
}

