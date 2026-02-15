"use client"

import {useRef, useState} from "react"

export function useGameSounds() {
    const click = useRef<HTMLAudioElement | null>(null)
    const place = useRef<HTMLAudioElement | null>(null)
    const clear = useRef<HTMLAudioElement | null>(null)
    const gameover = useRef<HTMLAudioElement | null>(null)

    const [enabled, setEnabled] = useState(true)


    function init() {
        click.current = new Audio("/sounds/click.mp3")
        place.current = new Audio("/sounds/click.mp3")
        clear.current = new Audio("/sounds/pop-combo.mp3")
        gameover.current = new Audio("/sounds/win.mp3")

        click.current.volume = 0.4
        place.current.volume = 0.5
        clear.current.volume = 0.6
        gameover.current.volume = 0.7
    }

    function play(sound: HTMLAudioElement | null) {
        if (!sound || !enabled) return
        sound.currentTime = 0
        sound.play().then(r => r)
    }

    function toggle() {
        setEnabled(prev => {
            const next = !prev

            if (!next) {
                // stop all sounds immediately
                ;[click.current, place.current, clear.current, gameover.current]
                    .forEach(sound => {
                        if (sound) {
                            sound.pause()
                            sound.currentTime = 0
                        }
                    })
            }

            return next
        })
    }

    return {
        init,
        enabled,
        toggle,
        playClick: () => play(click.current),
        playPlace: () => play(place.current),
        playClear: () => play(clear.current),
        playGameOver: () => play(gameover.current),
    }
}