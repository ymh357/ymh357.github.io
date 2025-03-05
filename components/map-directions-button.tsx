"use client"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface MapDirectionsButtonProps {
  address: string
  latitude: number
  longitude: number
  venueName: string
}

export default function MapDirectionsButton({
  address,
  latitude,
  longitude,
  venueName,
}: MapDirectionsButtonProps) {
  const handleClick = () => {
    // 使用高德地图 URL Scheme
    const url = `androidamap://navi?sourceApplication=e-invitation&lat=${latitude}&lon=${longitude}&dev=0&style=2`
    
    // iOS 设备使用不同的 URL Scheme
    const iosUrl = `iosamap://navi?sourceApplication=e-invitation&lat=${latitude}&lon=${longitude}&dev=0&style=2`
    
    // 判断设备类型
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    
    // 如果是移动设备，尝试打开对应的地图应用
    if (isIOS) {
      window.location.href = iosUrl
      // 如果无法打开应用，则跳转到 App Store
      setTimeout(() => {
        window.location.href = "https://apps.apple.com/cn/app/id461703208"
      }, 2000)
    } else {
      window.location.href = url
      // 如果无法打开应用，则跳转到网页版
      setTimeout(() => {
        window.location.href = `https://uri.amap.com/navigation?to=${longitude},${latitude},${venueName}&mode=car&coordinate=gaode`
      }, 2000)
    }
  }

  return (
    <Button
      onClick={handleClick}
      className="mt-4 bg-rose-500 hover:bg-rose-600 text-white"
    >
      <MapPin className="w-4 h-4 mr-2" />
      导航到会场
    </Button>
  )
}

