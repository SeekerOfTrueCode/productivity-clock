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
    @update:model-value="emit('update:showDrawer')"
  >
    <UiList nav density="compact">
      <UiListItem nav to="/popup/timers" active-color="primary" :title="$t('app-navigation.timers')">
        <template #prepend>
          <div style="min-width: 50px">
            <icon-mdi-timer-sand />
          </div>
        </template>
      </UiListItem>
      <UiListItem nav to="/popup/productivity-sessions" active-color="primary" :title="$t('app-navigation.productivity-sessions')">
        <template #prepend>
          <div style="min-width: 50px">
            <icon-mdi-av-timer />
          </div>
        </template>
      </UiListItem>
    </UiList>
  </UiNavigationDrawer>
</template>
