"use client"

import {useState, useCallback, useRef} from "react"

const GRID_SIZE = 10

const BLOCKS: number[][][] = [
    [[1, 1], [1, 1]],           // 2x2 square
    [[1, 1, 1]],                 // horizontal 3
    [[1], [1], [1]],             // vertical 3
    [[1, 1]],                    // horizontal 2
    [[1], [1]],                  // vertical 2
    [[1]],                       // single
    [[1, 1, 1, 1]],              // horizontal 4
    [[1], [1], [1], [1]],        // vertical 4
    [[1, 0], [1, 1]],            // L shape
    [[0, 1], [1, 1]],            // reverse L
    [[1, 1, 1], [1, 0, 0]],     // L shape large
    [[1, 1, 1], [0, 0, 1]],     // reverse L large
    [[1, 1, 1], [1, 1, 1], [1, 1, 1]], // 3x3
]

const getRandomBlock = () => BLOCKS[Math.floor(Math.random() * BLOCKS.length)]

const createEmptyGrid = () =>
    Array(GRID_SIZE)
        .fill(0)
        .map(() => Array(GRID_SIZE).fill(0))

interface BlockPiece {
    id: number
    shape: number[][]
}

function checkAndClear(board: number[][]): { newBoard: number[][]; cleared: number; clearingCells: Set<string> } {
    const newBoard = board.map((row) => [...row])
    const rowsToClear: number[] = []
    const colsToClear: number[] = []

    for (let r = 0; r < GRID_SIZE; r++) {
        if (newBoard[r].every((cell) => cell === 1)) rowsToClear.push(r)
    }
    for (let c = 0; c < GRID_SIZE; c++) {
        if (newBoard.every((row) => row[c] === 1)) colsToClear.push(c)
    }

    const clearingCells = new Set<string>()
    rowsToClear.forEach((r) => {
        for (let c = 0; c < GRID_SIZE; c++) clearingCells.add(`${r},${c}`)
    })
    colsToClear.forEach((c) => {
        for (let r = 0; r < GRID_SIZE; r++) clearingCells.add(`${r},${c}`)
    })

    rowsToClear.forEach((r) => (newBoard[r] = Array(GRID_SIZE).fill(0)))
    colsToClear.forEach((c) => newBoard.forEach((row) => (row[c] = 0)))

    const cleared = rowsToClear.length + colsToClear.length
    return { newBoard, cleared, clearingCells }
}

function canPlaceAnywhere(grid: number[][], shape: number[][]): boolean {
    for (let r = 0; r <= GRID_SIZE - shape.length; r++) {
        for (let c = 0; c <= GRID_SIZE - shape[0].length; c++) {
            let canPlace = true
            for (let sr = 0; sr < shape.length && canPlace; sr++) {
                for (let sc = 0; sc < shape[sr].length && canPlace; sc++) {
                    if (shape[sr][sc] === 1 && grid[r + sr][c + sc] === 1) {
                        canPlace = false
                    }
                }
            }
            if (canPlace) return true
        }
    }
    return false
}

export function useBlockPuzzle({sounds}: {
    sounds: {
        playClick: () => void;
        playPlace: () => void;
        playClear: () => void;
        playGameOver: () => void;
    }
}) {
    const [grid, setGrid] = useState<number[][]>(createEmptyGrid)
    const [blocks, setBlocks] = useState<BlockPiece[]>([
        { id: 1, shape: getRandomBlock() },
        { id: 2, shape: getRandomBlock() },
        { id: 3, shape: getRandomBlock() },
    ])
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [ghostPosition, setGhostPosition] = useState<{
        row: number
        col: number
        shape: number[][]
    } | null>(null)
    const [clearingCells, setClearingCells] = useState<Set<string>>(new Set())
    const [combo, setCombo] = useState(0)

    const gridRef = useRef<HTMLDivElement>(null)
    const activeBlockRef = useRef<{ id: number; shape: number[][] } | null>(null)

    const getGridPosition = useCallback(
        (absX: number, absY: number, shape: number[][]) => {
            if (!gridRef.current) return null
            const rect = gridRef.current.getBoundingClientRect()
            // Account for padding (p-1 = 4px) and the 1px margin on cells
            const gridInnerX = rect.left + 4
            const gridInnerY = rect.top + 4
            const cellStep = (rect.width - 8) / GRID_SIZE // total width minus padding, divided by cells

            const col = Math.round((absX - gridInnerX) / cellStep)
            const row = Math.round((absY - gridInnerY) / cellStep)

            if (
                row >= 0 &&
                col >= 0 &&
                row + shape.length <= GRID_SIZE &&
                col + shape[0].length <= GRID_SIZE
            ) {
                return { row, col }
            }
            return null
        },
        []
    )

    const canPlace = useCallback(
        (row: number, col: number, shape: number[][]) => {
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c] === 1 && grid[row + r][col + c] === 1) return false
                }
            }
            return true
        },
        [grid]
    )

    const handleDragStart = useCallback((_blockId: number, shape: number[][]) => {
        activeBlockRef.current = { id: _blockId, shape }
        sounds.playClick()
    }, [sounds.playClick])

    const handleDragMove = useCallback(
        (absX: number, absY: number) => {
            if (!activeBlockRef.current) return
            const { shape } = activeBlockRef.current
            const pos = getGridPosition(absX, absY, shape)
            if (pos && canPlace(pos.row, pos.col, shape)) {
                setGhostPosition({ row: pos.row, col: pos.col, shape })
            } else {
                setGhostPosition(null)
            }
        },
        [getGridPosition, canPlace]
    )

    const handleDragEnd = useCallback(
        (absX: number, absY: number) => {
            if (!activeBlockRef.current) return
            const { id, shape } = activeBlockRef.current
            activeBlockRef.current = null
            setGhostPosition(null)

            const pos = getGridPosition(absX, absY, shape)
            if (!pos || !canPlace(pos.row, pos.col, shape)) return

            sounds.playPlace()

            const { row, col } = pos

            // Place the block
            setGrid((prev) => {
                const next = prev.map((r) => [...r])
                for (let r = 0; r < shape.length; r++) {
                    for (let c = 0; c < shape[r].length; c++) {
                        if (shape[r][c] === 1) next[row + r][col + c] = 1
                    }
                }

                const { newBoard, cleared, clearingCells: cells } = checkAndClear(next)

                if (cleared > 0) {
                    sounds.playClear()
                    setClearingCells(cells)
                    setCombo((prev) => prev + 1)
                    setTimeout(() => setClearingCells(new Set()), 300)
                    sounds.playClear()


                    // Score: base points for cells placed + bonus for lines cleared
                    const cellCount = shape.flat().filter((c) => c === 1).length
                    const lineBonus = cleared * 100
                    setScore((prev) => {
                        const newScore = prev + cellCount + lineBonus
                        setHighScore((hi) => Math.max(hi, newScore))
                        return newScore
                    })
                } else {
                    const cellCount = shape.flat().filter((c) => c === 1).length
                    setScore((prev) => {
                        const newScore = prev + cellCount
                        setHighScore((hi) => Math.max(hi, newScore))
                        return newScore
                    })
                    setCombo(0)
                }

                // Replace the used block and check game over
                setBlocks((prevBlocks) => {
                    const newBlocks = prevBlocks.map((b) =>
                        b.id === id ? { ...b, shape: getRandomBlock() } : b
                    )

                    // Check if any remaining block can be placed
                    setTimeout(() => {
                        setGrid((currentGrid) => {
                            const anyPlaceable = newBlocks.some((b) =>
                                canPlaceAnywhere(currentGrid, b.shape)
                            )
                            if (!anyPlaceable) {
                                sounds.playGameOver()
                                setGameOver(true)
                            }
                            return currentGrid
                        })
                    }, 350)

                    return newBlocks
                })

                return cleared > 0 ? newBoard : next
            })
        },
        [getGridPosition, canPlace]
    )

    const handleDragCancel = useCallback(() => {
        activeBlockRef.current = null
        setGhostPosition(null)
    }, [])

    const resetGame = useCallback(() => {
        setGrid(createEmptyGrid())
        setBlocks([
            { id: 1, shape: getRandomBlock() },
            { id: 2, shape: getRandomBlock() },
            { id: 3, shape: getRandomBlock() },
        ])
        setScore(0)
        setGameOver(false)
        setCombo(0)
        setClearingCells(new Set())
    }, [])

    return {
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
    }
}
