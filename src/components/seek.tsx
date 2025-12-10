import { AppContext } from '@/app'
import { use, useEffect, useRef } from 'react'
import './seek.css'

export const Seek = () => {
  const { manager: audioManager, track } = use(AppContext)

  const progressRef = useRef<HTMLDivElement>(null)
  const seekRef = useRef<HTMLDivElement>(null)
  const bufferRef = useRef<HTMLDivElement>(null)

  const isDragging = useRef(false)
  const wasPlaying = useRef(false)

  useEffect(() => {
    if (seekRef.current) seekRef.current.style.width = '0%'
    if (bufferRef.current) bufferRef.current.style.width = '0%'

    if (!audioManager || !track) return

    const { audio } = audioManager
    let animationFrameId: number

    const updateProgress = () => {
      if (!seekRef.current || !bufferRef.current) return

      const { currentTime, duration, buffered } = audio

      const validDuration = duration > 0 && isFinite(duration)

      if (!isDragging.current && validDuration) {
        const percent = (currentTime / duration) * 100
        seekRef.current.style.width = `${percent}%`
      }

      if (buffered.length > 0 && validDuration) {
        for (let i = 0; i < buffered.length; i++) {
          if (
            buffered.start(i) <= currentTime &&
            buffered.end(i) >= currentTime
          ) {
            const bufferEnd = buffered.end(i)
            const bufferPercent = (bufferEnd / duration) * 100
            bufferRef.current.style.width = `${bufferPercent}%`
            break
          }
        }
      }

      animationFrameId = requestAnimationFrame(updateProgress)
    }

    animationFrameId = requestAnimationFrame(updateProgress)

    const handleSeekVisuals = (clientX: number, rect: DOMRect) => {
      if (!seekRef.current) return

      const offsetX = clientX - rect.left
      let seekPercent = offsetX / rect.width

      seekPercent = Math.max(0, Math.min(1, seekPercent))

      seekRef.current.style.width = `${seekPercent * 100}%`

      return seekPercent
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!progressRef.current || !audio.duration) return

      const target = e.currentTarget as HTMLDivElement
      target.setPointerCapture(e.pointerId)

      isDragging.current = true

      wasPlaying.current = !audio.paused
      audio.pause()

      const rect = progressRef.current.getBoundingClientRect()
      handleSeekVisuals(e.clientX, rect)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !progressRef.current) return

      const rect = progressRef.current.getBoundingClientRect()
      handleSeekVisuals(e.clientX, rect)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging.current || !progressRef.current) return

      isDragging.current = false

      const target = e.currentTarget as HTMLDivElement
      target.releasePointerCapture(e.pointerId)

      const rect = progressRef.current.getBoundingClientRect()
      const seekPercent = handleSeekVisuals(e.clientX, rect)

      if (seekPercent !== undefined && isFinite(audio.duration)) {
        audio.currentTime = seekPercent * audio.duration
      }

      if (wasPlaying.current) {
        audioManager.play()
      }
    }

    const progressBar = progressRef.current
    if (progressBar) {
      progressBar.addEventListener('pointerdown', onPointerDown)
      progressBar.addEventListener('pointermove', onPointerMove)
      progressBar.addEventListener('pointerup', onPointerUp)
      progressBar.addEventListener('pointercancel', onPointerUp)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (progressBar) {
        progressBar.removeEventListener('pointerdown', onPointerDown)
        progressBar.removeEventListener('pointermove', onPointerMove)
        progressBar.removeEventListener('pointerup', onPointerUp)
        progressBar.removeEventListener('pointercancel', onPointerUp)
      }
    }
  }, [audioManager, track])

  return (
    <div
      className='progress-container'
      ref={progressRef}
      role='slider'
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label='Audio Progress'
    >
      <div className='seek' ref={seekRef}></div>
      <div className='buffered' ref={bufferRef}></div>
    </div>
  )
}
