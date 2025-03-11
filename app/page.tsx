"use client"

import type React from 'react';
import {
  useEffect,
  useRef,
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
  CirclePlay,
  Clock,
  Heart,
  Mail,
  MapPin,
  MessageSquareMore,
  Music,
  Pause,
  Phone,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';

import Album from '@/components/album';
import AMapLocation from '@/components/amap-location';
import AnimatedHearts from '@/components/decorative/animated-heart';
import CountdownTimer from '@/components/decorative/countdown-timer';
import FloralDivider from '@/components/decorative/floral-divider';
import MapDirectionsButton from '@/components/map-directions-button';
import ParentInvitation from '@/components/parent-invitation';
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
  const searchParams = useSearchParams()
  const version = searchParams.get("v")
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 婚礼日期 - 2025年5月1日
  const weddingDate = new Date(2025, 4, 1) // 月份是从0开始的，所以4代表5月

  const [coverRef, coverInView] = useInView({ threshold: 0.5 })
  const [detailsRef, detailsInView] = useInView({ threshold: 0.5 })
  const [galleryRef, galleryInView] = useInView({ threshold: 0.5 })
  const [rsvpRef, rsvpInView] = useInView({ threshold: 0.5 })
  const [mapRef, mapInView] = useInView({ threshold: 0.5 })
  const [messageBoardRef, messageBoardInView] = useInView({ threshold: 0.5 })

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

  const handleRef = useRef<NodeJS.Timeout | undefined>(undefined)
  // 添加用户交互检测
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && !handleRef.current) {  // 只在第一次交互时执行
        setHasInteracted(true);
        handleRef.current = setTimeout(() => {
          // 尝试自动播放
          if (audioRef.current) {
            audioRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(error => {
              console.log('Auto-play prevented:', error);
              setIsPlaying(false);
            });
          }
        }, 500);

      }
    };

    // 监听更多的交互事件
    const events = ['click', 'touchstart', 'scroll', 'keydown'];
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, [hasInteracted]);

  // 修改音频控制功能
  useEffect(() => {
    if (audioRef.current && hasInteracted) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Playback failed:', error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, hasInteracted]);

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

  const [showGroomMessage, setShowGroomMessage] = useState(false);
  const [groomMessage, setGroomMessage] = useState("加载中...");

  useEffect(() => {

    // 添加新郎新娘消息的监听
    const groomMessageRef = ref(db, 'weddingMessages/groom');

    const unsubscribeGroom = onValue(groomMessageRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.message) {
        setGroomMessage(sanitizeInput(data.message.replace(/\\n/g, '\n')));
      }
    });

    return () => {
      unsubscribeGroom();
    };
  }, []);

  const [hasClickedGroomMessage, setHasClickedGroomMessage] = useState(false);

  const [isParentVersion, setIsParentVersion] = useState(false)
  useEffect(() => {
    setIsParentVersion(version === "v2")
  }, [version])

  if (isParentVersion) {
    return <ParentInvitation />
  }

  return (
    <div className="relative bg-wedding min-h-screen text-gray-800 overflow-hidden">
      {/* 添加音频元素 */}
      <audio
        ref={audioRef}
        src="/music/wedding-song.mp3"
        loop
        preload="auto"
      />

      {/* 修改音乐控制按钮 */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`fixed bottom-6 right-6 z-[500] w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group ${!hasInteracted ? 'animate-pulse' : ''
          }`}
        aria-label={isPlaying ? '暂停音乐' : '播放音乐'}
      >
        <motion.div
          animate={{
            rotate: isPlaying ? 360 : 0
          }}
          transition={{
            duration: 4,
            repeat: isPlaying ? Infinity : 0,
            ease: "linear"
          }}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Music className="w-6 h-6" />
          )}
        </motion.div>
      </button>

      {/* 背景装饰 */}
      <AnimatedHearts count={15} />

      {/* Navigation dots */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className="w-5 h-5 flex items-center justify-center"
              aria-label={`Go to section ${index + 1}`}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSection === index
                  ? "bg-rose-500 transform scale-125"
                  : "bg-gray-300"
                  }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* 添加新郎新娘头像和消息气泡 */}
      <div className="fixed left-4 top-4 z-[500] flex flex-col gap-2">
        {/* 新郎头像和消息 */}
        <div className="relative">
          <motion.button
            style={{
              originX: 0, // 设置变换原点在左侧
              originY: 1,  // 设置变换原点在底部
            }}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={
              !hasClickedGroomMessage
                ? {
                  scale: [0, 1],
                  opacity: [0, 1],
                }
                : { scale: 1, opacity: 1 }
            }
            transition={
              !hasClickedGroomMessage
                ? {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
                : { duration: 0.3 }
            }
            onClick={() => {
              setShowGroomMessage(prev => !prev);
              setHasClickedGroomMessage(true);
            }}
          >
            <MessageSquareMore className="w-8 h-8 text-rose-500" />          </motion.button>

          {showGroomMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="absolute left-12 top-0 bg-white rounded-2xl p-4 shadow-lg w-72 border border-rose-200"
            >
              <button
                onClick={() => setShowGroomMessage(false)}
                className="absolute right-2 top-2 text-rose-400 hover:text-rose-600"
              >
                <X size={16} />
              </button>
              <p className="mt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {groomMessage}
              </p>
              <div className="text-right mt-2 text-rose-500 font-script">
                - Yours Truly
              </div>
            </motion.div>
          )}
        </div>

        {/* 新娘头像和消息 */}
        {/* <div className="relative">
          <button
            onClick={() => setShowBrideMessage(prev => !prev)}
            className="w-8 h-8 rounded-full bg-white overflow-hidden border-2 border-rose-300 hover:border-rose-500 transition-all duration-300 shadow-lg hover:scale-105 flex items-center justify-center"
          >
            <Heart className="w-4 h-4 text-rose-500" />
          </button>

          {showBrideMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="absolute left-12 top-0 bg-white rounded-2xl p-4 shadow-lg w-72 border border-rose-200"
            >
              <button
                onClick={() => setShowBrideMessage(false)}
                className="absolute right-2 top-2 text-rose-400 hover:text-rose-600"
              >
                <X size={16} />
              </button>
              <p className="text-sm text-gray-700 leading-relaxed">
                {brideMessage}
              </p>
              <div className="text-right mt-2 text-rose-500 font-script">
                - 刘宽
              </div>
            </motion.div>
          )}
        </div> */}
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
          <h1 className="font-script text-3xl mb-4 text-rose-700">于明昊&nbsp;&nbsp;&&nbsp;&nbsp;刘宽</h1>
          <h2 className="font-serif text-2xl font-light mb-8 text-rose-600">诚挚邀请您参加我们的婚礼</h2>

          <FloralDivider />

          <p className="font-serif text-xl mb-4">2025年5月1日</p>
          <p className="font-serif text-lg ">威海 · 铂丽斯</p>

          <CountdownTimer targetDate={weddingDate} />

          <motion.a
            href="https://www.hunliji.com/m/ling-xi/mv-card/index.html?card_id=MTE2NzkwMTExZmlyZV9jbG91ZA"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 inline-flex items-center justify-center px-6 py-3 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-all duration-300 hover:scale-105 shadow-lg group relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center">
              我们的视频
              <CirclePlay className=" ml-2 w-6 h-6 text-white  flex-shrink-0" />

            </span>
          </motion.a>

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
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">日期</h3>
                <p>2025年5月1日 星期四</p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">时间</h3>
                <p>婚礼仪式: 11:28</p>
              </div>
            </div>

            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">地点</h3>
                <p>山东省威海市经济技术开发区黄海路19号</p>
              </div>
            </div>

            <div className="flex items-center">
              <Mail className="w-6 h-6 text-rose-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-medium text-lg">联系方式</h3>
                <p>ymhyzq@163.com</p>
              </div>
            </div>

            <div className="flex items-center">
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

          <Album />

          <div className="text-center mt-6 text-sm text-rose-500 font-serif italic">
            <p>拖动旋转 • 点击图片查看</p>
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
                    <X className="w-4 h-4 mr-2" /> 否（不准）
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
      <section className="py-12 px-6 bg-white flex flex-col items-center justify-center" id="map" ref={mapRef}>
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

