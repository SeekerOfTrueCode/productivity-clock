<script setup lang="ts">
import { usePinnedStore } from '@/logic/storage/pinned'

const pinnedStore = usePinnedStore()
</script>

<template>
  <UiSwitch
    v-model="pinnedStore.tabPagePinned"
    :label="$t('settings-page.pinned-page.tab-page-pinned')"
  >
    <template #prepend>
      <UiIcon>
        <icon-mdi-pin v-if="pinnedStore.tabPagePinned" />
        <icon-mdi-pin-off v-else />
      </UiIcon>
    </template>
  </UiSwitch>
</template>
