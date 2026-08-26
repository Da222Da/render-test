/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "@zhangxianjue/markdown-editor-v3" {
  const Markdown: any;
  export { Markdown };
}

declare module "@zhangxianjue/markmap" {
  const Markmap: any;
  export default Markmap;
}
