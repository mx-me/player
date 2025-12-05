import { AppContext } from '@/app'
import { useContext, useEffect, useState } from 'react'

interface Track {
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
    return <section>loading tracks...</section>
  }

  return (
    <section>
      <ul>
        {tracks.map(({ blurhash, cover, id, location, title }) => (
          <li key={id} onClick={() => audioManager?.changeTrack(location)}>
            {title}
          </li>
        ))}
      </ul>
    </section>
  )
}
