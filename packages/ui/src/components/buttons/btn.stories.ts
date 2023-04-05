import Btn from './btn.vue'

export default {
  /* 👇 The title prop is optional.
      * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
      * to learn how to generate automatic titles
      */
  title: 'Btn',
  component: Btn
}

export const Primary = () => ({
  components: { Btn },
  template: '<Btn>Test</Btn>'
})
