<template>
	<view class="checkLogin">
		<view class="checkTitle">欢迎访问万嘉集运</view>
		<view class="iconfont" :class="showIcon"></view>
		<view class="checkLogin-title">{{showTitle}}</view>
		<view class="checkLogin-title" v-if="showText">未通过原因：{{showText}}</view>
		<view class="checkLogin-tips">提示：管理员通知审核通过后，再次扫描小程序二维码即可正常登录使用系统</view>
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
			this.regObj = options.regInfo? JSON.parse(options.regInfo) : ''
			if(this.isCode == 401) {
				this.showTitle = '您的账号正在审核中，如有疑问请联系管理员'
				this.showIcon = 'icon-help'
				this.isButton = false
			}else if(this.isCode == 402) {
				this.showTitle = '您的账号未通过审核，如有疑问请联系管理员'
				this.showText  = this.regObj.F_UserAuthReason
				this.showIcon = 'icon-reeor'
				this.isButton = true
			}else {
				this.showTitle = '您的账号当前被禁止进行操作，如有疑问请联系管理员'
				this.showIcon = 'icon-prompt'
				this.isButton = false
			}
		},
		
		onShow() {
			wx.hideHomeButton()
		},
		
		methods: {
			goToRegister() {
				uni.navigateTo({
					url: '/pages/register/register?regInfo=' + JSON.stringify(this.regObj) + '&pcode=' + this.senceCode
				})
			}
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