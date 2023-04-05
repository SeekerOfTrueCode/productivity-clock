<script setup lang="ts">
import UiBtn from '../../buttons/btn.vue'
import UiIcon from '../../icons/icon.vue'
import UiIconFrame from '../../icons/icon-frame.vue'

withDefaults(
  defineProps<{
    pin: boolean;
    title: string;
    edit: boolean;
    ringSoundName?: string;
  }>(),
  { pin: false, title: '', edit: false, ringSoundName: undefined }
)

const emit = defineEmits(['pin', 'close'])
</script>

<template>
  <div class="timer-title d-inline-block pl-3">
    <span v-text="title" />
    <v-tooltip activator="parent" location="top">
      {{ title }}
    </v-tooltip>
  </div>
  <v-spacer />
  <UiIconFrame
    v-if="ringSoundName != null"
    size="small"
    :tooltip="{
      text: ringSoundName,
      location: 'top',
    }"
  >
    <UiIcon size="small">
      <icon-mdi-music />
    </UiIcon>
  </UiIconFrame>
  <UiIconFrame
    v-if="!edit && pin"
    size="small"
    :tooltip="{
      text: $vuetify.locale.t('$vuetify.timer-header.pinned'),
      location: 'top',
    }"
  >
    <UiIcon size="small">
      <icon-mdi-pin />
    </UiIcon>
  </UiIconFrame>
  <UiBtn
    v-if="edit"
    :tooltip="{
      text: pin
        ? $vuetify.locale.t('$vuetify.timer-header.unpin')
        : $vuetify.locale.t('$vuetify.timer-header.pin'),
      location: 'top',
    }"
    size="x-small"
    icon
    variant="text"
    @click.stop="emit('pin')"
  >
    <UiIcon>
      <icon-mdi-pin v-if="!pin" />
      <icon-mdi-pin-off v-if="pin" />
    </UiIcon>
  </UiBtn>
  <UiBtn
    v-if="edit"
    size="x-small"
    icon
    variant="text"
    :tooltip="{
      text: $vuetify.locale.t('$vuetify.timer-header.close'),
      location: 'top',
    }"
    @click.stop="emit('close')"
  >
    <UiIcon>
      <icon-mdi-close />
    </UiIcon>
  </UiBtn>
</template>

<style scoped>
.timer-title {
  width: 160px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: start;
}
</style>
