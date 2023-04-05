<script setup lang="ts">
import {
  TimeSchema,
  useTimerSessionStore
} from '@/logic/storage/timer-session'
import { VForm } from 'vuetify/lib/components/VForm/index'
import { useCommonValidations } from '@/composables/use-common-validations'
import { useDefaultTimerSoundStore } from '@/logic/storage/default-timer-sound'
import { usePopup } from '@/composables/use-popup'
import { useSoundsAndMusicStore } from '@/logic/storage/sounds-and-music'
const props = defineProps<{
  edit: boolean;
}>()

const timerSessionStore = useTimerSessionStore()
const defaultTimerSoundStore = useDefaultTimerSoundStore()

const formRef = ref<InstanceType<typeof VForm>>()
const { required: ruleRequired, timer: ruleTimer } = useCommonValidations()

const editKey = ref<string | null>(null)
const stepEditedTimer = ref<TimeSchema | null>(null)
const stepTitle = ref('Step')
const stepTime = ref('00:25:00')
const stepSoundKey = ref(defaultTimerSoundStore.data.soundKey)
const { show, open, close, save } = usePopup({
  open (key: string, timer: TimeSchema) {
    if (!props.edit) {
      return
    }
    editKey.value = key
    stepEditedTimer.value = timer

    stepTitle.value = timer.title
    stepTime.value = timer.time
    stepSoundKey.value = timer.soundKey
  },
  clear () {
    editKey.value = null
    stepEditedTimer.value = null

    stepTitle.value = 'Step'
    stepTime.value = '00:25:00'
    stepSoundKey.value = defaultTimerSoundStore.data.soundKey
  },
  async save ({ preventClosing }) {
    const { valid } = (await formRef.value?.validate()) ?? { valid: false }
    if (!valid) {
      return preventClosing()
    }

    if (stepEditedTimer.value?.id == null) {
      return
    }
    timerSessionStore.editSessionTimerStep(
      editKey.value!,
      stepEditedTimer.value!.id,
      {
        ...stepEditedTimer.value,
        id: stepEditedTimer.value.id,
        title: stepTitle.value,
        time: stepTime.value,
        soundKey: stepSoundKey.value
      }
    )
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
    <UiCard class="w-[400px]">
      <UiCardText>
        {{ $t("productivity-sessions-page.popup-step-edit-timer") }}
      </UiCardText>
      <UiCardText>
        <v-form ref="formRef">
          <UiTextField
            v-model="stepTitle"
            :label="$t('productivity-sessions-page.popup-label-step-name')"
            :rules="[
              ruleRequired(
                $t('productivity-sessions-page.popup-label-step-name')
              ),
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
            v-model="stepTime"
            :label="$t('productivity-sessions-page.popup-label-step-time')"
            :rules="[
              ruleRequired(
                $t('productivity-sessions-page.popup-label-step-time')
              ),
              ruleTimer($t('productivity-sessions-page.popup-label-step-time')),
            ]"
            density="compact"
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-clock />
              </UiIcon>
            </template>
          </UiTextField>
          <UiSelect
            v-model="stepSoundKey"
            :label="$t('productivity-sessions-page.popup-label-step-sound')"
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
