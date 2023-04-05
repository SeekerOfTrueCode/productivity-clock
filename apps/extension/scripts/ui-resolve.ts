// FIXME: instead of using this which is direct copy of the file from ui folder, I should find a way to import this file in vite.config.ts which has problem with not transpiled file
function UiResolve (opt?: {
    componentPrefix?: string;
}) {
  const componentPrefix = opt?.componentPrefix ?? ''
  const matchRegex = new RegExp(`^${componentPrefix}[A-Z]`) // /^Ui[A-Z]/
  return {
    type: 'component' as 'component' | 'directive',
    resolve: (name: string) => {
      if (name.match(matchRegex)) {
        return { name: name.replace(componentPrefix, ''), from: '@nobodyz/productivity-clock_ui' }
      }
    }
  }
}
export default UiResolve
