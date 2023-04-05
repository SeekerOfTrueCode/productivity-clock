<script setup lang="ts">
import Notifications from './components/notifications.vue'
</script>

<template>
  <UiCard variant="flat" class="w-[100%]">
    <UiList>
      <UiListSubheader>
        {{
          $t("settings-page.notification-page.notification")
        }}
      </UiListSubheader>

      <UiListItem variant="plain">
        <notifications />
      </UiListItem>
    </UiList>
    <UiDivider />
  </UiCard>
</template>

<route lang="yaml">
name: "Notification"
meta:
  title: "Notification page"
  layout: popup-default
</route>
