import { createApp } from 'vue'
import router from './router'
import './style.css'
import App from './App.vue'
import Antd from 'antdv-next';
import 'antdv-next/dist/reset.css';

createApp(App).use(router).use(Antd).mount('#app')
