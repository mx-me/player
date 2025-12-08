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
  manager?: Manager
  setTrack?: Dispatch<SetStateAction<Track | undefined>>
  track?: Track
  isPlaying?: boolean
}>({})

export default () => {
  const [track, setTrack] = useState<Track | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [manager] = useState<Manager>(() => new Manager())

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    const { audio } = manager

    audio.addEventListener('play', handlePlay, { signal })
    audio.addEventListener('pause', handlePause, { signal })
    audio.addEventListener('ended', handlePause, { signal })

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <AppContext
      value={{
        manager,
        track,
        isPlaying,
        setTrack,
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
