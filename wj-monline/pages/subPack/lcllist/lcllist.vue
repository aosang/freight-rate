<template>
	<view class="lcllist">
		<!-- list -->
		<view class="lcllist-box">
			<view class="lclList-empty" v-if="!lclArr">
				<view class="iconfont icon-order"></view>
				<view class="empty-text">{{$t('pub.data')}}</view>
			</view>
			<view class="lcllist-item" v-else v-for="(lcl, index) in lclArr" :key="lcl.F_Id"
				@click.stop="detailsHandler(lcl.F_Id, lcl.Efw_Id)">
				<view class="lclList-store" v-if="lcl.Efw_Id" @click.stop="showStorePop(index)">
					<view>卫星仓费用</view>
				</view>
				<uni-popup ref="storeInfos" type="top" background-color="#eee" :is-mask-click="false">
					<view class="store-city">
						<text>{{lcl.PointofName? lcl.PointofName : ''}}{{lcl.PointofEnglish? lcl.PointofEnglish : ''}}</text>
						<view class="store-line"></view>
						<text>{{lcl.FromPortName? lcl.FromPortName : ''}}{{lcl.FromPortEnglish? lcl.FromPortEnglish : ''}}</text>
					</view>
					<view class="store-msg">
						<view>方式：{{lcl.F_ModeofTransportName? lcl.F_ModeofTransportName : ''}}</view>
						<view>时间：{{lcl.F_AgingDay? lcl.F_AgingDay : ''}}</view>
					</view>
					<button type="primary" size="mini" class="closeStore" @click.stop="closeShowStore(index)">
						关闭
					</button>
				</uni-popup>
				<view class="lcllist-top">
					<view class="type">
						<text class="type-label">
							<text>{{lcl.F_SpellState === '1'? '直拼' : '转拼'}}</text>
							<text v-if="lcl.TransitPortEnglish" style="margin-left: 10rpx">{{lcl.TransitPortEnglish}}</text>
						</text>
					</view>

					<view class="type">
						<text class="type-weight" style="margin: 24rpx 30rpx 0 0"
							v-if="lcl.F_RTLowerLimit == '' && lcl.F_RTUpperLimit == ''">
							{{$t('lcllist.rt')}}--
						</text>
						<text class="type-weight" style="margin: 24rpx 30rpx 0 0"
							v-else-if="lcl.F_RTLowerLimit !== '' && lcl.F_RTUpperLimit == ''">
							{{$t('lcllist.rt')}}{{lcl.F_RTLowerLimit}}＜RT
						</text>
						<text class="type-weight" style="margin: 24rpx 30rpx 0 0"
							v-else-if="lcl.F_RTLowerLimit == '' && lcl.F_RTUpperLimit !== ''">
							{{$t('lcllist.rt')}}RT≤{{lcl.F_RTUpperLimit}}
						</text>
						<text class="type-weight" style="margin: 24rpx 30rpx 0 0"
							v-else-if="lcl.F_RTLowerLimit !== '' && lcl.F_RTUpperLimit !== ''">
							{{$t('lcllist.rt')}}{{lcl.F_RTLowerLimit}}＜RT≤{{lcl.F_RTUpperLimit}}
						</text>
						<text class="type-weight" style="margin: 24rpx 30rpx 0 0" v-else>
							{{$t('lcllist.rt')}}--
						</text>
						<text class="type-info" style="margin: 24rpx 0 0 0">
							{{lcl.ConsigneeTypeName}}
						</text>
					</view>

					<view class="city">
						<text class="city-start">{{lcl.FromPortEnglish}}&nbsp;{{lcl.FromPortName}}</text>
						<text class="iconfont icon-double-arro-right"></text>
						<text class="city-end">{{lcl.ToPortEnglish}}&nbsp;{{lcl.ToPortName}}</text>
					</view>
					<view class="info">
						<text class="info-week">{{$t('lcllist.etd')}}{{lcl.F_ShiftPeriod}}</text>
						<text
							class="info-company">{{$t('lcllist.carrier')}}{{lcl.F_ShoppingCompany? lcl.F_ShoppingCompany : '--'}}</text>
					</view>
					<view class="info">
						<text class="info-company">
							<text class="info-day">{{$t('lcllist.voyage')}}{{lcl.F_Voyage? lcl.F_Voyage : '--'}}</text>
							<text v-if="lcl.F_ChargeStandard == 1">{{$t('lcllist.standard')}}{{$t('lcllist.normal')}}</text>
							<text v-else-if="lcl.F_ChargeStandard == 2">{{$t('lcllist.standard')}}{{$t('lcllist.high')}}</text>
							<text v-else>{{$t('lcllist.standard')}}{{$t('lcllist.low')}}</text>
						</text>
					</view>
				</view>
				<view class="lcllist-bottom">
					<view class="number">
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="lcl.F_CBM !== ''">
									{{Number(lcl.F_CBM)<0? '$' + '(' + (Number(lcl.F_CBM)*-1) + ')' : '$' + Number(lcl.F_CBM)}}
								</text>
								<text v-else>case by case</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">{{$t('lcllist.light')}}(CBM)</text>
						</view>
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="lcl.F_TON !== ''">
									{{Number(lcl.F_TON)<0? '$' + '(' + (Number(lcl.F_TON)*-1) + ')' : '$' + Number(lcl.F_TON)}}
								</text>
								<text v-else>case by case</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">{{$t('lcllist.heavy')}}(TON)</text>
						</view>
						<view class="number-item">
							<text class="number-text" v-if="lcl.F_VolumeRatio">{{'1:' + lcl.F_VolumeRatio}}</text>
							<text class="number-text" v-else>--</text>
							<text class="number-unit">{{$t('lcllist.vol')}}</text>
						</view>
					</view>
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
				<text>{{$t('lcllist.consignee')}}</text>
			</view>
			<view class="filter-item" @click="transportPop">
				<text class="iconfont icon-logistics-icon-fill"></text>
				<text>{{$t('lcllist.transfer')}}</text>
			</view>
			<view class="filter-item" @click="expenseFeePop">
				<text class="iconfont icon-consumption-fill"></text>
				<text>{{$t('lcllist.fee')}}</text>
			</view>
		</view>
		<uni-popup ref="consignee" type="bottom" background-color="#fff">
			<view class="consignee-box">
				<view class="consignee-box-item" v-for="c in consigneeArr" :key="c.F_ItemValue"
					@click="selectConsignee(c.F_ItemValue)">
					{{c.F_ItemName}}
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="transport" type="bottom" background-color="#fff">
			<view class="consignee-box">
				<view class="consignee-box-item" v-for="t in transportArr" :key="t.id" @click="selectTransport(t.id)">
					{{t.name}}
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="expenseFee" type="bottom" background-color="#fff">
			<view class="consignee-box">
				<view class="consignee-box-item" v-for="e in expenseFeeArr" :key="e.id" @click="selectexpenseFee(e.id)">
					{{e.name}}
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		isLoginMethod
	} from '@/utils/isLogin.js'
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
				transportArr: [{
					id: 1,
					name: this.$t('lcllist.direct')
				}, {
					id: 2,
					name: this.$t('lcllist.transfers')
				}],
				expenseFeeArr: [{
					id: 1,
					name: this.$t('lcllist.normal')
				}, {
					id: 2,
					name: this.$t('lcllist.high')
				}, {
					id: 3,
					name: this.$t('lcllist.low')
				}],
				consigneeId: '',
				transPortId: '',
				expenseId: '',
				isMaskShow: 0,
				pageNum: 1,
				num: 100,
				isLoadingMore: false,
				loadStatus: 'Loading'
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
			uni.setNavigationBarTitle({
				title: this.$t('navigate.list')
			})
			// 判断是否登录
			uni.getStorageSync('loginInfo') ? this.isLogin = uni.getStorageSync('loginInfo') : this.isLogin = null
			// 调用查询列表数据
			// this.lclArr = []
			this.getLclListData()
			this.getConsigneeType()
		},

		methods: {
			// 展示卫星仓信息
			showStorePop(index) {
				this.$refs.storeInfos[index].open('top')
				this.isMaskShow = 1
			},

			closeShowStore(index) {
				this.$refs.storeInfos[index].close()
				this.isMaskShow = 0
			},

			// 收货人类型
			consigneePop() {
				this.$refs.consignee.open()
			},

			selectConsignee(id) {
				this.lclArr = []
				this.consigneeId = id
				this.$refs.consignee.close()
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

			detailsHandler(lclId, lclEfw) {
				// 判断是否登录
				if (this.isLogin === null) return uni.$showMsg('请先登录！')
				if (this.isMaskShow === 1) {
					return
				} else {
					uni.navigateTo({
						url: `/pages/subPack/lcldetails/lcldetails?lclId=${lclId}&lclEfw=${lclEfw? lclEfw : ''}`
					})
				}
			},

			// 获取查询数据
			async getLclListData(cId, type, expense) {
				const { data: res } = await uni.$http.post('Exportlcl/index', {
					Page: this.pageNum,
					Limit: this.num,
					From: this.polCityId,
					To: this.podCityId,
					CountryId: this.countryId,
					Ctype: cId,
					Sstate: type,
					ChargeStandard: expense
				})
				if (res.code == 402) {
					uni.login({
						provider: 'weixin',
						success: async result => {
							this.code = result.code
							isLoginMethod(this.scene, this.code)
						}
					})
				} else if (res.code !== 200 && res.code !== 402) {
					uni.$showMsg(res.info)
				} else if (res.code == 200) {
					if (res.data.data.length !== 0 ) {
						this.lclArr = res.data.data
					}else {
						this.lclArr = null
					}
				}
			},

				// 获取收货人类型
				async getConsigneeType() {
					const {
						data: res
					} = await uni.$http.post('Data/getConsigneeType')
					if (res.code !== 200) return uni.$showMsg(res.info)
					this.consigneeArr = res.data
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

			.filter-item {
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
					border-right: none;
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
				// width: 100%;
				position: relative;
				background: #fff;
				padding: 28rpx;
				margin-bottom: 20rpx;

				.lclList-store {
					position: absolute;
					right: 24rpx;
					top: 24rpx;
					width: 160rpx;
					padding: 6rpx 0;
					background: #48a1f7;
					font-size: 24rpx;
					border-radius: 8rpx;
					color: #fff;
					text-align: center;
				}

				.closeStore {
					margin: 0 0 24rpx 24rpx;
					background: #48a1f7;
					text-align: center;
					font-size: 26rpx;
				}

				.store-city {
					display: flex;
					align-items: center;
					margin: 24rpx;

					text {
						font-size: 26rpx;
					}

					.store-line {
						width: 80rpx;
						height: 1px;
						background: #ccc;
						margin: 0 6rpx;
					}
				}

				.store-msg {
					font-size: 26rpx;
					display: flex;
					margin: 0 0 24rpx 24rpx;

					view {
						margin-right: 30rpx;
					}
				}

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

					.info-week {
						max-width: 330rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.info-company {
						max-width: 450rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
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