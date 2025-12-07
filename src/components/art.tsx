import { AppContext } from '@/app'
import { getBlurHashAverageColor } from 'fast-blurhash'
import { useContext, useEffect, useRef } from 'react'

export const Art = () => {
  const { track, audioManager, isPlaying } = useContext(AppContext)
  const controlRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!audioManager || !artRef.current) return

    const controller = new AbortController()

    artRef.current.addEventListener(
      'click',
      () => {
        if (!track || !controlRef.current) return

        if (audioManager.element.paused) {
          audioManager.play()
        } else {
          audioManager.pause()
        }
      },
      {
        signal: controller.signal,
      },
    )

    if (audioManager.color) {
      const color = audioManager.color.join(',')
      artRef.current.style.backgroundColor = `rgb(${color})`
      artRef.current.style.boxShadow = `rgba(${color}, 0.25) 0px 5px 60px 1px`
    }

    return () => {
      controller.abort()
    }
  }, [audioManager, track])

  return (
    <div
      className='art'
      ref={artRef}
      style={track ? { cursor: 'pointer' } : { cursor: 'auto' }}
    >
      <div
        className='dim'
        style={track ? { display: 'block' } : { display: 'none' }}
      ></div>
      <div
        className={isPlaying ? 'controls pause' : 'controls play'}
        style={track ? { display: 'block' } : { display: 'none' }}
        ref={controlRef}
      ></div>
      {track?.cover ? (
        <img
          src={track?.cover ? `/${track.cover}` : ''}
          className='track-art'
          alt='track cover art'
          width={300}
          height={300}
        />
      ) : (
        ''
      )}
    </div>
  )
}
