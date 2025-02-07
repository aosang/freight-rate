<template>
	<view class="root">
		<view class="lcldetails">
			<view class="lcldetails-top">
				<view class="lcldetails-ship">{{$t('lcllist.carrier')}}{{lclInfo.F_ShoppingCompany}}</view>
				<view class="lcldetails-city">
					<view class="city-item">
						<text class="enCity">{{lclInfo.FromPortEnglish}}</text>
						<text class="chCity">{{lclInfo.FromPortName}}</text>
					</view>
					<view class="city-item">
						<text class="iconfont icon-double-arro-right"></text>
					</view>
					<view class="city-item">
						<text class="enCity">{{lclInfo.ToPortEnglish}}</text>
						<text class="chCity">{{lclInfo.ToPortName}}</text>
					</view>
				</view>
				<view class="lcldetails-label">
					<text>
						{{applicationLocal == 'zh-Hans'? lclInfo.F_SpellState === '1'? '直拼' : '转拼' : lclInfo.F_SpellState === '1'? 'Direct' : 'Transfer'}}
					</text>
					<text v-if="lclInfo.TransitPortEnglish">{{lclInfo.TransitPortEnglish}}</text>
					<text>{{$t('lcllist.voyage')}}{{lclInfo.F_Voyage? lclInfo.F_Voyage : '--'}}{{$t('pub.day')}}</text>
				</view>
			</view>
			<view class="lcldetails-info">
				<text>
					{{$t('lcllist.etd')}}{{applicationLocal == 'zh-Hans'? lclInfo.F_ShiftPeriod? lclInfo.F_ShiftPeriod : '--' : lclInfo.F_ShiftPeriodEn? lclInfo.F_ShiftPeriodEn : '--'}}
				</text>
				<text>
					{{$t('lcldetail.si')}}{{applicationLocal == 'zh-Hans'? lclInfo.F_CutoffTime? lclInfo.F_CutoffTime: '--' : lclInfo.F_CutoffTimeEn? lclInfo.F_CutoffTimeEn : '--'}}
				</text>
				<text>
					{{$t('lcldetail.cy')}}{{applicationLocal == 'zh-Hans'? lclInfo.F_CutoffGoodsTime? lclInfo.F_CutoffGoodsTime : '--' : lclInfo.F_CutoffGoodsTimeEn? lclInfo.F_CutoffGoodsTimeEn : '--'}}
				</text>
				<text>
					<text v-if="lclInfo.F_ChargeStandard == 1">{{$t('lcllist.standard')}}{{$t('lcllist.normal')}}</text>
					<text v-else-if="lclInfo.F_ChargeStandard == 2">{{$t('lcllist.standard')}}{{$t('lcllist.high')}}</text>
					<text v-else-if="lclInfo.F_ChargeStandard == 3">{{$t('lcllist.standard')}}{{$t('lcllist.low')}}</text>
				</text>
				<text>
					{{$t('lcldetail.warehouse')}}{{storename?  storename : '--'}}
				</text>
				<text>
					{{$t('lcldetail.address')}}{{storeaddress?  storeaddress : '--'}}
				</text>
				<text>
					{{$t('lcldetail.contact')}}{{storecontact? storecontact : '--'}}
				</text>
				<text>
					{{$t('lcldetail.phone')}}{{storephone? storephone : '--'}}
				</text>
				<text>
					{{$t('lcllist.vaild')}}{{lclInfo.F_StartTime}} {{$t('pub.time')}} {{lclInfo.F_EndTime}}
				</text>
				<view class="type-tag">
					{{applicationLocal == 'zh-Hans'? lclInfo.ConsigneeTypeName : lclInfo.F_ConsigneeType}}
				</view>
			</view>
			<my-tabbar 
				:lclInfo="lclInfo" 
				:polFee="polFee" 
				:podFee="podFee" 
				:freightArr="freightArr"
				:applicationLocal="applicationLocal"
			>
			</my-tabbar>
			<view class="tabbar-box"></view>
		</view>
	</view>
</template>

<script>
	import myTabbar from '@/components/my-tabbar/my-tabbar'
	import {isLoginMethod} from '@/utils/isLogin.js'
	let _ = require('lodash')
	export default {
		data() {
			return {
				lclId: '',
 				lclInfo: {} ,//拼箱详情信息
				polFee: [], //起运港费用
				podFee: [], //目的港费用
				freightArr: [],
				computedRes: {},
				packageInfo: {number: '', weight: '', volume: ''},
				storeId: '' ,//仓库ID
				storename: '', //仓库名字
				storeaddress: '', //仓库地址
				storecontact: '', //联系人
				storephone: '', //联系电话
				applicationLocal: ''
			}
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('navigate.details')
			})
		},
		
		onLoad(option) {
			// 判断初始语言
			this.applicationLocal = uni.getLocale()
			uni.onLocaleChange(e => {
				this.applicationLocal = e.locale
			})
			
			if(option.lclId) {
				this.lclId = option.lclId
			}
			
			if(option.computedRes) {
				const {computedRes} = option
				this.computedRes = JSON.parse(decodeURIComponent(computedRes))
				
				this.freightComputed = this.computedRes.freightSurcharge
				this.freightRemark = this.computedRes.freightAddDesc
				
				this.polComputed = this.computedRes.departurePortCharges
				this.polRemark = this.computedRes.fromDesc
				
				this.podComputed = this.computedRes.destinationPorts
				this.podRemark = this.computedRes.toDesc
			}
			
			if(option.packageInfo) {
				let data = JSON.parse(option.packageInfo)
				this.packageInfo.number = data.number
				this.packageInfo.weight = data.weight
				this.packageInfo.volume = data.volume
			}
			
			// 调用详情数据
			this.getLclDetailsInfo()
			// // 调用起运港费用
			this.getPolFeeData()
			// 调用目的港费用
			this.getPodFeeData()
		},
		
		methods: {
			// 获取详情数据
			async getLclDetailsInfo() {
				const {data: res} = await uni.$http.post('Exportlcl/lclInfo', {
					LclId: this.lclId
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
					this.lclInfo = res.data
					this.storeId = this.lclInfo.F_Warehouse
					this.freightArr = res.data.FreightAdd
					
					this.getStoreInfo(this.storeId)
				}
			},
			
			// 起运港费用
			async getPolFeeData() {
				const {data: res} = await uni.$http.post('Exportlcl/lclFee', {
					Type: 1,
					LclId: this.lclId
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
				}else if (res.code == 200) (
					this.polFee = res.data
				)
			},
			
			// 目的港费用
			async getPodFeeData() {
				const {data: res} = await uni.$http.post('Exportlcl/lclFee', {
					Type: 2,
					LclId: this.lclId
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
				}else if (res.code == 200) (
					this.podFee = res.data
				)
			},
			
			// 获取仓库信息
			async getStoreInfo(id) {
				if(id !== null || id !== '') {
					const {data: res} = await uni.$http.post('data/getStoreInfo', {
						StoreId: id
					})
					// if(res.code !== 200) return uni.$showMsg()
					this.storename = res.data.F_WarehouseName
					this.storeaddress = res.data.F_Address
					this.storecontact = res.data.F_ContactPerson
					this.storephone = res.data.F_ContactNumber
				}else {
					return
				}
			}
		},
		
		components: {
			myTabbar
		}
	}
</script>

<style scoped lang="less">
	.root {
		.lcldetails {
			.lcldetails-top {
				width: 100%;
				background: #48a1f7;
				padding: 24rpx;
				box-sizing: border-box;

				.lcldetails-ship {
					background: #4191df;
					color: #fff;
					font-size: 26rpx;
					border-radius: 10rpx;
					padding: 16rpx 20rpx;
					box-sizing: border-box;
				}

				.lcldetails-city {
					display: flex;
					align-items: center;
					margin-top: 26rpx;
					color: #fff;

					.city-item {
						display: flex;
						flex-direction: column;
						margin-right: 32rpx;

						.enCity {
							font-weight: 550;
							font-size: 30rpx;
						}

						.chCity {
							font-size: 24rpx;
						}
					}
				}

				.lcldetails-label {
					display: flex;
					margin-top: 20rpx;
					color: #fff;
					font-size: 24rpx;

					text {
						padding: 10rpx;
						background: #5cb2f7;
						margin-right: 16rpx;
						border-radius: 10rpx;
					}
				}
			}

			.lcldetails-info {
				position: relative;
				width: 100%;
				background: #fff;
				padding: 30rpx;
				box-sizing: border-box;

				text {
					display: block;
					margin-bottom: 24rpx;
					font-size: 28rpx;
					color: #444754;
				}

				.type-tag {
					position: absolute;
					top: 30rpx;
					right: 30rpx;
					color: #fff;
					background: #4191df;
					font-size: 26rpx;
					border-radius: 20rpx;
					text-align: center;
					line-height: 50rpx;
					padding: 4rpx 20rpx;
				}
			}
		}
	}
</style>
