<script setup lang="ts">
import Language from './components/language.vue'
</script>

<template>
  <UiCard variant="flat" class="w-[100%]">
    <UiList>
      <UiListSubheader>{{ $t('settings-page.language-page.application-language') }}</UiListSubheader>

      <UiListItem variant="plain">
        <language />
      </UiListItem>
    </UiList>
    <UiDivider />
  </UiCard>
</template>

<route lang="yaml">
name: "Language"
meta:
  title: "Language page"
  layout: popup-default
</route>
