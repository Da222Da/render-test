import { createApp } from "vue";
import "./style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/display.css";
import router from "./router";

import Markmap from "@zhangxianjue/markmap";
import "@zhangxianjue/markmap/dist/style.css";

import App from "./App.vue";
const app = createApp(App);

// 插件
app.use(router);
app.use(ElementPlus);
app.use(Markmap);

// 指令
// app.directive("link", linkDirective);

app.mount("#app");
