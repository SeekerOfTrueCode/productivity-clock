import { JsonValue } from 'type-fest'

import { OnMessageCallback, onMessage, sendMessage } from 'webext-bridge'

export enum RuntimeContextWithId {
  Devtools = 'devtools',
  ContentScript = 'content-script',
  Window = 'window'
}

export enum RuntimeContextNoId {
  Background = 'background',
  Popup = 'popup',
  Options = 'options',
}

export const RuntimeContext = {
  ...RuntimeContextWithId,
  ...RuntimeContextNoId
}

export type RuntimeContext = RuntimeContextWithId | RuntimeContextNoId;

export enum MessageID {
  Sync = 'sync'
}

export function sendAndReceive<T extends Record<Partial<MessageID>, JsonValue>> (log?: boolean) {
  async function send<M extends MessageID> (messageID: M, data: T[M], options: { context: RuntimeContext; tabIds?: number | number[] }) {
    if (log) { console.log(`[Send to ${options.context}:${messageID}]`, data) }
    try {
      if (Object.values(RuntimeContextNoId).includes(options.context as RuntimeContextNoId)) {
        return await sendMessage(messageID, data as any, options.context)
      } else if (options.tabIds == null) {
        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true
        })
        tabs
          .filter(tab => tab.id != null)
          .forEach(tab => sendMessage(messageID, data as any, { context: options.context, tabId: tab.id! }))
      } else {
        const tabIds = typeof options.tabIds === 'number' ? [options.tabIds] : options.tabIds
        tabIds.forEach(tabId => sendMessage(messageID, data as any, { context: options.context, tabId }))
      }
    } catch (error) {
      console.warn(`[Send to ${options.context}:${messageID} failed]`, error)
    }
  }

  function receive<M extends MessageID> (messageID: M, callback: OnMessageCallback<T[M], T[M] | void>) {
    onMessage(messageID, async (options) => {
      if (log) { console.log(`[Receive from ${options.sender.context}-${options.sender.tabId}:${messageID}]`) } // options.data
      return await callback(options)
    })
  }

  return {
    send,
    receive
  }
}
