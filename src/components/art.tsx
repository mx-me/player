import { AppContext } from '@/app'
import { useContext, useEffect, useMemo, useState } from 'react'
import './art.css'

export const Art = () => {
  const { track, manager, isPlaying } = useContext(AppContext)
  const [isLoaded, setIsLoaded] = useState(false)

  const style = useMemo(() => {
    const color = manager?.color?.join(',')
    return track && color
      ? {
          backgroundColor: `rgb(${color})`,
          boxShadow: `rgba(${color}, 0.25) 0px 5px 60px 1px`,
          cursor: 'pointer',
        }
      : { cursor: 'auto' }
  }, [track, manager?.color])

  useEffect(() => {
    if (!track?.cover) return
    setIsLoaded(false)
  }, [track?.cover])

  return (
    <div
      className='art'
      style={style}
      onClick={() => {
        if (!manager || !track) return
        manager.audio.paused ? manager.play() : manager?.pause()
      }}
    >
      {track && <div className='dim' />}
      {track && (
        <div className={isPlaying ? 'controls pause' : 'controls play'} />
      )}
      {track && (
        <img
          src={track.cover}
          className='track-art'
          alt='track cover art'
          width={300}
          height={300}
          style={{ opacity: isLoaded ? '1' : '0' }}
          onLoad={() => {
            setIsLoaded(true)
          }}
        />
      )}
    </div>
  )
}
