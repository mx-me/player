import { AppContext } from '@/app'
import { useContext } from 'react'

export const Tracklist = () => {
  const context = useContext(AppContext)
  if (!context?.audio.current) throw 'could not get audio context'

  return <section>hi</section>
}
