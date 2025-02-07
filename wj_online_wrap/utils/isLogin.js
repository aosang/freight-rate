import {$http} from '@escook/request-miniprogram'
uni.$http = $http

const isLoginMethod = async () => {
	const {data: res} = await uni.$http.post('login/isLogin')
	// 返回码为200代表注册
	if (res.code === 200) {
		uni.setStorageSync('loginInfo', res.data)
		uni.navigateTo({
			url: '/pages/home/home'
		})
	} else if (res.code === 401) {
		uni.reLaunch({
			// 未登录/注册，跳转注册页面进行注册
			url: '/pages/login/login'
		})
	} else {
		uni.showToast({
			title: res.info,
			duration: 3000,
			icon: 'none',
			complete() {
				uni.redirectTo({
					url: '/pages/checklogin/checklogin'
				})
			}
		})
	}
}

module.exports = {
	isLoginMethod
}