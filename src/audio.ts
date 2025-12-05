export class Audio {
  private context
  // private element
  private sourceNode
  private gainNode

  constructor(mediaElement: HTMLAudioElement) {
    this.context = new AudioContext()
    // this.element = mediaElement

    this.sourceNode = this.context.createMediaElementSource(mediaElement)
    this.gainNode = this.context.createGain()

    this.sourceNode.connect(this.gainNode)
    this.gainNode.connect(this.context.destination)

    this.gainNode.gain.value = 0.5
  }

  public destroy() {
    if (this.context.state !== 'closed') {
      this.sourceNode.disconnect()
      this.gainNode.disconnect()
      this.context.close()
    }
  }
}