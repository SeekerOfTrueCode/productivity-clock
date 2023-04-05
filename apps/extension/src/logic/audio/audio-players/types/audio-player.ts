export interface AudioPlayer {
    isReady: () => Promise<boolean>
    load: (url: string) => Promise<void> // , startSeconds?: number | undefined, suggestedQuality?: string | undefined
    stop: () => Promise<void>
    destroy: () => Promise<void>
    play: () => Promise<void>
    pause: () => Promise<void>
    setVolume: (volume: number) => Promise<void>
    setLoop: (loopPlaylists: boolean) => Promise<void>
}
