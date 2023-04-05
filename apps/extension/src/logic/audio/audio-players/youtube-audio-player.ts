import { AudioPlayer } from './types/audio-player'
import YouTubePlayer from 'youtube-player'

// Originated from: https://blog.devgenius.io/how-to-extract-the-id-of-a-youtube-or-vimeo-url-with-javascript-ad5e2d1049a
function getYouTubeVideoIdFromUrl (url: string): string | undefined {
  // Our regex pattern to look for a youTube ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  // Match the url with the regex
  const match = url.match(regExp)
  // Return the result
  return match && match[2].length === 11 ? match[2] : undefined
}

function createIfNotPresentElementInBody (elementId: string) {
  const div = document.getElementById(elementId)
  if (div == null) {
    const div = document.createElement('div')
    div.id = elementId
    document.body.appendChild(div)
  }
}

export function YoutubeAudioPlayer (maybeElementId: string): AudioPlayer {
  createIfNotPresentElementInBody(maybeElementId)
  let isLoaded = false

  const player = YouTubePlayer(maybeElementId)

  const isReadyActions = {
    resolve: undefined! as Function,
    reject: undefined! as Function
  }
  const isReadyPromise = new Promise<boolean>((resolve, reject) => {
    const cancel = setTimeout(() => {
      resolve(false)
      // reject(new Error('[YoutubeAudioPlayer] Timeout'))
    }, 5000)
    console.log(`[YoutubeAudioPlayer] create promise ${cancel}`)
    isReadyActions.resolve = (value: boolean) => {
      console.log(`[YoutubeAudioPlayer] resolve and cancel${cancel}`)
      clearTimeout(cancel)
      resolve(value)
    }
    isReadyActions.reject = reject
  })

  async function isReady (): Promise<boolean> {
    return await isReadyPromise
  }

  player.on('ready', () => {
    isReadyActions.resolve(true)
  })
  player.on('error', (error) => {
    switch ((error as any).data) {
      case 2: {
        console.error('[YoutubeAudioPlayer] The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.')
        break
      }
      case 5: {
        console.error('[YoutubeAudioPlayer] The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.')
        break
      }
      case 100: {
        console.error('[YoutubeAudioPlayer] The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.')
        break
      }
      case 101: {
        console.error('[YoutubeAudioPlayer] The owner of the requested video does not allow it to be played in embedded players.')
        break
      }
      case 150: {
        console.error('[YoutubeAudioPlayer] The owner of the requested video does not allow it to be played in embedded players.')
        break
      }
    }
    console.error(error)
  })

  async function stop () {
    if (!isLoaded) { return }
    await player?.stopVideo()
  }

  async function destroy () {
    if (!isLoaded) { return }
    await player?.destroy()
    isLoaded = false
  }

  async function load (url: string) {
    const ytVideoId = getYouTubeVideoIdFromUrl(url)
    if (ytVideoId == null) { return }
    isLoaded = true
    await player?.loadVideoById(ytVideoId)
  }

  async function setVolume (volume: number) {
    await isReadyPromise
    await player?.setVolume(volume)
  }
  async function setLoop (loopPlaylists: boolean) {
    await isReadyPromise
    await player?.setLoop(loopPlaylists)
  }
  async function play () {
    await isReadyPromise
    await player?.playVideo()
  }
  async function pause () {
    await isReadyPromise
    await player?.pauseVideo()
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
