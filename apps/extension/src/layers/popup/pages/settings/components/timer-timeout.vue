<script setup lang="ts">
import { VForm } from 'vuetify/lib/components/VForm/index'
import { useCommonValidations } from '@/composables/use-common-validations'
import { useSoundsAndMusicStore } from '@/logic/storage/sounds-and-music'
const soundsAndMusicStore = useSoundsAndMusicStore()

const formRef = ref<InstanceType<typeof VForm>>()
const { required: ruleRequired, timer: ruleTimer } = useCommonValidations()

const _timeout = ref(soundsAndMusicStore.timerTimeout.time)
const timeout = computed({
  get () {
    return _timeout.value
  },
  async set (value: string) {
    _timeout.value = value

    const { valid } = (await formRef.value?.validate()) ?? { valid: false }
    if (valid) {
      soundsAndMusicStore.timerTimeout.time = value
    }
  }
})
</script>

<template>
  <div class="d-flex align-center" style="margin-inline-start: -8px">
    <UiBtn
      icon
      size="small"
      class="pa-0"
      style="margin-inline-end: 8px; margin-block-end: 22px"
      @click="
        soundsAndMusicStore.timerTimeout.enabled =
          !soundsAndMusicStore.timerTimeout.enabled
      "
    >
      <UiIcon style="width: 100%; height: 100%">
        <icon-mdi-clock v-if="soundsAndMusicStore.timerTimeout.enabled" />
        <icon-mdi-clock-remove v-else />
      </UiIcon>
    </UiBtn>
    <v-form ref="formRef" style="width: 100%">
      <UiTextField
        v-model="timeout"
        :disabled="!soundsAndMusicStore.timerTimeout.enabled"
        :label="
          $t('settings-page.sounds-and-music-page.application-timer-timeout')
        "
        :rules="[
          ruleRequired(
            $t('settings-page.sounds-and-music-page.application-timer-timeout')
          ),
          ruleTimer(
            $t('settings-page.sounds-and-music-page.application-timer-timeout')
          ),
        ]"
      />
    </v-form>
  </div>
</template>
