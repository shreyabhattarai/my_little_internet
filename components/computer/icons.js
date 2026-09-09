// Small inline icons for the fake desktop
// Kept as plain svg so no extra image assets are needed

export function IconWindowsFlag({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 3.4L9 2.3V9.4H2V3.4Z" fill="#ff4b2b" />
      <path d="M10 2.2L18 1V9.3H10V2.2Z" fill="#7ed321" />
      <path d="M2 10.4H9V17.5L2 16.5V10.4Z" fill="#3ec6ff" />
      <path d="M10 10.4H18V18.8L10 17.7V10.4Z" fill="#ffd426" />
    </svg>
  )
}

export function IconFolder({ size = 30 }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 32 25" aria-hidden="true">
      <path
        d="M1 4C1 2.3 2.3 1 4 1H12L15 4H28C29.7 4 31 5.3 31 7V20C31 21.7 29.7 23 28 23H4C2.3 23 1 21.7 1 20V4Z"
        fill="url(#folderBase)"
        stroke="#8a5a00"
        strokeWidth="0.6"
      />
      <path d="M1 8H31V20C31 21.7 29.7 23 28 23H4C2.3 23 1 21.7 1 20V8Z" fill="url(#folderFront)" stroke="#8a5a00" strokeWidth="0.6" />
      <defs>
        <linearGradient id="folderBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe79f" />
          <stop offset="1" stopColor="#f7cb62" />
        </linearGradient>
        <linearGradient id="folderFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9ad" />
          <stop offset="0.6" stopColor="#fdc84c" />
          <stop offset="1" stopColor="#f0a91d" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function IconPicturesFolder({ size = 30 }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 32 25" aria-hidden="true">
      <path
        d="M1 4C1 2.3 2.3 1 4 1H12L15 4H28C29.7 4 31 5.3 31 7V20C31 21.7 29.7 23 28 23H4C2.3 23 1 21.7 1 20V4Z"
        fill="#f7cb62"
        stroke="#8a5a00"
        strokeWidth="0.6"
      />
      <path d="M1 8H31V20C31 21.7 29.7 23 28 23H4C2.3 23 1 21.7 1 20V8Z" fill="#fdc84c" stroke="#8a5a00" strokeWidth="0.6" />
      <rect x="6" y="10.5" width="17" height="10.5" rx="0.8" fill="#eef7ff" stroke="#7a9ec9" strokeWidth="0.6" />
      <circle cx="10.5" cy="14" r="1.6" fill="#ffd54f" stroke="#c79418" strokeWidth="0.4" />
      <path d="M6.6 20.4L12 15.4L15.6 18.6L19.5 14.2L22.4 20.4H6.6Z" fill="#6fae5a" stroke="#3f7a34" strokeWidth="0.4" />
    </svg>
  )
}

export function IconNotepad({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 28" aria-hidden="true">
      <rect x="3" y="2" width="20" height="24" rx="1.4" fill="#fefefe" stroke="#9aa7b4" strokeWidth="0.8" />
      <rect x="3" y="2" width="5" height="24" fill="#e3e9ef" stroke="#9aa7b4" strokeWidth="0.6" />
      {[6, 9.4, 12.8, 16.2, 19.6, 23].map((y) => (
        <circle key={y} cx="5.5" cy={y} r="0.85" fill="#b8c2cc" />
      ))}
      <rect x="10.5" y="7" width="10" height="1.3" fill="#7fa8d9" />
      <rect x="10.5" y="10.5" width="10" height="1.3" fill="#c7d6ea" />
      <rect x="10.5" y="14" width="8" height="1.3" fill="#c7d6ea" />
      <rect x="10.5" y="17.5" width="9" height="1.3" fill="#c7d6ea" />
      <path d="M18 20.5L23 18.5L21.6 23.6L18 20.5Z" fill="#ffcf4d" stroke="#c79418" strokeWidth="0.5" />
    </svg>
  )
}

export function IconInternet({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
      <defs>
        <linearGradient id="ieGlobe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5fc0ff" />
          <stop offset="0.55" stopColor="#0f6fd6" />
          <stop offset="1" stopColor="#093f8f" />
        </linearGradient>
      </defs>
      <circle cx="13" cy="13" r="11" fill="url(#ieGlobe)" stroke="#083067" strokeWidth="0.6" />
      <path
        d="M13 2C9.5 6 9.5 20 13 24M13 2C16.5 6 16.5 20 13 24M2.5 13H23.5M4 7.5H22M4 18.5H22"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.9"
      />
      <path
        d="M17 12C22 15 24 19 24 22C21 24.5 15.5 25.2 12 22C15 21.5 17.5 19 18.5 16C19.2 14.3 18.5 12.8 17 12Z"
        fill="#ffb43e"
        stroke="#a5641a"
        strokeWidth="0.5"
      />
    </svg>
  )
}

export function IconRecycleBin({ size = 28, isFull }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 28" aria-hidden="true">
      <path d="M6 9H20L18.5 25.5C18.4 26.4 17.6 27 16.7 27H9.3C8.4 27 7.6 26.4 7.5 25.5L6 9Z" fill="#e7ecf1" stroke="#7b8896" strokeWidth="0.7" />
      <path d="M6 9H20L19.6 12H6.4L6 9Z" fill="#cbd5df" stroke="#7b8896" strokeWidth="0.6" />
      <rect x="9.6" y="12.5" width="1.3" height="11.5" fill="#9aa7b4" />
      <rect x="12.3" y="12.5" width="1.3" height="11.5" fill="#9aa7b4" />
      <rect x="15" y="12.5" width="1.3" height="11.5" fill="#9aa7b4" />
      <rect x="4.5" y="6.2" width="17" height="2.4" rx="0.6" fill="#b9c4cf" stroke="#7b8896" strokeWidth="0.5" />
      <rect x="10" y="3.3" width="6" height="2.4" rx="0.6" fill="#b9c4cf" stroke="#7b8896" strokeWidth="0.5" />
      {isFull ? (
        <>
          <path d="M8.5 8.5L11 4.6L13 7.4L15.5 4.2L17.6 8.5" fill="none" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" />
          <rect x="9.5" y="4.2" width="3.6" height="3" rx="0.4" fill="#fff7e0" stroke="#c9b47a" strokeWidth="0.5" transform="rotate(-8 11 5)" />
        </>
      ) : null}
    </svg>
  )
}

export function IconChevron({ direction = "left", size = 20 }) {
  const rotation = direction === "left" ? 0 : 180
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M15 5L8 12L15 19" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconPlay({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5L20 12L7 19V5Z" fill="currentColor" />
    </svg>
  )
}

export function IconPause({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="5" width="4.5" height="14" rx="1" fill="currentColor" />
      <rect x="13.5" y="5" width="4.5" height="14" rx="1" fill="currentColor" />
    </svg>
  )
}
