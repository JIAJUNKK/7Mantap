import App from './App.vue';
import { createApp } from 'vue';
import router from './script/index.js';
import axiosInstance from '../http-common.js';


const APIURL = process.env.MY_API_URL;
const BASEURL = process.env.MY_BASE_URL;

const app = createApp(App);
app.config.globalProperties.$axios = axiosInstance;
app.config.globalProperties.$api_path = APIURL;
app.config.globalProperties.$base_url = BASEURL;


app.use(router);
app.mount('#app');
