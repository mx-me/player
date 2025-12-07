import { AppContext } from '@/app'
import { useContext, useEffect, useRef } from 'react'

export const Seek = () => {
  const { audioManager, track } = useContext(AppContext)
  const progressRef = useRef<HTMLDivElement>(null)
  const seekRef = useRef<HTMLDivElement>(null)
  const bufferRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (seekRef.current) seekRef.current.style.width = '0%'
    if (bufferRef.current) bufferRef.current.style.width = '0%'

    if (!audioManager || !track) return

    const { element } = audioManager
    const controller = new AbortController()
    const { signal } = controller

    element.addEventListener(
      'timeupdate',
      () => {
        requestAnimationFrame(() => {
          if (!seekRef.current || !bufferRef.current) return

          const { currentTime, duration, buffered } = element

          if (duration > 0) {
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
      if (!progressRef.current || !rect || !element.duration) return

      const { duration } = element
      if (!duration) return

      const offsetX = clientX - rect.left
      let seekPercent = offsetX / rect.width

      if (seekPercent < 0) seekPercent = 0
      if (seekPercent > 1) seekPercent = 1

      if (seekRef.current) {
        seekRef.current.style.width = `${seekPercent * 100}%`
      }

      element.currentTime = seekPercent * duration
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
