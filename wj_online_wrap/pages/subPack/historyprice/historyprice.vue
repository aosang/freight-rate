<template>
	<view class="historyprice">
		<view class="historyprice-tab">
			<view class="historyprice-tab-item" v-for="tab in tabArr" :key="tab.id" @click="switchTabHandler(tab.id)"
				:class="tabIndex == tab.id? 'active' : ''">
				{{tab.name}}
			</view>
		</view>
		<view>
			<view class="historyprice-empty" v-if="historyPriceArr.length == 0">
				<text class="iconfont icon-image-text"></text>
				<text class="historyprice-word">{{$t('pub.data')}}</text>
			</view>
			<view class="historyprice-list" v-else>
				<view class="historyprice-list-item" 
					v-for="item in historyPriceArr" 
					:key="item.F_Id"
					@click="goToHistoryDetails(item.F_Id)">
					<text class="iconfont icon-ashbin-fill" 
						@click.stop="deleteSavePriceData(item.F_Id)">
					</text>
					<view class="historyprice-text">
						<text>{{$t('search.pol')}}：</text>{{item.FromPortEnglish}}&nbsp;{{item.FromPortName}}
					</view>
					<view class="historyprice-text">
						<text>{{$t('search.pod')}}：</text>{{item.ToPortEnglish}}&nbsp;{{item.ToPortName}}
					</view>
					<view class="historyprice-text">
						<text>{{$t('pub.cargo')}}：</text>{{item.CargoInfo}}
					</view>
					<view class="historyprice-text">
						<text>{{$t('history.time')}}：</text>{{item.F_CreateDate}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {isLoginMethod} from '@/utils/isLogin.js'
	export default {
		data() {
			return {
				historyPriceArr: [],
				applicationLocal: '',
				tabIndex: 1,
				tabArr: [{
					id: 1,
					name: this.$t('index.lcl')
				}, {
					id: 2,
					name: this.$t('index.ilcl')
				}, {
					id: 3,
					name: this.$t('index.fcl')
				}]
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('navigate.hisory')
			})
		},

		onLoad() {
			// 判断初始语言
			this.applicationLocal = uni.getLocale()
			uni.onLocaleChange(e => {
				this.applicationLocal = e.locale
			})

			this.getSavePriceData(this.tabIndex)
		},

		methods: {
			// 顶部tab切换
			switchTabHandler(index) {
				this.tabIndex = index
				this.getSavePriceData(this.tabIndex)
			},

			// 获取运价列表
			async getSavePriceData(type) {
				const {data: res} = await uni.$http.post('Lclquote/index', {
					Page: 1,
					Limit: 30,
					Type: type,
					StartDate: '',
					EndDate: '',
				})
				try {
					if (res.code !== 200) return uni.$showMsg(res.info)
					this.historyPriceArr = res.data.data
				} catch (error) {
					console.log(error)
				}
			},
			
			// 删除费用
			deleteSavePriceData(id) {
				uni.showModal({
					showCancel: true,
					title: this.$t('pub.notice'),
					content: this.$t('pub.deletedata'),
					confirmText: this.$t('pub.confirmtext'),
					cancelText: this.$t('pub.canceltext'),
					success: async res => {
						if (res.confirm) {
							const {data: res} = await uni.$http.post('Lclquote/delete', {
								QuoteId: id
							})
							if (res.code == 402) {
								uni.login({
									provider: 'weixin',
									success: async result => {
										this.code = result.code
										isLoginMethod(this.scene, this.code)
									}
								})
							}else if (res.code !== 200 && res.code !== 402) {
								uni.$showMsg(res.info)
							}else if (res.code == 200) {
								this.getSavePriceData(this.tabIndex)
							}
						} else {
							return
						}
					}
				})
			},

			// 跳转详情页
			goToHistoryDetails(id) {
				if(this.tabIndex == 1 || this.tabIndex == 2) {
					uni.navigateTo({
						url: '/pages/subPack/historydetails/historydetails?id=' + id + '&' + 'type=' + this.tabIndex
					})
				}else {
					uni.navigateTo({
						url: '/pages/subPack/historyFdetails/historyFdetails?id=' + id + '&' + 'type=' + this.tabIndex
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.historyprice {
		width: 100%;
		margin-top: 4rpx;

		.historyprice-tab {
			display: flex;
			width: 100%;
			background: #fff;
			margin-bottom: 4rpx;

			.historyprice-tab-item {
				width: 50%;
				padding: 20rpx 0;
				font-size: 28rpx;
				text-align: center;
			}

			.active {
				border-bottom: 4rpx solid #409eff;
				color: #409eff;
				font-size: 30rpx;
			}
		}

		.historyprice-empty {
			width: 100%;
			height: 300rpx;
			background: #fff;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: #555;

			.iconfont {
				font-size: 72rpx;
			}

			.historyprice-word {
				margin-top: 10rpx;
				font-size: 28rpx;
				color: #555;
			}
		}

		.historyprice-list-item {
			position: relative;
			margin-bottom: 16rpx;
			padding: 30rpx;
			background: #fff;
			font-size: 28rpx;
			color: #555;

			.historyprice-text {
				margin-bottom: 20rpx;

				text {
					color: #000;
				}
			}

			.icon-ashbin-fill {
				position: absolute;
				top: 24rpx;
				right: 24rpx;
				color: #8f939c;
				font-size: 48rpx;
			}
		}
	}
</style>