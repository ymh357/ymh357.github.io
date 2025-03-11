"use client"

import type React from 'react';
import {
  useEffect,
  useState,
} from 'react';

import {
  push,
  ref,
  serverTimestamp,
} from 'firebase/database';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  Check,
  CirclePlay,
  Clock,
  Mail,
  MapPin,
  Phone,
  X,
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import Album from '@/components/album';
import AnimatedParticles from '@/components/decorative/animated-particles';
import ChineseDoubleLuck from '@/components/decorative/chinese-double-luck';
import ParentNames from '@/components/decorative/parent-names';
import MapDirectionsButton from '@/components/map-directions-button';
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

import AMapLocation from './amap-location';

export default function ParentInvitation() {
    const [currentSection, setCurrentSection] = useState(0)
    const [name, setName] = useState("")
    const [attending, setAttending] = useState<boolean | null>(null)
    const [message, setMessage] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [coverRef, coverInView] = useInView({ threshold: 0.5 })
    const [detailsRef, detailsInView] = useInView({ threshold: 0.5 })
    const [galleryRef, galleryInView] = useInView({ threshold: 0.5 })
    const [rsvpRef, rsvpInView] = useInView({ threshold: 0.5 })
    const [mapRef, mapInView] = useInView({ threshold: 0.5 })

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
    }, [coverInView, detailsInView, galleryInView, rsvpInView])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            // Create a reference to the 'rsvps' collection
            const rsvpsRef = ref(db, "rsvps-parents")

            // Create a new RSVP entry with the form data
            await push(rsvpsRef, {
                name,
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
            document.getElementById("map"),
        ]
        sections[index]?.scrollIntoView({ behavior: "smooth" })
    }

    // 父母信息
    const groomParents = {
        father: "于志强",
        mother: "李桂欣",
    }

    const brideParents = {
        father: "刘勤涛",
        mother: "陈明秀",
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        typeof navigator !== 'undefined' ? navigator.userAgent : ''
    )

    return (
        <div className="relative min-h-screen text-gray-800  bg-gradient-to-b from-red-50 to-red-100">


            {/* 飘落的红包和花瓣 */}

            {!isMobile && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <AnimatedParticles count={20} type="redEnvelope" />
                    <AnimatedParticles count={30} type="petalRed" />
                </div>
            )}


            {/* Navigation dots */}
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
                <div className="flex flex-col gap-4">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <button
                            key={index}
                            onClick={() => scrollToSection(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSection === index ? "bg-red-600 scale-125" : "bg-gray-300"
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
                    className="max-w-md  w-full bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-2xl border-4 border-red-600 shadow-2xl relative "
                >


                    {/* 内容 */}
                    <div className="relative z-10">
                        <div className="mb-6 mx-auto">
                            <ChineseDoubleLuck size={100} />
                        </div>

                        <h1 className="font-script text-5xl mb-4 text-red-700">喜宴邀请函</h1>

                        <div className="my-6 py-4 border-t-2 border-b-2 border-red-300 border-dashed">
                            <h2 className="font-serif text-2xl font-medium text-red-700">谨定于</h2>
                            <p className="font-serif text-xl mt-2 text-red-700">2025年5月1日（星期四）</p>
                            <p className="font-serif text-lg mt-1 text-red-700">威海铂丽斯酒店 四楼 安然厅</p>
                        </div>

                        <div className="my-6">
                            <ParentNames
                                groomFather={groomParents.father}
                                groomMother={groomParents.mother}
                                brideFather={brideParents.father}
                                brideMother={brideParents.mother}
                            />
                        </div>

                        <p className="font-serif text-xl mb-2 text-red-700">敬备喜宴 恭请光临</p>

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
                    className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border-4 border-red-600 relative"
                >
                    {/* 背景装饰 */}
                    <div className="absolute inset-0  opacity-5 bg-center bg-no-repeat"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-6">
                            <ChineseDoubleLuck size={60} />
                        </div>

                        <h2 className="font-script text-4xl mb-2 text-center text-red-700">婚礼详情</h2>
                        <p className="text-center text-red-500 mb-6 font-serif">Wedding Details</p>

                        <div className="my-6 flex justify-center">
                            <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <Calendar className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
                                <div>
                                    <h3 className="font-serif font-medium text-lg">日期</h3>
                                    <p>2025年5月1日 星期四</p>
                                    <p className="text-red-600">农历四月初四</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Clock className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
                                <div>
                                    <h3 className="font-serif font-medium text-lg">时间</h3>
                                    <p>婚礼仪式: 中午 11:28</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <MapPin className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
                                <div>
                                    <h3 className="font-serif font-medium text-lg">地点</h3>
                                    <p>威海铂丽斯酒店四楼安然厅</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Mail className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
                                <div>
                                    <h3 className="font-serif font-medium text-lg">联系方式</h3>
                                    <p>yzqandlgx@163.com</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Phone className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
                                <div>
                                    <h3 className="font-serif font-medium text-lg">电话</h3>
                                    <p>18663172097</p>
                                </div>
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
                    <div className="text-center mb-6">
                        <ChineseDoubleLuck size={60} />
                    </div>

                    <h2 className="font-script text-4xl mb-2 text-center text-red-700">照片分享</h2>
                    <p className="text-center text-red-500 mb-6 font-serif">Photos share</p>

                    <div className="my-6 flex justify-center">
                        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                    </div>

                    <Album />

                    <div className="text-center mt-6 text-sm text-red-500 font-serif italic">
                        <p>拖动旋转 • 点击图片查看</p>
                    </div>

                    <motion.a
                        href="https://www.hunliji.com/m/ling-xi/mv-card/index.html?card_id=MTE2NzkwMTExZmlyZV9jbG91ZA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6  flex items-center justify-center px-6 py-3 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-all duration-300 hover:scale-105 shadow-lg group relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="relative flex items-center">
                            观看视频
                            <CirclePlay className=" ml-2 w-6 h-6 text-white  flex-shrink-0" />

                        </span>
                    </motion.a>
                </motion.div>
            </section>

            {/* RSVP Section */}
            <section id="rsvp" ref={rsvpRef} className="min-h-screen flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border-4 border-red-600"
                >
                    <div className="text-center mb-6">
                        <ChineseDoubleLuck size={60} />
                    </div>

                    <h2 className="font-script text-4xl mb-2 text-center text-red-700">回复邀请</h2>
                    <p className="text-center text-red-500 mb-6 font-serif">RSVP</p>

                    <div className="my-6 flex justify-center">
                        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                    </div>

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
                                    className="w-full border-red-200 focus:border-red-400 focus:ring-red-400"
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
                                            attending === true ? "bg-red-600 hover:bg-red-700" : "border-red-300 text-red-600 hover:bg-red-50"
                                        }
                                    >
                                        <Check className="w-4 h-4 mr-2" /> 是
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={attending === false ? "default" : "outline"}
                                        onClick={() => setAttending(false)}
                                        className={
                                            attending === false
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "border-red-300 text-red-600 hover:bg-red-50"
                                        }
                                    >
                                        <X className="w-4 h-4 mr-2" /> 否
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
                                    className="w-full border-red-200 focus:border-red-400 focus:ring-red-400"
                                    rows={3}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700"
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
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="text-red-600 text-2xl">囍</div>
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
                        <div className="text-center mb-6">
                            <ChineseDoubleLuck size={60} />
                        </div>

                        <h2 className="font-script text-4xl mb-2 text-center text-red-700">婚礼地点</h2>
                        <p className="text-center text-red-500 mb-6 font-serif">Location</p>

                        <div className="my-6 flex justify-center">
                            <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                        </div>

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

            {/* Footer */}
            <footer className="py-12 text-center text-sm text-red-600 bg-red-50">
                <div className="max-w-md mx-auto px-6">
                    <div className="text-center mb-6">
                        <ChineseDoubleLuck size={40} />
                    </div>

                    <p className="font-serif text-lg mb-2">感谢您的祝福与见证！</p>

                    <p className="text-red-400 mt-4">© 2025</p>
                </div>
            </footer>
        </div>
    )
}

