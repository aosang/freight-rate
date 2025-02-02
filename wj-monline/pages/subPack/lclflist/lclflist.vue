<template>
	<view class="lcllist">
		<!-- list -->
		<view class="lcllist-box">
			<view class="lclList-empty" v-if="!lclArr">
				<view class="iconfont icon-order"></view>
				<view class="empty-text">{{$t('pub.data')}}</view>
			</view>
			<view class="lcllist-item"
				v-else
				v-for="lcl in lclArr"
				:key="lcl.F_Id"
				@click="detailsHandler(lcl.F_Id,)">
				<view class="lcllist-top">
					<view class="type">
						<text class="type-label">
							<text>{{lcl.F_SpellState === '1'? '直达' : '中转'}}</text>
							<text v-if="lcl.TransitPortEnglish" style="margin-left: 10rpx">{{lcl.TransitPortEnglish}}</text>
						</text>
						<text class="type-weight">航线代码：{{lcl.F_RouteCode? lcl.F_RouteCode : '--'}}</text>
						<text class="type-info">{{lcl.ConsigneeTypeName}}</text>
					</view>
					<view class="city">
						<text class="city-start">{{lcl.FromPortEnglish}}&nbsp;{{lcl.FromPortName}}</text>
						<text class="iconfont icon-double-arro-right"></text>
						<text class="city-end">{{lcl.ToPortEnglish}}&nbsp;{{lcl.ToPortName}}</text>
					</view>
					<view class="info">
						<text class="info-week">
							开航：{{lcl.F_CutoffTime? lcl.F_CutoffTime : '-' }}
						</text>
						<text 
							class="info-week" 
							style="max-width: 240rpx; display: block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
						>
							班期：{{lcl.F_ShiftPeriod}}
						</text>
						<text class="info-day">
							{{$t('lcllist.voyage')}}：{{lcl.F_Voyage? lcl.F_Voyage : '--'}}
						</text>
					</view>
					<view class="info">
						<text class="info-week">
							舱位：{{lcl.F_ShippingSpace}}
						</text>
						<text class="info-company">
							{{$t('lcllist.carrier')}}：{{lcl.F_ShoppingCompany}}
						</text>
					</view>
				</view>
				<view class="lcllist-bottom">
					<view class="number">
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="lcl.F_20GP">
									{{Number(lcl.F_20GP)<0? '$' + '(' + (Number(lcl.F_20GP)*-1) + ')': '$' + Number(lcl.F_20GP)}}
								</text>
								<text v-else>-</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">20GP</text>
						</view>
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="lcl.F_40GP">
									{{Number(lcl.F_40GP)<0? '$' + '(' + (Number(lcl.F_40GP)*-1) + ')': '$' + Number(lcl.F_40GP)}}
								</text>
								<text v-else>-</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">40GP</text>
						</view>
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="lcl.F_40HQ">
									{{Number(lcl.F_40HQ)<0? '$' + '(' + (Number(lcl.F_40HQ)*-1) + ')': '$' + Number(lcl.F_40HQ)}}
								</text>
								<text v-else>-</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">40HQ</text>
						</view>
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="lcl.F_45HQ">
									{{Number(lcl.F_45HQ)<0? '$' + '(' + (Number(lcl.F_45HQ)*-1) + ')': '$' + Number(lcl.F_45HQ)}}
								</text>
								<text v-else>-</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">45HQ</text>
						</view>
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="lcl.F_40NOR">
									{{Number(lcl.F_40NOR)<0? '$' + '(' + (Number(lcl.F_40NOR)*-1) + ')': '$' + Number(lcl.F_40NOR)}}
								</text>
								<text v-else>-</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">40NOR</text>
						</view>
					</view>
					<view class="date">
						{{$t('lcllist.vaild')}}：{{lcl.F_StartTime}} {{$t('pub.time')}} {{lcl.F_EndTime}}
					</view>
				</view>
			</view>
			<view v-show="isLoadingMore && lclArr.length !== 0">
				<uni-load-more :status="loadStatus"></uni-load-more>
			</view>
		</view>
		<!-- 筛选 -->
		<view class="filterTab">
			<view class="filter-item" @click="filterAll">
				<text class="iconfont icon-filter-fill"></text>
				<text>全部</text>
			</view>
			<view class="filter-item" @click="selectShipDatePop">
				<text class="iconfont icon-calendar-fill"></text>
				<text>班期</text>
			</view>
			<view class="filter-item" @click="transportPop">
				<text class="iconfont icon-logistics-icon-fill"></text>
				<text>运输</text>
			</view>
		</view>
		<uni-popup ref="selectShipDate" type="bottom" background-color="#fff">
			<view class="consignee-box">
				<view 
					class="consignee-box-item" 
					v-for="c in shipDateArr" 
					:key="c.id"
					@click="selectShipDate(c.id)"
				>
					{{c.name}}
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="transport" type="bottom" background-color="#fff">
			<view class="consignee-box">
				<view 
					class="consignee-box-item" 
					v-for="t in transportArr" 
					:key="t.id"
					@click="selectTransport(t.id)"
				>
					{{t.name}}
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				polCity: '', //起运港
				podCity: '', //目的港
				polCityId: '', //起运港id
				podCityId: '', //目的港id
				lclArr: [],
				isLogin: null, //登录标识
				applicationLocal: '',
				shipDateArr: [{id: '一', name: '周一'}, {id: '二', name: '周二'}, {id: '三', name: '周三'}, {id: '四', name: '周四'}, {id: '五', name: '周五'}, {id: '六', name: '周六'}, {id: '七', name: '周日'}],
				transportArr: [{id: 1, name: '直达'}, {id: 2, name: '中转'}],
				filterDate: '',
				transPortId: '',
				pageNum: 1,
				num: 100,
				isLoadingMore: false,
				loadStatus: 'Loading'
			}
		},
		
		onShow() {
			// uni.setNavigationBarTitle({
			// 	title: this.$t('navigate.list')
			// })
		},
		
		onLoad(option) {
			// 判断初始语言
			// this.applicationLocal = uni.getLocale()
			// uni.onLocaleChange(e => {
			// 	this.applicationLocal = e.locale
			// })
			
			let portInfo = null
			if (option && option.portInfo) {
				portInfo = JSON.parse(option.portInfo)
				// 起运港和目的港id
				this.polCityId = portInfo.polCityId
				this.podCityId = portInfo.podCityId
			} else {
				return
			}
			
			// 判断是否登录
			uni.getStorageSync('loginInfo')? this.isLogin = uni.getStorageSync('loginInfo') : this.isLogin = null

			// 调用查询列表数据
			// this.lclArr = []
			this.getFclListData()
		},
		
		methods: {
			// 收货人类型
			selectShipDatePop() {
				this.$refs.selectShipDate.open()
			},
			
			selectShipDate(id) {
				this.$refs.selectShipDate.close()
				this.filterDate = id
				this.getFclListData(this.filterDate, this.transPortId)
			},
			
			// 运输方式
			transportPop() {
				this.$refs.transport.open()
			},
			
			selectTransport(type) {
				this.$refs.transport.close()
				this.transPortId = type
				this.getFclListData(this.filterDate, this.transPortId)
			},
			
			filterAll() {
				this.filterDate = ''
				this.transPortId = ''
				this.getFclListData(this.filterDate, this.transPortId)
			},
			
			detailsHandler(lclId) {
				// 判断是否登录
				if(this.isLogin === null) return uni.$showMsg('请先登录！')
				uni.navigateTo({
					url: `/pages/subPack/lclfdetails/lclfdetails?lclId=${lclId}`
				})
			},

			// 获取查询数据
			async getFclListData(sDate, type) {
				const {data: res} = await uni.$http.post('Exportfcl/index', {
					Page: this.pageNum,
					Limit: this.num,
					From: this.polCityId,
					To: this.podCityId,
					ShiftPeriod: sDate,
					Sstate: type
				})
				if(res.code == 402) {
					uni.login({
						provider: 'weixin',
						success: async result => {
							this.code = result.code
							isLoginMethod(this.scene, this.code)
						}
					})
				}else if(res.code !== 200 && res.code !== 402) {
					uni.$showMsg(res.info)
				}else if(res.code == 200) {
					if(res.data.data.length !== 0) {
						this.lclArr = res.data.data 
					}else {
						this.lclArr = null
					}
				}
			},

		}
	}
</script>

<style scoped lang="less">
	.lcllist {
		position: relative;
		width: 100%;
		
		.consignee-box {
			.consignee-box-item {
				font-size: 26rpx;
				color: #616577;
				text-align: center;
				padding: 24rpx 0;
				border-bottom: 1px solid #eee;
				
				&:last-child {
					border: none;
				}
			}
		}
		
		.filterTab {
			display: flex;
			align-items: center;
			position: fixed;
			width: 100%;
			height: 96rpx;
			bottom: 0;
			left: 0;
			right: 0;
			background: #E4E7ED;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			z-index: 3;
			border-top: 1px solid #eee;
			
			.filter-item{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 33.33%;
				font-size: 26rpx;
				color: #48a1f7;
				text-align: center;
				border-right: 1px solid #e3e3e3;
				.iconfont {
					font-size: 40rpx;
				}
				&:last-child {
					border-right:  none;
				}
			}
		}
		
		.lcllist-box {
			margin-top: 20rpx;
			
			.lclList-empty {
				display: flex;
				flex-direction: column;
				align-items: center;
				background: #fff;
				padding: 70rpx 50rpx;
				
				.iconfont {
					font-size: 120rpx;
					color: #818c96;
				}
				
				.empty-text {
					margin-top: 20rpx;
					font-size: 28rpx;
					color: #616577;
				}
			}

			.lcllist-item {
				background: #fff;
				padding: 28rpx;
				margin-bottom: 20rpx;

				.type {
					display: flex;
					align-items: center;

					.type-label {
						background: #818c96;
						padding: 4rpx 8rpx;
						color: #fff;
						font-size: 24rpx;
						border-radius: 8rpx;
					}

					.type-weight {
						margin: 0 30rpx;
					}

					.type-weight,
					.type-info {
						font-size: 28rpx;
						font-weight: 550;
						color: #000;
					}
				}

				.city {
					display: flex;
					align-items: center;
					margin-top: 20rpx;
					font-size: 24rpx;
					font-weight: 530;
					color: #48a1f7;

					.iconfont {
						margin: 0 10rpx;
					}

					.city-start,
					.city-end {
						background: #e8f5fd;
						padding: 8rpx 10rpx;
						border-radius: 8rpx;
						white-space: nowrap;
					}
				}

				.info {
					display: flex;
					align-items: center;
					margin-top: 16rpx;

					text {
						margin-right: 24rpx;
						font-size: 24rpx;
						font-weight: 500;
						color: #616577;
					}
				}
			}

			.lcllist-bottom {
				margin-top: 20rpx;

				.number {
					display: flex;

					.number-item {
						flex: 1;
						display: flex;
						flex-direction: column;
						font-size: 28rpx;
						color: #8a8e9d;

						.number-text {
							font-weight: 550;
							color: #ef9441;
							font-size: 28rpx;
						}
						
						.number-unit {
							font-size: 26rpx;
						}
					}
				}

				.date {
					margin-top: 20rpx;
					color: #616577;
					font-size: 26rpx;
					font-weight: 500;
				}
			}
		}

	}
</style>