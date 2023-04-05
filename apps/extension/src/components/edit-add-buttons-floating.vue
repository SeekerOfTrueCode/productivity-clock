<script setup lang="ts">
withDefaults(
  defineProps<{
    edit: boolean;
    editDisabled: boolean;
    editTooltip?: string;
    editFinishTooltip?: string;
    addTooltip?: string;
  }>(),
  {
    edit: false,
    editDisabled: false,
    addTooltip: 'Add',
    editTooltip: 'Edit',
    editFinishTooltip: 'Finish'
  }
)
const emit = defineEmits(['update:edit', 'add'])
</script>

<template>
  <div
    style="position: absolute; bottom: 1.5rem; right: 2rem"
    class="d-flex align-center flex-column"
  >
    <UiBtnGroup divided variant="outlined">
      <UiBtn
        :disabled="!edit && editDisabled"
        :tooltip="{
          text: edit ? editFinishTooltip : editTooltip,
          location: 'top',
        }"
        @click="emit('update:edit', !edit)"
      >
        <UiIcon>
          <icon-mdi-check v-if="edit" />
          <icon-mdi-pencil v-else />
        </UiIcon>
      </UiBtn>

      <UiBtn
        :tooltip="{ text: addTooltip, location: 'top' }"
        :disabled="edit"
        @click="emit('add')"
      >
        <UiIcon>
          <icon-mdi-plus />
        </UiIcon>
      </UiBtn>
    </UiBtnGroup>
  </div>
</template>

<style scoped></style>
