<script setup lang="ts">
import { AudioSourceType } from '@@/src/logic/audio/audio-players/types/audio-source-type'
import {
  StorageType,
  useSoundsAndMusicStore
} from '@/logic/storage/sounds-and-music'
import { usePopup } from '@/composables/use-popup'

const soundsAndMusicStore = useSoundsAndMusicStore()

const edit = ref(false)

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

const {
  show: popupShow,
  open: popupOpen,
  close: popupClose,
  save: popupSave
} = usePopup({
  open (_key: string) {
    if (!edit.value) {
    }
    // get and assign exisiting elem
  },
  clear () {
    name.value = ''
    uri.value = ''
    sourceType.value = null
  },
  save () {
    if (name.value === null) {
      return
    }
    if (uri.value === null) {
      return
    }
    if (sourceType.value === null) {
      return
    }
    soundsAndMusicStore.set(StorageType.Music, name.value, {
      name: name.value,
      uri: uri.value,
      sourceType: sourceType.value
    })
  }
})
</script>

<template>
  <UiLayout class="d-flex flex-column">
    <v-toolbar :border="true" density="compact" :title="'Sounds and music'" />
    <UiCard v-for="[key, sound] in getSoundsEntries" :key="key">
      <v-list>
        <v-list-subheader inset>
          {{ sound.name }}
        </v-list-subheader>

        <v-list-item title="Uri">
          <template #prepend>
            <v-avatar color="grey-lighten-1">
              <UiIcon>
                <icon-mdi-link />
              </UiIcon>
            </v-avatar>
          </template>
          {{ sound.uri }}
        </v-list-item>
        <v-list-item title="Type">
          <template #prepend>
            <v-avatar color="grey-lighten-1">
              <UiIcon>
                <icon-mdi-folder />
              </UiIcon>
            </v-avatar>
          </template>
          {{ sound.sourceType }}
        </v-list-item>
      </v-list>
    </UiCard>

    <UiDialog v-model="popupShow">
      <UiCard class="w-[400px]">
        <UiCardText> {{ edit ? "Edit sound" : "Add new sound" }}</UiCardText>
        <UiCardText>
          <UiTextField v-model="name" label="Name">
            <template #prepend>
              <UiIcon>
                <icon-mdi-rename-box />
              </UiIcon>
            </template>
          </UiTextField>
          <UiTextField v-model="uri" label="Uri">
            <template #prepend>
              <UiIcon>
                <icon-mdi-link />
              </UiIcon>
            </template>
          </UiTextField>

          <v-select v-model="sourceType" label="Type" :items="soundTypes">
            <template #prepend>
              <UiIcon>
                <icon-mdi-folder />
              </UiIcon>
            </template>
          </v-select>
        </UiCardText>
        <CardActionsSaveCancel @save="popupSave" @cancel="popupClose" />
      </UiCard>
    </UiDialog>
  </UiLayout>
  <div
    style="position: absolute; bottom: 1.5rem; right: 2rem"
    class="d-flex align-center flex-column"
  >
    <UiBtnGroup divided variant="outlined">
      <UiBtn
        :disabled="!edit && getSoundsEntries.length === 0"
        @click="edit = !edit"
      >
        <UiIcon>
          <icon-mdi-check v-if="edit" />
          <icon-mdi-pencil v-else />
        </UiIcon>
      </UiBtn>

      <UiBtn :disabled="edit" @click="popupOpen()">
        <UiIcon>
          <icon-mdi-plus />
        </UiIcon>
      </UiBtn>
    </UiBtnGroup>
  </div>
</template>

<route lang="yaml">
name: "Sounds and music"
meta:
  title: "Sounds and music page"
  layout: options-default
</route>
