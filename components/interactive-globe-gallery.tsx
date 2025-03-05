"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface InteractiveGlobeGalleryProps {
  images: string[]
  size?: number
}

export default function InteractiveGlobeGallery({ images, size = 300 }: InteractiveGlobeGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

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
    controls.autoRotateSpeed = 1

    // Create a sphere geometry
    const radius = 2
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32)
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    scene.add(sphere)

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Load images and place them around the sphere
    const textureLoader = new THREE.TextureLoader()
    const imageCount = images.length
    const imageObjects: THREE.Mesh[] = []
    const imageUrlMap = new Map<THREE.Mesh, string>()

    let loadedCount = 0

    images.forEach((imageUrl, index) => {
      const phi = Math.acos(-1 + (2 * index) / imageCount)
      const theta = Math.sqrt(imageCount * Math.PI) * phi

      // Calculate position on sphere
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      // Create image plane
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = imageUrl
      img.onload = () => {
        const texture = textureLoader.load(imageUrl)

        // Calculate aspect ratio
        const aspectRatio = img.width / img.height
        const planeWidth = 0.8
        const planeHeight = planeWidth / aspectRatio

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        })

        const plane = new THREE.Mesh(geometry, material)
        plane.position.set(x, y, z)

        // Make plane face outward from center of sphere
        plane.lookAt(0, 0, 0)
        // Flip it so image faces outward
        plane.rotateY(Math.PI)

        scene.add(plane)
        imageObjects.push(plane)
        imageUrlMap.set(plane, imageUrl)

        loadedCount++
        if (loadedCount === imageCount) {
          setIsLoading(false)
        }
      }
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

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full aspect-square max-w-full mx-auto"
        style={{ height: size, width: size }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm rounded-lg">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={closeImage}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
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
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Selected photo"
                className="w-full h-full object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

