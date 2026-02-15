import type { Metadata, Viewport } from "next"
import React from "react"
import Script from "next/script";
import '../components/Footer/Footer.scss';
import '../assets/styles/global.css';

export const metadata: Metadata = {
    title: "Block Puzzle Game",
    description: "Play Block Puzzle Online",
    other: {
        "google-adsense-account": "ca-pub-2296093498264168",
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover', // Օգտագործում է ամբողջ էկրանը (ներառյալ notch-ի տակը)
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
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
