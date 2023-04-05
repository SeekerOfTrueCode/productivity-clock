import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import type { App } from 'vue'
const routes = setupLayouts(generatedRoutes)

export function setupRouter (app: App, baseRoute: string) {
  const popupRoutes = routes.filter(x => x.path.includes(baseRoute))
  const defaultPage = routes.find(x => x.path === baseRoute)!
  const resultPages = [{ ...defaultPage, path: '' }, ...popupRoutes]
  const router = createRouter({ history: createWebHashHistory(baseRoute), routes: resultPages })
  // console.log(resultPages);
  // apply router
  app.use(router)
  router.replace(baseRoute)
}
