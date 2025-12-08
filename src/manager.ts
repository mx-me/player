import { getBlurHashAverageColor } from 'fast-blurhash'
import { Track } from './components/tracklist'

export class Manager {
  private context
  private sourceNode
  private gainNode

  public color?: [number, number, number]

  constructor() {
    const audio = new Audio()

    this.context = new AudioContext()
    this.sourceNode = this.context.createMediaElementSource(audio)
    this.gainNode = this.context.createGain()

    this.sourceNode.connect(this.gainNode)
    this.gainNode.connect(this.context.destination)

    this.gainNode.gain.value = 0.5
  }

  public get audio() {
    return this.sourceNode.mediaElement
  }

  public setVolume(volume: number) {
    this.gainNode.gain.value = volume
  }

  public play() {
    if (this.context.state === 'suspended') {
      this.context.resume()
    }
    this.audio.play()
  }

  public pause() {
    this.audio.pause()
    this.context.suspend()
  }

  public changeTrack({ location, cover, title, blurhash }: Track) {
    this.pause()
    this.audio.src = location
    this.play()

    if (blurhash) {
      this.color = getBlurHashAverageColor(blurhash)
    }

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        artwork: [{ src: cover }],
        title
      })
    }
  }

  public destroy() {
    this.audio.pause()

    if (this.context.state !== 'closed') {
      this.sourceNode.disconnect()
      this.gainNode.disconnect()
      this.context.close()
    }

    this.audio.remove()
  }
}