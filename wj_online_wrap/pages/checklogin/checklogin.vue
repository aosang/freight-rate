<template>
	<view class="checkLogin">
		<view class="checkTitle">Welcome to visit worldjaguar</view>
		<view class="iconfont" :class="showIcon"></view>
		<view class="checkLogin-title">{{showTitle}}</view>
		<!-- <view class="checkLogin-title" v-if="showText">未通过原因：{{showText}}</view> -->
		<!-- <view class="checkLogin-tips">提示：管理员通知审核通过后，再次扫描小程序二维码即可正常登录使用系统</view> -->
		<button
			v-if="isButton"
			class="checkLogin-home" 
			type="primary"
			@click="goToRegister">
				再次提交注册
		</button>
	</view>
</template>

<script>
	// import { isLoginMethod } from '@/utils/isLogin.js'
	export default {
		data() {
			return {
				isCode: '',
				senceCode: '',
				regObj: '',
				showTitle: '',
				showText: '',
				showIcon: '',
				isButton: false,
			}
		},
		
		onLoad(options) {
			this.isCode = options.code
			this.senceCode = options.pcode
			if(this.isCode == 401) {
				this.showTitle = 'The account is abnormal. Please contact the administrator.'
				this.showIcon = 'icon-help'
				this.isButton = false
			}else if(this.isCode == 402) {
				this.showTitle = 'The account is abnormal. Please contact the administrator.'
				this.showText  = this.regObj.F_UserAuthReason
				this.showIcon = 'icon-reeor'
				this.isButton = false
			}else {
				this.showTitle = 'The account is abnormal. Please contact the administrator.'
				this.showIcon = 'icon-prompt'
				this.isButton = false
			}
		},
		
		onShow() {
			
		},
		
		methods: {
			// goToRegister() {
			// 	uni.navigateTo({
			// 		url: '/pages/register/register?regInfo=' + JSON.stringify(this.regObj) + '&pcode=' + this.senceCode
			// 	})
			// }
		}
	}
</script>

<style lang="less" scoped>
.checkLogin {
	width: 100%;
	background: #fff;
	overflow: hidden;
	padding: 0 0 30rpx 0;
	
	.checkTitle {
		margin: 50rpx 0 30rpx 0;
		font-size: 40rpx;
		font-weight: 600;
		color: #0a3190;
		text-align: center;
	}
	
	.iconfont {
		padding: 10rpx 0;
		color: #F56C6C;
		font-size: 100rpx;
		text-align: center;
	}
	
	.checkLogin-title {
		font-size: 28rpx;
		line-height: 48rpx;
		text-align: center;
	}
	
	.checkLogin-subtitle {
		font-size: 24rpx;
		margin-top: 10rpx;
		color: #909399;
	}
	
	.checkLogin-home {
		width: 460rpx;
		height: 72rpx;
		line-height: 72rpx;
		margin-top: 40rpx;
		font-size: 28rpx;
		background: #409EFF;
	}
	
	.checkLogin-tips {
		font-size: 24rpx;
		color: #F56C6C;
		padding: 20rpx;
		box-sizing: border-box;
	}
}
</style>