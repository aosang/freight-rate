<template>
	<view class="container">
		<view class="pub-mask" v-show="showMask">
			<view class="pub-mask-box">
				<img src="../../static/images/loading.gif" alt="">
				<text>报价图片生成中...</text>
			</view>
		</view>
		<view v-if="imageUrl">
			<image style="width: 100%;" :src="imageUrl" mode="widthFix"></image>
		</view>
		<view class="savebox" id="shareContent" v-else>
			<view class="savebox-top">
				<view class="savebox-image">
					<view class="savebox-image-bg">
						<img src="../../static/images/logo.jpg" alt="logo">
					</view>
				</view>
				<view class="savebox-ship">船公司：{{dataInfo.F_ShoppingCompany}}</view>
				<view class="savebox-port">
					<view class="savebox-port-item">
						<text>{{dataInfo.FromPortEnglish}}</text>
						<text>{{dataInfo.FromPortName}}</text>
					</view>
					<view class="savebox-port-item">
						<a>→→→→</a>
					</view>
					<view class="savebox-port-item">
						<text>{{dataInfo.ToPortEnglish}}</text>
						<text>{{dataInfo.ToPortName}}</text>
					</view>
				</view>
				<view class="savebox-label">
					<view class="savebox-label-text">{{dataInfo.F_SpellState == 1? '直拼' : '转拼'}}</view>
					<view class="savebox-label-text">航程{{dataInfo.F_Voyage? dataInfo.F_Voyage : '-' }}天</view>
					<view class="savebox-label-text" v-if="dataInfo.TransitPortEnglish">中转港：{{dataInfo.TransitPortEnglish}}</view>
				</view>
			</view>
		
			<view class="savebox-info">
				<view class="savebox-info-text">货物信息：{{dataInfo.F_PCSQuantity}}{{priceType == 1? (dataInfo.F_PCSUnit == 1? 'CTN(S)' : 'PLT(S)') : 'PKG(S)'}}/{{dataInfo.F_GrossWeight}}KGS/{{dataInfo.F_Volume}}CBM</view>
				<view class="savebox-info-text">班期：{{dataInfo.F_ShiftPeriod? dataInfo.F_ShiftPeriod : '-' }}</view>
				<view class="savebox-info-text" v-if="priceType == 2">截关时间：{{dataInfo.F_CutoffPeriod? dataInfo.F_CutoffPeriod : '-'}}</view>
				<view class="savebox-info-text" v-if="priceType == 1">截单时间：{{dataInfo.F_CutoffTime? dataInfo.F_CutoffTime : '-'}}</view>
				<view class="savebox-info-text" v-if="priceType == 1">截货时间：{{dataInfo.F_CutoffGoodsTime? dataInfo.F_CutoffGoodsTime : '-'}}</view>
				<view class="savebox-info-text">接货仓库：{{dataInfo.F_WarehouseName? dataInfo.F_WarehouseName : '-' }}</view>
				<view class="savebox-info-text">仓库地址：{{dataInfo.F_Address? dataInfo.F_Address : '-'}}</view>
				<view class="savebox-info-text">报价公司：{{userInfo.CompanyName? userInfo.CompanyName : '-'}}</view>
				<view class="savebox-info-text">报价编号：{{dateNumber}}</view>
				<view class="savebox-info-text">联系人：{{userInfo.F_RealName? userInfo.F_RealName : '-'}}</view>
				<view class="savebox-info-text">电话：{{userInfo.F_Telephone? userInfo.F_Telephone : '-'}}</view>
				<view class="savebox-info-text">邮箱：{{userInfo.F_Email? userInfo.F_Email : '-' }}</view>
				<view class="savebox-info-text">有效期：{{dataInfo.F_StartTime}} 至 {{dataInfo.F_EndTime}}</view>
				<view class="savebox-type">{{dataInfo.ConsigneeTypeName? dataInfo.ConsigneeTypeName : '-'}}</view>
			</view>
		
			<view class="savebox-price">
				<view class="savebox-price-item">
					<view class="savebox-public">
						<view class="savebox-title">海运费及附加费</view>
						<p class="savebox-total">合计：{{dataInfo.FreightTotal? dataInfo.FreightTotal : '-'}}</p>
					</view>
					<ul>
						<li v-for="item in freightArr" :key="item.F_Id">
							<text>{{item.F_ExpenseCode}}</text>
							<p v-if="item.F_QuotedPrice && item.F_QuotedPrice !== 'CASE BY CASE'">
								{{Number(item.F_QuotedPrice)<0? '(' + Number(item.F_QuotedPrice) * -1 +')' : item.F_QuotedPrice}}{{item.F_Currency}}*{{Number(item.F_Quantity)}}{{item.F_Unit}} = {{Number(item.F_QuotedAmount)<0? '(' + Number(item.F_QuotedAmount) * -1 +')' : Number(item.F_QuotedAmount)}}{{item.F_Currency}}
							</p>
							<p v-else-if="item.F_QuotedPrice == 0">0</p>
							<p v-else>CASE BY CASE</p>
							<p class="feeRemark" v-if="item.F_Remark">备注：{{item.F_Remark}}</p>
						</li>
					</ul>
					<view class="savebox-remark" v-if="dataInfo.F_FreightRemark">
						备注：{{dataInfo.F_FreightRemark}}
					</view>
				</view>
		
				<view class="savebox-price-item">
					<view class="savebox-public">
						<view class="savebox-title">起运港费</view>
						<p class="savebox-total">合计：{{dataInfo.FromTotal}}</p>
						<p v-if="priceType == 2" class="savebox-total">折算：{{dataInfo.UsdTotal? dataInfo.UsdTotal : '-' }}</p>
					</view>
					<ul>
						<li v-for="item in polArr" :key="item.F_Id">
							<text>{{item.F_ExpenseCode}}</text>
							<p v-if="item.F_QuotedPrice && item.F_QuotedPrice !== 0">
								{{item.F_QuotedPrice}}{{item.F_Currency}}*{{item.F_Quantity + '(' + item.F_Unit + ')'}} = {{item.F_QuotedAmount}}{{item.F_Currency}}
							</p>
							<p v-else-if="item.F_QuotedPrice == 0"></p>
							<p v-else>CASE BY CASE</p>
							<p class="feeRemark" v-if="item.F_Remark">备注：{{item.F_Remark}}</p>
						</li>
					</ul>
					<view class="savebox-remark" v-if="dataInfo.FromDesc">
						备注：{{dataInfo.FromDesc}}
					</view>
				</view>
				<view class="savebox-price-item">
					<view class="savebox-public">
						<view class="savebox-title">目的港费</view>
						<p class="savebox-total">合计：{{dataInfo.ToTotal}}</p>
						<p v-if="priceType == 1" class="savebox-total">折算：{{dataInfo.UsdTotal? dataInfo.UsdTotal : '-'}}</p>
						<p v-if="priceType == 2" class="savebox-total">类型合计：{{dataInfo.ToTypeTotal}}</p>
					</view>
					<ul>
						<li v-for="item in podArr" ::key="item.F_Id">
							<text>{{item.F_ExpenseCode}}</text>
							<p v-if="priceType == 2" style="font-size: 0.13rem">费用类型：{{item.ExpenseTypeName? item.ExpenseTypeName : '-'}}</p>
							<p v-if="item.F_QuotedPrice">
								{{item.F_QuotedPrice}}{{item.F_Currency}}*{{item.F_Quantity + '(' + item.F_Unit + ')'}} = {{item.F_QuotedAmount}}{{item.F_Currency}}
							</p>
							<p v-else-if="item.F_QuotedPrice == 0">{{item.F_QuotedPrice}}</p>
							<p v-else>CASE BY CASE</p>
							<p class="feeRemark" v-if="item.F_Remark">备注：{{item.F_Remark}}</p>
						</li>
					</ul>
					<view class="savebox-remark" v-if="dataInfo.ToDesc">
						备注：{{dataInfo.ToDesc}}
					</view>
				</view>
			</view>
			<p 
				style="color: #a4a4a4; font-size: 24rpx; padding: 12rpx 24rpx 24rpx 24rpx; box-sizing: border-box;">
					以上计费结果仅供参考，请联系我公司人员以最终报价为准
			</p>
		</view>
		<!-- <button type="primary" @click="sharePriceImage">生成图片</button> -->
	</view>
</template>

<script>
	import html2canvas from 'html2canvas'
import { nextTick } from "vue"
	export default {
		data() {
			return {
				imageUrl: '',
				priceId: '',
				priceType: '',
				tokenId: '',
				dataInfo: {},
				userInfo: {},
				freightArr: [],
				polArr: [],
				podArr: [],
				dateNumber: '',
				showMask: true
			}
		},

		onLoad(options) {
			this.priceId = options.feeId
			this.priceType = options.Type
			this.tokenId = uni.getStorageSync('loginInfo').F_Token
			
			this.getSaveImageData()
		},

		methods: {
			// 生成图片
			sharePriceImage() {
				let dom = document.querySelector('#shareContent')
				html2canvas(dom, {
					allowTaint: false,
					scale: 2,
					dpi: 300,
					useCORS: true,
				}).then(canvas => {
					let context = canvas.getContext("2d")
					context.mozImageSmoothingEnabled = false;
					context.webkitImageSmoothingEnabled = false;
					context.msImageSmoothingEnabled = false;
					context.imageSmoothingEnabled = false;
					
					let pageData = canvas.toDataURL("image/jpeg", 1.0)
					let img = new Image()
					img.src = pageData
					this.imageUrl = img.src
				})
			},
			
			async getSaveImageData() {
				const {data: res} = await uni.$http.post('Lclquote/getLclImgInfo', {
					QuoteId: this.priceId,
					Type: this.priceType,
					ApiType: 1,
					Authorization: this.tokenId
				})
				if(res.code === 200) {
					this.dataInfo = res.data
					this.userInfo = res.data.Contact
					
					this.freightArr = res.data.freightSurcharge
					this.polArr = res.data.departurePortCharges
					this.podArr = res.data.destinationPorts
				}
				setTimeout(()=> {
					this.sharePriceImage()
					this.showMask = false
				}, 1500)
			}
		}
			
	}
</script>

<style scoped>
	ul li {
		list-style: none;
	}
	
	.container {
		width: 100%;
	}
	
	.pub-mask {
		display: flex;
		position: fixed;
		background: #fff;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		background-size: cover;
		justify-content: center;
		align-items: center;
	}
	
	.pub-mask img {
		display: block;
		width: 400rpx;
		height: 400rpx;
		margin: 0 auto;
	}
	
	.pub-mask-box {
		margin-top: -2rem;
	}
	
	.pub-mask-box text {
		display: block;
		font-size: 30rpx;
		color: #4191df;
		text-align: center;
		margin-top: -80rpx;
	}
	
	.savebox {
		width: 100%;
		/* background: #fff; */
	}
	
	.savebox-top {
		width: 100%;
		height: 420rpx;
		background: #48a1f7;
		overflow: hidden;
	}
	
	.savebox-image {
		display: block;
		text-align: center;
		padding: 24rpx 0 0 0;
	}
	
	.savebox-image-bg {
		/* background: rgba(255, 255, 255, 0.88); */
		width: 300rpx;
		/* height: 100%; */
		margin: 0 auto 50rpx auto;
		border-radius: 8rpx;
	}
	
	.savebox-image .savebox-image-bg img {
		width: 100%;
		-webkit-touch-callout: default;
	}
	
	.savebox-ship {
		width: 94%;
		padding: 12rpx 24rpx;
		background: #4191df;
		color: #fff;
		font-size: 28rpx;
		margin: -20rpx auto 0 auto;
		border-radius: 8rpx;
		box-sizing: border-box;
	}
	
	.savebox-port {
		display: flex;
		align-items: center;
		color: #fff;
		padding: 24rpx 0 0 24rpx;
	}
	
	.savebox-port-item {
		/* display: flex; */
		display: inline-block;
		flex-direction: column;
		margin-right: 24rpx;
	}
	
	.savebox-port-item span {
		display: block;
		font-size: 28rpx;
		font-weight: 500;
	}
	
	.savebox-port-item p {
		font-size: 28rpx;
	}
	
	.savebox-label {
		/* display: flex; */
		margin: 24rpx;
	}
	
	.savebox-label-text {
		display: inline-block;
		background: #4191df;
		padding: 10rpx 16rpx;
		font-size: 28rpx;
		color: #fff;
		border-radius: 4rpx;
		margin-right: 10rpx;
	}
	
	.savebox-info {
		position: relative;
		width: 100%;
		background: #fff;
		padding: 24rpx;
		box-sizing: border-box;
	}
	
	.savebox-info-text {
		margin-bottom: 24rpx;
		font-size: 28rpx;
		color: #555;
	}
	
	.savebox-type {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		background: #48a1f7;
		color: #fff;
		font-size: 28rpx;
		padding: 12rpx 20rpx;
		border-radius: 10rpx;
	}
	
	.savebox-price {
		width: 100%;
	}
	
	.savebox-price {
		margin-top: 16rpx;
	}
	
	.savebox-public {
		padding: 24rpx;
		color: #555;
		font-size: 28rpx;
		border-bottom: 2rpx solid #eee;
	}
	
	.savebox-title {
		font-weight: 600;
	}
	
	.savebox-total {
		color: #f53;
		font-size: 28rpx;
		margin-top: 10rpx;
	}
	
	.savebox-price-item {
		margin-bottom: 16rpx;
		background: #fff;
	}
	
	.savebox-price-item ul {
		padding: 0 24rpx 24rpx 24rpx;
	}
	
	.savebox-price-item ul li {
		padding-top: 24rpx;
		border-bottom: 2rpx solid #eee;
		font-size: 30rpx;
	}
	
	.savebox-price-item ul li .feeRemark {
		color: #909399;
		font-size: 28rpx;
	}
	
	.savebox-price-item ul li span {
		display: block;
		font-size: 28rpx;
		color: #555;
		margin-top: 16rpx;
	}
	
	.savebox-price-item ul li p {
		margin: 10rpx 0 24rpx 0;
		font-size: 28rpx;
		color: #48a1f7;
	}
	
	.savebox-remark {
		padding: 0 24rpx 24rpx 24rpx;
		color: #555;
	}
	
	.savebox-image {
		width: 92%;
		height: 80rpx;
		background: #48a1f7;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		line-height: 80rpx;
		margin: 20rpx auto 60rpx auto;
		border-radius: 12rpx;
	}
</style>