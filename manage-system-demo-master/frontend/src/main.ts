import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/src/index.scss'; // 引入 Element Plus 的 SCSS

import router from './router';
import { createPinia } from 'pinia';
import createPersistedState from 'pinia-plugin-persistedstate'

const pinia = createPinia();
pinia.use(createPersistedState);

const app = createApp(App);

app.use(ElementPlus, { size: 'default' });
app.use(pinia);
app.use(router);


app.mount('#app');
