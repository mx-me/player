import {
  createContext,
  Ref,
  RefObject,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { Tracklist } from './components/tracklist'
import './index.css'

interface AppContext {
  currentTrack: string
  audio: RefObject<AudioContext | null>
}

export const AppContext = createContext<AppContext | null>(null)

export function App() {
  const audioRef = useRef<AudioContext>(null)

  useEffect(() => {
    audioRef.current = new AudioContext()

    return () => {
      if (audioRef.current && audioRef.current.state !== 'closed') {
        audioRef.current.close()
      }
    }
  }, [])

  return (
    <AppContext
      value={{
        currentTrack: '',
        audio: audioRef,
      }}
    >
      <main>
        <Tracklist />
      </main>
    </AppContext>
  )
}

export default App
