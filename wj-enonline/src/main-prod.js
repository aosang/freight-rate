import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, {locale})

// Vue.use(ElementUi)

Vue.config.productionTip = false

// axios配置
import axios from 'axios'
Vue.prototype.$http = axios

// 数据加密
import cryptoJs from 'crypto-js'
Vue.use(cryptoJs)

// 导入progress
import NProgress from 'nprogress'


// 公共接口
// axios.defaults.baseURL = 'http://192.168.77.250:81/apis/'
// axios.defaults.baseURL = 'https://www.pandalogqd.com/apis/'
axios.defaults.baseURL = 'https://wxa.worldjaguar.com/apis/'

// 请求超时
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['ApiType'] = '1'
axios.defaults.headers.post['Lang'] = 'en-us'
axios.defaults.headers.post['RegCom'] = '2'

// 请求拦截器
axios.interceptors.request.use(config => {
   // 判断访问设备
   const isMobile = /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent)
   if(isMobile) {
     window.location.href = 'http://online.worldjaguar.com/wrap'
   }

  NProgress.start()
  let token = JSON.parse(window.localStorage.getItem('enloginInfo'))
  if(token !== null) {
    config.headers.Authorization = `${token.F_Token}`
  }
  return config
})

axios.interceptors.response.use(response => {
  NProgress.done()
  if(response.data.code === 401) {
    window.localStorage.removeItem('enloginInfo')
    router.replace({
      path: '/Login'
    })
    // Message({
    //   message: '请重新登录！',
    //   type: 'warning',
    //   duration: 3000
    // })
  }
  return response
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')