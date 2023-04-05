<script setup lang="ts">
import { VForm } from 'vuetify/lib/components/VForm/index'
import { useCommonValidations } from '@/composables/use-common-validations'
import { useDefaultTimerSoundStore } from '@/logic/storage/default-timer-sound'
import { usePopup } from '@/composables/use-popup'
import { useSoundsAndMusicStore } from '@/logic/storage/sounds-and-music'
import { useTimerStore } from '@/logic/storage/timer'
const timerStore = useTimerStore()
const defaultTimerSoundStore = useDefaultTimerSoundStore()

const props = defineProps<{
  edit: boolean;
}>()

const formRef = ref<InstanceType<typeof VForm>>()
const { required: ruleRequired, timer: ruleTimer } = useCommonValidations()

const editKey = ref<string | null>(null)

const time = ref('00:00:00')
const title = ref('Timer')
const soundKey = ref<string | undefined>(defaultTimerSoundStore.data.soundKey)

const { show, open, close, save } = usePopup({
  open (key: string) {
    if (!props.edit) {
      return
    }
    const oldTimer = timerStore.getTimer(key)
    editKey.value = key
    title.value = oldTimer.title
    time.value = oldTimer.time
    soundKey.value = oldTimer.soundKey
  },
  clear () {
    editKey.value = null
    time.value = '00:00:00'
    title.value = 'Timer'
    soundKey.value = defaultTimerSoundStore.data.soundKey
    formRef.value?.resetValidation()
  },
  async save ({ preventClosing }) {
    const { valid } = (await formRef.value?.validate()) ?? { valid: false }
    if (!valid) {
      return preventClosing()
    }

    const editTimer = props.edit && editKey.value != null
    if (editTimer) {
      const oldTimer = timerStore.getTimer(editKey.value!)
      timerStore.setTimer(editKey.value!, {
        ...oldTimer,
        title: title.value,
        time: time.value,
        soundKey: soundKey.value
      })
    } else {
      timerStore.addTimer({
        title: title.value,
        time: time.value,
        soundKey: soundKey.value
      })
    }
  }
})

const soundsAndMusicStore = useSoundsAndMusicStore()
const soundItems = computed(() => [
  {
    value: undefined,
    title: ''
  },
  ...Object.entries(soundsAndMusicStore.sounds).map(x => ({
    value: x[0],
    title: x[1].name
  }))
])

defineExpose({
  open
})
</script>

<template>
  <UiDialog v-model="show">
    <UiCard class="w-[244px]">
      <v-form ref="formRef">
        <UiCardText>
          {{
            edit
              ? $t("timers-page.popup-edit-timer")
              : $t("timers-page.popup-add-timer")
          }}
        </UiCardText>
        <UiCardText>
          <!-- TODO: translate rules -->
          <UiTextField
            v-model="title"
            density="compact"
            :label="$t('timers-page.popup-label-name')"
            :rules="[ruleRequired($t('timers-page.popup-label-name'))]"
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-rename-box />
              </UiIcon>
            </template>
          </UiTextField>
          <UiTextField
            v-model="time"
            density="compact"
            :label="$t('timers-page.popup-label-time')"
            :rules="[
              ruleRequired($t('timers-page.popup-label-time')),
              ruleTimer($t('timers-page.popup-label-time')),
            ]"
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-clock />
              </UiIcon>
            </template>
          </UiTextField>
          <UiSelect
            v-model="soundKey"
            density="compact"
            :label="$t('timers-page.popup-label-ring-sound')"
            :items="soundItems"
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-folder />
              </UiIcon>
            </template>
          </UiSelect>
        </UiCardText>
      </v-form>
      <CardActionsSaveCancel @save="save" @cancel="close" />
    </UiCard>
  </UiDialog>
</template>

<style></style>
