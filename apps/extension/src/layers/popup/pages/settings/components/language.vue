<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/logic/storage/language'

const languageStore = useLanguageStore()

const i18n = useI18n()
const items = computed(() =>
  Object.values(i18n.availableLocales).map(x => ({
    value: x,
    title: i18n.t(`languages-list.${x}`).toString()
  }))
)

watch(
  () => languageStore.language,
  () => {
    i18n.locale.value = languageStore.language
  }
)
</script>

<template>
  <UiSelect v-model="languageStore.language" :items="items" :label="$t('settings-page.language-page.language')">
    <template #prepend>
      <UiIcon>
        <icon-mdi-language />
      </UiIcon>
    </template>
  </UiSelect>
</template>
