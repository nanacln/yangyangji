/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'vue-mocropper'{
  export default any
}
interface Window {
  vaptcha: any;
  TCPlayer: any
}