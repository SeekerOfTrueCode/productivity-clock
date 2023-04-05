<script setup lang="ts">
import { useTimer } from '../../composables/use-timer'
import UiBtn from '../buttons/btn.vue'
import UiIcon from '../icons/icon.vue'

const props = withDefaults(
  defineProps<{
    title: string;
    play: boolean;
    time: string;
    timeCurrent?: string;
    edit: boolean;
  }>(),
  { play: false, time: '00:00:00', timeCurrent: '00:00:00', edit: false }
)
const emit = defineEmits([
  'close',
  'reset',
  'play',
  'stop',
  'edit',
  'update:pin'
])

const { progress, timerPlay, timerStop } = useTimer({ props, emit })
</script>

<template>
  <v-card :style="{ width: `15rem`, height: `auto` }">
    <div class="d-flex">
      <div class="pl-1 pr-3 d-flex justify-center align-center">
        <div v-text="title" />
      </div>
      <div class="flex-1 d-flex flex-column justify-center align-center">
        <div
          class="text-center pb-1"
          style="font-size: 1.25rem"
          v-text="timeCurrent"
        />
        <v-progress-linear :model-value="100 + progress" />
      </div>
      <div class="pl-3 pr-1 d-flex" style="pointer-events: all !important">
        <UiBtn
          v-if="!play"
          size="x-small"
          icon
          :tooltip="{
            text: $vuetify.locale.t('$vuetify.timer-footer.play'),
            location: 'top',
          }"
          @click="timerPlay"
        >
          <UiIcon>
            <icon-mdi-play />
          </UiIcon>
        </UiBtn>
        <UiBtn
          v-else
          size="x-small"
          icon
          :tooltip="{
            text: $vuetify.locale.t('$vuetify.timer-footer.pause'),
            location: 'top',
          }"
          @click="timerStop"
        >
          <UiIcon>
            <icon-mdi-pause />
          </UiIcon>
        </UiBtn>
      </div>
    </div>
  </v-card>
</template>

<style></style>
