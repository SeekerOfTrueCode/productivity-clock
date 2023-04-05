<template>
  <VSlideGroupItem v-bind="$attrs">
    <template v-if="$slots.default" #default="props">
      <slot v-bind="props" />
    </template>
  </VSlideGroupItem>
</template>

<script setup lang="ts"></script>
