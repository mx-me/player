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
  const { audioManager, setTrack, track: currentTrack } = useContext(AppContext)
  const [tracks, setTracks] = useState<Track[]>()

  useEffect(() => {
    if (!audioManager) return

    const controller = new AbortController()
    const { signal } = controller

    fetch('/tracks.json', { signal }).then((req) =>
      req.json().then((tracks) => {
        setTracks(tracks)
      }),
    )

    return () => {
      controller.abort()
    }
  }, [audioManager])

  if (!tracks) {
    return <ul></ul>
  }

  return (
    <ul>
      {tracks.map((track) => (
        <li
          key={track.id}
          onClick={() => {
            if (setTrack) setTrack(track)
            audioManager?.changeTrack(track)
          }}
          style={
            currentTrack && track.id === currentTrack.id && audioManager?.color
              ? {
                  backgroundColor: `rgba(${audioManager.color.join(',')},0.3)`,
                }
              : {}
          }
        >
          {track.title}
        </li>
      ))}
    </ul>
  )
}
