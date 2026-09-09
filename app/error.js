"use client"

import { useEffect } from "react"
import styles from "./not-found.module.css"

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Keep a trace in the console for debugging, nothing sent anywhere
    console.error(error)
  }, [error])

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span className={styles.lamp} aria-hidden="true" />
        <p className={styles.code}>oops</p>
        <h1 className={styles.title}>something tripped over a cable</h1>
        <p className={styles.text}>
          the room hit a snag loading. try again, it usually sorts itself out.
        </p>
        <button type="button" className={styles.button} onClick={reset}>
          try again
        </button>
      </div>
    </main>
  )
}
