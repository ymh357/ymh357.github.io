"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MapDirectionsButtonProps {
  address: string
  latitude: number
  longitude: number
  venueName: string
}

export default function MapDirectionsButton({ address, latitude, longitude, venueName }: MapDirectionsButtonProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detect if user is on mobile
    const userAgent = navigator.userAgent || navigator.vendor
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    setIsMobile(isMobileDevice)

    // Detect if user is on iOS
    const isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent)
    setIsIOS(isIOSDevice)
  }, [])

  // Generate map URLs for different services
  const getMapUrls = () => {
    const encodedAddress = encodeURIComponent(`${venueName}, ${address}`)

    return {
      gaode: `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${encodedAddress}`,
      tencent: `https://apis.map.qq.com/uri/v1/marker?marker=coord:${latitude},${longitude};title:${encodedAddress}&referer=myapp`,
      baidu: `https://api.map.baidu.com/marker?location=${latitude},${longitude}&title=${encodedAddress}&content=${encodedAddress}&output=html`,
      apple: `https://maps.apple.com/?q=${encodedAddress}&ll=${latitude},${longitude}`,
      google: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodedAddress}`,
    }
  }

  const handleOpenMap = (mapType: string) => {
    const mapUrls = getMapUrls()

    switch (mapType) {
      case "gaode":
        window.open(mapUrls.gaode, "_blank")
        break
      case "tencent":
        window.open(mapUrls.tencent, "_blank")
        break
      case "baidu":
        window.open(mapUrls.baidu, "_blank")
        break
      case "apple":
        window.open(mapUrls.apple, "_blank")
        break
      case "google":
        window.open(mapUrls.google, "_blank")
        break
      default:
        // Default to the most appropriate map based on device
        if (isIOS) {
          window.open(mapUrls.apple, "_blank")
        } else {
          window.open(mapUrls.gaode, "_blank")
        }
    }
  }

  // If on mobile, show dropdown with map options
  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-4">
            <MapPin className="w-4 h-4 mr-2" /> 获取路线
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={() => handleOpenMap("gaode")}>高德地图</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenMap("tencent")}>腾讯地图</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenMap("baidu")}>百度地图</DropdownMenuItem>
          {isIOS && <DropdownMenuItem onClick={() => handleOpenMap("apple")}>Apple 地图</DropdownMenuItem>}
          <DropdownMenuItem onClick={() => handleOpenMap("google")}>Google 地图</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // On desktop, just open default map
  return (
    <Button variant="outline" className="mt-4" onClick={() => handleOpenMap("default")}>
      <MapPin className="w-4 h-4 mr-2" /> 获取路线
    </Button>
  )
}

