<template>
	<view class="container">
		<web-view :src="url" @message="handleMessage"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '' ,
				isShow: '',
				imgUrl: '',
				priceId: '',
				priceType: '',
				tokenId: '',
			}
		},
		
		onLoad(options) {
			this.priceId = options.feeId
			this.priceType = options.Type
			this.tokenId = uni.getStorageSync('loginInfo').F_Token
			this.url = 'https://wxa.worldjaguar.com/index/index/fclindex?priceId=' + this.priceId + '&priceType=' + this.priceType + '&tokenId=' + this.tokenId
			// this.url = 'https://www.worldjaguar.com/webviewfcl?priceId=' + this.priceId + '&priceType=' + this.priceType + '&tokenId=' + this.tokenId
		},
	
		methods: {
			savePoster() {
				// 获取用户的当前设置
				uni.getSetting({
					success: (res) => {
						// 验证用户是否授权可以访问相册
						if (res.authSetting['scope.writePhotosAlbum']) {
							this.saveImageToMobilePhotos()
						} else {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success: () => {
									this.saveImageToMobilePhotos()
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
			
			handleMessage(e) {
				if(e.detail.data[0].url) {
					this.imgUrl = e.detail.data[0].url
					let base64 = this.imgUrl.replace(/^data:image\/\w+;base64,/, "")
					let filePath = wx.env.USER_DATA_PATH + '/worldjaguar_fclprice.jpg'
					
					uni.getFileSystemManager().writeFile({
						filePath: filePath,
						data: base64,
						encoding: 'base64',
						success: res => {
							uni.saveImageToPhotosAlbum({
								filePath: filePath,
								success: res2 => {
									uni.hideLoading()
									uni.showToast({
										title: this.$t('pub.saveimageauthor'),
										icon: "none",
										duration: 3000
									})
								},
								fail: err => {
									uni.hideLoading()
									console.log(err)
								}
							})
						},
						fail: err => {
							uni.hideLoading()
							console.log(err)
						}
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
.container {
	width: 100%;
}
</style>
