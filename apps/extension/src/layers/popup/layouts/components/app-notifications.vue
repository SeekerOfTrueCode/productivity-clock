<script setup lang="ts">
import { useFormatTimeAgo } from '@@/src/composables/use-format-time-ago.js'
import { useNotificationsStore } from '@/logic/storage/notifications'
import { useToggle } from '@vueuse/core'
const notificationsStore = useNotificationsStore()

const [showMenu] = useToggle()

const { formatTimeAgo } = useFormatTimeAgo()

const items = computed(() =>
  notificationsStore.getNotifications
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(x => ({
      title: x.title,
      subtitle: formatTimeAgo(new Date(x.timestamp))
    }))
)

function onOpen (value: boolean) {
  if (!value) {
    return
  }
  notificationsStore.read()
}

</script>

<template>
  <UiMenu
    v-model="showMenu"
    :close-on-content-click="false"
    offset="3rem"
    location="bottom"
    @update:model-value="onOpen"
  >
    <template #activator="{ props }">
      <UiBtn
        :tooltip="{ text: $t('app-bar.notifications'), location: 'top' }"
        :disabled="!items.length"
        size="small"
        icon
        v-bind="props"
      >
        <v-badge
          v-if="notificationsStore.getNotificationsUnread > 0"
          max="99"
          :content="notificationsStore.getNotificationsUnread"
          color="error"
        >
          <UiIcon>
            <icon-mdi-bell />
          </UiIcon>
        </v-badge>
        <UiIcon v-else>
          <icon-mdi-bell />
        </UiIcon>
      </UiBtn>
    </template>

    <UiCard variant="outlined" width="300">
      <UiList :items="items" item-props lines="two" density="compact">
        <template #item="{ title, subtitle }">
          <UiListItem>
            <template #prepend>
              <v-avatar>
                <UiIcon>
                  <icon-mdi-bell />
                </UiIcon>
              </v-avatar>
            </template>
            <template #title>
              <div style="white-space: initial">
                {{ title }}
              </div>
            </template>
            <template #subtitle>
              {{ subtitle }}
            </template>
          </UiListItem>
        </template>
      </UiList>
    </UiCard>
  </UiMenu>
</template>
