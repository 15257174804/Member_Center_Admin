import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import router from './router'
Vue.use(Router)

import store from './store'
//全局变量
import global_ from './api/global'
Vue.prototype.global = global_

import axios from 'axios'
Vue.prototype.axios = axios
axios.defaults.baseURL = global_.baseURL

//引用element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

// 使用echarts
import echarts from 'echarts'
Vue.prototype.echarts = echarts

//des加密解密
import { encryptDes, decryptDes } from './api/des'  // 引用路径根据自己的文件结构而定
Vue.prototype.encryptDes = encryptDes
Vue.prototype.decryptDes = decryptDes

// 过滤器
import filters from './filter/index'
for (let key in filters) {
  Vue.filter(key, filters[key])
}
// 取色器
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)

//base64加密
const Base64 = require('js-base64').Base64

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


// 请求拦截
axios.interceptors.request.use(config => {
  if (localStorage.loginToken) {
    if(config.params){
      config.params.token = localStorage.loginToken;
      config.params.queryType=2;
    }else{
      config.params = {token:localStorage.loginToken,queryType:2};
    }
  }
  // 判断是否有token
  if (localStorage.loginToken) {
    config.params.token = localStorage.loginToken;
    config.headers.Authorization = localStorage.loginToken;
  }
  return config;
}, err => {
  // 请求错误
  return Promise.reject(err);
})

// 响应拦截（不用每次请求都写一遍catch）

axios.interceptors.response.use(res => {
  return res;
},
  err => {
    const { status } = err.response;
    if (status == 401) {
      // 后台定义401为过期
      alert("用户信息过期,请重新登录!")
      // 清楚token
      localStorage.removeItem("loginToken");
      router.push("/login");
    } else {
      console.log(err.response.data)
    }
    return Promise.reject(err);
  });
