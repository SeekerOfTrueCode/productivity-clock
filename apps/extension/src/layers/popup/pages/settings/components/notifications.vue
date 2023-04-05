<script setup lang="ts">
import { useNotificationsStore } from '@/logic/storage/notifications'

const notificationsStore = useNotificationsStore()
</script>

<template>
  <UiSwitch
    v-model="notificationsStore.enabled.system"
    :label="$t('settings-page.notification-page.system-notification')"
  >
    <template #prepend>
      <UiIcon>
        <icon-mdi-bell v-if="notificationsStore.enabled.system" />
        <icon-mdi-bell-off v-else />
      </UiIcon>
    </template>
  </UiSwitch>
</template>
