<template>
	<view class="savecard">
		<l-painter ref="painterCard">
			<l-painter-view
				css="width: 100%; height: 900rpx; background: #377df6; padding: 80rpx 0 120rpx 0">
				<l-painter-view
					css="width: 92%; height: 100%; margin: 0 auto;  background: #fff; borderRadius: 30rpx; position: relative">
					<l-painter-view
						css="width: 176rpx; height: 176rpx; borderRadius: 50%; background: #fff; border: 10rpx solid #65b0fb; position: absolute; left: 50%; marginLeft: -90rpx; top: -44rpx; overflow: hidden">
						<l-painter-image 
							src="https://wxa.worldjaguar.com/webview/images/wj_monline/service_custom.jpg"
							css="width: 100%; height: 100%; borderRadius: 50%" />
					</l-painter-view>
					<l-painter-view>
						<l-painter-text
							css="text-align: center; display: block; margin-top: 170rpx; font-size: 38rpx; font-weight: 600; color: #222"
							:text="cardName? cardName : '--'" />
					</l-painter-view>
					<l-painter-view css="margin: 40rpx 48rpx 0 56rpx; color: #6b6b6b; font-size: 30rpx">
						<l-painter-text :text="$t('pub.phone') + '：' + (cardPhone? cardPhone : '--')"
							css="display: block; margin-bottom: 24rpx; "></l-painter-text>
						<l-painter-text :text="$t('pub.email') + '：' + (cardEmail? cardEmail : '--')"
							css="display: block; margin-bottom: 24rpx;"></l-painter-text>
						<l-painter-text :text="$t('pub.wechat') + '：' + (cardWechat? cardWechat : '--')"
							css="display: block; margin-bottom: 24rpx;"></l-painter-text>
						<l-painter-text :text="$t('pub.qciq') + '：' + (cardQQ? cardQQ : '--')"
							css="display: block; margin-bottom: 24rpx;"></l-painter-text>
						<l-painter-text :text="$t('pub.address') + '：' + (cardAddress? cardAddress : '--')"
							css="display: block; font-size: 30rpx"></l-painter-text>
					</l-painter-view>
					<l-painter-view css="display: flex; padding: 40rpx; align-items: center">
						<l-painter-view css="flex: 3">
							<l-painter-text :text="$t('pub.minifir')"
								css="display: block; color: #353743; font-size: 32rpx; font-weight: 600" />
							<l-painter-text :text="$t('pub.minisec')"
								css="display: block; color: #353743; font-size: 32rpx; font-weight: 600" />
							<l-painter-text :text="$t('pub.sloganone')"
								css="font-size: 26rpx; color: #797a82; font-style: italic" />
								<l-painter-text :text="$t('pub.slogantwo')"
									css="font-size: 26rpx; color: #797a82; font-style: italic" />
						</l-painter-view>
						<l-painter-view css="flex: 2">
							<l-painter-image :src="cardQrCode" css="width: 100%; height: 100%" />
						</l-painter-view>
					</l-painter-view>
				</l-painter-view>
				<l-painter-text 
					css="color: #fff; font-size: 30rpx; text-align: center; display: block; margin-top: 36rpx"
					:text="cardCompany? cardCompany : '--'"/>
			</l-painter-view>
		</l-painter>
		<button class="savecardImg" type="primary" @click="saveImageToPhotosAlbum">
			{{$t('pub.saveImage')}}
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cardName: '',
				cardPhone: '',
				cardEmail: '',
				cardWechat: '',
				cardQQ: '',
				cardAddress: '',
				cardCompany: '',
				cardQrCode: '',
				applicationLocal: '',
				cardEncardCompany: ''
			}
		},

		onLoad() {
			this.getCardInfo()
			this.getMiniProgramCode()
			
			// 判断初始语言
			// this.applicationLocal = uni.getLocale()
			// uni.onLocaleChange(e => {
			// 	this.applicationLocal = e.locale
			// })
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('navigate.service')
			})
		},

		methods: {
			savePoster() {
				uni.getSetting({
					success: (res) => {
						// 验证用户是否授权可以访问相册
						if (res.authSetting['scope.writePhotosAlbum']) {
							this.saveImageToPhotosAlbum()
						} else {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success: () => {
									this.saveImageToPhotosAlbum()
								},
								fail: () => {
									uni.showToast({
										title: this.$t('pub.author'),
										icon: 'none',
										duration: 2000
									})
									setTimeout(() => {
										uni.openSetting({
											// 调起客户端小程序，让用户开启访问相册
											success: (res2) => {
												console.log(res2.authSetting)
											}
										})
									}, 3000)
								}
							})
						}
					}
				})
			},

			// 获取名片数据
			async getCardInfo() {
				const {data: res} = await uni.$http.post('user/visitCard')
				if (res.code == 401) {
					uni.$showMsg(res.info)
				} else if (res.code == 200) {
					this.cardName = res.data.F_RealName
					this.cardPhone = res.data.F_Mobile
					this.cardEmail = res.data.F_Email
					this.cardWechat = res.data.F_WeChat
					this.cardQQ = res.data.F_OICQ
					this.cardAddress = res.data.CityName + res.data.AreaName + res.data.F_Address
					this.cardCompany = res.data.CompanyName
					this.cardEncardCompany = res.data.EnCompanyName
				}
			},

			async getMiniProgramCode() {
				const {data: res} = await uni.$http.post('wxapp/qrcode', {
					path: 'pages/home/home',
					responseType: 'arraybuffer',
				})
				this.cardQrCode = res.data.base64
			},
			
			saveImageToPhotosAlbum() {
				this.$refs.painterCard.canvasToTempFilePathSync({
					fileType: 'jpg',
					quality: 1,
					success: (res) => {
						this.imgUrl = res.tempFilePath
			
						let base64 = this.imgUrl.replace(/^data:image\/\w+;base64,/, "")
						let filePath = wx.env.USER_DATA_PATH + '/myCard.jpg'
						
						uni.showLoading({
							title: this.$t('pub.loading'),
							mask: true
						})
						uni.getFileSystemManager().writeFile({
							filePath: filePath, //创建一个临时文件名
							data: base64, //写入的文本或二进制数据
							encoding: 'base64', //写入当前文件的字符编码
							success: res => {
								uni.saveImageToPhotosAlbum({
									filePath: filePath,
									success: (res2) => {
										uni.hideLoading();
										uni.showToast({
											title: this.$t('pub.saveimageauthor'),
											icon: "none",
											duration: 5000
										})
									},
									fail: (err) => {
										uni.hideLoading();
										console.log(err.errMsg);
									}
								})
							},
							fail: error => {
								uni.hideLoading()
								console.log(error)
							}
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.savecard {
		padding: 30rpx;

		.savecardImg {
			height: 80rpx;
			margin-top: 48rpx;
			background: #2979ff;
			line-height: 80rpx;
			font-size: 28rpx;
			border: none;
		}
	}
</style>