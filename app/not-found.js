import Link from "next/link"
import styles from "./not-found.module.css"

export const metadata = {
  title: "Page not found | my little internet"
}

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span className={styles.lamp} aria-hidden="true" />
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>this room does not exist</h1>
        <p className={styles.text}>
          you wandered somewhere that was never built. maybe it got left as a
          future addition, maybe it never was one at all.
        </p>
        <Link href="/" className={styles.button}>
          back to the room
        </Link>
      </div>
    </main>
  )
}
