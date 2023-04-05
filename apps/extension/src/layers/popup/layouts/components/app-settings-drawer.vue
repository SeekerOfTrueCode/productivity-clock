<script setup lang="ts">
withDefaults(
  defineProps<{
    showDrawer: boolean;
  }>(),
  { showDrawer: false }
)
const emit = defineEmits(['update:showDrawer'])
</script>

<template>
  <UiNavigationDrawer
    :model-value="showDrawer"
    location="end"
    @update:model-value="emit('update:showDrawer')"
  >
    <UiList nav density="compact">
      <UiListItem
        nav
        to="/popup/information"
        active-color="primary"
        :title="$t('settings-navigation.help')"
      >
        <template #prepend>
          <div style="min-width: 50px">
            <icon-mdi-information />
          </div>
        </template>
      </UiListItem>
      <UiListItem
        nav
        to="/popup/settings/sounds-and-music"
        active-color="primary"
        :title="$t('settings-navigation.sounds-and-music')"
      >
        <template #prepend>
          <div style="min-width: 50px">
            <icon-mdi-volume-source />
          </div>
        </template>
      </UiListItem>
      <UiListItem
        nav
        to="/popup/settings/theme"
        active-color="primary"
        :title="$t('settings-navigation.theme')"
      >
        <template #prepend>
          <div style="min-width: 50px">
            <icon-mdi-theme-light-dark />
          </div>
        </template>
      </UiListItem>
      <UiListItem
        nav
        to="/popup/settings/language"
        active-color="primary"
        :title="$t('settings-navigation.language')"
      >
        <template #prepend>
          <div style="min-width: 50px">
            <icon-mdi-language />
          </div>
        </template>
      </UiListItem>
      <UiListItem
        nav
        to="/popup/settings/notifications"
        active-color="primary"
        :title="$t('settings-navigation.notifications')"
      >
        <template #prepend>
          <div style="min-width: 50px">
            <icon-mdi-bell />
          </div>
        </template>
      </UiListItem>
      <UiListItem
        nav
        to="/popup/settings/pinned"
        active-color="primary"
        :title="$t('settings-navigation.pinned')"
      >
        <template #prepend>
          <div style="min-width: 50px">
            <icon-mdi-pin />
          </div>
        </template>
      </UiListItem>
    </UiList>
  </UiNavigationDrawer>
</template>
