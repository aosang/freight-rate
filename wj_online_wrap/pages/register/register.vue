<template>
	<view class="login">
		<view class="login-box">
			<view class="login-logo">
				<image src="@/static/images/wanjia.png" mode="widthFix"></image>
				<view class="login-text">World Jaguar</view>
			</view>
			<!-- <view class="login-info">
				<text class="info-title">即将登录企业网站，请确认是否本人操作</text>
				<view class="login-warn">
					<text>授权信息</text>
					<text class="warn-subtitle">请完善下方用户信息，便于我们为您提供更优质的服务！</text>
				</view>
			</view> -->
			<!-- 表单 -->
			<view class="login-form">
				<view class="form-item">
					<text class="form-name">
						<text class="iconfont icon-home"></text>Company Name<text class="form-required">*</text>
					</text>
					<input type="text" placeholder="Enter your company-name" v-model="loginForm.companyname">
				</view>
				<view class="form-item">
					<text class="form-name" style="margin-top: 4rpx;">
						<text class="iconfont icon-map"></text>Country/Region<text class="form-required">*</text>
					</text>
					<view 
						@click="showAreaData('showAreaRight')" 
						class="search-city"
					>
						<text :class="areaCountryId? 'textColor' : '' ">{{regCountryTextShow }}</text>
					</view>
					<uni-drawer :width="340" ref="showAreaRight">
						<input
							class="search-port" 
							v-model="regCountryText" 
							:placeholder="$t('pub.country')" 
							@input="getInputAreaCountry"  
						>
						<scroll-view scroll-y="true" style="height: 1100rpx">
							<view class="city-box">
								<view v-if="areaCountryData.length !== 0">
									<view 
										@click="selectAreaCountry(area.F_CountryEnglishName, area.F_Id)" 
										class="city-item" 
										v-for="area in areaCountryData" 
										:key="area.F_Id"
									>
										<text class="enName">{{area.F_CountryEnglishName}}</text>
										<!-- <text class="chName">{{area.F_CountryName}}</text> -->
									</view>
								</view>
								<!-- 没有数据 -->
								<view class="empty-city" v-else>
									<text class="iconfont icon-logistics-icon"></text>
									<text class="empty-text">Empty</text>
								</view>
							</view>
						</scroll-view>
					</uni-drawer>
				</view>
				<view class="form-item">
					<text class="form-name">
						<text class="iconfont icon-email"></text>Email<text class="form-required">*</text>
					</text>
					<input type="text" placeholder="Enter your email" v-model="loginForm.email">
				</view>
				<!-- 邮箱验证码 -->
				<view class="form-item">
					<text class="form-name">
						<text class="iconfont icon-image-text"></text>Email Code<text class="form-required">*</text>
					</text>
					<view class="form-email">
						<input 
							type="text" 
							placeholder="Email Code" 
							v-model="loginForm.mailCode"
							style="width: 42%;"
						/>
						<button
							class="form-mobile"
							:class="mailDisabled? 'disableBtn' : ''"
							style="height: 80rpx; line-height: 80rpx;"
							type="primary" 
							size="mini"
							:disabled="mailDisabled"
							@click="getMailCodeData">
							{{mailText}}
						</button>
					</view>
				</view>
				
				<view class="form-item">
					<text class="form-name">
						<text class="iconfont icon-password"></text>Password<text class="form-required">*</text>
					</text>
					<input type="password" placeholder="Enter your password" v-model="loginForm.password">
				</view>
				<text style="display: block; font-size: 12px; color: #c20017; margin: -8rpx 0 24rpx 0">
					The password must be 6-12 characters long and include any two of the following: letters, numbers, or symbols.
				</text>
				<view class="form-item">
					<text class="form-name">
						<text class="iconfont icon-success"></text>Confirm Password<text class="form-required">*</text>
					</text>
					<input type="password" placeholder="Confirm Password" v-model="loginForm.confirmPassword">
				</view>
				
				<view class="form-btn">
					<button type="primary" class="login-confirm" @click="validateForm">Confirm</button>
					<button type="primary" class="login-register" @click="goToLogin">Login here</button>
				</view>
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
	export default {
		data() {
			return {
				regCountryText: '',
				regCountryTextShow: 'Select Country/Region',
				areaCountryData: [],
				areaCountryId: '',
				pcode: '', //登录标识
				applicationLocal: '',
				companyImageInfo: '',
				companyImagePath: '',
				companyImageId: '',
				objInfo: '',
				mailText: 'Send verification code',
				mailTime: 30,
				mailDisabled: false,
				loginForm: {
					companyname: '', //公司名
					password: '', //密码
					confirmPassword: '', //确认密码
					email: '', //电子邮件
					mailCode: ''
				}
			}
		},

		onLoad(option) {
			// 判断初始语言
			this.applicationLocal = uni.getLocale()
			uni.onLocaleChange(e => {
				this.applicationLocal = e.locale
			})

			// this.pcode = option.pcode
			// this.objInfo = option.regInfo? JSON.parse(option.regInfo) : ''
			
			// if(this.objInfo) {
			// 	this.loginForm.nickname = this.objInfo.F_NameCn
			// 	this.loginForm.companyname = this.objInfo.F_CompanyName
			// 	this.loginForm.mobilePhone = this.objInfo.F_Mobile
			// 	this.loginForm.email = this.objInfo.F_Email
			// }
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('navigate.world')
			})
			// uni.hideHomeButton()
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
			// 获取国家
			async getPodCountryData() {
				const {data: res} = await uni.$http.post('data/getCountry', {
					SearchText: this.regCountryText
				})
				this.areaCountryData = res.data
			},
			
			getInputAreaCountry() {
				this.getPodCountryData()
			},
			
			selectAreaCountry(name, id) {
				this.regCountryTextShow = name
				this.$refs.showAreaRight.close()
				this.regCountryText = ''
				this.areaCountryId = id
			},
			
			showAreaData(e) {
				this.$refs[e].open()
				this.getPodCountryData()
			},
			
			async getMailCodeData() {
				if(this.loginForm.email.trim() !== '') {
					// 获取邮箱验证码
					const {data: res} = await uni.$http.post('login/sendsmsmail', {
						F_Email: this.loginForm.email,
						CodeType: 1
					})
					try {
						if(res.code === 200) {
							timer = setInterval(() => {
								this.mailTime--
								this.mailText = this.mailTime + 'Resend'
							}, 1000)
							this.mailDisabled = true
							
							uni.$showMsg('Success！')
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
			
			goToCertificate() {
				window.open('https://beian.miit.gov.cn/#/home')
			},
			
			goToLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			
			async validateForm() {
				const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
				const {companyname,password,confirmPassword,email,mailCode} = this.loginForm
				if(companyname.trim() === '') {
					uni.$showMsg('Enter your company name')
				}else if(this.areaCountryId === '') {
					uni.$showMsg('Select your Country/Region')
				} else if(email.trim() === '' || !regEmail.test(email)) {
					uni.$showMsg('Enter your email')
				}else if(mailCode.trim() === '') {
					uni.$showMsg('Enter your email code')
				}else {
					const {data: res} = await uni.$http.post('login/register', {
						F_Email: this.loginForm.email,
						F_Code: this.loginForm.mailCode,
						F_Password: this.loginForm.password,
						F_RePassword: this.loginForm.confirmPassword,
						F_CompanyName: this.loginForm.companyname,
						F_CountryId: this.areaCountryId
					})
					if(res.code === 200) {
						uni.$showMsg('Register success!')
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}else {
						uni.$showMsg(res.info)
					}
				}
			},

			cancelBtn() {
				uni.navigateBackMiniProgram({
					success: () => {
						console.log('关闭应用成功')
					},
					fail: () => {
						console.log('关闭应用失败')
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
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

			.login-form {
				margin-top: 30rpx;

				.form-item {
					display: block;
					margin-bottom: 24rpx;
					// display: flex;
					// align-items: center;
					
					.search-port {
						width: 100%;
						height: 88rpx;
						border-bottom: 1px solid rgba(64, 158, 255, 0.2);
						background: #f4f4f4;
						box-sizing: border-box;
						padding-left: 28rpx;
						font-size: 28rpx;
					}
					
					.search-city {
						width: 100%;
						height: 80rpx;
						margin-top: 10rpx;
						line-height: 72rpx;
						color: #777;
						border: 1px solid #e8e8e8;
						font-size: 30rpx;
						padding: 0 0 0 24rpx;
						box-sizing: border-box;
					}
					
					.textColor {
						color: #000;
					}
					
					.city-box {
						background: #fff;
						
						.city-item {
							display: flex;
							align-items: center;
							padding: 28rpx;
							font-size: 28rpx;
							color: #555;
							border-bottom: 1px solid #eee;
							
							.enName {
								display: block;
							}
							
							.chName {
								display: block;
								width: 240rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								margin-left: 16rpx;
							}
						}
						
						.empty-city {
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							margin-top: 440rpx;
							.iconfont {
								color: #ccc;
								font-size: 80rpx;
								font-weight: 200;
							}
							.empty-text {
								font-size: 28rpx;
								font-weight: 200;
								color: #ccc;
							}
						}
					}
					
					.form-email {
						display: flex;
						align-items: center;
						
						.form-mobile {
							display: block;
							background: #00a4ff;
							font-size: 24rpx;
							white-space: nowrap;
							margin: 0 0 0 auto;
						}
					}
					
					.iconfont {
						font-size: 40rpx;
						color: #000;
						vertical-align: text-bottom;
					}
					
					.form-image {
						display: flex;
						align-items: center;
						justify-content: center;
						position: relative;
						width: 124rpx;
						height: 124rpx;
						border: 1px solid #e3e3e3;
						z-index: 0;

						image {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
						}

						// .iconfont {
						// 	font-size: 56rpx;
						// 	flex-direction: column;
						// 	color: #e3e3e3;
						// }
						
						.form-image-delete {
							position: absolute;
							right: -16rpx;
							top: -16rpx;
							width: 32rpx;
							height: 32rpx;
							border-radius: 100%;
							background: #00a4ff;
							z-index: 1;
							
							.icon-close {
								display: block;
								text-align: center;
								font-size: 24rpx;
								color: #fff;
								line-height: 32rpx;
							}
						}
					}

					.form-name {
						display: block;
						margin-bottom: 10rpx;
						margin-right: 30rpx;
						color: #000;
						font-weight: 500;
						font-size: 28rpx;
						white-space: nowrap;

						.form-required {
							color: #ff233d;
						}
					}
					
					.disableBtn {
						background: rgba(0, 164, 255, 0.5);
					}

					input {
						height: 80rpx;
						border: 1px solid #e8e8e8;
						font-size: 30rpx;
						padding-left: 24rpx;
					}
				}

				.form-btn {
					margin-top: 40rpx;
					padding-bottom: 40rpx;

					button {
						margin-bottom: 30rpx;
						font-size: 30rpx;
					}

					.login-confirm {
						background: #00a4ff;
					}

					.exit-btn {
						width: 100%;
						height: 80rpx;
						background: #dcdfe6;
						color: #555;
						font-size: 30rpx;
						text-align: center;
						line-height: 80rpx;
						border-radius: 10rpx;
					}
				}
			}
		}
	}
</style>