/// <reference types="vitest" />

import { defineConfig } from 'vite'
import { dirname, relative } from 'path'
import { isDev, port, r } from './scripts/utils'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Layouts from 'vite-plugin-vue-layouts'
import Pages from 'vite-plugin-pages'
import UiResolve from './scripts/ui-resolve'
import UnoCSS from 'unocss/vite'
import Vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import type { UserConfig } from 'vite'

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '@@/': `${r('')}/`,
      '~~/': `${r('')}/`,
      '@/': `${r('src')}/`,
      '~/': `${r('src')}/`
    }
  },
  define: {
    __DEV__: isDev
  },
  plugins: [
    Vue(),
    VueI18nPlugin({ include: r('src/locales/**') }),
    Pages({
      dirs: [
        { dir: r('src/layers/popup/pages'), baseRoute: 'popup' },
        { dir: r('src/layers/options/pages'), baseRoute: 'options' }
      ],
      exclude: ['**/components/*.vue']
    }),
    Layouts({
      layoutsDirs: [
        r('src/layers/popup/layouts'),
        r('src/layers/options/layouts')
      ],
      exclude: ['**/components/*.vue'],
      defaultLayout: 'default'
    }),

    AutoImport({
      imports: [
        'vue',
        {
          'webextension-polyfill': [
            ['*', 'browser']
          ]
        }
      ],
      dts: r('src/auto-imports.d.ts'),
      eslintrc: {
        enabled: true
      }
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: [r('src/components')],
      // generate `components.d.ts` for ts support with Volar
      dts: r('src/components.d.ts'),
      resolvers: [
        // auto import icons
        IconsResolver({ componentPrefix: 'icon', enabledCollections: ['mdi'] }),
        UiResolve({ componentPrefix: 'Ui' })
      ]
    }),

    Icons(),

    // https://github.com/unocss/unocss
    UnoCSS(),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml (html, { path }) {
        return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
      }
    }
  ],
  optimizeDeps: {
    include: [
      'vue',
      '@vueuse/core',
      'webextension-polyfill'
    ],
    exclude: [
      'vue-demi'
    ]
  }
}

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
  server: {
    port,
    hmr: {
      host: 'localhost'
    }
  },
  build: {
    outDir: r('extension/dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    minify: 'terser',
    terserOptions: {
      mangle: false
    },
    rollupOptions: {
      input: {
        background: r('src/layers/background/index.html'),
        options: r('src/layers/options/index.html'),
        popup: r('src/layers/popup/index.html')
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
}))
