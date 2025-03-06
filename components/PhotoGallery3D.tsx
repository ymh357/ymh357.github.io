"use client"

import type React from 'react';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  Loader2,
  X,
} from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface PhotoGallery3DProps {
  images: {
    thumbnail: string // 压缩版图片URL
    fullsize: string // 高清图片URL
  }[]
  size?: number
}

export default function PhotoGallery3D({ images, size = 400 }: PhotoGallery3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isFullsizeLoading, setIsFullsizeLoading] = useState(false)
  const controlsRef = useRef<OrbitControls | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const photoObjectsRef = useRef<THREE.Mesh[]>([])
  const photoUrlMapRef = useRef<Map<THREE.Mesh, string>>(new Map())
  const loadedImagesRef = useRef<Set<string>>(new Set())
  const loadingImagesRef = useRef<Set<string>>(new Set())
  const geometriesRef = useRef<THREE.BufferGeometry[]>([])
  const materialsRef = useRef<THREE.Material[]>([])
  const texturesRef = useRef<THREE.Texture[]>([])

  // 初始化Three.js场景
  useEffect(() => {
    if (!containerRef.current) return

    // 创建场景
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // 创建相机
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
    camera.position.z = 15
    cameraRef.current = camera

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance", // 优化性能
    })
    renderer.setSize(size, size)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 限制像素比以提高性能
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 创建控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.enableZoom = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controlsRef.current = controls

    // 创建一个简单的背景
    const bgGeometry = new THREE.SphereGeometry(30, 32, 32)
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.1,
    })
    const background = new THREE.Mesh(bgGeometry, bgMaterial)
    scene.add(background)

    // 初始化完成
    setIsInitializing(false)

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // 处理窗口大小变化
    const handleResize = () => {
      const newSize = Math.min(containerRef.current?.offsetWidth || size, size)
      camera.aspect = 1
      camera.updateProjectionMatrix()
      renderer.setSize(newSize, newSize)
    }
    window.addEventListener("resize", handleResize)
    handleResize()

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      controls.dispose()
      renderer.dispose()
    }
  }, [size])

  // 创建照片对象的函数
  const createPhotoObject = (
    url: string,
    texture: THREE.Texture,
    position: THREE.Vector3,
    rotation: THREE.Euler,
    aspectRatio: number,
  ) => {
    if (!sceneRef.current) return null

    // 根据图片的宽高比调整照片尺寸
    const width = 3
    const height = width / aspectRatio

    // 创建照片几何体
    const photoGeometry = new THREE.PlaneGeometry(width, height)

    // 创建照片材质 - 使用基础材质，不受光照影响
    const photoMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    })

    // 创建照片网格
    const photo = new THREE.Mesh(photoGeometry, photoMaterial)
    photo.position.copy(position)
    photo.rotation.copy(rotation)
    photo.renderOrder = 1

    // 创建照片边框
    const frameGeometry = new THREE.PlaneGeometry(width + 0.1, height + 0.1)
    const frameMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    frame.position.copy(position)
    frame.position.z -= 0.01
    frame.rotation.copy(rotation)
    frame.renderOrder = 0

    // 添加到场景
    sceneRef.current.add(frame)
    sceneRef.current.add(photo)

    // 记录照片对象
    photoObjectsRef.current.push(photo)
    photoUrlMapRef.current.set(photo, url)

    // 记录资源以便清理
    texturesRef.current.push(texture)
    geometriesRef.current.push(photoGeometry)
    materialsRef.current.push(photoMaterial)

    // 淡入动画
    const fadeIn = () => {
      if (photoMaterial.opacity < 1) {
        photoMaterial.opacity += 0.02
        requestAnimationFrame(fadeIn)
      }
    }
    fadeIn()

    return photo
  }

  // 创建随机位置
  const createRandomPosition = (index: number, total: number) => {
    // 使用黄金螺旋分布算法，确保照片分布均匀
    const phi = Math.acos(-1 + (2 * index) / total)
    const theta = Math.sqrt(total * Math.PI) * phi

    // 创建一个随机半径，使照片分布在一个球形空间内
    const radius = 8 + Math.random() * 4

    // 计算3D坐标
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    return new THREE.Vector3(x, y, z)
  }

  // 创建随机旋转
  const createRandomRotation = () => {
    // 添加一些随机旋转，使照片看起来更自然，但角度更小
    const rotX = (Math.random() - 0.5) * 0.1
    const rotY = (Math.random() - 0.5) * 0.1
    const rotZ = (Math.random() - 0.5) * 0.1

    return new THREE.Euler(rotX, rotY, rotZ)
  }

  // 加载图片的函数
  const loadImage = (imageData: (typeof images)[0], index: number) => {
    const { thumbnail } = imageData

    // 如果已经加载或正在加载，则跳过
    if (loadedImagesRef.current.has(thumbnail) || loadingImagesRef.current.has(thumbnail)) {
      return
    }

    // 标记为正在加载
    loadingImagesRef.current.add(thumbnail)

    // 创建图片元素来获取宽高比
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // 获取图片宽高比
      const aspectRatio = img.width / img.height

      // 创建纹理
      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(
        thumbnail,
        (texture) => {
          // 创建照片对象
          const position = createRandomPosition(index, images.length)
          const rotation = createRandomRotation()
          createPhotoObject(thumbnail, texture, position, rotation, aspectRatio)

          // 标记为已加载
          loadedImagesRef.current.add(thumbnail)
          loadingImagesRef.current.delete(thumbnail)

          // 检查是否需要加载更多图片
          checkAndLoadMoreImages()
        },
        undefined,
        () => {
          // 加载失败
          loadingImagesRef.current.delete(thumbnail)
          checkAndLoadMoreImages()
        },
      )
    }
    img.onerror = () => {
      // 加载失败
      loadingImagesRef.current.delete(thumbnail)
      checkAndLoadMoreImages()
    }
    img.src = thumbnail
  }

  // 检查是否在视野内
  const isInViewFrustum = (position: THREE.Vector3) => {
    if (!cameraRef.current) return false

    const frustum = new THREE.Frustum()
    const projScreenMatrix = new THREE.Matrix4()

    projScreenMatrix.multiplyMatrices(cameraRef.current.projectionMatrix, cameraRef.current.matrixWorldInverse)
    frustum.setFromProjectionMatrix(projScreenMatrix)

    return frustum.containsPoint(position)
  }

  // 检查并加载更多图片
  const checkAndLoadMoreImages = () => {
    // 限制同时加载的图片数量
    if (loadingImagesRef.current.size >= MAX_CONCURRENT_LOADS) return

    // 计算哪些图片在视野内但尚未加载
    const visibleUnloadedImages = images
      .filter((img, index) => {
        // 如果已加载或正在加载，则跳过
        if (loadedImagesRef.current.has(img.thumbnail) || loadingImagesRef.current.has(img.thumbnail)) {
          return false
        }

        // 计算该图片的位置
        const position = createRandomPosition(index, images.length)

        // 检查是否在视野内
        return isInViewFrustum(position)
      })
      .slice(0, 2) // 最多加载2张

    // 如果视野内没有未加载的图片，则加载任意未加载的图片
    if (visibleUnloadedImages.length === 0) {
      const unloadedImages = images
        .filter((img) => !loadedImagesRef.current.has(img.thumbnail) && !loadingImagesRef.current.has(img.thumbnail))
        .slice(0, 2)

      unloadedImages.forEach((img, i) => {
        const originalIndex = images.findIndex((image) => image.thumbnail === img.thumbnail)
        loadImage(img, originalIndex)
      })
    } else {
      // 加载视野内的图片
      visibleUnloadedImages.forEach((img, i) => {
        const originalIndex = images.findIndex((image) => image.thumbnail === img.thumbnail)
        loadImage(img, originalIndex)
      })
    }
  }

  // 处理点击事件
  const handleClick = (event: React.MouseEvent) => {
    if (!rendererRef.current || !cameraRef.current) return

    // 计算鼠标位置
    const rect = rendererRef.current.domElement.getBoundingClientRect()
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    )

    // 创建射线投射器
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, cameraRef.current)

    // 检测相交的对象
    const intersects = raycaster.intersectObjects(photoObjectsRef.current)

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object as THREE.Mesh
      const thumbnailUrl = photoUrlMapRef.current.get(selectedObject)

      if (thumbnailUrl) {
        // 找到对应的高清图URL
        const imageData = images.find((img) => img.thumbnail === thumbnailUrl)
        if (imageData) {
          setIsFullsizeLoading(true)
          setSelectedImage(imageData.fullsize)
          if (controlsRef.current) {
            controlsRef.current.autoRotate = false
          }
        }
      }
    }
  }

  // 关闭全屏图片
  const closeFullsizeImage = () => {
    setSelectedImage(null)
    setIsFullsizeLoading(false)
    if (controlsRef.current) {
      controlsRef.current.autoRotate = true
    }
  }

  // 初始加载第一批图片
  useEffect(() => {
    if (!isInitializing && images.length > 0) {
      // 初始只加载前2张图片
      for (let i = 0; i < Math.min(2, images.length); i++) {
        loadImage(images[i], i)
      }

      // 添加控制器变化事件监听，当视角变化时检查并加载新进入视野的照片
      const handleControlChange = () => {
        checkAndLoadMoreImages()
      }

      if (controlsRef.current) {
        controlsRef.current.addEventListener("change", handleControlChange)
      }

      return () => {
        if (controlsRef.current) {
          controlsRef.current.removeEventListener("change", handleControlChange)
        }
      }
    }
  }, [isInitializing, images])

  // 在组件卸载时清理资源
  useEffect(() => {
    return () => {
      // 清理所有资源
      geometriesRef.current.forEach(geometry => geometry.dispose())
      materialsRef.current.forEach(material => material.dispose())
      texturesRef.current.forEach(texture => texture.dispose())

      // 清理渲染器
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current.forceContextLoss()
      }

      // 清理场景
      if (sceneRef.current) {
        sceneRef.current.clear()
      }
    }
  }, [])

  // 限制同时加载的图片数量
  const MAX_CONCURRENT_LOADS = 2

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full aspect-square max-w-full mx-auto rounded-full bg-gradient-to-br from-rose-50 to-rose-100 p-2 shadow-lg overflow-hidden"
        style={{ height: size, width: size }}
        onClick={handleClick}
      />

      {isInitializing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-lg">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <div className="text-sm text-rose-600">初始化中...</div>
        </div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[501] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={closeFullsizeImage}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-3xl max-h-[80vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeFullsizeImage}
                className="absolute -top-10 right-0 text-white hover:text-rose-300 transition-colors"
                aria-label="Close image"
              >
                <X size={24} />
              </button>

              {isFullsizeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}

              <motion.img
                src={selectedImage}
                alt="高清照片"
                className="w-full h-full object-contain rounded-lg border-4 border-white shadow-2xl"
                onLoad={() => setIsFullsizeLoading(false)}
                layoutId={`image-${selectedImage}`}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

