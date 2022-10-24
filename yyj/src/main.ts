import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from './tool/vant'
import VueMoCropper from 'vue-mocropper'
//为什么生产环境不生效
// import 'vue-mocropper/dist/mocropper.min.css';
import './assets/style/cropper.css'
const app=createApp(App)
app.use(vant)
app.use(store).use(router)
app.use(VueMoCropper)
app.config.globalProperties.$filters = {
  dealTime(value:number) {
    const v=(Math.ceil(new Date().getTime()/1000)- Math.ceil(value/1000))
    if(v<60){
      return '刚刚'
    }else if(v<3600){
      return Math.floor(v/60)+'分钟前'
    }else if(v<24*3600){
      return Math.floor(v/3600)+'小时前'
    }else if(v<30*24*3600){
      return Math.floor(v/(3600*24))+'天前'
    }else if(v<12*30*24*3600){
      return Math.floor(v/(3600*24*30))+'月前'
    }else{
      return Math.floor(v/(3600*24*30*12))+'年前'
    }
  },
  
}

// app.config.globalProperties.imagePrefix='http://106.14.172.134'
// app.config.globalProperties.imagePrefix='http://10.40.162.167:8666/'
app.config.globalProperties.imagePrefix=process.env.NODE_ENV==='development'?'http://localhost:8666/':''
// app.config.globalProperties.imagePrefix=process.env.NODE_ENV==='development'?'http://106.14.172.134':''
app.mount('#app')
