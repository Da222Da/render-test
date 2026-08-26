import { createApp } from "vue";

// css
import "@/assets/css/style.css";

// element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/display.css";

// router
import router from "./router";

// markmap
import Markmap from "@zhangxianjue/markmap";
import "@zhangxianjue/markmap/dist/style.css";

// app
import App from "./App.vue";
const app = createApp(App);

// 插件
app.use(router);
app.use(ElementPlus);
app.use(Markmap);

app.mount("#app");
