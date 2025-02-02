<template>
	<view class="root">
		<view class="lcldetails">
			<view class="lcldetails-top">
				<view class="lcldetails-ship">
					航空公司：
					<view style="width: 40rpx; margin-right: 20rpx;">
						<view class="air-imageLogo">
							<image v-if="lclInfo.Logopath" :src="lclInfo.Logopath? lclInfo.Logopath : '' " mode="widthFix"></image> 
						</view>
					</view>
					{{lclInfo.AirCompanyname}}
				</view>
				<view class="lcldetails-city">
					<view class="city-item">
						<text class="enCity">{{lclInfo.FromCode}}</text>
						<text class="chCity">{{lclInfo.FromPort}}</text>
					</view>
					<view class="city-item">
						<text class="iconfont icon-double-arro-right"></text>
					</view>
					<view class="city-item">
						<text class="enCity">{{lclInfo.ToCode}}</text>
						<text class="chCity">{{lclInfo.ToPort}}</text>
					</view>
				</view>
				<view class="lcldetails-label">
					<text>
						{{lclInfo.F_SpellState === '1'? '中转' : '直达'}}
					</text>
					<text v-if="lclInfo.F_PortofTransit">{{lclInfo.F_PortofTransit}}</text>
					<text>{{$t('lcllist.voyage')}}{{lclInfo.F_Voyage? lclInfo.F_Voyage : '--'}}</text>
				</view>
			</view>
			<view class="lcldetails-info">
				<text>
					{{$t('lcllist.etd')}}{{lclInfo.F_ShiftPeriod? lclInfo.F_ShiftPeriod : '--' }}
				</text>
				<text>
					包装类型：{{lclInfo.F_GoodsTypeCn? lclInfo.F_GoodsTypeCn: '--'}}
				</text>
				<text>
					尺寸限制：{{lclInfo.F_SizeLength? lclInfo.F_SizeLength + 'cm' + '/' : ''}} {{lclInfo.F_SizeWide? lclInfo.F_SizeWide + 'cm' + '/' : ''}} {{lclInfo.F_SizeHigh? lclInfo.F_SizeHigh + 'cm' : ''}}
				</text>
				<text>
					最大重量：{{lclInfo.F_MaxWeight? lclInfo.F_MaxWeight + 'kgs' : ''}}
				</text>
				<text>
					最低承运：{{lclInfo.F_MinWeight? lclInfo.F_MinWeight + 'kgs' : ''}}
				</text>
				<text>
					转运方式：{{lclInfo.F_TransportMode? lclInfo.F_TransportMode : '--'}}
				</text>
				<text>
					锂电池：{{lclInfo.F_LithiumBattery? lclInfo.F_LithiumBattery : '--'}}
				</text>
				<text>
					{{$t('lcllist.vaild')}}{{lclInfo.F_StartTime}} {{$t('pub.time')}} {{lclInfo.F_EndTime}}
				</text>
				<view class="type-tag" v-if="lclInfo.F_PackagTypeCn">
					{{lclInfo.F_PackagTypeCn? lclInfo.F_PackagTypeCn : '-'}}
				</view>
			</view>
			<my-a-tabbar 
				:lclInfo="lclInfo"
				:polFee='polFee'
				:podFee='podFee'
			>
			</my-a-tabbar>
			<view class="tabbar-box"></view>
		</view>
	</view>
</template>

<script>
	import myATabbar from '@/components/my-tabbar/my-atabbar'
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
				rangeList: [],
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
			// uni.setNavigationBarTitle({
			// 	title: this.$t('navigate.details')
			// })
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
				const {data: res} = await uni.$http.post('Exportair/airInfo', {
					AirId: this.lclId
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
					this.freightArr = res.data.Fields
					this.polFee = res.data.FromFee
					this.podFee = res.data.ToFee
				}
			}
		},
		
		components: {
			myATabbar
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
					display: flex;
					background: #4191df;
					color: #fff;
					font-size: 26rpx;
					border-radius: 10rpx;
					padding: 16rpx 20rpx;
					box-sizing: border-box;
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
