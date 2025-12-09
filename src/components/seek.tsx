import { AppContext } from '@/app'
import { use, useEffect, useRef } from 'react'
import './seek.css'

export const Seek = () => {
  const { manager: audioManager, track } = use(AppContext)
  const progressRef = useRef<HTMLDivElement>(null)
  const seekRef = useRef<HTMLDivElement>(null)
  const bufferRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (seekRef.current) seekRef.current.style.width = '0%'
    if (bufferRef.current) bufferRef.current.style.width = '0%'

    if (!audioManager || !track) return

    const { audio } = audioManager
    const controller = new AbortController()
    const { signal } = controller

    audio.addEventListener(
      'timeupdate',
      () => {
        requestAnimationFrame(() => {
          if (!seekRef.current || !bufferRef.current) return

          const { currentTime, duration, buffered } = audio

          if (duration > 0 && currentTime && duration) {
            seekRef.current.style.width = `${(currentTime / duration) * 100}%`
          }

          if (buffered.length > 0) {
            const bufferEnd = buffered.end(buffered.length - 1)
            bufferRef.current.style.width = `${(bufferEnd * 100) / duration}%`
          }
        })
      },
      { signal },
    )

    let seeking = false
    let rect: DOMRect | null = null

    const seekTo = (clientX: number) => {
      if (
        !progressRef.current ||
        !rect ||
        !audio.duration ||
        !isFinite(audio.duration)
      ) {
        return
      }

      const { duration } = audio

      const offsetX = clientX - rect.left
      let seekPercent = offsetX / rect.width

      if (!seekPercent) return
      if (seekPercent < 0) seekPercent = 0
      if (seekPercent > 1) seekPercent = 1

      if (seekRef.current) {
        seekRef.current.style.width = `${seekPercent * 100}%`
      }

      audio.currentTime = seekPercent * duration
    }

    progressRef.current?.addEventListener(
      'pointerdown',
      (event) => {
        if (!progressRef.current) return

        seeking = true
        audioManager.pause()

        rect = progressRef.current.getBoundingClientRect()

        seekTo(event.clientX)
      },
      { signal },
    )

    window.addEventListener(
      'pointermove',
      (event: PointerEvent) => {
        if (!seeking || !progressRef.current) return

        seekTo(event.clientX)
      },
      { signal },
    )

    window.addEventListener(
      'pointerup',
      (event: PointerEvent) => {
        if (!seeking || !progressRef.current) return
        seeking = false

        seekTo(event.clientX)

        audioManager.play()
      },
      { signal },
    )

    return () => {
      controller.abort()
    }
  }, [audioManager, track])

  return (
    <div className='progress-container' ref={progressRef}>
      <div className='seek' ref={seekRef}></div>
      <div className='buffered' ref={bufferRef}></div>
    </div>
  )
}
