<template>
  <VIcon v-if="$slots.default != null" v-bind="$attrs" :icon="$slots.default" />
  <VIcon v-else v-bind="$attrs" />
</template>

<script setup lang="ts">

</script>
