import { Manager } from '@/manager'
import { useEffect, useState } from 'react'

export const useAudioEvents = (manager: Manager) => {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const { audio } = manager

    const handleState = () => setIsPlaying(!audio.paused)

    audio.addEventListener('play', handleState, { signal })
    audio.addEventListener('pause', handleState, { signal })
    audio.addEventListener('ended', handleState, { signal })

    return () => {
      controller.abort()
    }
  }, [manager])

  return isPlaying
}