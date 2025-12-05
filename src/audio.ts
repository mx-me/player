import { Track } from './components/tracklist'

export class Audio {
  private context
  private sourceNode
  private gainNode

  public element

  constructor(mediaElement: HTMLAudioElement) {
    this.context = new AudioContext()
    this.element = mediaElement

    this.sourceNode = this.context.createMediaElementSource(mediaElement)
    this.gainNode = this.context.createGain()

    this.sourceNode.connect(this.gainNode)
    this.gainNode.connect(this.context.destination)

    this.gainNode.gain.value = 0.5
  }

  public setVolume(volume: number) {
    this.gainNode.gain.value = volume
  }

  public play() {
    if (this.context.state === 'suspended') {
      this.context.resume()
    }
    this.element.play()
  }

  public pause() {
    this.element.pause()
    this.context.suspend()
  }

  public changeTrack({ location, cover, title }: Track) {
    this.pause()
    this.element.src = location
    this.play()

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        artwork: [{ src: cover }],
        title
      })
    }
  }

  public destroy() {
    if (this.context.state !== 'closed') {
      this.sourceNode.disconnect()
      this.gainNode.disconnect()
      this.context.close()
    }
  }
}