<template>
	<view class="login">
		<!-- #ifdef MP-WEIXIN -->
		<ws-wx-privacy 
			id="privacy-popup"
			title="万嘉用户隐私保护提示"  
			desc="感谢您使用万嘉线上系统，您使用本应用的服务之前请仔细阅读并同意"  
			protocol="《万嘉用户隐私保护指引》"  
			subDesc="当您点击同意并开始使用产品服务时，即表示你已理解并同意该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法使用相应服务。"
			@disagree="onDisagreed"
			@agree="onAgree"
		>
		</ws-wx-privacy>
		<!-- #endif -->
		<view class="login-box">
			<view class="login-logo">
				<image src="@/static/images/wanjia.png" mode="widthFix"></image>
				<view class="login-text">万嘉集运</view>
			</view>
			<view class="login-info">
				<text class="info-title">即将登录企业网站，请确认是否本人操作</text>
				<text class="info-subtitle">使用你的微信账号信息（昵称、头像、性别、手机号）登录网站</text>
				<view class="login-warn">
					<text>授权信息</text>
					<text class="warn-subtitle">请完善下方用户信息，便于我们为您提供更优质的服务！</text>
				</view>
			</view>
			<!-- 表单 -->
			<view class="login-form">
				<view class="form-item">
					<text class="form-name">用户昵称<text class="form-required" style="margin: 0 0 0 8rpx">*</text></text>
					<input type="text" placeholder="请输入用户昵称" v-model="loginForm.nickname">
				</view>
				<view class="form-item">
					<text class="form-name">公司名称<text class="form-required" style="margin: 0 0 0 8rpx">*</text></text>
					<input type="text" placeholder="请输入公司名" v-model="loginForm.companyname">
				</view>
				
				<view class="form-item">
					<text class="form-name" style="margin-top: 4rpx;">国家/地区<text class="form-required">*</text></text>
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
										@click="selectAreaCountry(area.F_CountryName, area.F_Id)" 
										class="city-item" 
										v-for="area in areaCountryData" 
										:key="area.F_Id"
									>
										<text class="enName">{{area.F_CountryEnglishName}}</text>
										<text class="chName">{{area.F_CountryName}}</text>
									</view>
								</view>
								<!-- 没有数据 -->
								<view class="empty-city" v-else>
									<text class="iconfont icon-logistics-icon"></text>
									<text class="empty-text">暂无数据</text>
								</view>
							</view>
						</scroll-view>
					</uni-drawer>
				</view>
				
				<!-- 邮箱验证码 -->
				<!-- <view class="form-item">
					<text class="form-name">邮箱验证<text class="form-required" style="margin: 0 0 0 8rpx">*</text></text>
					<input type="text" placeholder="邮箱验证码" v-model="loginForm.mailCode">
					<button
						class="form-mobile"
						:class="mailDisabled? 'disableBtn' : ''"
						type="primary" 
						size="mini"
						:disabled="mailDisabled"
						@click="getMailCodeData">
						{{mailText}}
					</button>
				</view> -->
				
				<!-- <view class="form-item">
					<text class="form-name">登录密码<text class="form-required">*</text></text>
					<input type="password" placeholder="请设置登录密码" v-model="loginForm.password">
				</view>
				<text style="display: block; font-size: 12px; color: #c20017; margin: 8rpx 0; 16rpx 0">
					密码6-12位，必须包含字母、数字、符号的任意两种
				</text>
				<view class="form-item">
					<text class="form-name">确认密码<text class="form-required">*</text></text>
					<input type="password" placeholder="确认密码" v-model="loginForm.confirmPassword">
				</view> -->
				
				<view class="form-item">
					<text class="form-name">手机号码<text class="form-required" style="margin: 0 0 0 8rpx">*</text></text>
					<input
					  disabled
						type="number" 
						placeholder="点击获取手机号" 
						v-model="loginForm.mobilePhone"
					>
					<button
						class="form-mobile" 
						type="primary" 
						size="mini" 
						@getphonenumber="wxGetPhoneNumber"
						open-type="getPhoneNumber">
						获取手机号
					</button>
					
					<button
						style="position: absolute; width: 120px; top: 20%; left: 25%; z-index: 999; opacity: 0;"
						class="form-mobile" 
						type="primary" 
						size="mini" 
						@getphonenumber="wxGetPhoneNumber"
						open-type="getPhoneNumber">
						获取手机号
					</button>
				</view>
				
				<view class="form-item">
					<text class="form-name">电子邮件<text class="form-required" style="margin: 0 0 0 8rpx; color: transparent;">*</text></text>
					<input type="text" placeholder="请填写电子邮件" v-model="loginForm.email">
				</view>
				
				<view class="form-item" style="margin-top: 24rpx;">
					<text class="form-name">营业执照</text>
					<view class="form-image" @click="chooseImageForm">
						<view class="iconfont icon-add-select"></view>
						<image v-if="companyImagePath" :src="companyImagePath"></image>
						<!-- 删除上传图片 -->
						<view v-if="companyImagePath" class="form-image-delete" @click.stop="deleteUploadFile">
							<text class="iconfont icon-close"></text>
						</view>
					</view>
					<view class="form-name" style="color: #c0c0c0; margin-left: 20rpx;">格式为jpg或png<br>图片需小于5MB</view>
				</view>
				<view class="form-btn">
					<button type="primary" class="login-confirm" @click="validateForm">确认登录</button>
					<navigator class="exit-btn" open-type="exit" target="miniProgram">取消</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let timer = null
	export default {
		data() {
			return {
				regCountryText: '',
				regCountryTextShow: '请选择国家/地区',
				areaCountryData: [],
				areaCountryId: '',
				pcode: '', //登录标识
				applicationLocal: '',
				companyImageInfo: '',
				companyImagePath: '',
				companyImageId: '',
				objInfo: '',
				mailText: '获取验证码',
				mailTime: 30,
				mailDisabled: false,
				loginForm: {
					nickname: '', //昵称
					companyname: '', //公司名
					password: '', //密码
					confirmPassword: '', //确认密码
					mobilePhone: '', //手机号
					email: '', //电子邮件
					mailCode: '',
					areaName: '',
				}
			}
		},

		onLoad(option) {
			// 判断初始语言
			// this.applicationLocal = uni.getLocale()
			// uni.onLocaleChange(e => {
			// 	this.applicationLocal = e.locale
			// })

			this.pcode = option.pcode
			this.objInfo = option.regInfo? JSON.parse(option.regInfo) : ''
			
			if(this.objInfo) {
				this.loginForm.nickname = this.objInfo.F_NameCn
				this.loginForm.companyname = this.objInfo.F_CompanyName
				this.loginForm.mobilePhone = this.objInfo.F_Mobile
				this.loginForm.email = this.objInfo.F_Email
				this.companyImagePath = this.objInfo.F_FilePath
				this.companyImageId = this.objInfo.F_BLAnnexesId
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('navigate.world')
			})
			uni.hideHomeButton()
			this.doRequire()
		},
		
		watch: {
			mailTime() {
				if(this.mailTime <= 0) {
					this.mailDisabled = false
					this.mailText = '获取验证码'
					this.mailTime = 30
					clearInterval(timer)
				}
			}
		},

		methods: {
			onDisagreed() {
				uni.showToast({
					title: '授权失败，无法使用此应用！',
					icon: 'none',
					duration: 1500
				})
			},
			
			onAgree() {
				uni.showToast({
					title: '授权成功，请按提示完成注册信息！',
					icon: 'none',
					duration: 1500
				})
			},
			
			doRequire() {
				uni.getPrivacySetting({
					success: (res)=> {
						if(res.needAuthorization) {
							uni.requirePrivacyAuthorize({
								success: (res) => {
									// 授权成功
									this.onAgree()
								},
								fail: () => {
									// 用户拒绝授权
									this.onDisagreed()
								},
								complete: () => {}
							})
						}else {
							return
						}
					},
					fail: () => {
						uni.showToast({
							title: '系统异常！',
							icon: 'error',
							duration: 2000
						})
					}
				})
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
								this.mailText = this.mailTime + '后重新获取'
							}, 1000)
							this.mailDisabled = true
							
							uni.$showMsg('获取验证码成功！')
						}else {
							uni.$showMsg(res.info)
						}
					}catch(error) {
						console.log(error)
					}
				}else {
					uni.$showMsg('邮件地址不能为空！')
				}
			},
			
			validateForm() {
				const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
				const {nickname,companyname,password,confirmPassword,mobilePhone,email,mailCode,areaName} = this.loginForm
				if (nickname.trim() === '') {
					uni.$showMsg('请填写用户昵称')
				}else if(companyname.trim() === '') {
					uni.$showMsg('请填写公司名称')
				}else if(this.areaCountryId === '') {
					uni.$showMsg('请选择国家/地区')
				} else if(mobilePhone.trim() === '') {
					uni.$showMsg('请填写手机号')
				}else {
					//校验通过
					uni.getUserProfile({
						desc: '展示用户信息',
						success: (res) => {
							uni.login({
								provider: 'weixin',
								success: async result => {
									const {data: res} = await uni.$http.post('wxapp/register', {
										Code: result.code,
										F_NameCn: this.loginForm.nickname,
										F_Mobile: this.loginForm.mobilePhone,
										F_CompanyName: this.loginForm.companyname,
										// F_Password: this.loginForm.password,
										// F_RePassword: this.loginForm.confirmPassword,
										F_Email: this.loginForm.email,
										F_BLAnnexesId: this.companyImageId,
										Email_Code: this.loginForm.mailCode,
										Pccode: this.pcode,
										F_CountryId: this.areaCountryId
									})
									if (res.code == 0) {
										uni.$showMsg(res.info)
									}else if(res.code == 401) {
										setTimeout(() => {
											uni.reLaunch({
												url: '/pages/checklogin/checklogin?code=' + res.code
											})
										}, 100)
									}else if(res.code == 402) {
										setTimeout(() => {
											uni.reLaunch({
												url: '/pages/checklogin/checklogin?code=' + res.code
											})
										}, 100)
									}else if(res.code == 403) {
										setTimeout(() => {
											uni.reLaunch({
												url: '/pages/checklogin/checklogin?code=' + res.code
											})
										}, 100)
									} else {
										uni.setStorageSync('loginInfo', res.data)
										uni.$showMsg('登录成功')
										setTimeout(() => {
											uni.switchTab({
												url: '/pages/home/home'
											})
										}, 100)
									}
								}
							})
						}
					})
				}
			},

			async wxGetPhoneNumber(e) {
				if (e.detail.errMsg !== 'getPhoneNumber:ok') {
					return uni.$showMsg('取消授权')
				} else {
					const {data: res} = await uni.$http.post('wxapp/getphone', {
						Code: e.detail.code
					})
					if (res.code !== 200) return uni.$showMsg('获取手机号失败！')
					this.loginForm.mobilePhone = res.data.phone_info.purePhoneNumber
				}
			},

			// 上传营业执照
			chooseImageForm() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: res => {
						if(res.tempFiles[0].size > 5242880) {
							uni.showModal({
								title: '提示',
								content: '图片大小超过5MB，请重新上传',
								showCancel: false
							})
						}else {
							this.companyImage = res.tempFilePaths
							this.chooseUpLoadFile(this.companyImage)
						}
					}
				})
			},

			chooseUpLoadFile(path) {
				uni.uploadFile({
					url: 'https://wxa.worldjaguar.com/apis/Data/uploadFile',
					// url: 'https://www.pandalogqd.com/apis/Data/uploadFile',
					fileType: '.jpg,.png,',
					filePath: path[0],
					name: 'BusinessLice',
					header: {
						'ApiType': '2',
						'Lang': 'zh-cn',
					},
					success: (res) => {
						this.companyImageInfo = JSON.parse(res.data)
						if(this.companyImageInfo.code !== 200) return uni.$showMsg('上传失败!')
						this.companyImagePath = this.companyImageInfo.data.FileUrl
						this.companyImageId = this.companyImageInfo.data.FileId
						uni.showToast({
							title: '上传成功!',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			
			// 删除上传文件
			async deleteUploadFile() {
				const {data: res} = await uni.$http.post('Data/delFile', {
					FileId: this.companyImageId? this.companyImageId : ''
				})
				if(res.code !== 200) return uni.$showMsg('删除失败！')
				this.companyImagePath = ''
				this.companyImageId = ''
				uni.showToast({
					title: '删除成功!',
					icon: 'none',
					duration: 1500
				})
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
			},
			
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
					position: relative;
					display: flex;
					align-items: center;
					
					.search-port {
						position: relative;
						width: 100%;
						height: 88rpx;
						border-bottom: 1px solid rgba(64, 158, 255, 0.2);
						background: #f4f4f4;
						box-sizing: border-box;
						padding-left: 28rpx;
						font-size: 28rpx;
					}
					
					.search-city {
						width: 85%;
						height: 80rpx;
						margin-top: 10rpx;
						line-height: 72rpx;
						color: #777;
						border-bottom: 1px solid #eee;
						font-size: 30rpx;
						// padding: 0 0 0 24rpx;
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

						.iconfont {
							font-size: 48rpx;
							flex-direction: column;
							color: #e3e3e3;
						}
						
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
						margin-right: 30rpx;
						color: #000;
						font-weight: 500;
						font-size: 28rpx;
						white-space: nowrap;

						.form-required {
							color: #ff233d;
						}
					}

					.form-mobile {
						display: block;
						background: #00a4ff;
						font-size: 24rpx;
						white-space: nowrap;
						margin: 0 0 0 auto;
					}
					
					.disableBtn {
						background: rgba(0, 164, 255, 0.5);
					}

					input {
						height: 92rpx;
						border-bottom: 1px solid #eee;
						font-size: 30rpx;
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