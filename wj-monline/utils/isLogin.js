import {$http} from '@escook/request-miniprogram'
uni.$http = $http

const isLoginMethod = async (scene, code) => {
	const {data: res} = await uni.$http.post('wxapp/login', {
		Code: code,
		Pccode: scene? scene : ''
	})
	// 返回码为200代表注册
	if (res.code === 200) {
		uni.setStorageSync('loginInfo', res.data)
		uni.navigateTo({
			url: '/pages/home/home'
		})
	} else if (res.code === 400) {
		uni.reLaunch({
			// 未注册，跳转注册页面进行注册
			url: '/pages/register/register?pcode=' + scene
		})
	} else if (res.code === 401) {
		// 待审核
		uni.reLaunch({
			url: '/pages/checklogin/checklogin?code=' + res.code
		})
	} else if (res.code === 402) {
		// 审核拒绝
		uni.reLaunch({
			url: '/pages/checklogin/checklogin?pcode=' + scene + '&code=' + res.code + '&regInfo=' + JSON.stringify(res.data)
		})
	} else if (res.code === 403) {
		// 黑名单
		uni.reLaunch({
			url: '/pages/checklogin/checklogin?code=' + scene
		})
	} else {
		uni.showToast({
			title: '访问错误',
			duration: 1500,
			icon: 'none'
		})
	}
}

module.exports = {
	isLoginMethod
}