import { MessageID, RuntimeContext, sendAndReceive } from '../communication/send-and-receive'
import { Store, createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import { installPersistedStatePluginExtension } from './setup-store/pinia-plugin-hydrate'
import { useBackgroundMusicStore } from '../storage/background-music'
import { useDebounceFn } from '@vueuse/core'
import { useDefaultTimerSoundStore } from '../storage/default-timer-sound'
import { useLanguageStore } from '../storage/language'
import { useNotificationsStore } from '../storage/notifications'
import { useNowStore } from '../storage/now'
import { usePinnedStore } from '../storage/pinned'
import { useSoundsAndMusicStore } from '../storage/sounds-and-music'
import { useThemeStore } from '../storage/theme'
import { useTimerSessionStore } from '../storage/timer-session'
import { useTimerStore } from '../storage/timer'
import stringify from 'json-stringify-safe'
import type { App } from 'vue'

const sendAndReceiver = sendAndReceive<{ [MessageID.Sync]: { storeKeyToUpdate: string } }>()

export function setupStore (app: App, thisRuntimeContext: RuntimeContext) {
  let isHydrating = false

  const pinia = createPinia()
  const installPersistedStatePlugin = createPersistedStatePlugin({
    storage: {
      getItem: async (key) => {
        const result = await browser.storage.local.get(key)
        return result[key]
      },
      setItem: async (key, value) => {
        if (isHydrating) { return }
        await browser.storage.local.set({ [key]: value })
        const runtimeToInform =
          [
            RuntimeContext.Popup,
            RuntimeContext.Options,
            RuntimeContext.Background,
            RuntimeContext.ContentScript
          ] as RuntimeContext[]
        const runtimeToInformWithoutThis = runtimeToInform
          .filter((context: RuntimeContext) => context !== thisRuntimeContext)

        if (thisRuntimeContext === RuntimeContext.ContentScript) { console.log(runtimeToInformWithoutThis) }
        const promises =
          runtimeToInformWithoutThis.map((context: RuntimeContext) => sendAndReceiver.send(MessageID.Sync, { storeKeyToUpdate: key }, { context }))
        await Promise.allSettled(promises)
      },
      removeItem: async (key) => {
        return await browser.storage.local.remove(key)
      }
    },
    serialize: value => stringify(value)
  })
  pinia.use(context => installPersistedStatePlugin(context))
  pinia.use(context => installPersistedStatePluginExtension(context))
  app.use(pinia)

  useNowStore()
  const timerStore = useTimerStore()
  const soundsAndMusicStore = useSoundsAndMusicStore()
  const backgroundMusicStore = useBackgroundMusicStore()
  const defaultTimerSoundStore = useDefaultTimerSoundStore()
  const notificationsStore = useNotificationsStore()
  const timerSessionStore = useTimerSessionStore()
  const themeStore = useThemeStore()
  const languageStore = useLanguageStore()
  const pinnedStore = usePinnedStore()

  // TODO: move this logic to the plugin
  const persistentStores: Record<string, Store> = {
    [timerStore.$id]: timerStore,
    [soundsAndMusicStore.$id]: soundsAndMusicStore,
    [backgroundMusicStore.$id]: backgroundMusicStore,
    [defaultTimerSoundStore.$id]: defaultTimerSoundStore,
    [notificationsStore.$id]: notificationsStore,
    [timerSessionStore.$id]: timerSessionStore,
    [themeStore.$id]: themeStore,
    [languageStore.$id]: languageStore,
    [pinnedStore.$id]: pinnedStore
  }

  const debouncedSyncFn = useDebounceFn(async ({ storeKeyToUpdate }: { storeKeyToUpdate: string }) => {
    isHydrating = true
    // console.log('hydrate', persistentStores?.[storeKeyToUpdate])
    await persistentStores?.[storeKeyToUpdate]?.$hydrate()
    isHydrating = false
  }, 1000)

  sendAndReceiver.receive(MessageID.Sync, async arg => await debouncedSyncFn(arg?.data))
  //
}
