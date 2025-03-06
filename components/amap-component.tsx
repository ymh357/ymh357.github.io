"use client"

import {
  memo,
  useEffect,
  useState,
} from 'react';

import {
  APILoader,
  Map,
  Marker,
} from '@uiw/react-amap';

interface AMapComponentProps {
  latitude: number
  longitude: number
  title: string
  address: string
}

function AMapComponent({ latitude, longitude, title, address }: AMapComponentProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // 延迟初始化地图，确保容器已经可见
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full">
      <APILoader
        akey={process.env.NEXT_PUBLIC_AMAP_KEY || ''}
        version="2.0"
      >
        {mapReady && (
          <Map
            center={[longitude, latitude]}
            zoom={15}
            className="w-full h-full"
          >
            <Marker
              position={[longitude, latitude]}
              title={title}
              label={{
                content: '',
                direction: 'top'
              }}
              icon="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png"
              animation="AMAP_ANIMATION_BOUNCE"
            />
          </Map>
        )}
      </APILoader>
    </div>
  )
}

export default memo(AMapComponent);