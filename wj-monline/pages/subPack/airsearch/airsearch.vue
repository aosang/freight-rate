<template>
	<view class="search">
		<view class="search-input">
			<view class="search-inner">
				<!-- 起运港 -->
				<view class="search-item">
					<text>起运机场</text>
					<view @click="showPolData('showLeft')" class="search-city">
						{{historyInfo.polCity === ''? '请选择起运机场' : historyInfo.polCity}}
					</view>
					<uni-drawer ref="showLeft" mode="left" :width="340">
						<input 
							class="search-port" 
							v-model="polText" 
							placeholder="请选择起运机场" 
							@input="getInputPol"
						/>
						<view class="city-box">
							<view v-if="polDataArr.length !== 0">
								<view
									@click="selectPol(pol.F_Code, pol.F_Id)" 
									class="city-item" 
									v-for="pol in polDataArr" 
									:key="pol.F_Id"
								>
									<text class="enName">{{pol.F_NameCN}}</text>
									<text class="chName">{{pol.F_Code}}</text>
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
				<!-- 目的国 -->
				<view class="search-item">
					<text>目的国家/地区</text>
					<view @click="showPodCountryData('showCountryRight')" class="search-city">
						{{countryInfo.countryText === ''? $t('pub.country') : countryInfo.countryText}}
					</view>
					<uni-drawer ref="showCountryRight" mode="right" :width="340">
						<input
							class="search-port" 
							v-model="podCountryText" 
							:placeholder="$t('pub.country')" 
							@input="getInputPodCountry"  
						>
						<scroll-view scroll-y="true" style="height: 1100rpx">
							<view class="city-box">
								<view v-if="podCountryData.length !== 0">
									<view 
										@click="selectPodCountry(pod.F_CountryEnglishName, pod.F_Id)" 
										class="city-item" 
										v-for="pod in podCountryData" 
										:key="pod.F_Id"
									>
										<text class="enName">{{pod.F_CountryEnglishName}}</text>
										<text class="chName">{{pod.F_CountryName}}</text>
									</view>
								</view>
								<!-- 没有数据 -->
								<view class="empty-city" v-else>
									<text class="iconfont icon-logistics-icon"></text>
									<text class="empty-text" style="text-align: center">暂无数据</text>
								</view>
							</view>
						</scroll-view>
					</uni-drawer>
				</view>
				<!-- 目的港 -->
				<view class="search-item">
					<text>目的机场</text>
					<view @click="showPodData('showRight')" class="search-city">
						{{historyInfo.podCity === ''?  '请选择目的机场' : historyInfo.podCity}}
					</view>
					<uni-drawer ref="showRight" mode="right" :width="340">
						<input
							class="search-port" 
							v-model="podText" 
							placeholder="请选择目的机场" 
							@input="getInputPod"  
						>
						<scroll-view scroll-y="true" style="height: 1100rpx">
							<view class="city-box">
								<view v-if="podDataArr.length !== 0">
									<view
										@click="selectPod(pod.F_Code, pod.F_Id)" 
										class="city-item" 
										v-for="pod in podDataArr" 
										:key="pod.F_Id"
									>
										<text class="enName">{{pod.F_NameCN}}</text>
										<text class="chName">{{pod.F_Code}}</text>
									</view>
								</view>
								<!-- 没有数据 -->
								<view class="empty-city" v-else>
									<text class="iconfont icon-logistics-icon"></text>
									<text class="empty-text" style="text-align: center">暂无数据</text>
								</view>
							</view>
						</scroll-view>
					</uni-drawer>
				</view>
			</view>
			<view style="display: flex;">
				<button type="primary" class="search-btn" @click="searchHandler">{{$t('search.btn')}}</button>
				<button class="search-reset" @click="clearSearch">{{$t('pub.reset')}}</button>
			</view>
		</view>
		<!-- 历史记录 -->
		<view class="search-list">
			<view class="list-title">
				<text class="list-title-text">{{$t('search.history')}}</text>
				<view class="list-title-clear" @click="clearHistory">
					{{$t('search.clear')}}
				</view>
			</view>
			<view class="list-box">
				<view class="list-item" 
					v-for="(h, index) in historyArr"
					:key="index"
					@click="getHistoryLclDetails(h.polCityId, h.podCityId)"
				>
					<view class="list-city">
						{{h.polCity}}--{{h.podCity}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				polText: '', //起运港字段
				podText: '', //目的港字段
				podCountryText: '', //国家
				polDataArr: [],
				podDataArr: [],
				podCountryData: [],
				timer: null,
				historyInfo: {
					polCity: '', //起运港
					podCity: '', //目的港
					polCityId: '', //起运港id
					podCityId: '' //目的港id
				},
				countryInfo: {
					countryText: '',
					countryId: '',
				},
				historyArr: [],
				newArr: []
			}
		},
		
		onLoad() {
			// 判断初始语言
			// this.applicationLocal = uni.getLocale()
			// uni.onLocaleChange(e => {
			// 	this.applicationLocal = e.locale
			// })
		},
		
		onShow() {
			// uni.setNavigationBarTitle({
			// 	title: this.$t('navigate.export')
			// })
			
			// 获取历史记录
			this.historyArr = JSON.parse(uni.getStorageSync('historyairexport') || '[]')
		},

		methods: {
			showPolData(e) {
				this.$refs[e].open()
				this.getPolCityData()
			},
			
			showPodCountryData(e) {
				this.$refs[e].open()
				this.getPodCountryData()
			},
			
			showPodData(e) {
				this.$refs[e].open()
				this.getPodCityData()
			},

			// 获取起运港数据
			async getPolCityData() {
				const {data: res} = await uni.$http.post('data/getAirport', {
					Type: 1,
					Flag: 1,
					SearchText: this.polText
				})
				if(res.code !== 200) return uni.$showMsg()
				this.polDataArr = res.data.data
			},
			
			// 获取国家
			async getPodCountryData() {
				const {data: res} = await uni.$http.post('data/getCountry', {
					SearchText: this.podCountryText
				})
				this.podCountryData = res.data
			},
			
			// 获取目的港数据
			async getPodCityData() {
				const {data: res} = await uni.$http.post('data/getAirport', {
					Type: 2,
					Flag: 1,
					SearchText: this.podText,
					CountryId: this.countryInfo.countryId
				})
				this.podDataArr = res.data.data
			},
			
			clearSearch() {
				this.historyInfo.podCity = ''
				this.historyInfo.podCityId = ''
				this.historyInfo.polCity = ''
				this.historyInfo.polCityId = ''
				this.countryInfo.countryId = ''
				this.countryInfo.countryText = ''
			},
			
			getInputPol() {
				clearInterval(this.timer)
				this.timer = setTimeout(() => {
					this.getPolCityData()
				}, 700)
			},
			
			getInputPod() {
				clearInterval(this.timer)
				this.timer = setTimeout(() => {
					this.getPodCityData()
				}, 700)
			},
			
			getInputPodCountry() {
				clearInterval(this.timer)
				this.timer = setTimeout(() => {
					this.getPodCountryData()
				}, 700)
			},
			
			// 获取选择的起运港和目的港
			selectPol(city, cityId) {
				this.$refs.showLeft.close()
				this.historyInfo.polCity = city
				this.historyInfo.polCityId = cityId
				this.polText = ''
			},
			
			selectPod(city, cityId) {
				this.$refs.showRight.close()
				this.historyInfo.podCity = city
				this.historyInfo.podCityId = cityId
				this.podText = ''
			},
			
			selectPodCountry(country, countryId) {
				this.$refs.showCountryRight.close()
				this.countryInfo.countryText = country
				this.countryInfo.countryId = countryId
				this.podCountryText = ''
				this.historyInfo.podCity = ''
			},
			
			// 查询
			searchHandler() {
				const {polCity, podCity} = this.historyInfo
				const {countryText, countryId} = this.countryInfo
				if (polCity !== '' && (podCity !== '' || countryText !== '')) {
					if(polCity !== '' && podCity !== '') {
						setTimeout(() => {
							this.historyArr.unshift(this.historyInfo)
							// 解决历史记录重复的问题
							const strings = this.historyArr.map(item => JSON.stringify(item))
							const removeDupList = Array.from(new Set(strings))
							const result = removeDupList.map(item => JSON.parse(item))
							
							// 存储历史记录
							uni.setStorageSync('historyairexport', JSON.stringify(result))
						})
					}
					uni.navigateTo({
						url: '/pages/subPack/airlist/airlist?portInfo=' + JSON.stringify(this.historyInfo) + '&countryInfo=' + JSON.stringify(this.countryInfo)
					}, 500)
				}else {
					if(polCity === '') {
						uni.$showMsg('请输入起运机场')
					}else if(podCity === '' && countryText === '') {
						uni.$showMsg('请输入目的机场国家/地区或目的机场')
					}
				}
			},
			
			// 历史记录跳转
			getHistoryLclDetails(polId, podId) {
				console.log(polId, podId)
				let portInfo = {
					polCityId: polId,
					podCityId: podId
				}
				uni.navigateTo({
					url: '/pages/subPack/airlist/airlist?portInfo=' + JSON.stringify(portInfo)
				})
			},

			// 清除历史记录
			clearHistory() {
				uni.showModal({
					title: this.$t('pub.notice'),
					content: this.$t('pub.deletehistory'),
					confirmText: this.$t('pub.confirmtext'),
					cancelText: this.$t('pub.canceltext'),
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('historyairexport')
							this.historyArr = []
						} else if (res.cancel) {
							return
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.search-input {
		height: 620rpx;
		padding: 30rpx 50rpx 0 50rpx;
		box-sizing: border-box;
		background: #fff;

		.search-inner {
			.search-item {
				// display: flex;
				align-items: center;
				margin-bottom: 30rpx;

				text {
					white-space: nowrap;
					margin-right: 20rpx;
					font-size: 26rpx;
					font-weight: 600;
				}
				
				.search-port {
					width: 100%;
					height: 88rpx;
					border-bottom: 1px solid rgba(64, 158, 255, 0.2);
					background: #f4f4f4;
					box-sizing: border-box;
					padding-left: 28rpx;
					font-size: 28rpx;
				}
				
				.search-city {
					width: 85%;
					height: 72rpx;
					margin-top: 10rpx;
					line-height: 72rpx;
					color: #555;
					border-bottom: 1px solid #eee;
					font-size: 30rpx;
					// padding: 0 0 0 24rpx;
					box-sizing: border-box;
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
						}
					}
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
		}
	}

	.search-list {
		width: 100%;
		margin-top: 30rpx;
		background: #fff;
		box-sizing: border-box;

		.list-title {
			display: flex;
			padding: 30rpx 50rpx;
			align-items: center;
			border-bottom: 1px solid #eee;
			font-size: 28rpx;

			.list-title-text {
				color: #000;
				font-weight: 550;
			}

			.list-title-clear {
				margin: 0 0 0 auto;
				color: #4ba4f8;
				font-weight: 550;
			}
		}

		.list-item {
			display: flex;
			align-items: center;
			padding: 30rpx 50rpx;
			font-size: 28rpx;

			.iconfont {
				margin: 0 0 0 auto;
				font-size: 48rpx;
				color: #9196a8;
			}
		}
	}
</style>