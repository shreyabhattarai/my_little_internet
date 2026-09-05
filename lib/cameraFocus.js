export const FOCUS_TRANSITION_MS = 560
export const FOCUS_EASING = "cubic-bezier(0.22, 0.61, 0.36, 1)"
export const FOCUS_TARGET_CENTER = Object.freeze({ x: 0.5, y: 0.5 })
export const BACK_TO_ROOM_LABEL = "Back to room"
export const OVERLAY_LAYOUTS = Object.freeze({
  speaker: {
    base: {
      left: "50%",
      top: "min(66%, calc(100% - 170px))",
      width: "min(94vw, 680px)"
    },
    narrow: {
      maxWidth: 820,
      left: "50%",
      top: "min(61%, calc(100% - 155px))",
      width: "min(96vw, 620px)"
    },
    short: {
      maxHeight: 760,
      left: "50%",
      top: "min(58%, calc(100% - 140px))",
      width: "min(96vw, 600px)"
    }
  },
  computer: {
    base: {
      left: "45%",
      top: "35%"
    },
    narrow: {
      maxWidth: 820,
      left: "47%",
      top: "37%"
    },
    short: {
      maxHeight: 760,
      left: "47%",
      top: "38%"
    }
  }
})

const PHOTO_FRAME_INSET_PRESETS = Object.freeze({
  portrait: Object.freeze({ x: 0.2, y: 0.19, width: 0.6, height: 0.58 }),
  square: Object.freeze({ x: 0.18, y: 0.16, width: 0.64, height: 0.64 }),
  landscape: Object.freeze({ x: 0.16, y: 0.12, width: 0.68, height: 0.72 })
})

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function getZoneCenter(zone, fallbackCenter) {
  if (!zone) return fallbackCenter
  return {
    x: zone.x + zone.width / 2,
    y: zone.y + zone.height / 2
  }
}

export function computeCameraShift({
  viewportWidth,
  viewportHeight,
  worldWidth,
  worldHeight,
  activeCenter,
  zoom,
  target = FOCUS_TARGET_CENTER
}) {
  const centerPx = activeCenter
    ? {
        x: (activeCenter.x / worldWidth) * viewportWidth,
        y: (activeCenter.y / worldHeight) * viewportHeight
      }
    : {
        x: viewportWidth / 2,
        y: viewportHeight / 2
      }

  const targetPxX = viewportWidth * target.x
  const targetPxY = viewportHeight * target.y
  const rawShiftX = activeCenter ? targetPxX - centerPx.x * zoom : 0
  const rawShiftY = activeCenter ? targetPxY - centerPx.y * zoom : 0

  const minShiftX = viewportWidth - viewportWidth * zoom
  const minShiftY = viewportHeight - viewportHeight * zoom

  return {
    shiftX: clamp(rawShiftX, minShiftX, 0),
    shiftY: clamp(rawShiftY, minShiftY, 0)
  }
}

export function resolveOverlayAnchorStyle(kind, screenSize) {
  const layout = OVERLAY_LAYOUTS[kind]
  if (!layout) return {}

  const resolved = { ...layout.base }

  if (layout.narrow && screenSize.width <= layout.narrow.maxWidth) {
    Object.assign(resolved, layout.narrow)
  }

  if (layout.short && screenSize.height <= layout.short.maxHeight) {
    Object.assign(resolved, layout.short)
  }

  delete resolved.maxWidth
  delete resolved.maxHeight

  return resolved
}

export function resolveBackToRoomButtonStyle(screenSize) {
  const style = {
    left: "14px",
    top: "14px",
    fontSize: "12px",
    padding: "6px 10px"
  }

  if (screenSize.width <= 820) {
    style.left = "10px"
    style.top = "10px"
    style.fontSize = "11px"
    style.padding = "5px 9px"
  }

  return style
}

export function resolvePhotoFrameInset(zone, frameImage) {
  if (!zone) return null

  const ratio = frameImage?.width && frameImage?.height
    ? frameImage.width / frameImage.height
    : zone.width / Math.max(1, zone.height)

  const preset = ratio >= 1.2
    ? PHOTO_FRAME_INSET_PRESETS.landscape
    : ratio <= 0.9
      ? PHOTO_FRAME_INSET_PRESETS.portrait
      : PHOTO_FRAME_INSET_PRESETS.square

  return {
    x: zone.x + zone.width * preset.x,
    y: zone.y + zone.height * preset.y,
    width: zone.width * preset.width,
    height: zone.height * preset.height
  }
}
