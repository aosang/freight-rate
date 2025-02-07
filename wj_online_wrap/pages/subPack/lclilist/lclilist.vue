<template>
	<view class="lcllist">
		<!-- list -->
		<view class="lcllist-box">
			<view class="lclList-empty" v-if="lclArr.length === 0">
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
							<text>{{applicationLocal == 'zh-Hans'? lcl.F_SpellState === '1'? '直拼' : '转拼' : lcl.F_SpellState === '1'? 'Direct' : 'Transfer'}}</text>
							<text v-if="lcl.TransitPortEnglish" style="margin-left: 10rpx">{{lcl.TransitPortEnglish}}</text>
						</text>
					</view>
					
					<view class="type">
						<text class="type-weight" style="margin: 24rpx 30rpx 0 0" v-if="lcl.F_RTLowerLimit == '' && lcl.F_RTUpperLimit == ''">
							{{$t('lcllist.rt')}}--
						</text>
						<text class="type-weight" style="margin: 24rpx 30rpx 0 0" v-else-if="lcl.F_RTLowerLimit !== '' && lcl.F_RTUpperLimit == ''">
							{{$t('lcllist.rt')}}{{lcl.F_RTLowerLimit}}＜RT
						</text>
						<text class="type-weight" style="margin: 24rpx 30rpx 0 0" v-else-if="lcl.F_RTLowerLimit == '' && lcl.F_RTUpperLimit !== ''">
							{{$t('lcllist.rt')}}RT≤{{lcl.F_RTUpperLimit}}
						</text>
						<text class="type-weight" style="margin: 24rpx 30rpx 0 0" v-else-if="lcl.F_RTLowerLimit !== '' && lcl.F_RTUpperLimit !== ''">
							{{$t('lcllist.rt')}}{{lcl.F_RTLowerLimit}}＜RT≤{{lcl.F_RTUpperLimit}}
						</text>
						<text class="type-weight" style="margin: 24rpx 30rpx 0 0" v-else>
							{{$t('lcllist.rt')}}--
						</text>
						<text class="type-info" style="margin: 24rpx 0 0 0">
							{{applicationLocal == 'zh-Hans'? lcl.ConsigneeTypeName : lcl.F_ConsigneeType}}
						</text>
					</view>
					
					<view class="city">
						<text class="city-start">{{lcl.FromPortEnglish}}&nbsp;{{lcl.FromPortName}}</text>
						<text class="iconfont icon-double-arro-right"></text>
						<text class="city-end">{{lcl.ToPortEnglish}}&nbsp;{{lcl.ToPortName}}</text>
					</view>
					
					<view class="info">
						<text class="info-week">
							{{$t('lcllist.etd')}}{{applicationLocal == 'zh-Hans'? lcl.F_ShiftPeriod : lcl.F_ShiftPeriodEn}}
						</text>
						<text class="info-day">
							{{$t('lcllist.voyage')}}{{lcl.F_Voyage? lcl.F_Voyage : '--'}}
						</text>
						<text class="info-company">
							{{$t('lcllist.carrier')}}{{lcl.F_ShoppingCompany? lcl.F_ShoppingCompany : '--'}}
						</text>
					</view>
				</view>
				<view class="lcllist-bottom">
					<view class="number">
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="lcl.F_CBM !== ''">
									{{Number(lcl.F_CBM)<0? '$' + '(' + (Number(lcl.F_CBM)*-1) + ')': '$' + Number(lcl.F_CBM)}}
								</text>
								<text v-else>case by case</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">{{$t('lcllist.light')}}(CBM)</text>
						</view>
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="lcl.F_TON !== ''">
									{{Number(lcl.F_TON)<0? '$' + '(' + (Number(lcl.F_TON)*-1) + ')': '$' + Number(lcl.F_TON)}}
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
						{{$t('lcllist.vaild')}}{{lcl.F_StartTime}} {{$t('pub.time')}} {{lcl.F_EndTime}}
					</view>
				</view>
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
		</view>
		<uni-popup ref="consignee" type="bottom" background-color="#fff">
			<view class="consignee-box">
				<view 
					class="consignee-box-item" 
					v-for="c in consigneeArr" 
					:key="c.F_ItemValue"
					@click="selectConsignee(c.F_ItemValue)"
				>
					{{applicationLocal == "zh-Hans"? c.F_ItemName : c.F_ItemValue }}
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
				countryId: '',
				lclArr: [],
				isLogin: null, //登录标识
				applicationLocal: '',
				consigneeArr: [],
				transportArr: [{id: 1, name: this.$t('lcllist.direct')}, {id: 2, name: this.$t('lcllist.transfers')}],
				consigneeId: '',
				transPortId: '',
			}
		},
		
		onLoad(option) {
			// 判断初始语言
			this.applicationLocal = uni.getLocale()
			uni.onLocaleChange(e => {
				this.applicationLocal = e.locale
			})
			
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
				title: this.$t('navigate.import')
			})
			
			// 判断是否登录
			uni.getStorageSync('loginInfo')? this.isLogin = uni.getStorageSync('loginInfo') : this.isLogin = null
			// // 调用查询列表数据
			this.getLclListData()
			this.getConsigneeType()
		},
		
		methods: {
			// 收货人类型
			consigneePop() {
				this.$refs.consignee.open()
			},
			
			selectConsignee(id) {
				this.$refs.consignee.close()
				this.consigneeId = id
				this.getLclListData(this.consigneeId, this.transPortId)
			},
			
			// 运输方式
			transportPop() {
				this.$refs.transport.open()
			},
			
			selectTransport(type) {
				this.$refs.transport.close()
				this.transPortId = type
				this.getLclListData(this.consigneeId, this.transPortId)
			},
			
			filterAll() {
				this.consigneeId = ''
				this.transPortId = ''
				this.getLclListData(this.consigneeId, this.transPortId)
			},
			
			detailsHandler(lclId) {
				// 判断是否登录
				if(this.isLogin === null) return uni.$showMsg('请先登录！')
				uni.navigateTo({
					url: `/pages/subPack/lclidetails/lclidetails?lclId=${lclId}`
				})
			},

			// 获取查询数据
			async getLclListData(cId, type) {
				const {data: res} = await uni.$http.post('Imlcl/index', {
					From: this.polCityId,
					To: this.podCityId,
					CountryId: this.countryId,
					Ctype: cId,
					Sstate: type
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
					this.lclArr = res.data.data
				}
			},
			
			// 获取收货人类型
			async getConsigneeType() {
				const {data: res} = await uni.$http.post('Data/getConsigneeType')
				if(res.code !== 200) return uni.$showMsg(res.info)
				this.consigneeArr = res.data
			}
		}
	}
</script>

<style scoped lang="less">
	.lcllist {
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
					
					.info-day {
						max-width: 300rpx;
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