<template>
	<view class="landsearch">
		<view class="landsearch-inner">
			<view class="landsearch-item">
				<text class="landsearch-item-title"><text class="require" style="margin-left: 4rpx;"></text>提货地</text>
				<view class="landsearch-item-picker">
					<pick-regions :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
						<view v-if="areaArray.length !== 0">{{regionName}}</view>
						<view class="land-searchtip" v-else>{{areaTip}}</view>
					</pick-regions>
				</view>
			</view>
			<view class="landsearch-item">
				<text class="landsearch-item-title">
					<text class="require" style="margin-left: 4rpx;"></text>提货地邮编
				</text>
				<view class="landsearch-item-picker">
					<input type="number" v-model.number="truckCode" placeholder="请输入提货地邮编">
				</view>
			</view>
			<!-- 目的地 -->
			<view class="landsearch-item">
				<text class="landsearch-item-title"><text class="require">*</text>港口</text>
				<view class="landsearch-item-picker" @click="showTruckPodData('showLeft')">
					<input type="number" disabled v-model="truckPodTextSelected" placeholder="请选择港口">
				</view>
				<!-- 目的地列表 -->
				<uni-drawer ref="showLeft" mode="left" width="340">
					<input
						v-model="truckPodText"
						class="search-landPod"
						placeholder="请输入港口"
						@input="getTruckInputPod"
					/>
					<view class="city-box">
						<view v-if="podTruckData.length !== 0">
							<view
								class="city-item" 
								v-for="tpod in podTruckData" 
								:key="tpod.F_Id"
								@click="selectTruckPod(tpod.F_PortEnglish, tpod.F_Id)"
							>
								<text class="enName">{{tpod.F_PortEnglish}}</text>
								<text class="chName">{{tpod.F_PortName}}</text>
							</view>
						</view>
						<!-- 没有数据 -->
						<view class="empty-city" v-else>
							<text class="iconfont icon-logistics-icon"></text>
							<text class="empty-text" style="text-align: center">暂无数据</text>
						</view>
					</view>
				</uni-drawer>
			</view>
			<!-- 码头 -->
			<view class="landsearch-item">
				<text class="landsearch-item-title"><text class="require"></text>港口码头</text>
				<view class="landsearch-item-picker" @click="showTruckPodWharfData('showLeftWharf')">
					<input type="number" disabled v-model="truckPodWharfSelected" placeholder="请选择港口码头">
				</view>
				<!-- 码头列表 -->
				<uni-drawer ref="showLeftWharf" mode="left" width="340">
					<view class="city-box">
						<view v-if="podWharfTruckData.length !== 0">
							<view
								class="city-item" 
								v-for="wpod in podWharfTruckData" 
								:key="wpod.F_Id"
								@click="selectTruckWrafPod(wpod.F_PortQuayeEnglish, wpod.F_Id)"
							>
								<text class="enName">{{wpod.F_PortQuayName}}</text>
								<text class="chName">{{wpod.F_PortQuayeEnglish}}</text>
							</view>
						</view>
						<!-- 没有数据 -->
						<view class="empty-city" v-else>
							<text class="iconfont icon-logistics-icon"></text>
							<text class="empty-text" style="text-align: center">暂无数据</text>
						</view>
					</view>
				</uni-drawer>
			</view>
			
			<view class="landsearch-items">
				<text class="landsearch-item-title"><text class="require"></text>20尺</text>
				<view class="landsearch-item-picker landsearch-item-border">
					<uni-number-box v-model="truckInfo.num20"></uni-number-box>
				</view>
			</view>
			<view class="landsearch-items">
				<text class="landsearch-item-title"><text class="require"></text>40尺</text>
				<view class="landsearch-item-picker landsearch-item-border">
					<uni-number-box v-model="truckInfo.num40"></uni-number-box>
				</view>
			</view>
			<view class="landsearch-items">
				<text class="landsearch-item-title"><text class="require"></text>45尺</text>
				<view class="landsearch-item-picker landsearch-item-border">
					<uni-number-box v-model="truckInfo.num45"></uni-number-box>
				</view>
			</view>
			<view class="landsearch-item" style="display: flex;">
				<button type="primary" class="search-btn" @click="goToLandListPage">立即查询</button>
				<button class="search-reset" @click="clearTruckInfo">重置</button>
			</view>
		</view>
		<text class="landsearch-tips">*1.提货地与邮编至少要填写一项</text>
		<text class="landsearch-tips">*2.至少要选择一种箱型</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				areaArray: [],
				areaCode: [],
				podTruckData: [],
				podWharfTruckData: [],
				truckCode: '',
				defaultRegionCode: '110101',
				areaTip: '请选择发货地',
				truckPodText: '',
				truckPodTextId: '',
				truckPodTextSelected: '',
				truckPodWharfSelected: '',
				truckPodWharfSelectedId: '',
				timer: null,
				truckInfo: {
					num20: '',
					num40: '',
					num45: ''
				}
			}
		},
		
		computed: {
			regionName() {
				return this.areaArray.map(item => item.name).join(' ')
			}
		},
			
		methods: {
			handleGetRegion(region) {
				this.areaCode = []
				this.areaArray = region
				this.areaArray.map(item => {
					this.areaCode.push(item.id)
				})
			},
			
			showTruckPodData(e) {
				this.getTruckPodData()
				this.$refs[e].open()
			},
			
			showTruckPodWharfData(e) {
				if(!this.truckPodTextId) {
					uni.$showMsg('请先选择目的地！')
				}else {
					this.getTruckPodWharfData()
					this.$refs[e].open()
				}
			},
			
			getTruckInputPod() {
				clearInterval(this.timer)
				this.timer = setTimeout(() => {
					this.getTruckPodData()
				}, 700)
			},
			
			// 获取码头
			async getTruckPodWharfData() {
				const {data: res} = await uni.$http.post('data/getQuayByPort', {
					PortId: this.truckPodTextId
				})
				if(res.code !== 200) return uni.$showMsg(res.info)
				this.podWharfTruckData = res.data
			},
			
			selectTruckPod(city, cityId) {
				this.$refs.showLeft.close()
				this.truckPodTextSelected = city
				this.truckPodTextId = cityId
			},
			
			selectTruckWrafPod(city, cityId) {
				this.$refs.showLeftWharf.close()
				this.truckPodWharfSelected = city
				this.truckPodWharfSelectedId = cityId
			},
			
			async getTruckPodData() {
				const {data: res} = await uni.$http.post('Data/getPortCn', {
					SearchText: this.truckPodText
				})
				if(res.code !== 200) return uni.$showMsg(res.info)
				this.podTruckData = res.data.data
			},
			
			// 跳转查询页面
			goToLandListPage() {
				const {num20, num40, num45} = this.truckInfo
				if(!this.areaCode && !this.truckCode) {
					uni.$showMsg('请输入提货地或邮政编码')
				}else if(!this.truckPodTextSelected) {
					uni.$showMsg('请输入港口')
				}else if(!num20 && !num40 && !num45) {
					uni.$showMsg('请选择箱型')
				}else {
					uni.navigateTo({
						url: '/pages/subPack/truckList/truckList?areaId=' + this.areaCode[2] + '&truckPodTextId=' + this.truckPodTextId + '&truckPodWharfId=' + this.truckPodWharfSelectedId + '&truckCode=' + this.truckCode + '&truckInfo=' + JSON.stringify(this.truckInfo)
					})
				}
			},
			
			// 清空信息
			clearTruckInfo() {
				this.areaArray = []
				this.areaCode = []
				this.truckCode = ''
				this.truckInfo.num20 = ''
				this.truckInfo.num40 = ''
				this.truckInfo.num45 = ''
				this.truckPodText = ''
				this.truckPodTextId = ''
				this.truckPodTextSelected = ''
				this.truckPodWharfSelected = ''
				this.truckPodWharfSelectedId = ''
			}
		}
	}
</script>

<style lang="less" scoped>
	::v-deep .uni-numbox__value {
		width: 300rpx !important;
	}
	
.landsearch-inner {
	width: 100%;
	background: #fff;
	padding: 24rpx;
	font-size: 30rpx;
	box-sizing: border-box;
	
	.landsearch-items {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
	}
	
	.landsearch-item {
		// display: flex;
		align-items: center;
		margin-bottom: 40rpx;
		
		.search-landPod {
			width: 100%;
			height: 88rpx;
			border-bottom: 1px solid rgba(64, 158, 255, 0.2);
			background: #f4f4f4;
			box-sizing: border-box;
			padding-left: 28rpx;
			font-size: 28rpx;
		}
		
		.city-box {
			position: relative;
			background: #fff;
			font-weight: 600;
			font-size: 26rpx;
			.empty-city {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-top: 440rpx;
				.iconfont {
					color: #ccc;
					font-size: 80rpx;
					font-weight: 200;
				}
				.empty-text {
					font-size: 28rpx;
					font-weight: 200;
					color: #ccc;
				}
			}
			.city-item {
				display: flex;
				align-items: center;
				padding: 28rpx;
				font-size: 28rpx;
				color: #555;
				border-bottom: 1px solid #eee;
				
				.chName {
					width: 240rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-left: 20rpx;
				}
			}
		}
		
		.search-btn {
			width: 44%;
			height: 76rpx;
			margin-top: 20rpx;
			line-height: 76rpx;
			font-size: 30rpx;
			background: #4ba4f8;
		}
		
		.search-reset {
			width: 44%;
			height: 76rpx;
			margin-top: 20rpx;
			line-height: 76rpx;
			font-size: 30rpx;
			background: #eee;
			overflow: inherit;
		}
		
		.landsearch-item-title {
			flex: 4;
			font-size: 26rpx;
			font-weight: 600;
			
			.require {
				color: #F56C6C;
			}
		}
			
		.landsearch-item-picker {
			flex: 7;
			width: 100%;
			border-bottom: 1px solid #EBEEF5;
			margin-top: 10rpx;
			padding: 10rpx 0 10rpx 0;
			box-sizing: border-box;
			
			.land-searchtip {
				color: #808080;
			}
		}
		
		.landsearch-item-border {
			border: none;
		}
	}
}

.landsearch-tips {
	display: block;
	padding: 24rpx 24rpx 0 24rpx;
	box-sizing: border-box;
	font-size: 24rpx;
	color: #F56C6C;
}
</style>
