<script setup lang="ts">
import Pinned from './components/pinned.vue'
</script>

<template>
  <UiCard variant="flat" class="w-[100%]">
    <UiList>
      <UiListSubheader>
        {{
          $t("settings-page.pinned-page.pinned")
        }}
      </UiListSubheader>

      <UiListItem variant="plain">
        <pinned />
      </UiListItem>
    </UiList>
    <UiDivider />
  </UiCard>
</template>

<route lang="yaml">
name: "Pinned"
meta:
  title: "Pinned page"
  layout: popup-default
</route>
