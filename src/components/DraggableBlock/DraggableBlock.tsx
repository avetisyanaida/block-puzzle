"use client"

import styles from "./DraggableBlock.module.scss"

import React, { useRef, useCallback, useEffect } from "react"

interface DraggableBlockProps {
    block: number[][]
    blockId: number
    cellSize: number
    previewCellSize: number
    onDragStart: (blockId: number, shape: number[][]) => void
    onDragMove: (absX: number, absY: number) => void
    onDragEnd: (absX: number, absY: number) => void
    onDragCancel: () => void
    disabled: boolean
}

export function DraggableBlock({
                                   block,
                                   blockId,
                                   cellSize,
                                   previewCellSize,
                                   onDragStart,
                                   onDragMove,
                                   onDragEnd,
                                   onDragCancel,
                                   disabled,
                               }: DraggableBlockProps) {
    const isDragging = useRef(false)
    const dragRef = useRef<HTMLDivElement | null>(null)
    const ghostRef = useRef<HTMLDivElement | null>(null)
    const offsetRef = useRef({ x: 0, y: 0 })

    const createGhostElement = useCallback(
        (startX: number, startY: number, rect: DOMRect) => {
            const ghost = document.createElement("div")
            ghost.style.position = "fixed"
            ghost.style.pointerEvents = "none"
            ghost.style.zIndex = "9999"
            ghost.style.opacity = "0.9"
            ghost.style.transition = "transform 0.05s ease-out"

            // Render the block shape in the ghost at full grid cell size
            block.forEach((row) => {
                const rowDiv = document.createElement("div")
                rowDiv.style.display = "flex"
                row.forEach((cell) => {
                    const cellDiv = document.createElement("div")
                    cellDiv.style.width = `${cellSize}px`
                    cellDiv.style.height = `${cellSize}px`
                    cellDiv.style.margin = "1px"
                    cellDiv.style.borderRadius = "3px"
                    if (cell === 1) {
                        cellDiv.style.backgroundColor = "hsl(var(--primary))"
                        cellDiv.style.boxShadow = "inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.2)"
                    } else {
                        cellDiv.style.backgroundColor = "transparent"
                    }
                    rowDiv.appendChild(cellDiv)
                })
                ghost.appendChild(rowDiv)
            })

            // Calculate the full block dimensions at grid cell size
            const blockWidth = block[0].length * (cellSize + 2)
            const blockHeight = block.length * (cellSize + 2)

            // Scale factor from preview to full size
            const scaleX = (rect.width) / blockWidth
            const scaleY = (rect.height) / blockHeight

            // Offset: where within the preview the user clicked, scaled to full-size coords
            offsetRef.current = {
                x: (startX - rect.left) / scaleX,
                y: (startY - rect.top) / scaleY,
            }

            // Position ghost so the block is centered under cursor with upward offset
            const liftOffset = cellSize * 2
            ghost.style.left = `${startX - offsetRef.current.x}px`
            ghost.style.top = `${startY - offsetRef.current.y - liftOffset}px`

            document.body.appendChild(ghost)
            ghostRef.current = ghost
        },
        [block, cellSize]
    )

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (disabled) return
            e.preventDefault()
            isDragging.current = true
            const rect = dragRef.current!.getBoundingClientRect()
            createGhostElement(e.clientX, e.clientY, rect)
            onDragStart(blockId, block)
            ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
        },
        [block, blockId, disabled, createGhostElement, onDragStart]
    )

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isDragging.current || !ghostRef.current) return
            const liftOffset = cellSize * 2
            ghostRef.current.style.left = `${e.clientX - offsetRef.current.x}px`
            ghostRef.current.style.top = `${e.clientY - offsetRef.current.y - liftOffset}px`
            onDragMove(e.clientX - offsetRef.current.x, e.clientY - offsetRef.current.y - liftOffset)
        },
        [cellSize, onDragMove]
    )

    const handlePointerUp = useCallback(
        (e: React.PointerEvent) => {
            if (!isDragging.current) return
            isDragging.current = false
            if (ghostRef.current) {
                ghostRef.current.remove()
                ghostRef.current = null
            }
            const liftOffset = cellSize * 2
            onDragEnd(e.clientX - offsetRef.current.x, e.clientY - offsetRef.current.y - liftOffset)
        },
        [cellSize, onDragEnd]
    )

    const handlePointerCancel = useCallback(() => {
        if (!isDragging.current) return
        isDragging.current = false
        if (ghostRef.current) {
            ghostRef.current.remove()
            ghostRef.current = null
        }
        onDragCancel()
    }, [onDragCancel])

    useEffect(() => {
        return () => {
            if (ghostRef.current) {
                ghostRef.current.remove()
            }
        }
    }, [])

    return (
        <div
            ref={dragRef}
            className={`${styles.blockWrapper} ${
                disabled ? styles.disabled : ""
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            style={{ touchAction: "none" }}
        >
            {block.map((row, rIdx) => (
                <div key={rIdx} className={styles.row}>
                    {row.map((cell, cIdx) => (
                        <div
                            key={cIdx}
                            className={`${styles.cell} ${
                                cell === 1 ? styles.filled : styles.empty
                            }`}
                            style={{
                                width: previewCellSize,
                                height: previewCellSize,
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    )

}
