import { useI18n } from 'vue-i18n'

export function useCommonValidations () {
  const { t } = useI18n()

  const required = (title?: string) => (v: string) =>
    !!v || t('$validations-common.required', { subject: title ?? t('global.field') })

  const numberMin = (min: number, title?: string) => (v: string | number) =>
    (+v >= min) || t('$validations-common.number-min', { subject: title ?? t('global.field'), min })
  const numberMax = (max: number, title?: string) => (v: string | number) =>
    (+v <= max) || t('$validations-common.number-max', { subject: title ?? t('global.field'), max })

  const timer = (title?: string) => {
    const timerRegex = /^\d\d:\d\d:\d\d$/g
    return (v: string) => {
      const isValid = timerRegex.test(v)
      timerRegex.lastIndex = 0
      return isValid || t('$validations-common.timer', { subject: title ?? t('global.field') })
    }
  }

  const uri = (title?: string) => {
    const timerRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
    return (v: string) => {
      const isValid = timerRegex.test(v)
      timerRegex.lastIndex = 0
      return isValid || t('$validations-common.uri', { subject: title ?? t('global.field') })
    }
  }

  return {
    numberMin,
    numberMax,
    required,
    timer,
    uri
  }
}
