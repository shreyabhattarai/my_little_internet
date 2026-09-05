"use client"

import { useEffect, useRef, useState } from "react"
import Modal from "../Modal"
import shared from "../panelContent.module.css"
import styles from "./ArcadeModal.module.css"
import { arcadeGames } from "@/lib/rooms"

function ClickerGame() {
  const [count, setCount] = useState(0)
  return (
    <div className={styles.gameArea}>
      <p className={shared.smallText}>score, {count}</p>
      <button className={shared.button} onClick={() => setCount((c) => c + 1)}>
        click me
      </button>
    </div>
  )
}

function ReactionGame() {
  const [state, setState] = useState("idle")
  const [message, setMessage] = useState("press start when ready")
  const startTimeRef = useRef(null)
  const timeoutRef = useRef(null)

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
      setMessage("reaction time " + reaction + " milliseconds")
    }
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return (
    <div className={styles.gameArea}>
      <div
        className={styles.reactionBox}
        style={{ background: state === "go" ? "#4c8c5a" : "#3a416b" }}
        onClick={handleClick}
      >
        {message}
      </div>
      <button className={shared.button} onClick={start} disabled={state === "waiting"}>
        start
      </button>
    </div>
  )
}

function GuessGame() {
  const [target, setTarget] = useState(() => Math.ceil(Math.random() * 20))
  const [guess, setGuess] = useState("")
  const [message, setMessage] = useState("guess a number between 1 and 20")

  function submitGuess() {
    const num = Number(guess)
    if (!num) return
    if (num === target) {
      setMessage("correct, a new number has been chosen")
      setTarget(Math.ceil(Math.random() * 20))
    } else if (num < target) {
      setMessage("higher")
    } else {
      setMessage("lower")
    }
    setGuess("")
  }

  return (
    <div className={styles.gameArea}>
      <p className={shared.smallText}>{message}</p>
      <input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        style={{ width: 80, textAlign: "center", padding: 6, borderRadius: 4, border: "1px solid #3a416b", background: "#1c2140", color: "#f2ead9" }}
      />
      <button className={shared.button} onClick={submitGuess}>
        guess
      </button>
    </div>
  )
}

export default function ArcadeModal({ onClose }) {
  const [activeGame, setActiveGame] = useState(arcadeGames[0].id)

  return (
    <Modal title="Arcade Corner" onClose={onClose}>
      <div className={styles.gameList}>
        {arcadeGames.map((game) => (
          <button
            key={game.id}
            className={
              game.id === activeGame ? styles.gameButton + " " + styles.gameButtonActive : styles.gameButton
            }
            onClick={() => setActiveGame(game.id)}
          >
            {game.title}
          </button>
        ))}
      </div>

      <p className={shared.smallText}>
        {arcadeGames.find((g) => g.id === activeGame)?.description}
      </p>

      {activeGame === "clicker" && <ClickerGame />}
      {activeGame === "reaction" && <ReactionGame />}
      {activeGame === "guess" && <GuessGame />}
    </Modal>
  )
}
