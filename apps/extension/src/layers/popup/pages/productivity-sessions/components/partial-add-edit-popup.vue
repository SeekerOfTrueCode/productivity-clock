<script setup lang="ts">
import { VForm } from 'vuetify/lib/components/VForm/index'
import { elapsedTimeToHms } from '@/logic/utils/time/hms-format-clock-hms'
import { hmsToSeconds } from '@/logic/utils/time/hms-to-seconds'
import { useCommonValidations } from '@/composables/use-common-validations'
import { useDefaultTimerSoundStore } from '@/logic/storage/default-timer-sound'
import { usePopup } from '@/composables/use-popup'
import { useSoundsAndMusicStore } from '@/logic/storage/sounds-and-music'
import { useTimerSessionStore } from '@/logic/storage/timer-session'
const props = defineProps<{
  edit: boolean;
}>()

const timerSessionStore = useTimerSessionStore()
const defaultTimerSoundStore = useDefaultTimerSoundStore()

const formRef = ref<InstanceType<typeof VForm>>()
const {
  required: ruleRequired,
  timer: ruleTimer,
  numberMin: ruleNumberMin,
  numberMax: ruleNumberMax
} = useCommonValidations()

const editKey = ref<string | null>(null)
const sessionTitle = ref('Session')
const sessionTime = ref('00:25:00')
const sessionBreakTime = ref('00:05:00')
const sessionSteps = ref<number>(2)
const sessionSoundKey = ref<string | undefined>(
  defaultTimerSoundStore.data.soundKey
)
const sessionBreakSoundKey = ref<string | undefined>(
  defaultTimerSoundStore.data.soundKey
)

const { show, open, close, save } = usePopup({
  open (key: string) {
    if (!props.edit) {
      return
    }
    const oldSessionTimer = timerSessionStore.sessionTimersStatic[key]
    editKey.value = key

    sessionTitle.value = oldSessionTimer.title
    sessionTime.value = '00:25:00'
    sessionBreakTime.value = '00:05:00'
    sessionSteps.value = Math.ceil(oldSessionTimer.timers.length / 2)
    sessionSoundKey.value = defaultTimerSoundStore.data.soundKey
    sessionBreakSoundKey.value = defaultTimerSoundStore.data.soundKey
  },
  clear () {
    editKey.value = null
    sessionTitle.value = 'Session'
    sessionTime.value = '00:25:00'
    sessionBreakTime.value = '00:05:00'
    sessionSteps.value = 2
    sessionSoundKey.value = defaultTimerSoundStore.data.soundKey
    sessionBreakSoundKey.value = defaultTimerSoundStore.data.soundKey
  },
  async save ({ preventClosing }) {
    const { valid } = (await formRef.value?.validate()) ?? { valid: false }
    if (!valid) {
      return preventClosing()
    }

    const editTimer = props.edit && editKey.value != null
    if (editTimer) {
      timerSessionStore.editSessionTimer(editKey.value!, {
        title: sessionTitle.value,
        timeSession: sessionTime.value,
        timeBreak: sessionBreakTime.value,
        steps: sessionSteps.value,
        soundKey: sessionSoundKey.value,
        soundBreakKey: sessionBreakSoundKey.value
      })
    } else {
      timerSessionStore.addSessionTimer({
        title: sessionTitle.value,
        timeSession: sessionTime.value,
        timeBreak: sessionBreakTime.value,
        steps: sessionSteps.value,
        soundKey: sessionSoundKey.value,
        soundBreakKey: sessionBreakSoundKey.value
      })
    }
  }
})

const sessionSumTime = computed(() => {
  const stepTime = hmsToSeconds(sessionTime.value)
  const breakTime = hmsToSeconds(sessionBreakTime.value)
  const sum =
    stepTime * sessionSteps.value + breakTime * (sessionSteps.value - 1)
  return elapsedTimeToHms(sum)
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
    <UiCard class="w-[400px]">
      <UiCardText>
        {{
          edit
            ? $t("productivity-sessions-page.popup-edit-timer")
            : $t("productivity-sessions-page.popup-add-timer")
        }}
      </UiCardText>
      <UiCardText>
        <v-form ref="formRef">
          <UiTextField
            v-model="sessionTitle"
            :label="$t('productivity-sessions-page.popup-label-name')"
            :rules="[
              ruleRequired($t('productivity-sessions-page.popup-label-name')),
            ]"
            density="compact"
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-rename-box />
              </UiIcon>
            </template>
          </UiTextField>
          <UiTextField
            v-model="sessionTime"
            :label="$t('productivity-sessions-page.popup-label-session-time')"
            :rules="[
              ruleRequired(
                $t('productivity-sessions-page.popup-label-session-time')
              ),
              ruleTimer(
                $t('productivity-sessions-page.popup-label-session-time')
              ),
            ]"
            density="compact"
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-clock />
              </UiIcon>
            </template>
          </UiTextField>
          <UiTextField
            v-model="sessionBreakTime"
            :label="
              $t('productivity-sessions-page.popup-label-session-break-time')
            "
            :rules="[
              ruleRequired(
                $t('productivity-sessions-page.popup-label-session-break-time')
              ),
              ruleTimer(
                $t('productivity-sessions-page.popup-label-session-break-time')
              ),
            ]"
            density="compact"
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-clock />
              </UiIcon>
            </template>
          </UiTextField>
          <div class="d-flex">
            <UiTextField
              v-model="sessionSteps"
              style="flex: 0 0 140px"
              :label="$t('productivity-sessions-page.popup-label-steps')"
              max="32"
              min="2"
              type="number"
              :rules="[
                ruleRequired(
                  $t('productivity-sessions-page.popup-label-steps')
                ),
                ruleNumberMin(
                  2,
                  $t('productivity-sessions-page.popup-label-steps')
                ),
                ruleNumberMax(
                  32,
                  $t('productivity-sessions-page.popup-label-steps')
                ),
              ]"
              density="compact"
            >
              <template #prepend>
                <UiIcon>
                  <icon-mdi-counter />
                </UiIcon>
              </template>
            </UiTextField>
            <UiSlider
              v-model="sessionSteps"
              step="1"
              :min="2"
              :max="16"
              show-ticks="always"
              density="compact"
              style="flex: 1; margin-inline: 0px"
            />
          </div>
          <div
            class="d-flex flex-column justify-center align-center h-[64px]"
            style="padding-bottom: 22px"
          >
            <VLabel>
              {{
                $t(
                  "productivity-sessions-page.popup-label-total-session-duration",
                  { sessionSumTime }
                )
              }}
            </VLabel>
          </div>
          <UiSelect
            v-model="sessionSoundKey"
            :label="$t('productivity-sessions-page.popup-label-ring-sound')"
            :items="soundItems"
            density="compact"
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-folder />
              </UiIcon>
            </template>
          </UiSelect>
          <UiSelect
            v-model="sessionBreakSoundKey"
            :label="
              $t('productivity-sessions-page.popup-label-break-ring-sound')
            "
            :items="soundItems"
            density="compact"
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-folder />
              </UiIcon>
            </template>
          </UiSelect>
        </v-form>
      </UiCardText>
      <CardActionsSaveCancel @save="save" @cancel="close" />
    </UiCard>
  </UiDialog>
</template>

<style></style>
