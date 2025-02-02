<template>
	<view class="myTab">
		<!-- <view class="myTab-title">
			<text v-for="tab in tabArr" :key="tab.id" @click="changeTab(tab.id)"
				:class="active === tab.id? 'active': ''">
				{{tab.name}}
			</text>
		</view> -->
		
		<view class="tab-ocean">
			<view style="display: flex; margin-bottom: 20rpx">
				<view class="tabpub-title">空运费用</view>
				<view class="tabpub-title" style="margin: 0 0 0 auto">币种：{{lclInfo.F_Currency? lclInfo.F_Currency : '-'}}</view>
			</view>
			<uni-table border stripe>
				<uni-tr>
					<uni-th 
						v-for="th in fields" :key="th.label" style="white-space: nowrap">
							{{th.label}}
					</uni-th>
				</uni-tr>
				<uni-tr v-for="(td, index) in range" :key='index'>
					<uni-td v-for="(val, key) in td" :key="key">{{val}}</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<view class="public-mark" v-show="lclInfo.F_BookingRemarks">
			订舱备注：{{lclInfo.F_BookingRemarks}}
		</view>
		<view class="public-mark" v-show="lclInfo.F_ExpenseNote">
			费用备注：{{lclInfo.F_ExpenseNote}}
		</view>
		
		<!-- 起运港费用 -->
		<view class="tab-ocean">
			<view class="tabpub-title">起运机场费用：</view>
			<view class="oceanfee-item" v-for="pol in polFee" :key="pol.F_Id">
				<view class="ocean-inner">
					<text class="oceanfee-name">{{pol.F_ExpenseCodeName + ' ' + pol.F_ExpenseCodeEng}}</text>
					<text class="oceanfee-num" v-if="pol.F_UnitPrice">
						{{pol.F_Currency? pol.F_Currency : ''}} {{pol.F_UnitPrice? pol.F_UnitPrice : ''}}{{ pol.F_Unit? '/' + pol.F_Unit : ''}}
					</text>
					<text v-else>--</text>
				</view>
				<view class="oceanfee-mark" v-if="pol.F_MiniCharge || pol.F_MaxCharge">
					<text>{{$t('pub.min')}} {{pol.F_MiniCharge? pol.F_MiniCharge : '--'}}</text>
					<text>{{$t('pub.max')}} {{pol.F_MaxCharge? pol.F_MaxCharge : '--'}}</text>
				</view>
				<view class="oceanfee-mark" v-if="pol.F_IntervalMinPrice || pol.F_IntervalMaxPrice ">
					<text>密度区间范围：{{pol.F_IntervalMinPrice? pol.F_IntervalMinPrice + '≤' : ''}}1CBM{{pol.F_IntervalMaxPrice? '＜' + pol.F_IntervalMaxPrice : '' }}</text>
				</view>
				<view class="oceanfee-mark" v-if="pol.F_ExpensesDescription">
					<text>{{pol.F_ExpensesDescription}}</text>
				</view>
			</view>
		</view>
		<view class="public-mark" v-if="lclInfo.FromDesc">
			{{$t('pub.polRemark')}}：{{lclInfo.FromDesc}}
		</view>
		
		<!-- 目的港费用 -->
		<view class="tab-ocean">
			<view class="tabpub-title">目的机场费用：</view>
			<view class="oceanfee-item" v-for="pod in podFee" :key="pod.F_id">
				<view class="ocean-inner">
					<text class="oceanfee-name">
						{{pod.F_ExpenseCodeName + ' ' + pod.F_ExpenseCodeEng }}
					</text>
					<text class="oceanfee-num">
						{{pod.F_Currency? pod.F_Currency : ''}} {{pod.F_UnitPrice? pod.F_UnitPrice : ''}}{{ pod.F_Unit? '/' + pod.F_Unit : ''}}
					</text>
				</view>
				<view class="oceanfee-mark" v-if="pod.F_MiniCharge || pod.F_MaxCharge ">
					<text>{{$t('pub.min')}} {{pod.F_MiniCharge? pod.F_MiniCharge : '--'}}</text>
					<text>{{$t('pub.max')}} {{pod.F_MaxCharge? pod.F_MaxCharge : '--'}}</text>
				</view>
				<view class="oceanfee-mark" v-if="pod.F_IntervalMinPrice || pod.F_IntervalMaxPrice ">
					<text>密度区间范围：{{pod.F_IntervalMinPrice? pod.F_IntervalMinPrice + '≤' : ''}}1CBM{{pod.F_IntervalMaxPrice? '＜' + pod.F_IntervalMaxPrice : '' }}</text>
				</view>
				<view class="oceanfee-mark" v-if="pod.F_Description">
					<view class="oceanfee-mark-word">
						{{pod.F_Description}}
					</view>
				</view>
			</view>
		</view>
		<view class="public-mark" v-if="lclInfo.ToDesc">
			{{$t('pub.podRemark')}}：{{lclInfo.ToDesc}}
		</view>
		<!-- <view v-show="active === 0">
			
		</view> -->
	</view>
</template>

<script>
	import {isLoginMethod} from '@/utils/isLogin.js'
	export default {
		name: "my-tabbar",
		props: ['lclInfo', 'polFee', 'podFee'],		
		data() {
			return {
				fields: [],
				range: [],
				active: 0,
				index: 0,
				currencyIndex: 0,
				unitIndex: 0,
				type: 1,
				feeType: '',
				unitArr: [],
				isComputed: false,
				tabArr: [{
					id: 0, 
					name: this.$t('lcldetail.charge')
				}, {
					id: 1, 
					name: this.$t('lcldetail.edit')
				}],
				packageArr: ['CTN(S)', 'PLT(S)'],
				packageInfo: {
					number: '', 
					weight: '',  
					volume: '',
				},
				freightRemark: '',
				polRemark: '',
				podRemark: '',
				freightTotal: '', //海运费总计
				polTotal: '', //起运港费用
				podTotal: '', //目的港费用
				subTitle: '',
				typeTotal: '',
				convertTotal: '',
				polMiniCharge: '',
			}
		},
		
		mounted() {
			setTimeout(() => {
				this.fields = this._props.lclInfo.Fields
				this.fields = this.fields.filter(item => item.label !== '币种' && item.props !== 'F_Currency')
				
				this.range = this._props.lclInfo.RangeList
				this.range.forEach(item => {
					delete item.F_Currency
				})
			}, 600)
		},
		
		methods: {
		
		}
	}
</script>

<style scoped lang="less">
	.myTab {
		width: 100%;
		margin-top: 20rpx;
		
		.lcldetails-bottom {
			display: flex;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 88rpx;
			background: #fff;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			z-index: 3;
			border-top: 1px solid #eee;
		
			.bottom-item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
		
				.iconfont {
					color: #999;
					font-size: 56rpx;
					padding: 0;
				}
		
				.bottom-text {
					font-size: 28rpx;
					color: #999;
				}
			}
		}

		.myTab-title {
			display: flex;
			background: #dfe6e9;
			border-radius: 20rpx;
			align-items: center;
			padding: 0 24rpx;
			box-sizing: border-box;

			text {
				flex: 1;
				text-align: center;
				font-size: 26rpx;
				padding: 10rpx 0;
				color: #8a8e9d;
			}

			.active {
				font-weight: 550;
				color: #48a1f7;
				background: #fff;
				margin: 16rpx;
				border-radius: 30rpx;
			}
		}

		.tab-ocean {
			background: #fff;
			padding: 24rpx;
			margin-top: 20rpx;

			.tabpub-title {
				color: #000;
				font-weight: 550;
				font-size: 28rpx;
			}

			.ocean-table {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 20rpx;
				justify-content: space-around;

				.ocean-item {
					width: 47%;
					height: 72rpx;
					line-height: 72rpx;
					font-size: 28rpx;
					color: #444754;
					border: 1px solid #eee;
					padding: 0 0 0 16rpx;
				}
			}

			.ocean-mark {
				margin-top: 20rpx;

				.ocean-mark-title {
					display: flex;
					align-items: center;

					.iconfont {
						font-size: 40rpx;
						margin-right: 4rpx;
					}

					.mark-text {
						font-size: 26rpx;
					}
				}

				.mark-word {
					margin-top: 10rpx;
					font-size: 26rpx;
					color: #616577;
					line-height: 40rpx;
				}
			}

			.oceanfee-item {
				margin-top: 28rpx;
				border-bottom: 1px solid #eee;
				padding: 0 0 28rpx 0;

				.ocean-inner {
					font-size: 26rpx;

					.oceanfee-name {
						display: block;
						color: #737687;
					}

					.oceanfee-num {
						color: #000;
						font-weight: 550;
					}
				}

				.oceanfee-mark {
					margin-top: 10rpx;
					padding: 16rpx 12px;
					color: #616577;
					font-size: 26rpx;
					background: #eee;
					border-radius: 12rpx;

					text {
						margin-right: 24rpx;
						line-height: 40rpx;
					}
				}
			}
		}
		
		.ocean-computed {
			width: 100%;
			background: #fff;
			margin-top: 20rpx;
			padding: 30rpx;
			box-sizing: border-box;
			
			.ocean-rquired {
				font-size: 26rpx;
				color: #e43d33;
			}
			
			.ocean-computed-box {
				display: flex;
				align-items: center;
				background: #dfe6e9;
				border-radius: 20rpx;
				margin-top: 20rpx;
				
				.computed-item {
					flex: 1;
					height: 120rpx;
					display: flex;
					flex-direction: column;
					font-size: 26rpx;
					text-align: center;
					justify-content: center;
				}
			}
		}
		
		.computed-sea {
			width: 100%;
			background: #fff;
			padding: 30rpx;
			margin-top: 20rpx;
			font-size: 28rpx;
			box-sizing: border-box;
			
			.pub-top {
				position: relative;
				padding: 0 0 30rpx 0;
				color: #000;
				font-weight: 550;
				border-bottom: 1px solid #eee;
				
				.addFeeBtn {
					position: absolute;
					top: 0;
					right: 10rpx;
					text-decoration: underline;
					color: #2979ff;
					font-size: 26rpx;
				}
				
				.computed-price {
					margin: 20rpx 20rpx 0 0;
					color: #f53;
					font-size: 28rpx;
					font-weight: 500;
				}
			}
			
			.pub-item {
				position: relative;
				padding: 20rpx 0;
				border-bottom: 1px solid #eee;
				font-size: 28rpx;
				
				.pub-item-title {
					max-width: 660rpx;
					word-break: break-word;
				}
				
				.pub-result {
					margin-top: 10rpx;
					color: #4191df;
				}
				
				.pub-edit {
					position: absolute;
					right: 30rpx;
					top: 30rpx;
					color: #4191df;
					text-decoration: underline;
				}
				
				.pub-btn {
					position: absolute;
					top: 24rpx;
					right: 10rpx;
					display: flex;
					.iconfont {
						color: #e43d33;
						font-size: 44rpx;
						margin-left: 20rpx;
					}
				}
			}
			.pub-mask {
				padding: 10rpx 0;
				color: #8a8e9d;
				line-height: 40rpx;
			}
		}
	}
	
	.pub-tips {
		margin-top: 20rpx;
		padding: 0 24rpx;
		font-size: 26rpx;
		color: #a4a4a4;
	}
	
	.add-box {
		width: 600rpx;
		background: #fff;
		box-sizing: border-box;
		padding: 30rpx;
		border-radius: 10rpx;
		
		.add-item {
			margin-bottom: 24rpx;
			
			.add-select {
				display: flex;
				width: 100%;
				height: 72rpx;
				border: 1px solid #dcdfe6;
				border-radius: 10rpx;
				box-sizing: border-box;
				padding-left: 20rpx;
				line-height: 68rpx;
				color: #000;
				
				.iconfont {
					margin: 0 20rpx 0 auto;
				}
			}
		}
		
		.add-btn {
			width: 60%;
			display: flex;
			overflow: inherit;
			margin: 50rpx auto 0 auto;
		}
	}
	
	.change-box {
		width: 600rpx;
		background: #fff;
		padding: 30rpx;
		border-radius: 10rpx;
		
		.change-item {
			margin-bottom: 24rpx;
			
			.change-number {
				width: 100%;
				height: 72rpx;
				border: 1px solid #dcdfe6;
				border-radius: 10rpx;
				line-height: 72rpx;
				padding-left: 24rpx;
				box-sizing: border-box;
			}
		}
		
		.change-btn {
			width: 60%;
			display: flex;
			overflow: inherit;
			margin: 50rpx auto 0 auto;
		}
	}
	
	.editAddComputed {
		width: 640rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 28rpx;
		
		.custom-top {
			position: relative;
			background: #fff;
			color: #000;
			border-bottom: 1px solid #eee;
			
			.closeBtn {
				position: absolute;
				top: 0;
				right: 4rpx;
				font-size: 44rpx;
			}
			
			.custom-top-title {
				font-size: 28rpx;
				font-weight: 550;
			}
			
			.custom-top-subtitle {
				font-size: 26rpx;
				margin-top: 10rpx;
			}
			
			.custom-top-scope {
				font-size: 26rpx;
				color: #566090;
				font-weight: 550;
				margin: 10rpx 0 20rpx 0;
				
				text {
					margin-right: 30rpx;
				}
			}
		}
		
		.custom-input {
			width: 100%;
			background: #fff;
			box-sizing: border-box;
			margin-top: 20rpx;
			
			.custom-btn {
				height: 84rpx;
				line-height: 84rpx;
				margin-top: 32rpx;
				background: #48a1f7;
				font-size: 30rpx;
			}
			
			.custom-item {
				position: relative;
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;

				.pickekstyle {
					position: relative;
					width: 76.5%;
					height: 72rpx;
					border: 1px solid #f2f2f2;
					box-sizing: border-box;
					line-height: 72rpx;
				}
				
				.iconAdd {
					position: absolute;
					top: 58rpx;
					right: 20rpx;
				}
				
				.custom-picker {
					display: flex;
					align-items: center;
					font-size: 28rpx;
					color: #555;
				}
				
				input {
					height: 68rpx;
					margin-left: 20rpx;
					font-size: 28rpx;
					border-bottom: 1px solid #f2f2f2;
					padding-left: 20rpx;
				}
				
				text {
					font-size: 26rpx;
					font-weight: 550;
					margin-right: 20rpx;
				}
			}
			
			.fee-item {
				display: block;
				margin-bottom: 20rpx;
				
				input {
					border: 1px solid #f2f2f2;
					margin-left: 0;
					padding-left: 20rpx;
					font-size: 28rpx;
					height: 64rpx;
				}
			}
			
			.mark-item {
				text {
					display: block;
					font-size: 26rpx;
					font-weight: 500;
					margin: 0 0 20rpx 0;
				}
				
				textarea {
					width: 100%;
					height: 120rpx;
					border: 1px solid #eee;
					box-sizing: border-box;
					padding: 10rpx 0 0 20rpx;
					font-size: 28rpx;
				}
			}
		}
	}
	
	.public-mark {
		width: 100%;
		padding: 4rpx 24rpx 24rpx 24rpx;
		font-size: 26rpx;
		background: #fff;
		color: #737687;
		box-sizing: border-box;
	}
	
	button::after {
		border: none;
	}

</style>
