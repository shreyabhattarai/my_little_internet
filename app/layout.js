import "./globals.css"

export const metadata = {
  title: {
    default: "Shreya Bhattarai",
    template: "%s | Shreya Bhattarai"
  },
  description: "A playful personal website by Shreya Bhattarai, built as an explorable digital world.",
  applicationName: "My Little Internet",
  creator: "Shreya Bhattarai",
  publisher: "Shreya Bhattarai",
  category: "personal website",
  keywords: [
    "Shreya Bhattarai",
    "personal website",
    "explorable website",
    "digital world",
    "Nepal"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1
    }
  },
  openGraph: {
    title: "Shreya Bhattarai",
    description: "A playful personal website by Shreya Bhattarai, built as an explorable digital world.",
    siteName: "My Little Internet",
    type: "website",
    locale: "en_NP"
  },
  icons: {
    icon: "/favicon.jpeg",
    shortcut: "/favicon.jpeg",
    apple: "/favicon.jpeg"
  },
  twitter: {
    card: "summary",
    title: "Shreya Bhattarai",
    description: "A playful personal website by Shreya Bhattarai, built as an explorable digital world."
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
