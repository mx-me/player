import { AppContext } from '@/app'
import { useContext, useEffect, useState } from 'react'

export interface Track {
  id: number
  title: string
  location: string
  cover: string
  blurhash: string
}

export const Tracklist = () => {
  const { audioManager } = useContext(AppContext)
  const [tracks, setTracks] = useState<Track[]>()

  useEffect(() => {
    if (!audioManager) return

    const { abort, signal } = new AbortController()

    fetch('/tracks.json', { signal }).then((req) =>
      req.json().then((tracks) => {
        setTracks(tracks)
      }),
    )

    return () => {
      abort()
    }
  }, [audioManager])

  if (!tracks) {
    return <ul></ul>
  }

  return (
    <ul>
      {tracks.map((track) => (
        <li key={track.id} onClick={() => audioManager?.changeTrack(track)}>
          {track.title}
        </li>
      ))}
    </ul>
  )
}
