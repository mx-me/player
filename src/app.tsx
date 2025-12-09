import { createContext, Dispatch, SetStateAction, useState } from 'react'
import { Track, Tracklist } from './components/tracklist'
import { Manager } from './manager'
import { Seek } from './components/seek'
import { Art } from './components/art'
import { useAudioEvents } from './hooks/audio-events'
import './index.css'

export const AppContext = createContext<{
  manager?: Manager
  setTrack?: Dispatch<SetStateAction<Track | undefined>>
  track?: Track
  isPlaying?: boolean
}>({})

export default () => {
  const [track, setTrack] = useState<Track | undefined>()
  const [manager] = useState<Manager>(() => new Manager())
  const isPlaying = useAudioEvents(manager)

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
