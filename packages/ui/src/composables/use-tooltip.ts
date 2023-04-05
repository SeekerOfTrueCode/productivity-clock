import { computed } from 'vue'
import type { Anchor } from '../types/anchor'

export interface TooltipProps {
    tooltip?: { text: string; location?: Anchor } | string;
}

export function useTooltip (props: TooltipProps) {
  const text = computed(() =>
    typeof props.tooltip === 'string' ? props.tooltip : props.tooltip?.text
  )
  const location = computed<NonNullable<Anchor>>(() =>
    typeof props.tooltip === 'object' ? props.tooltip?.location ?? 'end' : 'end'
  )
  return {
    text,
    location
  }
}
