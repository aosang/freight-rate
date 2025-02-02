<script>
	export default {
		data() {
			return {
				code: '',
				scene: ''
			}
		},

		onLaunch() {
			this.autoUpdate()
		},
		
		methods: {
			autoUpdate() {
				if (uni.canIUse('getUpdateManager')) {
					const updateManager = uni.getUpdateManager()
					updateManager.onCheckForUpdate(res => {
						if (res.hasUpdate) {
							// 小程序有新版本，则静默下载，做好更新准备
							updateManager.onUpdateReady(() => {
								uni.showModal({
									title: this.$t('pub.updatetext'),
									content: this.$t('pub.update'),
									success: (res) => {
										if (res.confirm) {
											updateManager.applyUpdate()
										} else if (res.cancel) {
											uni.showModal({
												title: this.$t('pub.updatetext'),
												content: this.$t('pub.update'),
												showCancel: false,
												success: (res) => {
													if (res.confirm) {
														updateManager.applyUpdate()
													} else if (res.cancel) {
														autoUpdate()
													}
												}
											})
										}
									}
								})
							})
							updateManager.onUpdateFailed(() => {
								uni.showModal({
									title: this.$t('pub.updatetext'),
									content: this.$t('pub.updatefailtext')
								})
							})
						}
					})
				} else {
					// 提示用户在最新版本的客户端上体验
					uni.showModal({
						title: this.$t('pub.updatetext'),
						content: this.$t('pub.weixin')
					})
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("./static/css/iconfont.css");
	@import url("./static/css/common.css");

	body {
		background: #eff3f6;
	}

	image {
		display: block;
		border: none;
	}
</style>