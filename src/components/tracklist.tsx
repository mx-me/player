import { AppContext } from '@/app'
import { memo, useContext, useEffect, useState } from 'react'
import './tracklist.css'

export interface Track {
  id: number
  title: string
  location: string
  cover: string
  blurhash: string
}

const TrackItem = memo(
  ({
    track,
    isActive,
    color,
    onClick,
  }: {
    track: Track
    isActive: boolean
    color?: number[]
    onClick: (track: Track) => void
  }) => (
    <li
      onClick={() => onClick(track)}
      style={
        isActive && color
          ? {
              backgroundColor: `rgba(${color.join(',')},0.3)`,
            }
          : {}
      }
    >
      {track.title}
    </li>
  ),
)

export const Tracklist = () => {
  const { manager, track: currentTrack, setTrack } = useContext(AppContext)
  const [tracks, setTracks] = useState<Track[]>()

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    fetch('/tracks.json', { signal })
      .then((req) =>
        req.json().then((tracks) => {
          setTracks(tracks)
        }),
      )
      .catch(() => {})

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <ul>
      {tracks
        ? tracks.map((track) => (
            <TrackItem
              key={track.id}
              track={track}
              isActive={currentTrack?.id === track.id}
              color={manager?.color}
              onClick={(track) => {
                if (setTrack) setTrack(track)
                manager?.changeTrack(track)
              }}
            />
          ))
        : ''}
    </ul>
  )
}
