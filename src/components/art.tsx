import { AppContext } from '@/app'
import { useContext } from 'react'

export const Art = () => {
  const { track } = useContext(AppContext)

  return (
    <div className='art'>
      {track?.cover ? (
        <img
          src={track?.cover ? `/${track.cover}` : ''}
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
