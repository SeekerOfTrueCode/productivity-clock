import { PartialRecord } from '@/models/partial-record'

export function useEvents<Events extends string, EventCallback extends Function> () {
  const events = ref<PartialRecord<Events, EventCallback>>({})
  function addEventListener (event: Events, callback: EventCallback) {
    events.value[event] = callback
  }
  function removeEventListener (event: Events) {
    delete events.value[event]
  }

  return {
    events,
    addEventListener,
    removeEventListener
  }
}
