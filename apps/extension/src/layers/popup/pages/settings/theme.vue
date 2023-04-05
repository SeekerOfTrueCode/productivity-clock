<script setup lang="ts">
import Theme from './components/theme.vue'
</script>

<template>
  <UiCard variant="flat" class="w-[100%]">
    <UiList>
      <UiListSubheader>{{ $t('settings-page.theme-page.theme') }}</UiListSubheader>

      <UiListItem variant="plain">
        <theme />
      </UiListItem>
    </UiList>
    <UiDivider />
  </UiCard>
</template>

<route lang="yaml">
name: "Theme"
meta:
  title: "Theme page"
  layout: popup-default
</route>
