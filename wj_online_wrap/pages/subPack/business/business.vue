<template>
	<view class="business">
		<view class="business-title">{{newBuisness.name}}</view>
		<view class="business-image">
			<image :src="newBuisness.imgUrl" mode="widthFix"></image>
		</view>
		<view class="business-text">
			<text>{{newBuisness.text}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newBuisness:  null,
				textId: '',
				applicationLocal: ''
			}
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('navigate.business')
			})
		},
		
		onLoad() {
			// 判断初始语言
			this.applicationLocal = uni.getLocale()
			uni.onLocaleChange(e => {
				this.applicationLocal = e.locale
			})
		},
		
		computed: {
			businessArr() {
				return [{
					id: 1,
					name: this.$t('index.import'),
					text: this.$t('business.import'),
					imgUrl: "https://wxa.worldjaguar.com/webview/images/wj_monline/haiyunjinchukou.jpg"
				}, {
					id: 2,
					name: this.$t('index.railway'),
					text: this.$t('business.railyway'),
					imgUrl: "https://wxa.worldjaguar.com/webview/images/wj_monline/duoshilianyun.jpg"
				}, {
					id: 3,
					name: this.$t('index.commerce'),
					text: this.$t('business.commerce'),
					imgUrl: "https://wxa.worldjaguar.com/webview/images/wj_monline/kuajingdianshang.jpg"
				}, {
					id: 4,
					name: this.$t('index.landlocked'),
					text: this.$t('business.landlocked'),
					imgUrl: "https://wxa.worldjaguar.com/webview/images/wj_monline/luyunyewu.jpg"
				}, {
					id: 5,
					name: this.$t('index.supply'),
					text: this.$t('business.supply'),
					imgUrl: "https://wxa.worldjaguar.com/webview/images/wj_monline/gongyinglianguanli.jpg"
				}, {
					id: 6,
					name: this.$t('index.air'),
					text: this.$t('business.air'),
					imgUrl: "https://wxa.worldjaguar.com/webview/images/wj_monline/kongyun.jpg"
				}, {
					id: 7,
					name: this.$t('index.bonded'),
					text: this.$t('business.bonded'),
					imgUrl: "https://wxa.worldjaguar.com/webview/images/wj_monline/zonghewuliubaoshui.jpg"
				}, {
					id: 8,
					name: this.$t('index.transport'),
					text: this.$t('business.transport'),
					imgUrl: "https://wxa.worldjaguar.com/webview/images/wj_monline/guojizhongzhuanjipin.jpg"
				}, {
					id: 9,
					name: this.$t('index.customs'),
					text: this.$t('business.customs'),
					imgUrl: "https://wxa.worldjaguar.com/webview/images/wj_monline/baoguanbaojian.jpg"
				}, {
					id: 10,
					name: this.$t('index.cfs'),
					text: this.$t('business.cfs'),
					imgUrl: "https://wxa.worldjaguar.com/webview/images/wj_monline/pinxiangchangzhan.jpg"
				}]
			}
		},
		
		onLoad(option) {
			this.textId = option.textId
			this.newBuisness = this.businessArr.find(item => item.id == this.textId)
		}
	}
</script>

<style scoped lang="less">
.business {
	width: 100%;
	background: #fff;
	padding: 30rpx;
	box-sizing: border-box;
	
	.business-title {
		margin-bottom: 24rpx;
		font-size: 32rpx;
		font-weight: 550;
	}
	
	.business-image {
		width: 100%;
		
		image {
			width: 100%;
			border-radius: 10rpx;
			margin-bottom: 24rpx;
		}
	}
	
	.business-text {
		font-size: 28rpx;
		color: #555;
		line-height: 52rpx;
	}
}
</style>