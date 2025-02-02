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
							<text>{{lcl.F_SpellState === '1'? '中转' : '直达' }}</text>
							<text v-if="lcl.F_PortofTransit" style="margin-left: 10rpx">{{lcl.F_PortofTransit}}</text>
						</text>
						<text class="type-package" v-show="lcl.F_PackagTypeCn">{{lcl.F_PackagTypeCn? lcl.F_PackagTypeCn : '--'}}</text>
					</view>
					
					<view class="city">
						<text class="city-start">{{lcl.FromCode}}&nbsp;{{lcl.FromPort}}</text>
						<text class="iconfont icon-double-arro-right"></text>
						<text class="city-end">{{lcl.ToCode}}&nbsp;{{lcl.ToPort}}</text>
					</view>
					<view class="info">
						<text class="info-week">{{$t('lcllist.etd')}}{{lcl.F_ShiftPeriod? lcl.F_ShiftPeriod : '--'}}</text>
						<text class="info-company">
							<text class="info-day">
								{{$t('lcllist.voyage')}}{{lcl.F_Voyage? lcl.F_Voyage : '--'}}
							</text>
						</text>
						<text class="info-week">
							转运方式：{{lcl.F_TransportMode? lcl.F_TransportMode : ''}}
						</text>
					</view>
					<view class="info">
						<view class="info-company">
							航空公司：
							<view style="width: 40rpx; margin-right: 20rpx;">
								<view class="air-imageLogo">
									<image v-if="lcl.Logopath" :src="lcl.Logopath? lcl.Logopath : ''" mode="widthFix"></image> 
								</view>
							</view>
							{{lcl.AirCompanyname? lcl.AirCompanyname : '--'}}
						</view>
					</view>
				</view>
				<view class="lcllist-bottom">
					<view class="date">
						{{$t('lcllist.vaild')}}{{lcl.F_StartTime}}{{$t('pub.time')}}{{lcl.F_EndTime}}
					</view>
				</view>
			</view>
			<view v-show="isLoadingMore && lclArr.length !== 0">
				<uni-load-more :status="loadStatus"></uni-load-more>
			</view>
		</view>
		<view class="tabbar-box"></view>
		<!-- 筛选 -->
		<view class="filterTab">
			<view class="filter-item" @click="filterAll">
				<text class="iconfont icon-filter-fill"></text>
				<text>全部</text>
			</view>
			<view class="filter-item" @click="consigneePop">
				<text class="iconfont icon-product1"></text>
				<text>包装类型</text>
			</view>
			<view class="filter-item" @click="transportPop">
				<text class="iconfont icon-logistics-icon-fill"></text>
				<text>{{$t('lcllist.transfer')}}</text>
			</view>
			<view class="filter-item" @click="expenseFeePop">
				<text class="iconfont icon-order-fill"></text>
				<text>航空公司</text>
			</view>
		</view>
		<uni-popup ref="consignee" type="bottom" background-color="#fff">
			<view class="consignee-box">
				<view 
					class="consignee-box-item" 
					v-for="c in packageArr" 
					:key="c.F_ItemValue"
					@click="selectConsignee(c.F_ItemValue)"
				>
					{{ c.F_ItemName }}
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
		<uni-popup ref="expenseFee" type="bottom" background-color="#fff">
			<view class="consignee-box">
				<view 
					class="consignee-box-item" 
					v-for="e in airCompanyArr" 
					:key="e.F_Id"
					@click="selectexpenseFee(e.F_Id)"
				>
					{{e.F_NameCn}}
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {isLoginMethod} from '@/utils/isLogin.js'
	export default {
		data() {
			return {
				polCity: '', //起运港
				podCity: '', //目的港
				polCityId: '', //起运港id
				podCityId: '', //目的港id
				countryId: '',
				lclArr: [],
				isLogin: null, //登录标识
				applicationLocal: '',
				consigneeArr: [],
				transportArr: [{id: 1, name: '转运'}, {id: 2, name: '直达'}],
				packageArr: [],
				airCompanyArr: [],
				consigneeId: '',
				transPortId: '',
				expenseId: '',
				pageNum: 1,
				num: 10,
			}
		},
				
		onLoad(option) {		
			// 判断初始语言
			// this.applicationLocal = uni.getLocale()
			// uni.onLocaleChange(e => {
			// 	this.applicationLocal = e.locale
			// })
			
			let portInfo = null
			let countryInfo = null
			
			if (option && option.portInfo) {
				portInfo = JSON.parse(option.portInfo)
				// 起运港和目的港id
				this.polCityId = portInfo.polCityId
				this.podCityId = portInfo.podCityId
			} else {
				return
			}
			
			if (option && option.countryInfo) {
				countryInfo = JSON.parse(option.countryInfo)
				this.countryId = countryInfo.countryId
			} else {
				return
			}
		},
		
		onShow() {
			// uni.setNavigationBarTitle({
			// 	title: this.$t('navigate.list')
			// })
			// 判断是否登录
			uni.getStorageSync('loginInfo')? this.isLogin = uni.getStorageSync('loginInfo') : this.isLogin = null
			
			// 调用查询列表数据
			// this.lclArr = []
			this.getLclListData()
			this.getPackageType()
			this.getAirCompanyType()
		},
		
		methods: {
			// 收货人类型
			consigneePop() {
				this.$refs.consignee.open()
			},
			
			selectConsignee(id) {
				this.$refs.consignee.close()
				this.consigneeId = id
				this.getLclListData(this.consigneeId, this.transPortId, this.expenseId)
			},
			
			// 运输方式
			transportPop() {
				this.$refs.transport.open()
			},
			
			selectTransport(type) {
				this.$refs.transport.close()
				this.transPortId = type
				this.getLclListData(this.consigneeId, this.transPortId, this.expenseId)
			},
			
			// 费用标准 
			expenseFeePop() {
				this.$refs.expenseFee.open()
			},
			
			selectexpenseFee(eId) {
				this.$refs.expenseFee.close()
				this.expenseId = eId
				this.getLclListData(this.consigneeId, this.transPortId, this.expenseId)
			},
			
			filterAll() {
				this.consigneeId = ''
				this.expenseId = ''
				this.transPortId = ''
				this.getLclListData(this.consigneeId, this.transPortId, this.expenseId)
			},
			
			detailsHandler(lclId) {
				// 判断是否登录
				if(this.isLogin === null) return uni.$showMsg('请先登录！')
				uni.navigateTo({
					url: `/pages/subPack/airdetails/airdetails?lclId=${lclId}`
				})
			},
			
			// 获取查询数据
			async getLclListData(cId, type, expense) {
				const {data: res} = await uni.$http.post('Exportair/index', {
					Page: this.pageNum,
					Limit: this.num,
					From: this.polCityId,
					To: this.podCityId,
					CountryId: this.countryId,
					PackageType: cId,
					Sstate: type,
					AirCompanyId: expense
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
					if(res.data.data.length !== 0) {
						this.lclArr = res.data.data
					}else {
						this.lclArr = null
					}
				}
			},
			
			// 获取收货人类型
			async getPackageType() {
				const {data: res} = await uni.$http.post('data/getPackageType')
				if(res.code !== 200) return uni.$showMsg(res.info)
				this.packageArr = res.data
			},
			
			// 空运
			async getAirCompanyType() {
				const {data: res} = await uni.$http.post('data/getAirCompany')
				if(res.code !== 200) return uni.$showMsg(res.info)
				this.airCompanyArr = res.data
			}
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
				width: 25%;
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
					
					.type-package {
						width: 100rpx;
						height: 48rpx;
						background: #48a1f7;
						color: #fff;
						text-align: center;
						line-height: 44rpx;
						font-size: 24rpx;
						border-radius: 8rpx;
						margin-left: 20rpx;
					}

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
						font-size: 26rpx;
						font-weight: 500;
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
					
					image {
						width: 100%;
						// margin-right: 10rpx;
					}
					
					.info-week {
						max-width: 330rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					
					.info-company {
						display: flex;
						max-width: 450rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						font-size: 24rpx;
						font-weight: 500;
						color: #616577;
						align-items: center;
						
						.air-imageLogo {
							width: 44rpx;
							height: 44rpx;
							image {
								width: 100%;
								height: 100%;
							}
						}
					}

					text {
						margin-right: 20rpx;
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