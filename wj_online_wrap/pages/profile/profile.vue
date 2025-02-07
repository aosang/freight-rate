<template>
	<view class="profile">
		<view class="profile-box">
			<button
				v-if="!userInfo"
				type="primary" 
				class="profile-btn"
				@click="getLoginUserInfo"
			>
				{{$t('pub.login')}}
			</button>
			<view class="profile-box-l" v-else>				
				<view class="profile-avatar">
					<image 
						src="@/static/images/avatar.jpg" 
						mode="widthFix" 
					>
					</image>
					<view class="profile-user">
						<text class="profile-name">
							{{username}}
							<text
								v-if="companyImage"
								@click="previewShowImage"
								class="profile-certificate iconfont icon-namecard-fill">
							</text>
						</text>
						<text class="profile-phone">{{useremail? useremail : '--'}}</text>
					</view>
				</view>
				<view class="profile-info" @click="goToSaveCard" v-if="userId == null">
					<text class="profile-info-text">{{$t('profile.card')}}</text>
					<text class="profile-info-word">{{$t('profile.share')}}</text>
					<text class="iconfont icon-arrow-right"></text>
				</view>
				<view class="profile-info" @click="goToSaveCard" v-else>
					<text class="profile-info-text">{{$t('my.card')}}</text>
					<text class="profile-info-word">{{$t('my.share')}}</text>
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
			<view class="profile-box-r"></view>
		</view>
		<!-- list -->
		<view class="profile-list">
			<!-- <view class="profile-item" @click="goToHistoryPage" v-if="userInfo !== null">
				<view class="iconfont icon-history" style="color: #32a6fd"></view>
				<text>{{$t('profile.price')}}</text>
				<text class="iconfont icon-arrow-right"></text>
			</view> -->
			
			<view class="profile-item">
				<view class="iconfont icon-history" style="color: #32a6fd"></view>
				<text style="text-decoration: none; width: 400rpx; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
					{{countryRegion? countryRegion : '--'}}
				</text>
			</view>
			
			<view class="profile-item">
				<view class="iconfont icon-language"></view>
				<picker 
					:range="langArr" 
					:range-key="'text'" 
					:value="langIndex" 
					@change="bindPickerChange($event, langArr)" 
					style="width: 100%;"
				>
					<text>{{langArr[langIndex].text}}</text>
				</picker>
				<text class="iconfont icon-arrow-right"></text>
			</view>
			
			<view class="profile-item" @click="openContactInfo">
				<view class="iconfont icon-listing-content-fill" style="color: #feae00;"></view>
				<text>{{$t('profile.contact')}}</text>
				<text class="iconfont icon-arrow-right"></text>
				<uni-popup ref="contactInfo" type="top" background-color="#fff">
					<view class="contact-box">
						<!-- <view class="contact-item">
							<text><text class="iconfont icon-bussiness-man-fill"></text>{{$t('profile.support')}}&nbsp;{{$t('profile.name')}}</text>
						</view> -->
						<view class="contact-item">
							<text><text class="iconfont icon-phone1"></text>{{$t('profile.phone')}}&nbsp;+86-532-68997888</text>
						</view>
						<view class="contact-item">
							<text><text class="iconfont icon-email-fill"></text>{{$t('profile.email')}}&nbsp;overseas@worldjaguar.com</text>
						</view>
						<!-- <view class="contact-item">
							<text><text class="iconfont icon-comments-fill"></text>{{$t('profile.qq')}}&nbsp;3001634218</text>
						</view> -->
					</view>
				</uni-popup>
			</view>
			
			<view class="profile-item" @click="clearLocalStorage">
				<view class="iconfont icon-color" style="color: #fb8382;"></view>
				<text>{{$t('pub.clearall')}}</text>
				<text class="iconfont icon-arrow-right"></text>
			</view>
			
			<view class="profile-item" @click="goToAgreement">
				<view class="iconfont icon-rejected-order" style="color: #18c585"></view>
				<text>{{$t('profile.text')}}</text>
				<text class="iconfont icon-arrow-right"></text>
			</view>
			
			<view class="profile-item">
				<view class="iconfont icon-set" style="color: #9d7afa"></view>
				<text>{{$t('profile.version')}}</text>
				<text style="margin: 0 0 0 auto">1.0.69</text>
			</view>
			
			<view class="profile-item" @click="logOutSystem">
				<view class="iconfont icon-Rightbutton" style="color: #feae00"></view>
				<text>{{$t('profile.login')}}</text>
			</view>
			
			<view class="profile-item">
				<view class="iconfont icon-namecard" style="color: #32a6fd"></view>
				<text>{{$t('profile.registered')}}</text>
				<text 
					style="margin: 0 0 0 auto; text-decoration: none;" 
					@click="goToCertificate">
					鲁ICP备11007633号-2
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				useremail: '',
				userInfo: null,
				langArr: [{text: '简体中文', code: 'zh-Hans'}, {text: 'English', code: 'en'}],
				langIndex: 0,
				applicationLocal: '',
				userId: '',
				companyImage: '',
				companyImageArr: '',
				countryRegion: ''
			}
		},
		
		onLoad() {	
			// 判断初始语言
			this.applicationLocal = 'en'
			uni.onLocaleChange(e => {
				this.applicationLocal = 'en'
			})
		},
		
		onShow() {
			uni.setTabBarItem({
				index: 0,
				pagePath: 'pages/home/home',
				iconPath: "static/images/tabBar/home.png",
				selectedIconPath: "static/images/tabBar/home_o.png",
				text: this.$t('tabbar.home')
			})
			
			uni.setTabBarItem({
				index: 1,
				pagePath: "pages/profile/profile",
				iconPath:  "static/images/tabBar/profile.png",
				selectedIconPath: "static/images/tabBar/profile_o.png",
				text: this.$t('tabbar.profile')
			})
			
			uni.setNavigationBarTitle({
				title: this.$t('navigate.profile')
			})
			
			uni.getStorageSync('loginInfo')? this.userInfo = uni.getStorageSync('loginInfo') : this.userInfo = null
			if(this.userInfo) {
				console.log(this.userInfo)
				this.username = this.userInfo.F_CompanyName
				this.useremail = this.userInfo.F_Email
				this.userId = this.userInfo.F_UserId
				this.companyImage = this.userInfo.F_FilePath? this.userInfo.F_FilePath : ''
				this.companyImageArr = new Array(this.companyImage)
				this.countryRegion = this.userInfo.F_CountryEnglishName
			}
		},
		
		methods: {
			getLoginUserInfo() {
				uni.navigateTo({
					url: '/pages/login/login',
				})
			},
			
			goToHistoryPage() {
				uni.navigateTo({
					url: '/pages/subPack/historyprice/historyprice'
				})
			},
			
			goToAgreement() {
				if(this.applicationLocal == 'zh-Hans') {
					uni.navigateTo({
						url: '/pages/subPack/agreement/agreement'
					})
				}else {
					uni.navigateTo({
						url: '/pages/subPack/agreement/agreementen'
					})
				}
			},
			
			goToCertificate() {
				window.open('https://beian.miit.gov.cn/#/home')
			},
			
			goToSaveCard() {
				uni.navigateTo({
					url: '/pages/subPack/savecard/savecard'
				})
			},
			
			bindPickerChange(e, name) {
				this.langIndex = e.detail.value
				let langCode = name[this.langIndex].code
				
				// 设置语言
				uni.setLocale(langCode)
				this.$i18n.locale = langCode
				
				uni.switchTab({
					url: '/pages/home/home'
				})
			},
			
			// 退出登录
			logOutSystem() {
				uni.removeStorageSync('loginInfo')
				uni.redirectTo({
					url: '/pages/login/login'
				})
			},
			
			// 清除缓存
			clearLocalStorage() {
				let storangeInfo = uni.getStorageInfoSync()
				let size = storangeInfo.currentSize
				uni.showLoading({
					title: this.$t('pub.clearall')
				})
				uni.clearStorageSync()
				uni.hideLoading()
				
				uni.showToast({
					title: this.$t('pub.computedsuccess'),
					duration: 1500,
					icon: 'success',
					success: () => {
						uni.redirectTo({
							url: "/pages/login/login"
						})
					}
				})
			},
			
			openContactInfo() {
				this.$refs.contactInfo.open('top')
			},
			
			goToEditInfo() {
				uni.navigateTo({
					url: "/pages/subPack/editinfo/editinfo"
				})
			},
			
			// 营业执照预览
			previewShowImage() {
				uni.previewImage({
					urls: this.companyImageArr
				})
			}
			
			// reload() {
			// 	const pages = getCurrentPages()
			// 	const curPage = pages[pages.length - 1]
				
			// 	curPage.onLoad(curPage.options)
			// 	curPage.onShow()
			// 	curPage.onReady()
			// }
		}
	}
</script>

<style scoped lang="less">
.profile-box {
	position: relative;
	display: flex;
	width: 100%;
	height: 320rpx;
	background: #fff;
	padding: 30rpx;
	box-sizing: border-box;
	
	.profile-btn {
		width: 240rpx;
		height: 72rpx;
		margin-top: 80rpx;
		font-size: 28rpx;
	}
	
	.profile-box-l {
		display: flex;
		
		.profile-avatar {
			display: flex;
			
			image {
				width: 164rpx;
				height: 164rpx;
				border-radius: 100%;
				border: 1px solid rgba(7, 49, 144, 0.35);
			}
			
			.profile-user {
				display: flex;
				flex-direction: column;
				margin-left: 24rpx;
				
				.profile-name {
					margin: 16rpx 0 0 0;
					font-size: 40rpx;
					font-weight: 550;
					color: #000;
				
					.profile-certificate {
						vertical-align: middle;
						margin-left: 6rpx; 
						font-size: 46rpx; 
						color: #67C23A;
					}
				}
				.profile-phone {
					margin-top: 2rpx;
					font-size: 24rpx;
				}
			}
		}
	}
	
	.profile-info {
		display: flex;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 700rpx;
		height: 88rpx;
		background: #303744;
		transform: translateX(-50%);
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		color: #dddddc;
		
		.profile-info-text {
			font-size: 30rpx;
			color: #f8d98e;
			margin-left: 30rpx;
		}
		
		.profile-info-word {
			margin-left: 10rpx;
			font-size: 26rpx;
		}
		
		.iconfont {
			margin: 0 30rpx 0 auto;
		}
	}
}

.profile-list {
	width: 100%;
	background: #fff;
	padding: 30rpx;
	box-sizing: border-box;
	
	.profile-item {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		font-weight: 500;
		color: #555;
		padding: 30rpx 0;
		border-bottom: 1px solid #eee;
		
		.iconfont {
			margin-right: 10rpx;
			font-size: 48rpx;
			vertical-align: middle;
		}
		
		.contact-box {
			padding: 24rpx;
			.contact-item {
				margin-bottom: 24rpx;
				font-size: 28rpx;
				color: #303744;
			}
		}
		
		.icon-history, .icon-language, .icon-rejected-order, .icon-color, .icon-set, .icon-namecard, .icon-listing-content-fill .icon-map {
			font-size: 44rpx;
			margin-right: 20rpx;
		}
		
		.icon-arrow-right {
			margin: 0 0 0 auto;
		}
	}
}
</style>
