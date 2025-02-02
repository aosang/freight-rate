<template>
	<view class="landList">
		<view class="lcllist-box">
			<view class="lclList-empty" v-if="!landData">
				<view class="iconfont icon-order"></view>
				<view class="empty-text">{{$t('pub.data')}}</view>
			</view>
			<view class="lcllist-item" 
				v-else
				v-for="land in landData"
				:key="land.F_Id"
			>
				<view class="lcllist-top">
					<view class="type">
						<text class="type-label">邮编：{{land.F_PostCode}}</text>
						<text class="type-weight">时效：{{land.F_AgingDay? land.F_AgingDay + '天' : '--'}}</text>
					</view>
					<view class="city">
						<text class="city-start">{{land.AreaText}}</text>
						<text class="iconfont icon-double-arro-right"></text>
						<text class="city-end">{{land.FromPortName}}&nbsp;{{land.FromPortEnglish}}</text>
					</view>
				</view>
				<view class="lcllist-bottom">
					<view class="number">
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="land.BaseAmount">
									{{land.BaseAmount? land.F_Currency + ' ' + land.BaseAmount : ''}}
								</text>
								<text v-else>--</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">基础运费</text>
						</view>
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="land.F_DeliveryFee || land.F_DeliveryFee == 0">
									{{land.F_Currency + ' ' + land.F_DeliveryFee}}
								</text>
								<text v-else>--</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">派送费</text>
						</view>
						<view class="number-item">
							<text class="number-text" v-if="isLogin !== null">
								<text v-if="land.TotalAmount">
									{{land.TotalAmount? land.F_Currency + ' ' + land.TotalAmount : ''}}
								</text>
								<text v-else>--</text>
							</text>
							<text class="number-text" v-else>***</text>
							<text class="number-unit">合计费用</text>
						</view>
					</view>
					<view class="date">
						{{$t('lcllist.vaild')}}：{{land.F_StartTime}} {{$t('pub.time')}} {{land.F_EndTime}}
					</view>
					<view class="date" v-if="land.F_Remark">
						备注：{{land.F_Remark}}
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
				zcode: '',
				landPodId: '',
				landData: [],
				landInfo: {
					number: '',
					weight: '',
					volume: ''
				}
			}
		},

		onLoad(option) {
			if(JSON.stringify(option) !== '{}') {
				this.areaId = option.areaId == undefined? '' : option.areaId
				this.zcode = option.zcode == undefined? '' : option.zcode
				this.landPodId = option.landPodTextId? option.landPodTextId : ''
				this.landInfo = option.landInfo? JSON.parse(option.landInfo) : ''
				
				// 判断是否登录
				uni.getStorageSync('loginInfo')? this.isLogin = uni.getStorageSync('loginInfo') : this.isLogin = null
				this.getLandListData()
			}		
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('ltl.title')
			})
		},

		methods: {
			async getLandListData() {
				const {data: res} = await uni.$http.post('Landtrans/index', {
					AreaId: this.areaId,
					PostCode: this.zcode,
					PortId: this.landPodId,
					Quantity: this.landInfo.number,
					GrossWeight: this.landInfo.weight,
					Volume: this.landInfo.volume
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
						this.landData = res.data.data
					}else {
						this.landData = null
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.landList {
		width: 100%;

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