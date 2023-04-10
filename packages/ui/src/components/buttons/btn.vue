<script setup lang="ts">
import { ref } from 'vue'
import { useTooltip } from '../../composables/use-tooltip'
import type { TooltipProps } from '../../composables/use-tooltip'

const props = withDefaults(
  defineProps<{
    tooltip?: TooltipProps['tooltip'];
  }>(),
  { tooltip: undefined }
)
defineEmits([])
const { text: tooltipText, location: tooltipLocation } = useTooltip(props)

const btnRef = ref()
</script>
<template>
  <VBtn ref="btnRef" v-bind="$attrs">
    <template
      v-for="slotName in Object.keys($slots)"
      #[slotName]="_props"
      :key="slotName"
    >
      <slot v-if="slotName === 'default'" v-bind="_props" />
      <slot v-else :name="slotName" v-bind="_props" />
    </template>
  </VBtn>
  <VTooltip v-if="tooltip && !$attrs.disabled" :activator="btnRef" :location="tooltipLocation">
    {{ tooltipText }}
  </VTooltip>
</template>
