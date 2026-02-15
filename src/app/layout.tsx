import type { Metadata } from "next"
import React from "react"
import Script from "next/script";
import '../components/Footer/Footer.scss';

export const metadata: Metadata = {
    title: "Block Puzzle Game",
    description: "Play Block Puzzle Online",
    other: {
        "google-adsense-account": "ca-pub-2296093498264168",
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body style={{height: '100vh'}}>
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2296093498264168"
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
        {children}
        </body>
        </html>
    )
}
