<template>
	<view class="home">
		<view class="home-image">
			<image :src="imgUrl" mode="widthFix"></image>
		</view>
		<!-- nav-icon -->
		<view class="home-nav">
			<view class="nav-item" @click="goToLandSearch">
				<view 
					class="iconfont icon-product-fill"
					style="color: #18c585"
				>
				</view>
				<text class="nav-title">{{$t('index.land')}}</text>
			</view>
			<view class="nav-item" @click="goToSearch">
				<view 
					class="iconfont icon-logistics-icon-fill"
					style="color: #32a6fd"
				>
				</view>
				<text class="nav-title">{{$t('index.lcl')}}</text>
			</view>
			<view class="nav-item" @click="goToImportSearch">
				<view 
					class="iconfont icon-all-fill1"
					style="color: #feae00;"
				>	
				</view>
				<text class="nav-title">{{$t('index.ilcl')}}</text>
			</view>
			<view class="nav-item" @click="goToFclSearch">
				<view 
					class="iconfont icon-product1"
					style="color: #fb8382;"
				>
				</view>
				<text class="nav-title">{{$t('index.fcl')}}</text>
			</view>
			<view class="nav-item" @click="goToTruckSearch">
				<view 
					class="iconfont icon-homepage-ads-fill"
					style="color: #9d7afa"
				>
				</view>
				<text class="nav-title">{{$t('index.truk')}}</text>
			</view>
		</view>
		<!-- bussiness type -->
		<view class="home-business">
			<view class="business-top">
				<view class="home-title">{{$t('index.bussiness')}}</view>
			</view>
			<view class="business-list">
				<view class="business-item"
					v-for="item in businessArr"
					:key="item.id"
					@click="goToBusinessDetails(item.id)"
				>
					<view class="business-list-l">
						<image :src="item.imgUrl" mode="widthFix"></image>
					</view>
					<view class="business-list-r">
						<text class="business-name">{{item.name}}</text>	
						<text class="business-word">{{item.text}}</text>	
					</view>		
				</view>
			</view>	
		</view>
		<!-- service -->
		<!-- <view class="service">
			<button open-type="contact">
				<text class="iconfont icon-service-fill"></text>
			</button>
		</view> -->
	</view>
</template>

<script>
	import { isLoginMethod } from '@/utils/isLogin.js'
	export default {
		data() {
			return {
				applicationLocal: '',
				queryCode: '',
				code: '',
				imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_monline/home_banner_en_wj.jpg',
				scene: ''
			}
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
		
		onLoad() {
			// 判断初始语言
			this.applicationLocal = uni.getLocale()
			uni.onLocaleChange(e => {
				this.applicationLocal = e.locale
			})
			// 登录
			isLoginMethod()
		},
		
		onShow() {
			uni.setTabBarItem({
				index: 0,
				pagePath: 'pages/home/home',
				iconPath: "static/images/tabBar/home.png",
				selectedIconPath: "static/images/tabBar/home_o.png",
				text: this.$t('tabbar.home')
			})
			
			uni.setTabBarItem({
				index: 1,
				pagePath: "pages/profile/profile",
				iconPath:  "static/images/tabBar/profile.png",
				selectedIconPath: "static/images/tabBar/profile_o.png",
				text: this.$t('tabbar.profile')
			})

		},
		
		methods: {
			// 跳转出口拼箱
			goToSearch() {
				uni.$showMsg('Coming soon')
				// uni.navigateTo({
				// 	url:'/pages/subPack/search/search'
				// })
			},
			
			// 跳转进口拼箱
			goToImportSearch() {
				uni.$showMsg('Coming soon')
				// uni.navigateTo({
				// 	url:'/pages/subPack/isearch/isearch'
				// })
			},
			
			// 跳转业务类型详情页
			goToBusinessDetails(id) {
				uni.navigateTo({
					url: '/pages/subPack/business/business?textId=' + id
				})
			},
			
			goToFclSearch() {
				uni.$showMsg('Coming soon')
				// uni.navigateTo({
				// 	url: '/pages/subPack/fsearch/fsearch'
				// })
			},
			
			goToLandSearch() {
				uni.navigateTo({
					url: '/pages/subPack/landsearch/landsearch'
				})
			},
			
			goToTruckSearch() {
				uni.$showMsg('Coming soon')
				// uni.navigateTo({
				// 	url: '/pages/subPack/trucksearch/trucksearch'
				// })
			},
			
			// tipHandler() {
			// 	uni.showToast({
			// 		title: '正在开发中，敬请期待',
			// 		duration: 3000,
			// 		icon: 'none'
			// 	})
			// }
		}
	}
</script>

<style scoped lang="less">
	.home-image {
		image {
			width: 100%;
			height: 100%;
		}
	}
	
	.home-nav {
		width: 100%;
		background: #fff;
		display: flex;
		align-items: center;
		box-shadow: 5px 5px 10px #eee;
		flex-wrap: wrap;
		padding-top: 20rpx;
		
		.nav-item {
			width: 33.33%;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 0 0 24rpx 0;
			
			.iconfont {
				font-size: 90rpx;
				color: #3e8bf7;
			}
			
			.nav-title {
				font-size: 30rpx;
				font-weight: 600;
				color: #353743;
				margin-top: -6rpx;
			}
			
			.nav-subtitle {
				width: 280rpx;
				text-align: center;
				font-size: 24rpx;
				color: #737687;
				margin-top: 10rpx;
			}
		}
	}
	
	.home-business {
		width: 100%;
		background: #fff;
		margin-top: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
		
	  .business-top {
			display: flex;
			padding-bottom: 30rpx;
			font-size: 30rpx;
			font-weight: 550;
			border-bottom: 1px solid #eee;
			.home-title {
				margin-right: 20rpx;
			}
		}
		
		.business-list {
			margin-top: 30rpx;
			
			.business-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 44rpx;
				
				.business-list-l {
					width: 34%;
					image {
						width: 100%;
						border-radius: 10rpx;
					}
				}
				
				.business-list-r {
					width: 63%;
					
					.business-name {
						font-size: 30rpx;
						color: #000;
						font-weight: 550;
					}
					
					.business-word {
						display: -webkit-box;
						-webkit-line-clamp: 2;
						overflow: hidden;
						white-space: normal;
						-webkit-box-orient: vertical;
						font-size: 26rpx;
						color: #555;
					}
				}
			}
		}
	}
	.service {
		width: 106rpx;
		height: 106rpx;
		background: #409EFF;
		opacity: 0.92;
		border-radius: 100%;
		position: fixed;
		right: 24rpx;
		bottom: 60rpx;
		box-shadow: -4rpx -4rpx 4rpx #eee;
		
		button {
			background: transparent;
			font-size: 26rpx;
			margin: -36rpx 0 0 -8rpx;
		}
		
		text {
			display: block;
			color: #fff;
			text-align: center;
			font-size: 70rpx;
		}
		
		button::after {
			border: none;
		}
	}
</style>
