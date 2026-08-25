/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "@zhangxianjue/markdown-vue3" {
  const Markdown: any;
  export { Markdown };
}

declare module "@zhangxianjue/markmap" {
  const Markmap: any; // 如果知道具体类型，可以替换为更精确的类型
  export default Markmap;
}
