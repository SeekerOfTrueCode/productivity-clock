<script setup lang="ts">
import UiBtn from '../../buttons/btn.vue'
import UiIcon from '../../icons/icon.vue'

withDefaults(
  defineProps<{
    play: boolean;
    resetDisabled: boolean;
    edit: boolean;
  }>(),
  { play: false, edit: false, resetDisabled: false }
)

const emit = defineEmits(['play', 'pause', 'reset'])
</script>

<template>
  <UiBtn
    v-if="!play"
    :disabled="edit"
    size="x-small"
    icon
    :tooltip="{
      text: $vuetify.locale.t('$vuetify.timer-footer.play'),
      location: 'top',
    }"
    @click.stop="emit('play')"
  >
    <UiIcon>
      <icon-mdi-play />
    </UiIcon>
  </UiBtn>
  <UiBtn
    v-else
    :disabled="edit"
    :tooltip="{
      text: $vuetify.locale.t('$vuetify.timer-footer.pause'),
      location: 'top',
    }"
    size="x-small"
    icon
    @click.stop="emit('pause')"
  >
    <UiIcon>
      <icon-mdi-pause />
    </UiIcon>
  </UiBtn>
  <UiBtn
    size="x-small"
    icon
    :disabled="resetDisabled || edit"
    :tooltip="{
      text: $vuetify.locale.t('$vuetify.timer-footer.reset'),
      location: 'top',
    }"
    @click.stop="emit('reset')"
  >
    <UiIcon>
      <icon-mdi-repeat />
    </UiIcon>
  </UiBtn>
</template>

<style></style>
