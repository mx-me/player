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
  audioManager?: Audio
}

export const AppContext = createContext<AppContext>({})

export function App() {
  const [track, setTrack] = useState<Track | undefined>(undefined)
  const [audioManager, setAudioManager] = useState<Audio | undefined>(undefined)
  const elementRef = useRef<HTMLAudioElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isReady) {
      setIsReady(true)
      return
    }

    if (!elementRef.current) return

    const manager = new Audio(elementRef.current)

    setAudioManager(manager)

    return () => {
      manager.destroy()
    }
  }, [isReady])

  if (!isReady) <main></main>

  return (
    <AppContext.Provider
      value={{
        audioManager,
        setTrack,
        track,
      }}
    >
      <audio ref={elementRef} crossOrigin='anonymous'></audio>
      <main>
        <Art />
        <Seek />
        <Tracklist />
        <button key={'play'} onClick={() => audioManager?.play()}>
          Play
        </button>
        <button key={'pause'} onClick={() => audioManager?.pause()}>
          Pause
        </button>
      </main>
    </AppContext.Provider>
  )
}

export default App
