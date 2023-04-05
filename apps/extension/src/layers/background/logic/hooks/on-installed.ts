import { Runtime } from 'webextension-polyfill'

export function onInstalled (_details: Runtime.OnInstalledDetailsType): void {
  console.log('Extension installed', _details)
}
