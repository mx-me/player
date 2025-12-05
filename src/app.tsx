import { createContext, RefObject, useEffect, useRef, useState } from 'react'
import { Tracklist } from './components/tracklist'
import './index.css'
import { Audio } from './audio'

interface AppContext {
  audioManager?: Audio
}

export const AppContext = createContext<AppContext>({})

export function App() {
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
      }}
    >
      <audio ref={elementRef} crossOrigin='anonymous'></audio>
      <main>
        <Tracklist />
        {/* <button onClick={() => audioManager?.play()}>Play</button> 
        <button onClick={() => audioManager?.pause()}>Pause</button> */}
      </main>
    </AppContext.Provider>
  )
}

export default App
