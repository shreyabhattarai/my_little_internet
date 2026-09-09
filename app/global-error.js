"use client"

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111624",
          color: "#f6efe2",
          fontFamily: "'Space Mono', 'Courier New', monospace",
          textAlign: "center",
          padding: "24px"
        }}
      >
        <div>
          <p style={{ fontSize: "28px", margin: "0 0 10px", color: "#ffc86f" }}>oops</p>
          <p style={{ margin: "0 0 18px", color: "#a5b3ce" }}>
            the whole page tripped this time, sorry about that
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "10px 20px",
              borderRadius: "4px",
              border: "1px solid rgba(187, 207, 236, 0.36)",
              background: "rgba(255,255,255,0.08)",
              color: "#f6efe2",
              cursor: "pointer"
            }}
          >
            try again
          </button>
        </div>
      </body>
    </html>
  )
}
