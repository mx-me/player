import { AppContext } from '@/app'
import { memo, useContext, useEffect, useState } from 'react'

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
  }) => {
    return (
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
    )
  },
)

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

  const handleTrackClick = (track: Track) => {
    if (setTrack) setTrack(track)
    audioManager?.changeTrack(track)
  }

  return (
    <ul>
      {tracks.map((track) => (
        <TrackItem
          key={track.id}
          track={track}
          isActive={currentTrack?.id === track.id}
          color={audioManager?.color}
          onClick={handleTrackClick}
        />
      ))}
    </ul>
  )
}
