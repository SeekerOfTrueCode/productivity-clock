<template>
  <VOverlay v-bind="$attrs">
    <template #default="props">
      <div class="ui-dialog d-flex align-center justify-center">
        <slot v-bind="props" />
      </div>
    </template>
    <template
      v-for="slotName in Object.keys($slots).filter((x) => x !== 'default')"
      #[slotName]="props"
      :key="slotName"
    >
      <slot :name="slotName" v-bind="props" />
    </template>
  </VOverlay>
</template>

<script setup lang="ts"></script>

<style scoped>
.ui-dialog {
  width: 100vw;
  height: 100vh;
}
</style>
