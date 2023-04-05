import { RuntimeContext } from '@/logic/communication/send-and-receive'
import { createApp } from 'vue'
import { onMessage } from 'webext-bridge'
import { setupApp } from '@/logic/setup-app'
import App from './views/app.vue'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[productivity-clock] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[productivity-clock] Navigate from page "${data.title}"`)
  })

  onMessage('time-now', ({ data }) => {
    console.log(`[productivity-clock] Now is "${data}"`)
  })

  // mount component to context window
  const container = document.createElement('div')
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/content-script/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)

  const app = createApp(App)
  setupApp({ app, runtimeContext: RuntimeContext.ContentScript })
  app.mount(root)
})()
