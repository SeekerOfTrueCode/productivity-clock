<template>
  <VSlider v-bind="$attrs">
    <template v-for="slotName in Object.keys($slots)" #[slotName]="props" :key="slotName">
      <slot v-if="slotName === 'default'" v-bind="props" />
      <slot v-else :name="slotName" v-bind="props" />
    </template>
  </VSlider>
</template>

<script setup lang="ts">

</script>
