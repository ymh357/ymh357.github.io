"use client"

import dynamic from 'next/dynamic';

const AMapComponent = dynamic(
  () => import('./amap-component'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
)

interface AMapLocationProps {
  latitude: number
  longitude: number
  title: string
  address: string
}

export default function AMapLocation(props: AMapLocationProps) {
  return <AMapComponent {...props} />
} 