import { AppContext } from '@/app'
import { memo, useContext, useEffect, useRef, useState } from 'react'
import { Track } from './tracklist'
import './art.css'

const Cover = memo(({ track }: { track?: Track }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(false)
  }, [track])

  return (
    <img
      {...(track ? { src: track.cover } : {})}
      className='track-art'
      alt='track cover art'
      width={300}
      height={300}
      fetchPriority='high'
      style={{
        opacity: isLoaded ? '1' : '0',
        display: track ? 'block' : 'none',
      }}
      onLoad={() => {
        setIsLoaded(true)
      }}
    />
  )
})

export const Art = () => {
  const { track, manager, isPlaying } = useContext(AppContext)
  const artRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!artRef.current) return

    const color = manager?.color ? manager.color.join(',') : undefined

    artRef.current.style.backgroundColor = `rgb(${color})`
    artRef.current.style.boxShadow = `rgba(${color}, 0.25) 0px 5px 60px 1px`
  }, [track])

  return (
    <div
      className='art'
      ref={artRef}
      style={{
        cursor: track ? 'pointer' : 'auto',
      }}
      onClick={() => {
        if (!manager || !track) return
        manager.audio.paused ? manager.play() : manager?.pause()
      }}
    >
      <div
        className='dim'
        style={track ? { display: 'block' } : { display: 'none' }}
      ></div>
      <div
        className={isPlaying ? 'controls pause' : 'controls play'}
        style={track ? { display: 'block' } : { display: 'none' }}
      ></div>
      <Cover track={track} />
    </div>
  )
}
