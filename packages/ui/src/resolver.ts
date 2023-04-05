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
