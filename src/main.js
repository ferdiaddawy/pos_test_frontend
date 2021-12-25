import { createApp } from 'vue'
import axios from "axios";
axios.defaults.baseURL = 'http://127.0.0.1:8000/'
import Antd from 'ant-design-vue';
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css';

// createApp(App).use(router).mount('#app')

const app = createApp(App);
app.use(Antd);
app.use(router).mount('#app');
app.config.productionTip = false;

