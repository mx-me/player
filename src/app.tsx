import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { Track, Tracklist } from './components/tracklist'
import './index.css'
import { Manager } from './manager'
import { Seek } from './components/seek'
import { Art } from './components/art'

export const AppContext = createContext<{
  track?: Track
  setTrack?: Dispatch<SetStateAction<Track | undefined>>
  isPlaying?: boolean
  manager?: Manager
}>({})

export default () => {
  const [track, setTrack] = useState<Track | undefined>(undefined)
  const [manager, setManager] = useState<Manager | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    const audioManager = new Manager()
    setManager(audioManager)

    const { audio } = audioManager

    audio.addEventListener('play', handlePlay, { signal })
    audio.addEventListener('pause', handlePause, { signal })
    audio.addEventListener('ended', handlePause, { signal })

    return () => {
      audioManager.destroy()
      controller.abort()
    }
  }, [])

  return (
    <AppContext
      value={{
        manager,
        setTrack,
        track,
        isPlaying,
      }}
    >
      <main>
        <Art />
        <Seek />
        <Tracklist />
      </main>
    </AppContext>
  )
}
