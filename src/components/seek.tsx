import { AppContext } from '@/app'
import { useContext, useEffect, useRef } from 'react'

export const Seek = () => {
  const { audioManager } = useContext(AppContext)
  const progressRef = useRef<HTMLDivElement>(null)
  const seekRef = useRef<HTMLDivElement>(null)
  const bufferRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!audioManager) return

    const { abort, signal } = new AbortController()

    audioManager.element.addEventListener(
      'timeupdate',
      (event) => {
        if (!seekRef.current || !bufferRef.current) return

        const audio = event.target as HTMLAudioElement

        if (audio.duration > 0) {
          seekRef.current.style.width = `${(audio.currentTime / audio.duration) * 100}%`
        }

        if (audio.buffered.length) {
          const buffered = audio.buffered.end(audio.buffered.length - 1)
          bufferRef.current.style.width = `${(buffered * 100) / audio.duration}%`
        }
      },
      { signal },
    )

    let seeking = false

    const seekTo = (offsetX: number) => {
      if (!progressRef.current || !seekRef.current) return

      const { duration } = audioManager.element
      if (!duration) return

      let seekPercent = offsetX / progressRef.current.offsetWidth

      if (seekPercent < 0) seekPercent = 0
      if (seekPercent > 1) seekPercent = 1

      audioManager.element.currentTime = seekPercent * duration
    }

    progressRef.current?.addEventListener(
      'pointerdown',
      (event) => {
        seeking = true
        audioManager.pause()
        seekTo(event.offsetX)
      },
      { signal },
    )

    addEventListener(
      'pointermove',
      (event: PointerEvent) => {
        if (!seeking || !progressRef.current) return
        seekTo(event.clientX - progressRef.current.offsetLeft)
      },
      { signal },
    )

    addEventListener(
      'pointerup',
      (event: PointerEvent) => {
        if (!seeking || !progressRef.current) return
        seeking = false
        seekTo(event.clientX - progressRef.current.offsetLeft)
        audioManager.play()
      },
      { signal },
    )

    return () => {
      abort()
    }
  }, [audioManager])

  return (
    <div className='progress-container' ref={progressRef}>
      <div className='seek' ref={seekRef}></div>
      <div className='buffered' ref={bufferRef}></div>
    </div>
  )
}
