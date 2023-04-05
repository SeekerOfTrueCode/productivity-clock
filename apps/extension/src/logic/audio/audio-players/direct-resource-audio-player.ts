import { AudioPlayer } from './types/audio-player'

export function DirectResourceAudioPlayer (): AudioPlayer {
  const player = new Audio()

  async function isReady (): Promise<boolean> {
    return await true
  }

  async function stop () {
    player.pause()
    player.currentTime = 0
    await nextTick()
  }

  async function destroy () {
    player.src = ''
    player.srcObject = null
    await nextTick()
  }

  async function load (url: string) {
    player.src = url
    player.load()
    await nextTick()
  }

  async function setVolume (volume: number) {
    const newVol = volume / 100
    player.volume = newVol
    await nextTick()
  }
  async function setLoop (loopPlaylists: boolean) {
    player.loop = loopPlaylists
    await nextTick()
  }
  async function play () {
    await player.play()
  }
  async function pause () {
    player.pause()
    await nextTick()
  }

  return {
    isReady,
    load,
    stop,
    destroy,
    setVolume,
    setLoop,
    play,
    pause
  }
}
