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
        console.log(tracks)
        setTracks(tracks)
      }),
    )

    return () => {
      abort()
    }
  }, [audioManager])

  if (!tracks || !audioManager) {
    return <section>loading tracks...</section>
  }

  const changeTrack = (id: string) => {}

  return (
    <section>
      <ul>
        {tracks.map(({ blurhash, cover, id, location, title }) => (
          <li key={id}>{title}</li>
        ))}
      </ul>
    </section>
  )
}
