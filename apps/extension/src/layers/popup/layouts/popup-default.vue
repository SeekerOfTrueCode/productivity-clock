<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import AppNavigationDrawer from './components/app-navigation-drawer.vue'
import AppNotifications from './components/app-notifications.vue'
import AppSettingsDrawer from './components/app-settings-drawer.vue'
import AppVolume from './components/app-volume.vue'

const [showNavDrawer, toggleNavDrawer] = useToggle()
const [showSettingsDrawer, toggleSettingsDrawer] = useToggle()

// function openOptionsPage () {
//   browser.runtime.openOptionsPage()
// }
</script>

<template>
  <UiLayout>
    <UiAppBar density="compact">
      <template #prepend>
        <!-- <v-app-bar-nav-icon @click.stop="toggleDrawer(true)"/> -->
        <UiBtn
          :tooltip="{ text: $t('app-bar.menu'), location: 'top' }"
          icon
          @click.stop="toggleNavDrawer(true)"
        >
          <UiIcon>
            <icon-mdi-menu />
          </UiIcon>
        </UiBtn>

        <UiBtn
          :tooltip="{ text: $t('app-bar.home'), location: 'top' }"
          size="small"
          router-link
          to="/popup"
          icon
        >
          <UiIcon>
            <icon-mdi-home />
          </UiIcon>
        </UiBtn>
        <UiBtn
          :tooltip="{ text: $t('app-bar.debug'), location: 'top' }"
          size="small"
          router-link
          to="/popup/debug"
          icon
        >
          <UiIcon>
            <icon-mdi-debug-step-over />
          </UiIcon>
        </UiBtn>
      </template>

      <AppVolume />
      <AppNotifications />
      <UiBtn
        :tooltip="{ text: $t('app-bar.settings'), location: 'top' }"
        size="small"
        icon
        @click="toggleSettingsDrawer(true)"
      >
        <UiIcon>
          <icon-mdi-cog />
        </UiIcon>
      </UiBtn>
    </UiAppBar>

    <AppNavigationDrawer v-model:showDrawer="showNavDrawer" />
    <AppSettingsDrawer v-model:showDrawer="showSettingsDrawer" />

    <UiMain
      class="text-center text-gray-700"
      style="min-height: 300px; overflow-y: auto"
    >
      <UiContainer fluid>
        <RouterView />
      </UiContainer>
    </UiMain>
  </UiLayout>
</template>
