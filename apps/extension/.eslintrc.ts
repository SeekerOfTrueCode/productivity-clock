import config from '@nobodyz/productivity-clock_eslint-config-custom'
const _config = {
  ...config
}
_config.extends = [..._config.extends, './.eslintrc-auto-import.json']

export default _config
