"use client"

import styles from "./GameGrid.module.scss";

const GRID_SIZE = 10

interface GameGridProps {
    grid: number[][]
    cellSize: number
    ghostPosition: { row: number; col: number; shape: number[][] } | null
    clearingCells: Set<string>
}

export function GameGrid({
                             grid,
                             cellSize,
                             ghostPosition,
                             clearingCells,
                         }: GameGridProps) {
    const ghostCells = new Set<string>()

    if (ghostPosition) {
        const { row, col, shape } = ghostPosition
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] === 1) {
                    ghostCells.add(`${row + r},${col + c}`)
                }
            }
        }
    }

    return (
        <div
            className={styles.gridContainer}
            style={{ touchAction: "none" }}
        >
            {grid.map((row, rIdx) => (
                <div key={rIdx} className={styles.row}>
                    {row.map((cell, cIdx) => {
                        const key = `${rIdx},${cIdx}`
                        const isGhost = ghostCells.has(key)
                        const isClearing = clearingCells.has(key)
                        const isFilled = cell === 1

                        let cellClass = styles.cell

                        if (isFilled && !isClearing) {
                            cellClass += ` ${styles.filled}`
                        } else if (isFilled && isClearing) {
                            cellClass += ` ${styles.clearing}`
                        } else if (!isFilled && isGhost) {
                            cellClass += ` ${styles.ghost}`
                        } else {
                            cellClass += ` ${styles.empty}`
                        }

                        return (
                            <div
                                key={cIdx}
                                className={cellClass}
                                style={{
                                    width: cellSize,
                                    height: cellSize,
                                }}
                            />
                        )
                    })}
                </div>
            ))}
        </div>
    )
}
