import { RuntimeContext } from './communication/send-and-receive'
import { getCurrentContext } from 'webext-bridge'
import { setupAppLoading } from './setup-app/setup-app-loading'
import { setupGlobalHandleErrors } from './setup-app/setup-global-handle-errors'
import { setupI18n } from './setup-app/setup-i18n'
import { setupRouter } from './setup-app/setup-router'
import { setupStore } from './setup-app/setup-store'
import { setupUiComponents } from './setup-app/setup-ui-components'

import type { App } from 'vue'

export function setupApp ({ app, runtimeContext, routerBaseRoute, ui = true }: { app: App, runtimeContext: RuntimeContext, ui?: boolean; routerBaseRoute?: string }) {
  const context = getCurrentContext()

  // Inject a globally available `$app` object in template
  app.config.globalProperties.$app = { context }
  app.config.performance = true

  // Provide access to `app` in script setup with `const app = inject('app')`
  app.provide('app', app.config.globalProperties.$app)

  setupAppLoading(app)
  setupStore(app, runtimeContext)
  const i18n = setupI18n(app)
  if (ui) { setupUiComponents(app, i18n) }
  if (routerBaseRoute != null) { setupRouter(app, routerBaseRoute) }
  setupGlobalHandleErrors(app)
}
