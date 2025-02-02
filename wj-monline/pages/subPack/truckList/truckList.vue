<template>
	<view class="landList">
		<uni-popup ref="shwoWindow" type="top" background-color="#fff">
			<text class="showWindowText">{{truckShowInfo}}</text>
		</uni-popup>
		<view class="lcllist-box">
			<view class="lclList-empty" v-if="!truckData">
				<view class="iconfont icon-order"></view>
				<view class="empty-text">{{$t('pub.data')}}</view>
			</view>
			<view class="lcllist-item" 
				v-else
				v-for="(truck,index) in truckData"
				:key="truck.F_Id"
			>
				<view class="lcllist-price">{{truck.TotalAmount? truck.F_Currency + ' ' + truck.TotalAmount : '--'}}</view>
				<view class="lcllist-top">
					<view class="type">
						<text class="type-label">邮编：{{truck.F_PostCode}}</text>
						<text class="type-weight">码头：{{truck.PortQuayName? truck.PortQuayName : '--'}}</text>
					</view>
					<view class="city">
						<text class="city-start">{{truck.AreaText}}</text>
						<text class="iconfont icon-double-arro-right"></text>
						<text class="city-end">{{truck.PortName}}&nbsp;{{truck.PortEnglish}}</text>
					</view>
				</view>
				<view class="lcllist-bottom">
					<view class="number">
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text>{{truck.F_PickUpPlace? truck.F_PickUpPlace : '--'}}</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">
								<text>提箱点</text>
								<text v-if="truck.F_PickUpPlace" class="iconfont icon-prompt" @click="shwoWindowInfo(truck.F_PickUpPlace, 1)"></text>
							</text>
						</view>
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text>{{truck.F_LoadingPlace? truck.F_LoadingPlace : '--'}}</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">
								<text>装柜点</text>
								<text v-if="truck.F_LoadingPlace" class="iconfont icon-prompt" @click="shwoWindowInfo(truck.F_LoadingPlace, 2)"></text>
							</text>
							
						</view>
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text>
									{{truck.F_SealingPlace? truck.F_SealingPlace : '--'}}
								</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">
								<text>加封点</text>
								<text v-if="truck.F_SealingPlace" class="iconfont icon-prompt" @click="shwoWindowInfo(truck.F_SealingPlace, 3)"></text>
							</text>
							
						</view>
					</view>
					<view class="date">
						{{$t('lcllist.vaild')}}：{{truck.F_StartTime}} {{$t('pub.time')}} {{truck.F_EndTime}}
					</view>
					<view class="date" v-if="truck.F_Remark">
						备注：{{truck.F_Remark}}
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
				areaId: '',
				truckCode: '',
				truckPodId: '',
				truckPodWharfId: '',
				truckShowInfo: '',
				truckData: [],
				truckInfo: {
					num20: '',
					num40: '',
					num45: ''
				}
			}
		},

		onLoad(option) {
			if(JSON.stringify(option) !== '{}') {
				this.areaId = option.areaId == undefined? '' : option.areaId
				this.truckCode = option.truckCode == undefined? '' : option.truckCode
				this.truckPodId = option.truckPodTextId? option.truckPodTextId : ''
				this.truckPodWharfId = option.truckPodWharfId? option.truckPodWharfId : ''
				this.truckInfo = option.truckInfo? JSON.parse(option.truckInfo) : ''
				
				// 判断是否登录
				uni.getStorageSync('loginInfo')? this.isLogin = uni.getStorageSync('loginInfo') : this.isLogin = null
				this.getTruckListData()
			}		
		},

		methods: {
			shwoWindowInfo(info, num) {
				this.$refs.shwoWindow.open()
				if(num == 1) {
					this.truckShowInfo = '提箱点：' + info
				}else if (num == 2) {
					this.truckShowInfo = '装柜点：' + info
				}else {
					this.truckShowInfo = '加封点：' + info
				}
			},
			
			async getTruckListData() {
				const {data: res} = await uni.$http.post('Landtrans/truckIndex', {
					AreaId: this.areaId,
					PostCode: this.truckCode,
					PortId: this.truckPodId,
					QuayId: this.truckPodWharfId,
					Quantity20: this.truckInfo.num20,
					Quantity40: this.truckInfo.num40,
					Quantity45: this.truckInfo.num45
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
						this.truckData = res.data.data
					}else {
						this.truckData = null
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.landList {
		width: 100%;
		
		.showWindowText {
			display: block;
			padding: 24rpx;
			font-size: 30rpx;
			color: #555;
			border-top: 1px solid #eee;
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
				position: relative;
				background: #fff;
				padding: 28rpx;
				margin-bottom: 20rpx;
				
				.lcllist-price {
					position: absolute;
					top: 24rpx;
					right: 24rpx;
					display: block;
					background: #48a1f7;
					color: #e8f5fd;
					font-size: 30rpx;
					padding: 6rpx 16rpx;
					border-radius: 4rpx;
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
							display: block;
							width: 170rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							font-weight: 500;
							color: #ef9441;
							font-size: 28rpx;
						}

						.number-unit {
							display: flex;
							align-items: center;
							font-size: 26rpx;
							
							.iconfont {
								font-size: 32rpx;
								vertical-align: middle;
								margin-left: 5rpx;
							}
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