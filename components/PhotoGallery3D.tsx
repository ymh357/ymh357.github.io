"use client"

import type React from 'react';
import {
  useEffect,
  useMemo,
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
    thumbnail: string // Compressed image URL
    fullsize: string // High-resolution image URL
  }[]
  size?: number
}

export default function PhotoGallery3D({ images, size = 400 }: PhotoGallery3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isFullsizeLoading, setIsFullsizeLoading] = useState(false)

  // Use refs to store Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Store photo objects and their mappings
  const photoObjectsRef = useRef<THREE.Mesh[]>([])
  const photoUrlMapRef = useRef<Map<THREE.Mesh, string>>(new Map())

  // Track loaded and loading images
  const loadedImagesRef = useRef<Set<string>>(new Set())
  const loadingImagesRef = useRef<Set<string>>(new Set())

  // Add a throttling mechanism ref
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Track if component is mounted
  const isMountedRef = useRef<boolean>(true)

  // Store resources for proper cleanup
  const resourcesRef = useRef<{
    geometries: THREE.BufferGeometry[]
    materials: THREE.Material[]
    textures: THREE.Texture[]
  }>({
    geometries: [],
    materials: [],
    textures: [],
  })

  // Constants - reduce MAX_CONCURRENT_LOADS for mobile
  const MAX_CONCURRENT_LOADS = useMemo(() => {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      typeof navigator !== 'undefined' ? navigator.userAgent : ''
    )
    return isMobile ? 1 : 2
  }, [])

  // Lower geometry detail for mobile
  const GEOMETRY_DETAIL = useMemo(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      typeof navigator !== 'undefined' ? navigator.userAgent : ''
    )
    return isMobile ? { sphere: [8, 8], plane: [1, 1] } : { sphere: [16, 16], plane: [1, 1] }
  }, [])

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Set mounted ref
    isMountedRef.current = true

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera with proper aspect ratio
    const aspect = 1 // Square container
    const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000)
    camera.position.z = 15
    cameraRef.current = camera

    // Detect if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    // Create renderer with optimized settings
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile, // Disable antialiasing on mobile
      alpha: true,
      powerPreference: "high-performance",
      // Add willReadFrequently attribute to fix the warning
      canvas: document.createElement('canvas'),
    })

    // Set willReadFrequently attribute to fix the warning
    if (renderer.domElement.getContext) {
      const ctx = renderer.domElement.getContext('2d')
      if (ctx && ('willReadFrequently' in ctx)) {
        // @ts-ignore - TypeScript doesn't know about willReadFrequently
        renderer.domElement.getContext('2d', { willReadFrequently: true })
      }
    }

    // Set lower pixel ratio for mobile
    const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pixelRatio)

    // Set size based on container
    const containerSize = Math.min(containerRef.current.offsetWidth, size)
    renderer.setSize(containerSize, containerSize)
    renderer.setClearColor(0x000000, 0)

    // Add dispose cleanup
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create controls with optimized settings
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.enableZoom = true
    controls.autoRotate = true
    controls.autoRotateSpeed = isMobile ? 0.3 : 0.5  // Slower rotation on mobile
    controlsRef.current = controls

    // Create a simple background with fewer segments on mobile
    const [segX, segY] = GEOMETRY_DETAIL.sphere
    const bgGeometry = new THREE.SphereGeometry(30, segX, segY)
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.1,
    })

    // Store resources for cleanup
    resourcesRef.current.geometries.push(bgGeometry)
    resourcesRef.current.materials.push(bgMaterial)

    const background = new THREE.Mesh(bgGeometry, bgMaterial)
    scene.add(background)

    // Initialization complete
    setIsInitializing(false)

    // Lower the frame rate on mobile
    const frameInterval = isMobile ? 2 : 1 // Run at half FPS on mobile
    let frameCount = 0

    // Animation loop with proper cleanup and throttling for mobile
    const animate = () => {
      if (!isMountedRef.current || !controlsRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return

      // Skip frames on mobile for better performance
      frameCount++
      if (frameCount % frameInterval === 0 || !isMobile) {
        controlsRef.current.update()
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    // Handle window resize
    const handleResize = () => {
      if (!isMountedRef.current || !containerRef.current || !cameraRef.current || !rendererRef.current) return

      const newSize = Math.min(containerRef.current.offsetWidth, size)
      cameraRef.current.aspect = 1
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(newSize, newSize)
    }

    // Throttle resize events
    let resizeTimeout: NodeJS.Timeout
    const throttledResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 100)
    }

    window.addEventListener("resize", throttledResize)

    // Cleanup function
    return () => {
      // Mark component as unmounted
      isMountedRef.current = false

      window.removeEventListener("resize", throttledResize)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      // Clear any pending throttle timers
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current)
        throttleTimerRef.current = null
      }

      if (containerRef.current && rendererRef.current?.domElement) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      // Dispose all resources
      resourcesRef.current.geometries.forEach((geometry) => geometry.dispose())
      resourcesRef.current.materials.forEach((material) => material.dispose())
      resourcesRef.current.textures.forEach((texture) => texture.dispose())

      // Clear arrays
      resourcesRef.current.geometries = []
      resourcesRef.current.materials = []
      resourcesRef.current.textures = []

      // Dispose controls and renderer
      controlsRef.current?.dispose()
      controlsRef.current = null

      rendererRef.current?.dispose()
      rendererRef.current?.forceContextLoss()
      rendererRef.current = null

      // Clear scene
      sceneRef.current?.clear()
      sceneRef.current = null

      // Clear references
      photoObjectsRef.current = []
      photoUrlMapRef.current.clear()
      loadedImagesRef.current.clear()
      loadingImagesRef.current.clear()

      // Clear camera
      cameraRef.current = null
    }
  }, [size, GEOMETRY_DETAIL])

  // Create photo object function - with optimizations
  const createPhotoObject = (
    url: string,
    texture: THREE.Texture,
    position: THREE.Vector3,
    rotation: THREE.Euler,
    aspectRatio: number,
  ) => {
    if (!sceneRef.current || !isMountedRef.current) return null

    const width = 3
    const height = width / aspectRatio

    // Create photo geometry - using simplified geometry from constants
    const [segX, segY] = GEOMETRY_DETAIL.plane
    const photoGeometry = new THREE.PlaneGeometry(width, height, segX, segY)

    // Create photo material - with optimized settings
    const photoMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    })

    // Create photo mesh
    const photo = new THREE.Mesh(photoGeometry, photoMaterial)
    photo.position.copy(position)
    photo.rotation.copy(rotation)
    photo.rotation.z += Math.PI
    photo.renderOrder = 1

    // Create frame with simplified geometry
    const frameGeometry = new THREE.PlaneGeometry(width + 0.1, height + 0.1, segX, segY)
    const frameMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    })

    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    frame.position.copy(position)
    frame.position.z -= 0.01
    frame.rotation.copy(rotation)
    frame.rotation.z += Math.PI
    frame.renderOrder = 0

    // Add to scene
    sceneRef.current.add(frame)
    sceneRef.current.add(photo)

    // Track objects
    photoObjectsRef.current.push(photo)
    photoUrlMapRef.current.set(photo, url)

    // Store resources for cleanup
    resourcesRef.current.geometries.push(photoGeometry, frameGeometry)
    resourcesRef.current.materials.push(photoMaterial, frameMaterial)
    resourcesRef.current.textures.push(texture)

    // Detect mobile for slower fade in
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      typeof navigator !== 'undefined' ? navigator.userAgent : ''
    )

    // Fade in animation with optimized approach - slower on mobile
    let opacity = 0
    const fadeInSpeed = isMobile ? 0.03 : 0.05
    const fadeInInterval = isMobile ? 80 : 50

    const fadeIn = () => {
      if (!isMountedRef.current) return

      opacity += fadeInSpeed
      photoMaterial.opacity = Math.min(opacity, 1)

      if (photoMaterial.opacity < 1) {
        setTimeout(fadeIn, fadeInInterval)
      }
    }

    fadeIn()

    return photo
  }

  // Create positions with a memoized approach to reduce calculations
  const positions = useMemo(() => {
    return images.map((_, index) => {
      // Use golden spiral distribution for even spacing
      const phi = Math.acos(-1 + (2 * index) / images.length)
      const theta = Math.sqrt(images.length * Math.PI) * phi

      // Use fixed radius to reduce calculations
      const radius = 10

      // Calculate 3D coordinates
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      return new THREE.Vector3(x, y, z)
    })
  }, [images.length])

  // Create random rotation with limited angles
  const createRandomRotation = () => {
    // Use smaller rotation angles
    const rotX = (Math.random() - 0.5) * 0.1
    const rotY = (Math.random() - 0.5) * 0.1
    const rotZ = (Math.random() - 0.5) * 0.1

    return new THREE.Euler(rotX, rotY, rotZ)
  }

  // Optimized texture loader with shared instance
  const textureLoader = useMemo(() => new THREE.TextureLoader(), [])

  // Load image function with optimized texture loading
  const loadImage = (imageData: (typeof images)[0], index: number) => {
    if (!isMountedRef.current) return

    const { thumbnail } = imageData

    // Skip if already loaded or loading
    if (loadedImagesRef.current.has(thumbnail) || loadingImagesRef.current.has(thumbnail)) {
      return
    }

    // Mark as loading
    loadingImagesRef.current.add(thumbnail)

    // Use ImageBitmap for better performance on modern browsers if available
    if ('createImageBitmap' in window) {
      fetch(thumbnail)
        .then(response => response.blob())
        .then(blob => {
          if (!isMountedRef.current) return
          return createImageBitmap(blob)
        })
        .then(imageBitmap => {
          if (!isMountedRef.current || !imageBitmap) return

          // Get aspect ratio
          const aspectRatio = imageBitmap.width / imageBitmap.height

          // Create texture
          const texture = new THREE.Texture()
          texture.image = imageBitmap
          texture.needsUpdate = true

          // Apply texture optimization
          texture.minFilter = THREE.LinearFilter
          texture.generateMipmaps = false

          // Create photo object
          const position = positions[index]
          const rotation = createRandomRotation()
          createPhotoObject(thumbnail, texture, position, rotation, aspectRatio)

          // Mark as loaded
          loadedImagesRef.current.add(thumbnail)
          loadingImagesRef.current.delete(thumbnail)

          // Check for more images to load
          checkAndLoadMoreImages()
        })
        .catch(() => {
          // Fallback to traditional loading on error
          loadingImagesRef.current.delete(thumbnail)
          loadImageTraditional(imageData, index)
        })
    } else {
      // Fallback for browsers without createImageBitmap
      loadImageTraditional(imageData, index)
    }
  }

  // Traditional image loading as fallback
  const loadImageTraditional = (imageData: (typeof images)[0], index: number) => {
    if (!isMountedRef.current) return

    const { thumbnail } = imageData

    // Skip if already loaded or loading
    if (loadedImagesRef.current.has(thumbnail) || loadingImagesRef.current.has(thumbnail)) {
      return
    }

    // Mark as loading
    loadingImagesRef.current.add(thumbnail)

    // Create image to get aspect ratio
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      if (!isMountedRef.current) return

      // Get aspect ratio
      const aspectRatio = img.width / img.height

      // Load texture
      textureLoader.load(
        thumbnail,
        (texture) => {
          if (!isMountedRef.current) return

          // Apply texture optimization
          texture.minFilter = THREE.LinearFilter
          texture.generateMipmaps = false

          // Create photo object
          const position = positions[index]
          const rotation = createRandomRotation()
          createPhotoObject(thumbnail, texture, position, rotation, aspectRatio)

          // Mark as loaded
          loadedImagesRef.current.add(thumbnail)
          loadingImagesRef.current.delete(thumbnail)

          // Check for more images to load
          checkAndLoadMoreImages()
        },
        undefined,
        () => {
          // Handle load error
          if (!isMountedRef.current) return
          loadingImagesRef.current.delete(thumbnail)
          checkAndLoadMoreImages()
        },
      )
    }

    img.onerror = () => {
      // Handle error
      if (!isMountedRef.current) return
      loadingImagesRef.current.delete(thumbnail)
      checkAndLoadMoreImages()
    }

    img.src = thumbnail
  }

  // Optimized frustum checking
  const frustum = useMemo(() => new THREE.Frustum(), [])
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), [])

  // Check if position is in view frustum
  const isInViewFrustum = (position: THREE.Vector3) => {
    if (!cameraRef.current || !isMountedRef.current) return false

    projScreenMatrix.multiplyMatrices(
      cameraRef.current.projectionMatrix,
      cameraRef.current.matrixWorldInverse
    )

    frustum.setFromProjectionMatrix(projScreenMatrix)
    return frustum.containsPoint(position)
  }

  // Check and load more images with throttling
  const checkAndLoadMoreImages = () => {
    if (!isMountedRef.current) return

    // Don't run if throttled
    if (throttleTimerRef.current) return

    // Set throttle
    throttleTimerRef.current = setTimeout(() => {
      throttleTimerRef.current = null
    }, 500)

    // Limit concurrent loads
    if (loadingImagesRef.current.size >= MAX_CONCURRENT_LOADS) return

    // Find visible unloaded images
    const visibleUnloadedImages = images
      .filter((img, index) => {
        // Skip if already loaded or loading
        if (loadedImagesRef.current.has(img.thumbnail) || loadingImagesRef.current.has(img.thumbnail)) {
          return false
        }

        // Use pre-calculated position
        const position = positions[index]

        // Check if in view
        return isInViewFrustum(position)
      })
      .slice(0, 1) // Load just one at a time for better performance

    // If no visible images, load any unloaded image
    if (visibleUnloadedImages.length === 0) {
      const unloadedImages = images
        .filter((img) => !loadedImagesRef.current.has(img.thumbnail) && !loadingImagesRef.current.has(img.thumbnail))
        .slice(0, 1)

      unloadedImages.forEach((img) => {
        const originalIndex = images.findIndex((image) => image.thumbnail === img.thumbnail)
        loadImage(img, originalIndex)
      })
    } else {
      // Load visible images
      visibleUnloadedImages.forEach((img) => {
        const originalIndex = images.findIndex((image) => image.thumbnail === img.thumbnail)
        loadImage(img, originalIndex)
      })
    }
  }

  // Memoize raycaster to avoid recreating
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const mouse = useMemo(() => new THREE.Vector2(), [])

  // Handle click with optimized raycasting
  const handleClick = (event: React.MouseEvent) => {
    if (!rendererRef.current || !cameraRef.current || !isMountedRef.current) return

    // Calculate mouse position
    const rect = rendererRef.current.domElement.getBoundingClientRect()
    mouse.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    )

    // Update raycaster
    raycaster.setFromCamera(mouse, cameraRef.current)

    // Check for intersections
    const intersects = raycaster.intersectObjects(photoObjectsRef.current)

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object as THREE.Mesh
      const thumbnailUrl = photoUrlMapRef.current.get(selectedObject)

      if (thumbnailUrl) {
        // Find corresponding fullsize image
        const imageData = images.find((img) => img.thumbnail === thumbnailUrl)
        if (imageData) {
          setIsFullsizeLoading(true)
          setSelectedImage(imageData.fullsize)

          // Stop auto-rotation
          if (controlsRef.current) {
            controlsRef.current.autoRotate = false
          }
        }
      }
    }
  }

  // Close fullsize image
  const closeFullsizeImage = () => {
    setSelectedImage(null)
    setIsFullsizeLoading(false)

    // Resume auto-rotation
    if (controlsRef.current && isMountedRef.current) {
      controlsRef.current.autoRotate = true
    }
  }

  // Load initial images with reduced timers for mobile
  useEffect(() => {
    if (!isInitializing && images.length > 0 && isMountedRef.current) {
      // Detect mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )

      // Load just one image initially for faster startup
      if (images.length > 0) {
        loadImage(images[0], 0)
      }

      // Add control change listener with throttling
      let timeout: NodeJS.Timeout
      const handleControlChange = () => {
        if (!isMountedRef.current) return

        clearTimeout(timeout)
        timeout = setTimeout(() => {
          checkAndLoadMoreImages()
        }, isMobile ? 500 : 300) // More throttling on mobile
      }

      if (controlsRef.current) {
        controlsRef.current.addEventListener("change", handleControlChange)
      }

      // Set a timer to load more images gradually - longer interval for mobile
      const loadInterval = isMobile ? 3000 : 2000
      const loadMoreTimer = setInterval(() => {
        if (!isMountedRef.current) return

        checkAndLoadMoreImages()

        // Stop timer if all images are loaded
        if (loadedImagesRef.current.size >= images.length) {
          clearInterval(loadMoreTimer)
        }
      }, loadInterval)

      return () => {
        clearTimeout(timeout)
        clearInterval(loadMoreTimer)

        if (controlsRef.current) {
          controlsRef.current.removeEventListener("change", handleControlChange)
        }
      }
    }
  }, [isInitializing, images, positions])

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
          <div className="text-sm text-rose-600">Initializing...</div>
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
                alt="High-resolution photo"
                loading="lazy"
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