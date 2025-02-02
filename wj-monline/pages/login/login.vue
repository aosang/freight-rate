<template>
	<view class="login">
		<view class="login-box">
			<view class="login-logo">
				<image src="@/static/images/wanjia.png" mode="widthFix"></image>
				<view class="login-text">{{$t('login.title')}}</view>
			</view>
			<view class="login-info">
				<text class="info-title">{{$t('login.text')}}</text>
				<text class="info-subtitle">{{$t('login.describe')}}</text>
			</view>
			<view class="form-btn">
				<button type="primary" class="login-confirm" @click="confirmLogin">{{$t('login.confirm')}}</button>
				<!-- <button type="primary" class="login-register" @click="goToRegister">还没有账号？去注册</button> -->
				<navigator class="login-cancel" open-type="exit" target="miniProgram">{{$t('login.cancel')}}</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			 pcode: '',
			 userInfo: ''
			}
		},
		
		onLoad(option) {
			this.pcode = option.pcode
		},
		
		methods: {
			confirmLogin() {				
				uni.login({
					provider: 'weixin',
					success: async (result) => {
						const {data: res} = await uni.$http.post('wxapp/login', {
							Code: result.code,
							Pccode: this.pcode
						})
						if(res.code == 200) {
							uni.setStorageSync('loginInfo', res.data)
							uni.$showMsg(this.$t('login.success'))
							setTimeout(()=> {
								uni.switchTab({
									url: '/pages/home/home'
								})
							}, 500)
						}else if(res.code == 401) {
							uni.navigateTo({
								url: '/pages/checklogin/checklogin'
							})
						}else {
							uni.$showMsg(res.info)
						}
					}
				})
			},
			
			goToRegister() {
				uni.navigateTo({
					url: '/pages/register/register'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.login {
		width: 100%;
		background: #fff;

		.login-box {
			width: 100%;
			padding: 0 40rpx;
			box-sizing: border-box;
			overflow: hidden;

			.login-logo {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 40rpx 0;
				border-bottom: 1px solid #eee;

				image {
					width: 120rpx;
				}

				.login-text {
					margin-top: 30rpx;
					color: #000;
					font-size: 28rpx;
					font-weight: 600;
				}
			}

			.login-info {
				margin-top: 40rpx;
				padding-bottom: 40rpx;
				border-bottom: 1px solid #eee;

				.info-title {
					display: block;
					font-size: 28rpx;
					font-weight: 600;
				}

				.info-subtitle {
					margin-top: 20rpx;
					color: #5f6478;
					font-size: 28rpx;
				}

				.login-warn {
					width: 100%;
					margin-top: 30rpx;
					background: #ffe4ca;
					padding: 24rpx;
					border-radius: 12rpx;
					box-sizing: border-box;

					text {
						display: block;
						color: #fd8d20;
						font-weight: 550;
						font-size: 28rpx;
					}

					.warn-subtitle {
						font-size: 28rpx;
						font-weight: 500;
					}
				}
			}

			.form-btn {
				margin-top: 40rpx;
				padding-bottom: 40rpx;
			
				button {
					margin-bottom: 30rpx;
					font-size: 32rpx;
				}
			
				.login-confirm {
					background: #00a4ff;
				}
							
				.login-cancel {
					width: 100%;
					height: 90rpx;
					background: #eee;
					color: #9a9a9a;
					text-align: center;
					border-radius: 10rpx;
					line-height: 90rpx;
				}
			}
		}
	}
</style>