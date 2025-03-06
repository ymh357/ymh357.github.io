"use client"

import type React from 'react';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  limitToLast,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  serverTimestamp,
} from 'firebase/database';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Heart,
  Mail,
  MapPin,
  Phone,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

import AMapLocation from '@/components/amap-location';
import AnimatedHearts from '@/components/decorative/animated-heart';
import CountdownTimer from '@/components/decorative/countdown-timer';
import FloralDivider from '@/components/decorative/floral-divider';
import MapDirectionsButton from '@/components/map-directions-button';
import PhotoGallery3D from '@/components/PhotoGallery3D';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  db,
  initAnalytics,
} from '@/lib/firebase';

export default function Invitation() {
  const [currentSection, setCurrentSection] = useState(0)
  const [name, setName] = useState("")
  const [attending, setAttending] = useState<boolean | null>(null)
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{
    id: string;
    name: string;
    message: string;
    timestamp: number;
  }>>([]);

  // 婚礼日期 - 2025年5月1日
  const weddingDate = new Date(2025, 5, 1) // 月份是从0开始的，所以5代表6月

  const [coverRef, coverInView] = useInView({ threshold: 0.5 })
  const [detailsRef, detailsInView] = useInView({ threshold: 0.5 })
  const [galleryRef, galleryInView] = useInView({ threshold: 0.5 })
  const [rsvpRef, rsvpInView] = useInView({ threshold: 0.5 })
  const [mapRef, mapInView] = useInView({ threshold: 0.5 })
  const [messageBoardRef, messageBoardInView] = useInView({ threshold: 0.5 })

  // 添加一个 useEffect 来处理窗口大小
  const [gallerySize, setGallerySize] = useState(300)

  const photos = useMemo(() => {
    return [
      "/photos/43ba25fbdb3d425a6db1c4e4dfc89a62.png",
      "/photos/婚礼插画制作.png",
      "/photos/bg-L.png",
      "/photos/bg-S.png",
      "/photos/cc 2024-08-05T02_11_30.535Z.png",
      "/photos/cc 2024-08-23T02_03_25.666Z.png",
      "/photos/congratulation.png",
      "/photos/network-error-day.png",
      "/photos/network-error-night.png",
      // "/photos/6Y7A5305.JPG",
      // "/photos/6Y7A5306.JPG",
      // "/photos/6Y7A5307.JPG",
      // "/photos/6Y7A5308.JPG",
      // "/photos/6Y7A5309.JPG",
      // "/photos/6Y7A5310.JPG",

    ].map((photo) => ({
      thumbnail: photo,
      fullsize: photo,
    }))
  }, [])
  useEffect(() => {
    const updateSize = () => {
      setGallerySize(window.innerWidth * 0.8)
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Initialize Firebase Analytics on client side
  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    if (coverInView) setCurrentSection(0)
    else if (detailsInView) setCurrentSection(1)
    else if (galleryInView) setCurrentSection(2)
    else if (rsvpInView) setCurrentSection(3)
    else if (mapInView) setCurrentSection(4)
    else if (messageBoardInView) setCurrentSection(5)
  }, [coverInView, detailsInView, galleryInView, rsvpInView, mapInView, messageBoardInView])

  useEffect(() => {
    const messagesRef = query(
      ref(db, 'rsvps'),
      orderByChild('timestamp'),
      limitToLast(50)
    );

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData: Array<any> = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.message) { // 只显示有留言的条目
          messagesData.push({
            id: childSnapshot.key,
            name: sanitizeInput(data.name),
            message: sanitizeInput(data.message),
            timestamp: data.timestamp,
          });
        }
      });

      // 按时间倒序排序
      setMessages(messagesData.reverse());
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const rsvpsRef = ref(db, "rsvps")

      // 在存储前进行 XSS 过滤
      await push(rsvpsRef, {
        name: sanitizeInput(name),
        attending,
        message: message ? sanitizeInput(message) : null,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
      })

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
      document.getElementById("map"),
      document.getElementById("message-board"),
    ]
    sections[index]?.scrollIntoView({ behavior: "smooth" })
  }

  // 添加 XSS 过滤函数
  const sanitizeInput = (input: string) => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return (
    <div className="relative bg-wedding min-h-screen text-gray-800 overflow-hidden">
      {/* 背景装饰 */}
      <AnimatedHearts count={15} />

      {/* Navigation dots */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSection === index ? "bg-rose-500 scale-125" : "bg-gray-300"
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
          className="max-w-md glass p-8 rounded-xl"
        >
          <div className="mb-6 relative w-32 h-32 mx-auto rounded-2xl overflow-hidden">
            <Image src="/monogram.jpg" alt="Wedding monogram" fill className="object-contain" />
          </div>
          <h1 className="font-script text-3xl mb-4 text-rose-700">刘宽&nbsp;&nbsp;&&nbsp;&nbsp;于明昊</h1>
          <h2 className="font-serif text-2xl font-light mb-8 text-rose-600">诚挚邀请您参加我们的婚礼</h2>

          <FloralDivider />

          <p className="font-serif text-xl mb-4">2025年5月1日</p>
          <p className="font-serif text-lg mb-8">威海 · 铂丽斯</p>

          <CountdownTimer targetDate={weddingDate} />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              <ChevronDown className="text-rose-500 w-8 h-8" />
            </motion.div>
          </div>
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
                <p>2025年5月1日 星期四</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">时间</h3>
                <p>婚礼仪式: 12:08</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">地点</h3>
                <p>山东省威海市经济技术开发区黄海路19号</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">联系方式</h3>
                <p>ymhyzq@163.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">电话</h3>
                <p>18369195962</p>
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
            <PhotoGallery3D
              images={photos}
              size={gallerySize}
            />
          </div>

          <div className="text-center mt-6 text-sm text-rose-500 font-serif italic">
            <p>拖动旋转 • 点击图片查看</p>
          </div>

          {/* <div className="mt-8 text-center">
            <p className="font-serif text-lg text-gray-700 mb-4">"爱情是灵魂的相遇，心灵的共鸣"</p>
            <p className="text-gray-600">
              我们相遇于2020年的春天，一路相伴走过风雨，如今终于迎来人生新的篇章。
              感谢您能在这特别的日子与我们共同见证这美好的时刻。
            </p>
          </div> */}
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
                    <Check className="w-4 h-4 mr-2" /> 是
                  </Button>
                  <Button
                    type="button"
                    variant={attending === false ? "default" : "outline"}
                    onClick={() => setAttending(false)}
                    disabled
                    className={
                      attending === false
                        ? "bg-rose-500 hover:bg-rose-600"
                        : "border-rose-300 text-rose-600 hover:bg-rose-50"
                    }
                  >
                    <X className="w-4 h-4 mr-2" /> &#128533;男人不能说不行
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
                disabled={!name || attending === null || isSubmitting}
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
      <section className="py-12 px-6 bg-white" id="map" ref={mapRef}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-md w-full"
        >
          <div className="max-w-md mx-auto">
            <h2 className="font-script text-4xl mb-2 text-center text-rose-700">婚礼地点</h2>
            <p className="text-center text-rose-500 mb-6 font-serif">Location</p>

            <FloralDivider />

            <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg border-4 border-white">
              <AMapLocation
                latitude={37.428392}  // 威海铂丽斯酒店的纬度
                longitude={122.172677} // 威海铂丽斯酒店的经度
                title="威海铂丽斯酒店"
                address="威海铂丽斯酒店"
              />
            </div>
            <div className="mt-6 text-center">
              <p className="font-serif font-medium text-lg">山东省威海市</p>
              <p>经济技术开发区黄海路19号</p>
              <MapDirectionsButton
                address="山东省威海市经济技术开发区黄海路19号"
                latitude={37.428392}  // 威海铂丽斯酒店的纬度
                longitude={122.172677} // 威海铂丽斯酒店的经度
                venueName="威海铂丽斯酒店"
              />
            </div>
          </div>
        </motion.div>

      </section>

      {/* Message Board Section */}
      <section id="message-board" ref={messageBoardRef} className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="font-script text-4xl mb-2 text-center text-rose-700">留言板</h2>
          <p className="text-center text-rose-500 mb-6 font-serif">Messages</p>

          <FloralDivider />

          <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 italic">还没有留言，来做第一个留言的人吧！</p>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-rose-700">{msg.name}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-rose-600 bg-rose-50">
        <div className="max-w-md mx-auto px-6">
          <FloralDivider className="mb-6" />
          <p className="font-serif text-lg mb-2">我们期待与您共度美好时光！</p>
          <p className="font-script text-2xl mb-4">Minghao Yu & Kuan Liu</p>
          <p className="text-rose-400">© 2025</p>
        </div>
      </footer>
    </div>
  )
}

