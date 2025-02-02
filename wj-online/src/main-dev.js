import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUi)

// element ui按需引入
// import {
//   Dropdown,
//   DropdownMenu,
//   DropdownItem,
//   Button,
//   Icon,
//   Input,
//   DatePicker,
//   Notification,
//   Avatar,
//   Select,
//   Option,
//   Container,
//   Main,
//   Header,
//   Aside,
//   Menu,
//   Submenu,
//   MenuItem,
//   Card,
//   Table,
//   TableColumn,
//   Pagination,
//   Dialog,
//   Tabs,
//   TabPane,
//   Autocomplete,
//   Form,
//   FormItem,
//   Collapse,
//   CollapseItem,
//   Tag,
//   Message,
//   MessageBox,
//   Row,
//   Col,
//   Alert,
//   Carousel,
//   CarouselItem,
//   Popover,
//   Loading,
//   Backtop,
// } from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

// Vue.use(Dropdown)
// Vue.use(DropdownMenu)
// Vue.use(Button)
// Vue.use(DropdownItem)
// Vue.use(Icon)
// Vue.use(Input)
// Vue.use(DatePicker)
// Vue.use(Avatar)
// Vue.use(Select)
// Vue.use(Option)
// Vue.use(Container)
// Vue.use(Main)
// Vue.use(Header)
// Vue.use(Aside)
// Vue.use(Menu)
// Vue.use(Submenu)
// Vue.use(MenuItem)
// Vue.use(Card)
// Vue.use(Table)
// Vue.use(TableColumn)
// Vue.use(Pagination)
// Vue.use(Dialog)
// Vue.use(Tabs)
// Vue.use(TabPane)
// Vue.use(Autocomplete)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Collapse)
// Vue.use(CollapseItem)
// Vue.use(Tag)
// Vue.use(Row)
// Vue.use(Col)
// Vue.use(Alert)
// Vue.use(Carousel)
// Vue.use(CarouselItem)
// Vue.use(Popover)
// Vue.use(Loading)
// Vue.use(Backtop)

// Vue.prototype.$notify = Notification
// Vue.prototype.$messageBox = MessageBox
// Vue.prototype.$message = Message
Vue.config.productionTip = false

// axios配置
import axios from 'axios'
Vue.prototype.$http = axios

// 数据加密
import CryptoJS from 'crypto-js'


// 导入progress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


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
  if(token !== null) {
    config.headers.Authorization = `${token.F_Token}`
  }
  // 判断config.data是否存在
  // let arr = config.data? Object.keys(config.data) : ''
  // let len = arr.length
  // if(len > 0) {
  //   let ret = ''
  //   for(let it in config.data) {
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

axios.interceptors.response.use(response => {
  NProgress.done()
  if(response.data.code == 401) {
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
  //   response.data.data = JSON.parse(response.data.data)
  }
  return response
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')