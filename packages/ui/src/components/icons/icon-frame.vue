<script setup lang="ts">
import { computed } from 'vue'
import { useTooltip } from '../../composables/use-tooltip'
import type { TooltipProps } from '../../composables/use-tooltip'
type Size = 'x-small' | 'small' | 'default' | 'large' | 'x-large';

const props = withDefaults(
  defineProps<{
    tooltip: TooltipProps['tooltip'];
    size: Size;
  }>(),
  {
    tooltip: undefined,
    size: 'default'
  }
)
defineEmits([])

const frameStyle = computed(() => {
  switch (props.size) {
    case 'x-small':
      return 'width: 32px; height: 32px'
    case 'small':
      return 'width: 32px; height: 32px' // CORRECT
    case 'default':
      return 'width: 32px; height: 32px'
    case 'large':
      return 'width: 32px; height: 32px'
    case 'x-large':
      return 'width: 32px; height: 32px'
    default:
      return 'width: 32px; height: 32px'
  }
})
const { text: tooltipText, location: tooltipLocation } = useTooltip(props)
</script>
<template>
  <div class="d-flex align-center justify-center" :style="frameStyle">
    <slot />
    <v-tooltip v-if="tooltip" activator="parent" :location="tooltipLocation">
      {{ tooltipText }}
    </v-tooltip>
  </div>
</template>
