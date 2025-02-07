<template>
	<view class="login">
		<view class="login-box">
			<view class="login-logo">
				<image src="@/static/images/wanjia.png" mode="widthFix"></image>
				<view class="login-text">Welcome To World Jaguar</view>
			</view>
		
			<view class="login-form">
				<view class="form-item">
					<text class="form-name">
						<text class="iconfont icon-email"></text>{{$t('login.email')}}<text class="form-required">*</text>
					</text>
					<input type="text" :placeholder="$t('login.emailtips')" v-model="loginForm.email">
				</view>
				<view class="form-item">
					<text class="form-name">
						<text class="iconfont icon-password"></text>{{$t('login.password')}}<text class="form-required">*</text>
					</text>
					<input type="password" :placeholder="$t('login.passwordtips')" v-model="loginForm.password">
				</view>
				<view class="form-forget">
					<text class="forget-btn" @click="showResetPassword">Forgot?</text>
					<uni-popup ref="reset" type="center">
						<view class="login-reset">
							<text class="reset-title">Reset Password</text>
							<view class="login-form" style="margin-top: 24rpx;">
								<!-- 邮箱 -->
								<view class="form-item">
									<text class="form-name">
										<text class="iconfont icon-email"></text>{{$t('login.email')}}<text class="form-required">*</text>
									</text>
									<input type="text" :placeholder="$t('login.emailtips')" v-model="resetPasswordForm.email">
								</view>
								<!-- 邮箱验证码 -->
								<view class="form-item">
									<text class="form-name">
										<text class="iconfont icon-image-text"></text>Email Code<text class="form-required">*</text>
									</text>
									<div class="form-email">
										<input
										 style="width: 45%;"
											type="text" 
											placeholder="Email Code" 
											v-model="resetPasswordForm.mailCode">
										<button
											style="height: 76rpx; line-height: 76rpx;"
											class="form-mobile"
											:class="mailDisabled? 'disableBtn' : ''"
											type="primary" 
											size="mini"
											:disabled="mailDisabled"
											@click="getMailCodeData">
											{{mailText}}
										</button>
									</div>
								</view>
								<!-- 修改密码 -->
								<view class="form-item">
									<text class="form-name">
										<text class="iconfont icon-password"></text>Password<text class="form-required">*</text>
									</text>
									<input type="password" placeholder="Enter your password" v-model="resetPasswordForm.password">
								</view>
								<text style="display: block; font-size: 12px; color: #c20017; margin: -24rpx 0 24rpx 0">
									The password must be 6-12 characters long and include any two of the following: letters, numbers, or symbols.
								</text>
								<!-- 确认密码 -->
								<view class="form-item">
									<text class="form-name">
										<text class="iconfont icon-success"></text>
											Confirm Password
										<text class="form-required">*</text>
									</text>
									<input 
										type="password" 
										placeholder="Confirm Password" 
										v-model="resetPasswordForm.confirmPassword"
									>
								</view>
								<!-- 按钮 -->
								<view class="form-btn">
									<button type="primary" class="login-confirm" @click="getResetPassword">Confirm</button>
									<button class="login-cancel" style="color: #555;" @click="closeResetWindow">Cancel</button>
								</view>
							</view>
						</view>
					</uni-popup>
				</view>
			</view>
			
			<view class="form-btn">
				<button type="primary" class="login-confirm" @click="confirmLogin">{{$t('login.confirm')}}</button>
				<button type="primary" class="login-register" @click="goToRegister">{{$t('login.register')}}</button>
			</view>
		</view>
		<view 
			style="font-size: 26rpx; color: #555; padding: 0 36rpx 36rpx; text-decoration: none"
			@click="goToCertificate"
		>
				Copyright©2022-2023 鲁ICP备11007633号-2
		</view>
	</view>
</template>

<script>
	let timer = null
	// 邮箱正则表达
	const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
	// 密码正则
	const regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/
	
	export default {
		data() {
			return {
				loginForm: {
					email: '',
					password: ''
				},
				resetPasswordForm: {
					email: '',
					mailCode: '',
					password: '',
					confirmPassword: ''
				},
				mailText: 'Send verification code',
				mailTime: 30,
				mailDisabled: false
			}
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('login.title')
			})
		},
		
		watch: {
			mailTime() {
				if(this.mailTime <= 0) {
					this.mailDisabled = false
					this.mailText = ' Send verification code '
					this.mailTime = 30
					clearInterval(timer)
				}
			}
		},
		
		methods: {
			async confirmLogin() {
				const {email, password} = this.loginForm
				if(email.trim() === '' || !regEmail.test(email)) {
					uni.$showMsg('Enter your email')
				}else if (password.trim() === '') {
					uni.$showMsg('Enter your password')
				}else {
					const {data: res} = await uni.$http.post('login/index', {
						F_Email: this.loginForm.email,
						F_Password: this.loginForm.password
					})
					if(res.code == 200) {
						uni.setStorageSync('loginInfo', res.data)
						uni.$showMsg(this.$t('login.success'))
						setTimeout(()=> {
							uni.switchTab({
								url: '/pages/home/home'
							})
						}, 500)
					}else if(res.code == 0) {
						uni.$showMsg(res.info)
					}else {
						uni.navigateTo({
							url: '/pages/checklogin/checklogin?info=' + res.info
						})
					}
				}
			},
			
			goToCertificate() {
				window.open('https://beian.miit.gov.cn/#/home')
			},
			
			goToRegister() {
				uni.navigateTo({
					url: '/pages/register/register'
				})
			},
			
			// 修改密码弹窗
			showResetPassword() {
				this.$refs.reset.open('center')
			},
			
			closeResetWindow() {
				this.$refs.reset.close()
				this.clearResetForm()
			},
			
			// 获取邮箱验证码
			async getMailCodeData() {
				if(this.resetPasswordForm.email.trim() !== '') {
					// 获取邮箱验证码
					const {data: res} = await uni.$http.post('login/sendsmsmail', {
						F_Email: this.resetPasswordForm.email,
						CodeType: 2
					})
					try {
						if(res.code === 200) {
							timer = setInterval(() => {
								this.mailTime--
								this.mailText = this.mailTime + 'Resend'
							}, 1000)
							this.mailDisabled = true
							
							uni.$showMsg('Success！Please check your email')
						}else {
							uni.$showMsg(res.info)
						}
					}catch(error) {
						console.log(error)
					}
				}else {
					uni.$showMsg('Enter your email！')
				}
			},
			
			// 修改密码请求
			async getResetPassword() {
				const {email, mailCode, password, confirmPassword} = this.resetPasswordForm
				if(email.trim() === '' || !regEmail.test(email)) {
					uni.$showMsg('Enter the correct email')
				}else if (mailCode.trim() === '') {
					uni.$showMsg('Enter email code')
				}else if(password.trim() === '' || !regPassword.test(password)) {
					uni.$showMsg('Enter the correct password ')
				}else if(confirmPassword.trim() === '' || password !== confirmPassword) {
					uni.$showMsg('Password is incorrect or the new password is invalid')
				}else {
					const {data: res} = await uni.$http.post('Login/forgetpwd', {
						F_Email: email,
						F_Code: mailCode,
						F_Password: password,
						F_RePassword: confirmPassword
					})
					if(res.code === 200) {
						uni.$showMsg('Reset success!')
						this.$refs.reset.close()
					}else {
						uni.$showMsg(res.info)
					}
				}
			},
			// 清空表单
			clearResetForm() {
				// this.resetPasswordForm = Object.keys(this.resetPasswordForm).forEach(key => {this.resetPasswordForm[key] = ''})
				for(let key in this.resetPasswordForm) {
					this.resetPasswordForm[key] = ''
				}
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
				padding: 80rpx 0 0 0;

				image {
					width: 220rpx;
				}

				.login-text {
					margin-top: 30rpx;
					color: #000;
					font-size: 32rpx;
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
			
			.login-form {
				margin-top: 60rpx;
				
				.form-forget {
					display: flex;
					
					font-size: 26rpx;
					text-decoration: underline;
					.forget-btn {
						margin: -8rpx 0 0 auto;
						color: #00a4ff;
						text-decoration: underline;
					}
					.login-reset {
						width: 640rpx;
						height: 1050rpx;
						padding: 24rpx;
						background: #fff;
						border-radius: 10rpx;
						.reset-title {
							font-size: 32rpx;
							font-weight: 600;
							color: #000;
						}
					}
				}
				
				.form-item {
					// display: flex;
					// align-items: center;
					margin-bottom: 24rpx;
					
					.form-email {
						display: flex;
						align-items: center;
						
						.form-mobile {
							display: block;
							background: #00a4ff;
							font-size: 24rpx;
							white-space: nowrap;
							margin: 12rpx 0 0 auto;
						}
					}
					
					.form-name {
						margin-right: 30rpx;
						color: #000;
						font-weight: 500;
						color: #000;
						font-size: 28rpx;
						white-space: nowrap;
						
						.iconfont {
							color: #000; 
							font-size: 40rpx; 
							margin-top: 20rpx; 
							vertical-align: text-bottom;
						}
					
						.form-required {
							color: #ff233d;
						}
					}
					
					.disableBtn {
						background: rgba(0, 164, 255, 0.5);
					}
					
					input {
						margin-top: 12rpx;
						height: 80rpx;
						border: 1px solid #e8e8e8;
						font-size: 30rpx;
						box-sizing: border-box;
						padding-left: 24rpx;
					}
				}
			}

			.form-btn {
				margin-top: 52rpx;
				padding-bottom: 40rpx;
			
				button {
					margin-bottom: 30rpx;
					font-size: 30rpx;
				}
			
				.login-confirm {
					background: #00a4ff;
				}
							
				.login-cancel {
					width: 100%;
					// height: 90rpx;
					background: #eee;
					color: #9a9a9a;
					text-align: center;
					border-radius: 10rpx;
					// line-height: 90rpx;
					outline: none;
					border: 1px solid #e1e1e1;
				}
			}
		}
	}
</style>