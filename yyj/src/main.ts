import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from './tool/vant'
import VueMoCropper from 'vue-mocropper'
import 'vue-mocropper/dist/mocropper.min.css';
// import "./assets/font/iconfont.css";
// import 'vant/es/button/style';
const app=createApp(App)
app.use(vant)
app.use(store).use(router)
app.use(VueMoCropper)

app.mount('#app')
