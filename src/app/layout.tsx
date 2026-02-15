import type { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
    title: "Block Puzzle Game",
    description: "Play Block Puzzle Online",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    )
}
