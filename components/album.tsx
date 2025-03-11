import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import PhotoGallery3D from './PhotoGallery3D';

export default function Album() {
    // 添加一个 useEffect 来处理窗口大小
    const [gallerySize, setGallerySize] = useState(300)

    const photos = useMemo(() => {
        return Array.from({ length: 35 }).map((_, i) => {
            return {
                thumbnail: `/photos/wedding-photo_${i}-min.jpg`,
                fullsize: `/photos/wedding-photo_${i}-org.JPG`,
            }
        })
    }, [])
    useEffect(() => {
        const updateSize = () => {
            setGallerySize(window.innerWidth * 0.8)
        }

        updateSize()
        window.addEventListener('resize', updateSize)

        return () => window.removeEventListener('resize', updateSize)
    }, [])

    return (
        <div className="flex justify-center mb-8">
            <PhotoGallery3D
                images={photos}
                size={gallerySize}
            />
        </div>
    )
}
