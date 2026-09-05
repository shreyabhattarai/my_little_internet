"use client"

import { useState } from "react"
import styles from "./AccessibilityDrawer.module.css"
import { ZONES } from "@/lib/worldConfig"

const MODAL_ZONES = ZONES.filter((z) => z.type === "modal" && z.modal !== "photoFrame")

export default function AccessibilityDrawer({ onOpenModal }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className={styles.toggle} onClick={() => setOpen(true)}>
        text menu
      </button>

      {open && (
        <div className={styles.drawer} role="dialog" aria-label="Accessible text menu">
          <button className={styles.closeDrawer} onClick={() => setOpen(false)}>
            close menu
          </button>
          <h2 className={styles.drawerTitle}>My Little Internet, text version</h2>

          <div className={styles.section}>
            <p className={styles.sectionHeading}>rooms and objects</p>
            {MODAL_ZONES.map((zone) => (
              <button
                key={zone.id}
                className={styles.link}
                onClick={() => {
                  onOpenModal(zone.modal)
                  setOpen(false)
                }}
              >
                {zone.label}, {zone.hint}
              </button>
            ))}
          </div>

          <div className={styles.section}>
            <p className={styles.sectionHeading}>a note on this menu</p>
            <p style={{ fontSize: 13, color: "var(--color-muted)" }}>
              This menu opens the same content as the explorable room, without needing to move a
              character around. Keyboard users can also press tab to reach the canvas and use
              arrow keys or w a s d to walk, and enter to interact with whatever is nearby.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
