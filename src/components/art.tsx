import { AppContext } from '@/app'
import { useContext } from 'react'

export const Art = () => {
  const { track, audioManager, isPlaying } = useContext(AppContext)

  const togglePlayback = () => {
    if (!track || !audioManager) return

    if (audioManager.element.paused) {
      audioManager.play()
    } else {
      audioManager.pause()
    }
  }

  const artStyle = (() => {
    if (!audioManager?.color) return undefined
    const color = audioManager.color.join(',')
    return {
      backgroundColor: `rgb(${color})`,
      boxShadow: `rgba(${color}, 0.25) 0px 5px 60px 1px`,
    }
  })()

  return (
    <div
      className='art'
      style={{
        ...artStyle,
        ...(track ? { cursor: 'pointer' } : { cursor: 'auto' }),
      }}
      onClick={togglePlayback}
    >
      <div
        className='dim'
        style={track ? { display: 'block' } : { display: 'none' }}
      ></div>
      <div
        className={isPlaying ? 'controls pause' : 'controls play'}
        style={track ? { display: 'block' } : { display: 'none' }}
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
