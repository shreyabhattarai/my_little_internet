"use client"

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import styles from "./RoomCanvas.module.css"
import SpeakerOverlay from "./Speaker/SpeakerOverlay"
import ComputerOverlay from "./Computer/ComputerOverlay"
import ArcadeModal from "./Gaming/ArcadeModal"
import {
  BACK_TO_ROOM_LABEL,
  clamp,
  computeCameraShift,
  FOCUS_EASING,
  FOCUS_TARGET_CENTER,
  FOCUS_TRANSITION_MS,
  getZoneCenter,
  resolveBackToRoomButtonStyle,
  resolveOverlayAnchorStyle
} from "@/lib/cameraFocus"
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  MOVE_SPEED,
  ZONES,
  ROOM_DECOR,
  PHOTO_FRAME_VIEWPORT,
  TIME_TINTS,
  WINDOW_VIEWS,
  WINDOW_VIEWPORT
} from "@/lib/worldConfig"

// Character size used for drawing and collision checks
const CHAR_SIZE = 28

const IMAGE_SOURCES = {
  room: "/images/assets/room.png",
  desk: "/images/assets/desk.png",
  computer: "/images/assets/computer.png",
  bookshelf: "/images/assets/bookshelf.png",
  // Future addition:
  // bed: "/images/assets/bed.png",
  // wardrobe: "/images/assets/wardrobe.png",
  chair: "/images/assets/chair.png",
  plant: "/images/assets/plant.png",
  cat: "/images/assets/cat.png",
  arcade: "/images/assets/console.png",
  speaker: "/images/assets/radio.png",
  photoFrame: "/images/assets/photo_frame.png",
  windowFrame: "/images/assets/window_frame.png"
}

// Future addition:
// const PLACEHOLDER_ZONE_IDS = new Set(["counter", "drawer", "brainrot"])
const PLACEHOLDER_ZONE_IDS = new Set([])

const DECOR = ROOM_DECOR.map((item) => ({
  ...item,
  src: IMAGE_SOURCES[item.id]
}))

const SPEAKER_ZONE_ID = "musicArea"
const COMPUTER_ZONE_ID = "computer"
const PHOTO_FRAME_ZONE_ID = "photoFrame"
const ARCADE_ZONE_ID = "arcade"
const DESK_ZONE_ID = "desk"
const SPEAKER_FOCUS_SCALE = 2.1
const COMPUTER_FOCUS_SCALE = 3.15
const ARCADE_FOCUS_SCALE = 2.65
const PHOTO_FRAME_FOCUS_SCALE = 2.45
const MOBILE_ROTATE_MAX_WIDTH = 599
const CAMERA_PAN_SPEED = MOVE_SPEED
const PHOTO_FRAME_DISPLAY_SRC = "/images/family/bro_sis.jpg"

// zoom floor applied to every device so there is always room to pan or parallax
const MIN_ZOOM_ALL_DEVICES = 1.06
// how far the pointer can nudge the camera, in world pixels, kept small on purpose
const POINTER_PARALLAX_STRENGTH = 46
// smoothing factor for parallax easing, lower is smoother and slower
const PARALLAX_LERP = 0.12

function getDeviceZoom(width, height) {
  if (width > 1366) return MIN_ZOOM_ALL_DEVICES

  // Compute zoom from room-to-screen ratios and stop once either axis is matched.
  const zoomToMatchAxis = Math.min(WORLD_WIDTH / width, WORLD_HEIGHT / height)
  return clamp(zoomToMatchAxis, MIN_ZOOM_ALL_DEVICES, 1.24)
}

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

function drawImageCover(ctx, image, dx, dy, dWidth, dHeight) {
  const srcW = image.width
  const srcH = image.height
  if (!srcW || !srcH) return

  const srcRatio = srcW / srcH
  const destRatio = dWidth / dHeight

  let sx = 0
  let sy = 0
  let sWidth = srcW
  let sHeight = srcH

  if (srcRatio > destRatio) {
    sWidth = srcH * destRatio
    sx = (srcW - sWidth) / 2
  } else if (srcRatio < destRatio) {
    sHeight = srcW / destRatio
    sy = (srcH - sHeight) / 2
  }

  ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
}

function pointInZone(x, y, zone) {
  return x >= zone.x && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height
}

function hasFocusedComponent({
  speakerFocused,
  speakerClosing,
  computerFocused,
  computerClosing,
  photoFrameFocused,
  photoFrameClosing,
  arcadeFocused,
  arcadeClosing
}) {
  return (
    speakerFocused ||
    speakerClosing ||
    computerFocused ||
    computerClosing ||
    photoFrameFocused ||
    photoFrameClosing ||
    arcadeFocused ||
    arcadeClosing
  )
}

export default function RoomCanvas({ onZoneModal, onZoneUseless, period = "day", reducedMotion }) {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const stageRef = useRef(null)
  const posRef = useRef({ x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 })
  const hasInteractedRef = useRef(false)
  const dragRef = useRef({ active: false, moved: false, pointerId: null, lastX: 0, lastY: 0 })
  const pointerParallaxRef = useRef({ x: 0, y: 0 })
  const pointerParallaxTargetRef = useRef({ x: 0, y: 0 })
  const speakerCloseTimerRef = useRef(null)
  const computerCloseTimerRef = useRef(null)
  const photoFrameCloseTimerRef = useRef(null)
  const arcadeCloseTimerRef = useRef(null)
  const focusReturnRef = useRef({ x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 })
  const keysRef = useRef({})
  const imagesRef = useRef({})
  // bump this to force a re-render when camera position changes outside react state
  const [, forceRender] = useReducer((n) => n + 1, 0)
  const [speakerFocused, setSpeakerFocused] = useState(false)
  const [showSpeakerOverlay, setShowSpeakerOverlay] = useState(false)
  const [speakerClosing, setSpeakerClosing] = useState(false)
  const [computerFocused, setComputerFocused] = useState(false)
  const [showComputerOverlay, setShowComputerOverlay] = useState(false)
  const [computerClosing, setComputerClosing] = useState(false)
  const [photoFrameFocused, setPhotoFrameFocused] = useState(false)
  const [photoFrameClosing, setPhotoFrameClosing] = useState(false)
  const [arcadeFocused, setArcadeFocused] = useState(false)
  const [showArcadeOverlay, setShowArcadeOverlay] = useState(false)
  const [arcadeClosing, setArcadeClosing] = useState(false)
  const [viewportSize, setViewportSize] = useState({ width: WORLD_WIDTH, height: WORLD_HEIGHT })
  const [screenSize, setScreenSize] = useState({ width: WORLD_WIDTH, height: WORLD_HEIGHT })

  const speakerZone = ZONES.find((zone) => zone.id === SPEAKER_ZONE_ID)
  const computerZone = ZONES.find((zone) => zone.id === COMPUTER_ZONE_ID)
  const photoFrameZone = ZONES.find((zone) => zone.id === PHOTO_FRAME_ZONE_ID)
  const arcadeZone = ZONES.find((zone) => zone.id === ARCADE_ZONE_ID)
  const deskZone = ZONES.find((zone) => zone.id === DESK_ZONE_ID)
  const deskCenter = useMemo(
    () =>
      deskZone
        ? {
            x: deskZone.x + deskZone.width / 2,
            y: deskZone.y + deskZone.height / 2
          }
        : { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 },
    [deskZone]
  )

  useEffect(() => {
    if (!hasInteractedRef.current) {
      posRef.current = { ...deskCenter }
    }
  }, [deskCenter])

  const triggerZone = useCallback(
    (zone) => {
      if (zone.id === SPEAKER_ZONE_ID) {
        if (photoFrameCloseTimerRef.current) {
          clearTimeout(photoFrameCloseTimerRef.current)
          photoFrameCloseTimerRef.current = null
        }
        if (speakerCloseTimerRef.current) {
          clearTimeout(speakerCloseTimerRef.current)
          speakerCloseTimerRef.current = null
        }
        if (computerCloseTimerRef.current) {
          clearTimeout(computerCloseTimerRef.current)
          computerCloseTimerRef.current = null
        }
        focusReturnRef.current = { ...posRef.current }
        setComputerFocused(false)
        setShowComputerOverlay(false)
        setComputerClosing(false)
        setPhotoFrameFocused(false)
        setPhotoFrameClosing(false)
        setSpeakerClosing(false)
        setSpeakerFocused(true)
        return
      }
      if (zone.id === COMPUTER_ZONE_ID) {
        if (photoFrameCloseTimerRef.current) {
          clearTimeout(photoFrameCloseTimerRef.current)
          photoFrameCloseTimerRef.current = null
        }
        if (computerCloseTimerRef.current) {
          clearTimeout(computerCloseTimerRef.current)
          computerCloseTimerRef.current = null
        }
        if (speakerCloseTimerRef.current) {
          clearTimeout(speakerCloseTimerRef.current)
          speakerCloseTimerRef.current = null
        }
        focusReturnRef.current = { ...posRef.current }
        setSpeakerFocused(false)
        setShowSpeakerOverlay(false)
        setSpeakerClosing(false)
        setComputerClosing(false)
        setShowComputerOverlay(false)
        setPhotoFrameFocused(false)
        setPhotoFrameClosing(false)
        setComputerFocused(true)
        return
      }
      if (zone.id === PHOTO_FRAME_ZONE_ID) {
        if (speakerCloseTimerRef.current) {
          clearTimeout(speakerCloseTimerRef.current)
          speakerCloseTimerRef.current = null
        }
        if (computerCloseTimerRef.current) {
          clearTimeout(computerCloseTimerRef.current)
          computerCloseTimerRef.current = null
        }
        if (arcadeCloseTimerRef.current) {
          clearTimeout(arcadeCloseTimerRef.current)
          arcadeCloseTimerRef.current = null
        }
        if (photoFrameCloseTimerRef.current) {
          clearTimeout(photoFrameCloseTimerRef.current)
          photoFrameCloseTimerRef.current = null
        }

        focusReturnRef.current = { ...posRef.current }
        setSpeakerFocused(false)
        setShowSpeakerOverlay(false)
        setSpeakerClosing(false)
        setComputerFocused(false)
        setShowComputerOverlay(false)
        setComputerClosing(false)
        setArcadeFocused(false)
        setShowArcadeOverlay(false)
        setArcadeClosing(false)
        setPhotoFrameClosing(false)
        setPhotoFrameFocused(true)
        return
      }
      if (zone.id === ARCADE_ZONE_ID) {
        if (speakerCloseTimerRef.current) {
          clearTimeout(speakerCloseTimerRef.current)
          speakerCloseTimerRef.current = null
        }
        if (computerCloseTimerRef.current) {
          clearTimeout(computerCloseTimerRef.current)
          computerCloseTimerRef.current = null
        }
        if (photoFrameCloseTimerRef.current) {
          clearTimeout(photoFrameCloseTimerRef.current)
          photoFrameCloseTimerRef.current = null
        }
        if (arcadeCloseTimerRef.current) {
          clearTimeout(arcadeCloseTimerRef.current)
          arcadeCloseTimerRef.current = null
        }

        focusReturnRef.current = { ...posRef.current }

        setSpeakerFocused(false)
        setShowSpeakerOverlay(false)
        setSpeakerClosing(false)
        setComputerFocused(false)
        setShowComputerOverlay(false)
        setComputerClosing(false)
        setPhotoFrameFocused(false)
        setPhotoFrameClosing(false)
        setArcadeClosing(false)
        setArcadeFocused(true)
        return
      }
      if (zone.type === "modal") {
        onZoneModal(zone.modal)
      } else if (zone.type === "useless") {
        onZoneUseless(zone.uselessId)
      }
    },
    [onZoneModal, onZoneUseless]
  )

  const closeSpeakerFocus = useCallback(() => {
    if (speakerCloseTimerRef.current) {
      clearTimeout(speakerCloseTimerRef.current)
      speakerCloseTimerRef.current = null
    }

    if (reducedMotion) {
      posRef.current = { ...focusReturnRef.current }
      setShowSpeakerOverlay(false)
      setSpeakerClosing(false)
      setSpeakerFocused(false)
      return
    }

    setSpeakerClosing(true)
    setSpeakerFocused(false)
    speakerCloseTimerRef.current = setTimeout(() => {
      posRef.current = { ...focusReturnRef.current }
      setShowSpeakerOverlay(false)
      setSpeakerClosing(false)
      speakerCloseTimerRef.current = null
    }, FOCUS_TRANSITION_MS)
  }, [reducedMotion])

  const closeComputerFocus = useCallback(() => {
    if (computerCloseTimerRef.current) {
      clearTimeout(computerCloseTimerRef.current)
      computerCloseTimerRef.current = null
    }

    if (reducedMotion) {
      posRef.current = { ...focusReturnRef.current }
      setShowComputerOverlay(false)
      setComputerClosing(false)
      setComputerFocused(false)
      return
    }

    setComputerClosing(true)
    setComputerFocused(false)
    computerCloseTimerRef.current = setTimeout(() => {
      posRef.current = { ...focusReturnRef.current }
      setShowComputerOverlay(false)
      setComputerClosing(false)
      computerCloseTimerRef.current = null
    }, FOCUS_TRANSITION_MS)
  }, [reducedMotion])

  const closePhotoFrameFocus = useCallback(() => {
    if (photoFrameCloseTimerRef.current) {
      clearTimeout(photoFrameCloseTimerRef.current)
      photoFrameCloseTimerRef.current = null
    }

    if (reducedMotion) {
      posRef.current = { ...focusReturnRef.current }
      setPhotoFrameClosing(false)
      setPhotoFrameFocused(false)
      return
    }

    setPhotoFrameClosing(true)
    setPhotoFrameFocused(false)
    photoFrameCloseTimerRef.current = setTimeout(() => {
      posRef.current = { ...focusReturnRef.current }
      setPhotoFrameClosing(false)
      photoFrameCloseTimerRef.current = null
    }, FOCUS_TRANSITION_MS)
  }, [reducedMotion])

  const closeArcadeFocus = useCallback(() => {
    if (arcadeCloseTimerRef.current) {
      clearTimeout(arcadeCloseTimerRef.current)
      arcadeCloseTimerRef.current = null
    }

    if (reducedMotion) {
      posRef.current = { ...focusReturnRef.current }
      setShowArcadeOverlay(false)
      setArcadeClosing(false)
      setArcadeFocused(false)
      return
    }

    setArcadeClosing(true)
    setArcadeFocused(false)
    arcadeCloseTimerRef.current = setTimeout(() => {
      posRef.current = { ...focusReturnRef.current }
      setShowArcadeOverlay(false)
      setArcadeClosing(false)
      arcadeCloseTimerRef.current = null
    }, FOCUS_TRANSITION_MS)
  }, [reducedMotion])

  useEffect(() => {
    return () => {
      if (speakerCloseTimerRef.current) {
        clearTimeout(speakerCloseTimerRef.current)
      }
      if (computerCloseTimerRef.current) {
        clearTimeout(computerCloseTimerRef.current)
      }
      if (photoFrameCloseTimerRef.current) {
        clearTimeout(photoFrameCloseTimerRef.current)
      }
      if (arcadeCloseTimerRef.current) {
        clearTimeout(arcadeCloseTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!speakerFocused) return

    setSpeakerClosing(false)

    const timeout = setTimeout(() => {
      setShowSpeakerOverlay(true)
    }, reducedMotion ? 0 : FOCUS_TRANSITION_MS - 90)

    return () => clearTimeout(timeout)
  }, [speakerFocused, reducedMotion])

  useEffect(() => {
    if (!computerFocused) return

    const timeout = setTimeout(() => {
      setShowComputerOverlay(true)
    }, reducedMotion ? 0 : FOCUS_TRANSITION_MS - 60)

    return () => clearTimeout(timeout)
  }, [computerFocused, reducedMotion])

  useEffect(() => {
    if (!arcadeFocused) return

    const timeout = setTimeout(() => {
      setShowArcadeOverlay(true)
    }, reducedMotion ? 0 : FOCUS_TRANSITION_MS - 60)

    return () => clearTimeout(timeout)
  }, [arcadeFocused, reducedMotion])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const stage = stageRef.current
    if (!wrapper || !stage) return

    const syncSize = () => {
      setScreenSize({ width: wrapper.clientWidth, height: wrapper.clientHeight })
      setViewportSize({ width: stage.clientWidth, height: stage.clientHeight })
    }

    syncSize()

    const observer = new ResizeObserver(syncSize)
    observer.observe(wrapper)
    observer.observe(stage)

    return () => observer.disconnect()
  }, [])

  // Keyboard movement listeners
  useEffect(() => {
    function handleKeyDown(e) {
      if (speakerFocused && e.key === "Escape") {
        closeSpeakerFocus()
        return
      }
      if (computerFocused && e.key === "Escape") {
        closeComputerFocus()
        return
      }
      if (arcadeFocused && e.key === "Escape") {
        closeArcadeFocus()
        return
      }
      keysRef.current[e.key] = true
    }
    function handleKeyUp(e) {
      keysRef.current[e.key] = false
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [arcadeFocused, closeArcadeFocus, closeComputerFocus, closeSpeakerFocus, computerFocused, speakerFocused, triggerZone])

  useEffect(() => {
    let cancelled = false
    const sources = [
      IMAGE_SOURCES.room,
      ...DECOR.map((item) => item.src),
      ...Object.values(WINDOW_VIEWS),
      PHOTO_FRAME_DISPLAY_SRC
    ]

    Promise.all(
      sources.map(async (src) => {
        const image = await loadImage(src)
        return [src, image]
      })
    ).then((entries) => {
      if (cancelled) return
      for (const [src, image] of entries) {
        if (image) imagesRef.current[src] = image
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  // Main draw and update loop
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let raf = null
    let lastTime = performance.now()

    function step(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      // Keyboard driven movement
      let dx = 0
      let dy = 0
      const k = keysRef.current
      if (k["ArrowUp"]) dy -= 1
      if (k["ArrowDown"]) dy += 1
      if (k["ArrowLeft"]) dx -= 1
      if (k["ArrowRight"]) dx += 1

      if (speakerFocused || speakerClosing || computerFocused || computerClosing || photoFrameFocused || photoFrameClosing || arcadeFocused || arcadeClosing) {
        dx = 0
        dy = 0
      }

      // tracks whether anything changed this frame so we only re-render when needed
      let needsRender = false

      if (dx !== 0 || dy !== 0) {
        hasInteractedRef.current = true
        const len = Math.hypot(dx, dy) || 1
        posRef.current.x += (dx / len) * CAMERA_PAN_SPEED * dt
        posRef.current.y += (dy / len) * CAMERA_PAN_SPEED * dt
        needsRender = true
      }

      // Soft clamp to keep camera center inside world even before zoom constraints are applied.
      posRef.current.x = clamp(posRef.current.x, 0, WORLD_WIDTH)
      posRef.current.y = clamp(posRef.current.y, 0, WORLD_HEIGHT)

      // ease pointer parallax toward its target, small step each frame
      const curP = pointerParallaxRef.current
      const targetP = pointerParallaxTargetRef.current
      const nextX = curP.x + (targetP.x - curP.x) * PARALLAX_LERP
      const nextY = curP.y + (targetP.y - curP.y) * PARALLAX_LERP
      if (Math.abs(nextX - curP.x) > 0.02 || Math.abs(nextY - curP.y) > 0.02) {
        pointerParallaxRef.current = { x: nextX, y: nextY }
        needsRender = true
      }

      if (needsRender) forceRender()

      draw(ctx)

      raf = requestAnimationFrame(step)
    }

    function draw(ctx) {
      ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

      const roomImage = imagesRef.current[IMAGE_SOURCES.room]
      if (roomImage) {
        ctx.drawImage(roomImage, 0, 0, WORLD_WIDTH, WORLD_HEIGHT)
      } else {
        ctx.fillStyle = "#2a2f52"
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
      }

      const windowViewSrc = WINDOW_VIEWS[period] || WINDOW_VIEWS.day
      const windowViewImage = imagesRef.current[windowViewSrc]
      if (windowViewImage) {
        drawImageCover(
          ctx,
          windowViewImage,
          WINDOW_VIEWPORT.x,
          WINDOW_VIEWPORT.y,
          WINDOW_VIEWPORT.width,
          WINDOW_VIEWPORT.height
        )
      }

      const photoFrameImage = imagesRef.current[PHOTO_FRAME_DISPLAY_SRC]
      if (photoFrameImage) {
        drawImageCover(
          ctx,
          photoFrameImage,
          PHOTO_FRAME_VIEWPORT.x,
          PHOTO_FRAME_VIEWPORT.y,
          PHOTO_FRAME_VIEWPORT.width,
          PHOTO_FRAME_VIEWPORT.height
        )
      }

      for (const item of DECOR) {
        const image = imagesRef.current[item.src]
        if (!image) continue
        ctx.drawImage(image, item.x, item.y, item.width, item.height)
      }

      for (const zone of ZONES) {
        if (!PLACEHOLDER_ZONE_IDS.has(zone.id)) continue

        ctx.fillStyle = zone.color
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height)
      }

      // Time of day tint overlay
      ctx.fillStyle = TIME_TINTS[period] || TIME_TINTS.day
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

      if (period === "night") {
        // A few stars scattered near the top of the room
        ctx.fillStyle = "rgba(255,255,255,0.5)"
        const starSeed = [40, 120, 260, 380, 520, 640, 760, 830]
        starSeed.forEach((sx, i) => {
          ctx.fillRect(sx, 12 + (i % 3) * 8, 2, 2)
        })
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [arcadeClosing, arcadeFocused, computerClosing, computerFocused, period, photoFrameClosing, photoFrameFocused, photoFrameZone, speakerClosing, speakerFocused])

  const speakerCenter = getZoneCenter(speakerZone, null)
  const computerCenter = getZoneCenter(computerZone, null)
  const photoFrameCenter = getZoneCenter(photoFrameZone, null)
  const arcadeCenter = getZoneCenter(arcadeZone, null)
  const isAnyFocusActive = hasFocusedComponent({
    speakerFocused,
    speakerClosing,
    computerFocused,
    computerClosing,
    photoFrameFocused,
    photoFrameClosing,
    arcadeFocused,
    arcadeClosing
  })
  const focusedCenter = photoFrameFocused || photoFrameClosing
    ? photoFrameCenter
    : speakerFocused || speakerClosing
    ? speakerCenter
    : computerFocused || computerClosing
      ? computerCenter
      : arcadeFocused || arcadeClosing
        ? arcadeCenter
        : null
  const shouldShowRotatePrompt =
    screenSize.width <= MOBILE_ROTATE_MAX_WIDTH && screenSize.height > screenSize.width
  const isSpeakerTransitioning = speakerFocused || speakerClosing
  const isComputerTransitioning = computerFocused || computerClosing
  const isPhotoFrameTransitioning = photoFrameFocused || photoFrameClosing
  const isArcadeTransitioning = arcadeFocused || arcadeClosing
  const isClosingFocus = speakerClosing || computerClosing || photoFrameClosing || arcadeClosing
  const responsiveZoom = shouldShowRotatePrompt ? 1 : getDeviceZoom(screenSize.width, screenSize.height)
  const useResponsiveCamera =
    !isSpeakerTransitioning && !isComputerTransitioning && !isPhotoFrameTransitioning && !isArcadeTransitioning && responsiveZoom > 1
  const baseResponsiveCenter = useResponsiveCamera
    ? hasInteractedRef.current
      ? posRef.current
      : deskCenter || computerCenter
    : null
  // pointer parallax only applies while idle over the zoomed room, not mid drag or focus
  const parallaxActive = useResponsiveCamera && !dragRef.current.active && !isAnyFocusActive
  const parallax = parallaxActive ? pointerParallaxRef.current : { x: 0, y: 0 }
  const responsiveCenter = baseResponsiveCenter
    ? { x: baseResponsiveCenter.x + parallax.x, y: baseResponsiveCenter.y + parallax.y }
    : null
  const activeCenter = isClosingFocus ? focusReturnRef.current : (focusedCenter || responsiveCenter)

  const zoom = speakerClosing || computerClosing || photoFrameClosing || arcadeClosing
    ? responsiveZoom
    : speakerFocused
      ? SPEAKER_FOCUS_SCALE
      : computerFocused
        ? COMPUTER_FOCUS_SCALE
        : arcadeFocused
          ? ARCADE_FOCUS_SCALE
          : photoFrameFocused
            ? PHOTO_FRAME_FOCUS_SCALE
            : responsiveZoom
  const focusTarget =
    isSpeakerTransitioning || isComputerTransitioning || isArcadeTransitioning
      ? FOCUS_TARGET_CENTER
      : FOCUS_TARGET_CENTER
  const { shiftX, shiftY } = computeCameraShift({
    viewportWidth: viewportSize.width,
    viewportHeight: viewportSize.height,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
    activeCenter,
    zoom,
    target: focusTarget
  })

  const visibleWorldWidth = viewportSize.width / zoom
  const visibleWorldHeight = viewportSize.height / zoom
  const minCenterX = visibleWorldWidth / 2
  const maxCenterX = WORLD_WIDTH - visibleWorldWidth / 2
  const minCenterY = visibleWorldHeight / 2
  const maxCenterY = WORLD_HEIGHT - visibleWorldHeight / 2

  // keep the persisted camera position valid within the pannable bounds
  if (hasInteractedRef.current) {
    posRef.current.x = clamp(posRef.current.x, minCenterX, maxCenterX)
    posRef.current.y = clamp(posRef.current.y, minCenterY, maxCenterY)
  }

  // clamp whatever center is actually used for this render, parallax included
  if (activeCenter) {
    activeCenter.x = clamp(activeCenter.x, minCenterX, maxCenterX)
    activeCenter.y = clamp(activeCenter.y, minCenterY, maxCenterY)
  }

  const animateCamera =
    !reducedMotion &&
    (
      speakerFocused ||
      speakerClosing ||
      isComputerTransitioning ||
      isPhotoFrameTransitioning ||
      isArcadeTransitioning ||
      (useResponsiveCamera && !hasInteractedRef.current)
    )
  const cameraTransformStyle = {
    transform: `translate(${Math.round(shiftX)}px, ${Math.round(shiftY)}px) scale(${zoom})`,
    transition: animateCamera
      ? `transform ${FOCUS_TRANSITION_MS}ms ${FOCUS_EASING}`
      : "none"
  }

  const stageCoverScale = Math.max(
    screenSize.width / WORLD_WIDTH,
    screenSize.height / WORLD_HEIGHT
  )
  const stageWidth = Math.ceil(WORLD_WIDTH * stageCoverScale)
  const stageHeight = Math.ceil(WORLD_HEIGHT * stageCoverScale)

  const stageStyle = {
    width: `${stageWidth}px`,
    height: `${stageHeight}px`,
    transform: "translate(-50%, -50%)",
    pointerEvents: shouldShowRotatePrompt ? "none" : "auto"
  }

  const speakerOverlayStyle = useMemo(
    () => resolveOverlayAnchorStyle("speaker", screenSize),
    [screenSize]
  )

  const computerOverlayStyle = useMemo(
    () => resolveOverlayAnchorStyle("computer", screenSize),
    [screenSize]
  )

  const arcadeOverlayStyle = useMemo(
    () => resolveOverlayAnchorStyle("arcade", screenSize),
    [screenSize]
  )

  const backToRoomButtonStyle = useMemo(
    () => resolveBackToRoomButtonStyle(screenSize),
    [screenSize]
  )

  function handleBackToRoom() {
    if (photoFrameFocused || photoFrameClosing) {
      closePhotoFrameFocus()
      return
    }
    if (computerFocused || computerClosing) {
      closeComputerFocus()
      return
    }
    if (arcadeFocused || arcadeClosing) {
      closeArcadeFocus()
      return
    }
    if (speakerFocused || speakerClosing) {
      closeSpeakerFocus()
    }
  }

  function panByScreenDelta(deltaX, deltaY) {
    if (zoom <= 1 || speakerFocused || speakerClosing || isComputerTransitioning || isPhotoFrameTransitioning || isArcadeTransitioning) return

    const worldPerScreenPixelX = WORLD_WIDTH / (viewportSize.width * zoom)
    const worldPerScreenPixelY = WORLD_HEIGHT / (viewportSize.height * zoom)
    posRef.current.x -= deltaX * worldPerScreenPixelX
    posRef.current.y -= deltaY * worldPerScreenPixelY
    hasInteractedRef.current = true
    forceRender()
  }

  // subtle camera nudge that follows the mouse, mouse only, not touch
  function updatePointerParallax(e) {
    if (e.pointerType !== "mouse") return
    if (shouldShowRotatePrompt || isAnyFocusActive || zoom <= 1) {
      pointerParallaxTargetRef.current = { x: 0, y: 0 }
      return
    }

    const wrapper = wrapperRef.current
    if (!wrapper) return
    const rect = wrapper.getBoundingClientRect()
    const nx = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1)
    const ny = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1)

    pointerParallaxTargetRef.current = {
      x: nx * POINTER_PARALLAX_STRENGTH,
      y: ny * POINTER_PARALLAX_STRENGTH
    }
  }

  function handlePointerDown(e) {
    if (shouldShowRotatePrompt) return
    const drag = dragRef.current
    drag.active = true
    drag.moved = false
    drag.pointerId = e.pointerId
    drag.lastX = e.clientX
    drag.lastY = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e) {
    const drag = dragRef.current

    if (drag.active) {
      if (drag.pointerId !== e.pointerId) return

      const deltaX = e.clientX - drag.lastX
      const deltaY = e.clientY - drag.lastY
      drag.lastX = e.clientX
      drag.lastY = e.clientY

      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        drag.moved = true
      }

      panByScreenDelta(deltaX, deltaY)
      return
    }

    updatePointerParallax(e)
  }

  function handlePointerEnd(e) {
    const drag = dragRef.current
    if (drag.pointerId === e.pointerId) {
      drag.active = false
      drag.pointerId = null
    }
  }

  function handlePointerLeaveCanvas() {
    if (dragRef.current.active) return
    pointerParallaxTargetRef.current = { x: 0, y: 0 }
  }

  function handleCanvasClick(e) {
    if (dragRef.current.moved) {
      dragRef.current.moved = false
      return
    }

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = WORLD_WIDTH / rect.width
    const scaleY = WORLD_HEIGHT / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    if (speakerFocused || speakerClosing || isComputerTransitioning || isPhotoFrameTransitioning || isArcadeTransitioning) {
      return
    }

    // If multiple zones overlap, prefer the last one because it is treated as topmost.
    const zone = [...ZONES].reverse().find((z) => pointInZone(x, y, z))
    if (zone) {
      hasInteractedRef.current = true
      triggerZone(zone)
    }
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.stage} ref={stageRef} style={stageStyle} aria-hidden={shouldShowRotatePrompt}>
        <canvas
          ref={canvasRef}
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          className={styles.canvas}
          style={cameraTransformStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onPointerLeave={handlePointerLeaveCanvas}
          onClick={handleCanvasClick}
          role="img"
          aria-label="An explorable room with furniture and hidden interactions, use the accessibility drawer for a text version"
        />
      </div>
      {shouldShowRotatePrompt ? (
        <div className={styles.rotatePrompt} role="status" aria-live="polite">
          <h2 className={styles.rotateTitle}>Rotate your phone</h2>
          <p className={styles.rotateText}>This room is designed for landscape view so every asset keeps its proportions.</p>
        </div>
      ) : null}
      {showSpeakerOverlay || speakerClosing ? (
        <div
          style={speakerOverlayStyle}
          className={
            speakerClosing
              ? styles.speakerOverlayAnchor + " " + styles.speakerOverlayClosing
              : styles.speakerOverlayAnchor + " " + styles.speakerOverlayOpen
          }
        >
          <SpeakerOverlay onClose={closeSpeakerFocus} />
        </div>
      ) : null}
      {showComputerOverlay || computerClosing ? (
        <div
          style={computerOverlayStyle}
          className={
            computerClosing
              ? styles.computerOverlayAnchor + " " + styles.computerOverlayClosing
              : styles.computerOverlayAnchor + " " + styles.computerOverlayOpen
          }
        >
          <ComputerOverlay onClose={closeComputerFocus} reducedMotion={reducedMotion} />
        </div>
      ) : null}
      {showArcadeOverlay || arcadeClosing ? (
        <div
          style={arcadeOverlayStyle}
          className={
            arcadeClosing
              ? styles.arcadeOverlayAnchor + " " + styles.arcadeOverlayClosing
              : styles.arcadeOverlayAnchor + " " + styles.arcadeOverlayOpen
          }
        >
          <ArcadeModal onClose={closeArcadeFocus} />
        </div>
      ) : null}
      {isAnyFocusActive && !shouldShowRotatePrompt ? (
        <button
          type="button"
          className={styles.focusBackButton}
          style={backToRoomButtonStyle}
          onClick={handleBackToRoom}
        >
          {BACK_TO_ROOM_LABEL}
        </button>
      ) : null}
    </div>
  )
}