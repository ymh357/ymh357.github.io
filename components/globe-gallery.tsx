"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface GlobeGalleryProps {
  images: string[]
  size?: number
}

export default function GlobeGallery({ images, size = 300 }: GlobeGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

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

    // Load images and place them around the sphere
    const textureLoader = new THREE.TextureLoader()
    const imageCount = images.length
    const imageObjects: THREE.Mesh[] = []

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

        loadedCount++
        if (loadedCount === imageCount) {
          setIsLoading(false)
        }
      }
    })

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
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      controls.dispose()
    }
  }, [images, size])

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
    </div>
  )
}

