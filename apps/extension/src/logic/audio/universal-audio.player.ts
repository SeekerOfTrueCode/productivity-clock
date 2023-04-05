import { AudioPlayer } from './audio-players/types/audio-player'
import { AudioSourceType } from './audio-players/types/audio-source-type'
import { DirectResourceAudioPlayer } from './audio-players/direct-resource-audio-player'
import { YoutubeAudioPlayer } from './audio-players/youtube-audio-player'

interface LoadOptions {
  url: string;
  audioSource: AudioSourceType;
  maybeElementId: string;
}

export interface UniversalAudioPlayer extends Omit<AudioPlayer, 'load'> {
  load: (options: LoadOptions) => Promise<void>
}

export function universalAudioPlayer (): UniversalAudioPlayer {
  let player: AudioPlayer | undefined

  function applyAudioPlayer (_audioSource: AudioSourceType, maybeElementId: string) {
    player = _audioSource === AudioSourceType.YouTube
      ? YoutubeAudioPlayer(maybeElementId)
      : DirectResourceAudioPlayer()
  }

  async function isReady () {
    return await player?.isReady() ?? false
  }

  async function stop () {
    await player?.stop()
  }

  async function destroy () {
    await player?.destroy()
  }

  async function load (options: LoadOptions) {
    if (player != null) {
      await stop()
      await destroy()
    }
    applyAudioPlayer(options.audioSource, options.maybeElementId)
    await nextTick()
    await player?.load(options.url)
  }

  async function setVolume (volume: number) {
    await player?.setVolume(volume)
  }
  async function setLoop (loopPlaylists: boolean) {
    await player?.setLoop(loopPlaylists)
  }
  async function play () {
    await player?.play()
  }
  async function pause () {
    await player?.pause()
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
