import { AppContext } from '@/app'
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
          controlRef.current.classList.remove('play')
          controlRef.current.classList.add('pause')
        } else {
          audioManager.pause()
          controlRef.current.classList.remove('pause')
          controlRef.current.classList.add('play')
        }
      },
      {
        signal: controller.signal,
      },
    )

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
