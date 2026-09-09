"use client"

import { useEffect, useRef, useState } from "react"
import Modal from "@/components/shared/Modal"
import styles from "./ArcadeModal.module.css"
import { arcadeGames } from "@/lib/rooms"

const REACTION_KEY = "arcade-reaction-best"
const REACTION_HISTORY_KEY = "arcade-reaction-history"
const SNAKE_KEY = "arcade-snake-best"
const MEMORY_KEY = "arcade-memory-best"
const GAME2048_KEY = "arcade-2048-best"
const TICTACTOE_KEY = "arcade-tictactoe-stats"
const STACK_KEY = "arcade-stack-best"

function IconReaction(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
    </svg>
  )
}

function IconSnake(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4 6a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v6a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V9a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v3a5 5 0 0 1-5 5h-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="18" cy="19" r="1.6" fill="currentColor" />
    </svg>
  )
}

function IconMemory(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3.5 3.5 0 0 0 2 6.4V19a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1V5a2 2 0 0 0-1-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3.5 3.5 0 0 1-2 6.4V19a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1V5a2 2 0 0 1 1-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Icon2048(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.45" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.7" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.7" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" fill="currentColor" />
    </svg>
  )
}

function IconTicTacToe(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="6" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13.6 12.4l4.8 4.8M18.4 12.4l-4.8 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconStack(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="4" y="17" width="16" height="3" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="6" y="12" width="12" height="3" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="8" y="7" width="9" height="3" rx="1" fill="currentColor" />
      <rect x="11" y="3" width="6" height="3" rx="1" fill="currentColor" opacity="0.8" />
    </svg>
  )
}

const GAME_ICONS = {
  reaction: IconReaction,
  snake: IconSnake,
  memory: IconMemory,
  "2048": Icon2048,
  tictactoe: IconTicTacToe,
  stack: IconStack,
}

function readScore(key) {
  if (typeof window === "undefined") return 0
  const raw = window.localStorage.getItem(key)
  return raw ? Number(raw) : 0
}

function writeScore(key, value) {
  try {
    window.localStorage.setItem(key, String(value))
  } catch (e) {}
}

function readList(key) {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function writeList(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {}
}

function readStats(key) {
  const fallback = { wins: 0, losses: 0, draws: 0 }
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

function writeStats(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {}
}

function readVar(el, name, fallback) {
  if (!el) return fallback
  const val = getComputedStyle(el).getPropertyValue(name).trim()
  return val || fallback
}

function getBestLabel(id) {
  if (id === "reaction") {
    const v = readScore(REACTION_KEY)
    return v ? "best " + v + " ms" : "no record yet"
  }

  if (id === "snake") {
    const v = readScore(SNAKE_KEY)
    return v ? "best " + v : "no record yet"
  }

  if (id === "memory") {
    const v = readScore(MEMORY_KEY)
    return v ? "best " + v + " moves" : "no record yet"
  }

  if (id === "2048") {
    const v = readScore(GAME2048_KEY)
    return v ? "best " + v : "no record yet"
  }

  if (id === "tictactoe") {
    const s = readStats(TICTACTOE_KEY)
    return s.wins || s.losses || s.draws ? s.wins + " wins" : "no record yet"
  }

  if (id === "stack") {
    const v = readScore(STACK_KEY)
    return v ? "best " + v : "no record yet"
  }

  return ""
}

function ReactionGame() {
  const [state, setState] = useState("idle")
  const [message, setMessage] = useState("press start when ready")
  const [last, setLast] = useState(null)
  const [best, setBest] = useState(() => readScore(REACTION_KEY))
  const [history, setHistory] = useState(() => readList(REACTION_HISTORY_KEY))
  const startTimeRef = useRef(null)
  const timeoutRef = useRef(null)

  const average =
    history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : null

  function start() {
    setState("waiting")
    setMessage("wait for green")
    const delay = 800 + Math.random() * 2200
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now()
      setState("go")
      setMessage("click now")
    }, delay)
  }

  function handleClick() {
    if (state === "waiting") {
      clearTimeout(timeoutRef.current)
      setState("idle")
      setMessage("too soon, try again")
      return
    }

    if (state === "go") {
      const reaction = Math.round(performance.now() - startTimeRef.current)
      setState("idle")
      setLast(reaction)
      setMessage("reaction time " + reaction + " ms")

      if (best === 0 || reaction < best) {
        setBest(reaction)
        writeScore(REACTION_KEY, reaction)
      }

      const nextHistory = [...history, reaction].slice(-5)
      setHistory(nextHistory)
      writeList(REACTION_HISTORY_KEY, nextHistory)
    }
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return (
    <div className={styles.gameArea}>
      <div className={styles.scoreRow}>
        <span>last {last ? last + " ms" : "-"}</span>
        <span>avg {average ? average + " ms" : "-"}</span>
        <span>best {best ? best + " ms" : "-"}</span>
      </div>

      <div
        className={styles.reactionBox}
        style={{ background: state === "go" ? "var(--color-teal)" : "rgba(45, 53, 88, 0.8)" }}
        onClick={handleClick}
      >
        {message}
      </div>

      <button className={styles.primaryAction} onClick={start} disabled={state === "waiting"}>
        start
      </button>
    </div>
  )
}

const SNAKE_GRID = 14
const SNAKE_CELL = 22
const SNAKE_SIZE = SNAKE_GRID * SNAKE_CELL

function spawnFood(snake) {
  let pos

  do {
    pos = {
      x: Math.floor(Math.random() * SNAKE_GRID),
      y: Math.floor(Math.random() * SNAKE_GRID),
    }
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y))

  return pos
}

function SnakeGame() {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)
  const touchRef = useRef(null)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => readScore(SNAKE_KEY))
  const [status, setStatus] = useState("ready")

  function resetState() {
    const mid = Math.floor(SNAKE_GRID / 2)
    const snake = [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ]

    stateRef.current = {
      snake,
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: spawnFood(snake),
    }
  }

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const s = stateRef.current

    ctx.fillStyle = readVar(canvas, "--arcade-screen", "#101828")
    ctx.fillRect(0, 0, SNAKE_SIZE, SNAKE_SIZE)

    ctx.strokeStyle = readVar(canvas, "--arcade-screen-line", "rgba(145,180,255,0.15)")

    for (let i = 1; i < SNAKE_GRID; i++) {
      ctx.beginPath()
      ctx.moveTo(i * SNAKE_CELL, 0)
      ctx.lineTo(i * SNAKE_CELL, SNAKE_SIZE)
      ctx.moveTo(0, i * SNAKE_CELL)
      ctx.lineTo(SNAKE_SIZE, i * SNAKE_CELL)
      ctx.stroke()
    }

    ctx.fillStyle = readVar(canvas, "--arcade-accent", "#ebad47")
    ctx.fillRect(
      s.food.x * SNAKE_CELL + 2,
      s.food.y * SNAKE_CELL + 2,
      SNAKE_CELL - 4,
      SNAKE_CELL - 4
    )

    s.snake.forEach((seg, i) => {
      ctx.fillStyle =
        i === 0
          ? readVar(canvas, "--arcade-text", "#edf4ff")
          : readVar(canvas, "--color-teal", "#7dc2bf")

      ctx.fillRect(
        seg.x * SNAKE_CELL + 1,
        seg.y * SNAKE_CELL + 1,
        SNAKE_CELL - 2,
        SNAKE_CELL - 2
      )
    })
  }

  function setDirection(x, y) {
    const s = stateRef.current
    if (!s) return
    if (s.dir.x === -x && s.dir.y === -y) return
    s.nextDir = { x, y }
  }

  function tick() {
    const s = stateRef.current

    s.dir = s.nextDir

    const head = {
      x: s.snake[0].x + s.dir.x,
      y: s.snake[0].y + s.dir.y,
    }

    const hitWall =
      head.x < 0 ||
      head.y < 0 ||
      head.x >= SNAKE_GRID ||
      head.y >= SNAKE_GRID

    const hitSelf = s.snake.some(
      (seg) => seg.x === head.x && seg.y === head.y
    )

    if (hitWall || hitSelf) {
      setStatus("over")
      return
    }

    s.snake.unshift(head)

    if (head.x === s.food.x && head.y === s.food.y) {
      setScore((prev) => prev + 1)
      s.food = spawnFood(s.snake)
    } else {
      s.snake.pop()
    }

    draw()
  }

  function start() {
    resetState()
    setScore(0)
    setStatus("running")
  }

  useEffect(() => {
    resetState()
    draw()
  }, [])

  useEffect(() => {
    if (status !== "running") return

    const speed = Math.max(70, 130 - score * 2)
    const interval = setInterval(tick, speed)

    return () => clearInterval(interval)
  }, [status, score])

  useEffect(() => {
    if (score > best) {
      setBest(score)
      writeScore(SNAKE_KEY, score)
    }
  }, [score])

  useEffect(() => {
    function handlePauseOnHide() {
      if (document.hidden) {
        setStatus((prev) => (prev === "running" ? "paused" : prev))
      }
    }

    document.addEventListener("visibilitychange", handlePauseOnHide)
    return () => document.removeEventListener("visibilitychange", handlePauseOnHide)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowUp" || e.key === "w") setDirection(0, -1)
      if (e.key === "ArrowDown" || e.key === "s") setDirection(0, 1)
      if (e.key === "ArrowLeft" || e.key === "a") setDirection(-1, 0)
      if (e.key === "ArrowRight" || e.key === "d") setDirection(1, 0)
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  function handleTouchStart(e) {
    const t = e.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY }
  }

  function handleTouchEnd(e) {
    if (!touchRef.current) return

    const t = e.changedTouches[0]
    const dx = t.clientX - touchRef.current.x
    const dy = t.clientY - touchRef.current.y

    if (Math.max(Math.abs(dx), Math.abs(dy)) > 18) {
      if (Math.abs(dx) > Math.abs(dy)) {
        setDirection(dx > 0 ? 1 : -1, 0)
      } else {
        setDirection(0, dy > 0 ? 1 : -1)
      }
    }

    touchRef.current = null
  }

  return (
    <div className={styles.gameArea}>
      <div className={styles.scoreRow}>
        <span>score {score}</span>
        <span>best {best}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={SNAKE_SIZE}
        height={SNAKE_SIZE}
        className={styles.snakeCanvas}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      {status !== "running" && (
        <button className={styles.primaryAction} onClick={start}>
          {status === "over" ? "play again" : status === "paused" ? "resume" : "start"}
        </button>
      )}

      {status === "over" && <p className={styles.statusText}>game over</p>}
      {status === "paused" && <p className={styles.statusText}>paused</p>}

      <p className={styles.hintText}>swipe or use arrow keys to steer</p>
    </div>
  )
}

const MEMORY_ICONS = ["🌙", "⭐", "🪐", "☁️", "🕯️", "📚", "🧸", "🎧"]

function shuffle(arr) {
  const a = [...arr]

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }

  return a
}

function buildDeck() {
  const icons = shuffle([...MEMORY_ICONS, ...MEMORY_ICONS])
  return icons.map((icon, i) => ({
    id: i,
    icon,
    flipped: false,
    matched: false,
  }))
}

function MemoryGame() {
  const [deck, setDeck] = useState(buildDeck)
  const [open, setOpen] = useState([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [best, setBest] = useState(() => readScore(MEMORY_KEY))
  const [locked, setLocked] = useState(false)

  const solved = deck.every((card) => card.matched)

  function reset() {
    setDeck(buildDeck())
    setOpen([])
    setMoves(0)
    setSeconds(0)
    setRunning(true)
    setLocked(false)
  }

  function flip(index) {
    if (locked || open.length === 2) return
    if (deck[index].flipped || deck[index].matched) return

    if (!running) setRunning(true)

    const nextDeck = deck.map((card, i) =>
      i === index ? { ...card, flipped: true } : card
    )

    const nextOpen = [...open, index]

    setDeck(nextDeck)
    setOpen(nextOpen)

    if (nextOpen.length === 2) {
      setLocked(true)
      setMoves((m) => m + 1)

      const [a, b] = nextOpen
      const matched = nextDeck[a].icon === nextDeck[b].icon

      setTimeout(() => {
        setDeck((d) =>
          d.map((card, i) =>
            i === a || i === b
              ? {
                  ...card,
                  matched: matched ? true : false,
                  flipped: matched,
                }
              : card
          )
        )

        setOpen([])
        setLocked(false)
      }, matched ? 350 : 700)
    }
  }

  useEffect(() => {
    if (!running || solved) return

    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [running, solved])

  useEffect(() => {
    if (solved) setRunning(false)

    if (solved && moves > 0 && (best === 0 || moves < best)) {
      setBest(moves)
      writeScore(MEMORY_KEY, moves)
    }
  }, [solved])

  return (
    <div className={styles.gameArea}>
      <div className={styles.scoreRow}>
        <span>moves {moves}</span>
        <span>time {seconds}s</span>
        <span>best {best || "-"}</span>
      </div>

      <div className={styles.memoryGrid}>
        {deck.map((card, i) => (
          <button
            key={card.id}
            className={
              card.flipped || card.matched
                ? styles.memoryCardOpen
                : styles.memoryCard
            }
            onClick={() => flip(i)}
          >
            {card.flipped || card.matched ? card.icon : ""}
          </button>
        ))}
      </div>

      {solved && (
        <p className={styles.statusText}>
          solved in {moves} moves, {seconds}s
        </p>
      )}

      <button className={styles.primaryAction} onClick={reset}>
        reset
      </button>
    </div>
  )
}

const SIZE_2048 = 4

function emptyGrid() {
  return Array.from({ length: SIZE_2048 }, () =>
    Array(SIZE_2048).fill(0)
  )
}

function addRandomTile(grid) {
  const empties = []

  grid.forEach((row, r) =>
    row.forEach((val, c) => {
      if (val === 0) empties.push([r, c])
    })
  )

  if (empties.length === 0) return grid

  const [r, c] = empties[Math.floor(Math.random() * empties.length)]
  const next = grid.map((row) => [...row])

  next[r][c] = Math.random() < 0.9 ? 2 : 4

  return next
}

function slideRow(row) {
  const filtered = row.filter((v) => v !== 0)
  let gained = 0

  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2
      gained += filtered[i]
      filtered[i + 1] = 0
    }
  }

  const merged = filtered.filter((v) => v !== 0)

  while (merged.length < SIZE_2048) merged.push(0)

  return { row: merged, gained }
}

function rotateGrid(grid) {
  const next = emptyGrid()

  for (let r = 0; r < SIZE_2048; r++) {
    for (let c = 0; c < SIZE_2048; c++) {
      next[c][SIZE_2048 - 1 - r] = grid[r][c]
    }
  }

  return next
}

function moveLeft(grid) {
  let gained = 0

  const next = grid.map((row) => {
    const result = slideRow(row)
    gained += result.gained
    return result.row
  })

  return { grid: next, gained }
}

function moveGrid(grid, dir) {
  let rotations = 0

  if (dir === "up") rotations = 3
  if (dir === "right") rotations = 2
  if (dir === "down") rotations = 1

  let rotated = grid

  for (let i = 0; i < rotations; i++) {
    rotated = rotateGrid(rotated)
  }

  const { grid: moved, gained } = moveLeft(rotated)

  let result = moved

  for (let i = 0; i < (4 - rotations) % 4; i++) {
    result = rotateGrid(result)
  }

  return { grid: result, gained }
}

function gridsEqual(a, b) {
  return a.every((row, r) =>
    row.every((val, c) => val === b[r][c])
  )
}

function canMove(grid) {
  if (grid.some((row) => row.some((v) => v === 0))) return true

  for (let r = 0; r < SIZE_2048; r++) {
    for (let c = 0; c < SIZE_2048; c++) {
      const val = grid[r][c]

      if (c < SIZE_2048 - 1 && grid[r][c + 1] === val) return true
      if (r < SIZE_2048 - 1 && grid[r + 1][c] === val) return true
    }
  }

  return false
}

function Game2048() {
  const [grid, setGrid] = useState(() =>
    addRandomTile(addRandomTile(emptyGrid()))
  )
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => readScore(GAME2048_KEY))
  const [over, setOver] = useState(false)
  const [won, setWon] = useState(false)
  const touchRef = useRef(null)

  function move(dir) {
    if (over) return

    const { grid: next, gained } = moveGrid(grid, dir)

    if (gridsEqual(next, grid)) return

    const withTile = addRandomTile(next)

    setGrid(withTile)

    setScore((s) => {
      const total = s + gained

      if (total > best) {
        setBest(total)
        writeScore(GAME2048_KEY, total)
      }

      return total
    })

    if (withTile.some((row) => row.some((v) => v === 2048))) {
      setWon(true)
    }

    if (!canMove(withTile)) {
      setOver(true)
    }
  }

  function restart() {
    setGrid(addRandomTile(addRandomTile(emptyGrid())))
    setScore(0)
    setOver(false)
    setWon(false)
  }

  useEffect(() => {
    function handleKey(e) {
      const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

      if (keys.includes(e.key)) e.preventDefault()

      if (e.key === "ArrowLeft") move("left")
      if (e.key === "ArrowRight") move("right")
      if (e.key === "ArrowUp") move("up")
      if (e.key === "ArrowDown") move("down")
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [grid, over, best])

  function handleTouchStart(e) {
    const t = e.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY }
  }

  function handleTouchEnd(e) {
    if (!touchRef.current) return

    const t = e.changedTouches[0]
    const dx = t.clientX - touchRef.current.x
    const dy = t.clientY - touchRef.current.y

    if (Math.max(Math.abs(dx), Math.abs(dy)) > 18) {
      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? "right" : "left")
      } else {
        move(dy > 0 ? "down" : "up")
      }
    }

    touchRef.current = null
  }

  return (
    <div className={styles.gameArea}>
      <div className={styles.scoreRow}>
        <span>score {score}</span>
        <span>best {best}</span>
      </div>

      <div
        className={styles.grid2048}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={r + "-" + c}
              className={styles.tile2048}
              data-value={val || ""}
            >
              {val || ""}
            </div>
          ))
        )}
      </div>

      {won && !over && (
        <p className={styles.statusText}>you reached 2048</p>
      )}

      {over && <p className={styles.statusText}>no more moves</p>}

      <button className={styles.primaryAction} onClick={restart}>
        restart
      </button>
    </div>
  )
}

const TTT_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function calculateWinner(cells) {
  for (const line of TTT_LINES) {
    const [a, b, c] = line

    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line }
    }
  }

  return null
}

function pickComputerMove(cells) {
  const empties = cells
    .map((v, i) => (v ? null : i))
    .filter((v) => v !== null)

  for (const i of empties) {
    const copy = [...cells]
    copy[i] = "O"

    if (calculateWinner(copy)?.winner === "O") return i
  }

  for (const i of empties) {
    const copy = [...cells]
    copy[i] = "X"

    if (calculateWinner(copy)?.winner === "X") return i
  }

  if (cells[4] === null) return 4

  const corners = [0, 2, 6, 8].filter((i) => cells[i] === null)

  if (corners.length) {
    return corners[Math.floor(Math.random() * corners.length)]
  }

  return empties[Math.floor(Math.random() * empties.length)]
}

function TicTacToeGame() {
  const [cells, setCells] = useState(Array(9).fill(null))
  const [message, setMessage] = useState("your turn")
  const [winLine, setWinLine] = useState([])
  const [stats, setStats] = useState(() => readStats(TICTACTOE_KEY))
  const [locked, setLocked] = useState(false)

  function updateStats(result) {
    const next = { ...stats, [result]: stats[result] + 1 }
    setStats(next)
    writeStats(TICTACTOE_KEY, next)
  }

  function handleClick(i) {
    if (cells[i] || locked) return

    const next = [...cells]
    next[i] = "X"

    setCells(next)

    const result = calculateWinner(next)

    if (result) {
      setMessage("you win")
      setWinLine(result.line)
      updateStats("wins")
      setLocked(true)
      return
    }

    if (next.every((v) => v !== null)) {
      setMessage("draw")
      updateStats("draws")
      setLocked(true)
      return
    }

    setLocked(true)

    setTimeout(() => {
      const spot = pickComputerMove(next)
      const afterComputer = [...next]
      afterComputer[spot] = "O"

      setCells(afterComputer)

      const compResult = calculateWinner(afterComputer)

      if (compResult) {
        setMessage("computer wins")
        setWinLine(compResult.line)
        updateStats("losses")
      } else if (afterComputer.every((v) => v !== null)) {
        setMessage("draw")
        updateStats("draws")
      } else {
        setMessage("your turn")
      }

      setLocked(false)
    }, 450)
  }

  function reset() {
    setCells(Array(9).fill(null))
    setMessage("your turn")
    setWinLine([])
    setLocked(false)
  }

  const roundOver = message !== "your turn"

  useEffect(() => {
    if (!roundOver) return

    const timeout = setTimeout(reset, 1400)
    return () => clearTimeout(timeout)
  }, [roundOver, message])

  return (
    <div className={styles.gameArea}>
      <div className={styles.scoreRow}>
        <span>wins {stats.wins}</span>
        <span>losses {stats.losses}</span>
        <span>draws {stats.draws}</span>
      </div>

      <div className={styles.tttGrid}>
        {cells.map((val, i) => (
          <button
            key={i}
            className={
              winLine.includes(i)
                ? styles.tttCell + " " + styles.tttCellWin
                : styles.tttCell
            }
            onClick={() => handleClick(i)}
          >
            {val}
          </button>
        ))}
      </div>

      <p className={styles.statusText}>
        {message}
        {roundOver ? ", next round starting..." : ""}
      </p>
    </div>
  )
}

const STACK_WIDTH = 320
const STACK_HEIGHT = 260
const STACK_BLOCK_HEIGHT = 18
const STACK_BASE_WIDTH = 150

function StackGame() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const stateRef = useRef(null)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => readScore(STACK_KEY))
  const [status, setStatus] = useState("ready")

  function createState() {
    const baseX = (STACK_WIDTH - STACK_BASE_WIDTH) / 2

    stateRef.current = {
      blocks: [
        {
          x: baseX,
          width: STACK_BASE_WIDTH,
          y: STACK_HEIGHT - STACK_BLOCK_HEIGHT,
        },
      ],
      moving: {
        x: 0,
        width: STACK_BASE_WIDTH,
        y: STACK_HEIGHT - STACK_BLOCK_HEIGHT * 2,
        direction: 1,
      },
      speed: 2.2,
    }
  }

  function draw() {
    const canvas = canvasRef.current
    const state = stateRef.current

    if (!canvas || !state) return

    const ctx = canvas.getContext("2d")

    ctx.clearRect(0, 0, STACK_WIDTH, STACK_HEIGHT)

    ctx.fillStyle = readVar(canvas, "--arcade-screen", "#101828")
    ctx.fillRect(0, 0, STACK_WIDTH, STACK_HEIGHT)

    ctx.strokeStyle = readVar(
      canvas,
      "--arcade-screen-line",
      "rgba(145,180,255,0.15)"
    )

    for (let y = STACK_HEIGHT - STACK_BLOCK_HEIGHT; y > 0; y -= STACK_BLOCK_HEIGHT) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(STACK_WIDTH, y)
      ctx.stroke()
    }

    state.blocks.forEach((block, index) => {
      ctx.fillStyle =
        index === state.blocks.length - 1
          ? readVar(canvas, "--color-teal", "#7dc2bf")
          : readVar(canvas, "--arcade-accent", "#ebad47")

      ctx.fillRect(
        block.x,
        block.y,
        block.width,
        STACK_BLOCK_HEIGHT - 2
      )
    })

    if (status === "running") {
      ctx.fillStyle = readVar(canvas, "--arcade-text", "#edf4ff")
      ctx.fillRect(
        state.moving.x,
        state.moving.y,
        state.moving.width,
        STACK_BLOCK_HEIGHT - 2
      )
    }
  }

  function animate() {
    const state = stateRef.current

    if (!state || status !== "running") return

    const moving = state.moving

    moving.x += moving.direction * state.speed

    if (moving.x <= 0) {
      moving.x = 0
      moving.direction = 1
    }

    if (moving.x + moving.width >= STACK_WIDTH) {
      moving.x = STACK_WIDTH - moving.width
      moving.direction = -1
    }

    draw()
    animationRef.current = requestAnimationFrame(animate)
  }

  function start() {
    cancelAnimationFrame(animationRef.current)

    createState()
    setScore(0)
    setStatus("running")
  }

  function drop() {
    if (status !== "running") return

    const state = stateRef.current
    const previous = state.blocks[state.blocks.length - 1]
    const moving = state.moving

    const left = Math.max(previous.x, moving.x)
    const right = Math.min(
      previous.x + previous.width,
      moving.x + moving.width
    )

    const overlap = right - left

    if (overlap <= 0) {
      setStatus("over")
      return
    }

    const nextScore = score + 1

    state.blocks.push({
      x: left,
      width: overlap,
      y: moving.y,
    })

    state.speed = Math.min(6.5, state.speed + 0.18)

    setScore(nextScore)

    if (nextScore > best) {
      setBest(nextScore)
      writeScore(STACK_KEY, nextScore)
    }

    state.moving = {
      x: moving.direction === 1 ? 0 : STACK_WIDTH - overlap,
      width: overlap,
      y: moving.y - STACK_BLOCK_HEIGHT,
      direction: moving.direction === 1 ? 1 : -1,
    }

    if (state.moving.y < STACK_BLOCK_HEIGHT) {
      const offset = STACK_BLOCK_HEIGHT - state.moving.y

      state.blocks = state.blocks.map((block) => ({
        ...block,
        y: block.y + offset,
      }))

      state.moving.y += offset
    }

    draw()
  }

  useEffect(() => {
    if (status !== "running") {
      cancelAnimationFrame(animationRef.current)
      draw()
      return
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRef.current)
  }, [status, score])

  useEffect(() => {
    createState()
    draw()

    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault()
        drop()
      }
    }

    window.addEventListener("keydown", handleKey)

    return () => window.removeEventListener("keydown", handleKey)
  }, [status, score, best])

  return (
    <div className={styles.gameArea}>
      <div className={styles.scoreRow}>
        <span>height {score}</span>
        <span>best {best}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={STACK_WIDTH}
        height={STACK_HEIGHT}
        className={styles.stackCanvas}
        onClick={drop}
        onTouchEnd={drop}
      />

      {status !== "running" && (
        <button className={styles.primaryAction} onClick={start}>
          {status === "over" ? "play again" : "start"}
        </button>
      )}

      {status === "over" && (
        <p className={styles.statusText}>tower fell</p>
      )}

      <p className={styles.hintText}>click or press space to stack</p>
    </div>
  )
}

export default function ArcadeModal({ onClose }) {
  const [view, setView] = useState("menu")
  const [activeGame, setActiveGame] = useState(null)
  const [isBooted, setIsBooted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsBooted(true), 220)
    return () => clearTimeout(timeout)
  }, [])

  function openGame(id) {
    setActiveGame(id)
    setView("play")
  }

  function backToMenu() {
    setView("menu")
    setActiveGame(null)
  }

  const activeInfo = arcadeGames.find((game) => game.id === activeGame)

  const cabinetClass = [
    styles.cabinet,
    isBooted ? styles.cabinetReady : "",
    view === "play" ? styles.cabinetPlay : "",
  ]
    .join(" ")
    .trim()

  return (
    <Modal title="Arcade Corner" onClose={onClose} closeDelay={0}>
      <div className={cabinetClass}>
        {view === "menu" && (
          <div className={styles.screenShell}>
            <div className={styles.gameHeaderRow}>
              <span className={styles.gameMarker}>select a game</span>
              <span className={styles.gameMarkerAccent}>v3</span>
            </div>

            <div className={styles.menuGrid}>
              {arcadeGames.map((game) => {
                const Icon = GAME_ICONS[game.id]

                return (
                  <button
                    key={game.id}
                    className={styles.menuCard}
                    onClick={() => openGame(game.id)}
                  >
                    {Icon && <Icon className={styles.menuIcon} />}
                    <span className={styles.menuTitle}>{game.title}</span>
                    <span className={styles.menuBest}>
                      {getBestLabel(game.id)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {view === "play" && activeInfo && (
          <div className={`${styles.screenShell} ${styles.screenShellPlay}`}>
            <div className={styles.playHeader}>
              <button className={styles.backButton} onClick={backToMenu}>
                ← back
              </button>

              <span className={styles.playTitle}>
                {(() => {
                  const Icon = GAME_ICONS[activeInfo.id]
                  return Icon ? <Icon className={styles.playIcon} /> : null
                })()}

                {activeInfo.title}
              </span>
            </div>

            <p className={styles.descriptionText}>
              {activeInfo.description}
            </p>

            <div key={activeGame} className={styles.gameFade}>
              {activeGame === "reaction" && <ReactionGame />}
              {activeGame === "snake" && <SnakeGame />}
              {activeGame === "memory" && <MemoryGame />}
              {activeGame === "2048" && <Game2048 />}
              {activeGame === "tictactoe" && <TicTacToeGame />}
              {activeGame === "stack" && <StackGame />}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}