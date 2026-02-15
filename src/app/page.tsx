"use client"

import dynamic from "next/dynamic"

const BlockPuzzleGame = dynamic(
    () =>
        import("@/components/BlockPuzzleGame/BlockPuzzleGame").then(
            (mod) => mod.BlockPuzzleGame
        ),
    { ssr: false }
)

export default function Home() {
  return <BlockPuzzleGame />
}
