import { AppContext } from '@/app'
import { useContext, useEffect, useRef } from 'react'

export const Seek = () => {
  const { audioManager } = useContext(AppContext)
  const progressRef = useRef<HTMLProgressElement>(null)

  useEffect(() => {
    if (!audioManager) return

    const { abort, signal } = new AbortController()

    audioManager.element.addEventListener(
      'timeupdate',
      (event) => {
        if (!progressRef.current) return

        const audio = event.target as HTMLAudioElement

        if (audio.duration > 0) {
          progressRef.current.value = audio.currentTime
          progressRef.current.max = Math.round(audio.duration)
        }

        console.log(audio.seekable)
      },
      { signal },
    )

    return () => {
      abort()
    }
  }, [audioManager])

  return <progress value={0} max={1} ref={progressRef} />
}
