import { URL, fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import Icons from 'unplugin-icons/vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts(),
    vue(),
    // https://github.com/antfu/unplugin-icons
    Icons({ autoInstall: true })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts')
        // 'resolver': resolve(__dirname, 'src/resolver.ts'),
        // 'module': resolve(__dirname, 'src/module.ts'),
      },
      name: '@nobodyz/productivity-clock_ui',
      fileName: (format, name) => {
        console.log(name, format)
        return `${name}.${format}.js`
      }
      // formats: ["es", "cjs", "umd"],
      // fileName: 'index'
      // fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vuetify', '@nuxt/kit', '@mdi/font'], // '@nuxt/schema', 'path', 'url', 'css-minimizer-webpack-plugin'
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@/': fileURLToPath(new URL('./src', import.meta.url)),
      '~/': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
