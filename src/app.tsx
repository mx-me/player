import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Track, Tracklist } from './components/tracklist'
import './index.css'
import { Audio } from './audio'
import { Seek } from './components/seek'
import { Art } from './components/art'

interface AppContext {
  track?: Track
  setTrack?: Dispatch<SetStateAction<Track | undefined>>
  isPlaying?: boolean
  setIsPlaying?: Dispatch<SetStateAction<boolean>>
  audioManager?: Audio
}

export const AppContext = createContext<AppContext>({})

export function App() {
  const [track, setTrack] = useState<Track | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [audioManager, setAudioManager] = useState<Audio | undefined>(undefined)
  const elementRef = useRef<HTMLAudioElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isReady) {
      setIsReady(true)
      return
    }

    if (!elementRef.current) return

    const controller = new AbortController()
    const { signal } = controller

    const manager = new Audio(elementRef.current)

    elementRef.current.addEventListener(
      'play',
      () => {
        setIsPlaying(true)
      },
      { signal },
    )

    elementRef.current.addEventListener(
      'pause',
      () => {
        setIsPlaying(false)
      },
      { signal },
    )

    elementRef.current.addEventListener(
      'ended',
      () => {
        setIsPlaying(false)
        console.log(track)
      },
      { signal },
    )

    setAudioManager(manager)

    return () => {
      manager.destroy()
      controller.abort()
    }
  }, [isReady])

  if (!isReady) <main></main>

  return (
    <AppContext.Provider
      value={{
        audioManager,
        setTrack,
        track,
        setIsPlaying,
        isPlaying,
      }}
    >
      <audio ref={elementRef} crossOrigin='anonymous'></audio>
      <main>
        <Art />
        <Seek />
        <Tracklist />
      </main>
    </AppContext.Provider>
  )
}

export default App
