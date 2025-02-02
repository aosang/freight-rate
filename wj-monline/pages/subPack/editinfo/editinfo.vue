<template>
	<view class="login-form">
		<view class="form-item">
			<text class="form-name">{{$t('edit.name')}}<text class="form-required">*</text></text>
			<input type="text" :placeholder="$t('edit.Tipname')" v-model="editFormInfo.nickname">
		</view>
		<view class="form-item">
			<text class="form-name">{{$t('edit.phone')}}<text class="form-required">*</text></text>
			<input type="number" disabled="true" :placeholder="$t('edit.TipMobile')" v-model="editFormInfo.mobilePhone">
			<button 
				class="form-mobile" type="primary" 
				size="mini" @getphonenumber="wxGetPhoneNumber"
				open-type="getPhoneNumber"
			>
				{{$t('edit.mobile')}}
			</button>
		</view>
		<view class="form-btn">
			<button type="primary" class="login-confirm" @click="confirmEditInfoData">{{$t('edit.confirm')}}</button>
			<button type="default" class="login-cancel" @click="cancelEdit">{{$t('edit.cancel')}}</button>
		</view>
	</view>
</template>

<script>
	import {isLoginMethod} from '@/utils/isLogin.js'
	export default {
		data() {
			return {
				editFormInfo: {
					nickname: '',
					mobilePhone: ''
				}
			}
		},
		
		onLoad() {
			// 判断初始语言
			this.applicationLocal = uni.getLocale()
			uni.onLocaleChange(e => {
				this.applicationLocal = e.locale
			})
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('navigate.edit')
			})
		},
		
		methods: {
			async confirmEditInfoData() {
				if(this.editFormInfo.nickname.trim() === '' || this.editFormInfo.mobilePhone.trim() === '') {
					uni.$showMsg(this.$t('eidt.validate'))
				}else {
					const {data: res} = await uni.$http.post('user/update', {
						F_NameCn: this.editFormInfo.nickname,
						F_Mobile: this.editFormInfo.mobilePhone
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
						uni.setStorageSync('loginInfo', res.data)
						uni.$showMsg(this.$t('edit.fail'))
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/profile/profile'
							})
						}, 500)
					}
				}
			},
			
			// 获取手机号
			async wxGetPhoneNumber(e) {
				if (e.detail.errMsg !== 'getPhoneNumber:ok') {
					return uni.$showMsg(this.$t('edit.cancel'))
				} else {
					const {data: res} = await uni.$http.post('wxapp/getphone', {
						Code: e.detail.code
					})
					if (res.code !== 200) return uni.$showMsg(this.$t('edit.numberfail'))
					this.editFormInfo.mobilePhone = res.data.phone_info.purePhoneNumber
				}
			},
			
			cancelEdit() {
				uni.switchTab({
					url: '/pages/profile/profile'
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.login-form {
		margin-top: 2rpx;
		padding: 36rpx;
		background: #fff;

		.form-item {
			display: flex;
			align-items: center;

			.form-name {
				margin-right: 30rpx;
				color: #000;
				font-weight: 500;
				font-size: 28rpx;
				white-space: nowrap;

				.form-required {
					color: #ff233d;
				}
			}

			.form-mobile {
				display: block;
				background: #00a4ff;
				width: 250rpx;
				font-size: 24rpx;
				white-space: nowrap;
				margin: 0 0 0 auto;
			}

			input {
				height: 92rpx;
				border-bottom: 1px solid #eee;
				font-size: 30rpx;
			}
		}

		.form-btn {
			margin-top: 40rpx;
			padding-bottom: 40rpx;

			button {
				margin-bottom: 30rpx;
				font-size: 32rpx;
			}

			.login-confirm {
				background: #00a4ff;
			}
		}
	}
</style>