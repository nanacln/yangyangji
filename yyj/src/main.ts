import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from './tool/vant'
// import "./assets/font/iconfont.css";
// import 'vant/es/button/style';
const app=createApp(App)
app.use(vant)
app.use(store).use(router)


app.mount('#app')
