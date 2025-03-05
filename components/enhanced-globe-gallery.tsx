"use client"

import {
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import { X } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface EnhancedGlobeGalleryProps {
  images: string[]
  size?: number
}

function EnhancedGlobeGallery({ images, size }: EnhancedGlobeGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(size, size)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controlsRef.current = controls
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5 // Slower rotation for elegance

    // Create a sphere geometry with a more elegant wireframe
    const radius = 2
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32)
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xfda4af, // Rose-300 color
      wireframe: false, // 移除球体网格线
      transparent: true,
      opacity: 0, // 将不透明度设置为0，完全隐藏网格
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    scene.add(sphere)

    // Add ambient light for better visuals
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add directional light for subtle shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Add particles for a romantic effect
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 200
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      // Create a sphere of particles
      const angle1 = Math.random() * Math.PI * 2
      const angle2 = Math.random() * Math.PI
      const radius = 3 + Math.random() * 2 // Particles between radius 3-5

      posArray[i * 3] = Math.sin(angle2) * Math.cos(angle1) * radius
      posArray[i * 3 + 1] = Math.sin(angle2) * Math.sin(angle1) * radius
      posArray[i * 3 + 2] = Math.cos(angle2) * radius
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xfda4af, // Rose-300 color
      transparent: true,
      opacity: 0.5,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)
    particlesRef.current = particles

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Load images and place them around the sphere
    const textureLoader = new THREE.TextureLoader()
    const imageCount = images.length
    const imageObjects: THREE.Mesh[] = []
    const imageUrlMap = new Map<THREE.Mesh, string>()

    // 立即移除加载状态，不需要等待所有图片加载
    setIsLoading(false)

    // 创建一个临时的纯色材质作为图片加载前的占位符
    const placeholderMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    })

    images.forEach((imageUrl, index) => {
      // Use golden ratio for more even distribution
      const phi = Math.acos(-1 + (2 * index) / imageCount)
      const theta = Math.sqrt(imageCount * Math.PI) * phi

      // Calculate position on sphere
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      // 默认尺寸，后续会根据实际图片调整
      const planeWidth = 1.2
      const planeHeight = 0.9

      // 创建几何体和使用占位符材质创建网格
      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
      const plane = new THREE.Mesh(geometry, placeholderMaterial.clone())
      plane.position.set(x, y, z)

      // 添加一个帧
      const frameGeometry = new THREE.PlaneGeometry(planeWidth + 0.05, planeHeight + 0.05)
      const frameMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      })
      const frame = new THREE.Mesh(frameGeometry, frameMaterial)
      frame.position.set(x, y, z)

      // 朝向中心
      plane.lookAt(0, 0, 0)
      frame.lookAt(0, 0, 0)

      // 翻转使图片朝外
      plane.rotateY(Math.PI)
      frame.rotateY(Math.PI)

      // 帧稍微在图片后面
      frame.position.x *= 0.99
      frame.position.y *= 0.99
      frame.position.z *= 0.99

      scene.add(frame)
      scene.add(plane)
      imageObjects.push(plane)
      imageUrlMap.set(plane, imageUrl)

      // 懒加载图片 - 仅创建一个Image对象开始加载，但不阻塞渲染
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        // 图片加载完成后，替换材质
        const texture = textureLoader.load(imageUrl)

        // 计算正确的宽高比
        const aspectRatio = img.width / img.height
        const updatedHeight = planeWidth / aspectRatio

        // 更新平面的几何体以匹配图片比例
        if (Math.abs(updatedHeight - planeHeight) > 0.1) {
          // 如果高度变化明显，创建新的几何体
          const newGeometry = new THREE.PlaneGeometry(planeWidth, updatedHeight)
          plane.geometry.dispose()
          plane.geometry = newGeometry

          // 同时更新帧
          const newFrameGeometry = new THREE.PlaneGeometry(planeWidth + 0.05, updatedHeight + 0.05)
          frame.geometry.dispose()
          frame.geometry = newFrameGeometry
        }

        // 替换为实际图片材质，并使用淡入效果
        const imageMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
        })

        // 保存旧材质以便稍后释放
        const oldMaterial = plane.material as THREE.MeshBasicMaterial
        plane.material = imageMaterial

        // 淡入动画
        const fadeIn = () => {
          if (imageMaterial.opacity < 1) {
            imageMaterial.opacity += 0.05
            requestAnimationFrame(fadeIn)
          } else {
            // 材质完全显示后释放旧材质
            oldMaterial.dispose()
          }
        }

        // 开始淡入动画
        fadeIn()
      }

      // 开始加载图片
      img.src = imageUrl
    })

    // Handle click events
    const handleClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera)

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(imageObjects)

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object as THREE.Mesh
        const imageUrl = imageUrlMap.get(selectedObject)
        if (imageUrl) {
          setSelectedImage(imageUrl)
          if (controlsRef.current) {
            controlsRef.current.autoRotate = false
          }
        }
      }
    }

    renderer.domElement.addEventListener("click", handleClick)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()

      // Rotate particles slowly for a dreamy effect
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0005
      }

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      const newSize = Math.min(containerRef.current?.offsetWidth || size, size)
      camera.aspect = 1
      camera.updateProjectionMatrix()
      renderer.setSize(newSize, newSize)
    }
    window.addEventListener("resize", handleResize)
    handleResize()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.domElement.removeEventListener("click", handleClick)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      controls.dispose()
    }
  }, [images, size])

  const closeImage = () => {
    setSelectedImage(null)
    if (controlsRef.current) {
      controlsRef.current.autoRotate = true
    }
  }

  if (!size) {
    return null
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full aspect-square max-w-full mx-auto rounded-full bg-gradient-to-br from-rose-50 to-rose-100 p-2 shadow-lg"
        style={{ height: size, width: size }}
      />

      {/* 加载状态只显示球体初始化阶段，不等待所有图片 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm rounded-full">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={closeImage}
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
                onClick={closeImage}
                className="absolute -top-10 right-0 text-white hover:text-rose-300 transition-colors"
                aria-label="Close image"
              >
                <X size={24} />
              </button>
              <motion.img
                src={selectedImage || "/placeholder.svg"}
                alt="Selected photo"
                className="w-full h-full object-contain rounded-lg border-4 border-white shadow-2xl"
                layoutId={`image-${selectedImage}`}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}



export default memo(EnhancedGlobeGallery)