<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string | number | undefined;
    size?: string | number | undefined;
    timeCurrent: string;
  }>(),
  { modelValue: 0, size: 'default', timeCurrent: '00:00:00' }
)
</script>

<template>
  <div
    class="d-flex justify-center align-center"
    style="position: relative; padding: 16px 32px"
  >
    <v-progress-circular
      :model-value="modelValue"
      :size="size"
    />
    <div
      class="d-flex justify-center align-center"
      style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"
    >
      <span
        style="font-size: 1.25rem; user-select: none"
        v-text="timeCurrent"
      />
    </div>
  </div>
</template>

<style>

</style>
