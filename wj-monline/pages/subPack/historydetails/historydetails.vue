<template>
	<view class="historydetails">
		<view class="historydetails-box">
			<view class="historydetails-ship">
				{{$t('lcllist.carrier')}}{{lclInfo.F_ShoppingCompany? lclInfo.F_ShoppingCompany : '--'}}
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
					{{lclInfo.F_SpellState == 1? '直达' : '中转'}}
				</text>
				<text v-if="lclInfo.TransitPortEnglish">
					{{lclInfo.TransitPortEnglish}}
				</text>
				<text>
					{{$t('lcllist.voyage')}} {{lclInfo.F_Voyage? lclInfo.F_Voyage : '--'}}
				</text>
				<text 
					v-if="lclInfo.Efw_Id" 
					style="background: #67C23A" @click="showStoreDetails">
					<text
						style="
							background: transparent; 
							margin: 0; 
							padding: 0;
							vertical-align: bottom;" 
							class="iconfont icon-home-fill">
					</text>查看卫星仓
				</text>
			</view>
		</view>
		<uni-popup ref="storeDetail" type="top" background-color="#eee">
			<view class="storeBox">
				<view class="storeCity">
					<text>
						{{lclInfo.PointofName? lclInfo.PointofName : ''}}{{lclInfo.PointofEnglish? lclInfo.PointofEnglish : ''}}
					</text>
					<view class="storeLine"></view>
					<text>{{lclInfo.FromPortName? lclInfo.FromPortName : ''}}{{lclInfo.FromPortEnglish? lclInfo.FromPortEnglish : ''}}</text>
				</view>
				<view class="storeType">
					<text>方式：{{lclInfo.F_ModeofTransportName}}</text>
					<text>时效：{{lclInfo.F_AgingDay}}</text>
					<text>截仓时间：{{lclInfo.Efw_CutOffTime? lclInfo.Efw_CutOffTime : '--'}}</text>
				</view>
				<view class="storeName">
					<text class="storeTitle">仓库信息：</text>
					<uni-collapse
						v-for="s in lclInfo.Efw_WarehouseArr"
						:key="s.F_Id"
						accordion 
						@change="getStoreInfo(s.F_Id)">
						<uni-collapse-item
							:title="s.F_WarehouseName"
						>
							<text class="storeInfo">{{$t('lcldetail.contact')}}{{storecontact? storecontact : '--'}}</text>
							<text class="storeInfo">{{$t('lcldetail.phone')}}{{storephone? storephone : '--'}}</text>
						</uni-collapse-item>
					</uni-collapse>
				</view>
			</view>
		</uni-popup>
		
		<view class="historydetails-info">
			<view>
				<view v-if="typeNum == 1">
					<view class="historydetails-title">
						起运港码头：{{lclInfo.FromQuayEng? lclInfo.FromQuayEng : '--' }}{{lclInfo.FromQuayName? lclInfo.FromQuayName : '' }}
					</view>
					<view class="historydetails-title">
						目的港码头：{{lclInfo.F_PortofDestinationConnection? lclInfo.F_PortofDestinationConnection : '--' }}
					</view>
				</view>
				<view v-else>
					<view class="historydetails-title">
						起运港码头：{{lclInfo.F_PortofDepartureWharf? lclInfo.F_PortofDepartureWharf : ''}}
					</view>
					<view class="historydetails-title">
						目的港码头：{{lclInfo.ToQuayEng? lclInfo.ToQuayEng : ''}}{{lclInfo.ToQuayName? lclInfo.ToQuayName : '' }}
					</view>
				</view>
			</view>
			<view class="historydetails-title">
				{{$t('lcllist.etd')}}{{lclInfo.F_ShiftPeriod? lclInfo.F_ShiftPeriod : '--'}}
			</view>
			<view class="historydetails-title">
				{{$t('pub.cargo')}}：{{lclInfo.F_PCSQuantity}}{{lclInfo.F_PCSUnit == '1'? 'CTN(S)' : 'PTL(S)'}}/{{lclInfo.F_GrossWeight}}KGS/{{lclInfo.F_Volume}}CBM
			</view>
			<view class="historydetails-title">
				{{$t('lcldetail.si')}}{{lclInfo.F_CutoffTime? lclInfo.F_CutoffTime : '--'}}
			</view>
			<view class="historydetails-title">
				{{$t('lcldetail.cy')}}{{lclInfo.F_CutoffGoodsTime? lclInfo.F_CutoffGoodsTime : '--'}}
			</view>
			<view class="historydetails-title">
				{{$t('lcllist.vaild')}}{{lclInfo.F_StartTime}} {{$t('pub.time')}} {{lclInfo.F_EndTime}}
			</view>
			<view class="historydetails-title">
				是否陆运：{{lclInfo.F_IsLand === '1'? '是' : '否' }}
			</view>
			<view class="historydetails-title" v-if="typeNum != 1">
				是否包含报关费：{{lclInfo.IsCustomsCharges == 0? '否' : '是'}}
			</view>
			<view class="historydetails-title" v-if="typeNum != 1">
				运输条款：{{lclInfo.TransitClause}}
			</view>
			<view class="historydetails-title" v-if="lclInfo.F_IsLand === '1'">
				<view v-if="typeNum == 1">
					起运地：{{lclInfo.DeliveryAreaName? lclInfo.DeliveryAreaName : '' }}
				</view>
				<view v-else>
					送货地：{{lclInfo.DeliveryAreaName? lclInfo.DeliveryAreaName : '' }}
				</view>
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
			<text>
				{{lclInfo.ConsigneeTypeName}}
			</text>
			<text></text>
		</view>
		
		<view class="historydetails-fee">
			<view class="historydetails-fee-pub">
				<view class="historydetails-fee-title">{{$t('pub.freight')}}</view>
				<view class="historydetails-fee-total">{{$t('pub.total')}}：{{freightTotal}}</view>
			</view>
			<view class="historydetails-fee-item" v-for="f in freightArr" :key="f.F_Id">
				<text class="historydetails-name">{{f.F_ExpenseCode}}</text>
				<text class="historydetails-price" v-if="f.F_QuotedPrice !== 'CASE BY CASE'">
					{{Number(f.F_QuotedPrice).toFixed(2)<0? '(' + Number(f.F_QuotedPrice).toFixed(2) * -1 +')' : Number(f.F_QuotedPrice).toFixed(2)}}{{f.F_Currency}}*{{f.F_Quantity}}{{f.F_Unit}} = {{Number(f.F_QuotedAmount).toFixed(2)<0? '(' + Number(f.F_QuotedAmount).toFixed(2) * -1 +')' : Number(f.F_QuotedAmount).toFixed(2)}}{{f.F_Currency}}
				</text>
				<text class="historydetails-price" v-else>Case by case</text>
			</view>
			<view class="historydetails-fee-remark" v-if="lclInfo.F_FreightRemark">
				{{lclInfo.F_FreightRemark}}
			</view>
		</view>
		
		<!-- 起运港费 -->
		<block v-if="(lclInfo.TransitClause === 'FCA' && typeNum == 2) || typeNum == 1">
			<view class="historydetails-fee">
				<view class="historydetails-fee-pub">
					<view class="historydetails-fee-title">
						{{$t('pub.pol')}}
					</view>
					<view class="historydetails-fee-total">
						{{$t('pub.total')}}：{{polTotal? polTotal : '--'}}
					</view>
					<view class="historydetails-fee-total" v-if="typeNum == 2">
						{{$t('pub.convert')}}：{{convertTotal? convertTotal : '--'}}
					</view>
				</view>
				<view class="historydetails-fee-item" v-for="f in polArr" :key="f.F_Id">
					<text class="historydetails-name">{{f.F_ExpenseCode}}</text>
					<text class="historydetails-price" v-if="f.F_Quantity !== ''">
						{{f.F_QuotedPrice}}{{f.F_Currency}}*{{f.F_Quantity? f.F_Quantity : '-' }}{{f.F_Unit}} = {{f.F_QuotedAmount}}{{f.F_Currency}}
					</text>
					<text class="historydetails-price" v-else>Case by case</text>
				</view>
				<view class="historydetails-fee-remark" v-if="lclInfo.F_PortDepartureRemark">
					{{lclInfo.F_PortDepartureRemark}}
				</view>
			</view>
		</block>
		
		
		<view class="historydetails-fee">
			<view class="historydetails-fee-pub">
				<view class="historydetails-fee-title">
					{{$t('pub.pod')}}
				</view>
				<view class="historydetails-fee-total">
					{{$t('pub.total')}}：{{podTotal? podTotal : '--'}}
				</view>
				<view class="historydetails-fee-total" v-if="typeNum == 2">
					{{$t('Imlcl.type')}}：{{typeTotal? typeTotal : '--'}}
				</view>
				<view class="historydetails-fee-total" v-if="typeNum == 1">
					{{$t('pub.convert')}}：{{convertTotal? convertTotal : '--'}}
				</view>
			</view>
			<view class="historydetails-fee-item" v-for="f in podArr" :key="f.F_Id">
				<text class="historydetails-name">
					{{f.F_ExpenseCode}}
				</text>
				<text class="historydetails-price" v-if="f.F_Quantity !== '' || f.F_QuotedPrice !== ''">
					{{f.F_QuotedPrice}}{{f.F_Currency}}*{{f.F_Quantity? f.F_Quantity : '-' }}{{f.F_Unit}} = {{f.F_QuotedAmount}}{{f.F_Currency}}
				</text>
				<text class="historydetails-price" v-else="!f.F_Quantity && !f.F_QuotedPrice ">Case by case</text>
			</view>
			<view class="historydetails-fee-remark" v-if="lclInfo.F_PortofDestinationConnection">
				{{lclInfo.F_PortofDestinationConnection}}
			</view>
		</view>
		
		<!-- 陆运拖车费 -->
		<block v-if="lclInfo.F_IsLand == 1 &&  typeNum == 2  ">
			<view class="historydetails-fee">
				<view class="historydetails-fee-pub">
					<view class="historydetails-fee-title">陆运拖车费</view>
					<view class="historydetails-fee-total">
						{{$t('pub.total')}}：{{landTotal? landTotal : '--'}}
					</view>
				</view>
				<view class="historydetails-fee-item" v-for="f in landFeeArr" :key="f.F_Id">
					<text class="historydetails-name">
						{{f.F_ExpenseCode}}
					</text>
					<text class="historydetails-price">
						{{f.F_QuotedPrice}}{{f.F_Currency}}*{{f.F_Quantity? f.F_Quantity : '-' }}{{f.F_Unit}} = {{f.F_QuotedAmount}}{{f.F_Currency}}
					</text>
					<!-- <text class="historydetails-price" v-else>Case by case</text> -->
				</view>
				<view class="historydetails-fee-remark" v-if="lclInfo.F_PortofDestinationConnection">
					{{lclInfo.F_PortofDestinationConnection}}
				</view>
			</view>
		</block>
		<view class="whiteBox"></view>
	</view>
</template>

<script>
	import {isLoginMethod} from '@/utils/isLogin.js'
	export default {
		data() {
			return {
				lclInfo: {},
				freightArr: [],
				polArr: [],
				podArr: [],
				landFeeArr: [],
				freightTotal: '',
				polTotal: '',
				podTotal: '',
				typeTotal: '',
				landTotal: '',
				applicationLocal: '',
				typeNum: '',
				typeId: '',
				convertTotal: ''
			}
		},
		
		onLoad(option) {
			// 判断初始语言
			this.applicationLocal = uni.getLocale()
			uni.onLocaleChange(e => {
				this.applicationLocal = e.locale
			})
			
			this.typeId = option.id? option.id : ''
			this.typeNum = option.type? option.type : ''
			this.getSavePriceDetails(this.typeId, this.typeNum)
		},
		
		onShow() {
			if(this.typeNum == 1) {
				uni.setNavigationBarTitle({
					title: '海出拼箱历史报价'
				})
			}else {
				uni.setNavigationBarTitle({
					title: '海进拼箱历史报价'
				})
			}
		},
		
		methods: {
			showStoreDetails() {
				this.$refs.storeDetail.open('top')
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
			},
			
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
				
						this.freightArr = res.data.freightSurcharge
						this.polArr = res.data.departurePortCharges
						this.podArr = res.data.destinationPorts
						this.landFeeArr = res.data.landFreight
						
						// 计算海运费
						this.freightTotal = this.lclInfo.F_FreightTotal
						
						// 计算起运港费
						this.polTotal = this.lclInfo.F_PortDepartureTotal
						
						// 计算目的港费
						this.podTotal = this.lclInfo.F_PortDestinationTotal
						this.convertTotal = this.lclInfo.F_CovertTotal
						
						// 陆运拖车费
						this.landTotal = this.lclInfo.F_TrailerChargesTotal
						
						if(this.typeNum == 2) {
							this.typeTotal = this.lclInfo.F_ExpenseTypeTotal
						}
					}
				}catch(error) {
					console.log(error);
				}
			}
		}
	}
</script>

<style scoped lang="less">
::v-deep .uni-collapse-item__title-text {
	white-space: break-spaces !important;
	line-height: 38rpx;
	font-size: 26rpx;
}

::v-deep .uni-collapse-item__wrap.is--transition {
	// height: 60rpx !important;
	line-height: 50rpx;
}
	
.storeBox {
	padding: 28rpx;
	font-size: 26rpx;
	
	.storeCity {
		display: flex;
		align-items: center;
		
		.storeLine {
			width: 80rpx;
			height: 1px;
			background: #ccc;
			margin: 0 6rpx;
		}
	}
	
	.storeType {
		display: flex;
		border-bottom: 1px solid #d6d6d6;
		padding-bottom: 30rpx;
		text {
			margin-right: 30rpx;
		}
	}
	
	.storeName {
		margin-top: 24rpx;
		
		.storeTitle {
			display: block;
			margin: 20rpx 0 10rpx 0;
		}
		.storeInfo {
			padding: 6rpx 30rpx;
			color: #909399;
		}
	}
}
	
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
