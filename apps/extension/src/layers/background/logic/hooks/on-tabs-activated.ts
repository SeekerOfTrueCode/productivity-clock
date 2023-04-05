import { Tabs } from 'webextension-polyfill'
import { onMessage, sendMessage } from 'webext-bridge'

let previousTabId = 0
export async function onTabsActivated ({ tabId }: Tabs.OnActivatedActiveInfoType) {
  console.log('Extension activated on tab')
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  } catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
}

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title
    }
  } catch {
    return {
      title: undefined
    }
  }
})
