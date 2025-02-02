<template>
	<view class="landsearch">
		<view class="landsearch-inner">
			<view class="landsearch-item">
				<text class="landsearch-item-title">
					<text class="require" style="margin-left: 4rpx"></text>{{$t('ltl.pickUp')}}
				</text>
				<view class="landsearch-item-picker">
					<pick-regions :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
						<view v-if="areaArray.length !== 0">{{regionName}}</view>
						<view class="land-searchtip" v-else>{{areaTip}}</view>
					</pick-regions>
				</view>
				<view class="landsearch-item-unit"></view>
			</view>
			<view class="landsearch-item">
				<text class="landsearch-item-title"><text class="require" style="margin-left: 4rpx"></text>{{$t('ltl.postcode')}}</text>
				<view class="landsearch-item-picker">
					<input type="number" v-model.number="zcode" :placeholder="$t('ltl.postinput')">
				</view>
				<view class="landsearch-item-unit"></view>
			</view>
			<view class="landsearch-item">
				<text class="landsearch-item-title"><text class="require">*</text>{{$t('ltl.port')}}</text>
				<view class="landsearch-item-picker" @click="showLandPodData('showLeft')">
					<input type="number" disabled v-model="landPodTextSelected" :placeholder="$t('ltl.selectport')">
				</view>
				<view class="landsearch-item-unit"></view>
				<!-- 收货地列表 -->
				<uni-drawer ref="showLeft" mode="left" width="340">
					<input
						v-model="landPodText"
						class="search-landPod"
						placeholder="请输入港口"
						@input="getLandInputPod"
					/>
					<view class="city-box">
						<view v-if="podLandData.length !== 0">
							<view
								class="city-item" 
								v-for="lpod in podLandData" 
								:key="lpod.F_Id"
								@click="selectLandPod(lpod.F_PortEnglish, lpod.F_Id)"
							>
								<text class="enName">{{lpod.F_PortEnglish}}</text>
								<text class="chName">{{lpod.F_PortName}}</text>
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
			<view class="landsearch-item">
				<text class="landsearch-item-title"><text class="require">*</text>货物件数</text>
				<view class="landsearch-item-picker">
					<input type="number" v-model.number="landInfo.number" placeholder="请输入货物件数(PCS)">
				</view>
			</view>
			<view class="landsearch-item">
				<text class="landsearch-item-title"><text class="require">*</text>货物重量</text>
				<view class="landsearch-item-picker">
					<input type="digit" v-model.number="landInfo.weight" placeholder="请输入货物重量(KGS)">
				</view>
			</view>
			<view class="landsearch-item">
				<text class="landsearch-item-title"><text class="require">*</text>货物体积</text>
				<view class="landsearch-item-picker">
					<input type="digit" v-model.number="landInfo.volume" placeholder="请输入货物体积(CBM)">
				</view>
			</view>
			<view class="landsearch-item" style="display: flex">
				<button type="primary" class="search-btn" @click="goToLandListPage">查询</button>
				<button class="search-reset" @click="clearLandInfo">重置</button>
			</view>
		</view>
		<text class="landsearch-tips">*注：提货地与邮编至少要填写一项</text>
	</view>
</template>

<script>
	// 导入级联选择器插件
	import pickRegions from '@/components/pick-regions/pick-regions.vue'
	export default {
		data() {
			return {
				areaArray: [],
				areaCode: [],
				podLandData: [],
				zcode: '',
				defaultRegionCode: '110101',
				areaTip: this.$t('ltl.pickaddress'),
				landPodText: '',
				landPodTextId: '',
				landPodTextSelected: '',
				timer: null,
				landInfo: {
					number: '',
					weight: '',
					volume: ''
				}
			}
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('ltl.title')
			})
		},
		
		components: {
			pickRegions
		},
		
		computed: {
			regionName() {
				return this.areaArray.map(item => item.name).join('-')
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
			
			showLandPodData(e) {
				this.$refs[e].open()
				this.getLandPodData()
			},
			
			getLandInputPod() {
				clearInterval(this.timer)
				this.timer = setTimeout(() => {
					this.getLandPodData()
				}, 700)
			},
			
			selectLandPod(city, cityId) {
				this.$refs.showLeft.close()
				this.landPodTextSelected = city
				this.landPodTextId = cityId
				this.landPodText = ''
			},
			
			
			async getLandPodData() {
				const {data: res} = await uni.$http.post('Data/getPortCn', {
					SearchText: this.landPodText
				})
				if(res.code !== 200) return uni.$showMsg(res.info)
				this.podLandData = res.data.data
			},
			
			// 跳转查询页面
			goToLandListPage() {
				const {number, weight, volume} = this.landInfo
	
				if(!this.areaCode && !this.zcode) {
					uni.$showMsg('请输入提货地(目的地)或邮政编码')
				}else if(!this.landPodTextSelected) {
					uni.$showMsg('请输入港口')
				}else if(!number) {
					uni.$showMsg('请输入货物件数')
				}else if(!weight) {
					uni.$showMsg('请输入货物重量')
				}else if(!volume) {
					uni.$showMsg('请输入货物体积')
				}else {
					uni.navigateTo({
						url: '/pages/subPack/landList/landList?areaId=' + this.areaCode[2] + '&landPodTextId=' + this.landPodTextId + '&zcode=' + this.zcode + '&landInfo=' + JSON.stringify(this.landInfo)
					})
				}
			},
			
			clearLandInfo() {
				this.zcode = ''
				this.landInfo.number = ''
				this.landInfo.weight = ''
				this.landInfo.volume = ''
				this.landPodTextSelected = ''
				this.landPodTextId = ''
				this.areaArray = []
				this.areaCode = []
			}
		}
	}
</script>

<style lang="less" scoped>
.landsearch-inner {
	width: 100%;
	background: #fff;
	padding: 24rpx;
	font-size: 30rpx;
	box-sizing: border-box;
	
	.landsearch-item {
		// display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		
		text {
			white-space: nowrap;
			font-size: 26rpx;
			font-weight: 600;
		}
		
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
			background: #fff;
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
			margin-top: 10rpx;
			border-bottom: 1px solid #EBEEF5;
			padding: 10rpx 0 10rpx 0;
			box-sizing: border-box;
			
			.land-searchtip {
				color: #808080;
			}
		}
		
		.landsearch-item-unit {
			flex: 2;
			text-align: center;
			font-size: 28rpx;
		}
	}
}

.landsearch-tips {
	padding: 24rpx;
	box-sizing: border-box;
	font-size: 24rpx;
	color: #F56C6C;
}
</style>
