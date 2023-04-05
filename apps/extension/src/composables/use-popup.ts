import { wait } from '@/logic/utils/time/wait'
interface Options {
  open?: (...args: any[]) => (void) | (Promise<void>)
  close?: (...args: any[]) => (void) | (Promise<void>)
  clear?: () => (void) | (Promise<void>)
  save?: (options: { preventClosing: () => void; }, ...args: any[]) => (void) | (Promise<void>)
}
export function usePopup (opt: Options) {
  const show = ref(false)

  async function open (...args: any[]) {
    show.value = true
    await opt.open?.(...args)
  }

  async function close (...args: any[]) {
    show.value = false
    await opt.close?.(...args)
    await wait(200)
    opt.clear?.()
  }

  async function save (...args: any[]) {
    let shouldClose = true
    const preventClosing = () => (shouldClose = false)

    await opt.save?.({ preventClosing }, ...args)
    if (!shouldClose) { return }
    show.value = false
    await wait(200)
    opt.clear?.()
  }

  return {
    show,
    open,
    close,
    save
  }
}
