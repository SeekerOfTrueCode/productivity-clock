<script setup lang="ts">
const emit = defineEmits(['save', 'cancel'])
</script>

<template>
  <UiCardActions class="justify-space-around">
    <UiBtn class="pa-2" variant="tonal" @click="emit('save')">
      <template #prepend>
        <UiIcon>
          <icon-mdi-content-save />
        </UiIcon>
      </template>
      {{ $t("global.save") }}
    </UiBtn>
    <UiBtn class="pa-2" variant="tonal" @click="emit('cancel')">
      <template #prepend>
        <UiIcon>
          <icon-mdi-window-close />
        </UiIcon>
      </template>
      {{ $t("global.cancel") }}
    </UiBtn>
  </UiCardActions>
</template>

<style scoped></style>
