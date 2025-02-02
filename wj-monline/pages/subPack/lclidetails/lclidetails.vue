<template>
	<view class="root">
		<view class="lcldetails">
			<view class="lcldetails-top">
				<view class="lcldetails-ship">{{$t('lcllist.carrier')}}{{lclInfo.F_ShoppingCompany? lclInfo.F_ShoppingCompany : '--'}}</view>
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
						{{lclInfo.F_SpellState === '1'? '直拼' : '转拼'}}
					</text>
					<text v-if="lclInfo.TransitPortEnglish">{{lclInfo.TransitPortEnglish}}</text>
					<text>{{$t('lcllist.voyage')}}{{lclInfo.F_Voyage? lclInfo.F_Voyage : '--'}}</text>
				</view>
			</view>
			<view class="lcldetails-info">
				<text v-if="lclInfo.F_PortofDepartureWharf">
					起运港码头：{{lclInfo.F_PortofDepartureWharf? lclInfo.F_PortofDepartureWharf : ''}}
				</text>
				<text v-if="lclInfo.ToQuayName || lclInfo.ToQuayEng">
					目的港码头：{{lclInfo.ToQuayEng? lclInfo.ToQuayEng : ''}}{{lclInfo.ToQuayName? lclInfo.ToQuayName : '' }}
				</text>
				<text>{{$t('lcllist.etd')}}{{lclInfo.F_ShiftPeriod? lclInfo.F_ShiftPeriod : '--'}}</text>
				<text>截关日期：{{lclInfo.F_CutoffPeriod? lclInfo.F_CutoffPeriod: '--' }}</text>
				<!-- <text>{{$t('lcldetail.cy')}}：{{applicationLocal == 'zh-Hans'? lclInfo.F_CutoffGoodsTime? lclInfo.F_CutoffGoodsTime : '--'  : lclInfo.F_CutoffGoodsTimeEn? lclInfo.F_CutoffGoodsTimeEn : '--'}}</text> -->
				<text>{{$t('lcldetail.warehouse')}}{{storename?  storename : '--'}}</text>
				<!-- <text>{{$t('lcldetail.address')}}{{storeaddress?  storeaddress : '--'}}</text>
				<text>{{$t('lcldetail.contact')}}{{storecontact? storecontact : '--'}}</text>
				<text>{{$t('lcldetail.phone')}}{{storephone? storephone : '--'}}</text> -->
				<text>
					{{$t('lcllist.vaild')}}{{lclInfo.F_StartTime}} {{$t('pub.time')}} {{lclInfo.F_EndTime}}
				</text>
				<view class="type-tag">
					{{lclInfo.ConsigneeTypeName}}
				</view>
			</view>
			<my-i-tabbar 
				:lclInfo="lclInfo" 
				:polFee="polFee" 
				:podFee="podFee" 
				:freightArr="freightArr"
				:applicationLocal="applicationLocal"
			>
			</my-i-tabbar>
			<view class="tabbar-box"></view>
		</view>
	</view>
</template>

<script>
	import myITabbar from '@/components/my-tabbar/my-itabbar'
	let _ = require('lodash')
	export default {
		data() {
			return {
				lclId: '',
				lclEfw: '',
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
				title: this.$t('navigate.imdetails')
			})
		},
		
		onLoad(option) {
			// 判断初始语言
			// this.applicationLocal = uni.getLocale()
			// uni.onLocaleChange(e => {
			// 	this.applicationLocal = e.locale
			// })
			
			if(option.lclId) {
				this.lclId = option.lclId
			}
			
			if(option.lclEfw) {
				this.lclEfw = option.lclEfw
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
			
		},
		
		methods: {
			// 获取详情数据
			async getLclDetailsInfo() {
				const {data: res} = await uni.$http.post('Imlcl/lclInfo', {
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
					
					this.polFee = res.data.FromFee
					this.podFee = res.data.ToFee
					
					this.getStoreInfo(this.storeId)
				}
			},
			
			// 获取仓库信息
			async getStoreInfo(id) {
				if(id !== null || id !== '') {
					const {data: res} = await uni.$http.post('data/getStoreInfo', {
						StoreId: id
					})
					// if(res.code !== 200) return uni.$showMsg()
					// this.storename = res.data.F_WarehouseName
					// this.storeaddress = res.data.F_Address
					this.storecontact = res.data.F_ContactPerson
					this.storephone = res.data.F_ContactNumber
				}else {
					return
				}
			}
		},
		
		components: {
			myITabbar
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
					word-break: break-all;
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
