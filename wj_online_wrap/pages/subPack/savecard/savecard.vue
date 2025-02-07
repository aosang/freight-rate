<template>
	<view class="savecard">
		<view class="savecard-shareImage" v-if="imageUrl">
			<image :src="imageUrl" mode="widthFix"></image>
		</view>
		<view class="savecard-image" id="shareCard" v-else>
			<view class="savecard-image-inner">
				<view class="savecard-image-border">
					<img 
						src="@/static/images/service_custom.jpg"
					/>
				</view>
				<view class="savecard-image-info">
					<view class="savecard-name">{{cardName? cardName : '--'}}</view>
					<view class="savecard-cardinfo">
						<text class="savecard-tag">Phone:<text>{{cardPhone? cardPhone : '--'}}</text></text>
						<text class="savecard-tag">Email:<text>{{cardEmail? cardEmail : '--'}}</text></text>
						<text class="savecard-tag">Wechat:<text>{{cardWechat? cardWechat : '--'}}</text></text>
						<text class="savecard-tag">Q&nbsp;Q:<text>{{cardQQ? cardQQ :'--'}}</text></text>
						<text class="savecard-tag">Address:<text>{{cardAddress? cardAddress : '--'}}</text></text>
					</view>
				</view>
			</view>
			<view class="savecard-company">World Jaguar Logistics Inc.</view>
		</view>
		<view 
			style="font-size: 26rpx; color: #555; margin-top: 24rpx;">Long press the picture to save it to your phone album
		</view>
	</view>
</template>

<script>
	import html2canvas from 'html2canvas'
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
				cardEncardCompany: '',
				imageUrl: ''
			}
		},

		onLoad() {
			this.getCardInfo()
			// 判断初始语言
			this.applicationLocal = uni.getLocale()
			uni.onLocaleChange(e => {
				this.applicationLocal = e.locale
			})
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('navigate.service')
			})
		},

		methods: {
			// 获取名片数据
			async getCardInfo(callback) {
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
					setTimeout(() => {
						this.shareCardImage()
					}, 550)
				}
			},

			// 生成名片
			shareCardImage() {
				let dom = document.querySelector('#shareCard')
				html2canvas(dom, {
					allowTaint: false,
					scale: 2,
					dpi: 300,
					useCORS: true,
				}).then(canvas => {
					let context = canvas.getContext("2d")
					context.mozImageSmoothingEnabled = false;
					context.webkitImageSmoothingEnabled = false;
					context.msImageSmoothingEnabled = false;
					context.imageSmoothingEnabled = false;
					
					let pageData = canvas.toDataURL()
					let img = new Image()
					img.src = pageData
					this.imageUrl = img.src
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.savecard {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		
		.savecard-shareImage {
			image {
				width: 100%;
			}
		}
		
		.savecard-image {
			background: #2979ff;
			padding: 120rpx 24rpx 60rpx 24rpx;
			
			.savecard-image-inner {
				position: relative;
				width: 100%;
				height: 560rpx;
				margin: 0 auto;
				background: #fff;
				border-radius: 20rpx;
				
				.savecard-image-border {
					position: absolute;
					left: 50%;
					top: -50%;
					// transform: translate(-50%, -50%);
					width: 180rpx;
					height: 180rpx;
					border-radius: 100%;
					border: 10rpx solid #00a4ff;
					overflow: hidden;
					margin-left: -90rpx;
					margin-top: 180rpx;
					
					img {
						width: 100%;
						height: 100%;
					}
				}
				
				.savecard-image-info {
					overflow: hidden;
					.savecard-name {
						display: block;
						margin-top: 120rpx;
						text-align: center;
						font-weight: 600;
						overflow: hidden;
					}
					.savecard-cardinfo {
						display: flex;
						flex-direction: column;
						margin-top: 40rpx;
						padding: 0 30rpx;
						text {
							margin-bottom: 28rpx;
							font-size: 30rpx;
							color: #555;
							margin-right: 20rpx;
						}
						.savecard-tag {
							display: inline-block;
						}
					}
				}
			}
			.savecard-company {
				text-align: center;
				font-size: 32rpx;
				color: #fff;
				padding-top: 40rpx;
			}
		}
	}
</style>