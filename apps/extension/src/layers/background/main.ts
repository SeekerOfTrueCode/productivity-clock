import { RuntimeContext } from '@/logic/communication/send-and-receive'
import { createAppVirtual } from '@/logic/utils/vue/create-app-virtual'
import { onInstalled } from './logic/hooks/on-installed'
import { onSetup } from './logic/hooks/on-setup'
import { onStartup } from './logic/hooks/on-startup'
import { onTabsActivated } from './logic/hooks/on-tabs-activated'
import { setupApp } from '@/logic/setup-app'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('@vite/client')
  // load latest content script
  import('./content-script-hmr')
}

const app = createAppVirtual()
setupApp({ app, runtimeContext: RuntimeContext.Background, ui: false })
onSetup()
browser.runtime.onInstalled.addListener(onInstalled)
browser.runtime.onStartup.addListener(onStartup)
browser.tabs.onActivated.addListener(onTabsActivated)
