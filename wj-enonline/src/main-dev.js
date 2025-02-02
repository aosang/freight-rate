import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, {locale})

// // element ui按需引入
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
//   Row,
//   Col,
//   Alert,
//   Carousel,
//   CarouselItem,
//   Popover,
//   MessageBox,
//   Loading,
//   Backtop,
// } from 'element-ui'

// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'
// Vue.use(ElementUI, {locale})

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
import cryptoJs from 'crypto-js'
Vue.use(cryptoJs)

// 导入progress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 公共接口
// axios.defaults.baseURL = 'http://192.168.77.250:81/apis/'
axios.defaults.baseURL = 'https://www.pandalogqd.com/apis/'
// axios.defaults.baseURL = 'https://wxa.worldjaguar.com/apis/'

// 请求超时
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['ApiType'] = '1'
axios.defaults.headers.post['Lang'] = 'en-us'
axios.defaults.headers.post['RegCom'] = '2'

// 请求拦截器
axios.interceptors.request.use(config => {
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