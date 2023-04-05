<template>
  <VSlideGroup v-bind="$attrs">
    <template v-if="$slots.default" #default="props">
      <slot v-bind="props" />
    </template>
    <template #prev="props">
      <slot name="prev" v-bind="props">
        <UiIcon
          color="rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))"
          @click="props.prev"
        >
          <icon-mdi-chevron-left />
        </UiIcon>
      </slot>
    </template>
    <template #next="props">
      <slot name="next" v-bind="props">
        <UiIcon
          color="rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))"
          @click="props.next"
        >
          <icon-mdi-chevron-right />
        </UiIcon>
      </slot>
    </template>
  </VSlideGroup>
</template>

<script setup lang="ts">
import UiIcon from '../icons/icon.vue'
</script>
