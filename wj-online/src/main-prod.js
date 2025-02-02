import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// Vue.use(ElementUi)

Vue.config.productionTip = false

// axios配置
import axios from 'axios'
Vue.prototype.$http = axios

// 数据加密
import cryptoJs from 'crypto-js'

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
axios.defaults.headers.post['Lang'] = 'zh-cn'
axios.defaults.headers.post['RegCom'] = '1'

// 加密公钥
// const pubkey = 'jagich2023system'
// const pubiv = 'jagich2023system'

// const key = CryptoJS.enc.Utf8.parse(pubkey)
// const iv = CryptoJS.enc.Utf8.parse(pubiv)

// 请求拦截器
axios.interceptors.request.use(config => {
  // 判断访问设备
  const isMobile = /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent)
  if(isMobile) {
    window.location.href = 'http://online.worldjaguar.com/miniwebpage/index.html'
  }

  NProgress.start()
  let token = JSON.parse(window.localStorage.getItem('loginInfo'))
  if (token !== null) {
    config.headers.Authorization = `${token.F_Token}`
  }
  // 判断config.data是否存在
  // let arr = config.data ? Object.keys(config.data) : ''
  // let len = arr.length
  // if (len > 0) {
  //   let ret = ''
  //   for (let it in config.data) {
  //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(config.data[it]) + '&';
  //   }
  //   // 数据加密
  //   const res = CryptoJS.enc.Utf8.parse(ret)
  //   const encryptStr = CryptoJS.AES.encrypt(res, key, {
  //     iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7
  //   })
  //   var sendData = 'Content=' + encodeURIComponent(encryptStr)
  // }
  // config.data = sendData
  return config
})

// 响应拦截
axios.interceptors.response.use(response => {
  NProgress.done()
  if (response.data.code === 401) {
    window.localStorage.removeItem('loginInfo')
    router.replace({
      path: '/Login'
    })
  // }else {
  //   let value = response.data.data
  //   const res = CryptoJS.AES.decrypt(value, key, {
  //     iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7
  //   })
  //   response.data.data = CryptoJS.enc.Utf8.stringify(res).toString()
  //   response.data.data = response.data.data? JSON.parse(response.data.data) : JSON.parse("{}")
  }
  return response
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')