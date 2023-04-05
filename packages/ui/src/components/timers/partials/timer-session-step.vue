<script setup lang="ts">
import UiBtn from '../../buttons/btn.vue'
import UiIcon from '../../icons/icon.vue'

withDefaults(
  defineProps<{
    active: boolean;
    edit: boolean;
    title: string;
    step: number | 'break';
    stepCount: number;
    time: string;
  }>(),
  { active: false, step: 0, stepCount: 0, time: '00:00:00' }
)
const emit = defineEmits(['edit'])
</script>

<template>
  <v-card
    variant="outlined"
    class="d-flex flex-column justify-center"
    style="width: 5.5rem"
    :color="active ? 'primary' : undefined"
    :link="edit"
    @click.stop="emit('edit')"
  >
    <template v-if="step !== 'break'">
      <div>
        {{
          $vuetify.locale.t(
            "$vuetify.timer-session-step.step",
            step + 1,
            stepCount
          )
        }}
      </div>
    </template>
    <div v-else>
      {{ $vuetify.locale.t("$vuetify.timer-session-step.break") }}
    </div>
    <v-divider />
    <div>{{ title }}</div>
    <v-divider />
    <div>
      {{ time }}
    </div>
  </v-card>
</template>

<style scoped></style>
