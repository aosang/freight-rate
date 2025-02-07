import App from './App'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './locale/index.js'

Vue.use(VueI18n)
const i18n = new VueI18n({
	locale: uni.getLocale(),
	messages
})

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App,
	i18n
})
app.$mount()


// 配置网络请求
import {$http} from '@escook/request-miniprogram'
uni.$http = $http


// $http.baseUrl = 'http://192.168.77.250:81/apis/'
// $http.baseUrl = 'https://www.pandalogqd.com/apis/'
$http.baseUrl = 'https://wxa.worldjaguar.com/apis/'


// 请求拦截器
$http.beforeRequest = (options) => {
	options.header = {
		'Content-Type': 'application/json; charset=utf-8',
		'Lang': 'en-us',
		'ApiType': '4',
		'RegCom': '2'
	}
	uni.showLoading({
		title: 'Loading...'
	})
  let token = ''
	uni.getStorageSync('loginInfo')? token = uni.getStorageSync('loginInfo') : token = ''
	if(token) {
		options.header.Authorization = `${token.F_Token}`
	}
}

//响应拦截器
$http.afterRequest = () => {
	uni.hideLoading()
}

// 封装提示消息
uni.$showMsg = (title='Loading Fail', duration = 1500) => {
	uni.showToast({
		duration,
		title,
		icon: 'none'
	})
} 
