import { isDev, port, r } from '@@/scripts/utils'
import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '@@/package.json'

export async function getManifest () {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
      default_icon: './assets/icon-512.png',
      default_popup: `./dist${isDev ? '' : '/layers'}/popup/index.html`
    },
    options_ui: {
      page: `./dist${isDev ? '' : '/layers'}/options/index.html`,
      open_in_tab: true,
      chrome_style: false
    },
    background: {
      page: `./dist${isDev ? '' : '/layers'}/background/index.html`,
      persistent: true // FIXME: possibly need to change that buy for now it`s here || default: false
    },
    icons: {
      16: './assets/icon-512.png',
      48: './assets/icon-512.png',
      128: './assets/icon-512.png'
    },
    permissions: [
      'tabs',
      'storage',
      'activeTab',
      'notifications',
      // `management`,
      'http://*/',
      'https://*/'
    ],
    content_scripts: [{
      matches: ['http://*/*', 'https://*/*'],
      js: [`./dist${isDev ? '' : '/layers'}/content-script/index.global.js`]
    }],
    web_accessible_resources: [
      `dist${isDev ? '' : '/layers'}/content-script/style.css`
    ]
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/content-script-hmr.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')

    // this is required on dev for Vite script to load
    manifest.content_security_policy = `script-src \'self\' http://localhost:${port}; object-src \'self\'; script-src-elem \'self\' http://localhost:${port} https://www.youtube.com;`
  }

  return manifest
}
