<template>
	<view class="historydetails">
		<view class="historydetails-box">
			<view class="historydetails-ship">
				{{$t('lcllist.carrier')}}：{{lclInfo.F_ShoppingCompany? lclInfo.F_ShoppingCompany : '--'}}
			</view>
			<view class="historydetails-port">
				<view class="historydetails-city">
					<text class="historydetails-city-en">{{lclInfo.FromPortEnglish}}</text>
					<text class="historydetails-city-zh">{{lclInfo.FromPortName}}</text>
				</view>
				<view class="historydetails-line"></view>
				<view class="historydetails-city">
					<text class="historydetails-city-en">{{lclInfo.ToPortEnglish}}</text>
					<text class="historydetails-city-zh">{{lclInfo.ToPortName}}</text>
				</view>
			</view>
			<view class="historydetails-label">
				<text>
					{{lclInfo.F_SpellState === '1'? '直达' : '中转'}}
				</text>
				<text>
					{{$t('lcllist.voyage')}} {{lclInfo.F_Voyage? lclInfo.F_Voyage : '--'}}
				</text>
				<text v-if="lclInfo.TransitPortEnglish">
					{{lclInfo.TransitPortEnglish}}
				</text>
			</view>
		</view>
		
		<view class="historydetails-info">
			<view class="historydetails-title">
				起运港码头：{{lclInfo.FromQuayName? lclInfo.FromQuayName : '--'}}
			</view>
			<view class="historydetails-title">
				目的港码头：{{lclInfo.F_DesPortQuayId? lclInfo.F_DesPortQuayId : '--'}}
			</view>
			<view class="historydetails-title">
				{{$t('lcllist.etd')}}：{{lclInfo.F_ShiftPeriod? lclInfo.F_ShiftPeriod : '--'}}
			</view>
			<view class="historydetails-title">
				{{$t('pub.cargo')}}: {{lclInfo.F_CargoQuantity}}
			</view>
			<view class="historydetails-title">
				{{$t('lcldetail.si')}}：{{lclInfo.F_CutoffTime? lclInfo.F_CutoffTime : '--'}}
			</view>
			<view class="historydetails-title">
				开航日：{{lclInfo.F_CutoffGoodsTime? lclInfo.F_CutoffGoodsTime : '--'}}
			</view>
			<view class="historydetails-title">
				航线代码：{{lclInfo.F_RouteCode? lclInfo.F_RouteCode : '--'}}
			</view>
			<view class="historydetails-title">
				订舱备注：{{lclInfo.F_BookingRemarks? lclInfo.F_BookingRemarks : '--'}}
			</view>
			<view class="historydetails-title">
				限重备注：{{lclInfo.F_WeightLimitRemarks? lclInfo.F_WeightLimitRemarks : '--'}}
			</view>
			<view class="historydetails-title">
				{{$t('lcllist.vaild')}}：{{lclInfo.F_StartTime}} {{$t('pub.time')}} {{lclInfo.F_EndTime}}
			</view>
			<view class="historydetails-title">
				{{$t('pub.salescontact')}}：{{lclInfo.Contact.F_RealName? lclInfo.Contact.F_RealName : '--'}}
			</view>
			<view class="historydetails-title">
				{{$t('pub.salestel')}}：{{lclInfo.Contact.F_Telephone? lclInfo.Contact.F_Telephone : '--'}}
			</view>
			<view class="historydetails-title">
				{{$t('pub.salesemail')}}：{{lclInfo.Contact.F_Email? lclInfo.Contact.F_Email : '--'}}
			</view>
		</view>
		
		<view class="historydetails-fee">
			<view class="historydetails-fee-pub">
				<view class="historydetails-fee-title">{{$t('pub.freight')}}</view>
				<view class="historydetails-fee-total">
					{{freightTotal}}
				</view>
			</view>
			<view class="historydetails-fee-item" v-for="f in freightArr" :key="f.F_Id">
				<text class="historydetails-name">{{f.F_ExpenseCode}}</text>
				<text class="historydetails-price" v-if="f.F_UnitPrice">
					{{Number(f.F_UnitPrice)<0? '(' + Number(f.F_UnitPrice) * -1 +')' : Number(f.F_UnitPrice)}}{{f.F_Currency}}*{{Number(f.F_Quantity) + '(' + f.F_Unit + ')'}} = {{Number(f.F_Amount)<0? '(' + Number(f.F_Amount) * -1 +')' : Number(f.F_Amount)}}{{f.F_Currency}}
				</text>
				<text v-else-if="f.F_SingleVote">
					{{Number(f.F_SingleVote)<0? '(' + Number(f.F_SingleVote) * -1 +')' : Number(f.F_SingleVote)}}{{f.F_Currency}}*{{Number(f.F_Quantity) + '(' + f.F_Unit + ')'}} = {{Number(f.F_Amount)<0? '(' + Number(f.F_Amount) * -1 +')' : Number(f.F_Amount)}}{{f.F_Currency}}
				</text>
				<text class="historydetails-price" v-else>-</text>
			</view>
		</view>
		
		<view class="historydetails-fee">
			<view class="historydetails-fee-pub">
				<view class="historydetails-fee-title">
					{{$t('pub.pol')}}
				</view>
				<view class="historydetails-fee-total">
					{{polTotal}}
				</view>
			</view>
			<view class="historydetails-fee-item" v-for="pol in polArr" :key="pol.F_Id">
				<text class="historydetails-name">{{pol.F_ExpenseCode}}</text>
				<text class="historydetails-price" v-if="pol.F_UnitPrice">
					{{Number(pol.F_UnitPrice)<0? '(' + Number(pol.F_UnitPrice) * -1 +')' : Number(pol.F_UnitPrice)}}{{pol.F_Currency}}*{{Number(pol.F_Quantity) + '(' + pol.F_Unit + ')'}} = {{Number(pol.F_Amount)<0? '(' + Number(pol.F_Amount) * -1 +')' : Number(pol.F_Amount)}}{{pol.F_Currency}}
				</text>
				<text v-else-if="pol.F_SingleVote">
					{{Number(pol.F_SingleVote)<0? '(' + Number(pol.F_SingleVote) * -1 +')' : Number(pol.F_SingleVote)}}{{pol.F_Currency}}*{{Number(pol.F_Quantity) + '(' + pol.F_Unit + ')'}} = {{Number(pol.F_Amount)<0? '(' + Number(pol.F_Amount) * -1 +')' : Number(pol.F_Amount)}}{{pol.F_Currency}}
				</text>
				<text class="historydetails-price" v-else>-</text>
			</view>
		</view>
		
		<view class="historydetails-fee">
			<view class="historydetails-fee-pub">
				<view class="historydetails-fee-title">
					{{$t('pub.pod')}}
				</view>
				<view class="historydetails-fee-total">
					{{podTotal}}
				</view>
			</view>
			<view class="historydetails-fee-item" v-for="f in podArr" :key="f.F_Id">
				<text class="historydetails-name">
					{{f.F_ExpenseCode}}
				</text>
				<text class="historydetails-price" v-if="f.F_Quantity !== ''">
					{{f.F_QuotedPrice}}{{f.F_Currency}}*{{f.F_Quantity}}{{f.F_Unit}} = {{f.F_QuotedAmount}}{{f.F_Currency}}
				</text>
				<text class="historydetails-price" v-else>Case by case</text>
			</view>
			<view class="historydetails-fee-remark" v-if="lclInfo.F_PortofDestinationConnection">
				{{lclInfo.F_PortofDestinationConnection}}
			</view>
		</view>
		<view class="whiteBox"></view>
	</view>
</template>

<script>
	let _ = require('lodash')
	import {isLoginMethod} from '@/utils/isLogin.js'
	export default {
		data() {
			return {
				lclInfo: {},
				freightArr: [],
				polArr: [],
				podArr: [],
				freightTotal: '',
				polTotal: '',
				podTotal: '',
				typeTotal: '',
				applicationLocal: '',
				typeNum: '',
				typeId: '',
				convertTotal: ''
			}
		},
		
		onLoad(option) {
			// 判断初始语言
			// this.applicationLocal = uni.getLocale()
			// uni.onLocaleChange(e => {
			// 	this.applicationLocal = e.locale
			// })
			
			this.typeId = option.id? option.id : ''
			this.typeNum = option.type? option.type : ''
			this.getSavePriceDetails(this.typeId, this.typeNum)
		},
		
		onShow() {
			if(this.typeNum == 1) {
				uni.setNavigationBarTitle({
					title: '海出拼箱历史报价'
				})
			}else if(this.typeNum == 2) {
				uni.setNavigationBarTitle({
					title: '海进拼箱历史报价'
				})
			}else {
				uni.setNavigationBarTitle({
					title: '海出整箱历史报价'
				})
			}
		},
		
		methods: {
			async getSavePriceDetails(id, type) {
				const {data: res} = await uni.$http.post('Lclquote/quoteInfo', {
					QuoteId: id,
					Type: type
				})
				try{
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
						
						// 海运费
						this.freightArr = res.data.freightSurcharge
						this.freightArr = _.sortBy(this.freightArr, item => item.F_ExpenseCode)
						this.freightTotal = this.lclInfo.F_FreightTotal //计算海运费
						
						// 起运港费
						this.polArr = res.data.departurePortCharges
						this.polArr = _.sortBy(this.polArr, item => item.F_ExpenseCode)
						this.polTotal = this.lclInfo.F_PortDepartureTotal //计算起运港费
						
						// 目的港费
						this.podArr = res.data.destinationPorts
						this.podArr = _.sortBy(this.podArr, item => item.F_ExpenseCode)
						this.podTotal = this.lclInfo.F_PortDestinationTotal //计算目的港费
					}
				}catch(error) {
					console.log(error);
				}
			}
		}
	}
</script>

<style scoped lang="less">
.historydetails-box {
	width: 100%;
	// height: 300rpx;
	background: #4ba4f8;
	overflow: hidden;
	padding: 30rpx;
	box-sizing: border-box;
	
	.historydetails-ship {
		// height: 64rpx;
		margin: 0 auto;
		background: #4191df;
		color: #fff;
		padding:  12rpx 20rpx;
		border-radius: 10rpx;
		font-size: 26rpx;
		word-break: break-all;
		// line-height: 64rpx;
	}
	
	.historydetails-port {
		display: flex;
		align-items: center;
		margin-top: 20rpx;
		
		.historydetails-line {
			width: 64rpx;
			height: 2rpx;
			margin: 0 20rpx;
			background: #fff;
		}
		
		.historydetails-city {
			display: flex;
			flex-direction: column;
			
			.historydetails-city-en {
				color: #fff;
				font-weight: 550;
				font-size: 30rpx;
			}
			
			.historydetails-city-zh {
				color: #fff;
				font-weight: 500;
				font-size: 26rpx;
			}
		}
	}
	
	.historydetails-label {
		display: flex;
		flex-wrap: wrap;
		margin-top: 20rpx;
		
		text {
			margin: 0 20rpx 20rpx 0;
			background: #5cb2f7;
			padding: 10rpx;
			color: #fff;
			font-size: 26rpx;
			border-radius: 10rpx;
		}
	}
}

.historydetails-info {
	position: relative;
	width: 100%;
	background: #fff;
	color: #555;
	padding: 30rpx;
	font-size: 28rpx;
	box-sizing: border-box;
	
	.historydetails-title {
		margin-bottom: 20rpx;
	}
	
	text {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		color: #fff;
		font-size: 28rpx;
		background: #5cb2f7;
		padding: 10rpx;
		border-radius: 10rpx;
	}
}

.historydetails-fee {
	width: 100%;
	background: #fff;
	margin: 16rpx 0 0 0;
	
	.historydetails-fee-pub {
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #eee;
	}
	
	.historydetails-fee-title {
		color: #000;
		font-size: 28rpx;
		font-weight: 550;
	}
	
	.historydetails-fee-total {
		color: #ef9441;
		font-size: 28rpx;
		font-weight: 500;
		margin-top: 10rpx;
	}
	
	.historydetails-fee-item {
		padding: 20rpx 30rpx 20rpx 30rpx;
		display: flex;
		flex-direction: column;
		
		.historydetails-name {
			font-size: 28rpx;
		}
		
		.historydetails-price {
			color: #4191df;
			font-size: 28rpx;
		}
	}
	
	.historydetails-fee-remark {
		border-top: 1px solid #eee;
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		color: #8a8e9d;
	}
}

.whiteBox {
	width: 100%;
	height: 100rpx;
	background: transparent;
}
	

</style>
