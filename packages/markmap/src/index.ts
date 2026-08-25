import type { App, Plugin } from "vue";
import Markmap from "./App.vue";

// 导出
export { Markmap };

export default {
  install: (app: App) => {
    app.component("Markmap", Markmap);
  },
} as Plugin;
