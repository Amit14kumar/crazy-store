import { useRef, useState, useEffect } from 'react'
import { useGesture } from '@use-gesture/react'
import './DomeGallery.css'

interface DomeGalleryProps {
  images: { src: string; alt?: string }[]
  containerHeight?: string
  autoRotate?: boolean
  autoRotateSpeed?: number
  faceSize?: number
  fov?: number
  onFaceClick?: () => void
}

interface FaceData {
  src: string
  alt: string
  rotX: number
  rotY: number
}

function buildSphere(images: { src: string; alt?: string }[], fov: number): FaceData[] {
  const total = images.length
  if (total === 0) return []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  return images.map((img, i) => {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / total)
    const phi = goldenAngle * i
    return {
      src: img.src,
      alt: img.alt ?? `Gallery ${i + 1}`,
      rotX: (theta * 180) / Math.PI - 90,
      rotY: (phi * 180) / Math.PI,
    }
  })
}

export default function DomeGallery({
  images,
  containerHeight = '60vh',
  autoRotate = true,
  autoRotateSpeed = 0.15,
  faceSize = 160,
  fov = 380,
  onFaceClick,
}: DomeGalleryProps) {
  const [rotX, setRotX] = useState(-15)
  const [rotY, setRotY] = useState(0)
  const isActualDrag = useRef(false)
  const dragPaused = useRef(false)
  const animRef = useRef<number>(0)

  const faces = buildSphere(images, fov)

  // Auto-rotate — pauses while dragging
  useEffect(() => {
    const tick = () => {
      if (!dragPaused.current) {
        setRotY(prev => prev + autoRotateSpeed)
      }
      animRef.current = requestAnimationFrame(tick)
    }
    if (autoRotate) animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [autoRotate, autoRotateSpeed])

  const bind = useGesture({
    onDragStart: () => {
      isActualDrag.current = false
      dragPaused.current = true
    },
    onDrag: ({ movement: [mx, my], delta: [dx, dy] }) => {
      if (Math.abs(mx) > 6 || Math.abs(my) > 6) {
        isActualDrag.current = true
      }
      setRotY(prev => prev + dx * 0.4)
      setRotX(prev => Math.max(-50, Math.min(25, prev - dy * 0.4)))
    },
    onDragEnd: () => {
      setTimeout(() => { dragPaused.current = false }, 80)
    },
  })

  const handleFacePointerUp = () => {
    if (!isActualDrag.current && onFaceClick) {
      onFaceClick()
    }
  }

  return (
    <div className="dg-container" style={{ height: containerHeight }}>
      <div {...bind()} style={{ width: '100%', height: '100%', position: 'relative', touchAction: 'none', transformStyle: 'preserve-3d' }}>
        <div
          className="dg-sphere"
          style={{
            width: `${faceSize}px`,
            height: `${faceSize}px`,
            transform: `translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {faces.map((face, i) => (
            <div
              key={i}
              className="dg-sphere-face"
              style={{
                width: `${faceSize}px`,
                height: `${faceSize}px`,
                transform: `rotateX(${face.rotX}deg) rotateY(${face.rotY}deg) translateZ(${fov}px)`,
                cursor: onFaceClick ? 'pointer' : 'default',
              }}
              onPointerUp={handleFacePointerUp}
            >
              {face.src
                ? <img src={face.src} alt={face.alt} loading="lazy" draggable={false} />
                : <div className="dg-sphere-face-empty" aria-label={face.alt} />
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
