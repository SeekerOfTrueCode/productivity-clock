import { PiniaPluginContext } from 'pinia'

declare module 'pinia' {
    export interface PiniaCustomProperties {
        $hydrate: () => Promise<void>;
        $isHydrating: ComputedRef<boolean>
    }
}

export function installPersistedStatePluginExtension (context: PiniaPluginContext) {
  const id = context.store.$id
  const isHydrating = ref(false)
  async function $hydrate () {
    isHydrating.value = true
    let result = await browser.storage.local.get(id)
    result = Object.fromEntries(Object.entries(result).map(([key, value]) => [key, JSON.parse(value)]))

    context.store.$state = result[id]
    isHydrating.value = false
  }

  //   context.store.$subscribe((mutation, state) => {
  //     if (mutation.storeId !== 'now') { console.log('!on mutation', mutation, state) }
  //   })

  return {
    $hydrate,
    $isHydrating: computed(() => isHydrating.value)
  }
}
