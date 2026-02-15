"use client"


import styles from "./BlockPuzzleGame.module.scss"

import { useEffect, useState } from "react"
import { RotateCcw, Trophy } from "lucide-react"

import { useGameSounds } from "@/hooks/useGameSounds"

import { Volume2, VolumeX } from "lucide-react"
import {GameGrid} from "@/components/GameGrid/GameGrid";
import {DraggableBlock} from "@/components/DraggableBlock/DraggableBlock";
import {useBlockPuzzle} from "@/hooks/useBlockPuzzle";

const GRID_SIZE = 10



function useResponsiveCellSize() {
    const [cellSize, setCellSize] = useState(36)


    useEffect(() => {
        function calculate() {
            const maxWidth = Math.min(window.innerWidth - 48, 420)
            const available = maxWidth - 8 - GRID_SIZE * 2
            setCellSize(Math.floor(available / GRID_SIZE))
        }
        calculate()
        window.addEventListener("resize", calculate)
        return () => window.removeEventListener("resize", calculate)
    }, [])

    return cellSize
}

export function BlockPuzzleGame() {
    const cellSize = useResponsiveCellSize()
    const previewCellSize = Math.floor(cellSize * 0.6)

    const [timeLeft, setTimeLeft] = useState(90)
    const [timeOver, setTimeOver] = useState(false)
    const {
        init,
        playClick,
        playPlace,
        playClear,
        playGameOver,
        enabled,
        toggle,
        playCombo,
    } = useGameSounds()

    useEffect(() => {
        init()
    }, [])

    const {
        grid,
        blocks,
        score,
        highScore,
        gameOver,
        ghostPosition,
        clearingCells,
        combo,
        gridRef,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleDragCancel,
        resetGame,
    } = useBlockPuzzle({
        sounds: {
            playClick,
            playPlace,
            playClear,
            playGameOver,
            playCombo
        }
    })

    // TIMER LOGIC (ոչ մի existing logic չենք քանդում)
    useEffect(() => {
        if (gameOver || timeOver) return

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setTimeOver(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [gameOver, timeOver])

    useEffect(() => {
        if (combo > 0 && !gameOver && !timeOver) {
            let bonus = 0

            if (combo === 1) bonus = 9
            else if (combo === 2) bonus = 13
            else if (combo >= 3) bonus = 19

            playCombo()

            setTimeLeft((prev) => prev + bonus)
        }
    }, [combo])

    return (
        <div className={styles.wrapper}>

            <h2>BLOCK PUZZLE GAME</h2>

            {/* Sound Button */}
            <button onClick={toggle} className={styles.soundButton}>
                {enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {/* Header */}
            <div className={styles.header}>

                <div className={styles.stat}>
                    <span className={styles.label}>Score</span>
                    <span className={styles.score}>{score}</span>
                </div>

                <div className={styles.statCenter}>
                    <span className={styles.label}>Time</span>
                    <span
                        className={`${styles.time} ${
                            timeLeft <= 10 ? styles.timeDanger : ""
                        }`}
                    >
        {timeLeft}s
      </span>
                </div>

                <div className={styles.statRight}>
                    <span className={styles.label}>Best</span>
                    <div className={styles.bestRow}>
                        <Trophy size={16} />
                        <span className={styles.score}>{highScore}</span>
                    </div>
                </div>

            </div>

            {/* Combo */}
            {combo > 1 && (
                <div className={styles.combo}>
                    {combo}x Combo!
                </div>
            )}

            {/* Grid */}
            <div className={styles.gridWrapper} ref={gridRef}>
                <GameGrid
                    grid={grid}
                    cellSize={cellSize}
                    ghostPosition={ghostPosition}
                    clearingCells={clearingCells}
                />
            </div>

            {/* Block Tray */}
            <div className={styles.tray}>
                {blocks.map((b: any) => (
                    <DraggableBlock
                        key={b.id}
                        block={b.shape}
                        blockId={b.id}
                        cellSize={cellSize}
                        previewCellSize={previewCellSize}
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                        disabled={gameOver || timeOver}
                    />
                ))}
            </div>

            {/* TIME OVER */}
            {timeOver && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>Time's Up!</h2>

                        <div>
                            <div className={styles.finalScore}>{score}</div>
                            <span>Final Score</span>
                        </div>

                        <button
                            onClick={() => {
                                setTimeLeft(90)
                                setTimeOver(false)
                                resetGame()
                            }}
                            className={styles.playButton}
                        >
                            <RotateCcw size={20} />
                            Play Again
                        </button>
                    </div>
                </div>
            )}

            {/* GAME OVER */}
            {gameOver && !timeOver && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>Game Over</h2>

                        <div>
                            <div className={styles.finalScore}>{score}</div>
                            <span>Final Score</span>
                        </div>

                        {score >= highScore && score > 0 && (
                            <div className={styles.newHighScore}>
                                <Trophy size={16} />
                                New High Score!
                            </div>
                        )}

                        <button
                            onClick={resetGame}
                            className={styles.playButton}
                        >
                            <RotateCcw size={20} />
                            Play Again
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className={styles.footer}>
                <a style={{color: 'white'}} href="/about">About</a>
                <a style={{color: "white"}} href="/privacy">Privacy Policy</a>
            </footer>

        </div>
    )
}