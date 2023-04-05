<script setup lang="ts">
import { AudioSourceType } from '@@/src/logic/audio/audio-players/types/audio-source-type'
import {
  StorageType,
  useSoundsAndMusicStore
} from '@/logic/storage/sounds-and-music'
import { VForm } from 'vuetify/lib/components/VForm/index'
import { useCommonValidations } from '@/composables/use-common-validations'
import { usePopup } from '@/composables/use-popup'

const soundsAndMusicStore = useSoundsAndMusicStore()

const formRef = ref<InstanceType<typeof VForm>>()
const { required: ruleRequired, uri: ruleUri } = useCommonValidations()

const edit = ref(false)

const editKey = ref<string | null>(null)
const name = ref('')
const uri = ref('')
const sourceType = ref<AudioSourceType | null>(null)

const soundTypes = computed(() => [
  { value: AudioSourceType.DirectResource, title: 'Direct resource url' },
  { value: AudioSourceType.YouTube, title: 'YouTube url' }
])
const getSoundsEntries = computed(() =>
  Object.entries(soundsAndMusicStore.sounds)
)

function formatType (type: string) {
  const item = soundTypes.value.find(x => x.value === type)
  return item?.title ?? type
}

const {
  show: popupShow,
  open: popupOpen,
  close: popupClose,
  save: popupSave
} = usePopup({
  open (key: string) {
    if (!edit.value) {
      return
    }
    const oldSound = soundsAndMusicStore.get(StorageType.Sound, key)
    editKey.value = key
    name.value = oldSound!.name
    uri.value = oldSound!.uri
    sourceType.value = oldSound!.sourceType
  },
  clear () {
    name.value = ''
    uri.value = ''
    sourceType.value = null
  },
  async save ({ preventClosing }) {
    const { valid } = (await formRef.value?.validate()) ?? { valid: false }
    if (!valid) {
      return preventClosing()
    }

    const editSound = edit.value && editKey.value != null
    if (editSound) {
      const oldSound = soundsAndMusicStore.get(
        StorageType.Sound,
        editKey.value!
      )
      soundsAndMusicStore.set(StorageType.Sound, editKey.value!, {
        ...oldSound,
        name: name.value,
        uri: uri.value,
        sourceType: sourceType.value!
      })
    } else {
      soundsAndMusicStore.add(StorageType.Sound, {
        name: name.value,
        uri: uri.value,
        sourceType: sourceType.value!
      })
    }
  }
})
</script>

<template>
  <v-table fixed-header density="compact" height="400px">
    <thead>
      <tr>
        <th class="text-left">
          <div class="d-flex align-center justify-start">
            {{
              $t(
                "settings-page.sounds-and-music-page.sound-repository-header-name"
              )
            }}
            <icon-mdi-rename-box class="ml-1" />
          </div>
        </th>
        <th class="text-left">
          <div class="d-flex align-center justify-start">
            {{
              $t(
                "settings-page.sounds-and-music-page.sound-repository-header-type"
              )
            }}
            <icon-mdi-folder class="ml-1" />
          </div>
        </th>
        <th class="text-left">
          <div class="d-flex align-center justify-start">
            {{
              $t(
                "settings-page.sounds-and-music-page.sound-repository-header-uri"
              )
            }}
            <icon-mdi-link class="ml-1" />
          </div>
        </th>
        <th class="text-left" />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="[key, sound] in getSoundsEntries"
        :key="key"
        v-ripple
        :class="{ 'pointer-events-none': !edit || sound.isDefault }"
        @click.stop="popupOpen(key)"
      >
        <td class="text-left">
          {{ sound.name }}
        </td>
        <td class="text-left">
          {{ formatType(sound.sourceType) }}
        </td>
        <td class="text-left">
          {{ sound.uri }}
        </td>
        <td class="text-left">
          <UiBtn
            v-if="edit && !sound.isDefault"
            size="small"
            icon
            @click.stop="soundsAndMusicStore.remove(StorageType.Sound, key)"
          >
            <UiIcon>
              <icon-mdi-close />
            </UiIcon>
          </UiBtn>
        </td>
      </tr>
    </tbody>
  </v-table>

  <UiDialog v-model="popupShow">
    <UiCard class="w-[400px]">
      <UiCardText>
        {{
          edit
            ? $t(
              "settings-page.sounds-and-music-page.sound-repository-edit-sound"
            )
            : $t(
              "settings-page.sounds-and-music-page.sound-repository-add-new-sound"
            )
        }}
      </UiCardText>
      <UiCardText>
        <v-form ref="formRef">
          <UiTextField
            v-model="name"
            density="compact"
            :rules="[
              ruleRequired(
                $t(
                  'settings-page.sounds-and-music-page.sound-repository-header-name'
                )
              ),
            ]"
            :label="
              $t(
                'settings-page.sounds-and-music-page.sound-repository-header-name'
              )
            "
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-rename-box />
              </UiIcon>
            </template>
          </UiTextField>
          <UiTextField
            v-model="uri"
            density="compact"
            :rules="[
              ruleRequired(
                $t(
                  'settings-page.sounds-and-music-page.sound-repository-header-uri'
                )
              ),
              ruleUri(
                $t(
                  'settings-page.sounds-and-music-page.music-repository-header-uri'
                )
              ),
            ]"
            :label="
              $t(
                'settings-page.sounds-and-music-page.sound-repository-header-uri'
              )
            "
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-link />
              </UiIcon>
            </template>
          </UiTextField>

          <v-select
            v-model="sourceType"
            density="compact"
            :rules="[
              ruleRequired(
                $t(
                  'settings-page.sounds-and-music-page.sound-repository-header-type'
                )
              ),
            ]"
            :label="
              $t(
                'settings-page.sounds-and-music-page.sound-repository-header-type'
              )
            "
            :items="soundTypes"
          >
            <template #prepend>
              <UiIcon>
                <icon-mdi-folder />
              </UiIcon>
            </template>
          </v-select>
        </v-form>
      </UiCardText>
      <CardActionsSaveCancel @save="popupSave" @cancel="popupClose" />
    </UiCard>
  </UiDialog>

  <EditAddButtonsFloating
    v-model:edit="edit"
    :edit-disabled="getSoundsEntries.length === 0"
    :edit-tooltip="
      $t('settings-page.sounds-and-music-page.sound-repository-edit-sound')
    "
    :edit-finish-tooltip="
      $t('settings-page.sounds-and-music-page.sound-repository-edit-finish')
    "
    :add-tooltip="
      $t('settings-page.sounds-and-music-page.sound-repository-add-new-sound')
    "
    @add="popupOpen"
  />
</template>
